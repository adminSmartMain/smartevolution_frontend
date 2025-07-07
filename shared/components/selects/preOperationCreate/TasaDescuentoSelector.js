// components/RegisterOperationForm.js
import React from "react";
import { TextField } from '@mui/material';
import { PV } from "@formulajs/formulajs";
import { InputAdornment } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function TasaDescuentoSelector({ values, setFieldValue, setFieldError, errors, factura, index, parseFloat }) {
  const hasError = () => {
        // Error de validación Yup
        if (errors?.discountTax) {
            return true;
        }
        
  
    };

    const getErrorMessage = () => {
        if (errors?.discountTax) {
            return errors.discountTax;
        }
        
      
    };
    const normalizeDecimalSeparator = (value) => {
        // Reemplazar comas por puntos para el cálculo interno
        return typeof value === 'string' ? value.replace(/,/g, '.') : value;
    };

    const formatDisplayValue = (value) => {
        // Formatear el valor para mostrar (convertir punto a coma si es necesario)
        if (value === null || value === undefined || value === "") return '0';
        return value.toString().replace('.', ',');
    };
     // Función para actualizar todas las facturas
  const updateAllFacturas = (newValue) => {
    if (values.facturas && values.facturas.length > 0) {
      values.facturas.forEach((_, i) => {
        setFieldValue(`facturas[${i}].discountTax`, newValue);
      });
    }
  };
    const handleChange = (e) => {
        const inputValue = e.target.value;

        // Si el campo está vacío, poner 0 inmediatamente
        if (inputValue === "") {
            setFieldValue('discountTax', '0');
            return;
        }

        // Permitir solo números, un punto o una coma (pero no ambos)
        if (!/^(\d+[.,]?\d*|[.,]\d+)$/.test(inputValue)) {
            return;
        }

        // No permitir múltiples separadores decimales
        if ((inputValue.match(/,/g) || []).length > 1 || 
            (inputValue.match(/\./g) || []).length > 1) {
            return;
        }

        // Si empieza con separador decimal, agregar 0 antes
        let processedValue = inputValue;
        if (inputValue.startsWith(".") || inputValue.startsWith(",")) {
            processedValue = "0" + inputValue;
        }

        // Manejar el caso de ceros a la izquierda
        if (/^0+[1-9]/.test(processedValue)) {
            processedValue = processedValue.replace(/^0+/, '');
        }

        // Convertir a número para validaciones (usando punto como separador)
        const numericValue = parseFloat(normalizeDecimalSeparator(processedValue)) || 0;

        // Validar rango [0, 100]
        let finalValue = numericValue;
        if (numericValue < 0) finalValue = 0;
        if (numericValue > 100) finalValue = 100;

        // Si el valor final es diferente al numérico (por corrección), usar string temporal
        if (finalValue !== numericValue) {
            setFieldValue('discountTax', formatDisplayValue(finalValue));
            return;
        }

        // Mantener como string si termina en separador decimal para permitir decimales
        if (inputValue.endsWith(".") || inputValue.endsWith(",")) {
            setFieldValue('discountTax', processedValue);
            return;
        }

        // Actualizar el valor mostrado (manteniendo el separador original del usuario)
        setFieldValue('discountTax', parseFloat(processedValue.replace(',', '.')));
        updateAllFacturas(parseFloat(processedValue.replace(',', '.')))
        // Validar relación con investorTax
        const nuevoInvestorTax = parseFloat(normalizeDecimalSeparator(factura.investorTax)) || 0;
        console.log(nuevoInvestorTax , parseFloat(normalizeDecimalSeparator(values.discountTax)))
        // Si eran iguales y cambias discountTax, ajusta investorTax automáticamente
        if (nuevoInvestorTax === parseFloat(normalizeDecimalSeparator(values.discountTax))) {
            console.log('caso iguales');
           // setFieldValue(`facturas[${index}].investorTax`, finalValue);
            
            const operationDays = factura.operationDays || 0;
            const valorNominal = factura.valorNominal || 0;
            console.log('operationDays', operationDays, 'valorNominal', valorNominal);
            // Calculamos ambos valores con la misma tasa (finalValue)
            const presentValue = operationDays > 0 && valorNominal > 0
                ? Math.round(PV(finalValue / 100, operationDays / 365, 0, -valorNominal, 0) )
                : valorNominal || 0;
            

            console.log(presentValue)
            // Ambos valores son iguales cuando las tasas son iguales
            setFieldValue(`facturas[${index}].presentValueInvestor`, presentValue);
            setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValue*0.002);
            setFieldValue(`facturas[${index}].presentValueSF`, presentValue);
            setFieldValue(`facturas[${index}].investorProfit`, valorNominal - presentValue);
            
            // La comisión debe ser 0 cuando las tasas son iguales
            setFieldValue(`facturas[${index}].comisionSF`, 0);
        }else{
            
        }
      
        // Si investorTax es 0, lo igualamos a discountTax
        if (nuevoInvestorTax === 0) {
            setFieldValue('investorTax', finalValue);
           
        }

        if (values.opDate) {
    console.log('caso diferentes aaaa');
    values.facturas.forEach((f, i) => {
      
        
        const operationDays = f.operationDays || 0;
        const valorNominal = f.valorNominal || 0;

        const presentValueSF = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(finalValue / 100, operationDays / 365, 0, -valorNominal, 0))
            : f.valorFuturo || 0;

        console.log(presentValueSF);
        
        setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF);
        
        const currentInvestorValue = values.facturas[i]?.presentValueInvestor || 0;
        console.log(presentValueSF, currentInvestorValue);
        const comisionSF = currentInvestorValue - presentValueSF;
        setFieldValue(`facturas[${index}].comisionSF`, Math.max(0, comisionSF));
    });
}
    };

    const handleBlur = (e) => {
        const inputValue = e.target.value;
        
        // Si solo tiene un separador decimal, poner 0
        if (inputValue === "." || inputValue === ",") {
            setFieldValue('discountTax', '0');
            setFieldError('discountTax', undefined);
            return;
        }

        // Convertir a número (normalizando el separador) y validar rango [0, 100]
        const numericValue = parseFloat(normalizeDecimalSeparator(inputValue)) || 0;
        let finalValue = numericValue;

        if (numericValue < 0) finalValue = 0;
        if (numericValue > 100) finalValue = 100;

        // Formatear el valor para mostrar
        const displayValue = formatDisplayValue(finalValue);

        // Si se corrigió, actualizar el campo
        if (finalValue !== numericValue || normalizeDecimalSeparator(inputValue) !== finalValue.toString()) {
            setFieldValue('discountTax', displayValue);
        }

        
    };

    return (
        <TextField
            id="discountTaxname"
            data-testid="campo-discountTax"
            label="Tasa Descuento"
            fullWidth
            type="text"
            InputLabelProps={{ shrink: true }}
            value={formatDisplayValue(values.discountTax)}
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
        <Tooltip title="Información sobre la tasa de descuento">
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
    )
}