import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {TextField, Autocomplete } from '@mui/material';

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { typeReceipt } from "./queries";
export default function TypeIDSelect({ formik, mt, ml, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: typeReceipt, init: true });

  const [typeID, setTypeID] = useState([]);

  useEffect(() => {
    if (data) {
      var typesID = [];
      data.data.map((typeID) => {
        typesID.push({ label: typeID.description, value: typeID.id });
      });
      setTypeID(typesID);
    }
  }, [data, loading, error]);

  // Función para obtener el color según el tipo
  const getColorByType = (typeId) => {
    switch(typeId) {
      case '3d461dea-0545-4a92-a847-31b8327bf033': // Cancelado Anticipado
        return '#001F3F'; // Azul marino
      case '62b0ca1e-f999-4a76-a07f-be1fe4f38cfb': // Cancelado Vencido
        return '#4CAF50'; // Verde
      case 'edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0': // Parcial anticipado
        return '#F44336'; // Rojo
      case 'ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f': // Parcial vencido
        return '#FFD600'; // Amarillo
      case 'db1d1fa4-e467-4fde-9aee-bbf4008d688b': // Cancelado Vigente
        return '#9C27B0'; // Morado
      case 'd40e91b1-fb6c-4c61-9da8-78d4f258181d': // Parcial vigente
        return '#2196F3'; // Azul claro
      default:
        return '#607D8B'; // Gris azulado por defecto
    }
  };

  // Obtiene el color actual basado en el valor seleccionado
  const currentColor = formik.values.typeReceipt 
    ? getColorByType(formik.values.typeReceipt)
    : '#4CAF50'; // Verde por defecto cuando no hay selección

  return (
    <>
      <Autocomplete
        disablePortal
        id="typeReceipt"
        options={typeID}
        getOptionLabel={(option) => option.label}
        disabled={disabled}
        onChange={(e, value) => {
          if (value !== null) {
            formik.setFieldValue("typeReceipt", value.value);
          } else {
            formik.setFieldValue("typeReceipt", null);
          }
        }}
        value={
          typeID.filter(
            (option) => option.value === formik.values.typeReceipt
          )[0] || null
        }
        clearIcon={null}
        popupIcon={null}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Estado de Recaudo"
            error={formik.touched.typeReceipt && Boolean(formik.errors.typeReceipt)}
            InputProps={{
              ...params.InputProps,
              sx: {
                backgroundColor: currentColor, // Color dinámico
                color: "white",
                borderRadius: "16px",
                minHeight: "55px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:before, &:after": {
                  borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "2px solid white",
                },
                "& .MuiAutocomplete-input": {
                  textAlign: "center",
                  padding: "8px 0 12px",
                },
                transition: 'background-color 0.3s ease', // Transición suave
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li 
            {...props} 
            style={{ 
              justifyContent: "center",
              backgroundColor: getColorByType(option.value),
              color: 'white',
              margin: '4px 0',
              borderRadius: '8px'
            }}
          >
            {option.label}
          </li>
        )}
        sx={{
          "& .MuiAutocomplete-popper": {
            padding: 0,
          },
          mt: mt,
          ml: ml
        }}
      />

      <HelperText mt={0.8}>
        {formik.touched.typeReceipt && formik.errors.typeReceipt}
      </HelperText>
    </>
  );
}