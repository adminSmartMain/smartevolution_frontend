import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { receiptStatus } from "./queries";

export default function ReceiptStatusSelect({ formik, disabled, ml }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: receiptStatus, init: true });

  const [dataReceiptStatus, setDataReceiptStatus] = useState([]);

  useEffect(() => {
    if (data) {
     const receiptStatus = data.data.map((x) => {
        return {label: x.description, value: x.id }
      });

      setDataReceiptStatus(receiptStatus);
    }
  }, [data, loading, error]);

  return (
    <>
      <Box position="relative" sx={{
        marginLeft: ml ? ml : 0
      }}>
        <Box width="17vw">
          <InputTitles marginBottom={2}>Tipo de Recaudo</InputTitles>
          <Autocomplete
            disablePortal
            disabled={disabled}
            id="receiptStatus"
            options={dataReceiptStatus}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              if (value !== null) {
                formik.setFieldValue("receiptStatus", value.value);
              } else {
                formik.setFieldValue("receiptStatus", null);
              }
            }}
            color="#5EA3A3"
            value={
              dataReceiptStatus.filter(
                (option) => option.value === formik.values.receiptStatus
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <MuiTextField
                variant="standard"
                {...params}
                placeholder="Tipo de Recaudo"
                error={
                  formik.touched.receiptStatus &&
                  Boolean(formik.errors.receiptStatus)
                }
                sx={
                  formik.touched.receiptStatus &&
                  Boolean(formik.errors.receiptStatus)
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
          {formik.touched.receiptStatus && formik.errors.receiptStatus}
        </HelperText>
      </Box>
    </>
  );
}
