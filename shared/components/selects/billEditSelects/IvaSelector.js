// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function IvaSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat,integrationCode}) {

    return (<TextField
        id={`Iva`}
        data-testid="campo-Iva"
        label="IVA"
        fullWidth
        type='text'
        disabled={integrationCode != null}
        value={
           values?.iva
        }
    onChange={(e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        const newIva = Number(rawValue) || 0;
        
        // Validación: El IVA no puede ser mayor que el subtotal
        if (newIva > Number(values.subTotal)) {
            toast.error('El IVA no puede ser mayor al subtotal de la factura');
            return; // Detener la ejecución
        }
        
        // Calcular nuevos valores
        const newTotal = Number(values.subTotal) + newIva;
        const totalRetenciones = Number(values.ret_iva || 0) + 
                                Number(values.ret_ica || 0) + 
                                Number(values.ret_fte || 0) + 
                                Number(values.other_ret || 0);
        
        const newCurrentBalance = newTotal - totalRetenciones;
        
        // Actualizar valores
        setFieldValue('iva', newIva);
        setFieldValue('total', newTotal);
        setFieldValue('currentBalance', newCurrentBalance);
    }}
    onFocus={(e) => {
        // Al hacer foco, removemos el formato para permitir la edición del valor numérico
        e.target.value = values.iva ? values.iva.toString() : "";
    }}
     
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`iva`, valorFuturoManual);
                }}

        InputLabelProps={{
    shrink: true // Forces the label to shrink permanently
  }}
        inputProps={{
            maxLength: 22, // Límite HTML nativo
            min: 0,
            
           
            startAdornment: (
                <InputAdornment position="start">
                    <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                </InputAdornment>
            ),

        }}

      
    />)
}