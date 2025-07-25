// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function SubTotalSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat,errors}) {

    return (<TextField
        id={`SubTotal`}
        data-testid="campo-SubTotal"
        label="Subtotal"
        fullWidth
        type='text'
        value={
           values?.subTotal
        }
    
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");

                   const valor_recibir= (Number(values.iva) +Number(rawValue))-(Number(values.ret_iva) + Number(values.ret_ica) + Number(values.ret_fte) + Number(values.other_ret));
                    const total=Number(values.iva)+Number(rawValue)
                setFieldValue(`subTotal`, parseFloat(rawValue));
          setFieldValue(`currentBalance`, parseFloat(valor_recibir));
          setFieldValue(`total`, parseFloat(total));
        }}
        onFocus={(e) => {
            // Al hacer foco, removemos el formato para permitir la edición del valor numérico
            e.target.value = values.subTotal ? values.subTotal.toString() : "";
        }}
     error={Boolean(errors.subTotal)}
          helperText={errors.subTotal}
        onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`subTotal`, valorFuturoManual);
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