import React from "react";
import { InputAdornment, TextField, Tooltip, IconButton } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { calculateOperation, toNumber } from "@lib/preOperationCalculations";

const normalize = (value) => String(value ?? "").replace(",", ".");

export default function TasaDescuentoSelector({ values, setValues, setFieldError, errors }) {
  const error = errors?.discountTax;

  const updateRate = (rawValue) => {
    if (rawValue === "") {
      setValues({ ...values, discountTax: "" }, false);
      return;
    }
    if (!/^(\d+[.,]?\d*|[.,]\d+)$/.test(rawValue)) return;

    const discountTax = Math.max(0, Math.min(100, toNumber(normalize(rawValue))));
    setValues({
      ...values,
      discountTax,
      facturas: calculateOperation(values.facturas, { opDate: values.opDate, discountTax }),
    }, false);
  };

  const commitRate = (rawValue) => {
    const discountTax = Math.max(0, Math.min(100, toNumber(normalize(rawValue))));
    setFieldError("discountTax", undefined);
    setValues({
      ...values,
      discountTax,
      facturas: calculateOperation(values.facturas, { opDate: values.opDate, discountTax }),
    }, false);
  };

  return (
    <TextField
      id="discountTaxname"
      data-testid="campo-discountTax"
      label="Tasa Descuento"
      fullWidth
      type="text"
      InputLabelProps={{ shrink: true }}
      value={String(values.discountTax ?? 0).replace(".", ",")}
      onChange={(event) => updateRate(event.target.value)}
      onBlur={(event) => commitRate(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {error ? (
              <Tooltip title={error} arrow>
                <ErrorIcon color="error" fontSize="small" />
              </Tooltip>
            ) : (
              <Tooltip title="Tasa anual de descuento aplicada por la mesa." arrow>
                <IconButton edge="end" size="small" aria-label="Información sobre tasa de descuento">
                  <InfoIcon sx={{ fontSize: "1rem", color: "rgb(94, 163, 163)" }} />
                </IconButton>
              </Tooltip>
            )}
          </InputAdornment>
        ),
        inputProps: { min: 0, max: 100, step: "0.01", inputMode: "decimal" },
      }}
    />
  );
}
