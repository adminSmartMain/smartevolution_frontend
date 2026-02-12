import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { AccountTypes } from "./queries";

export default function AccountTypeSelect({ formik, width }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: AccountTypes, init: true });

  const [accountType, setAccountType] = useState([]);

  useEffect(() => {
    if (data) {
      var accountTypes = [];
      data.data.map((accountType) => {
        accountTypes.push({
          label: `${accountType.description}`,
          value: accountType.id,
        });
      });
      setAccountType(accountTypes);
    }
  }, [data, loading, error]);

  useEffect(() => {
    fetch({ client: formik.values.client });
  }, [formik.values.client]);

  return (
    <Box sx={{
      ["@media (max-height: 900px)"]: {
        width:width ? width : "17vw",
      },
      width: "17vw",
    }}>
      <Box>
        <InputTitles marginBottom={1}>Tipo de cuenta</InputTitles>
        <Autocomplete
          id="account_type"
          disablePortal
          options={accountType}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("account_type", value.value);
            } else {
              formik.setFieldValue("account_type", null);
            }
          }}
          color="#5EA3A3"
          value={
            accountType.filter(
              (option) => option.value === formik.values.account_type
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="account_type"
              placeholder="Tipo de cuenta"
              value={formik.values.account_type}
              error={
                formik.touched.account_type && Boolean(formik.errors.account_type)
              }
              sx={
                formik.touched.account_type && Boolean(formik.errors.account_type)
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
        <HelperText>
          {formik.touched.account_type && formik.errors.account_type}
        </HelperText>
      </Box>
    </Box>
  );
}
