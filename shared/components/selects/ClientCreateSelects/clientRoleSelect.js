import { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

export default function ClientRoleSelect({ formik, disabled, roles }) {
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (!roles?.data) return;

    const opts = roles.data
      .filter((r) => r.name !== "Gobierno")
      .map((r) => ({
        label: r.name,
        value: r.id,
      }));

    setRoleOptions(opts);
  }, [roles]);

  // ✅ Formik value -> siempre array
  const selectedIds = useMemo(() => {
    const v = formik?.values?.rol_client;

    if (Array.isArray(v)) return v;
    if (v) return [v]; // compat si venías guardando un solo id (string)
    return [];
  }, [formik?.values?.rol_client]);

  const toggleRole = (roleId) => {
    const set = new Set(selectedIds);

    if (set.has(roleId)) set.delete(roleId);
    else set.add(roleId);

    formik.setFieldValue("rol_client", Array.from(set));
  };

  const showError = Boolean(formik?.touched?.rol_client && formik?.errors?.rol_client);

  return (
    <Box sx={{ width: "100%" }}>
      <InputTitles>Rol de Cliente</InputTitles>

      <Box
        sx={{
          mt: 1,
          p: 1.5,
          borderRadius: "10px",
          border: showError ? "1.4px solid #E6643180" : "1px solid #D9E7E7",
          backgroundColor: disabled ? "#F7F7F7" : "#fff",
        }}
      >
        <FormGroup>
          {roleOptions.map((role) => {
            const checked = selectedIds.includes(role.value);

            return (
              <FormControlLabel
                key={role.value}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontWeight: 600,
                    color: "#444",
                    fontSize: 14,
                  },
                }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => toggleRole(role.value)}
                    disabled={disabled}
                    sx={{
                      color: "#5EA3A3",
                      "&.Mui-checked": { color: "#5EA3A3" },
                      py: 0.5,
                    }}
                  />
                }
                label={role.label}
              />
            );
          })}
        </FormGroup>
      </Box>

      <HelperText mt={0.8}>{showError ? formik?.errors?.rol_client : ""}</HelperText>
    </Box>
  );
}
