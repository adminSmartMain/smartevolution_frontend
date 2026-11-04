import React from "react";
import { InputAdornment, TextField, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { applyPaidPercentage, calculateOperation } from "@lib/preOperationCalculations";

export default function PorcentajeDescuentoSelector({ values, setValues, errors, touched, factura, index }) {
  const updatePercentage = (rawValue) => {
    if (rawValue === "") {
      setValues({
        ...values,
        facturas: values.facturas.map((current, currentIndex) => (
          currentIndex === index ? { ...current, porcentajeDescuento: "" } : current
        )),
      }, false);
      return;
    }

    const percentage = Math.max(0, Math.min(100, Number(rawValue) || 0));
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? applyPaidPercentage(current, percentage) : current
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
    <TextField
      id="payedPercentname"
      data-testid="campo-payedPercent"
      label="% Pagado"
      fullWidth
      type="number"
      name="porcentajeDescuento"
      value={factura.porcentajeDescuento ?? 0}
      onChange={(event) => updatePercentage(event.target.value)}
      onBlur={(event) => {
        if (event.target.value === "") updatePercentage(0);
      }}
      error={touched.facturas?.[index]?.porcentajeDescuento && Boolean(errors.facturas?.[index]?.porcentajeDescuento)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Porcentaje del valor futuro que se paga al inversionista." placement="top-end" arrow>
              <IconButton size="small" aria-label="Información sobre porcentaje pagado">
                <InfoIcon sx={{ fontSize: "1rem", color: "rgb(94, 163, 163)" }} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
        inputProps: { min: 0, max: 100, step: "0.01", inputMode: "decimal" },
      }}
    />
  );
}
