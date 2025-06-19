// components/RegisterOperationForm.js
import React from "react";

import { TextField } from '@mui/material';


import { PV } from "@formulajs/formulajs";

export default function PorcentajeDescuentoSelector({ values, setFieldValue, errors, touched, factura, index }) {

    return (
        <TextField
            id="payedPercentname"
            data-testid="campo-payedPercent"
            label="% Descuento"
            fullWidth
            type="number"
            name="porcentajeDescuento"
            value={factura.porcentajeDescuento ?? 0}
            onChange={(e) => {
                const inputValue = e.target.value;

                // Manejar el caso cuando el usuario borra todo (input vacío)
                if (inputValue === "") {
                    setFieldValue(`facturas[${index}].porcentajeDescuento`, "");
                    return;
                }

                // Convertir a número y validar rango
                let numericValue = Number(inputValue);
                numericValue = isNaN(numericValue) ? 0 : Math.min(Math.max(numericValue, 0), 100);

                // Si el valor actual es 0 y el usuario empieza a escribir, reemplazar el 0
                const currentValue = factura.porcentajeDescuento;
                const shouldClearZero = currentValue === 0 && inputValue.length > 1 && inputValue.startsWith("0");

                // Actualizar el valor en el formulario
                const finalValue = shouldClearZero ? inputValue.replace(/^0+/, '') : numericValue;
                setFieldValue(`facturas[${index}].porcentajeDescuento`,  Number(finalValue.toFixed(2)));

                // Calcular valores dependientes solo si hay un valor numérico válido
                if (inputValue !== "" && !isNaN(numericValue)) {
                    const valorFuturo = factura.valorFuturo || 0;
                    const nuevoValorNominal = valorFuturo * (numericValue / 100);

                    setFieldValue(`facturas[${index}].valorNominal`, Number(nuevoValorNominal.toFixed(0)));
                    setFieldValue(`facturas[${index}].payedAmount`, Number(nuevoValorNominal.toFixed(0)));
                    setFieldValue(`facturas[${index}].valorNominalManual`, false);

                    setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoValorNominal - factura.presentValueSF).toFixed(0));
                    if (values.opDate && factura.operationDays) {
                        const presentValueInvestor = Math.round(
                            PV(values.investorTax / 100, factura.operationDays / 365, 0, nuevoValorNominal, 0) * -1
                        );
                        console.log(values?.discountTax)
                        const presentValueSF = Math.round(
                            PV(parseFloat(values?.discountTax) / 100, factura.operationDays / 365, 0, nuevoValorNominal, 0) * -1
                        );
                        console.log(values.presentValueSF,parseFloat(values.discountTax),values.investorTax)
                        setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor);
                        setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF);
                        setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - presentValueSF);
                        setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoValorNominal - presentValueSF).toFixed(0));

                        // Actualizar montos disponibles
                        const totalPresentValue = values.facturas.reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0);
                        const totalGastos = values.facturas.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);
                        const montoDisponible = factura.montoDisponibleInfo - totalPresentValue - totalGastos;

                        values.facturas.forEach((f, i) => {
                            if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponible);
                            }
                        });
                    }
                }
            }}
            onBlur={(e) => {
                // Al salir del campo, si está vacío o no es un número, poner 0
                const numericValue = Number(e.target.value);
                if (e.target.value === "" || isNaN(numericValue)) {
                    setFieldValue(`facturas[${index}].porcentajeDescuento`, 0);
                }
            }}
            inputProps={{
                min: 0,
                max: 100,
                step: '0.01',
                pattern: "[0-9]*" // Mejor experiencia en móviles
            }}
            error={touched.facturas?.[index]?.porcentajeDescuento && Boolean(errors.facturas?.[index]?.porcentajeDescuento)}
            helperText={touched.facturas?.[index]?.porcentajeDescuento && errors.facturas?.[index]?.porcentajeDescuento}
        />
    );
}