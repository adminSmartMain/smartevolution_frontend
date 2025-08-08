import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function TypeBillSelector({
  errors,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
  dataTypeBill = { data: [] } ,// Valor por defecto ajustado a tu estructura
  integrationCode,
}) {
  // Extraemos el array de tipos de la propiedad data
  const typeBillOptions = dataTypeBill.data || [];

  const handleTypeBillChange = (event, newValue) => {
    setFieldValue('typeBill', newValue?.id || null);
   
  };

  return (
    <Autocomplete 
      options={typeBillOptions}
      getOptionLabel={(option) => option?.description || ''}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      value={typeBillOptions.find(type => type.id === values.typeBill) || null}
      onChange={handleTypeBillChange}
      disabled={integrationCode != null}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tipo de Factura *"
          error={touched.typeBill && Boolean(errors.typeBill)}
          helperText={touched.typeBill && errors.typeBill}
      
        />
      )}
    />
  );
}