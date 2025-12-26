import React from "react";
import { TextField } from "@mui/material";

export default function EmitterSelector({ values }) {
  return (
    <TextField
      label="Nombre Emisor *"
      value={values.emitter || ""}
      fullWidth
      disabled
    />
  );
}
