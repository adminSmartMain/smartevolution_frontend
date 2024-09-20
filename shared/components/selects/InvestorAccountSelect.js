import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { AccountsFromClient } from "./queries";

export default function AccountSelect({ formik, marginLeft, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: AccountsFromClient, init: false });

  const [account, setAccount] = useState([]);

  const options1 = { style: "currency", currency: "COP" };
  const numberFormat1 = new Intl.NumberFormat("es-ES", options1);

  useEffect(() => {
    if (data) {
      var accounts = [];
      data.data.map((account) => {
        const balance = numberFormat1.format(account.balance);
        accounts.push({
          label: `${account.account_number} - ${balance.replace("COP", "")}`,
          value: account.id,
        });
      });
      setAccount(accounts);
    }
    if (error) {
      setAccount([]);
    }
  }, [data, loading, error]);
  useEffect(() => {
    if (formik.values.client !== undefined && formik.values.client !== null && formik.values.client !== "") {
      fetch({ client: formik.values.client });
    } else {
      setAccount([]);
    }
  }, [formik.values.client]);

  return (
    <Box
      sx={{
        marginLeft: marginLeft ? marginLeft : "0rem",
        width: "17vw",
        "@media (max-height: 900px)": {
          width: "20vw",
        },
      }}
    >
      <Box>
        <InputTitles marginBottom={2}>Cuenta</InputTitles>
        <Autocomplete
          id="clientAccount"
          disablePortal
          disabled={disabled}
          options={account}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("clientAccount", value.value);
            } else {
              formik.setFieldValue("clientAccount", null);
            }
          }}
          color="#5EA3A3"
          value={
            account.filter(
              (option) => option.value === formik.values.clientAccount
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="clientAccount"
              placeholder="Cuenta"
              value={formik.values.clientAccount}
              error={
                formik.touched.clientAccount &&
                Boolean(formik.errors.clientAccount)
              }
              sx={
                formik.touched.clientAccount &&
                Boolean(formik.errors.clientAccount)
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
          {formik.touched.clientAccount && formik.errors.clientAccount}
        </HelperText>
      </Box>
    </Box>
  );
}
