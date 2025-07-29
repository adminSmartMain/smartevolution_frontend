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
  console.log('--- RENDER ---');
  console.log('Valores actuales:', {
    amount: values.amount,
    amountInitial: values.amountInitial,
    currentBalanceActual: values.currentBalanceActual,
    saldoDisponibleInfo: values.saldoDisponibleInfo,
    bill_total: values.bill_total,
    valorFuturoManual: values.valorFuturoManual
  });

  const [inputValue, setInputValue] = useState(
    values.amount && values.amount !== 0 ? 
      formatNumberWithThousandsSeparator(values.amount) : "0"
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('useEffect - Sincronizando con valor externo');
    console.log('isFocused:', isFocused, 'values.amount:', values.amount);
    
    if (!isFocused) {
      const formattedValue = values.amount !== 0 ? 
        formatNumberWithThousandsSeparator(values.amount) : "0";
      console.log('Actualizando inputValue a:', formattedValue);
      setInputValue(formattedValue);
    }
  }, [values.amount, formatNumberWithThousandsSeparator, isFocused]);

  const handleChange = (e) => {
    let value = e.target.value;
    console.log('handleChange - Valor ingresado:', value);
    
    if (value === "0" || value === "") {
      console.log('Campo vacío o cero, estableciendo inputValue vacío');
      setInputValue("");
      return;
    }
    
    const rawValue = value.replace(/[^\d]/g, "");
    console.log('Valor limpio (solo dígitos):', rawValue);
    setInputValue(rawValue);
  };

  const processValue = () => {
    console.log('--- INICIO processValue ---');
    let rawValue = inputValue;
    
    if (inputValue === "") {
      console.log('Campo vacío, estableciendo rawValue a "0"');
      rawValue = "0";
    }
    
    console.log('rawValue:', rawValue);
    let valorFuturoManual = parseFloat(rawValue) || 0;
    console.log('valorFuturoManual (parseado):', valorFuturoManual);
   
    const saldoDisponibleActual = values.saldoDisponibleInfo || 0;
    console.log('saldoDisponibleActual:', saldoDisponibleActual);

    const valorNominal = valorFuturoManual * (values.payedPercent || 0)/100;
    console.log('valorNominal calculado:', valorNominal);
        
    const nuevoSaldoDisponible = saldoDisponibleActual - valorFuturoManual || 0;
    console.log('nuevoSaldoDisponible calculado:', nuevoSaldoDisponible);

    if(values.currentBalanceActual == 0){
      console.log('Caso: currentBalanceActual es 0');
      console.log('Comparando values.amount', values.amount, 'vs valorFuturoManual', valorFuturoManual);
      
       if(valorFuturoManual <= values.bill_total) {
    console.log('Subcaso 1: valorFuturoManual <= bill_total');
    const nuevoSaldo = Number(values.saldoDisponibleInfo) + Number(values.amount) - Number(valorFuturoManual);
    console.log('Calculando nuevo saldo:', nuevoSaldo);
    
    setFieldValue(`saldoDisponible`, nuevoSaldo);
    setFieldValue(`saldoDisponibleInfo`, nuevoSaldo);
    setFieldValue(`amount`, valorFuturoManual);    
             
        setFieldValue(`valorNominal`, valorNominal.toFixed(0));
        setFieldValue(`payedAmount`, valorNominal.toFixed(0));
        setFieldValue(`valorFuturoManual`, true);
        
        if (values.opDate) {
          console.log('Calculando valores financieros con opDate');
          const operationDays = values.operationDays;
          const presentValueInvestor = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          const nuevoInvestorProfit = valorNominal - presentValueInvestor;
          console.log('presentValueInvestor:', presentValueInvestor, 'nuevoInvestorProfit:', nuevoInvestorProfit);
          
          setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
          setFieldValue(`montoDisponibleCuenta`, Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor - presentValueInvestor)-Number(values.GM - presentValueInvestor * 0.002), 0);

          const presentValueSF = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          setFieldValue(`presentValueInvestor`, presentValueInvestor);
          setFieldValue(`presentValueSF`, presentValueSF || 0);
          setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

          if (values.applyGm) {
            const gm = presentValueInvestor * 0.002;
            console.log('Calculando GM:', gm);
            setFieldValue(`GM`, gm);
          } else {
            setFieldValue(`GM`, 0);
          }
        }
      } else if(valorFuturoManual > values.bill_total){
        console.log('Subcaso 2: valorFuturoManual > bill_total');
        console.log('Limitando a bill_total:', values.bill_total);
        
        setFieldValue(`saldoDisponible`, 0);
        setFieldValue(`saldoDisponibleInfo`, 0);
        setFieldValue(`amount`, values.amountInitial);  
        
        const valorNominal = values.bill_total * (values.payedPercent || 0)/100;           
        setFieldValue(`valorNominal`, valorNominal.toFixed(0));
        setFieldValue(`payedAmount`, valorNominal.toFixed(0));
        setFieldValue(`valorFuturoManual`, true);
      }
    }
    else if (values.currentBalanceActual != 0){
      console.log('Caso: currentBalanceActual no es 0');
      console.log('amountInitial:', values.amountInitial, 'valorFuturoManual:', valorFuturoManual);
      
      if(values.amountInitial == valorFuturoManual){
        console.log('Subcaso 1: amountInitial == valorFuturoManual');
        
        setFieldValue(`saldoDisponible`, Number(values.currentBalanceActual).toFixed(0));
        setFieldValue(`saldoDisponibleInfo`, Number(values.currentBalanceActual).toFixed(0));
        setFieldValue(`amount`, valorFuturoManual); 
            
        setFieldValue(`valorNominal`, valorNominal.toFixed(0));
        setFieldValue(`payedAmount`, valorNominal.toFixed(0));
        setFieldValue(`valorFuturoManual`, true);
        
        if (values.opDate) {
          console.log('Calculando valores financieros con opDate');
          const operationDays = values.operationDays;
          const presentValueInvestor = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          const nuevoInvestorProfit = valorNominal - presentValueInvestor;
          console.log('presentValueInvestor:', presentValueInvestor, 'nuevoInvestorProfit:', nuevoInvestorProfit);
          
          setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
          setFieldValue(`montoDisponibleCuenta`, values.montoDisponibleInfo - (presentValueInvestor), 0);

          const presentValueSF = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          setFieldValue(`presentValueInvestor`, presentValueInvestor);
          setFieldValue(`presentValueSF`, presentValueSF || 0);
          setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

          if (values.applyGm) {
            const gm = presentValueInvestor * 0.002;
            console.log('Calculando gastoMantenimiento:', gm);
            setFieldValue(`gastoMantenimiento`, gm);
          } else {
            setFieldValue(`gastoMantenimiento`, 0);
          }
        }
      }
      else if(values.amountInitial > valorFuturoManual){
        console.log('Subcaso 2: amountInitial > valorFuturoManual');
        const nuevoSaldo = Number(values.currentBalanceActual) + (Number(values.amountInitial)-Number(valorFuturoManual));
        console.log('Calculando nuevo saldo:', nuevoSaldo);
        
        setFieldValue(`saldoDisponible`, nuevoSaldo.toFixed(0));
        setFieldValue(`saldoDisponibleInfo`, Number(values.currentBalanceActual).toFixed(0));
        setFieldValue(`amount`, valorFuturoManual);  
            
        setFieldValue(`valorNominal`, valorNominal.toFixed(0));
        setFieldValue(`payedAmount`, valorNominal.toFixed(0));
        setFieldValue(`valorFuturoManual`, true);
        
        if (values.opDate) {
          console.log('Calculando valores financieros con opDate');
          const operationDays = values.operationDays;
          const presentValueInvestor = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          const nuevoInvestorProfit = valorNominal - presentValueInvestor;
          console.log('presentValueInvestor:', presentValueInvestor, 'nuevoInvestorProfit:', nuevoInvestorProfit);
          
          setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
          setFieldValue(`montoDisponibleCuenta`, Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor - presentValueInvestor)-Number(values.GM - presentValueInvestor * 0.002), 0);

          const presentValueSF = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
            : valorFuturoManual;

          setFieldValue(`presentValueInvestor`, presentValueInvestor);
          setFieldValue(`presentValueSF`, presentValueSF || 0);
          setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

          if (values.applyGm) {
            const gm = presentValueInvestor * 0.002;
            console.log('Calculando GM:', gm);
            setFieldValue(`GM`, gm);
          } else {
            setFieldValue(`GM`, 0);
          }
        }
      } 
      else if (values.amountInitial < valorFuturoManual){
        console.log('Subcaso 3: amountInitial < valorFuturoManual');
        console.log('Comparando currentBalanceActual', values.currentBalanceActual, 'vs valorFuturoManual', valorFuturoManual);
        
        if(values.currentBalanceActual < valorFuturoManual){
          console.log('Sub-subcaso: currentBalanceActual < valorFuturoManual');
          console.log('Limitando a currentBalanceActual:', values.currentBalanceActual);
          
          setFieldValue(`saldoDisponible`, 0);
          setFieldValue(`saldoDisponibleInfo`, values.currentBalanceActual);
          setFieldValue(`amount`, values.currentBalanceActual);  
              
          setFieldValue(`valorNominal`, values.currentBalanceActual.toFixed(0));
          setFieldValue(`payedAmount`, values.currentBalanceActual.toFixed(0));
          setFieldValue(`valorFuturoManual`, true);
          
          if (values.opDate) {
            console.log('Calculando valores financieros con opDate');
            const operationDays = values.operationDays;
            const presentValueInvestor = operationDays > 0 && values.currentBalanceActual > 0
              ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, values.currentBalanceActual, 0) * -1)
              : valorFuturoManual;

            const nuevoInvestorProfit = values.currentBalanceActual - presentValueInvestor;
            console.log('presentValueInvestor:', presentValueInvestor, 'nuevoInvestorProfit:', nuevoInvestorProfit);
            
            setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
            setFieldValue(`montoDisponibleCuenta`, Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor - presentValueInvestor)-Number(values.GM - presentValueInvestor * 0.002), 0);

            const presentValueSF = operationDays > 0 && values.currentBalanceActual > 0
              ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, values.currentBalanceActual, 0) * -1)
              : valorFuturoManual;

            setFieldValue(`presentValueInvestor`, presentValueInvestor);
            setFieldValue(`presentValueSF`, presentValueSF || 0);
            setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

            if (values.applyGm) {
              const gm = presentValueInvestor * 0.002;
              console.log('Calculando GM:', gm);
              setFieldValue(`GM`, gm);
            } else {
              setFieldValue(`GM`, 0);
            }
          }
        } else {
    console.log('Subcaso 2: valorFuturoManual > bill_total - Limitando a bill_total');
    setFieldValue(`saldoDisponible`, 0);
    setFieldValue(`saldoDisponibleInfo`, 0);
    setFieldValue(`amount`, values.bill_total);  
    
    const valorNominal = values.bill_total * (values.payedPercent || 0)/100;           
    setFieldValue(`valorNominal`, valorNominal.toFixed(0));
    setFieldValue(`payedAmount`, valorNominal.toFixed(0));
    setFieldValue(`valorFuturoManual`, true);
          
          if (values.opDate) {
            console.log('Calculando valores financieros con opDate');
            const operationDays = values.operationDays;
            const presentValueInvestor = operationDays > 0 && valorNominal > 0
              ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
              : valorFuturoManual;

            const nuevoInvestorProfit = valorNominal - presentValueInvestor;
            console.log('presentValueInvestor:', presentValueInvestor, 'nuevoInvestorProfit:', nuevoInvestorProfit);
            
            setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
            setFieldValue(`montoDisponibleCuenta`, Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor - presentValueInvestor)-Number(values.GM - presentValueInvestor * 0.002), 0);

            const presentValueSF = operationDays > 0 && valorNominal > 0
              ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
              : valorFuturoManual;

            setFieldValue(`presentValueInvestor`, presentValueInvestor);
            setFieldValue(`presentValueSF`, presentValueSF || 0);
            setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

            if (values.applyGm) {
              const gm = presentValueInvestor * 0.002;
              console.log('Calculando GM:', gm);
              setFieldValue(`GM`, gm);
            } else {
              setFieldValue(`GM`, 0);
            }
          }
        }
      }
    }
    console.log('--- FIN processValue ---');
  };

  const handleBlur = () => {
    console.log('handleBlur - Perdiendo foco');
    setIsFocused(false);
    processValue();
    
    let rawValue = inputValue;
    
    if (inputValue === "") {
      console.log('Campo vacío, estableciendo rawValue a "0"');
      rawValue = "0";
    }
    
    const valorFuturoManual = parseFloat(rawValue.replace(/[^\d]/g, "")) || 0;
    const formattedValue = valorFuturoManual === 0 ? "0" : formatNumberWithThousandsSeparator(valorFuturoManual);
    console.log('Formateando valor para mostrar:', formattedValue);
    setInputValue(formattedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter presionado, procesando valor');
      processValue();
      e.target.blur();
    }
  };

  const handleFocus = (e) => {
    console.log('handleFocus - Ganando foco');
    setIsFocused(true);
    
    if (inputValue === "0") {
      console.log('Valor es "0", estableciendo inputValue vacío');
      setInputValue("");
    } else {
      const rawValue = inputValue.replace(/[^\d]/g, "");
      console.log('Mostrando valor sin formato:', rawValue);
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
        values.saldoDisponible && values.billFraction
          ? formatNumberWithThousandsSeparator(Math.floor((values.saldoDisponible || 0) / (values.billFraction || 1))) 
          : ""
      }`}
      helperText={
        !values.valorFuturoManual
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