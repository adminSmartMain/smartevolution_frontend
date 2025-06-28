// components/RegisterOperationForm.js
import React from "react";

import { TextField } from '@mui/material';


import { PV } from "@formulajs/formulajs";

export default function PorcentajeDescuentoSelector({ values, setFieldValue, errors, touched }) {

    return (
        <TextField
            id="payedPercentname"
            data-testid="campo-payedPercent"
            label="% Descuento"
            fullWidth
            type="number"
            name="payedPercent"
            value={values.payedPercent ?? 0}
            onChange={(e) => {
                const inputValue = e.target.value;

                // Manejar el caso cuando el usuario borra todo (input vacío)
                if (inputValue === "") {
                    setFieldValue(`payedPercent`, "");
                    return;
                }

                // Convertir a número y validar rango
                let numericValue = Number(inputValue);
                numericValue = isNaN(numericValue) ? 0 : Math.min(Math.max(numericValue, 0), 100);

                // Si el valor actual es 0 y el usuario empieza a escribir, reemplazar el 0
                const currentValue = values.payedPercent;
                const shouldClearZero = currentValue === 0 && inputValue.length > 1 && inputValue.startsWith("0");

                // Actualizar el valor en el formulario
                const finalValue = shouldClearZero ? inputValue.replace(/^0+/, '') : numericValue;
                setFieldValue(`payedPercent`,  Number(finalValue.toFixed(2)));

                // Calcular valores dependientes solo si hay un valor numérico válido
                if (inputValue !== "" && !isNaN(numericValue)) {
                    const valorFuturo = values.amount || 0;
                    const nuevopayedAmount = valorFuturo * ( Number(numericValue) / 100);
                    console.log(nuevopayedAmount)

                    setFieldValue(`payedAmount`, Number(nuevopayedAmount.toFixed(0)));
                    setFieldValue(`payedAmount`, Number(nuevopayedAmount.toFixed(0)));
                    setFieldValue(`payedAmountManual`, false);

                    setFieldValue(`investorProfit`, Number(nuevopayedAmount - values.presentValueInvestor).toFixed(0));
                    if (values.opDate && values.operationDays) {
                        const presentValueInvestor = Math.round(
                            PV(values.investorTax / 100, values.operationDays / 365, 0, nuevopayedAmount, 0) * -1
                        );
                        console.log(values?.discountTax)
                        const presentValueSF = Math.round(
                            PV(parseFloat(values?.discountTax) / 100, values.operationDays / 365, 0, nuevopayedAmount, 0) * -1
                        );
                        console.log(values.presentValueSF,parseFloat(values.discountTax),values.investorTax)
                        setFieldValue(`presentValueInvestor`, presentValueInvestor);
                        setFieldValue(`GM`, presentValueInvestor*0.002);
                        setFieldValue(`presentValueSF`, presentValueSF);
                        setFieldValue(`commissionSF`, presentValueInvestor - presentValueSF);
                        setFieldValue(`investorProfit`, Number(nuevopayedAmount - presentValueInvestor).toFixed(0));

                       
                    }
                }
            }}
            onBlur={(e) => {
                // Al salir del campo, si está vacío o no es un número, poner 0
                const numericValue = Number(e.target.value);
                if (e.target.value === "" || isNaN(numericValue)) {
                    setFieldValue(`payedPercent`, 0);
                }
            }}
            inputProps={{
                min: 0,
                max: 100,
                step: '0.01',
                pattern: "[0-9]*" // Mejor experiencia en móviles
            }}
            error={touched.payedPercent && Boolean(errors.payedPercent)}
            helperText={touched.payedPercent && errors.payedPercent}
        />
    );
}