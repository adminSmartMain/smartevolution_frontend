import Skeleton from "@mui/material/Skeleton";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, Chip, Tooltip
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { DataGrid } from "@mui/x-data-grid";

const BillsLeftSkeleton = () => {
  return (
    <Box sx={{ mt: 1 }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1.2fr 1fr 1fr 120px",
            gap: 1.5,
            alignItems: "center",
            py: 1.2,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Skeleton variant="rectangular" width={24} height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
        </Box>
      ))}
    </Box>
  );
};

const EmptyBillsState = ({
  title,
  subtitle,
  bg = "#F5F5F5",
  iconBoxBg = "#E8E8E8",
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 34,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
          mt: -5,
        }}
      >
        <Box
          sx={{
            width: 210,
            height: 210,
            borderRadius: 4,
            bgcolor: iconBoxBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <DescriptionOutlinedIcon
            sx={{
              fontSize: 130,
              color: "#F5F5F5",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: "#D0D0D0",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#D0D0D0",
            lineHeight: 1.45,
            maxWidth: 520,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

const ConfirmClearLotDialog = ({
  open,
  onClose,
  onConfirm,
  totalBills = 0,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#2E9B9B",
          fontSize: 16,
          fontWeight: 500,
          borderBottom: "1px solid #7BC7C7",
          pb: 1.5,
        }}
      >
        Vaciar Lote
        <IconButton onClick={onClose} size="small" sx={{ color: "#2E9B9B" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
          <Box
            sx={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              bgcolor: "#FF160D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#fff", fontSize: 52 }} />
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 500,
            color: "#111",
            mb: 1.5,
          }}
        >
          ¿Vaciar todo el lote de facturas?
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: "#222",
            maxWidth: 560,
            mx: "auto",
            lineHeight: 1.5,
          }}
        >
          Estás a punto de remover las {totalBills} facturas seleccionadas. Esta
          acción no se puede deshacer y deberás seleccionarlas nuevamente.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 4,
          pb: 3.5,
        }}
      >
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            minWidth: 200,
            height: 42,
            bgcolor: "#FF160D",
            color: "#fff",
            textTransform: "none",
            fontSize: 15,
            borderRadius: 1,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#E1120A",
              boxShadow: "none",
            },
          }}
        >
          Vaciar lote
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 200,
            height: 42,
            bgcolor: "#C9C9C9",
            color: "#fff",
            textTransform: "none",
            fontSize: 15,
            borderRadius: 1,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#BDBDBD",
              boxShadow: "none",
            },
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const BillsDualTable = ({
  takedBills = [],
  billsToNegotiate = [],
  loading = false,
  nombrePagador,
  emitterKey,
  setFieldValue,
  OperationsByEmitterPayerLoading
}) => {
  const norm = (value) => (value ?? "").toString().trim().toLowerCase();
  const isFirstRender = useRef(true);

  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");
  const [openClearLotDialog, setOpenClearLotDialog] = useState(false);

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const normalizeSelectionModel = (model) => {
    if (Array.isArray(model)) {
      return model.map(String);
    }

    if (model?.ids instanceof Set) {
      return Array.from(model.ids).map(String);
    }

    if (Array.isArray(model?.ids)) {
      return model.ids.map(String);
    }

    return [];
  };

  const getTechnicalRowId = (row) => {
    return (
      row?.preOperationId ||
      row?.id ||
      row?.operationId ||
      row?.billUniqueId ||
      row?.bill?.id ||
      row?.billId ||
      ""
    );
  };

  const getBillVisibleId = (row) => {
    return (
      row?.billId ||
      row?.bill?.billId ||
      row?.bill?.number ||
      row?.number ||
      row?.integrationCode ||
      row?.bill?.integrationCode ||
      ""
    );
  };

  const getBillUniqueId = (row) => {
    return row?.billUniqueId || row?.bill?.id || row?.bill_id || "";
  };

  const getCurrentBalance = (row) => {
    return Number(
      row?.currentBalance ??
      row?.bill?.currentBalance ??
      row?.amount ??
      row?.billValue ??
      row?.bill?.billValue ??
      row?.balance ??
      0
    );
  };

  const getBillValue = (row) => {
    return Number(
      row?.billValue ??
      row?.bill?.billValue ??
      row?.total ??
      row?.bill?.total ??
      row?.amount ??
      0
    );
  };

  const getDateBill = (row) => {
    return row?.dateBill || row?.bill?.dateBill || row?.opDate || "";
  };

  const getExpirationDate = (row) => {
    return row?.expirationDate || row?.bill?.expirationDate || "";
  };

  const getPayerId = (row) => {
    return row?.payerId || row?.bill?.payerId || row?.payer_id || "";
  };

  const getPayerName = (row) => {
    return (
      row?.payerName ||
      row?.bill?.payerName ||
      row?.payer?.name ||
      row?.payer ||
      ""
    );
  };

  const getInvestorName = (row) => {
    const client = row?.clientAccount?.client || {};

    const fullName = `${client?.first_name || ""} ${client?.last_name || ""
      }`.trim();

    return (
      row?.investorName ||
      row?.clientAccount?.clientName ||
      client?.social_reason ||
      client?.full_name ||
      fullName ||
      row?.clientAccount?.name ||
      row?.payerName ||
      row?.bill?.payerName ||
      ""
    );
  };

  const getEmitterId = (row) => {
    return row?.emitterId || row?.bill?.emitterId || row?.emitter_id || "";
  };

  const getEmitterName = (row) => {
    return (
      row?.emitterName ||
      row?.bill?.emitterName ||
      row?.emitter?.name ||
      row?.emitter ||
      ""
    );
  };

  const getFraction = (row) => {
    return Number(
      row?.fraction ??
      row?.frac ??
      row?.billFraction ??
      row?.bill?.fraction ??
      row?.bill?.frac ??
      1
    );
  };

  const getOpId = (row) => {
    return row?.opId || row?.operationId || row?.op_id || "";
  };

  const mapBillToRow = (item) => {
    const id = String(getTechnicalRowId(item));
    const billId = getBillVisibleId(item);
    const billUniqueId = getBillUniqueId(item);
    const fraction = getFraction(item);
    const currentBalance = getCurrentBalance(item);
    const billValue = getBillValue(item);
    const dateBill = getDateBill(item);
    const expirationDate = getExpirationDate(item);
    const payerId = getPayerId(item);
    const payerName = getPayerName(item);
    const investorName = getInvestorName(item);
    const emitterId = getEmitterId(item);
    const emitterName = getEmitterName(item);
    const opId = getOpId(item);
    const opPendingAmount = Number(item?.opPendingAmount ?? currentBalance);

    return {
      id,
      preOperationId: item?.preOperationId || item?.id || "",
      billUniqueId,
      billId,
      billLabel: `${billId} / ${fraction || 1}`,
      opId,
      opDate: item?.opDate || "",
      emitterId,
      emitterName,
      payerId,
      payerName,
      investorName,
      currentBalance,
      billValue,
      dateBill,
      expirationDate,
      total: Number(item?.total ?? item?.bill?.total ?? billValue),
      fraction,
      opPendingAmount,
      raw: {
        ...item,
        id,
        preOperationId: item?.preOperationId || item?.id || "",
        billUniqueId,
        billId,
        fraction,
        currentBalance,
        billValue,
        dateBill,
        expirationDate,
        payerId,
        payerName,
        investorName,
        emitterId,
        emitterName,
        opId,
      },
    };
  };

  const takedBillsRows = useMemo(
    () => (Array.isArray(takedBills) ? takedBills : []).map(mapBillToRow),
    [takedBills]
  );

  const selectedRows = useMemo(
    () =>
      (Array.isArray(billsToNegotiate) ? billsToNegotiate : []).map(
        mapBillToRow
      ),
    [billsToNegotiate]
  );

  const leftSelectionModel = useMemo(
    () => selectedRows.map((row) => String(row.id)),
    [selectedRows]
  );

  const filteredAvailable = useMemo(() => {
    const query = norm(searchLeft);

    if (!query) return takedBillsRows;

    return takedBillsRows.filter(
      (row) =>
        norm(row.billId).includes(query) ||
        norm(row.billLabel).includes(query) ||
        norm(row.opId).includes(query) ||
        norm(row.emitterName).includes(query) ||
        norm(row.payerName).includes(query) ||
        norm(row.investorName).includes(query) ||
        norm(row.preOperationId).includes(query) ||
        norm(row.billUniqueId).includes(query)
    );
  }, [takedBillsRows, searchLeft]);

  const filteredSelected = useMemo(() => {
    const query = norm(searchRight);

    if (!query) return selectedRows;

    return selectedRows.filter(
      (row) =>
        norm(row.billId).includes(query) ||
        norm(row.billLabel).includes(query) ||
        norm(row.opId).includes(query) ||
        norm(row.emitterName).includes(query) ||
        norm(row.payerName).includes(query) ||
        norm(row.investorName).includes(query) ||
        norm(row.preOperationId).includes(query) ||
        norm(row.billUniqueId).includes(query)
    );
  }, [selectedRows, searchRight]);

  const selectedTotalBalance = useMemo(() => {
    return selectedRows.reduce(
      (acc, row) => acc + Number(row.opPendingAmount ?? 0),
      0
    );
  }, [selectedRows]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSearchLeft("");
    setSearchRight("");
    setFieldValue?.("billsToNegotiate", []);
    setFieldValue?.("investorAssignments", []);
  }, [nombrePagador, emitterKey, setFieldValue]);

  const syncSelectionToCart = (newModel) => {
    const selectedIds = normalizeSelectionModel(newModel);
    const selectedSet = new Set(selectedIds);

    const selectedBills = takedBillsRows
      .filter((row) => selectedSet.has(String(row.id)))
      .map((row) => ({
        ...row.raw,
      }));

    setFieldValue("billsToNegotiate", selectedBills);
    setFieldValue?.("investorAssignments", []);
  };

  const removeFromRight = (rowId) => {
    const updated = selectedRows
      .filter((row) => String(row.id) !== String(rowId))
      .map((row) => ({
        ...row.raw,
      }));

    setFieldValue("billsToNegotiate", updated);
    setFieldValue?.("investorAssignments", []);
  };

  const handleOpenClearLotDialog = () => {
    if (!selectedRows.length) return;
    setOpenClearLotDialog(true);
  };

  const handleCloseClearLotDialog = () => {
    setOpenClearLotDialog(false);
  };

  const handleConfirmClearLot = () => {
    setFieldValue("billsToNegotiate", []);
    setFieldValue?.("investorAssignments", []);
    setOpenClearLotDialog(false);
  };


  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);

    return expDate < today;
  };

  const isExpiringSoon = (expirationDate, days = 5) => {
    if (!expirationDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= days;
  };

  const leftColumns = useMemo(
    () => [
      {
        field: "billLabel",
        headerName: "ID Factura / Frac",
        flex: 1.05,
        minWidth: 190,
        sortable: true,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          const expired = isExpired(params.row.expirationDate);
          const expiringSoon = isExpiringSoon(params.row.expirationDate);

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
                py: 0.5,
              }}
            >


              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                {params.row.billLabel}
              </Typography>

              {params.row.expirationDate && (
                <Tooltip
                  title={
                    expired
                      ? "Esta factura ya se encuentra expirada"
                      : "Fecha límite de recaudo de esta factura"
                  }
                  arrow
                >
                  <Chip
                    label={`Expira en: ${formatDate(params.row.expirationDate)}`}
                    size="small"
                    sx={{
                      mt: 0.5,
                      width: "fit-content",
                      height: 18,
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: "6px",
                      color: expired
                        ? "#D32F2F"
                        : expiringSoon
                          ? "#B45309"
                          : "green",
                      backgroundColor: expired
                        ? "#FDECEC"
                        : expiringSoon
                          ? "#FEF3C7"
                          : "#F3F4F6",
                      border: expired
                        ? "1px solid #F5B5B5"
                        : expiringSoon
                          ? "1px solid #FCD34D"
                          : "1px solid #E5E7EB",
                      "& .MuiChip-label": {
                        px: 0.8,
                      },
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        field: "investorName",
        headerName: "Inversionista",
        flex: 1,
        minWidth: 155,
        sortable: true,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#111",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.value || "-"}
            </Typography>

            {params.row.opId ? (
              <Typography sx={{ fontSize: 10.5, color: "#555" }}>
                OpId: {params.row.opId}
              </Typography>
            ) : null}
          </Box>
        ),
      },
      {
        field: "opPendingAmount",
        headerName: "Pendiente por cobrar",
        flex: 0.85,
        minWidth: 150,
        sortable: false,
        headerAlign: "right",
        align: "right",
        valueFormatter: ({ value }) => formatCurrency(value),
      },
    ],
    []
  );

  console.log(filteredAvailable)

  return (
    <>
      <ConfirmClearLotDialog
        open={openClearLotDialog}
        onClose={handleCloseClearLotDialog}
        onConfirm={handleConfirmClearLot}
        totalBills={selectedRows.length}
      />

      <Grid
        container
        spacing={2}
        sx={{
          mt: 0,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Grid item xs={12} md={6} sx={{ minHeight: 0, display: "flex" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 0,
              p: 0,
              width: "100%",
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <TextField
              placeholder="Buscar por ID, inversionista u OpId"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={searchLeft}
              onChange={(event) => setSearchLeft(event.target.value)}
            />

            {OperationsByEmitterPayerLoading ? (
              <BillsLeftSkeleton />
            ) : (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 420,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <DataGrid
                  rows={filteredAvailable}
                  getRowId={(row) => String(row.id)}
                  columns={leftColumns}
                  checkboxSelection
                  disableRowSelectionOnClick

                  selectionModel={leftSelectionModel}
                  onSelectionModelChange={syncSelectionToCart}

                  rowSelectionModel={leftSelectionModel}
                  onRowSelectionModelChange={syncSelectionToCart}

                  keepNonExistentRowsSelected
                  pageSizeOptions={[10, 20, 50, 100]}
                  localeText={{
                    footerRowsPerPage: "Filas por página:",
                    footerTotalRows: "Total de filas:",
                    MuiTablePagination: {
                      labelRowsPerPage: "Filas por página:",
                      labelDisplayedRows: ({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`
                        }`,
                    },
                  }}
                  initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 100 } },
                    sorting: {
                      sortModel: [{ field: "billLabel", sort: "desc" }],
                    },
                  }}
                  rowHeight={72}
                  columnHeaderHeight={42}
                  sx={{
                    border: 0,
                    height: "100%",
                    backgroundColor: "transparent",
                    "& .MuiDataGrid-main": {
                      border: 0,
                      minHeight: 0,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#D9D9D9",
                      borderBottom: "none",
                      minHeight: "34px !important",
                      maxHeight: "34px !important",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      px: 1,
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#111",
                    },
                    "& .MuiDataGrid-row": {
                      backgroundColor: "#F3F3F3",
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "#EAEAEA",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "1px solid #E0E0E0",
                      fontSize: 13,
                      color: "#222",
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                    {
                      outline: "none",
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                      backgroundColor: "rgba(54,167,167,0.12)",
                    },
                    "& .MuiDataGrid-row.Mui-selected:hover": {
                      backgroundColor: "rgba(54,167,167,0.18)",
                    },
                    "& .MuiCheckbox-root": {
                      color: "#2C9A9A",
                      p: 0.5,
                    },
                    "& .Mui-checked": {
                      color: "#2C9A9A !important",
                    },
                    "& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox":
                    {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      minHeight: 36,
                      borderTop: "none",
                    },
                    "& .MuiTablePagination-root": {
                      fontSize: 12,
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                      display: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowY: filteredAvailable.length ? "auto" : "hidden",
                      overflowX: "hidden",
                    },
                    "& .MuiDataGrid-overlay": {
                      display: "none",
                    },
                    "& .MuiDataGrid-overlayWrapper": {
                      display: "none",
                    },
                  }}
                />

                {filteredAvailable.length === 0 && (
                  <EmptyBillsState
                    bg="#F5F5F5"
                    iconBoxBg="#E7E7E7"
                    title="Aún no hay operaciones disponibles"
                    subtitle="Selecciona el emisor y el pagador para cargar las operaciones asociadas"
                  />
                )}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minHeight: 0, display: "flex" }}>
          <Box
            sx={{
              bgcolor: "#EBEBEB",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              minHeight: 0,
              overflow: "hidden",
              boxSizing: "border-box",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#222",
                }}
              >
                Facturas a recaudar
              </Typography>

              <Typography
                sx={{
                  cursor: selectedRows.length ? "pointer" : "not-allowed",
                  color: selectedRows.length ? "#8E8E8E" : "#BDBDBD",
                  fontSize: 13,
                  fontWeight: 500,
                }}
                onClick={handleOpenClearLotDialog}
              >
                Vaciar lote
              </Typography>
            </Box>

            <TextField
              placeholder="Buscar por ID"
              fullWidth
              size="small"
              sx={{
                mb: 1.75,
                "& .MuiInputBase-root": {
                  backgroundColor: "#fff",
                  fontSize: 12,
                  height: 36,
                },
              }}
              value={searchRight}
              onChange={(event) => setSearchRight(event.target.value)}
            />

            <Box
              sx={{
                flex: 1,
                minHeight: 420,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {filteredSelected.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1.25fr 1fr 0.85fr 28px",
                    alignItems: "center",
                    backgroundColor: "#D9D9D9",
                    minHeight: 30,
                    px: 1.2,
                    columnGap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                    ID Factura{" "}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0A8F8F",
                      }}
                    >
                      / Frac
                    </Typography>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111",
                      textAlign: "center",
                    }}
                  >
                    Inversionista
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111",
                      textAlign: "right",
                    }}
                  >
                    Pendiente por cobrar
                  </Typography>

                  <Box />
                </Box>
              )}

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: filteredSelected.length ? "auto" : "hidden",
                  overflowX: "hidden",
                  pt: filteredSelected.length ? 0.5 : 0,
                }}
              >
                {filteredSelected.length === 0 ? (
                  <EmptyBillsState
                    bg="#EBEBEB"
                    iconBoxBg="#E4E4E4"
                    title="Aún no has seleccionado facturas"
                    subtitle="Selecciona facturas de la tabla de la izquierda para comenzar a armar tu lote"
                  />
                ) : (
                  filteredSelected.map((row) => (
                    <Box
                      key={row.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1.25fr 1fr 0.85fr 28px",
                        alignItems: "center",
                        px: 1.2,
                        py: 0.65,
                        columnGap: 1,
                        minHeight: 31,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: "#1F1F1F",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.billId || "-"}
                        <Typography
                          component="span"
                          sx={{
                            color: "#0A8F8F",
                            fontWeight: 800,
                            fontSize: 12.5,
                          }}
                        >
                          {" "}
                          / {row.fraction || 1}
                        </Typography>
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "#111",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.investorName || "-"}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "#111",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(row.opPendingAmount)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => removeFromRight(row.id)}
                        sx={{
                          color: "#FF0000",
                          p: 0,
                          minWidth: 0,
                          width: 22,
                          height: 22,
                          "&:hover": {
                            backgroundColor: "rgba(255,0,0,0.08)",
                          },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {selectedRows.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  pt: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  minHeight: 40,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#0A9A9A",
                  }}
                >
                  Total ({selectedRows.length} facturas)
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  El mínimo de facturas a seleccionar es 5
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#111",
                    pr: 5,
                  }}
                >
                  {formatCurrency(selectedTotalBalance)}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};