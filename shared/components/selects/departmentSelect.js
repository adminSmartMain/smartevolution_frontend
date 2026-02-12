import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import InputTitles from "@styles/inputTitles";

import { Departments } from "./queries";

export default function DepartmentSelect({ formik, disabled }) {
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

      <Box>
      
        <Autocomplete
          id="department"
          disablePortal
          disabled={disabled}
          options={department}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("department", value.value);
            } else {
              formik.setFieldValue("department", null);
              formik.setFieldValue("city", null);
            }
          }}
          value={
            department.filter(
              (option) => option.value === formik?.values.department
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="department"
              placeholder="Departamento"
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

  );
}
