// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import validateRetentions from "@components/validateRet";


export default function RetIvaSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`RetIva`}
        data-testid="campo-RetIva"
        label="RETIVA"
        fullWidth
       
        type='text'
        value={
           formatNumberWithThousandsSeparator(values?.ret_iva)
        }
    
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");
                
              const numericValue = parseFloat(rawValue) || 0;
  
            if (!validateRetentions(values, numericValue, 'ret_iva')) {
                return;
            }
  
                setFieldValue(`ret_iva`, parseFloat(rawValue));

                const valor_recibir= (Number(values.subTotal) +Number(values.iva))-(Number(rawValue) + Number(values.ret_ica) + Number(values.ret_fte) + Number(values.other_ret));


                setFieldValue('currentBalance', parseFloat(valor_recibir)); // Asumiendo un 5% de retención de IVA
               
          
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = values.ret_iva ? values.ret_iva.toString() : "";
        }}
     
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`ret_iva`, valorFuturoManual);
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