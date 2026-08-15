import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Cities } from "./queries";

export default function CitySelect({ formik, disabled }) {
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
      var cities = [];
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
      formik?.values.department !== undefined &&
      formik?.values.department !== null
    ) {
      fetch({ department: formik?.values.department });
    } else {
      setCity([]);
    }
  }, [formik?.values.department]);

  return (
 
      <Box>
 
        <Autocomplete
          id="city"
          disablePortal
          disabled={disabled}
          options={city}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("city", value.value);
            } else {
              formik.setFieldValue("city", null);
            }
          }}
          value={
            city.filter((option) => option.value === formik.values.city)[0] ||
            null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="city"
              id="cityTextField"
              placeholder="Ciudad"
              value={formik?.values.city}
              error={formik?.touched.city && Boolean(formik.errors.city)}
              sx={
                formik?.touched.city && Boolean(formik.errors.city)
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
          {formik?.touched.city && formik?.errors.city}
        </HelperText>
      </Box>
  
  );
}
