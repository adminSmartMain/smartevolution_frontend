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
import { billById } from "@views/bills/detailBill/queries";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const Detail = ({ label, value, strong = false }) => (
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

export default function BillPreview({ notification }) {
  const router = useRouter();

  const {
    fetch: fetchBill,
    loading,
    error,
    data,
  } = useFetch({
    service: billById,
    init: false,
  });

  useEffect(() => {
    if (notification?.entity?.id) {
      fetchBill(notification.entity.id);
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
        No fue posible cargar la factura.
      </Alert>
    );
  }

  const bill = data?.data;

  if (!bill) {
    return (
      <Alert severity="info">
        Selecciona una factura para ver su información.
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
            Factura
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="#364242"
          >
            {bill.billId || notification.entity?.label}
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
          label={
            notification.eventType === "BILL_EXPIRED"
              ? "Vencida"
              : "Factura"
          }
          size="small"
          sx={{
            bgcolor:
              notification.eventType === "BILL_EXPIRED"
                ? "#FFF1F1"
                : "#EEF5F5",
            color:
              notification.eventType === "BILL_EXPIRED"
                ? "#B42318"
                : "#488B8F",
            fontWeight: 700,
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Datos generales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Detail
            label="Emisor"
            value={bill.emitterName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Pagador"
            value={bill.payerName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Fecha de emisión"
            value={formatDate(bill.dateBill)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Vencimiento"
            value={formatDate(bill.expirationDate)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Valor de factura"
            value={formatCurrency(bill.billValue)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Detail
            label="Saldo actual"
            value={formatCurrency(bill.currentBalance)}
            strong
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
          Resumen financiero
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={6} md={4}>
            <Detail
              label="Subtotal"
              value={formatCurrency(bill.subTotal)}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="IVA"
              value={formatCurrency(bill.iva)}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Total"
              value={formatCurrency(bill.total)}
              strong
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Ret. fuente"
              value={formatCurrency(bill.ret_fte)}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Ret. ICA"
              value={formatCurrency(bill.ret_ica)}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <Detail
              label="Otras retenciones"
              value={formatCurrency(bill.other_ret)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Información adicional */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Detail
              label="Legítimo tenedor"
              value={bill.currentOwnerName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Detail
              label="Sincronización Billy"
              value={
                bill.billySyncStatus === "synced"
                  ? "Sincronizada"
                  : bill.billySyncStatus || "—"
              }
            />
          </Grid>
        </Grid>
      </Box>

      {notification.eventType === "BILL_EXPIRED" && (
        <Alert
          severity="warning"
          sx={{
            mt: 3,
            borderRadius: 2,
          }}
        >
          Esta factura alcanzó su fecha de vencimiento.
        </Alert>
      )}

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          endIcon={<OpenInNewIcon />}
          onClick={() =>
            router.push(
              `/bills/detailBill?id=${bill.id}&tab=0`
            )
          }
          sx={{
            color: "#488B8F",
            fontWeight: 600,
          }}
        >
          Abrir factura completa
        </Button>
      </Box>
    </Box>
  );
}