import { useEffect, useMemo, useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CustomDataGrid from "@styles/tables";
import moment from "moment";

const getMinutesUntilExpiration = (expiresAt) => {
  if (!expiresAt) return 0;

  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();

  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
};

const getExpirationBadgeFromMinutes = (minutes) => {
  if (minutes >= 8) {
    return {
      label: `${minutes}`,
      color: "#2e7d32",
      level: "safe",
      tooltip: "Borrador seguro / reciente.",
    };
  }

  if (minutes >= 5) {
    return {
      label: `${minutes}`,
      color: "#fbc02d",
      level: "medium",
      tooltip: "Borrador con antigüedad media.",
    };
  }

  if (minutes >= 1) {
    return {
      label: `${minutes}`,
      color: "#d32f2f",
      level: "critical",
      tooltip: "Crítico: riesgo de pérdida de datos.",
    };
  }

  return {
    label: "< 1",
    color: "#d32f2f",
    level: "alert",
    tooltip: "Expira en menos de 1 minuto.",
  };
};

const getDraftExpirationBadge = (row) => {
  const backendMinutes = row?.minutesRemaining;
  const minutes =
    backendMinutes !== undefined && backendMinutes !== null
      ? Math.max(0, Number(backendMinutes))
      : getMinutesUntilExpiration(row?.expiresAt);

  return {
    ...getExpirationBadgeFromMinutes(minutes),
    minutes,
    color: row?.draftBadgeColor || getExpirationBadgeFromMinutes(minutes).color,
    level: row?.draftBadgeLevel || getExpirationBadgeFromMinutes(minutes).level,
    label: row?.draftBadgeLabel
      ? String(minutes >= 1 ? minutes : "< 1")
      : getExpirationBadgeFromMinutes(minutes).label,
  };
};

const formatDateTime = (value) => {
  if (!value) return "-";
  return moment(value).format("DD/MM/YYYY HH:mm");
};

const getDraftStatusLabel = (status) => {
  if (status === "READY_FOR_EXCEL") return "Listo para Excel";
  if (status === "REGISTERED") return "Registrado";
  if (status === "CANCELLED") return "Cancelado";
  return "Borrador";
};

const getDraftStatusTooltip = (status) => {
  if (status === "READY_FOR_EXCEL") {
    return "Borrador avanzado: listo para generar o cargar Excel";
  }

  return "Operación guardada como borrador";
};


const getSecondsUntilExpiration = (expiresAt, now) => {
  if (!expiresAt) return 0;

  const expires = new Date(expiresAt).getTime();
  const diffMs = expires - now;

  return Math.max(0, Math.floor(diffMs / 1000));
};

const formatRemainingTime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
export const PreOperationsDraftTable = ({
  rows = [],
  loading = false,
  onContinue,
  onDiscard,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      if (!row?.expiresAt) return true;
      return new Date(row.expiresAt).getTime() > now;
    });
  }, [rows, now]);

  const columns = [
    {
      field: "status",
      headerName: "Estado",
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const label = getDraftStatusLabel(params.row?.status);

        return (
          <Tooltip title={getDraftStatusTooltip(params.row?.status)} arrow>
            <Box
              sx={{
                px: 1.5,
                py: 0.45,
                borderRadius: "6px",
                bgcolor:
                  params.row?.status === "READY_FOR_EXCEL"
                    ? "#EAF6FF"
                    : "#EEF2F2",
                color:
                  params.row?.status === "READY_FOR_EXCEL"
                    ? "#1976D2"
                    : "#149A9A",
                fontSize: 12,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "opId",
      headerName: "ID Op",
      width: 90,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13 }}>{params.value || "-"}</Typography>
      ),
    },
    {
      field: "emitterName",
      headerName: "Nombre Emisor",
      width: 250,
      valueGetter: (params) =>
        params.row?.metadata?.emitterName || params.row?.emitterName || "-",
    },
    {
      field: "payerName",
      headerName: "Nombre Pagador",
      width: 260,
      valueGetter: (params) =>
        params.row?.metadata?.payerName || params.row?.payerName || "-",
    },
    {
      field: "selectedBillsCount",
      headerName: "Cant. Facturas",
      width: 130,
      valueGetter: (params) =>
        params.row?.selectedBillsCount ??
        params.row?.metadata?.selectedBillsCount ??
        params.row?.selectedBills?.length ??
        0,
    },
    {
      field: "updated_at",
      headerName: "Última Modificación",
      width: 180,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13 }}>
          {formatDateTime(params.value || params.row?.created_at)}
        </Typography>
      ),
    },
    {
  field: "expiresAt",
  headerName: "Expira",
  width: 135,
  renderCell: (params) => {
    const seconds = getSecondsUntilExpiration(params.row?.expiresAt, now);
    const minutes = Math.floor(seconds / 60);

    const badge = getExpirationBadgeFromMinutes(minutes);

    const expirationLabel = params.value
      ? moment(params.value).format("DD/MM/YYYY HH:mm")
      : "-";

    const isAlert = seconds <= 60;

    return (
      <Tooltip
        title={`${badge.tooltip} Será eliminado el ${expirationLabel} si no presenta actividad.`}
        arrow
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.35,
            minWidth: 68,
            height: 24,
            px: 0.8,
            borderRadius: "6px",
            bgcolor: badge.color,
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {isAlert && <WarningAmberIcon sx={{ fontSize: 14 }} />}
          {formatRemainingTime(seconds)}
        </Box>
      </Tooltip>
    );
  },
},
    {
      field: "acciones",
      headerName: "Acciones",
      width: 185,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Button
            onClick={() => onContinue?.(params.row)}
            variant="outlined"
            size="small"
            sx={{
              height: 30,
              borderRadius: "6px",
              borderColor: "#5EA3A3",
              color: "#488B8F",
              textTransform: "none",
              fontSize: 12,
              px: 1.5,
              "&:hover": {
                borderColor: "#488B8F",
                backgroundColor: "#F4FBFB",
              },
            }}
          >
            Continuar
          </Button>

          <Button
            onClick={() => onDiscard?.(params.row)}
            variant="text"
            size="small"
            sx={{
              color: "#D32F2F",
              textTransform: "none",
              fontSize: 12,
              px: 0.5,
            }}
          >
            Descartar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <CustomDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={15}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        disableColumnMenu
        autoHeight
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#fff",
            borderBottom: "1px solid #ECECEC",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: 13,
            color: "#111",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: "#333",
          },
          "& .MuiDataGrid-row": {
            minHeight: "48px !important",
            maxHeight: "48px !important",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#FAFAFA",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Typography
              fontSize="0.9rem"
              fontWeight="600"
              color="#488B8F"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              No hay borradores guardados
            </Typography>
          ),
        }}
      />
    </Box>
  );
};