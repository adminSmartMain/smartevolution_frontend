import { Box, Button, Tooltip, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomDataGrid from "@styles/tables";
import moment from "moment";

const getDaysUntilExpiration = (expiresAt) => {
  if (!expiresAt) return 0;

  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const getExpirationBadgeColor = (days) => {
  if (days >= 8) return "#2e7d32";
  if (days >= 5) return "#fbc02d";
  return "#d32f2f";
};

const formatDateTime = (value) => {
  if (!value) return "-";
  return moment(value).format("DD/MM/YYYY HH:mm");
};

export const PreOperationsDraftTable = ({
  rows = [],
  loading = false,
  onContinue,
  onDiscard,
}) => {
  const columns = [
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      sortable: false,
      renderCell: () => (
        <Tooltip title="Operación guardada como borrador" arrow>
          <Box
            sx={{
              px: 1.5,
              py: 0.45,
              borderRadius: "6px",
              bgcolor: "#EEF2F2",
              color: "#149A9A",
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Borrador
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "opId",
      headerName: "ID Op",
      width: 90,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
  field: "emitterName",
  headerName: "Nombre Emisor",
  width: 250,
  valueGetter: (params) =>
    params.row?.metadata?.emitterName ||
    params.row?.emitterName ||
    "-",
},
    {
  field: "payerName",
  headerName: "Nombre Pagador",
  width: 260,
  valueGetter: (params) =>
    params.row?.metadata?.payerName ||
    params.row?.payerName ||
    "-",
},
    {
  field: "selectedBillsCount",
  headerName: "Cant. Facturas",
  width: 130,
  valueGetter: (params) =>
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
          {formatDateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: "expiresAt",
      headerName: "Expira",
      width: 120,
      renderCell: (params) => {
        const days = getDaysUntilExpiration(params.value);
        const color = getExpirationBadgeColor(days);
        const expirationLabel = params.value
          ? moment(params.value).format("DD/MM/YYYY")
          : "-";

        return (
          <Tooltip
            title={`Este borrador será eliminado el ${expirationLabel} si no presenta actividad`}
            arrow
          >
            <Box
              sx={{
                width: 42,
                height: 22,
                borderRadius: "6px",
                bgcolor: color,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              {days}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 170,
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
const getDraftStatusLabel = (status) => {
  if (status === "READY_FOR_EXCEL") return "Listo para Excel";
  return "Borrador";
};
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