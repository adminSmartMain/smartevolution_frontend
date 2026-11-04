import React from "react";
import { InputAdornment, TextField, Tooltip, IconButton } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { calculateOperation, toNumber } from "@lib/preOperationCalculations";

const normalize = (value) => String(value ?? "").replace(",", ".");

export default function TasaInversionistaSelector({ values, setValues, setFieldError, errors, factura, index }) {
  const error = errors?.facturas?.[index]?.investorTax;

  const updateRate = (rawValue, shouldCommit = false) => {
    if (rawValue === "" && !shouldCommit) {
      setValues({
        ...values,
        facturas: values.facturas.map((current, currentIndex) => (
          currentIndex === index ? { ...current, investorTax: "" } : current
        )),
      }, false);
      return;
    }
    if (!shouldCommit && !/^(\d+[.,]?\d*|[.,]\d+)$/.test(rawValue)) return;

    const discountTax = toNumber(values.discountTax);
    const investorTax = Math.max(0, Math.min(discountTax, toNumber(normalize(rawValue))));
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? { ...current, investorTax } : current
    ));
    setFieldError(`facturas[${index}].investorTax`, undefined);
    setValues({
      ...values,
      investorTax,
      facturas: calculateOperation(facturas, { opDate: values.opDate, discountTax }),
    }, false);
  };

  return (
    <TextField
      id={`investorTaxname-${index}`}
      data-testid="campo-investorTax"
      label="Tasa Inversionista"
      fullWidth
      type="text"
      name={`facturas[${index}].investorTax`}
      value={String(factura.investorTax ?? 0).replace(".", ",")}
      onChange={(event) => updateRate(event.target.value)}
      onBlur={(event) => updateRate(event.target.value, true)}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {error ? (
              <Tooltip title={error} arrow><ErrorIcon color="error" fontSize="small" /></Tooltip>
            ) : (
              <Tooltip title="Tasa anual pactada para este inversionista." arrow>
                <IconButton edge="end" size="small" aria-label="Información sobre tasa de inversionista">
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
