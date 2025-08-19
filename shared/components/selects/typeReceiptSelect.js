import { useEffect, useState } from "react";
import { Autocomplete, Box, Typography, Popover } from '@mui/material';
import { useFetch } from "@hooks/useFetch";
import HelperText from "@styles/helperText";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (data) {
      const typesID = data.data.map((type) => ({
        label: type.description,
        value: type.id
      }));
      setTypeID(typesID);
      
      // Encontrar índice del valor actual
      if (formik.values.typeReceipt) {
        const index = typesID.findIndex(option => option.value === formik.values.typeReceipt);
        setSelectedIndex(index);
      }
    }
  }, [data, loading, error, formik.values.typeReceipt]);

  // Función para obtener el color según el tipo
  const getColorByType = (typeId) => {
    switch(typeId) {
      case '3d461dea-0545-4a92-a847-31b8327bf033': return '#001F3F';
      case '62b0ca1e-f999-4a76-a07f-be1fe4f38cfb': return '#4CAF50';
      case 'edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0': return '#f11000ff';
      case 'ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f': return '#FFD600';
      case 'db1d1fa4-e467-4fde-9aee-bbf4008d688b': return '#9C27B0';
      case 'd40e91b1-fb6c-4c61-9da8-78d4f258181d': return '#2196F3';
      default: return '#607D8B';
    }
  };

  // Función para determinar el color del texto según el fondo
  const getTextColor = (backgroundColor) => {
    return backgroundColor === '#FFD600' ? '#000000' : '#FFFFFF';
  };

  const currentColor = formik.values.typeReceipt 
    ? getColorByType(formik.values.typeReceipt)
    : '#4CAF50';

  const currentTextColor = getTextColor(currentColor);
  const selectedOption = typeID.find(option => option.value === formik.values.typeReceipt);

  const handleClick = (event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectOption = (option) => {
    formik.setFieldValue("typeReceipt", option.value);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'type-receipt-popover' : undefined;

  return (
    <>
      <Box sx={{ mt: mt, ml: ml }}>
        {/* Input personalizado */}
        <Box
          onClick={handleClick}
          sx={{
            backgroundColor: currentColor,
            color: currentTextColor,
            borderRadius: "16px",
            minHeight: "55px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled ? 'default' : 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            '&:hover': {
              borderColor: disabled ? 'rgba(255, 255, 255, 0.7)' : 'white',
            },
            opacity: disabled ? 0.7 : 1,
          }}
        >
          <Typography 
            sx={{ 
              textAlign: "center",
              fontWeight: selectedOption ? 'normal' : 'light',
              fontStyle: selectedOption ? 'normal' : 'italic'
            }}
          >
            {selectedOption ? selectedOption.label : "Estado de Recaudo"}
          </Typography>
        </Box>

        {/* Popover con opciones */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            '& .MuiPopover-paper': {
              borderRadius: '8px',
              overflow: 'hidden',
              marginTop: '8px',
            }
          }}
        >
          <Box sx={{ padding: '8px', minWidth: '200px' }}>
            {typeID.map((option, index) => {
              const optionColor = getColorByType(option.value);
              const optionTextColor = getTextColor(optionColor);
              
              return (
                <Box
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  sx={{
                    backgroundColor: optionColor,
                    color: optionTextColor,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    margin: '4px 0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                >
                  {option.label}
                </Box>
              );
            })}
          </Box>
        </Popover>
      </Box>

      <HelperText mt={0.8}>
        {formik.touched.typeReceipt && formik.errors.typeReceipt}
      </HelperText>
    </>
  );
}