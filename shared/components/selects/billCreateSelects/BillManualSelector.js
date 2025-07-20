import React from 'react';


import { TextField } from '@mui/material';

import { toast } from "react-toastify";

export default function BillManualSelector({values, setFieldValue, errors, touched, index, setBillExists, debouncedCheckBill}) {

return (
<>
<TextField
        id="codigoFactura"
        label="Código Factura *"
        fullWidth
        
        value={values?.billId || ''}
        error={ Boolean(errors?.billId)}
        helperText={errors?.billId}
        InputProps={{
                
             inputProps: {
      maxLength: 25  // Límite HTML nativo como respaldo

    },
        disableUnderline: true,
        sx: { marginTop: "0px" }
        }}



        onChange={async (event) => {
            
        const newValue = event.target.value
        const handleBillChange = async (event) => {
        const newValue = event.target.value;

        

        // Validación con debounce (solo si tiene longitud válida)
        if (newValue.length > 3) { // Ajusta este mínimo según necesites
        debouncedCheckBill(newValue, (exists) => {
        setBillExists(exists);
        if (exists) {
        toast.error(`La factura ${newValue} ya existe`);
        // Opcional: Limpiar los campos si la factura existe
        setFieldValue(`billId`, '');
        setFieldValue(`billCode`, '');
        setFieldValue(`factura`, '');
        }
        });
        }
        };
     
        // Primero actualiza el valor en el formulario para que el usuario pueda escribir
        setFieldValue(`billId`, newValue);
        setFieldValue(`billCode`, newValue);
        setFieldValue(`factura`, newValue);


       
      
        }}


        />
</>
    
    
        )

}

