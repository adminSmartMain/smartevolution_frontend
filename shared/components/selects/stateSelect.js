import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { State } from "./queries";

export default function StateTypeSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: State, init: true });

  const [stateType, setStateType] = useState([]);

  useEffect(() => {
    if (data) {
      var stateTypes = [];
      data.map((stateType) => {
        stateTypes.push({
          label: `${stateType.description}`,
          value: stateType.description,
        });
      });
      setStateType(stateTypes);
    }
  }, [data, loading, error]);

  useEffect(() => {
    fetch();
  }, [formik.values.state]);

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Estado</InputTitles>
        <Autocomplete
          id="stateType"
          disablePortal
          disabled={disabled}
          options={stateType}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("state", value.value);
            } else {
              formik.setFieldValue("state", null);
            }
          }}
          color="#5EA3A3"
          value={
            stateType.filter(
              (option) => option.value === formik.values.state
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="stateType"
              placeholder="Seleccione estado"
              value={formik.values.state}
              error={formik.touched.state && Boolean(formik.errors.state)}
              sx={
                formik.touched.state && Boolean(formik.errors.state)
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
          {formik.touched.state && formik.errors.state}
        </HelperText>
      </Box>
    </Box>
  );
}
