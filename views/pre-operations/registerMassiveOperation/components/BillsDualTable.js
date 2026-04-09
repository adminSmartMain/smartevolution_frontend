import Skeleton from "@mui/material/Skeleton";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          
        </Box>
      ))}
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
}) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();
  const isFirstRender = useRef(true);

  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");
  const [openClearLotDialog, setOpenClearLotDialog] = useState(false);

  const getBillId = (b) => b.id ?? "";

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const mapBillToRow = (b) => ({
    id: b.id,
    billId: b.billId ?? b.number ?? "",
    emitterName: b.emitterName ?? b.emitter?.name ?? b.emitter ?? "",
    payerName: b.payerName ?? b.payer?.name ?? b.payer ?? "",
    currentBalance: Number(b.currentBalance ?? b.balance ?? 0),
    dateBill: b.dateBill,
    expirationDate: b.expirationDate,
    total: Number(b.total ?? 0),
    fractionsToSplit: Number(b.fractionsToSplit ?? 1),
    raw: {
      ...b,
      fractionsToSplit: Number(b.fractionsToSplit ?? 1),
    },
  });

  const takedBillsRows = useMemo(
    () => (Array.isArray(takedBills) ? takedBills : []).map(mapBillToRow),
    [takedBills]
  );

  const selectedRows = useMemo(
    () => (Array.isArray(billsToNegotiate) ? billsToNegotiate : []).map(mapBillToRow),
    [billsToNegotiate]
  );

  const leftSelectionModel = useMemo(
    () => selectedRows.map((row) => row.id),
    [selectedRows]
  );

  const filteredAvailable = useMemo(() => {
    const q = norm(searchLeft);
    if (!q) return takedBillsRows;

    return takedBillsRows.filter(
      (r) =>
        norm(r.billId).includes(q) ||
        norm(r.emitterName).includes(q) ||
        norm(r.payerName).includes(q)
    );
  }, [takedBillsRows, searchLeft]);

  const filteredSelected = useMemo(() => {
    const q = norm(searchRight);
    if (!q) return selectedRows;

    return selectedRows.filter(
      (r) =>
        norm(r.billId).includes(q) ||
        norm(r.emitterName).includes(q) ||
        norm(r.payerName).includes(q)
    );
  }, [selectedRows, searchRight]);

  const selectedTotalBalance = useMemo(() => {
    return selectedRows.reduce(
      (acc, row) => acc + Number(row.currentBalance ?? 0),
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
    const selectedSet = new Set(Array.isArray(newModel) ? newModel : []);

    const previousBillsMap = new Map(
      (Array.isArray(billsToNegotiate) ? billsToNegotiate : []).map((bill) => [
        getBillId(bill),
        bill,
      ])
    );

    const selectedBills = takedBillsRows
      .filter((row) => selectedSet.has(row.id))
      .map((row) => {
        const previous = previousBillsMap.get(row.id);

        return {
          ...row.raw,
          fractionsToSplit: Number(
            previous?.fractionsToSplit ?? row.raw?.fractionsToSplit ?? 1
          ),
        };
      });

    setFieldValue("billsToNegotiate", selectedBills);
  };

  const updateFractionsToSplit = (rowId, value) => {
    const parsed = parseInt(value, 10);
    const safeValue = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);

    const updated = (Array.isArray(billsToNegotiate) ? billsToNegotiate : []).map(
      (bill) => {
        const currentId = getBillId(bill);

        if (currentId !== rowId) return bill;

        return {
          ...bill,
          fractionsToSplit: safeValue,
        };
      }
    );

    setFieldValue("billsToNegotiate", updated);
    setFieldValue?.("investorAssignments", []);
  };

  const removeFromRight = (rowId) => {
    const updated = selectedRows
      .filter((r) => r.id !== rowId)
      .map((r) => ({
        ...r.raw,
        fractionsToSplit: Number(r.fractionsToSplit ?? 1),
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

  const leftColumns = useMemo(
  () => [
    {
      field: "billId",
      headerName: "ID",
      flex: 1.05,
      minWidth: 140,
      sortable: true,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1F1F1F" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "currentBalance",
      headerName: "Saldo",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      headerAlign: "right",
      align: "right",
      valueFormatter: ({ value }) => formatCurrency(value),
    },
  ],
  []
);

  const rightColumns = useMemo(() => {
    const billIdWidth = isLgUp ? undefined : isMdUp ? 100 : 80;
    const billIdMinWidth = isLgUp ? 120 : isMdUp ? 100 : 70;

    return [
      {
        field: "billId",
        headerName: "ID Factura",
        flex: isLgUp ? 1 : undefined,
        width: billIdWidth,
        minWidth: billIdMinWidth,
        headerAlign: "left",
        align: "left",
        sortable: false,
      },
      {
        field: "currentBalance",
        headerName: "Saldo",
        width: isSmUp ? 135 : 120,
        minWidth: isSmUp ? 135 : 120,
        maxWidth: isSmUp ? 135 : 120,
        headerAlign: "right",
        align: "right",
        sortable: false,
        valueFormatter: ({ value }) => formatCurrency(value),
      },
      {
        field: "fractionsToSplit",
        headerName: "Fracciones",
        width: isSmUp ? 105 : 92,
        minWidth: isSmUp ? 105 : 92,
        maxWidth: isSmUp ? 105 : 92,
        sortable: false,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              type="number"
              size="small"
              variant="standard"
              value={params.row.fractionsToSplit ?? 1}
              onChange={(e) => updateFractionsToSplit(params.row.id, e.target.value)}
              inputProps={{
                min: 1,
                step: 1,
                style: {
                  textAlign: "center",
                  padding: "2px 0",
                  fontSize: 12,
                },
              }}
              sx={{
                width: isSmUp ? 58 : 50,
                minWidth: isSmUp ? 58 : 50,
                maxWidth: isSmUp ? 58 : 50,
                "& .MuiInputBase-root": {
                  fontSize: 12,
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    opacity: 1,
                  },
              }}
            />
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 42,
        minWidth: 42,
        maxWidth: 42,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: "center",
        renderCell: (params) => (
          <IconButton
            size="small"
            onClick={() => removeFromRight(params.row.id)}
            sx={{
              color: "#E85B5B",
              p: 0.25,
              "&:hover": {
                backgroundColor: "rgba(232,91,91,0.08)",
              },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          </IconButton>
        ),
      },
    ];
  }, [isLgUp, isMdUp, isSmUp, selectedRows]);

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
              placeholder="Buscar por ID / Emisor / Pagador"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
            />

            {loading ? (
              <BillsLeftSkeleton />
            ) : (
             <Box
    sx={{
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
    }}
  >
                <DataGrid
                  rows={filteredAvailable}
                  columns={leftColumns}
                  checkboxSelection
                  disableRowSelectionOnClick
                  selectionModel={leftSelectionModel}
                  onSelectionModelChange={syncSelectionToCart}
                  rowSelectionModel={leftSelectionModel}
                  onRowSelectionModelChange={syncSelectionToCart}
                  keepNonExistentRowsSelected
                  pageSizeOptions={[10, 20, 50]}
                  localeText={{
    footerRowsPerPage: "Filas por página:",
    footerTotalRows: "Total de filas:",
    MuiTablePagination: {
      labelRowsPerPage: "Filas por página:",
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
    },
  }}
                  initialState={{
  pagination: { paginationModel: { page: 0, pageSize: 10 } },
  sorting: {
    sortModel: [{ field: "billId", sort: "desc" }],
  },
}}
                  rowHeight={32}
                  columnHeaderHeight={34}
                  sx={{
                    border: 0,
                    height: "100%",
                    backgroundColor: "transparent",
                   "& .MuiDataGrid-main": {
  border: 0,
  minHeight: 0,
},
"& .MuiDataGrid-virtualScroller": {
  overflowY: "auto",
  overflowX: "hidden",
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
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
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
                    "& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox": {
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
                  }}
                />
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
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#222",
                }}
              >
                Facturas por negociar en esta operación
              </Typography>

              <Typography
                sx={{
                  cursor: selectedRows.length ? "pointer" : "not-allowed",
                  color: selectedRows.length ? "#E53935" : "#BDBDBD",
                  fontSize: 12,
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
                mb: 1.5,
                "& .MuiInputBase-root": {
                  backgroundColor: "#fff",
                  fontSize: 12,
                },
              }}
              value={searchRight}
              onChange={(e) => setSearchRight(e.target.value)}
            />

            {filteredSelected.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                Aún no has seleccionado facturas
              </Box>
            ) : (
              <>
               <Box
  sx={{
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  }}
>
                  <DataGrid
                    rows={filteredSelected}
                    columns={rightColumns}
                    hideFooter
                    disableRowSelectionOnClick
                    rowHeight={34}
                    columnHeaderHeight={34}
                    sx={{
                      border: 0,
                      height: "100%",
                      backgroundColor: "transparent",
                      "& .MuiDataGrid-virtualScroller": {
  overflowY: "auto",
  overflowX: "hidden",
},
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#E9E9E9",
                        borderBottom: "1px solid #DADADA",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        px: 0.75,
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#1F1F1F",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      },
                      "& .MuiDataGrid-row": {
                        backgroundColor: "transparent",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: 12,
                        color: "#2D2D2D",
                        px: 0.75,
                      },
                      "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                        outline: "none",
                      },
                     "& .MuiDataGrid-virtualScroller": {
  overflowY: "auto",
  overflowX: "hidden",
},
                      "& .MuiDataGrid-main": {
  border: 0,
  minHeight: 0,
},
                      "& .MuiDataGrid-footerContainer": {
                        display: "none",
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 1,
                    pt: 1,
                    borderTop: "1px solid #DCDCDC",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
              <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.25,
  }}
>
  <Typography
    sx={{
      fontSize: 12,
      fontWeight: 700,
      color: "#36A7A7",
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
</Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#222",
                    }}
                  >
                    {formatCurrency(selectedTotalBalance)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};