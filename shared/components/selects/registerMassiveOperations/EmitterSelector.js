import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { Toast } from "@components/toast";

export default function EmitterSelector({
  disabled,
  setClientPagador,
  orchestDisabled,
  setIsSelectedPayer,
  setPendingClear,
  setIsModalEmitterAd,
  errors,
  emitterSaved,
  payers,
  setFieldTouched,
  setFieldValue,
  setEmitterSaved,
  touched,
  values,
  emisores,
  brokeDelete,
  isCreatingBill,
  fetchBrokerByClient,
  cargarTasaDescuento,
  setOpenEmitterBrokerModal,
  setClientEmitter,
  setClientBrokerEmitter,
  cargarFacturas,
}) {
  const buildFilteredPayersFromBills = (facturasEmisor = [], payers = []) => {
    const todasLasFacturasRelacionadas = (facturasEmisor || []).filter(
      (f) => Boolean(f?.payerId)
    );

    const payerIdsUnicos = [
      ...new Set(
        todasLasFacturasRelacionadas.map((f) => f.payerId).filter(Boolean)
      ),
    ];

    return (payers || []).filter(
      (p) =>
        p?.data?.document_number &&
        payerIdsUnicos.includes(p.data.document_number)
    );
  };

  return (
    <Autocomplete
      id="emitter-name"
      data-testid="campo-emisor"
      options={emisores || []}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option?.data?.id === value?.data?.id;
      }}
      getOptionLabel={(option) => {
        if (!option) return "";
        if (typeof option === "string") return option;
        return option.label || option?.data?.social_reason || "";
      }}
      value={values.emitter && typeof values.emitter === "object" ? values.emitter : null}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "clear") {
          if (brokeDelete && isCreatingBill) {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            Toast(
              "No se puede borrar el emisor mientras existan facturas creadas"
            );
            return values.emitter;
          }
        }
        return newInputValue;
      }}
      onChange={async (event, newValue) => {
        setEmitterSaved(newValue);

        if (!newValue) {
          if (isCreatingBill === true) {
            setIsModalEmitterAd(true);
            setPendingClear(true);
            return;
          }

          if (!brokeDelete) {
            setIsSelectedPayer(false);
            setFieldValue("emitter", null);
            setFieldValue("emitterLabel", "");
            setFieldValue("nombrePagador", "");
            setFieldValue("nombrepayer", "");
            setFieldValue("filtroEmitterPagador.payer", "");
            setFieldValue("takedBills", []);
            setFieldValue("filteredPayers", []);
            setFieldValue("corredorEmisor", "");

            const createdInvoices = values.facturas.filter(
              (factura) => factura.is_creada === true
            );

            if (createdInvoices.length > 0) {
              values.facturas.forEach((_, idx) => {
                setFieldValue(`facturas[${idx}].is_creada`, false);
              });
            } else {
              values.facturas.forEach((_, idx) => {
                setFieldValue(`facturas[${idx}].is_creada`, false);
              });
            }

            const indicesCreadas = orchestDisabled
              .filter((item) => item.status === true)
              .map((item) => item.indice);

            const facturasPorCuenta = values.facturas.reduce((acc, factura, index) => {
              if (indicesCreadas.includes(index)) return acc;

              const cuentaId = factura.idCuentaInversionista;
              if (!acc[cuentaId]) {
                acc[cuentaId] = [];
              }
              acc[cuentaId].push(factura);
              return acc;
            }, {});

            Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
              if (facturas.length > 1) {
                values.facturas.forEach((f, index) => {
                  if (
                    f.idCuentaInversionista === cuentaId &&
                    !indicesCreadas.includes(index)
                  ) {
                    setFieldValue(
                      `facturas[${index}].montoDisponibleCuenta`,
                      f.montoDisponibleInfo
                    );
                  }
                });
              }
            });

            setFieldValue(
              "facturas",
              values.facturas.map((f, index) => {
                if (indicesCreadas.includes(index)) {
                  return f;
                }

                setClientPagador(null);
                setIsSelectedPayer(false);

                return {
                  ...Object.fromEntries(
                    Object.keys(f)
                      .filter(
                        (key) =>
                          ![
                            "nombreInversionista",
                            "numbercuentaInversionista",
                            "cuentaInversionista",
                            "idCuentaInversionista",
                            "investorBroker",
                            "investorBrokerName",
                            "montoDisponibleCuenta",
                            "montoDisponibleInfo",
                            "probableDate",
                          ].includes(key)
                      )
                      .map((key) => [
                        key,
                        typeof f[key] === "number"
                          ? 0
                          : key.includes("Date") || key.includes("fecha")
                          ? new Date().toISOString().substring(0, 10)
                          : "",
                      ])
                  ),
                  nombreInversionista: f.nombreInversionista || "",
                  numbercuentaInversionista: f.numbercuentaInversionista || "",
                  cuentaInversionista: f.cuentaInversionista || "",
                  idCuentaInversionista: f.idCuentaInversionista || "",
                  investorBroker: f.investorBroker || "",
                  investorBrokerName: f.investorBrokerName || "",
                  montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                  montoDisponibleInfo: f.montoDisponibleInfo || 0,
                  fechaFin: f.fechaFin,
                  operationDays: f.operationDays || 1,
                  diasOperaciones: f.diasOperaciones || 1,
                };
              })
            );

            if (indicesCreadas.length === 0) {
              setFieldValue("nombrePagador", "");
              setFieldValue("nombrepayer", "");
              setFieldValue("filtroEmitterPagador.payer", "");
              setFieldValue("takedBills", []);
              setFieldValue("filteredPayers", []);
              setFieldValue("corredorEmisor", 0);
              setFieldValue("discountTax", 0);
              setClientEmitter(null);
              setClientBrokerEmitter(null);
            }

            return;
          } else {
            setFieldValue("emitter", emitterSaved ?? null);
            setFieldValue(
              "emitterLabel",
              emitterSaved?.label || emitterSaved?.data?.social_reason || ""
            );
            return;
          }
        }

        if (newValue && values.emitter?.data?.id !== newValue?.data?.id) {
          const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);

          const fullName = brokerByClientFetch?.data?.first_name
            ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
            : brokerByClientFetch?.data?.social_reason;

          setFieldValue("filtroEmitterPagador.payer", "");
          setFieldValue("takedBills", []);
          setFieldValue("filteredPayers", []);
          setFieldValue("corredorEmisor", fullName);
          setClientBrokerEmitter(brokerByClientFetch?.data?.id);
          setFieldValue("filtroEmitterPagador.emitter", newValue?.data.id);
          setFieldValue("nombrePagador", "");
          setFieldValue("nombrepayer", "");

          const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
          const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0;

          setFieldValue("discountTax", discountRate);

          if (!tasaDescuento) {
            Toast(
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>
                  Disculpe, el cliente seleccionado no tiene perfil de riesgo
                  configurado. Por favor, agrege el perfil en el módulo de
                  clientes
                </span>
              </div>,
              "warning"
            );
            return;
          }

          if (!brokerByClientFetch) {
            setOpenEmitterBrokerModal(true);
            return;
          }

          setFieldValue("emitter", newValue);
          setFieldValue(
            "emitterLabel",
            newValue?.label || newValue?.data?.social_reason || ""
          );
          setClientEmitter(newValue);

          setFieldValue("emitterBroker", brokerByClientFetch?.data?.id);
          setClientBrokerEmitter(brokerByClientFetch?.data?.id);

          setFieldValue(
            "facturas",
            values.facturas.map((factura) => ({
              ...factura,
              factura: "",
            }))
          );

          setFieldValue("investorTax", 0);
          setFieldTouched("corredorEmisor", true);

          if (newValue?.data.id) {
            const facturasEmisor = await cargarFacturas(
              newValue?.data.id,
              values.filtroEmitterPagador.payer
            );

            if (facturasEmisor?.data) {
              const pagadoresFiltrados = buildFilteredPayersFromBills(
                facturasEmisor.data,
                payers
              );

              setFieldValue("filteredPayers", pagadoresFiltrados);
            }
          }
        } else if (newValue && values.emitter?.data?.id === newValue?.data?.id) {
          const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);

          const fullName = brokerByClientFetch?.data?.first_name
            ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
            : brokerByClientFetch?.data?.social_reason;

          setFieldValue("corredorEmisor", fullName);
          setClientBrokerEmitter(brokerByClientFetch?.data?.id);
          setFieldValue("filtroEmitterPagador.emitter", newValue?.data.id);

          const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);

          if (!tasaDescuento) {
            Toast(
              <div style={{ display: "flex", alignItems: "center" }}>
                <ErrorIcon style={{ marginRight: "10px", color: "#d32f2f" }} />
                <span>
                  Disculpe, el cliente seleccionado no tiene perfil de riesgo
                  configurado. Por favor, agrege el perfil en el módulo de
                  clientes
                </span>
              </div>,
              "warning"
            );
            return;
          }

          if (!brokerByClientFetch) {
            setOpenEmitterBrokerModal(true);
            return;
          }

          setFieldValue("emitter", newValue);
          setFieldValue(
            "emitterLabel",
            newValue?.label || newValue?.data?.social_reason || ""
          );
          setClientEmitter(newValue);

          setFieldValue("emitterBroker", brokerByClientFetch?.data?.id);
          setClientBrokerEmitter(brokerByClientFetch?.data?.id);

          setFieldValue(
            "facturas",
            values.facturas.map((factura) => ({
              ...factura,
              factura: "",
            }))
          );

          const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0;

          setFieldValue("investorTax", 0);
          setFieldValue("discountTax", discountRate);
          setFieldTouched("corredorEmisor", true);

          if (newValue?.data.id) {
            const facturasEmisor = await cargarFacturas(
              newValue?.data.id,
              values.filtroEmitterPagador.payer
            );

            if (facturasEmisor?.data) {
              const pagadoresFiltrados = buildFilteredPayersFromBills(
                facturasEmisor.data,
                payers
              );

              setFieldValue("filteredPayers", pagadoresFiltrados);
            }
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Emisor *"
          name="emitter"
          fullWidth
          size="small"
          error={touched.emitter && Boolean(errors?.emitter)}
          helperText={touched.emitter && errors?.emitter ? errors?.emitter : " "}
        />
      )}
    />
  );
}