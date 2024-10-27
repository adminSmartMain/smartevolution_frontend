import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Banks } from "./queries";

export default function BankSelect({ formik, width, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Banks, init: true });

  const [bank, setBank] = useState([]);
 

  useEffect(() => {
    if (data) {
      let banks = [];
      data.data.map((bank) => {
        banks.push({
          label: `${bank.description}`,
          value: bank.id,
        });
      });
      setBank(banks);
    }
  }, [data, loading, error]);

  useEffect(() => {
    fetch();
  }, [formik.values.client]);

  return (
    <Box
      sx={{
        ["@media (max-height: 900px)"]: {
          width: width ? width : "17vw",
        },
        width: "17vw",
      }}
    >
      <Box>
        <InputTitles marginBottom={2}>Banco</InputTitles>
        <Autocomplete
          id="bank"
          disablePortal
          disabled={disabled}
          options={bank}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("bank", value.value);
            } else {
              formik.setFieldValue("bank", null);
            }
          }}
          color="#5EA3A3"
          value={
            bank.filter((option) => option.value === formik.values.bank)[0] ||
            null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="bank"
              placeholder="Banco"
              value={formik.values.bank}
              error={formik.touched.bank && Boolean(formik.errors.bank)}
              sx={
                formik.touched.bank && Boolean(formik.errors.bank)
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
        <HelperText>{formik.touched.bank && formik.errors.bank}</HelperText>
      </Box>
    </Box>
  );
}
