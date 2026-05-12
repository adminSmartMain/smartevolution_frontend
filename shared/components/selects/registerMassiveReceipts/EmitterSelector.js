import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function EmitterSelector({
  disabled,
  setClientPagador,
  setIsSelectedPayer,
  setPendingClear,
  setFieldValue,
  setFieldTouched,
  setEmitterSaved,
  emitterSaved,
  touched,
  values,
  payers,
  emisores,
  brokeDelete,
  isCreatingBill,
  fetchBrokerByClient,
  cargarTasaDescuento,
  setOpenEmitterBrokerModal,
  setClientEmitter,
  setClientBrokerEmitter,
  cargarFacturas,
  fetchGetPayersFromOperationRelated,
  buildFilteredPayersFromPreoperationIds,
  errors,
  setIsModalEmitterAd,
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

  const emitterOptions = useMemo(() => {
    return Array.isArray(emisores) ? emisores : [];
  }, [emisores]);

  const selectedEmitter = useMemo(() => {
    const currentId =
      values?.emitter?.data?.id ||
      values?.emitter?.id ||
      values?.emitter?.value ||
      values?.emitterId ||
      "";

    if (!currentId) return null;

    return (
      emitterOptions.find(
        (option) => String(getClientId(option)) === String(currentId)
      ) ||
      values?.emitter ||
      null
    );
  }, [emitterOptions, values?.emitter, values?.emitterId]);

  const clearPayerAndOperations = () => {
    setClientPagador?.(null);
    setIsSelectedPayer?.(false);
    setPendingClear?.(true);

    setFieldValue("payer", null);
    setFieldValue("payerId", "");
    setFieldValue("nombrePagador", "");
    setFieldValue("nombrepayer", "");
    setFieldValue("filtroEmitterPagador.payer", "");

    setFieldValue("filteredPayers", []);
    setFieldValue("takedBills", []);
    setFieldValue("billsToNegotiate", []);
    setFieldValue("receiptPreviewRows", []);
    setFieldValue("receiptPreviewSummary", {});
    setFieldValue("investorAssignments", []);
  };

  const loadRelatedPayers = async (emitterId) => {
    if (!emitterId) {
      setFieldValue("filteredPayers", []);
      return;
    }

    try {
      if (fetchGetPayersFromOperationRelated) {
        const response = await fetchGetPayersFromOperationRelated(emitterId);

        const payerIds =
          response?.data?.data ||
          response?.data ||
          response?.results ||
          [];

        const filteredPayers = buildFilteredPayersFromPreoperationIds
          ? buildFilteredPayersFromPreoperationIds(payerIds, payers)
          : [];

        setFieldValue("filteredPayers", filteredPayers);
        return;
      }

      if (cargarFacturas) {
        const response = await cargarFacturas(emitterId);
        const bills = response?.data || response || [];

        setFieldValue("filteredPayers", bills);
      }
    } catch (error) {
      console.error("Error cargando pagadores relacionados:", error);
      setFieldValue("filteredPayers", []);
    }
  };

  const loadEmitterBroker = async (emitterId) => {
    if (!emitterId || !fetchBrokerByClient) return;

    try {
      const response = await fetchBrokerByClient(emitterId);

      const raw =
        response?.data?.data ||
        response?.data ||
        response ||
        null;

      const broker = Array.isArray(raw) ? raw[0] : raw;

      if (broker) {
        const brokerData = broker?.data || broker;
        const brokerId = broker?.id || broker?.value || brokerData?.id || "";

        setClientBrokerEmitter?.(broker);

        if (brokerId) {
          setFieldValue("emitterBroker", brokerId);
          setFieldValue("emitterBrokerId", brokerId);
        }

        const brokerName =
          broker?.label ||
          brokerData?.social_reason ||
          `${brokerData?.first_name || ""} ${brokerData?.last_name || ""}`.trim() ||
          brokerData?.name ||
          "";

        if (brokerName) {
          setFieldValue("emitterBrokerName", brokerName);
        }
      }
    } catch (error) {
      console.error("Error cargando broker del emisor:", error);
    }
  };

  const handleChange = async (_, newValue) => {
    if (!newValue) {
      setFieldValue("emitter", null);
      setFieldValue("emitterId", "");
      setFieldValue("emitterLabel", "");
      setFieldValue("filtroEmitterPagador.emitter", "");
      setClientEmitter?.(null);
      clearPayerAndOperations();
      return;
    }

    const emitterId = getClientId(newValue);
    const emitterLabel = getClientLabel(newValue);

    setFieldValue("emitter", newValue);
    setFieldValue("emitterId", emitterId);
    setFieldValue("emitterLabel", emitterLabel);
    setFieldValue("filtroEmitterPagador.emitter", emitterId);

    setClientEmitter?.(newValue);
    setEmitterSaved?.(true);

    clearPayerAndOperations();

    await loadEmitterBroker(emitterId);
    await loadRelatedPayers(emitterId);
  };

  return (
    <Autocomplete
      id="emitter-name"
      disabled={disabled}
      options={emitterOptions}
      value={selectedEmitter}
      isOptionEqualToValue={(option, value) =>
        String(getClientId(option)) === String(getClientId(value))
      }
      getOptionLabel={(option) => getClientLabel(option)}
      onChange={handleChange}
      onBlur={() => {
        setFieldTouched?.("emitter", true);
        setFieldTouched?.("emitterId", true);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Emisor *"
          name="emitter"
          size="small"
          fullWidth
          error={Boolean(
            (touched?.emitter || touched?.emitterId) &&
              (errors?.emitter || errors?.emitterId)
          )}
          helperText={
            (touched?.emitter || touched?.emitterId) &&
            (errors?.emitter || errors?.emitterId)
              ? errors?.emitter || errors?.emitterId
              : " "
          }
        />
      )}
    />
  );
}