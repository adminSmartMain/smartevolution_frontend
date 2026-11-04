import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { calculateOperation, toNumber } from "@lib/preOperationCalculations";

const accountNumber = (account) => account?.account_number || account?.number || "";

export default function CuentaInversionistaSelector({ index, factura, values, setValues, touched, errors }) {
  const accounts = Array.isArray(factura.cuentasDelInversionistaSelected)
    ? factura.cuentasDelInversionistaSelected
    : [];
  const selectedAccount = accounts.find((account) => account?.id === factura.idCuentaInversionista) || null;
  const disabled = !factura.nombreInversionista || accounts.length === 0;

  const updateAccount = (account) => {
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index
        ? {
          ...current,
          idCuentaInversionista: account?.id || "",
          numbercuentaInversionista: accountNumber(account),
          cuentaInversionista: accountNumber(account),
          montoDisponibleInfo: toNumber(account?.balance),
          montoDisponibleCuenta: toNumber(account?.balance),
        }
        : current
    ));

    setValues({
      ...values,
      facturas: calculateOperation(facturas, { opDate: values.opDate, discountTax: values.discountTax }),
    }, false);
  };

  return (
    <Autocomplete
      id={`investorAccountname-${index}`}
      data-testid="campo-investorAccount"
      options={accounts}
      value={selectedAccount}
      getOptionLabel={accountNumber}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      onChange={(_event, account) => updateAccount(account)}
      disabled={disabled}
      noOptionsText={factura.nombreInversionista ? "No hay cuentas disponibles" : "Seleccione primero un inversionista"}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cuenta Inversionista *"
          fullWidth
          variant="outlined"
          error={touched.facturas?.[index]?.numbercuentaInversionista && Boolean(errors.facturas?.[index]?.numbercuentaInversionista)}
          helperText={touched.facturas?.[index]?.numbercuentaInversionista && errors.facturas?.[index]?.numbercuentaInversionista}
        />
      )}
    />
  );
}
