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
    values.amount &&  values.amount !== 0 ? 
      formatNumberWithThousandsSeparator( values.amount) : "0"
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Sincronizar con el valor externo cuando cambie
  useEffect(() => {
    if (!isFocused) {
      const formattedValue =  values.amount !== 0 ? 
        formatNumberWithThousandsSeparator( values.amount) : "0";
      setInputValue(formattedValue);
    }
  }, [ values.amount, formatNumberWithThousandsSeparator, isFocused]);

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
    console.log(rawValue)
    let valorFuturoManual = parseFloat(rawValue) || 0;
    console.log(valorFuturoManual)
   

    // --- Aquí comienza tu lógica original exactamente igual ---
    const saldoDisponibleActual =values.saldoDisponibleInfo || 0;


    const diferenciaValorFuturo = valorFuturoManual 
    console.log(diferenciaValorFuturo,valorFuturoManual)

    const valorNominal = valorFuturoManual * (values.payedPercent || 0)/100;
    console.log(values.amount,diferenciaValorFuturo)
        
    const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo || 0;
   
    console.log(values.saldoDisponibleInfo,valorFuturoManual)

    if(values.currentBalanceActual==0){
      console.log(values.amountInitial)
      if(values.amount>valorFuturoManual){
        console.log('eeee')
        setFieldValue(`saldoDisponible`, Number(values.saldoDisponibleInfo) +  Number(values.amount) -Number(valorFuturoManual));
        setFieldValue(`saldoDisponibleInfo`, Number(values.saldoDisponibleInfo)+  Number(values.amount) -Number(valorFuturoManual));
         setFieldValue(`amount`, valorFuturoManual);  
             
    setFieldValue(`valorNominal`, valorNominal.toFixed(0));
    setFieldValue(`payedAmount`, valorNominal.toFixed(0));
    setFieldValue(`valorFuturoManual`, true);
    if (values.opDate) {
      const operationDays = values.operationDays;
      const presentValueInvestor = operationDays > 0 && valorNominal > 0
        ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
        : valorFuturoManual;

      const nuevoInvestorProfit = valorNominal - presentValueInvestor;
      console.log(Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor -presentValueInvestor))
      setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
      setFieldValue(`montoDisponibleCuenta`, Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor -presentValueInvestor)-Number(values.GM -presentValueInvestor * 0.002), 0);


      const presentValueSF = operationDays > 0 && valorNominal > 0
        ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
        : valorFuturoManual;

      setFieldValue(`presentValueInvestor`, presentValueInvestor);
      setFieldValue(`presentValueSF`, presentValueSF || 0);
      setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

      if (values.applyGm) {
        setFieldValue(`GM`, presentValueInvestor * 0.002);
      } else {
        setFieldValue(`GM`, 0);
      }

      
    }

  
       }else if(valorFuturoManual>values.bill_total){
 console.log('ffffff')
        setFieldValue(`saldoDisponible`, 0);
        setFieldValue(`saldoDisponibleInfo`, 0);
         setFieldValue(`amount`, values.amountInitial);  
     const valorNominal =values.bill_total * (values.payedPercent || 0)/100;           
    setFieldValue(`valorNominal`, valorNominal.toFixed(0));
    setFieldValue(`payedAmount`, valorNominal.toFixed(0));
    setFieldValue(`valorFuturoManual`, true);
       

       }
       
      

    }
    else if (values.currentBalanceActual!=0){
      console.log('0sdsdadas')
      console.log(values.amountInitial,valorFuturoManual)
        if(values.amountInitial==valorFuturoManual){
              console.log(values.currentBalanceActual,'00')
              setFieldValue(`saldoDisponible`, Number(values.currentBalanceActual).toFixed(0));
              setFieldValue(`saldoDisponibleInfo`, Number(values.currentBalanceActual).toFixed(0));
              setFieldValue(`amount`, valorFuturoManual); 
                  
              setFieldValue(`valorNominal`, valorNominal.toFixed(0));
              setFieldValue(`payedAmount`, valorNominal.toFixed(0));
              setFieldValue(`valorFuturoManual`, true);
            if (values.opDate) {
                const operationDays = values.operationDays;
                const presentValueInvestor = operationDays > 0 && valorNominal > 0
                  ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                  : valorFuturoManual;

                const nuevoInvestorProfit = valorNominal - presentValueInvestor;
                setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
                setFieldValue(`montoDisponibleCuenta`, values.montoDisponibleInfo - (presentValueInvestor), 0);


                const presentValueSF = operationDays > 0 && valorNominal > 0
                  ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                  : valorFuturoManual;

                setFieldValue(`presentValueInvestor`, presentValueInvestor);
                setFieldValue(`presentValueSF`, presentValueSF || 0);
                setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

                if (values.applyGm) {
                  setFieldValue(`gastoMantenimiento`, presentValueInvestor * 0.002);
                } else {
                  setFieldValue(`gastoMantenimiento`, 0);
                }

                
              }}
                  else if(values.amountInitial>valorFuturoManual){
                    console.log(values.currentBalanceActual,'11111sdasdsada')
                  setFieldValue(`saldoDisponible`,(Number(values.currentBalanceActual) + (Number(values.amountInitial)-Number(valorFuturoManual))).toFixed(0) );
                  setFieldValue(`saldoDisponibleInfo`, Number(values.currentBalanceActual).toFixed(0));
                  setFieldValue(`amount`, valorFuturoManual);  
                      
                  setFieldValue(`valorNominal`, valorNominal.toFixed(0));
                  setFieldValue(`payedAmount`, valorNominal.toFixed(0));
                  setFieldValue(`valorFuturoManual`, true);
                if (values.opDate) {
                    const operationDays = values.operationDays;
                    const presentValueInvestor = operationDays > 0 && valorNominal > 0
                      ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                      : valorFuturoManual;

                    const nuevoInvestorProfit = valorNominal - presentValueInvestor;
                    setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
                    setFieldValue(`montoDisponibleCuenta`,  Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor -presentValueInvestor)-Number(values.GM -presentValueInvestor * 0.002), 0);


                    const presentValueSF = operationDays > 0 && valorNominal > 0
                      ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                      : valorFuturoManual;

                    setFieldValue(`presentValueInvestor`, presentValueInvestor);
                    setFieldValue(`presentValueSF`, presentValueSF || 0);
                    setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

                    if (values.applyGm) {
                      setFieldValue(`GM`, presentValueInvestor * 0.002);
                    } else {
                      setFieldValue(`GM`, 0);
                    }

          
                      }

                    } else if (values.amountInitial<valorFuturoManual){
                      
                      if(values.currentBalanceActual<valorFuturoManual){
                    
                      setFieldValue(`saldoDisponible`,0);
                      setFieldValue(`saldoDisponibleInfo`, values.currentBalanceActual);
                      setFieldValue(`amount`, values.currentBalanceActual);  
                          
                      setFieldValue(`valorNominal`,values.currentBalanceActual.toFixed(0));
                      setFieldValue(`payedAmount`, values.currentBalanceActual.toFixed(0));
                      setFieldValue(`valorFuturoManual`, true);
                    if (values.opDate) {
                        const operationDays = values.operationDays;
                        const presentValueInvestor = operationDays > 0 && values.currentBalanceActual > 0
                          ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, values.currentBalanceActual, 0) * -1)
                          : valorFuturoManual;

                        const nuevoInvestorProfit = values.currentBalanceActual - presentValueInvestor;
                        setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
                        setFieldValue(`montoDisponibleCuenta`,  Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor -presentValueInvestor)-Number(values.GM -presentValueInvestor * 0.002), 0);


                        const presentValueSF = operationDays > 0 && values.currentBalanceActual > 0
                          ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, values.currentBalanceActual, 0) * -1)
                          : valorFuturoManual;

                        setFieldValue(`presentValueInvestor`, presentValueInvestor);
                        setFieldValue(`presentValueSF`, presentValueSF || 0);
                        setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

                        if (values.applyGm) {
                          setFieldValue(`GM`, presentValueInvestor * 0.002);
                        } else {
                          setFieldValue(`GM`, 0);
                        }

                        
                      }
                      }else {

 console.log(values.currentBalanceActual,'11111sdasdsada')
                      setFieldValue(`saldoDisponible`,(Number(values.currentBalanceActual) + (Number(values.amountInitial)-Number(valorFuturoManual))).toFixed(0) );
                      setFieldValue(`saldoDisponibleInfo`, Number(values.currentBalanceActual).toFixed(0));
                      setFieldValue(`amount`, valorFuturoManual);  
                          
                      setFieldValue(`valorNominal`, valorNominal.toFixed(0));
                      setFieldValue(`payedAmount`, valorNominal.toFixed(0));
                      setFieldValue(`valorFuturoManual`, true);
                    if (values.opDate) {
                        const operationDays = values.operationDays;
                        const presentValueInvestor = operationDays > 0 && valorNominal > 0
                          ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                          : valorFuturoManual;

                        const nuevoInvestorProfit = valorNominal - presentValueInvestor;
                        setFieldValue(`investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
                        setFieldValue(`montoDisponibleCuenta`,  Number(values.montoDisponibleCuenta) - Number(values.presentValueInvestor -presentValueInvestor)-Number(values.GM -presentValueInvestor * 0.002), 0);


                        const presentValueSF = operationDays > 0 && valorNominal > 0
                          ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, valorNominal, 0) * -1)
                          : valorFuturoManual;

                        setFieldValue(`presentValueInvestor`, presentValueInvestor);
                        setFieldValue(`presentValueSF`, presentValueSF || 0);
                        setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);

                        if (values.applyGm) {
                          setFieldValue(`GM`, presentValueInvestor * 0.002);
                        } else {
                          setFieldValue(`GM`, 0);
                        }

                        
                      }
                        }
                        
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