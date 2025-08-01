import React, { useState, useEffect, useRef } from "react";
import { TextField, InputAdornment } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PV } from "@formulajs/formulajs";

export default function ValorFuturoSelector({
  parseFloat,
  index,
  factura,
  formatNumberWithThousandsSeparator,
  dataBills,
  values,
  setFieldValue,
  errors,
  touched
}) {
  const [inputValue, setInputValue] = useState(
    factura.valorFuturo && factura.valorFuturo !== 0 ? 
      formatNumberWithThousandsSeparator(factura.valorFuturo) : "0"
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (!isFocused) {
      const formattedValue = factura.valorFuturo !== 0 ? 
        formatNumberWithThousandsSeparator(factura.valorFuturo) : "0";
      setInputValue(formattedValue);
    }
  }, [factura.valorFuturo, formatNumberWithThousandsSeparator, isFocused]);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Si el campo está vacío o solo tiene "0", lo dejamos vacío para que el usuario pueda escribir
    if (value === "0" || value === "") {
      setInputValue("");
      return;
    }
    
    // Eliminar caracteres no numéricos
    const rawValue = value.replace(/[^\d]/g, "");
    setInputValue(rawValue);
  };

  const processValue = () => {
    let rawValue = inputValue;
    
    // Si el campo está vacío, lo consideramos como 0
    if (inputValue === "") {
      rawValue = "0";
    }
    
    let valorFuturoManual = parseFloat(rawValue) || 0;

    if (valorFuturoManual > factura.saldoDisponibleInfo) {
      valorFuturoManual = factura.saldoDisponibleInfo;
    }

    // --- Aquí comienza tu lógica original exactamente igual ---
    const saldoDisponibleActual = factura.saldoDisponible || 0;
    const saldoDisponibleTotal = dataBills?.data.find((f) => f.billId === factura.factura)?.currentBalance || 0;

    const valorFuturoTotal = values.facturas
      .filter((f) => f.factura === factura.factura)
      .reduce((sum, f) => sum + (f.valorFuturo || 0), 0);

    const diferenciaValorFuturo = valorFuturoManual - (factura.valorFuturo || 0);

    const valorNominal = valorFuturoManual * (factura.porcentajeDescuento || 0)/100;

    setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
    setFieldValue(`facturas[${index}].valorFuturoManual`, true);
    setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
    setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
    
    const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo || 0;
    setFieldValue(`facturas[${index}].saldoDisponible`, nuevoSaldoDisponible);

    values.facturas.forEach((f, i) => {
      if (f.billId === factura.billId && i !== index) {
        const saldoActual = f.saldoDisponible || 0;
        const diferencia = diferenciaValorFuturo || 0;
        const nuevoSaldo = saldoActual - diferencia;
        const saldoFinal = nuevoSaldo;
        
        if (saldoActual !== saldoFinal) {
          setFieldValue(`facturas[${i}].saldoDisponible`, saldoFinal);
        }
      }
    });

    if (values.opDate) {
      const operationDays = factura.operationDays;
      const presentValueInvestor = operationDays > 0 && valorNominal > 0
        ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
        : valorFuturoManual;

      const nuevoInvestorProfit = valorNominal - presentValueInvestor;
      setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
      setFieldValue(`facturas[${index}].montoDisponibleCuenta`, factura.montoDisponibleInfo - presentValueInvestor, 0);

      const presentValueInvesTotal = values.facturas
        .filter((f, i) => 
          f.idCuentaInversionista === factura.idCuentaInversionista && 
          i !== index
        )
        .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
        + presentValueInvestor;

      const presentValueSF = operationDays > 0 && valorNominal > 0
        ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
        : valorFuturoManual;

      setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor);
      setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0);
      setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - presentValueSF || 0);

      if (values.facturas[index].applyGm) {
        setFieldValue(`facturas[${index}].gastoMantenimiento`, (presentValueInvestor * 0.002).toFixed(0));
      } else {
        setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);
      }

      values.facturas.forEach((f, i) => {
        if (f.idCuentaInversionista === factura.idCuentaInversionista && f.idCuentaInversionista) {
          const montoDisponibleActualizado = f.montoDisponibleInfo - presentValueInvesTotal;
          setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleActualizado, 0);
        }
      });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    processValue();
    
    // Formatear el valor para mostrarlo con separadores de miles
    let rawValue = inputValue;
    
    // Si el campo está vacío, lo consideramos como 0
    if (inputValue === "") {
      rawValue = "0";
    }
    
    const valorFuturoManual = parseFloat(rawValue.replace(/[^\d]/g, "")) || 0;
    setInputValue(valorFuturoManual === 0 ? "0" : formatNumberWithThousandsSeparator(valorFuturoManual));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processValue();
      e.target.blur();
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    // Mostrar el valor sin formato al enfocar, excepto si es 0
    if (inputValue === "0") {
      setInputValue("");
    } else {
      const rawValue = inputValue.replace(/[^\d]/g, "");
      setInputValue(rawValue);
    }
  };

  return (
    <TextField
      id="amountname"
      data-testid="campo-valorFuturo"
      label="Valor Futuro"
      fullWidth
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      placeholder={`Sugerido: ${
        factura.saldoDisponible && factura.fraccion 
          ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) 
          : ""
      }`}
      helperText={
        !factura.valorFuturoManual
          ? `Sugerido: ${
              factura.saldoDisponible && factura.fraccion 
                ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) 
                : ""
            }`
          : "Valor ingresado manualmente"
      }
      error={touched.facturas?.[index]?.valorFuturo && Boolean(errors.facturas?.[index]?.valorFuturo)}
      InputProps={{
        min: 0,
        maxLength: 22,
        startAdornment: (
          <InputAdornment position="start">
            <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
          </InputAdornment>
        ),
      }}
    />
  );
}