import { useEffect } from "react";
import { useRouter } from "next/router";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useFetch } from "@hooks/useFetch";
import { getOperationPreviewById } from "../queries";

const formatCurrency = (value) => {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const Detail = ({
  label,
  value,
  strong = false,
}) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        mb: 0.5,
      }}
    >
      {label}
    </Typography>

    <Typography
      fontSize={14}
      fontWeight={strong ? 700 : 600}
      color="#364242"
    >
      {value ?? "—"}
    </Typography>
  </Box>
);

const getOperationEventConfig = (notification) => {
  switch (notification?.eventType) {
    case "OPERATION_EXPIRING":
      return {
        label: "Próxima a vencer",
        background: "#FFF7E6",
        color: "#9A6700",
        actionLabel: "Abrir operación completa",
      };

    case "OPERATION_EXPIRED":
      return {
        label: "Vencida",
        background: "#FFF1F1",
        color: "#B42318",
        actionLabel: "Abrir operación completa",
      };

    case "OPERATION_CANCELLED":
      return {
        label: "Cancelada",
        background: "#F4F4F5",
        color: "#52525B",
        actionLabel: "Abrir operación completa",
      };

    case "OPERATION_REJECTED":
      return {
        label: "Rechazada",
        background: "#FFF1F1",
        color: "#B42318",
        actionLabel: "Abrir operación completa",
      };

    case "OPERATION_APPROVED":
      return {
        label: "Aprobada",
        background: "#EEF7F2",
        color: "#18794E",
        actionLabel: "Abrir operación completa",
      };

    default:
      return {
        label: "Operación",
        background: "#EEF5F5",
        color: "#488B8F",
        actionLabel: "Abrir operación completa",
      };
  }
};

export default function OperationPreview({
  notification,
}) {
  const router = useRouter();

  const eventConfig =
  getOperationEventConfig(notification);

  const {
    fetch: fetchOperation,
    loading,
    error,
    data,
  } = useFetch({
    service: getOperationPreviewById,
    init: false,
  });

  useEffect(() => {
    if (notification?.entity?.id) {
      fetchOperation(notification.entity.id);
    }
  }, [notification?.entity?.id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        No fue posible cargar la operación.
      </Alert>
    );
  }

  const operation = data?.data;

  if (!operation) {
    return (
      <Alert severity="info">
        Selecciona una operación para ver su información.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "#488B8F",
              fontWeight: 700,
              letterSpacing: 0.7,
            }}
          >
            Operación
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="#364242"
          >
            {operation.opId
              ? `OP-${operation.opId}`
              : notification.entity?.label}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            {notification.message}
          </Typography>
        </Box>

        <Chip
          label={eventConfig.label}
          size="small"
          sx={{
            bgcolor: eventConfig.background,
            color: eventConfig.color,
            fontWeight: 700,
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Datos generales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Detail
            label="Tipo de operación"
            value={operation.opType?.description}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Fecha de operación"
            value={formatDate(operation.opDate)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Emisor"
            value={
              operation.emitter?.social_reason ||
              [
                operation.emitter?.first_name,
                operation.emitter?.last_name,
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Pagador"
            value={
              operation.payer?.social_reason ||
              [
                operation.payer?.first_name,
                operation.payer?.last_name,
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Inversionista"
            value={
              operation.investor?.social_reason ||
              [
                operation.investor?.first_name,
                operation.investor?.last_name,
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Factura asociada"
            value={operation.bill?.billId}
          />
        </Grid>
      </Grid>

      {/* Resumen financiero */}
      <Box
        sx={{
          mt: 3,
          p: 2.5,
          border: "1px solid #E5EAEA",
          borderRadius: 2,
          bgcolor: "#FAFCFC",
        }}
      >
        <Typography
          fontSize={14}
          fontWeight={700}
          color="#364242"
          sx={{ mb: 2 }}
        >
          Resumen de la operación
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={6} md={4}>
            <Detail
              label="Monto"
              value={formatCurrency(operation.amount)}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Valor nominal"
              value={formatCurrency(
                operation.payedAmount
              )}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Valor presente"
              value={formatCurrency(
                operation.presentValueInvestor
              )}
              strong
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Tasa inversionista"
              value={
                operation.investorTax !== null &&
                operation.investorTax !== undefined
                  ? `${operation.investorTax}%`
                  : "—"
              }
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Días de operación"
              value={
                operation.operationDays
                  ? `${operation.operationDays} días`
                  : "—"
              }
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Utilidad inversionista"
              value={formatCurrency(
                operation.investorProfit
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Datos complementarios */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Detail
              label="Corredor del emisor"
              value={
                operation.emitterBroker
                  ? `${operation.emitterBroker.first_name || ""} ${
                      operation.emitterBroker.last_name || ""
                    }`.trim()
                  : "—"
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Detail
              label="Corredor del inversionista"
              value={
                operation.investorBroker
                  ? `${operation.investorBroker.first_name || ""} ${
                      operation.investorBroker.last_name || ""
                    }`.trim()
                  : "—"
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >

        {notification.eventType === "OPERATION_EXPIRING" &&
          notification.metadata?.expirationDate && (
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                borderRadius: 2,
              }}
            >
              Esta operación vence el{" "}
              {formatDate(
                notification.metadata.expirationDate
              )}
              .
            </Alert>
          )}
        <Button
          endIcon={<OpenInNewIcon />}
          onClick={() =>
            router.push(
              `/pre-operations/detailPreOp?id=${operation.id}`
            )
          }
          sx={{
            color: "var(--primary-color)",
            fontWeight: 600,
          }}
        >
          {eventConfig.actionLabel}
        </Button>
      </Box>
    </Box>
  );
}