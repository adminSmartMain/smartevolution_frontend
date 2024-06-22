import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Citizenship } from "./queries";

export default function CitizenshipSelect2({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Citizenship, init: true });

  const [citizenship, setCitizenship] = useState([]);

  useEffect(() => {
    if (data) {
      var Citizenships = [];
      data.data.map((citizenship) => {
        Citizenships.push({
          label: citizenship.name_es,
          value: citizenship.id,
        });
      });
      setCitizenship(Citizenships);
    }
  }, [data, loading, error]);

  return (
    <Box ml="3rem" width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Nacionalidad</InputTitles>
        <Autocomplete
          id="citizenship"
          disablePortal
          disabled={disabled}
          options={citizenship}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue(
                "legal_representative.citizenship",
                value.value
              );
            } else {
              formik.setFieldValue("legal_representative.citizenship", null);
            }
          }}
          color="#5EA3A3"
          value={
            citizenship.filter(
              (option) =>
                option.value === formik.values.legal_representative?.citizenship
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="legal_representative.citizenship"
              placeholder="Nacionalidad"
              error={
                formik.touched.legal_representative?.citizenship &&
                Boolean(formik.errors.legal_representative?.citizenship)
              }
              sx={
                formik.touched.legal_representative?.citizenship &&
                Boolean(formik.errors.legal_representative?.citizenship)
                  ? { border: "1.4px solid #E6643180" }
                  : null
              }
              value={formik.values.legal_representative?.citizenship}
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
        {formik.touched.legal_representative?.citizenship &&
          formik.errors.legal_representative?.citizenship}
      </HelperText>
    </Box>
  );
}
