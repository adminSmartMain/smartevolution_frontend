import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { ClientType } from "./queries";

export default function ClientTypeSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: ClientType, init: true });

  const [type_client, setTypeClient] = useState([]);

  useEffect(() => {
    if (data) {
      let ClientTypes = [];
      data.data.map((type_client) => {
        if (type_client.description !== "Gobierno") {
          ClientTypes.push({
            label: type_client.description,
            value: type_client.id,
          });
        }
      });

      setTypeClient(ClientTypes);
    }
  }, [data, loading, error]);

  return (
    <Box mb={5} width="calc(34vw + 3rem)">
      <Box>
        <InputTitles marginBottom={2}>Tipo de cliente</InputTitles>
        <Autocomplete
          id="type_client"
          disablePortal
          disabled={disabled}
          options={type_client}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("type_client", value.value);
            } else {
              formik.setFieldValue("type_client", null);
            }
          }}
          value={
            type_client.filter(
              (option) => option.value === formik.values.type_client
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="type_client"
              placeholder="Tipo de cliente"
              error={
                formik.touched.type_client && Boolean(formik.errors.type_client)
              }
              sx={
                formik.touched.type_client && Boolean(formik.errors.type_client)
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
        <HelperText mt={0.8}>
          {formik.touched.type_client && formik.errors.type_client}
        </HelperText>
      </Box>
    </Box>
  );
}
