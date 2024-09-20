import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Egresses } from "./queries";

export default function EgressSelect({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Egresses, init: true });

  const [egress, setEgress] = useState([]);

  useEffect(() => {
    if (data) {
      var egresss = [];
      data.data.map((egress) => {
        if (egress.description !== "transferencia") {
          egresss.push({
            label: `${egress.description}`,
            value: egress.id,
          });
        }
      });
      setEgress(egresss);
    }
  }, [data, loading, error]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Tipo</InputTitles>
        <Autocomplete
          id="typeExpenditure"
          disablePortal
          disabled={disabled}
          options={egress}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("typeExpenditure", value.value);
            } else {
              formik.setFieldValue("typeExpenditure", null);
            }
          }}
          color="#5EA3A3"
          value={
            egress.filter(
              (option) => option.value === formik.values.typeExpenditure
            )[0] || null
          }
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="egress"
              placeholder="Tipo"
              value={formik.values.typeExpenditure}
              error={
                formik.touched.typeExpenditure &&
                Boolean(formik.errors.typeExpenditure)
              }
              sx={
                formik.touched.typeExpenditure &&
                Boolean(formik.errors.typeExpenditure)
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
          {formik.touched.typeExpenditure && formik.errors.typeExpenditure}
        </HelperText>
      </Box>
    </Box>
  );
}
