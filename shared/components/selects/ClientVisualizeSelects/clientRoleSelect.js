import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";



export default function ClientRoleSelect({ formik, disabled,roles }) {
  // Hooks


  const [type_client, setTypeClient] = useState([]);

  useEffect(() => {
    if (roles) {
      let ClientTypes = [];
      roles.data.map((type_client) => {
        if (type_client.name !== "Gobierno") {
          ClientTypes.push({
            label: type_client.name,
            value: type_client.id,
          });
        }
      });

      setTypeClient(ClientTypes);
    }
  }, [roles]);

  return (
 
      <Box>

        <Autocomplete
          id="rol_client"
          disablePortal
          disabled={disabled}
          options={type_client}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("rol_client", value.value);
            } else {
              formik.setFieldValue("rol_client", null);
            }
          }}
          value={
            type_client.filter(
              (option) => option.value === formik?.values.rol_client
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="rol_client"
              placeholder="Rol de Cliente"
              error={
                formik?.touched.rol_client && Boolean(formik?.errors.rol_client)
              }
              sx={
                formik?.touched.rol_client && Boolean(formik?.errors.rol_client)
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
          {formik?.touched.rol_client && formik?.errors.rol_client}
        </HelperText>
      </Box>

  );
}
