/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete } from "@mui/material";
import { Box } from "@mui/system";

import MuiTextField from "../../../styles/fields";
import HelperText from "../../../styles/helperText";
import InputTitles from "../../../styles/inputTitles";
import { useFetch } from "../../hooks/useFetch";
import { AccountingAccounts } from "./queries";

export default function AccountingAccountSelect({ formik, disabled, option }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: AccountingAccounts, init: true });

  const [account, setAccount] = useState([]);

  useEffect(() => {
    if (data) {
      var accounts = [];
      data.data.map((account) => {
        if (
          formik.values.typeExpenditure ===
          "39e0b709-cff5-42e2-b729-6a1e0a09ae07"
        ) {
          if (
            account.description === "De clientes" ||
            account.description === "Particulares"
          ) {
            accounts.push({
              label: `${account.accountNumber} - ${
                account.description.charAt(0).toUpperCase() +
                account.description.slice(1).toLowerCase()
              }`,
              value: account.id,
            });
          }
        } else if (
          formik.values.typeExpenditure ===
            "5d6524f0-521b-43b2-bf85-ea4c02e2a901" ||
          formik.values.typeExpenditure ===
            "0799fc62-fd65-4bef-af56-6747fbcadac4"
        ) {
          if (account.description === "CAJA GENERAL") {
            accounts.push({
              label: `${account.accountNumber} - ${
                account.description.charAt(0).toUpperCase() +
                account.description.slice(1).toLowerCase()
              }`,
              value: account.id,
            });
          }
        }
      });
      setAccount(accounts);
    }
  }, [data, loading, error, formik.values.typeExpenditure]);

  useEffect(() => {
    if (formik.values.client !== undefined && formik.values.client !== null) {
      fetch({ client: formik.values.client });
    } else {
      setAccount([]);
    }
  }, [formik.values.client]);

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Cuenta</InputTitles>
        <Autocomplete
          id="accountingControl"
          disablePortal
          disabled={disabled}
          options={account}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("accountingControl", value.value);
            } else {
              formik.setFieldValue("accountingControl", null);
            }
          }}
          color="#5EA3A3"
          value={
            account.filter(
              (option) => option.value === formik.values.accountingControl
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="accountingControl"
              placeholder="Cuenta"
              value={formik.values.accountingControl}
              error={
                formik.touched.accountingControl &&
                Boolean(formik.errors.accountingControl)
              }
              sx={
                formik.touched.accountingControl &&
                Boolean(formik.errors.accountingControl)
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
          {formik.touched.accountingControl && formik.errors.accountingControl}
        </HelperText>
      </Box>
    </Box>
  );
}
