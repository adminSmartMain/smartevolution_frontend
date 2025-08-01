import React, { useState, useEffect } from "react";
import { InputAdornment, TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PV } from "@formulajs/formulajs";


export default function ValorNominalSelector({calcularPorcentajeDescuento,factura, index, setFieldValue, values, errors, touched,formatNumberWithThousandsSeparator}) {
const [inputValue, setInputValue] = useState(
    factura.valorNominal !== undefined && factura.valorNominal !== 0 ? 
      formatNumberWithThousandsSeparator(factura.valorNominal) : ""
  );
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (!isFocused) {
      const formattedValue = factura.valorNominal !== undefined && factura.valorNominal !== 0 ? 
        formatNumberWithThousandsSeparator(factura.valorNominal) : "";
      setInputValue(formattedValue);
    }
  }, [factura.valorNominal, formatNumberWithThousandsSeparator, isFocused]);

  const handleChange = (e) => {
    // Permitir campo vacío durante la edición
    if (e.target.value === "") {
      setInputValue("");
      return;
    }
    
    // Solo permitir números
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setInputValue(rawValue);
  };

  const processValue = () => {
    let rawValue = inputValue;
    
    // Si el campo está vacío, considerar como 0
    if (inputValue === "") {
      rawValue = 0;
    }
    
    let nuevoValorNominal = parseFloat(rawValue) || 0;
    const valorFuturo = factura.valorFuturo || 0;

    // Validar máximo valor
    if (nuevoValorNominal > valorFuturo) {
      nuevoValorNominal = valorFuturo;
    }

    // --- Aquí comienza tu lógica original ---
    // Actualizar valor nominal
    setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
    setFieldValue(`facturas[${index}].payedAmount`, nuevoValorNominal);
    setFieldValue(`facturas[${index}].valorNominalManual`, true);

    // Cálculo de investorProfit
    const presentValueInvestor = factura.presentValueSF || 0;
    const nuevoInvestorProfit = nuevoValorNominal - presentValueInvestor;
    setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoInvestorProfit).toFixed(0));

    // Cálculo porcentaje descuento
    const nuevoPorcentajeDescuento = calcularPorcentajeDescuento(valorFuturo, nuevoValorNominal);
    setFieldValue(`facturas[${index}].porcentajeDescuento`, nuevoPorcentajeDescuento);

    // Recalcular valores si hay fecha de operación
    if (values.opDate) {
      const operationDays = factura.operationDays;

      // Cálculo de presentValueInvestor y presentValueSF
      const newPresentValueInvestor = operationDays > 0 && nuevoValorNominal > 0
        ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0))
        : nuevoValorNominal;

      const newPresentValueSF = operationDays > 0 && nuevoValorNominal > 0
        ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0))
        : nuevoValorNominal;

      // Actualizar valores calculados
      setFieldValue(`facturas[${index}].presentValueInvestor`, newPresentValueInvestor);
      if(values.facturas[index].applyGm) {
        setFieldValue(`facturas[${index}].gastoMantenimiento`, newPresentValueInvestor * 0.002);
      } else {
        setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);
      } 
      setFieldValue(`facturas[${index}].presentValueSF`, newPresentValueSF);
      setFieldValue(`facturas[${index}].comisionSF`, newPresentValueInvestor-newPresentValueSF || 0);
      setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoValorNominal -  newPresentValueInvestor).toFixed(0));
      
      // Lógica para montoDisponibleCuenta compartido entre facturas con mismo inversionista
      if (factura.idCuentaInversionista) {
        // 1. Obtener todas las facturas con mismo inversionista (incluyendo la actual)
        const facturasMismoInversionista = values.facturas
          .map((f, i) => i === index ? {
            ...f,
            presentValueInvestor: newPresentValueInvestor,
            gastoMantenimiento: values.facturas[index].applyGm ? (newPresentValueInvestor * 0.002).toFixed(0) : 0
          } : f)
          .filter(f => f.idCuentaInversionista === factura.idCuentaInversionista);

        // 2. Calcular total de presentValueInvestor y gastoMantenimiento
        const totalPV = facturasMismoInversionista.reduce((sum, f) => sum + f.presentValueInvestor, 0);
        const totalGM = facturasMismoInversionista.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);

        // 3. Calcular monto disponible común
        const montoDisponibleComun = factura.montoDisponibleInfo - totalPV - totalGM;

        // 4. Actualizar todas las facturas con mismo inversionista
        values.facturas.forEach((f, i) => {
          if (f.idCuentaInversionista === factura.idCuentaInversionista) {
            setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleComun);
          }
        });
      } else {
        // Caso sin inversionista: cálculo individual
        const montoIndividual = factura.montoDisponibleInfo - newPresentValueInvestor - 
          (values.facturas[index].applyGm ? newPresentValueInvestor * 0.002 : 0);
        setFieldValue(`facturas[${index}].montoDisponibleCuenta`, montoIndividual);
      }
    }
    // --- Aquí termina tu lógica original ---
  };

  const handleBlur = () => {
    setIsFocused(false);
    processValue();
    
    // Formatear el valor para mostrarlo con separadores de miles
    let rawValue = inputValue === "" ? "0" : inputValue;
    const valorNominal = parseFloat(rawValue) || 0;
    setInputValue(valorNominal === 0 ? "" : formatNumberWithThousandsSeparator(valorNominal));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processValue();
      e.target.blur(); // Opcional: quitar el foco después de Enter
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Mostrar el valor sin formato al enfocar
    if (inputValue === "") {
      setInputValue("");
    } else {
      const rawValue = inputValue.replace(/[^\d]/g, "");
      setInputValue(rawValue);
    }
  };

return(
    <>
      <TextField
      id="payedAmountname"
      data-testid="campo-payedAmount"
      label="Valor Nominal"
      fullWidth
      name="valorNominal"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder={
        factura.valorFuturo && factura.porcentajeDescuento !== undefined ? 
          formatNumberWithThousandsSeparator(
            Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100))))
          : 0
      }
      helperText={
        !factura.valorNominalManual
          ? factura.valorFuturo && factura.porcentajeDescuento !== undefined ? 
              `Sugerido: ${formatNumberWithThousandsSeparator(
                Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100))))}`
              : ""
          : "Valor ingresado manualmente"
      }
      InputProps={{
        inputProps: {
          maxLength: 22,
        },
        startAdornment: (
          <InputAdornment position="start">
            <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
          </InputAdornment>
        ),
      }}
      error={touched.facturas?.[index]?.valorNominal && Boolean(errors.facturas?.[index]?.valorNominal)}
    />
    </>
)


}