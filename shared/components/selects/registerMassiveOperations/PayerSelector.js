import React, { useMemo } from "react";
import { toast } from "react-toastify";
import { TextField, Autocomplete } from "@mui/material";

export default function PayerSelector({
  disabled,
  errors,
  dataBills,
  showAllPayers,
  payers,
  values,
  setFieldValue,
  setClientPagador,
  setIsSelectedPayer,
  touched,
  orchestDisabled,
}) {
  const payerOptions = useMemo(() => {
    if (showAllPayers) return payers || [];

    const bills = Array.isArray(dataBills?.data) ? dataBills.data : [];
    console.log("dataBills", dataBills?.data);
console.log("payerOptions", payerOptions);
    // Tomar todos los payerId relacionados al emisor, sin importar saldo
    const payerIdsRelacionados = [
      ...new Set(bills.map((bill) => bill?.payerId).filter(Boolean)),
    ];

    return (payers || []).filter(
      (payer) =>
        payer?.data?.document_number &&
        payerIdsRelacionados.includes(payer.data.document_number)
    );
  }, [showAllPayers, payers, dataBills]);

  const validateAndSetBills = (payerDocumentNumber) => {
    if (!payerDocumentNumber || !dataBills?.data) {
      setFieldValue("takedBills", []);
      return;
    }

    const facturasRelacionadas = dataBills.data.filter(
      (factura) => factura.payerId === payerDocumentNumber
    );

    const facturasFiltradas = facturasRelacionadas.filter(
      (factura) => Number(factura.currentBalance) > 0
    );

    if (facturasRelacionadas.length > 0 && facturasFiltradas.length === 0) {
      toast.warning(
        "Las facturas relacionadas entre el emisor y el pagador no tienen saldo disponible para realizar una operación."
      );
    }

    setFieldValue("takedBills", facturasFiltradas);
  };

  return (
    <Autocomplete
      id="payer-name"
      data-testid="campo-pagador"
      disabled={disabled}
      options={payerOptions}
      value={payers.find((p) => p.id === values.nombrePagador) || null}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      getOptionLabel={(option) => option?.label || ""}
      onChange={async (event, newValue) => {
        const indicesEnModoCreacion = orchestDisabled
          ?.filter((item) => item.status === true)
          .map((item) => item.indice);

        setIsSelectedPayer(true);

        if (!newValue) {
          const confirmChange = window.confirm(
            "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
          );

          if (!confirmChange) return;

          setClientPagador(null);
          setIsSelectedPayer(false);

          const facturasPorCuenta = values.facturas.reduce(
            (acc, factura, idx) => {
              const esCreada =
                orchestDisabled.find((item) => item.indice === idx)?.status === true ||
                factura.is_creada;

              if (esCreada) return acc;

              const cuentaId = factura.idCuentaInversionista;
              if (!acc[cuentaId]) {
                acc[cuentaId] = [];
              }
              acc[cuentaId].push({ factura, index: idx });
              return acc;
            },
            {}
          );

          Object.entries(facturasPorCuenta).forEach(
            ([cuentaId, facturasConIdx]) => {
              if (facturasConIdx.length > 1) {
                facturasConIdx.forEach(({ index }) => {
                  setFieldValue(
                    `facturas[${index}].montoDisponibleCuenta`,
                    values.facturas[index].montoDisponibleInfo
                  );
                });
              }
            }
          );

          const nuevasFacturas = values.facturas.map((f, index) => {
            const esCreada =
              orchestDisabled.find((item) => item.indice === index)?.status === true ||
              f.is_creada;

            if (esCreada) {
              return f;
            }

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
              is_creada: false,
            };
          });

          setFieldValue("facturas", nuevasFacturas);
          setFieldValue("nombrePagador", "");
          setFieldValue("nombrepayer", "");
          setFieldValue("filtroEmitterPagador.payer", "");
          setFieldValue("takedBills", []);

          return;
        }

        if (values.nombrePagador && newValue.id !== values.nombrePagador) {
          const confirmChange = window.confirm(
            "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
          );

          if (!confirmChange) return;

          const nuevasFacturas = values.facturas.map((f, index) => {
            const esCreada =
              orchestDisabled.find((item) => item.indice === index)?.status === true ||
              f.is_creada;

            if (esCreada) {
              return f;
            }

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
              is_creada: false,
            };
          });

          if (nuevasFacturas.length === 0) {
            nuevasFacturas.push({
              fechaEmision: new Date().toISOString().substring(0, 10),
              expirationDate: "",
              valorFuturo: 0,
              presentValueInvestor: 0,
              gastoMantenimiento: 0,
              is_creada: false,
              ...(values.facturas[0]
                ? {
                    nombreInversionista: values.facturas[0].nombreInversionista || "",
                    numbercuentaInversionista:
                      values.facturas[0].numbercuentaInversionista || "",
                    cuentaInversionista: values.facturas[0].cuentaInversionista || "",
                    idCuentaInversionista:
                      values.facturas[0].idCuentaInversionista || "",
                    investorBroker: values.facturas[0].investorBroker || "",
                    investorBrokerName:
                      values.facturas[0].investorBrokerName || "",
                    montoDisponibleCuenta:
                      values.facturas[0].montoDisponibleInfo || 0,
                    montoDisponibleInfo:
                      values.facturas[0].montoDisponibleInfo || 0,
                  }
                : {}),
            });
          }

          setFieldValue("facturas", nuevasFacturas);
          setFieldValue("nombrePagador", newValue.id);
          setFieldValue("nombrepayer", newValue?.label || "");
          setClientPagador(newValue.id);
          setFieldValue(
            "filtroEmitterPagador.payer",
            newValue.data?.document_number || ""
          );

          validateAndSetBills(newValue.data?.document_number);
          return;
        }

        const shouldReset =
          !newValue ||
          (values.nombrePagador && newValue.id !== values.nombrePagador);

        if (shouldReset) {
          const facturasPorCuenta = values.facturas.reduce((acc, factura) => {
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
                if (f.idCuentaInversionista === cuentaId) {
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
              if (indicesEnModoCreacion.includes(index)) {
                return f;
              }

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
              };
            })
          );

          setFieldValue("nombrePagador", "");
          setFieldValue("nombrepayer", "");
          setFieldValue("filtroEmitterPagador.payer", "");
          setFieldValue("takedBills", []);
          return;
        }

        setFieldValue("nombrePagador", newValue?.id || "");
        setFieldValue("nombrepayer", newValue?.label || "");
        setClientPagador(newValue?.id);
        setFieldValue(
          "filtroEmitterPagador.payer",
          newValue?.data?.document_number || ""
        );

        validateAndSetBills(newValue?.data?.document_number);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Pagador *"
          fullWidth
          name="nombrePagador"
          size="small"
          error={touched.nombrePagador && Boolean(errors?.nombrePagador)}
          helperText={
            touched.nombrePagador && errors?.nombrePagador
              ? errors?.nombrePagador
              : " "
          }
        />
      )}
    />
  );
}