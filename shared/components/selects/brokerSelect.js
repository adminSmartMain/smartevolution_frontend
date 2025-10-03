import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Broker } from "./queries";

export default function BrokerSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Broker, init: true });

  const [broker, setBroker] = useState([]);

  useEffect(() => {
    if (data) {
      var Brokers = [];
      data.brokers.map((broker) => {
        Brokers.push({
          label: `${broker.first_name} ${broker.last_name}`,
          value: broker.id,
        });
      });
      setBroker(Brokers);
    }
  }, [data, loading, error]);

  console.log(data)

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Corredor</InputTitles>
        <Autocomplete
          id="broker"
          disablePortal
          disabled={disabled}
          options={broker}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("broker", value.value);
            } else {
              formik.setFieldValue("broker", null);
            }
          }}
          color="#5EA3A3"
          value={
            broker.filter(
              (option) => option.value === formik.values.broker
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="broker"
              placeholder="Corredor"
              value={formik.values.broker}
              error={formik.touched.broker && Boolean(formik.errors.broker)}
              sx={
                formik.touched.broker && Boolean(formik.errors.broker)
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
          {formik.touched.broker && formik.errors.broker}
        </HelperText>
      </Box>
    </Box>
  );
}
