import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

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


  return (
    <>
      <Box position="relative">
        <Box width="17vw" sx={{
            mt: mt,
            ml: ml
        }}>
          <InputTitles marginBottom={2}>Estado Recaudo</InputTitles>
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
            color="#5EA3A3"
            value={
              typeID.filter(
                (option) => option.value === formik.values.typeReceipt
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <MuiTextField
                variant="standard"
                {...params}
                placeholder="Estado de Recaudo"
                error={formik.touched.typeReceipt && Boolean(formik.errors.typeReceipt)}
                sx={
                  formik.touched.typeReceipt && Boolean(formik.errors.typeReceipt)
                    ? { border: "1.4px solid #E6643180" }
                    : null
                }
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    marginTop: "-7px",
                  },
                }}
              />
            )}
          />
        </Box>
        <HelperText mt={0.8}>
          {formik.touched.typeReceipt && formik.errors.typeReceipt}
        </HelperText>
      </Box>
    </>
  );
}
