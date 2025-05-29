// components/RegisterOperationForm.js
import React from "react";

import {  TextField } from '@mui/material';

import { PV } from "@formulajs/formulajs";



export default function TasaDescuentoSelector({ values, setFieldValue, setFieldError, errors, factura, index,parseFloat}) {

    return (

        <TextField
            id="discountTaxname"
            data-testid="campo-discountTax"
            label="Tasa Descuento"
            fullWidth
            type="number"
            InputLabelProps={{ shrink: true }}
            value={values.discountTax ?? 0}
            onChange={(e) => {
                const inputValue = e.target.value;

                // Si el campo está vacío, permitir borrar (pero no guardar como "")
                if (inputValue === "") {
                    setFieldValue('discountTax', "");
                    return;
                }

                // Convertir a número y validar rango [0, 100]
                let numericValue = parseFloat(inputValue) || 0;

                // Si el usuario intenta escribir un número negativo o mayor a 100, lo corregimos
                if (numericValue < 0) numericValue = 0;
                if (numericValue > 100) numericValue = 100;

                // Comportamiento inteligente para el 0 (ej: evitar "021" → "21")
                const currentValue = values.discountTax;
                const shouldClearZero = currentValue === 0 && inputValue.length > 1 && inputValue.startsWith("0");
                const finalValue = shouldClearZero ? inputValue.replace(/^0+/, '') : numericValue;

                // Validar relación con investorTax
                const nuevoInvestorTax = parseFloat(factura.investorTax) || 0;

                // Si eran iguales y cambias discountTax, ajusta investorTax automáticamente
                if (nuevoInvestorTax === values.discountTax) {
                    setFieldValue(`facturas[${index}].investorTax`, finalValue);
                }

                // Siempre actualizamos la tasa de descuento
                setFieldValue('discountTax', finalValue);

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
            }}
            onBlur={(e) => {
                // Si está vacío, poner 0
                if (e.target.value === "") {
                    setFieldValue('discountTax', 0);
                }

                // Validar que esté entre 0 y 100
                const finalValue = parseFloat(e.target.value) || 0;
                let correctedValue = finalValue;

                if (finalValue < 0) correctedValue = 0;
                if (finalValue > 100) correctedValue = 100;

                // Si se corrigió, actualizar el campo
                if (correctedValue !== finalValue) {
                    setFieldValue('discountTax', correctedValue);
                }

                // Validar si es menor que investorTax
                if (correctedValue < parseFloat(factura.investorTax)) {
                    setFieldError('discountTax', 'Debe ser ≥ Tasa Inversionista');
                } else {
                    setFieldError('discountTax', undefined);
                }
            }}
            helperText={
                !factura.valorNominalManual
                    ? `Sugerido: ${factura.tasaDescuentoPR || 0}%`
                    : values.investorTax > values.discountTax
                        ? "La tasa inversionista no puede ser mayor que la tasa de descuento."
                        : "Valor ingresado manualmente"
            }
            inputProps={{
                min: 0,
                max: 100,
                step: "0.01",  // Permitir decimales
                pattern: "[0-9.]*",  // Solo números y punto decimal
                inputMode: "decimal",  // Teclado numérico en móviles
            }}
            error={!!errors.discountTax}  // Mostrar error si existe
        />
    )
}