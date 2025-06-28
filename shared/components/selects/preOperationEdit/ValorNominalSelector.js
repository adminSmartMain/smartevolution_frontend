import React, { useState, useEffect } from "react";
import { InputAdornment, TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PV } from "@formulajs/formulajs";


export default function payedAmountSelector({calcularPorcentajeDescuento ,setFieldValue, values, errors, touched,formatNumberWithThousandsSeparator}) {
const [inputValue, setInputValue] = useState(
    values.payedAmount !== undefined && values.payedAmount !== 0 ? 
      formatNumberWithThousandsSeparator(values.payedAmount) : ""
  );
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (!isFocused) {
      const formattedValue = values.payedAmount !== undefined && values.payedAmount !== 0 ? 
        formatNumberWithThousandsSeparator(values.payedAmount) : "";
      setInputValue(formattedValue);
    }
  }, [values.payedAmount, formatNumberWithThousandsSeparator, isFocused]);

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
    
    let nuevopayedAmount = parseFloat(rawValue) || 0;
    const valorFuturo = values.amount || 0;

    // Validar máximo valor
    if (nuevopayedAmount > valorFuturo) {
      nuevopayedAmount = valorFuturo;
    }

    // --- Aquí comienza tu lógica original ---
    // Actualizar valor nominal
    setFieldValue(`payedAmount`, nuevopayedAmount);
    
    setFieldValue(`payedAmountManual`, true);

    // Cálculo de investorProfit
    const presentValueInvestor = values.presentValueSF || 0;
    const nuevoInvestorProfit = nuevopayedAmount - presentValueInvestor;
    setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));

    // Cálculo porcentaje descuento
    const nuevopayedPercent = calcularPorcentajeDescuento(valorFuturo, nuevopayedAmount);
    setFieldValue(`payedPercent`, nuevopayedPercent);

    // Recalcular valores si hay fecha de operación
    if (values.opDate) {
      const operationDays = values.operationDays;

      // Cálculo de presentValueInvestor y presentValueSF
      const newPresentValueInvestor = operationDays > 0 && nuevopayedAmount > 0
        ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -nuevopayedAmount, 0))
        : nuevopayedAmount;

      const newPresentValueSF = operationDays > 0 && nuevopayedAmount > 0
        ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, -nuevopayedAmount, 0))
        : nuevopayedAmount;

      // Actualizar valores calculados
      setFieldValue(`presentValueInvestor`, newPresentValueInvestor);
      if(values.applyGm) {
        setFieldValue(`gastoMantenimiento`, newPresentValueInvestor * 0.002);
      } else {
        setFieldValue(`gastoMantenimiento`, 0);
      } 
      setFieldValue(`presentValueSF`, newPresentValueSF);
      setFieldValue(`comisionSF`, newPresentValueInvestor-newPresentValueSF || 0);
      setFieldValue(`investorProfit`, Number(nuevopayedAmount -  newPresentValueInvestor).toFixed(0));
      
  
        // Caso sin inversionista: cálculo individual
        const montoIndividual = values.montoDisponibleInfo - newPresentValueInvestor - 
          (values.applyGm ? newPresentValueInvestor * 0.002 : 0);
        setFieldValue(`montoDisponibleCuenta`, montoIndividual);
     
    }
    // --- Aquí termina tu lógica original ---
  };

  const handleBlur = () => {
    setIsFocused(false);
    processValue();
    
    // Formatear el valor para mostrarlo con separadores de miles
    let rawValue = inputValue === "" ? "0" : inputValue;
    const payedAmount = parseFloat(rawValue) || 0;
    setInputValue(payedAmount === 0 ? "" : formatNumberWithThousandsSeparator(payedAmount));
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
      name="payedAmount"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder={
        values.payedAmount && values.payedPercent !== undefined ? 
          formatNumberWithThousandsSeparator(
            Math.floor(values.payedAmount * (1 - (values.payedPercent / 100))))
          : 0
      }
      helperText={
        !values.payedAmountManual
          ? values.payedAmount && values.payedPercent !== undefined ? 
              `Sugerido: ${formatNumberWithThousandsSeparator(
                Math.floor(values.payedAmount * (1 - (values.payedPercent / 100))))}`
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
      error={touched.valuess?.[index]?.payedAmount && Boolean(errors.valuess?.[index]?.payedAmount)}
    />
    </>
)


}