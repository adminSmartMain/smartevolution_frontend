import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function TypeBillSelector({
  errors,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
  index,
  factura,
  dataTypeBill = { data: [] } // Valor por defecto ajustado a tu estructura
}) {
  // Extraemos el array de tipos de la propiedad data
  const typeBillOptions = dataTypeBill.data || [];

  const handleTypeBillChange = (event, newValue) => {
    setFieldValue(`facturas[${index}].typeBill`, newValue?.id || null);
   
  };
  console.log(typeBillOptions)
  console.log(values.facturas[index]?.typeBill)

  return (
    <Autocomplete 
      options={typeBillOptions}
      getOptionLabel={(option) => option?.description || ''}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      value={typeBillOptions.find(type => type.id === values.facturas[index]?.typeBill) || null}
      onChange={handleTypeBillChange}
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