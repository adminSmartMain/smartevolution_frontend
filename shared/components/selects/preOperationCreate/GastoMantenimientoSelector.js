import React from "react";
import { Box, Switch, TextField } from "@mui/material";
import { calculateOperation } from "@lib/preOperationCalculations";

export default function GastoMantenimiento({ values, factura, setValues, formatCurrency, index }) {
  const updateInvoice = (changes) => {
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? { ...current, ...changes } : current
    ));
    setValues({
      ...values,
      facturas: calculateOperation(facturas, {
        opDate: values.opDate,
        discountTax: values.discountTax,
      }),
    }, false);
  };

  return (
    <Box
      sx={{
        display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center",
        gap: 0, p: 1, border: "1px solid", borderColor: "rgba(0, 0, 0, 0.23)",
        borderRadius: 2, bgcolor: "background.paper",
      }}
    >
      GM
      <Switch
        checked={Boolean(factura.applyGm)}
        onChange={(event) => updateInvoice({ applyGm: event.target.checked })}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#488B8F" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#488B8F" },
        }}
      />
      <TextField
        type="text"
        placeholder="$ 0"
        id="gastoMantenimientoname"
        data-testid="campo-gastoMantenimiento"
        value={formatCurrency(factura.gastoMantenimiento ?? 0)}
        disabled
        helperText="2‰ del valor presente del inversionista"
      />
    </Box>
  );
}
