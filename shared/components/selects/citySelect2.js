import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Cities } from "./queries";

export default function CitySelect2({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Cities, init: false });

  const [city, setCity] = useState([]);

  useEffect(() => {
    if (data) {
      let cities = [];
      data.data.map((city) => {
        cities.push({
          label: city.description,
          value: city.id,
        });
      });

      setCity(cities);
    }
  }, [data, loading, error]);

  useEffect(() => {
    if (
      formik.values.legal_representative?.department !== undefined &&
      formik.values.legal_representative?.department !== null
    ) {
      fetch({ department: formik.values.legal_representative?.department });
    } else {
      setCity([]);
    }
  }, [formik.values.legal_representative?.department]);

  return (
    <Box ml="3rem" width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Ciudad</InputTitles>
        <Autocomplete
          id="legal_representative.city"
          disablePortal
          disabled={disabled}
          options={city}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("legal_representative.city", value.value);
            } else {
              formik.setFieldValue("legal_representative.city", null);
            }
          }}
          value={
            city.filter(
              (option) =>
                option.value === formik.values.legal_representative?.city
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="legal_representative.city"
              id="legal_representative.city"
              placeholder="Ciudad"
              error={
                formik.touched.legal_representative?.city &&
                Boolean(formik.errors.legal_representative?.city)
              }
              sx={
                formik.touched.legal_representative?.city &&
                Boolean(formik.errors.legal_representative?.city)
                  ? { border: "1.4px solid #E6643180" }
                  : null
              }
              value={formik.values.legal_representative?.city}
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
        {formik.touched.legal_representative?.city &&
          formik.errors.legal_representative?.city}
      </HelperText>
    </Box>
  );
}
