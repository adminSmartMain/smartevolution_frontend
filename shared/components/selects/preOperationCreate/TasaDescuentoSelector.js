// components/RegisterOperationForm.js
import React from "react";
import { TextField } from '@mui/material';
import { PV } from "@formulajs/formulajs";

export default function TasaDescuentoSelector({ values, setFieldValue, setFieldError, errors, factura, index, parseFloat }) {

    const normalizeDecimalSeparator = (value) => {
        // Reemplazar comas por puntos para el cálculo interno
        return typeof value === 'string' ? value.replace(/,/g, '.') : value;
    };

    const formatDisplayValue = (value) => {
        // Formatear el valor para mostrar (convertir punto a coma si es necesario)
        if (value === null || value === undefined || value === "") return '0';
        return value.toString().replace('.', ',');
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
        setFieldValue('discountTax', processedValue);

        // Validar relación con investorTax
        const nuevoInvestorTax = parseFloat(normalizeDecimalSeparator(factura.investorTax)) || 0;

        // Si eran iguales y cambias discountTax, ajusta investorTax automáticamente
        if (nuevoInvestorTax === parseFloat(normalizeDecimalSeparator(values.discountTax))) {
            setFieldValue(`facturas[${index}].investorTax`, finalValue);
        }

        // Si investorTax es 0, lo igualamos a discountTax
        if (nuevoInvestorTax === 0) {
            setFieldValue('investorTax', finalValue);
        }

        // Recalcular valores si hay fecha de operación
        if (values.opDate) {
            values.facturas.forEach((f, i) => {
                const operationDays = f.operationDays || 0;
                const valorNominal = f.valorNominal || 0;

                const presentValueSF = operationDays > 0 && valorNominal > 0
                    ? Math.round(PV(finalValue / 100, operationDays / 365, 0, -valorNominal, 0))
                    : f.valorFuturo || 0;

                setFieldValue(`facturas[${i}].presentValueSF`, presentValueSF);

                if (f.presentValueInvestor) {
                    const comisionSF = f.presentValueInvestor - presentValueSF;
                    setFieldValue(`facturas[${i}].comisionSF`, comisionSF || 0);
                }
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

        // Validar si es menor que investorTax
        const investorTaxValue = parseFloat(normalizeDecimalSeparator(factura.investorTax)) || 0;
        if (finalValue < investorTaxValue) {
            setFieldError('discountTax', 'Debe ser ≥ Tasa Inversionista');
        } else {
            setFieldError('discountTax', undefined);
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
            helperText={
                !factura.valorNominalManual
                    ? `Sugerido: ${formatDisplayValue(factura.tasaDescuentoPR || 0)}%`
                    : parseFloat(normalizeDecimalSeparator(values.investorTax)) > parseFloat(normalizeDecimalSeparator(values.discountTax))
                        ? "La tasa inversionista no puede ser mayor que la tasa de descuento."
                        : "Valor ingresado manualmente"
            }
            inputProps={{
                min: 0,
                max: 100,
                step: "0.01",
                pattern: "[0-9,.]*",
                inputMode: "decimal",
            }}
            error={!!errors.discountTax}
        />
    )
}