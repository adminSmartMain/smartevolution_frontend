// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function RetIcaSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`RetIca`}
        data-testid="campo-RetIca"
        label="RET ICA"
        fullWidth
        type='text'
        value={
           values?.ret_ica
        }
    
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");

               const valor_recibir= (Number(values.subTotal) +Number(values.iva))-(Number(values.ret_iva) +  Number(rawValue) + Number(values.ret_fte) + Number(values.other_ret));
  
                setFieldValue(`ret_ica`, parseFloat(rawValue));
                setFieldValue(`currentBalance`, parseFloat(valor_recibir));
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = values.ret_ica ? values.ret_ica.toString() : "";
        }}d
     
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`ret_ica`, valorFuturoManual);
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