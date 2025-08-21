// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function TotalSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`Total`}
        data-testid="campo-Total"
        label="Total"
        disabled
        fullWidth
        type='text'
        
        value={
          formatNumberWithThousandsSeparator( values?.total)
        }
    
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");


  
                setFieldValue(`total`, parseFloat(rawValue));
          
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = values.total ? values.total.toString() : "";
        }}
     
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`total`, valorFuturoManual);
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