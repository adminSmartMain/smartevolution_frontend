import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { AccountTypes } from "./queries";

export default function AccountTypeSelect({ formik, width, compact = false }) {
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
    <Box
      sx={{
        width: width || "17vw",
        ["@media (max-height: 900px)"]: {
          width: width || "17vw",
        },
      }}
    >
      <Box>
        <InputTitles sx={compact ? { mb: 0.45, fontSize: "10px !important", lineHeight: 1.15, color: "#566168 !important", letterSpacing: "0.035em !important" } : { mb: 1 }}>Tipo de cuenta</InputTitles>
        <Autocomplete
          id="account_type"
          size={compact ? "small" : "medium"}
          sx={
            compact
              ? {
                  "& .MuiAutocomplete-inputRoot": {
                    minHeight: "34px !important",
                    height: "32px",
                    padding: "0 8px !important",
                    alignItems: "center",
                  },
                  "& .MuiAutocomplete-input": {
                    padding: "0 !important",
                    fontSize: "11.5px",
                    lineHeight: 1.2,
                  },
                  "& .MuiAutocomplete-endAdornment": {
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "6px",
                  },
                  "& .MuiIconButton-root": {
                    padding: "2px",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                }
              : undefined
          }
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
              sx={{
                ...(compact
                  ? {
                      height: 32,
                      minHeight: 32,
                      padding: "0 8px",
                      borderRadius: "6px",
                      "& .MuiInputBase-root": {
                        height: 32,
                        minHeight: 32,
                        padding: "0 !important",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "11.5px",
                        padding: "0 !important",
                      },
                    }
                  : {}),
                ...(formik.touched.account_type && Boolean(formik.errors.account_type)
                  ? { border: "1.4px solid #E6643180" }
                  : {}),
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: compact
                  ? {
                      marginTop: 0,
                      height: 32,
                      minHeight: 32,
                      fontSize: "11.5px",
                      alignItems: "center",
                    }
                  : {
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
