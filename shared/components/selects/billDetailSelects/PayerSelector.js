import React from "react";
import { TextField } from "@mui/material";

export default function PayerSelector({ values }) {
  return (
    <TextField
      label="Nombre Pagador *"
      value={values.payerName || ""}
      fullWidth
      disabled
    />
  );
}
