// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar

import validateRetentions from "@components/validateRet";

export default function OtrasRetSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`OtrasRet`}
        data-testid="campo-OtrasRet"
        label="Otras RET"
        fullWidth
        type='text'
        value={
           values?.other_ret
        }
    
       onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");
             const numericValue = parseFloat(rawValue) || 0;
  
            if (!validateRetentions(values, numericValue, 'other_ret')) {
                return;
            }

                const valor_recibir= (Number(values.subTotal) +Number(values.iva))-(Number(values.ret_iva )+ Number(values.ret_ica) + Number(values.ret_fte) + Number(rawValue));
                setFieldValue(`other_ret`, parseFloat(rawValue));
                setFieldValue(`currentBalance`, parseFloat(valor_recibir));
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = values.otrasRet ? values.otrasRet.toString() : "";
        }}
     
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`other_ret`, valorFuturoManual);
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