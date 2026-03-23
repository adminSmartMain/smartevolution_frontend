import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Button,
} from "@mui/material";
import { Toast } from "@components/toast";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GetClientsWithAccounts } from "../queries";
const InvestorsTableSkeleton = () => {
  return (
    <Box sx={{ px: 1, pt: 0.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr 0.7fr 1.6fr 1.1fr 0.8fr",
          gap: 2,
          alignItems: "center",
          mb: 1.5,
          px: 1,
        }}
      >
        <Skeleton variant="text" height={26} />
        <Skeleton variant="text" height={26} />
        <Skeleton variant="text" height={26} />
        <Skeleton variant="text" height={26} />
        <Skeleton variant="text" height={26} />
        <Skeleton variant="text" height={26} />
      </Box>

      {Array.from({ length: 10 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr 0.7fr 1.6fr 1.1fr 0.8fr",
            gap: 2,
            alignItems: "center",
            minHeight: 52,
            borderBottom: "1px solid #E6E6E6",
            px: 1,
          }}
        >
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="rounded" height={36} />
          <Skeleton variant="rounded" height={36} />
          <Skeleton variant="text" height={24} />
        </Box>
      ))}
    </Box>
  );
};

export const InvestorsAssignmentTable = ({
  billsToNegotiate = [],
  investorAssignments = [],
  investors = [],
  getBillFractionFetch,
    getBillFractionBulkFetch,

  cargarCuentas,
  cargarBrokerFromInvestor,
  setFieldValue,
  opId,
  opDate,
  emitter,
  payerId,
  payerName,
  user,
  formik,
  investorsExcelGenerated = false,
  setInvestorsExcelGenerated,
}) => {
  const [loadingRows, setLoadingRows] = useState(false);
  const [search, setSearch] = useState("");
  const norm = (v) => (v ?? "").toString().trim().toLowerCase();
  const [validInvestors, setValidInvestors] = useState([]);
  const [loadingValidInvestors, setLoadingValidInvestors] = useState(false);

  useEffect(() => {
  let cancelled = false;

  const loadValidInvestors = async () => {
    if (!Array.isArray(investors) || investors.length === 0) {
      setValidInvestors([]);
      return;
    }

    setLoadingValidInvestors(true);

    try {
      const clientIds = investors
        .map((inv) => inv?.value ?? inv?.data?.id ?? inv?.id)
        .filter(Boolean);

      const response = await GetClientsWithAccounts({
        client_ids: clientIds,
      });

      const rows = response?.data || [];
      const validIds = new Set(
        rows
          .filter((item) => item?.has_accounts)
          .map((item) => String(item.client_id))
      );

      if (cancelled) return;

      const filtered = investors.filter((inv) => {
        const id = inv?.value ?? inv?.data?.id ?? inv?.id;
        return validIds.has(String(id));
      });

      setValidInvestors(filtered);
    } catch (error) {
      console.error("Error loading clients with accounts:", error);
      if (!cancelled) {
        setValidInvestors([]);
      }
    } finally {
      if (!cancelled) {
        setLoadingValidInvestors(false);
      }
    }
  };

  loadValidInvestors();

  return () => {
    cancelled = true;
  };
}, [investors]);
  const getBillId = (bill, index) =>
    bill?.id ??
    bill?.billId ??
    bill?.number ??
    bill?.invoiceId ??
    `bill-${index}`;
    const formatCurrency = (value) =>
      Number(value || 0).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

  const formatDateForFile = (dateValue) => {
    const date = dateValue ? new Date(dateValue) : new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatDateForExcelCell = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "";
    return d;
  };

  const lastProcessedSignatureRef = useRef("");
const billsSignature = useMemo(() => {
  return JSON.stringify(
    (billsToNegotiate || []).map((bill, index) => ({
      id: bill?.id ?? bill?.billId ?? bill?.number ?? `bill-${index}`,
      fractionsToSplit: Number(bill?.fractionsToSplit ?? 1),
    }))
  );
}, [billsToNegotiate]);
useEffect(() => {
  let cancelled = false;

  const buildRows = async () => {
    if (!Array.isArray(billsToNegotiate) || billsToNegotiate.length === 0) {
      lastProcessedSignatureRef.current = "";
      setFieldValue("investorAssignments", []);
      return;
    }

    if (lastProcessedSignatureRef.current === billsSignature) {
      return;
    }

    setLoadingRows(true);

    try {
      const payload = {
        bills: billsToNegotiate.map((bill, index) => ({
          id: bill?.id ?? bill?.billId ?? bill?.number ?? `bill-${index}`,
          billId: bill?.billId ?? bill?.number ?? "",
          fractionsToSplit: Number(bill?.fractionsToSplit ?? 1),
        })),
      };

      const response = await getBillFractionBulkFetch(payload);

      let rowsFromApi = [];

      if (Array.isArray(response)) {
        rowsFromApi = response;
      } else if (Array.isArray(response?.data)) {
        rowsFromApi = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        rowsFromApi = response.data.data;
      } else if (Array.isArray(response?.rows)) {
        rowsFromApi = response.rows;
      } else if (Array.isArray(response?.data?.rows)) {
        rowsFromApi = response.data.rows;
      }

      if (cancelled) return;

      const merged = rowsFromApi.map((row) => {
        const existing = (investorAssignments || []).find((it) => it.id === row.id);

        return existing
          ? {
              ...row,
              investorId: existing.investorId ?? "",
              investorLabel: existing.investorLabel ?? "",
              selectedInvestor: existing.selectedInvestor ?? null,
              investorBrokerId: existing.investorBrokerId ?? "",
              investorBrokerName: existing.investorBrokerName ?? "",
              accountId: existing.accountId ?? "",
              selectedAccount: existing.selectedAccount ?? null,
              availableAccounts: existing.availableAccounts ?? [],
              accountAvailableBalance: existing.accountAvailableBalance ?? 0,
              accountTotalBalance: existing.accountTotalBalance ?? 0,
            }
          : row;
      });

      lastProcessedSignatureRef.current = billsSignature;
      setFieldValue("investorAssignments", merged);
    } catch (error) {
      console.error("Error building investor rows:", error);
      if (!cancelled) {
        setFieldValue("investorAssignments", []);
      }
    } finally {
      if (!cancelled) {
        setLoadingRows(false);
      }
    }
  };

  buildRows();

  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [billsSignature]);

  const filteredRows = useMemo(() => {
    const q = norm(search);
    if (!q) return investorAssignments || [];

    return (investorAssignments || []).filter(
      (r) =>
        norm(r.billId).includes(q) ||
        norm(r.fraction).includes(q) ||
        norm(r.investorLabel).includes(q)
    );
  }, [investorAssignments, search]);

  const updateRow = (rowId, patch) => {
    const updated = (investorAssignments || []).map((row) =>
      row.id === rowId ? { ...row, ...patch } : row
    );

    setFieldValue("investorAssignments", updated);
    setInvestorsExcelGenerated?.(false);
  };

  const handleInvestorChange = async (row, newInvestor) => {
  if (!newInvestor) {
    updateRow(row.id, {
      investorId: "",
      investorLabel: "",
      selectedInvestor: null,
      investorBrokerId: "",
      investorBrokerName: "",
      accountId: "",
      selectedAccount: null,
      availableAccounts: [],
      accountAvailableBalance: 0,
      accountTotalBalance: 0,
    });
    return;
  }

  const investorId =
    newInvestor?.value ?? newInvestor?.data?.id ?? newInvestor?.id ?? "";

  const emitterId =
    formik?.emitter?.value ??
    formik?.emitter?.data?.id ??
    emitter?.value ??
    emitter?.data?.id ??
    "";

  if (String(investorId) === String(emitterId)) {
    Toast(
      "El emisor no puede ser el mismo inversionista en ninguna fracción",
      "warning"
    );

    updateRow(row.id, {
      investorId: "",
      investorLabel: "",
      selectedInvestor: null,
      investorBrokerId: "",
      investorBrokerName: "",
      accountId: "",
      selectedAccount: null,
      availableAccounts: [],
      accountAvailableBalance: 0,
      accountTotalBalance: 0,
    });
    return;
  }

  const investorLabel =
    newInvestor?.label ??
    (newInvestor?.data?.first_name && newInvestor?.data?.last_name
      ? `${newInvestor.data.first_name} ${newInvestor.data.last_name}`
      : newInvestor?.data?.social_reason || "");

  let accounts = [];
  let investorBrokerId = "";
  let investorBrokerName = "";

  try {
    const cuentasResponse = await cargarCuentas?.(investorId);
    accounts = cuentasResponse?.data || [];
  } catch (error) {
    accounts = [];
  }

  try {
    const brokerResponse = await cargarBrokerFromInvestor?.(investorId);
    const brokerData = brokerResponse?.data;

    investorBrokerId = brokerData?.id || "";
    investorBrokerName =
      brokerData?.first_name && brokerData?.last_name
        ? `${brokerData.first_name} ${brokerData.last_name}`
        : brokerData?.social_reason || "";
  } catch (error) {
    investorBrokerId = "";
    investorBrokerName = "";
  }

  updateRow(row.id, {
    investorId,
    investorLabel,
    selectedInvestor: newInvestor,
    investorBrokerId,
    investorBrokerName,
    accountId: "",
    selectedAccount: null,
    availableAccounts: accounts,
    accountAvailableBalance: 0,
    accountTotalBalance: 0,
  });
};

  const handleAccountChange = (row, newAccount) => {
    if (!newAccount) {
      updateRow(row.id, {
        accountId: "",
        selectedAccount: null,
        accountAvailableBalance: 0,
        accountTotalBalance: 0,
      });
      return;
    }

    const totalBalance = Number(newAccount?.balance ?? 0);
    const availableBalance = totalBalance - Number(row.currentBalance ?? 0);

    updateRow(row.id, {
      accountId: newAccount?.id ?? "",
      selectedAccount: newAccount,
      accountAvailableBalance: availableBalance,
      accountTotalBalance: totalBalance,
    });
  };

  const allAssignmentsComplete = useMemo(() => {
    return (
      Array.isArray(investorAssignments) &&
      investorAssignments.length > 0 &&
      investorAssignments.every(
        (row) => row.investorId && row.accountId && row.investorBrokerId
      )
    );
  }, [investorAssignments]);

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Carga Masiva");

    sheet.getCell("A1").value = "SMART EVOLUTION S.A.S";
    sheet.getCell("A2").value = "REGISTRO DE OPERACIONES MASIVAS";
    sheet.getCell("A3").value = "Creado el";
    sheet.getCell("B3").value = formatDateForFile(new Date());
    sheet.getCell("A4").value = "Creado por";
    sheet.getCell("B4").value = user?.name || "Usuario Smart";

    const blueHeaders = [
      "NUMERO OPERACION",
      "FECHA OPERACION",
      "NOMBRE EMISOR",
      "ID EMISOR",
      "CORREDOR EMISOR",
      "ID CORREDOR EMISOR",
      "NOMBRE PAGADOR",
      "ID PAGADOR",
      "NUMERO FACTURA",
      "ID FACTURA",
      "SALDO FACTURA",
      "BILL FRACTION",
      "NOMBRE INVERSIONISTA",
      "ID INVERSIONISTA",
      "CUENTA INVERSIONISTA",
      "CORREDOR INVERSIONISTA",
    ];

    const purpleHeaders = [
      "FECHA PROBABLE",
      "FECHA FIN",
      "VALOR FUTURO",
      "% DESCUENTO",
      "TASA DESCUENTO",
      "TASA INVERSIONISTA",
    ];

    const allHeaders = [...blueHeaders, ...purpleHeaders];

    allHeaders.forEach((header, index) => {
      const cell = sheet.getCell(6, index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: index < blueHeaders.length ? "1F78D1" : "7B1FA2",
        },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFFFFFFF" } },
        left: { style: "thin", color: { argb: "FFFFFFFF" } },
        bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
        right: { style: "thin", color: { argb: "FFFFFFFF" } },
      };
    });

    investorAssignments.forEach((row, index) => {
      const excelRow = 7 + index;

      const emitterName = formik?.emitter?.label || emitter?.label || "";
      const emitterId = formik?.emitter?.value || emitter?.value || "";

      const selectedInvestor = row.selectedInvestor;
      const investorName =
        row.investorLabel ||
        selectedInvestor?.label ||
        selectedInvestor?.data?.social_reason ||
        "";

      const investorId =
        row.investorId ||
        selectedInvestor?.value ||
        selectedInvestor?.data?.id ||
        "";

      const accountNumber =
        row.selectedAccount?.account_number ??
        row.selectedAccount?.number ??
        "";

      const rowValues = [
        formik?.opId || opId || "",
        formatDateForExcelCell(formik?.opDate || opDate),
        emitterName,
        emitterId,
        formik?.corredorEmisor || "",
        formik?.emitterBroker || "",
        formik?.nombrepayer || payerName || "",
        formik?.nombrePagador || payerId || "",
        row.billId || "",
        row.billUniqueId || "",
        Number(row.currentBalance || 0),
        Number(row.fraction || 0),
        investorName,
        investorId,
        accountNumber,
        row.investorBrokerName || "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];

      rowValues.forEach((value, colIndex) => {
        const cell = sheet.getCell(excelRow, colIndex + 1);
        cell.value = value;

        if (colIndex === 1 && value instanceof Date) {
          cell.numFmt = "dd/mm/yyyy";
        }

        if (colIndex === 10) {
          cell.numFmt = '"$"#,##0';
        }
      });
    });

    sheet.columns = [
      { width: 22 },
      { width: 18 },
      { width: 32 },
      { width: 24 },
      { width: 28 },
      { width: 24 },
      { width: 32 },
      { width: 22 },
      { width: 22 },
      { width: 24 },
      { width: 18 },
      { width: 14 },
      { width: 30 },
      { width: 24 },
      { width: 24 },
      { width: 30 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 16 },
      { width: 18 },
      { width: 20 },
    ];

    const fileName = `${formik?.opId || opId || "Operacion"}-CargaMasiva${formatDateForFile(
      new Date()
    )}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );

    setInvestorsExcelGenerated?.(true);
  };

  const columns = [
    {
      field: "billId",
      headerName: "ID Factura",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C" }}>
          {params.row.billId}
        </Typography>
      ),
    },
    {
      field: "currentBalance",
      headerName: "Saldo",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: "#4D4D4D" }}>
          {formatCurrency(params.row.currentBalance)}
        </Typography>
      ),
    },
    {
      field: "fraction",
      headerName: "Fracción",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: "#4D4D4D" }}>
          {params.row.fraction}
        </Typography>
      ),
    },
    {
      field: "investorSelector",
      headerName: "Inversionista",
      flex: 1,
      minWidth: 300,
      sortable: false,
      renderCell: (params) => (
        <Autocomplete
  size="small"
  fullWidth
  options={validInvestors || []}
  loading={loadingValidInvestors}
  value={params.row.selectedInvestor ?? null}
  getOptionLabel={(option) =>
    option?.label ??
    (option?.data?.first_name && option?.data?.last_name
      ? `${option.data.first_name} ${option.data.last_name}`
      : option?.data?.social_reason || "")
  }
  isOptionEqualToValue={(option, value) =>
    (option?.value ?? option?.data?.id ?? option?.id) ===
    (value?.value ?? value?.data?.id ?? value?.id)
  }
  onChange={(_, newValue) => handleInvestorChange(params.row, newValue)}
  renderInput={(paramsInput) => (
    <TextField
      {...paramsInput}
      placeholder="Nombre Inversionista"
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 32,
          borderRadius: "4px",
          backgroundColor: "#fff",
          fontSize: 12,
        },
      }}
    />
  )}
  disablePortal
/>
      ),
    },
    {
      field: "accountSelector",
      headerName: "Cuenta",
      flex: 1,
      minWidth: 190,
      sortable: false,
      renderCell: (params) => (
        <Autocomplete
          size="small"
          fullWidth
          options={params.row.availableAccounts || []}
          value={params.row.selectedAccount ?? null}
          getOptionLabel={(option) =>
            option?.account_number ?? option?.number ?? option?.id ?? ""
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={(_, newValue) => handleAccountChange(params.row, newValue)}
          renderInput={(paramsInput) => (
            <TextField
              {...paramsInput}
              placeholder="Seleccione cuenta"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 32,
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  fontSize: 12,
                },
              }}
            />
          )}
          disablePortal
          disabled={!params.row.investorId || !(params.row.availableAccounts || []).length}
        />
      ),
    },
  {
  field: "accountAvailableBalance",
  headerName: "Saldo",
  minWidth: 120,
  sortable: false,
  renderCell: (params) => {
    const value = Number(params.row.accountAvailableBalance || 0);
    const isNegative = value < 0;

    return (
      <Typography
        sx={{
          fontSize: 13,
          color: isNegative ? "#D32F2F" : "#4D4D4D",
          fontWeight: isNegative ? 700 : 400,
        }}
      >
        {formatCurrency(value)}
      </Typography>
    );
  },
},
  ];

  return (
    <Grid container spacing={0} sx={{ mt: 0.5 }}>
      <Grid item xs={12}>
        <Box
          sx={{
            bgcolor: "#F5F5F5",
            borderRadius: 2,
            border: "1px solid #D9D9D9",
            px: 1.5,
            py: 1.25,
            height: 610,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              mb: 1.25,
              fontSize: 13,
              fontWeight: 600,
              color: "#3A3A3A",
            }}
          >
            Asignación de inversionistas al lote de facturas
          </Typography>

          <TextField
            placeholder="Buscar por ID"
            fullWidth
            size="small"
            sx={{
              mb: 1.25,
              "& .MuiOutlinedInput-root": {
                height: 36,
                borderRadius: "4px",
                backgroundColor: "#fff",
              },
              "& .MuiInputBase-input": {
                fontSize: 13,
              },
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Box sx={{ flex: 1, minHeight: 0 }}>
            {loadingRows ? (
              <Box
                sx={{
                  height: "100%",
                  borderRadius: 1,
                  backgroundColor: "#F5F5F5",
                  overflow: "hidden",
                }}
              >
                <InvestorsTableSkeleton />
              </Box>
            ) : (
             <DataGrid
  rows={filteredRows}
  columns={columns}
  getRowId={(row) => row.id}
  hideFooter
  disableRowSelectionOnClick
  rowHeight={40}
  columnHeaderHeight={34}
                sx={{
                  border: 0,
                  height: "100%",
                  backgroundColor: "transparent",
                  "& .MuiDataGrid-main": {
                    border: 0,
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
                    fontSize: 12,
                    color: "#333",
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: "#F5F5F5",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #E7E7E7",
                    fontSize: 12,
                    color: "#444",
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                    outline: "none",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                  },
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={generateExcel}
              disabled={!allAssignmentsComplete}
              sx={{
                minWidth: 170,
                height: 38,
                borderRadius: "6px",
                bgcolor: allAssignmentsComplete ? "#4C989B" : "#D8D8D8",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                "&:hover": {
                  bgcolor: allAssignmentsComplete ? "#43898B" : "#D8D8D8",
                },
                "&.Mui-disabled": {
                  bgcolor: "#D8D8D8",
                  color: "#fff",
                },
              }}
            >
              Generar Excel
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};