import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { Departments } from "./queries";

export default function DepartmentSelect2({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Departments, init: true });

  const [department, setDepartment] = useState([]);

  useEffect(() => {
    if (data) {
      var departments = [];
      data.data.map((department) => {
        departments.push({
          label: department.description,
          value: department.id,
        });
      });

      setDepartment(departments);
    }
  }, [data, loading, error]);

  return (
    <Box width="17vw">
      <Box>
        <InputTitles marginBottom={2}>Departamento</InputTitles>
        <Autocomplete
          id="legal_representative.department"
          disablePortal
          disabled={disabled}
          options={department}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue(
                "legal_representative.department",
                value.value
              );
            } else {
              formik.setFieldValue("legal_representative.department", null);
              formik.setFieldValue("legal_representative.city", null);
            }
          }}
          value={
            department.filter(
              (option) =>
                option.value === formik.values.legal_representative?.department
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="legal_representative.department"
              placeholder="Departamento"
              error={
                formik.touched.legal_representative?.department &&
                Boolean(formik.errors.legal_representative?.department)
              }
              sx={
                formik.touched.legal_representative?.department &&
                Boolean(formik.errors.legal_representative?.department)
                  ? { border: "1.4px solid #E6643180" }
                  : null
              }
              value={formik.values.legal_representative?.department}
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
        {formik.touched.legal_representative?.department &&
          formik.errors.legal_representative?.department}
      </HelperText>
    </Box>
  );
}
