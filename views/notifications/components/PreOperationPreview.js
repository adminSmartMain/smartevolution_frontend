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
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import { useFetch } from "@hooks/useFetch";
import { getElectronicSignaturePreview } from "../queries";

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

export default function PreOperationPreview({
  notification,
}) {
  const router = useRouter();

  const {
    fetch: fetchPreOperation,
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
      fetchPreOperation({
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
        No fue posible cargar la operación pendiente de aprobación.
      </Alert>
    );
  }

  const preOperation = data?.data;

  if (!preOperation) {
    return (
      <Alert severity="info">
        No hay información disponible para esta operación.
      </Alert>
    );
  }

  const payerNames =
    preOperation.payers?.length > 0
      ? preOperation.payers
          .map((payer) => payer.name)
          .join(", ")
      : "—";

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
            <FactCheckOutlinedIcon
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
              Operación
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
          label="Por aprobar"
          size="small"
          sx={{
            bgcolor: "#FFF7E6",
            color: "#9A6700",
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
            value={preOperation.emitter?.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Detail
            label="Inversionista"
            value={
              preOperation.investor?.investor
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
          Resumen para aprobación
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
              value={preOperation.bills?.bills}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Plazo promedio"
              value={
                preOperation.bills?.averageTerm !==
                undefined
                  ? `${preOperation.bills.averageTerm} días`
                  : "—"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Valor nominal"
              value={formatCurrency(
                preOperation.bills?.total
              )}
              strong
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Cuenta inversionista"
              value={
                preOperation.investor
                  ?.investorAccountNumber
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Saldo disponible"
              value={formatCurrency(
                preOperation.investor
                  ?.investorAccountBalance
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Detail
              label="Estado"
              value="Pendiente de aprobación"
              strong
            />
          </Grid>
        </Grid>
      </Box>

      <Alert
        severity="warning"
        sx={{
          mt: 3,
          borderRadius: 2,
        }}
      >
        Esta operación requiere revisión antes de ser aprobada.
      </Alert>

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
            color: "var(--primary-color)",
            fontWeight: 600,
          }}
        >
          Revisar operación
        </Button>
      </Box>
    </Box>
  );
}