import React from "react";
import { TextField } from '@mui/material';
import { PV } from "@formulajs/formulajs";
import { InputAdornment } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip, IconButton } from '@mui/material';
export default function TasaDescuentoSelector({ values, setFieldValue, setFieldError, errors }) {
  const hasError = () => !!errors?.discountTax;
  const getErrorMessage = () => errors?.discountTax || '';

  const normalizeDecimalSeparator = (value) => {
    if (value === null || value === undefined) return '0';
    return value.toString().replace(/,/g, '.');
  };

  const formatDisplayValue = (value) => {
    if (value === null || value === undefined || value === "") return '';
    const strValue = value.toString();
    if (strValue.endsWith('.')) return strValue.replace('.', ',');
    return strValue.replace('.', ',');
  };

  const handleChange = async (e) => {
    let inputValue = e.target.value;

    // Convertir punto a coma al escribir
    if (inputValue.includes('.')) {
      inputValue = inputValue.replace('.', ',');
      await setFieldValue('discountTax', inputValue);
      return;
    }

    if (inputValue === "") {
      await setFieldValue('discountTax', '');
      return;
    }

    if (!/^(\d+[,]?\d*|[,]\d+)$/.test(inputValue)) return;
    if ((inputValue.match(/,/g) || []).length > 1) return;

    let processedValue = inputValue;
    
    if (/^0[1-9]/.test(processedValue)) {
      processedValue = processedValue.substring(1);
    }
    
    if (processedValue.startsWith(",")) {
      processedValue = "0" + processedValue;
    }

    if (inputValue.endsWith(",")) {
      await setFieldValue('discountTax', processedValue);
      return;
    }

    // Convertir a número inmediatamente pero mostrar con coma
    const numericValue = parseFloat(normalizeDecimalSeparator(processedValue)) || 0;
    const finalValue = Math.min(Math.max(numericValue, 0), 100);

    // Guardar como número pero mostrar formateado
    await setFieldValue('discountTax', finalValue);

    // Lógica de cálculo
    const nuevoInvestorTax = parseFloat(normalizeDecimalSeparator(values.investorTax)) || 0;
    
    if (nuevoInvestorTax === parseFloat(normalizeDecimalSeparator(values.discountTax))) {
      const operationDays = values.operationDays || 0;
      const valorNominal = values.valorNominal || 0;
      const presentValue = operationDays > 0 && valorNominal > 0
        ? Math.round(PV(finalValue / 100, operationDays / 365, 0, -valorNominal, 0))
        : valorNominal;

      await Promise.all([
        setFieldValue('presentValueInvestor', presentValue),
        
        setFieldValue('presentValueSF', presentValue),
        setFieldValue('investorProfit', valorNominal - presentValue),
        setFieldValue('commissionSF', 0)
      ]);

       if(values.applyGm) {
        setFieldValue(`GM`, presentValue * 0.002);
      } else {
        setFieldValue(`GM`, 0);
      } 
    }

    if (nuevoInvestorTax === 0) {
      await setFieldValue('investorTax', finalValue);
    }
  };

  const handleBlur = async (e) => {
    const inputValue = e.target.value;

    if (inputValue === "" || inputValue === ",") {
      await setFieldValue('discountTax', 0, false);
      setFieldError('discountTax', undefined);
      return;
    }

    const numericValue = parseFloat(normalizeDecimalSeparator(inputValue)) || 0;
    const finalValue = Math.min(Math.max(numericValue, 0), 100);

    await setFieldValue('discountTax', finalValue, false);
  };

  return (
    <TextField
      label="Tasa Descuento"
      fullWidth
      value={formatDisplayValue(values?.discountTax) || ''}
      onChange={handleChange}
      
      onBlur={handleBlur}
       error={hasError()}
  InputProps={{
     endAdornment: (
    <InputAdornment position="end">
      {hasError() ? (
        <Tooltip 
          title={getErrorMessage()} 
          arrow
          open={hasError()} // Solo se abre cuando hay error
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
          <IconButton edge="end" size="small">
            <ErrorIcon color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Este campo se usa para aplicar la tasa de descuento">
          <IconButton edge="end" size="small">
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
  );
}