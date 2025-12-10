import React from "react";
import { TextField } from "@mui/material";

export default function CurrentOwnerSelector({ values }) {
  return (
    <TextField
      label="Legítimo Tenedor"
      value={values.currentOwnerName || ""}
      fullWidth
      disabled
    />
  );
}
