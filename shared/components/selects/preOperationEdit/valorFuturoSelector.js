import React, { useState, useEffect, useRef } from "react";
import { TextField, InputAdornment } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PV } from "@formulajs/formulajs";

export default function ValorFuturoSelector({
  parseFloat,
  

  formatNumberWithThousandsSeparator,

  values,
  setFieldValue,
  errors,
  touched
}) {
  const [inputValue, setInputValue] = useState(
    values.amount && values.amount  !== 0 ? 
      formatNumberWithThousandsSeparator(values.amount ) : "0"
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (!isFocused) {
      const formattedValue = values.amount  !== 0 ? 
        formatNumberWithThousandsSeparator(values.amount ) : "0";
      setInputValue(formattedValue);
    }
  }, [values.amount , formatNumberWithThousandsSeparator, isFocused]);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Si el campo está vacío o solo tiene "0", lo dejamos vacío para que el usuario pueda escribir
    if (value === "0" || value === "") {
      setInputValue("");
      return;
    }
    console.log(value) 
    // Eliminar caracteres no numéricos
    const rawValue = value.replace(/[^\d]/g, "");
    setInputValue(rawValue);
    console.log(rawValue)
  };
  

  const processValue = () => {
    let rawValue = inputValue;
    
    // Si el campo está vacío, lo consideramos como 0
    if (inputValue === "") {
      rawValue = "0";
    }
    console.log(rawValue) 
    let amountManual = rawValue || 0;
    console.log(amountManual) 
    console.log(values.saldoDisponibleInfo)
    if (amountManual > values.saldoDisponibleInfo) {
      amountManual = values.saldoDisponibleInfo;
    }

    // --- Aquí comienza tu lógica original exactamente igual ---
    const saldoDisponibleActual = values.saldoDisponible || 0;

      console.log(amountManual,values.amount )   

    const diferenciaamount = amountManual - (values.amount || 0);
    console.log(diferenciaamount)
    const payedAmount = Number(amountManual * (values.payedPercent || 0)/100);
    console.log(payedAmount)
    setFieldValue(`amount`, amountManual);
    setFieldValue(`amountManual`, true);
    setFieldValue(`payedAmount`, payedAmount);
   
    
    const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaamount || 0;
    setFieldValue(`saldoDisponible`, nuevoSaldoDisponible);


    if (values.opDate) {
      const operationDays = values.operationDays;
      const presentValueInvestor = operationDays > 0 && payedAmount > 0
        ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, payedAmount, 0) * -1)
        : amountManual;

      const nuevoInvestorProfit = payedAmount - presentValueInvestor;
      setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
      setFieldValue(`montoDisponibleCuenta`, values.montoDisponibleInfo - presentValueInvestor, 0);

   
      const presentValueSF = operationDays > 0 && payedAmount > 0
        ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, payedAmount, 0) * -1)
        : amountManual;

      setFieldValue(`presentValueInvestor`, presentValueInvestor);
      setFieldValue(`presentValueSF`, presentValueSF || 0);
      setFieldValue(`commissionSF`, presentValueInvestor - presentValueSF || 0);

      if (values.applyGm) {
        setFieldValue(`GM`, presentValueInvestor * 0.002);
      } else {
        setFieldValue(`GM`, 0);
      }

    
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
    console.log(rawValue)
    const amountManual = parseFloat(rawValue.replace(/[^\d]/g, "")) || 0;
    setInputValue(amountManual === 0 ? "0" : formatNumberWithThousandsSeparator(amountManual));
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
      data-testid="campo-amount"
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
       values.saldoDisponible && values.billFraction 
          ? formatNumberWithThousandsSeparator(Math.floor((values.saldoDisponible || 0) / (values.billFraction || 1))) 
          : ""
      }`}
      helperText={
        !values.amountManual
          ? `Sugerido: ${
              values.saldoDisponible && values.billFraction 
                ? formatNumberWithThousandsSeparator(Math.floor((values.saldoDisponible || 0) / (values.billFraction || 1))) 
                : ""
            }`
          : "Valor ingresado manualmente"
      }
      error={touched.amount && Boolean(errors.amount)}
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