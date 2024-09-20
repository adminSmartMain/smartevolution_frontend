import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { AccountTypes2 } from "./queries";

export default function AccountTypeSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: AccountTypes2, init: true });

  const [accountType, setAccountType] = useState([]);

  useEffect(() => {
    if (data) {
      var accountTypes = [];
      data.map((accountType) => {
        accountTypes.push({
          label: `${accountType.description}`,
          value: accountType.description,
        });
      });
      setAccountType(accountTypes);
    }
  }, [data, loading, error]);

  useEffect(() => {
    fetch({ client: formik.values.client });
  }, [formik.values.client]);

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Tipo de cuenta</InputTitles>
        <Autocomplete
          id="accountType"
          disablePortal
          disabled={disabled}
          options={accountType}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("accountType", value.value);
            } else {
              formik.setFieldValue("accountType", null);
            }
          }}
          color="#5EA3A3"
          value={
            accountType.filter(
              (option) => option.value === formik.values.accountType
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="accountType"
              placeholder="Tipo de cuenta"
              value={formik.values.accountType}
              error={
                formik.touched.accountType && Boolean(formik.errors.accountType)
              }
              sx={
                formik.touched.accountType && Boolean(formik.errors.accountType)
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
        <HelperText position="fixed">
          {formik.touched.accountType && formik.errors.accountType}
        </HelperText>
      </Box>
    </Box>
  );
}
