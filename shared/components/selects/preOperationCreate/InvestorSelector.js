import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Toast } from "@components/toast";
import { calculateOperation, toNumber } from "@lib/preOperationCalculations";

const investorLabel = (investor) => {
  if (!investor?.data) return "";
  const { first_name: firstName, last_name: lastName, social_reason: socialReason, document_number: document } = investor.data;
  const name = firstName ? `${firstName} ${lastName || ""}`.trim() : socialReason;
  return document ? `${name} - ${document}` : name || "";
};

const brokerName = (broker) => {
  if (!broker?.data) return "";
  return broker.data.first_name
    ? `${broker.data.first_name} ${broker.data.last_name || ""}`.trim()
    : broker.data.social_reason || "";
};

export default function InvestorSelector({
  setFieldTouched,
  setFieldError,
  errors,
  touched,
  setValues,
  values,
  index,
  factura,
  investors,
  cargarCuentas,
  cargarTasaDescuento,
  cargarBrokerFromInvestor,
  setClientInvestor,
}) {
  const selectionRequestId = useRef(0);
  const selectedInvestor = (investors || []).find(
    (investor) => investor?.data?.id === factura.nombreInversionista
  ) || null;
  const selectedInvestorLabel = investorLabel(selectedInvestor);
  const [inputValue, setInputValue] = useState(selectedInvestorLabel);

  // MUI preserves its search text after an onChange rejection. Keep the text
  // controlled so an invalid duplicate never looks as though it was assigned.
  useEffect(() => {
    setInputValue(selectedInvestorLabel);
  }, [selectedInvestorLabel]);

  const clearInvestor = () => {
    selectionRequestId.current += 1;
    setInputValue("");
    const facturas = values.facturas.map((current, currentIndex) => (
      currentIndex === index
        ? {
          ...current,
          nombreInversionista: "",
          idCuentaInversionista: "",
          numbercuentaInversionista: "",
          cuentaInversionista: "",
          cuentasDelInversionistaSelected: [],
          montoDisponibleInfo: 0,
          montoDisponibleCuenta: 0,
          investorBroker: "",
          investorBrokerName: "",
          investorTax: 0,
          tasaInversionistaPR: 0,
          tasaDescuentoPR: 0,
        }
        : current
    ));

    setClientInvestor(null);
    setFieldError(`facturas[${index}].nombreInversionista`, undefined);
    setValues({
      ...values,
      facturas: calculateOperation(facturas, { opDate: values.opDate, discountTax: values.discountTax }),
    }, false);
  };

  const selectInvestor = async (investor) => {
    const investorId = investor?.data?.id;
    if (!investorId) {
      clearInvestor();
      return;
    }

    // An investor may participate in different invoices. The restriction only
    // applies to fractions/rows of the *same* invoice number.
    const isAlreadyAssigned = values.facturas.some(
      (current, currentIndex) => (
        currentIndex !== index
        && String(current.billId || "") === String(factura.billId || "")
        && current.nombreInversionista === investorId
      )
    );
    if (isAlreadyAssigned) {
      setInputValue(selectedInvestorLabel);
      setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
      setFieldError(
        `facturas[${index}].nombreInversionista`,
        "No puede asignar el mismo inversionista a la misma factura"
      );
      Toast("No puede asignar el mismo inversionista a facturas con el mismo número", "error");
      return;
    }

    const requestId = ++selectionRequestId.current;
    try {
      const [accountsResponse, riskProfileResponse, brokerResponse] = await Promise.all([
        cargarCuentas(investorId),
        cargarTasaDescuento(investorId),
        cargarBrokerFromInvestor(investorId),
      ]);
      // Ignore an earlier request after the user selected/cleared another row.
      if (requestId !== selectionRequestId.current) return;
      const accounts = Array.isArray(accountsResponse?.data) ? accountsResponse.data : [];

      if (!accounts.length) {
        Toast("El inversionista seleccionado no tiene cuentas disponibles", "warning");
        clearInvestor();
        return;
      }

      const investorTax = toNumber(riskProfileResponse?.data?.discount_rate_investor);
      const defaultAccount = accounts.length === 1 ? accounts[0] : null;
      const facturas = values.facturas.map((current, currentIndex) => (
        currentIndex === index
          ? {
            ...current,
            nombreInversionista: investorId,
            cuentasDelInversionistaSelected: accounts,
            idCuentaInversionista: defaultAccount?.id || "",
            numbercuentaInversionista: defaultAccount?.account_number || defaultAccount?.number || "",
            cuentaInversionista: defaultAccount?.account_number || defaultAccount?.number || "",
            montoDisponibleInfo: toNumber(defaultAccount?.balance),
            investorBroker: brokerResponse?.data?.id || "",
            investorBrokerName: brokerName(brokerResponse),
            investorTax,
            tasaInversionistaPR: investorTax,
            tasaDescuentoPR: toNumber(riskProfileResponse?.data?.discount_rate),
            applyGm: Boolean(riskProfileResponse?.data?.gmf),
          }
          : current
      ));

      setClientInvestor(investorId);
      setInputValue(investorLabel(investor));
      setFieldError(`facturas[${index}].nombreInversionista`, undefined);
      setValues({
        ...values,
        investorTax,
        facturas: calculateOperation(facturas, { opDate: values.opDate, discountTax: values.discountTax }),
      }, false);

      if (!riskProfileResponse) {
        Toast("El inversionista no tiene perfil de riesgo; revise la tasa antes de registrar", "warning");
      }
      if (!brokerResponse?.data) {
        Toast("El inversionista no tiene corredor configurado", "warning");
      }
    } catch (error) {
      if (requestId !== selectionRequestId.current) return;
      clearInvestor();
      Toast("No fue posible cargar las cuentas del inversionista", "error");
    }
  };

  return (
    <Autocomplete
      id={`investor-name-${index}`}
      data-testid="campo-inversor"
      options={investors || []}
      value={selectedInvestor}
      inputValue={inputValue}
      getOptionLabel={investorLabel}
      isOptionEqualToValue={(option, value) => option?.data?.id === value?.data?.id}
      onChange={(_event, investor) => selectInvestor(investor)}
      onInputChange={(_event, nextInputValue) => setInputValue(nextInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Inversionista / ID *"
          fullWidth
          name={`facturas[${index}].nombreInversionista`}
          helperText={touched.facturas?.[index]?.nombreInversionista && errors.facturas?.[index]?.nombreInversionista}
          error={touched.facturas?.[index]?.nombreInversionista && Boolean(errors.facturas?.[index]?.nombreInversionista)}
        />
      )}
    />
  );
}
