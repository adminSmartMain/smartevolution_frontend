import { Tooltip, IconButton } from '@mui/material';
import React from "react";
import { TextField } from '@mui/material';
import { PV } from "@formulajs/formulajs";
import InfoIcon from '@mui/icons-material/Info';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorIcon from '@mui/icons-material/Error';
import { InputAdornment } from '@mui/material';


export default function TasaInversionistaSelector({ values, setFieldValue, setFieldError, errors }) {
  const hasError = () => !!errors?.investorTax;
  const getErrorMessage = () => errors?.investorTax || '';

  const normalizeDecimalSeparator = (value) => {
    if (value === null || value === undefined) return '0';
    return value.toString().replace(/,/g, '.');
  };

  const formatDisplayValue = (value) => {
    if (value === null || value === undefined || value === "") return '';
    const strValue = value.toString();
    if (strValue.endsWith('.') || strValue.endsWith(',')) return strValue;
    return strValue.replace('.', ',');
  };

  const handleChange = async (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      await setFieldValue('investorTax', '', false);
      return;
    }

    if (!/^(\d+[.,]?\d*|[.,]\d+)$/.test(inputValue)) return;
    if ((inputValue.match(/,/g) || []).length > 1 || 
        (inputValue.match(/\./g) || []).length > 1) return;

    let processedValue = inputValue;
    if (inputValue.startsWith(".") || inputValue.startsWith(",")) {
      processedValue = "0" + inputValue;
    }

    if (/^0+[1-9]/.test(processedValue)) {
      processedValue = processedValue.replace(/^0+/, '');
    }

    if (inputValue.endsWith(".") || inputValue.endsWith(",")) {
      await setFieldValue('investorTax', processedValue, false);
      return;
    }

    const numericValue = parseFloat(normalizeDecimalSeparator(processedValue)) || 0;
    let finalValue = numericValue;
    if (numericValue < 0) finalValue = 0;
    if (numericValue > 100) finalValue = 100;

    const discountTax = parseFloat(normalizeDecimalSeparator(values.discountTax)) || 0;

    if (finalValue > discountTax) {
      await setFieldValue('investorTax', discountTax, false);
      setTimeout(() => {
        toast.error("La tasa inversionista no puede ser mayor que la tasa de descuento");
      }, 100);
    } else {
      await setFieldValue('investorTax', processedValue, false);
    }

    // Cálculos dependientes con await
    await calculateDependentValues(finalValue);
  };

  const calculateDependentValues = async (rate) => {
    const operationDays = values.operationDays || 0;
    const valorNominal = values.payedAmount || 0;
    console.log(rate)

    const presentValueInvestor = operationDays > 0 && valorNominal > 0
      ? Math.round(PV(rate / 100, operationDays / 365, 0, -valorNominal, 0))
      : values.amount || 0;

    const nuevoInvestorProfit = valorNominal - presentValueInvestor;

    // Actualización secuencial de campos dependientes
    await setFieldValue('presentValueInvestor', presentValueInvestor, false);
    if (values.applyGm) {
         await setFieldValue(`GM`, presentValueInvestor * 0.002);
      } else {
        await  setFieldValue(`GM`, 0);
      }
   
    await setFieldValue('commissionSF', presentValueInvestor - (values.presentValueSF || 0), false);
    await setFieldValue('investorProfit', Number(nuevoInvestorProfit).toFixed(0) || 0, false);
  };

  const handleBlur = async (e) => {
    const inputValue = e.target.value;
    
    if (inputValue === "" || inputValue === "." || inputValue === ",") {
      await setFieldValue('investorTax', 0, false);
      setFieldError('investorTax', undefined);
      return;
    }

    const numericValue = parseFloat(normalizeDecimalSeparator(inputValue)) || 0;
    let finalValue = numericValue;

    if (numericValue < 0) finalValue = 0;
    if (numericValue > 100) finalValue = 100;

    const discountTaxValue = parseFloat(normalizeDecimalSeparator(values.discountTax)) || 0;
    
    if (finalValue > discountTaxValue) {
      setFieldError('investorTax', 'Debe ser ≤ Tasa Descuento');
      await setFieldValue('investorTax', discountTaxValue, false);
    } else {
      setFieldError('investorTax', undefined);
      await setFieldValue('investorTax', finalValue, false);
    }

    // Recalcular valores al salir del campo
    await calculateDependentValues(finalValue);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        label="Tasa Inversionista (%)"
        fullWidth
        name="investorTax"
        value={formatDisplayValue(values?.investorTax)}
           error={hasError()}
  InputProps={{
   endAdornment: (
  <InputAdornment position="end">
    {hasError() ? (
      <Tooltip 
        title={getErrorMessage()} 
        arrow
        open={hasError()}  // Solo se abre cuando hay error
        placement="top-end"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'error.main',
              '& .MuiTooltip-arrow': {
                color: 'error.main',
              }
            }
          }
        }}
      >
        <IconButton edge="end" size="small" aria-label="Error">
          <ErrorIcon color="error" fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip 
        title="Por defecto, este valor se establece en 0%. Si lo necesitas, puedes modificarlo manualmente en este formulario según las condiciones actuales del mercado.
          Cambiar este valor solo afectará la operación actual, no se actualizará en el perfil de riesgo del cliente"
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
      </Tooltip>
    )}
  </InputAdornment>
),
    inputProps: {
      min: 0,
      max: 100,
      step: "0.01",
      pattern: "[0-9,.]*",
      inputMode: "decimal",
    }
  }}
      />
      
      <ToastContainer />
    </div>
  );
}