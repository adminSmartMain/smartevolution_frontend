import React, { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { applyNominalValue, calculateOperation } from "@lib/preOperationCalculations";

export default function ValorNominalSelector({ factura, index, setValues, values, errors, touched, formatNumberWithThousandsSeparator }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(factura.valorNominal ? formatNumberWithThousandsSeparator(factura.valorNominal) : "");
    }
  }, [factura.valorNominal, formatNumberWithThousandsSeparator, isFocused]);

  const commitValue = () => {
    const rawValue = inputValue.replace(/[^\d]/g, "");
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? applyNominalValue(current, rawValue) : current
    ));
    const nextFacturas = calculateOperation(facturas, {
      opDate: values.opDate,
      discountTax: values.discountTax,
    });
    setValues({ ...values, facturas: nextFacturas }, false);

    const value = nextFacturas[index].valorNominal;
    setInputValue(value ? formatNumberWithThousandsSeparator(value) : "");
  };

  return (
    <TextField
      id="payedAmountname"
      data-testid="campo-payedAmount"
      label="Valor Nominal"
      fullWidth
      name="valorNominal"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value.replace(/[^\d]/g, ""))}
      onFocus={() => {
        setIsFocused(true);
        setInputValue(inputValue.replace(/[^\d]/g, ""));
      }}
      onBlur={() => {
        setIsFocused(false);
        commitValue();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitValue();
          event.currentTarget.blur();
        }
      }}
      helperText={factura.valorNominalManual ? "Valor ingresado manualmente" : "Valor calculado desde el porcentaje pagado"}
      error={touched.facturas?.[index]?.valorNominal && Boolean(errors.facturas?.[index]?.valorNominal)}
      InputProps={{
        inputProps: { maxLength: 22 },
        startAdornment: (
          <InputAdornment position="start">
            <AttachMoneyIcon sx={{ color: "rgb(94, 163, 163)", fontSize: "1.2rem" }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
