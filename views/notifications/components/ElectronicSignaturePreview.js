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
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";

import { useFetch } from "@hooks/useFetch";
import { getElectronicSignaturePreview } from "../queries";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
};

const Detail = ({ label, value, strong = false }) => (
  <Box sx={{ minWidth: 0 }}>
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
      sx={{
        fontSize: {
          xs: 13,
          sm: 14,
        },
        fontWeight: strong ? 700 : 600,
        color: "#364242",
        wordBreak: "break-word",
      }}
    >
      {value ?? "—"}
    </Typography>
  </Box>
);

export default function ElectronicSignaturePreview({
  notification,
}) {
  const router = useRouter();

  const {
    fetch: fetchSignature,
    loading,
    error,
    data,
  } = useFetch({
    service: getElectronicSignaturePreview,
    init: false,
  });

  const opId = notification?.entity?.opId;
  const investorId =
    notification?.entity?.investorId;

  useEffect(() => {
    if (opId && investorId) {
      fetchSignature({
        opId,
        investorId,
      });
    }
  }, [opId, investorId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 280,
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
        No fue posible cargar la información de firma electrónica.
      </Alert>
    );
  }

  const signature = data?.data;

  if (!signature) {
    return (
      <Alert severity="info">
        No hay información disponible para esta firma electrónica.
      </Alert>
    );
  }

  const payerNames =
    signature.payers?.length > 0
      ? signature.payers
          .map((payer) => payer.name)
          .join(", ")
      : "—";

  const isPending =
    notification.eventType ===
    "ELECTRONIC_SIGNATURE_PENDING";

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <DrawOutlinedIcon
              sx={{
                fontSize: 18,
                color: "var(--primary-color)",
              }}
            />

            <Typography
              variant="overline"
              sx={{
                color: "var(--primary-color)",
                fontWeight: 700,
                letterSpacing: 0.7,
              }}
            >
              Firma electrónica
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: {
                xs: 22,
                sm: 25,
              },
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#364242",
            }}
          >
            OP-{opId}
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
          label={isPending ? "Pendiente" : "Enviada"}
          size="small"
          sx={{
            bgcolor: isPending
              ? "#FFF7E6"
              : "#EEF7F2",
            color: isPending
              ? "#9A6700"
              : "#18794E",
            fontWeight: 700,
          }}
        />
      </Box>

      <Divider
        sx={{
          my: {
            xs: 2,
            md: 3,
          },
        }}
      />

      {/* Datos principales */}
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 3,
        }}
      >
        <Grid item xs={12} sm={6}>
          <Detail
            label="Emisor"
            value={signature.emitter?.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Detail
            label="NIT emisor"
            value={signature.emitter?.document}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Detail
            label="Inversionista"
            value={signature.investor?.investor}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Detail
            label="NIT inversionista"
            value={
              signature.investor
                ?.investorDocumentNumber
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Detail
            label="Pagador"
            value={payerNames}
          />
        </Grid>
      </Grid>

      {/* Resumen */}
      <Box
        sx={{
          mt: 3,
          p: {
            xs: 1.5,
            sm: 2.5,
          },
          border:
            "1px solid var(--border-soft-color, #E5EAEA)",
          borderRadius: 2,
          bgcolor:
            "var(--surface-soft, #FAFCFC)",
        }}
      >
        <Typography
          sx={{
            mb: 2,
            fontSize: 14,
            fontWeight: 700,
            color: "#364242",
          }}
        >
          Resumen para firma
        </Typography>

        <Grid
          container
          spacing={{
            xs: 2,
            sm: 2.5,
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Cantidad de facturas"
              value={signature.bills?.bills}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Plazo promedio"
              value={
                signature.bills?.averageTerm !==
                undefined
                  ? `${signature.bills.averageTerm} días`
                  : "—"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Valor nominal"
              value={formatCurrency(
                signature.bills?.total
              )}
              strong
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Cuenta inversionista"
              value={
                signature.investor
                  ?.investorAccountNumber
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Saldo disponible"
              value={formatCurrency(
                signature.investor
                  ?.investorAccountBalance
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Estado"
              value={
                isPending
                  ? "Pendiente de firma"
                  : "Firma enviada"
              }
              strong
            />
          </Grid>
        </Grid>
      </Box>

      {isPending ? (
        <Alert
          severity="warning"
          sx={{
            mt: 3,
            borderRadius: 2,
          }}
        >
          Esta operación todavía requiere gestionar el envío de la firma electrónica.
        </Alert>
      ) : (
        <Alert
          severity="success"
          sx={{
            mt: 3,
            borderRadius: 2,
          }}
        >
          La firma electrónica fue enviada correctamente.
        </Alert>
      )}

      {/* CTA */}
      <Box
        sx={{
          mt: {
            xs: 3,
            md: 4,
          },
          display: "flex",
          justifyContent: {
            xs: "stretch",
            sm: "flex-end",
          },
        }}
      >
        <Button
          fullWidth
          endIcon={<OpenInNewIcon />}
          onClick={() =>
            router.push(
              `/operations/approval?id=${opId}&investor=${investorId}`
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            color:
              "var(--primary-color)",
            fontWeight: 600,
          }}
        >
          Gestionar firma electrónica
        </Button>
      </Box>
    </Box>
  );
}