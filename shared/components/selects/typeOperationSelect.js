import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { TypeOperation } from "./queries";

export default function TypeIDSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: TypeOperation, init: true });

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
        <Box width="17vw">
          <InputTitles marginBottom={2}>Tipo de operacion</InputTitles>
          <Autocomplete
            disablePortal
            disabled={disabled}
            id="opType"
            options={typeID}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              if (value !== null) {
                formik.setFieldValue("opType", value.value);
              } else {
                formik.setFieldValue("opType", null);
              }
            }}
            color="#5EA3A3"
            value={
              typeID.filter(
                (option) => option.value === formik.values.opType
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <MuiTextField
                variant="standard"
                {...params}
                placeholder="Tipo de operacion"
                error={formik.touched.opType && Boolean(formik.errors.opType)}
                sx={
                  formik.touched.opType && Boolean(formik.errors.opType)
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
          {formik.touched.opType && formik.errors.opType}
        </HelperText>
      </Box>
    </>
  );
}
