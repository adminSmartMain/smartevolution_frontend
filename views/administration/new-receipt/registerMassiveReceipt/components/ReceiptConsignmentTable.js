import { useMemo, useState, useCallback, useEffect , useRef} from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  Skeleton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Toast } from "@components/toast";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";


const STATUS_CONFIG = {
  canceled_anticipated: {
    label: "Cancelado Anticipado",
    color: "#ff9800",
    summaryKey: "canceledAnticipated",
  },
  canceled_expired: {
    label: "Cancelado Vencido",
    color: "#c70000",
    summaryKey: "canceledExpired",
  },
  partial_current: {
    label: "Parcial vigente",
    color: "#5B9CFF",
    summaryKey: "partialCurrent",
  },
  canceled_current: {
    label: "Cancelado Vigente",
    color: "#20B889",
    summaryKey: "canceledCurrent",
  },
  partial_expired: {
    label: "Parcial Vencido",
    color: "#FF4747",
    summaryKey: "partialExpired",
  },
  partial_anticipated: {
    label: "Parcial Anticipado",
    color: "#FFB020",
    summaryKey: "partialAnticipated",
  },
};

const statusOrder = [
  "canceled_anticipated",
  "partial_anticipated",
  "canceled_expired",
  "partial_expired",
  "canceled_current",
  "partial_current",
];

const ConsignmentSkeleton = () => (
  <Box sx={{ px: 2, py: 2 }}>
    {Array.from({ length: 8 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 1fr 1fr 1fr 1fr",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Skeleton variant="circular" width={18} height={18} />
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={24} />
        <Skeleton variant="text" height={24} />
      </Box>
    ))}
  </Box>
);

export const ReceiptConsignmentTable = ({
  rows = [],
  summary = {},
  loading = false,
  user,
  emitterName,
  payerName,
  applicationDate,
  receiptTypeLabel = "Transferencia",
  onExcelGenerated,
  exposeGenerateExcel,
  onDeleteRow,
}) => {
  const [search, setSearch] = useState("");

  const norm = (value) => (value ?? "").toString().trim().toLowerCase();
const formatCurrency = (value) => {
  const number = Number(value || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `$${number}`;
};
  
const parseDateParts = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      day: String(value.getDate()).padStart(2, "0"),
      month: String(value.getMonth() + 1).padStart(2, "0"),
      year: String(value.getFullYear()),
    };
  }

  const stringValue = String(value).trim();

  // Caso seguro para strings tipo YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
  const isoDateMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;

    return {
      day,
      month,
      year,
    };
  }

  // Caso para strings tipo DD/MM/YYYY
  const localDateMatch = stringValue.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

  if (localDateMatch) {
    const [, day, month, year] = localDateMatch;

    return {
      day,
      month,
      year,
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
};

const formatDate = (value, separator = "/") => {
  const parts = parseDateParts(value);

  if (!parts) return value ? String(value) : "";

  return `${parts.day}${separator}${parts.month}${separator}${parts.year}`;
};

const formatDateForFile = (value = new Date()) => {
  return formatDate(value, "-");
};

  const tableRows = useMemo(() => {
    return (Array.isArray(rows) ? rows : []).map((row, index) => ({
      ...row,
      id: String(row?.id || row?.preOperationId || `row-${index}`),
      billId: row?.billId || "",
      fraction: Number(row?.fraction || 1),
      investorName: row?.investorName || "-",
      opId: row?.opId || "",
      periodStart: row?.periodStart || row?.opDate || "",
      periodEnd: row?.periodEnd || row?.expirationDate || "",
      futureValue: Number(row?.futureValue || 0),
      nominalValue: Number(row?.nominalValue || row?.currentBalance || 0),
      pending: Number(row?.pending || 0),
      additionalDays: Number(row?.additionalDays || 0),
      interests: Number(row?.interests || row?.additionalInterests || 0),
      toCollect: Number(row?.toCollect || 0),
      statusKey: row?.statusKey || "partial_current",
    }));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = norm(search);

    if (!q) return tableRows;

    return tableRows.filter(
      (row) =>
        norm(row.billId).includes(q) ||
        norm(row.investorName).includes(q) ||
        norm(row.opId).includes(q) ||
        norm(row.statusKey).includes(q)
    );
  }, [tableRows, search]);

  const resolvedSummary = useMemo(() => {
    const base = {
      canceledAnticipated: 0,
      partialAnticipated: 0,
      canceledExpired: 0,
      partialExpired: 0,
      canceledCurrent: 0,
      partialCurrent: 0,
      ...summary,
    };

    if (summary && Object.keys(summary).length > 0) {
      return base;
    }

    tableRows.forEach((row) => {
      const config = STATUS_CONFIG[row.statusKey];

      if (config?.summaryKey) {
        base[config.summaryKey] += 1;
      }
    });

    return base;
  }, [summary, tableRows]);

  const generateExcel = useCallback(async () => {
    if (!tableRows.length) {
      Toast("No hay recaudos para generar Excel.", "warning");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Recaudos");

    sheet.getCell("A1").value = "SMART EVOLUTION S.A.S";
    sheet.getCell("A2").value = "REGISTRO MASIVO DE RECAUDOS";
    sheet.getCell("A3").value = "Creado el";
    sheet.getCell("B3").value = formatDateForFile(new Date());
    sheet.getCell("A4").value = "Creado por";
    sheet.getCell("B4").value = user?.name || "Usuario Smart Evolution";
    sheet.getCell("D3").value = "Emisor";
    sheet.getCell("E3").value = emitterName || "";
    sheet.getCell("D4").value = "Pagador";
    sheet.getCell("E4").value = payerName || "";
    sheet.getCell("G3").value = "Tipo";
    sheet.getCell("H3").value = receiptTypeLabel || "";
    sheet.getCell("G4").value = "Fecha Aplicación";
    sheet.getCell("H4").value = formatDate(applicationDate);

    const headers = [
  "ESTADO",
  "FACTURA",
  "FRACCIÓN",
  "INVERSIONISTA",
  "OPID",
  "PERIODO INICIO",
  "PERIODO FIN",
  "VALOR FUTURO",
  "VALOR NOMINAL",
  "PENDIENTE",
  "DÍAS ADIC.",
  "INTERESES",
  "POR COBRAR",
  "DÍAS CÁLCULO",
  "MONTO APLICACIÓN",
  "PREOPERACIÓN",
  "ID FACTURA",
  "TIPO RECAUDO",
  "ESTADO RECAUDO",
];

    headers.forEach((header, index) => {
      const cell = sheet.getCell(6, index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F78D1" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    tableRows.forEach((row, index) => {
      const excelRow = 7 + index;
      const statusConfig = STATUS_CONFIG[row.statusKey] || {};

      const values = [
  statusConfig.label || row.statusKey,
  row.billId,
  row.fraction,
  row.investorName,
  row.opId,
  formatDate(row.periodStart),
formatDate(row.periodEnd),
  row.futureValue,
  row.nominalValue,
  row.pending,
  row.additionalDays,
  row.interests,
  row.toCollect,

  // Inputs editables para carga posterior
  row.calculatedDays || row.additionalDays || 0,
  row.payedAmount || row.toCollect || 0,

  row.preOperationId,
  row.billUniqueId,
  row.typeReceipt || row.receiptType,
  row.receiptStatus,
];

values.forEach((value, colIndex) => {
  const cell = sheet.getCell(excelRow, colIndex + 1);
  cell.value = value;

  if ([13, 14].includes(colIndex)) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF2CC" },
    };

    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };

    cell.protection = {
      locked: false,
    };
  }



  if ([7, 8, 9, 11, 12, 14].includes(colIndex)) {
    cell.numFmt = '"$"#,##0.00';
  }
});
    });

    sheet.columns = [
  { width: 24 },
  { width: 24 },
  { width: 12 },
  { width: 32 },
  { width: 14 },
  { width: 18 },
  { width: 18 },
  { width: 18 },
  { width: 18 },
  { width: 18 },
  { width: 14 },
  { width: 18 },
  { width: 18 },
  { width: 16 }, // DÍAS CÁLCULO
  { width: 20 }, // MONTO APLICACIÓN
  { width: 36 },
  { width: 36 },
  { width: 36 },
  { width: 36 },
];

    sheet.autoFilter = {
      from: { row: 6, column: 1 },
      to: { row: 6, column: headers.length },
    };

    sheet.views = [{ state: "frozen", ySplit: 6 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `RecaudosMasivos-${formatDateForFile(new Date())}.xlsx`
    );

    onExcelGenerated?.(true);
  }, [
    tableRows,
    user,
    emitterName,
    payerName,
    applicationDate,
    receiptTypeLabel,
    onExcelGenerated,
  ]);

  useEffect(() => {
  if (typeof exposeGenerateExcel === "function") {
    exposeGenerateExcel(generateExcel);
  }
}, [generateExcel]);

  const moneyCellSx = {
  fontSize: 10.8,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
  textAlign: "right",
};

const compactTextSx = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const columns = [
 
  {
    field: "billId",
    headerName: "Factura",
    width: 145,
    minWidth: 145,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
        <Typography
          title={params.row.billId}
          sx={{
            ...compactTextSx,
            fontSize: 10.8,
            fontWeight: 800,
          }}
        >
          {params.row.billId}
        </Typography>

        <Typography sx={{ fontSize: 10, color: "#111" }}>
          Fracción: {params.row.fraction}
        </Typography>
      </Box>
    ),
  },
  {
    field: "investorName",
    headerName: "Inversionista",
    width: 230,
    minWidth: 230,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
        <Typography
          title={params.row.investorName}
          sx={{
            ...compactTextSx,
            fontSize: 10.8,
            fontWeight: 700,
          }}
        >
          {params.row.investorName}
        </Typography>

        <Typography sx={{ fontSize: 10, color: "#111" }}>
          OpID: {params.row.opId || "-"}
        </Typography>
      </Box>
    ),
  },
  {
    field: "period",
    headerName: "Periodo",
    width: 92,
    minWidth: 92,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <Typography sx={{ fontSize: 10.2, whiteSpace: "nowrap" }}>
          {formatDate(params.row.periodStart)}
        </Typography>

        <Typography sx={{ fontSize: 10.2, whiteSpace: "nowrap" }}>
          {formatDate(params.row.periodEnd)}
        </Typography>
      </Box>
    ),
  },
  {
    field: "futureValue",
    headerName: "Valor Futuro",
    width: 122,
    minWidth: 122,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (params) => {
      const value = formatCurrency(params.value);

      return (
        <Typography sx={{ ...moneyCellSx, fontWeight: 700 }} title={value}>
          {value}
        </Typography>
      );
    },
  },
  {
    field: "nominalValue",
    headerName: "Valor Nominal",
    width: 126,
    minWidth: 126,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (params) => {
      const value = formatCurrency(params.value);

      return (
        <Typography sx={moneyCellSx} title={value}>
          {value}
        </Typography>
      );
    },
  },
  {
    field: "pending",
    headerName: "Pendiente",
    width: 102,
    minWidth: 102,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (params) => {
      const value = formatCurrency(params.value);

      return (
        <Typography sx={moneyCellSx} title={value}>
          {value}
        </Typography>
      );
    },
  },
  {
    field: "additionalDays",
    headerName: "Días adic.",
    width: 82,
    minWidth: 82,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 10.8 }}>
        {params.value || 0}
      </Typography>
    ),
  },
  {
    field: "interests",
    headerName: "Intereses",
    width: 130,
    minWidth: 130,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (params) => {
      const value = formatCurrency(params.value);

      return (
        <Typography sx={moneyCellSx} title={value}>
          {value}
        </Typography>
      );
    },
  },
  {
    field: "toCollect",
    headerName: "Por Cobrar",
    width: 155,
    minWidth: 155,
    maxWidth: 155,
    align: "right",
    headerAlign: "right",
    sortable: false,
    renderCell: (params) => {
      const value = formatCurrency(params.value);

      return (
        <Typography
          sx={{
            ...moneyCellSx,
            fontSize: 10.9,
            fontWeight: 800,
          }}
          title={value}
        >
          {value}
        </Typography>
      );
    },
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
  headerAlign: "center",
  renderCell: (params) => (
    <Tooltip title="Quitar del lote">
      <IconButton
        size="small"
        onClick={() => onDeleteRow?.(params.row)}
        sx={{
          color: "#D32F2F",
          p: 0.25,
          "&:hover": {
            backgroundColor: "rgba(211, 47, 47, 0.08)",
          },
        }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
}
];

  return (
<Box
  sx={{
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    px: 0,
    pt: 1,
  }}
>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 800,
          mb: 1.25,
          color: "#111",
        }}
      >
        Consignación de Recaudos
      </Typography>

    {/*  <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "60px repeat(6, minmax(0, 1fr))",
          gap: 1.25,
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          Estado
        </Typography>

        {statusOrder.map((statusKey) => {
          const config = STATUS_CONFIG[statusKey];
          const count = resolvedSummary?.[config.summaryKey] || 0;

          return (
            <Chip
              key={statusKey}
              label={`${config.label} (${count})`}
              sx={{
                height: 32,
                bgcolor: "#D9D9D9",
                color: "#111",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: "6px",
                justifyContent: "flex-start",
                "& .MuiChip-icon": {
                  ml: 1,
                },
              }}
              icon={
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: config.color,
                  }}
                />
              }
            />
          );
        })}
      </Box>
*/}
      <TextField
        placeholder="Buscar por ID"
        fullWidth
        size="small"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{
          mb: 1.25,
          "& .MuiOutlinedInput-root": {
            height: 34,
            borderRadius: "4px",
            backgroundColor: "#fff",
          },
          "& .MuiInputBase-input": {
            fontSize: 12,
          },
        }}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <ConsignmentSkeleton />
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => String(row.id)}
            disableSelectionOnClick
            disableRowSelectionOnClick
            hideFooter
            rowHeight={42}
            columnHeaderHeight={34}
            localeText={{
              noRowsLabel: "No hay recaudos calculados",
            }}
            sx={{
  border: 0,
  height: "100%",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  backgroundColor: "transparent",

  "& .MuiDataGrid-main": {
    border: 0,
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  },

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#fff",
    borderBottom: "none",
    minHeight: "34px !important",
    maxHeight: "34px !important",
  },

  "& .MuiDataGrid-columnHeader": {
    px: "4px",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
    fontSize: 11.5,
    color: "#111",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "#fff",
    borderBottom: "1px solid #E6E6E6",
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    px: "4px",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },

  "& .MuiDataGrid-cellContent": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
    outline: "none",
  },

  "& .MuiDataGrid-virtualScroller": {
    overflowY: filteredRows.length ? "auto" : "hidden",
    overflowX: "hidden",
  },

  "& .MuiDataGrid-virtualScrollerContent": {
    minWidth: "100% !important",
  },

  "& .MuiDataGrid-virtualScrollerRenderZone": {
    minWidth: "100% !important",
  },
   "& .MuiDataGrid-virtualScroller": {
    overflowY: filteredRows.length ? "auto" : "hidden",
    overflowX: "auto",
  },
}}
          />
        )}
      </Box>

      
    </Box>
  );
};