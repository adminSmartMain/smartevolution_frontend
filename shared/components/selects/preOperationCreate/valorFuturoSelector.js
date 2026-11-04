import React, { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { applyFutureValue, calculateOperation, toNumber } from "@lib/preOperationCalculations";

export default function ValorFuturoSelector({ index, factura, formatNumberWithThousandsSeparator, values, setValues, errors, touched }) {
  const [inputValue, setInputValue] = useState("0");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(factura.valorFuturo ? formatNumberWithThousandsSeparator(factura.valorFuturo) : "0");
    }
  }, [factura.valorFuturo, formatNumberWithThousandsSeparator, isFocused]);

  const commitValue = () => {
    const requestedValue = toNumber(inputValue.replace(/[^\d]/g, ""));
    const maximum = toNumber(factura.saldoDisponibleInfo);
    const futureValue = maximum ? Math.min(requestedValue, maximum) : requestedValue;
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? applyFutureValue(current, futureValue) : current
    ));
    const nextFacturas = calculateOperation(facturas, {
      opDate: values.opDate,
      discountTax: values.discountTax,
    });
    setValues({ ...values, facturas: nextFacturas }, false);
    setInputValue(futureValue ? formatNumberWithThousandsSeparator(futureValue) : "0");
  };

  return (
    <TextField
      id="amountname"
      data-testid="campo-valorFuturo"
      label="Valor Futuro"
      fullWidth
      type="text"
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
      helperText={`Saldo disponible: ${formatNumberWithThousandsSeparator(factura.saldoDisponibleInfo || 0)}`}
      error={touched.facturas?.[index]?.valorFuturo && Boolean(errors.facturas?.[index]?.valorFuturo)}
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
