import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { calculateOperation } from "@lib/preOperationCalculations";

const EndDateSelector = ({ factura, values, setValues, touched, errors, index }) => {
  const error = errors?.facturas?.[index]?.fechaFin;

  const handleDateChange = (newValue) => {
    const fechaFin = newValue ? new Date(newValue) : null;
    if (!fechaFin) return;

    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index ? { ...current, fechaFin } : current
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
    <DatePicker
      id={`endDatename-${index}`}
      data-testid={`campo-fechaFin-${index}`}
      label="Fecha Fin"
      value={factura.fechaFin}
      onChange={handleDateChange}
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      minDate={factura.probableDate ? new Date(factura.probableDate) : null}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          error={Boolean(error)}
          helperText={error}
          onKeyDown={(event) => {
            if (!/[0-9/]/.test(event.key) && ![
              "Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End",
            ].includes(event.key)) {
              event.preventDefault();
            }
          }}
        />
      )}
      OpenPickerButtonProps={{ "aria-label": "Seleccionar fecha" }}
      componentsProps={{ actionBar: { actions: ["clear", "accept"] } }}
    />
  );
};

export default EndDateSelector;
