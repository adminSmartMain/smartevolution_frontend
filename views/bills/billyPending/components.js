import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Alert, Box, Breadcrumbs, Button, Chip, CircularProgress, Link, Tooltip, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomDataGrid from "@styles/tables";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import { GetPendingBillyBills, RetryPendingBillyBills } from "./queries";

const actionButtonSx = {
  border: "2px solid #488B8F",
  borderRadius: "4px",
  height: { xs: "3rem", md: "2.4rem" },
  fontSize: { xs: "0.85rem", md: "0.75rem" },
  px: 1.5,
  whiteSpace: "nowrap",
  textTransform: "none",
  transition: "all 0.25s ease-in-out",
  backgroundColor: "white",
  color: "#488B8F",
  "& .MuiButton-startIcon svg": { transition: "all 0.25s ease-in-out" },
  "&:hover": {
    backgroundColor: "#488B8F",
    color: "#ffffff",
    "& .MuiButton-startIcon svg": { color: "#ffffff" },
  },
};

export const PendingBillyBillsComponents = () => {
  const [selection, setSelection] = useState([]);
  const { fetch: fetchPending, loading, error, data } = useFetch({ service: GetPendingBillyBills, init: false });
  const { fetch: retry, loading: retrying, data: retryData, error: retryError } = useFetch({ service: RetryPendingBillyBills, init: false });

  useEffect(() => { fetchPending(); }, []);

  useEffect(() => {
    if (retryData) {
      const { synced = [], pending = [], failed = [] } = retryData;
      Toast(`${synced.length} sincronizadas; ${pending.length + failed.length} siguen pendientes`, synced.length ? "success" : "warning");
      setSelection([]);
      fetchPending();
    }
  }, [retryData]);

  useEffect(() => {
    if (error || retryError) Toast("No fue posible consultar o sincronizar las facturas pendientes", "error");
  }, [error, retryError]);

  const rows = data?.data || [];
  const columns = [
    { field: "billId", headerName: "Factura", minWidth: 130, flex: 1 },
    { field: "cufe", headerName: "CUFE", minWidth: 280, flex: 2 },
    { field: "emitterName", headerName: "Emisor", minWidth: 180, flex: 1 },
    {
      field: "billyErrorCode", headerName: "Código Billy", minWidth: 115,
      renderCell: ({ value }) => <Chip size="small" color="warning" label={value || "Pendiente"} />,
    },
    {
      field: "billyErrorDetail", headerName: "Último detalle", minWidth: 260, flex: 2,
      renderCell: ({ value }) => <Tooltip title={value || "Sin detalle"}><Typography noWrap sx={{ maxWidth: 260 }}>{value || "Sin detalle"}</Typography></Tooltip>,
    },
    { field: "billySyncAttempts", headerName: "Intentos", width: 90 },
  ];

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="Miga de pan" sx={{ mb: 2 }}>
        <NextLink href="/bills/billList" passHref legacyBehavior><Link underline="hover" color="#5EA3A3">Facturas</Link></NextLink>
        <NextLink href="/bills" passHref legacyBehavior><Link underline="hover" color="#5EA3A3">Extraer factura</Link></NextLink>
        <Typography color="#3b828e" fontWeight="bold">Facturas pendientes</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          sx={actionButtonSx}
          disabled={retrying || selection.length === 0}
          onClick={() => retry(selection)}
          startIcon={retrying ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
        >
          Reintentar seleccionadas ({selection.length})
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>Las facturas pendientes están guardadas localmente. Selecciona las que desees volver a cargar en Billy.</Alert>
      <CustomDataGrid
        className="main-list-data-grid"
        sx={{ width: "100%", minWidth: 0 }}
        rows={rows}
        columns={columns}
        loading={loading || retrying}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(ids) => setSelection(ids)}
        selectionModel={selection}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
    </Box>
  );
};
