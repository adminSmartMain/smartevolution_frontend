import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function PayerSelector({
  disabled,
  errors,
  showAllPayers,
  payers,
  values,
  setFieldValue,
  setClientPagador,
  setIsSelectedPayer,
  touched,
  orchestDisabled,
  fetchOperationsByEmitterPayer,
}) {
  const getClientData = (option) => option?.data || option || {};

  const getClientId = (option) =>
    option?.data?.id || option?.id || option?.value || "";

  const getClientLabel = (option) => {
    const data = getClientData(option);

    return (
      option?.label ||
      data?.social_reason ||
      data?.full_name ||
      `${data?.first_name || ""} ${data?.last_name || ""}`.trim() ||
      data?.document_number ||
      ""
    );
  };

  const payerOptions = useMemo(() => {
    if (showAllPayers) return Array.isArray(payers) ? payers : [];

    if (Array.isArray(values?.filteredPayers)) {
      return values.filteredPayers;
    }

    return [];
  }, [showAllPayers, payers, values?.filteredPayers]);

  const selectedPayer = useMemo(() => {
    const currentId =
      values?.payer?.data?.id ||
      values?.payer?.id ||
      values?.payer?.value ||
      values?.payerId ||
      values?.nombrePagador ||
      "";

    if (!currentId) return null;

    return (
      payerOptions.find(
        (option) => String(getClientId(option)) === String(currentId)
      ) ||
      values?.payer ||
      null
    );
  }, [payerOptions, values?.payer, values?.payerId, values?.nombrePagador]);

  const getEmitterId = () =>
    values?.emitter?.data?.id ||
    values?.emitter?.id ||
    values?.emitter?.value ||
    values?.emitterId ||
    values?.filtroEmitterPagador?.emitter ||
    "";

  const mapOperationToBillRow = (op, payerId, payerLabel, emitterId) => ({
    ...op,

    id: op?.preOperationId || op?.id,
    preOperationId: op?.preOperationId || op?.id,

    billUniqueId: op?.billUniqueId || op?.bill?.id || "",
    billId: op?.billId || op?.bill?.billId || "",

    currentBalance: Number(
      op?.currentBalance ??
        op?.bill?.currentBalance ??
        op?.amount ??
        op?.billValue ??
        op?.bill?.billValue ??
        0
    ),

    billValue: Number(
      op?.billValue ??
        op?.bill?.billValue ??
        op?.amount ??
        0
    ),

    dateBill: op?.dateBill || op?.bill?.dateBill || op?.opDate || "",
    expirationDate:
      op?.expirationDate || op?.bill?.expirationDate || "",

    payerId: op?.payerId || op?.bill?.payerId || payerId,
    payerName: op?.payerName || op?.bill?.payerName || payerLabel,

    emitterId: op?.emitterId || op?.bill?.emitterId || emitterId,
    emitterName: op?.emitterName || op?.bill?.emitterName || "",

    investorName:
      op?.investorName ||
      op?.clientAccount?.clientName ||
      op?.clientAccount?.client?.social_reason ||
      `${op?.clientAccount?.client?.first_name || ""} ${
        op?.clientAccount?.client?.last_name || ""
      }`.trim() ||
      op?.payerName ||
      op?.bill?.payerName ||
      payerLabel,

    fraction:
      op?.fraction ||
      op?.frac ||
      op?.billFraction ||
      op?.bill?.fraction ||
      1,
  });

  const loadOperationsByEmitterPayer = async (payer) => {
    const emitterId = getEmitterId();
    const payerId = getClientId(payer);
    const payerLabel = getClientLabel(payer);

    if (!emitterId || !payerId) {
      setFieldValue("takedBills", []);
      setFieldValue("billsToNegotiate", []);
      return;
    }

    try {
      const response = await fetchOperationsByEmitterPayer({
        emitterId,
        payerId,
      });

      const operations =
        response?.data?.data ||
        response?.data ||
        response?.results ||
        [];

      const mappedOperations = operations.map((op) =>
        mapOperationToBillRow(op, payerId, payerLabel, emitterId)
      );

      setFieldValue("takedBills", mappedOperations);
      setFieldValue("billsToNegotiate", []);
      setFieldValue("receiptPreviewRows", []);
      setFieldValue("receiptPreviewSummary", {});
      setFieldValue("investorAssignments", []);
    } catch (error) {
      console.error("Error cargando operaciones por emisor y pagador:", error);
      setFieldValue("takedBills", []);
      setFieldValue("billsToNegotiate", []);
    }
  };

  const handleChange = async (_, newValue) => {
    if (!newValue) {
      setFieldValue("payer", null);
      setFieldValue("payerId", "");
      setFieldValue("nombrePagador", "");
      setFieldValue("nombrepayer", "");
      setFieldValue("filtroEmitterPagador.payer", "");

      setClientPagador?.(null);
      setIsSelectedPayer?.(false);

      setFieldValue("takedBills", []);
      setFieldValue("billsToNegotiate", []);
      setFieldValue("receiptPreviewRows", []);
      setFieldValue("receiptPreviewSummary", {});
      setFieldValue("investorAssignments", []);

      return;
    }

    const payerId = getClientId(newValue);
    const payerLabel = getClientLabel(newValue);

    setFieldValue("payer", newValue);
    setFieldValue("payerId", payerId);
    setFieldValue("nombrePagador", payerId);
    setFieldValue("nombrepayer", payerLabel);
    setFieldValue("filtroEmitterPagador.payer", payerId);

    setClientPagador?.(getClientData(newValue));
    setIsSelectedPayer?.(true);

    await loadOperationsByEmitterPayer(newValue);
  };

  return (
    <Autocomplete
      id="payer-name"
      disabled={disabled}
      options={payerOptions}
      value={selectedPayer}
      isOptionEqualToValue={(option, value) =>
        String(getClientId(option)) === String(getClientId(value))
      }
      getOptionLabel={(option) => getClientLabel(option)}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Pagador *"
          name="nombrePagador"
          size="small"
          fullWidth
          error={Boolean(
            (touched?.nombrePagador || touched?.payerId) &&
              (errors?.nombrePagador || errors?.payerId)
          )}
          helperText={
            (touched?.nombrePagador || touched?.payerId) &&
            (errors?.nombrePagador || errors?.payerId)
              ? errors?.nombrePagador || errors?.payerId
              : " "
          }
        />
      )}
    />
  );
}