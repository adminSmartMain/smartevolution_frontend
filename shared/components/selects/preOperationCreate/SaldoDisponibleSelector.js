// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function SaldoDisponibleSelector({values, setFieldValue, factura, index, orchestDisabled,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`currentBalance-${index}`}
        data-testid="campo-saldoDisponibleFactura"
        label="Saldo Disponible en factura"
        fullWidth
        type='text'
        value={
            orchestDisabled.find(item => item.indice === index)?.status
                ? formatNumberWithThousandsSeparator(values.facturas[index]?.saldoDisponible || 0) ?? 0  // Mostrar 0 si es null/undefined
                : formatNumberWithThousandsSeparator(values.facturas[index]?.saldoDisponible || 0)
        }
        disabled={!orchestDisabled.find(item => item.indice === index)?.status}
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");


            // Actualizar valores
            if (orchestDisabled.find(item => item.indice === index)?.status) {
                setFieldValue(`facturas[${index}].saldoDisponible`,  parseFloat(rawValue));
                setFieldValue(`facturas[${index}].saldoDisponibleInfo`, parseFloat(rawValue));
            } else {
                setFieldValue(`facturas[${index}].saldoDisponible`, parseFloat(rawValue));
            }

            // Lógica para facturas con mismo billId (se mantiene igual)
            const currentBillId = values.facturas[index]?.billId;
            if (currentBillId) {
                values.facturas.forEach((factura, i) => {
                    if (factura.billId === currentBillId) {
                        setFieldValue(`facturas[${i}].saldoDisponible`, rawValue);
                        setFieldValue(`facturas[${i}].saldoDisponibleInfo`, parseFloat(rawValue));
                        setFieldValue(`facturas[${i}].valorFuturo`, 0);
                        setFieldValue(`facturas[${i}].presentValueInvestor`, 0);
                        setFieldValue(`facturas[${i}].presentValueSF`, 0);
                    }
                });
            }
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = factura.saldoDisponible ? factura.saldoDisponible.toString() : "";
        }}
        onBlur={(e) => {
            // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
            const rawValue = e.target.value.replace(/[^\d]/g, "");
            const valorFuturoManual = parseFloat(rawValue) || 0;
            setFieldValue(`facturas[${index}].saldoDisponible`, valorFuturoManual);
        }}

        inputProps={{
            maxLength: 22, // Límite HTML nativo
            min: 0,
            
            type: orchestDisabled.find(item => item.indice === index)?.status ? 'text' : 'text',
            startAdornment: (
                <InputAdornment position="start">
                    <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                </InputAdornment>
            ),

        }}

        helperText={
            `Saldo actual factura: ${formatNumberWithThousandsSeparator(
                orchestDisabled.find(item => item.indice === index)?.status
                    ? values.facturas[index]?.saldoDisponibleInfo || 0
                    : factura.saldoDisponibleInfo || 0
            )}`
        }
    />)
}