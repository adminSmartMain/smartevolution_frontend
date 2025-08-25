import React from "react";
import {
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  IconButton
} from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function SaldoDisponibleSelector({
  values,
  setFieldValue,
  formatNumberWithThousandsSeparator,
  parseFloat,
}) {
  return (
    
    <TextField
      id="currentBalance-0"
      data-testid="campo-saldoDisponibleFactura"
      
      disabled
      fullWidth
      type="text"
      value={values?.currentBalance !== undefined && values?.currentBalance !== null
        ? formatNumberWithThousandsSeparator(values.currentBalance)
        : ""}
      onChange={(e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setFieldValue("currentBalance", parseFloat(rawValue));
        
      }}
      onFocus={(e) => {
        e.target.value = values.currentBalance ? values.currentBalance.toString() : "";
      }}
      onBlur={(e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        const valorFuturoManual = parseFloat(rawValue) || 0;
        setFieldValue("currentBalance", valorFuturoManual);
      }}

       sx={{
         "& .MuiOutlinedInput-root": {
      backgroundColor: "#eeebebff", // Fondo gris claro
      borderRadius: "4px", // Bordes redondeados (opcional)
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#488B8F !important", // 🔥 Obliga el color verde-azulado
      fontWeight: "bold !important",            // 🔥 Fuerza la negrita
      textAlign: "right",
      
    },
  }}
      InputProps={{
        disableUnderline: false, // si quieres sin línea puedes ponerlo en true
        startAdornment: (
          <InputAdornment position="start">
             <Typography> Valor a Recibir :</Typography> <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
          </InputAdornment>
        ),
       endAdornment: (
          <InputAdornment position="end">
              <Tooltip title={<Typography fontSize={13} color="#488B8F">Este es el valor neto que recibirás.</Typography>} arrow>
        <IconButton size="small">
          <InfoOutlinedIcon style={{ color: '#488B8F' }} />
        </IconButton>
      </Tooltip>
          </InputAdornment>
        ),
       
      }}
      InputLabelProps={{
        
        style: {
          color: '#488B8F', // color tenue del label
          fontWeight: 500
        }
      }}
      inputProps={{
        maxLength: 22,
        style: {
          textAlign: 'right',
            color: '#488B8F', // <--- Aquí está el cambio
        fontWeight: 'bold'
        }
      }}

     
    />
  );
}
