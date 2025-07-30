// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment,  TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar



export default function IvaSelector({values, setFieldValue,formatNumberWithThousandsSeparator,parseFloat}) {

    return (<TextField
        id={`Iva`}
        data-testid="campo-Iva"
        label="IVA"
        fullWidth
        type='text'
        value={
           values?.iva
        }
    
        onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, "");

                
                

                const total=Number(values.subTotal)+Number(rawValue)
                const ret_iva=Number(rawValue* 0.05).toFixed(2)
                const valor_recibir= (Number(values.subTotal) +Number(rawValue))-(Number(ret_iva) + Number(values.ret_ica) + Number(values.ret_fte) + Number(values.other_ret));
                console.log("Valor a recibir:", valor_recibir, "IVA:", rawValue, "SubTotal:", values.subTotal, "Retención IVA:", ret_iva, "Retención ICA:", values.ret_ica, "Retención FTE:", values.ret_fte, "Otras Retenciones:", values.other_ret);
                setFieldValue(`iva`, parseFloat(rawValue));
                setFieldValue('ret_iva', parseFloat( ret_iva)); // Asumiendo un 5% de retención de IVA
                setFieldValue('currentBalance', parseFloat(valor_recibir)); // Asumiendo un 5% de retención de IVA
                 setFieldValue(`total`, parseFloat(total));
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