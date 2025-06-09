import { Tooltip, IconButton } from '@mui/material';
import React from "react";
import { TextField } from '@mui/material';
import { PV } from "@formulajs/formulajs";
import InfoIcon from '@mui/icons-material/Info';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TasaInversionistaSelector({ values, setFieldValue, setFieldError, errors, factura, index, parseFloat }) {

    const normalizeDecimalSeparator = (value) => {
        // Reemplazar comas por puntos para el cálculo interno
        if (value === null || value === undefined) return '0';
        return value.toString().replace(/,/g, '.');
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
            setFieldValue(`investorTax`, 0);
            setFieldValue(`facturas[${index}].investorTax`, 0);
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

        // Mantener como string si termina en separador decimal para permitir decimales
        if (inputValue.endsWith(".") || inputValue.endsWith(",")) {
            setFieldValue(`investorTax`, processedValue);
            setFieldValue(`facturas[${index}].investorTax`, processedValue);
            return;
        }

        // Convertir a número para validaciones
        const numericValue = parseFloat(normalizeDecimalSeparator(processedValue)) || 0;

        // Validar rango [0, 100]
        let finalValue = numericValue;
        if (numericValue < 0) finalValue = 0;
        if (numericValue > 100) finalValue = 100;

        // Validar relación con discountTax
        const discountTax = parseFloat(normalizeDecimalSeparator(values.discountTax)) || 0;

        if (finalValue > discountTax) {
            setFieldValue(`investorTax`, discountTax);
            setFieldValue(`facturas[${index}].investorTax`, discountTax);
            setTimeout(() => {
                toast.error("La tasa inversionista no puede ser mayor que la tasa de descuento");
            }, 100);
        } else {
            setFieldValue(`investorTax`, finalValue);
            setFieldValue(`facturas[${index}].investorTax`, finalValue);
        }

        // Calcular valores dependientes
        const operationDays = factura.operationDays || 0;
        const valorNominal = factura.valorNominal || 0;

        const presentValueInvestor = operationDays > 0 && valorNominal > 0
            ? Math.round(PV(finalValue / 100, operationDays / 365, 0, -valorNominal, 0))
            : factura.valorFuturo || 0;

        const nuevoInvestorProfit = valorNominal - presentValueInvestor;

        setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor);
        setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - (factura.presentValueSF || 0));
        setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoInvestorProfit).toFixed(0) || 0);

        // Calcular monto disponible global
        const totalPresentValue = values.facturas
            .filter(f => f.idCuentaInversionista === factura.idCuentaInversionista)
            .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0);

        const nuevoMontoGlobal = factura.montoDisponibleInfo - totalPresentValue;

        values.facturas.forEach((f, i) => {
            if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoGlobal);
            }
        });
    };

    const handleBlur = (e) => {
        const inputValue = e.target.value;
        
        // Si solo tiene un separador decimal, poner 0
        if (inputValue === "." || inputValue === "," || inputValue === "") {
            setFieldValue(`investorTax`, 0);
            setFieldValue(`facturas[${index}].investorTax`, 0);
            setFieldError('investorTax', undefined);
            return;
        }

        // Convertir a número y validar
        const numericValue = parseFloat(normalizeDecimalSeparator(inputValue)) || 0;
        let finalValue = numericValue;

        if (numericValue < 0) finalValue = 0;
        if (numericValue > 100) finalValue = 100;

        // Validar contra discountTax
        const discountTaxValue = parseFloat(normalizeDecimalSeparator(values.discountTax)) || 0;
        if (finalValue > discountTaxValue) {
            setFieldError('investorTax', 'Debe ser ≤ Tasa Descuento');
            setFieldValue(`investorTax`, discountTaxValue);
            setFieldValue(`facturas[${index}].investorTax`, discountTaxValue);
        } else {
            setFieldError('investorTax', undefined);
            setFieldValue(`investorTax`, finalValue);
            setFieldValue(`facturas[${index}].investorTax`, finalValue);
        }
    };

    return (
        <>
            <TextField
                id="investorTaxname"
                data-testid="campo-investorTax"
                label="Tasa Inversionista"
                fullWidth
                type="text"  // Cambiado de "number" a "text" para mejor control
                name="investorTax"
                value={formatDisplayValue(factura.investorTax)}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                    min: 0,
                    max: 100,
                    step: "0.01",
                    pattern: "[0-9,.]*",  // Permitir números, comas y puntos
                    inputMode: "decimal",
                }}
                error={!!errors.investorTax || parseFloat(normalizeDecimalSeparator(values.investorTax)) > parseFloat(normalizeDecimalSeparator(values.discountTax))}
                helperText={
                    !factura.valorNominalManual
                        ? `Sugerido: ${formatDisplayValue(factura.tasaInversionistaPR || 0)}%`
                        : parseFloat(normalizeDecimalSeparator(values.investorTax)) > parseFloat(normalizeDecimalSeparator(values.discountTax))
                            ? "La tasa inversionista no puede ser mayor que la tasa de descuento."
                            : "Valor ingresado manualmente"
                }
            />
            <Tooltip
                title="Por defecto, este valor se establece en 0%. Si lo necesitas, puedes modificarlo manualmente en este formulario según las condiciones actuales del mercado.
        Cambiar este valor solo afectará la operación actual, no se actualizará en el perfil de riesgo del cliente."
                placement="top-end"
                enterDelay={200}
                leaveDelay={200}
                arrow
                PopperProps={{
                    modifiers: [{
                        name: 'offset',
                        options: { offset: [0, 5] }
                    }]
                }}
            >
                <IconButton
                    size="small"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: 2,
                        transform: 'translateY(-100%)',
                        padding: 0.8,
                        marginLeft: 1,
                    }}
                >
                    <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                </IconButton>
            </Tooltip>
            <ToastContainer />
        </>
    );
}