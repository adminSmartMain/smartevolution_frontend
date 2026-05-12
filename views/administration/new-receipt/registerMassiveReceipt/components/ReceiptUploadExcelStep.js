import { useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";

const ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];

const STATUS_CONFIG = {
  canceled_anticipated: {
    label: "Cancelado Anticipado",
    color: "#ff9800",
    summaryKey: "canceledAnticipated",
  },
  partial_anticipated: {
    label: "Parcial Anticipado",
    color: "#FFB020",
    summaryKey: "partialAnticipated",
  },
  canceled_expired: {
    label: "Cancelado Vencido",
    color: "#c70000",
    summaryKey: "canceledExpired",
  },
  partial_expired: {
    label: "Parcial Vencido",
    color: "#FF4747",
    summaryKey: "partialExpired",
  },
  canceled_current: {
    label: "Cancelado Vigente",
    color: "#20B889",
    summaryKey: "canceledCurrent",
  },
  partial_current: {
    label: "Parcial vigente",
    color: "#5B9CFF",
    summaryKey: "partialCurrent",
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

const bytesToKb = (bytes = 0) => `${Math.round(bytes / 1024)} kb`;

const hasValidExcelExtension = (fileName = "") => {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const isValidExcelFile = (file) => {
  if (!file) return false;
  return ACCEPTED_TYPES.includes(file.type) || hasValidExcelExtension(file.name);
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const number = Number(value || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `$${number}`;
};

const formatDate = (value) => {
  if (!value) return "";

  const raw = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const [year, month, day] = raw.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return raw;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const normalizeUploadResponse = (response) => {
  const first = response?.data ?? response ?? {};
  const data = first?.data && !Array.isArray(first.data) ? first.data : first;

  const normalizedRows =
    data?.normalizedRows ??
    data?.normalized_rows ??
    data?.data?.normalizedRows ??
    data?.data?.normalized_rows ??
    [];

  const rows =
    data?.rows ??
    data?.data?.rows ??
    [];

  return {
    success: Boolean(data?.success ?? data?.canRegister ?? data?.can_register),
    message: data?.message ?? first?.message ?? "",
    totalRows: Number(data?.totalRows ?? data?.total_rows ?? rows.length ?? 0),
    processedRows: Number(
      data?.processedRows ??
        data?.processed_rows ??
        normalizedRows.length ??
        0
    ),
    errorCount: Number(data?.errorCount ?? data?.error_count ?? 0),
    canRegister: Boolean(data?.canRegister ?? data?.can_register ?? false),
    rows: Array.isArray(rows) ? rows : [],
    normalizedRows: Array.isArray(normalizedRows) ? normalizedRows : [],
    summary: data?.summary ?? data?.data?.summary ?? {},
  };
};

const buildRowClassName = (params) => {
  if (params.row?.hasErrors) return "upload-row-error";
  return "";
};

const getFieldErrorMessage = (row, aliases = []) => {
  if (!row?.errors || !Array.isArray(row.errors)) return "";

  const found = row.errors.find((item) => aliases.includes(item?.field));

  return found?.message || "";
};

const ErrorCell = ({ value, error, align = "left", formatter }) => {
  const hasError = Boolean(error);

  const formattedValue =
    typeof formatter === "function" ? formatter(value) : value;

  const content =
    formattedValue !== null && formattedValue !== undefined && formattedValue !== ""
      ? formattedValue
      : "";

  const inner = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 30,
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "right"
            ? "flex-end"
            : align === "center"
            ? "center"
            : "flex-start",
        px: 0.5,
        bgcolor: hasError ? "#FDECEC" : "transparent",
        color: hasError ? "#D32F2F" : "#222",
        fontWeight: hasError ? 700 : 400,
        borderRadius: 0.5,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: 10.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          textAlign: align,
          color: "inherit",
        }}
      >
        {content}
      </Typography>
    </Box>
  );

  if (!hasError) return inner;

  return (
    <Tooltip title={error} arrow placement="top">
      {inner}
    </Tooltip>
  );
};

const FileErrorModal = ({ open, onClose, message }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#4AA3A3",
        fontSize: 16,
        fontWeight: 500,
        borderBottom: "1px solid #D7ECEC",
      }}
    >
      Error de archivo
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent sx={{ textAlign: "center", py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#FF1C14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ color: "#fff", fontSize: 38 }} />
        </Box>
      </Box>

      <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
        Formato de archivo no válido
      </Typography>

      <Typography sx={{ fontSize: 13, color: "#555" }}>
        {message ||
          "La carga masiva de recaudos solo acepta archivos xlsx o xls."}
      </Typography>
    </DialogContent>

    <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          bgcolor: "#2E9B9B",
          px: 4,
          "&:hover": { bgcolor: "#277F7F" },
        }}
      >
        Aceptar
      </Button>
    </DialogActions>
  </Dialog>
);

const UploadCard = ({ file, onPickFile, inputRef, disabled = false }) => (
  <>
    <input
      ref={inputRef}
      type="file"
      hidden
      accept=".xlsx,.xls"
      onChange={onPickFile}
    />

    <Paper
      elevation={0}
      onClick={() => !disabled && inputRef.current?.click()}
      sx={{
        height: 44,
        width: 310,
        px: 1.2,
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        cursor: disabled ? "default" : "pointer",
        borderRadius: "7px",
        bgcolor: "#fff",
        border: "2px solid #A0A0A0",
        boxShadow: "none",
      }}
    >
      <InsertDriveFileOutlinedIcon
        sx={{
          fontSize: 27,
          color: file ? "#6F777D" : "#CFCFCF",
        }}
      />

      {!file ? (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#BDBDBD",
              lineHeight: 1,
            }}
          >
            Busca el archivo de Excel
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#C8C8C8", mt: 0.3 }}>
            Solo se aceptan archivos .xlsx o .xls
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "#404040",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.name}{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "#666" }}>
            ({bytesToKb(file.size)})
          </Box>
        </Typography>
      )}
    </Paper>
  </>
);

const ProcessingBanner = ({ status, processedMessage, errorCount }) => {
  if (status === "idle") return null;

  if (status === "processing") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AutorenewIcon sx={{ fontSize: 42, color: "#2F89D9" }} />
        <Box>
          <Typography sx={{ color: "#2F89D9", fontWeight: 700, fontSize: 15 }}>
            Procesando Excel
          </Typography>
          <Typography sx={{ color: "#2F89D9", fontSize: 13 }}>
            Validando recaudos del archivo.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (status === "processed_success") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 42, color: "#5E8D45" }} />
        <Box>
          <Typography sx={{ color: "#5E8D45", fontWeight: 700, fontSize: 15 }}>
            Excel procesado.
          </Typography>
          <Typography sx={{ color: "#5E8D45", fontSize: 13 }}>
            {processedMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (status === "processed_error") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ErrorOutlineIcon sx={{ fontSize: 42, color: "#FF1C14" }} />
        <Box>
          <Typography sx={{ color: "#FF1C14", fontWeight: 700, fontSize: 15 }}>
            El archivo tiene inconsistencias
          </Typography>
          <Typography sx={{ color: "#FF1C14", fontSize: 13 }}>
            {processedMessage}
          </Typography>
          {errorCount > 0 && (
            <Typography sx={{ color: "#FF1C14", fontSize: 12.5 }}>
              {errorCount} fila(s) con error.
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (status === "register_error") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ErrorOutlineIcon sx={{ fontSize: 42, color: "#FF1C14" }} />
        <Box>
          <Typography sx={{ color: "#FF1C14", fontWeight: 700, fontSize: 15 }}>
            Error al registrar recaudos
          </Typography>
          <Typography sx={{ color: "#FF1C14", fontSize: 13 }}>
            {processedMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export const ReceiptUploadExcelStep = ({
  uploadExcelFetch,
  registerReceipts,
  onNext,
  onProcessedRows,
  state,
  setState,
  uploadContext,
}) => {
  const inputRef = useRef(null);

  const {
    file = null,
    status = "idle",
    rows = [],
    normalizedRows = [],
    canRegister = false,
    processedMessage = "",
    errorCount = 0,
    modalError = "",
    summary = {},
  } = state || {};

  const updateState = (patch) => {
    setState((prev) => ({
      ...(prev || {}),
      ...patch,
    }));
  };

  const setInitialIdleState = (nextFile = null) => {
    updateState({
      file: nextFile,
      status: "idle",
      rows: [],
      normalizedRows: [],
      canRegister: false,
      processedMessage: "",
      errorCount: 0,
      modalError: "",
      summary: {},
      registerSummary: null,
    });
  };

  const getUploadRowKey = (row) => {
    return String(
      row?.preOperationId ||
        row?.operation ||
        row?.id ||
        row?.rowNumber ||
        row?.billId ||
        row?.billNumber ||
        ""
    );
  };

  const buildSummaryFromRows = (list = []) => {
    const nextSummary = {
      canceledAnticipated: 0,
      partialAnticipated: 0,
      canceledExpired: 0,
      partialExpired: 0,
      canceledCurrent: 0,
      partialCurrent: 0,
    };

    list.forEach((row) => {
      const config = STATUS_CONFIG[row?.statusKey];
      if (config?.summaryKey) {
        nextSummary[config.summaryKey] += 1;
      }
    });

    return nextSummary;
  };

  const handleProcessSelectedFile = async (selectedFile) => {
    if (!selectedFile || !uploadExcelFetch) return;

    updateState({
      file: selectedFile,
      status: "processing",
      rows: [],
      normalizedRows: [],
      canRegister: false,
      processedMessage: "",
      errorCount: 0,
      modalError: "",
      summary: {},
      registerSummary: null,
    });

    try {
      const formData = new FormData();
      formData.append("uploadExcel", selectedFile);

      if (uploadContext) {
        formData.append("context", JSON.stringify(uploadContext));
      }

      const response = await uploadExcelFetch(formData);
      const normalized = normalizeUploadResponse(response);

      const previewRows = (normalized.rows || []).map((row, index) => {
        const fieldErrors = row.fieldErrors ?? row.field_errors ?? {};
        const errors = Array.isArray(row.errors) ? row.errors : [];
        const hasErrors =
          Boolean(row.hasErrors) ||
          Boolean(row.has_errors) ||
          Object.keys(fieldErrors).length > 0 ||
          errors.length > 0;

        return {
          id: row.id ?? row.rowId ?? row.row_id ?? row.rowNumber ?? index + 1,
          rowNumber: row.rowNumber ?? row.row_number ?? index + 1,
          preOperationId: row.preOperationId ?? row.pre_operation_id ?? row.operation ?? "",
          operation: row.operation ?? row.preOperationId ?? row.pre_operation_id ?? "",
          billId: row.billId ?? row.bill_id ?? "",
          billNumber: row.billNumber ?? row.bill_number ?? row.billId ?? "",
          fraction: row.fraction ?? "",
          opId: row.opId ?? row.op_id ?? "",
          investorName: row.investorName ?? row.investor_name ?? "",
          periodStart: row.periodStart ?? row.period_start ?? "",
          periodEnd: row.periodEnd ?? row.period_end ?? "",
          futureValue: row.futureValue ?? row.future_value ?? 0,
          nominalValue: row.nominalValue ?? row.nominal_value ?? 0,
          pending: row.pending ?? 0,
          additionalDays: row.additionalDays ?? row.additional_days ?? 0,
          interests: row.interests ?? row.additionalInterests ?? 0,
          toCollect: row.toCollect ?? row.to_collect ?? 0,
          payedAmount: row.payedAmount ?? row.payed_amount ?? 0,
          calculatedDays: row.calculatedDays ?? row.calculated_days ?? 0,
          realDays: row.realDays ?? row.real_days ?? 0,
          receiptTypeLabel: row.receiptTypeLabel ?? row.receipt_type_label ?? "",
          statusKey: row.statusKey ?? row.status_key ?? "",
          fieldErrors,
          errors,
          hasErrors,
        };
      });

      updateState({
        file: selectedFile,
        rows: previewRows,
        normalizedRows: normalized.normalizedRows || [],
        canRegister: normalized.canRegister,
        errorCount: normalized.errorCount,
        summary: normalized.summary || buildSummaryFromRows(previewRows.filter((row) => !row.hasErrors)),
        registerSummary: null,
      });

      if (typeof onProcessedRows === "function") {
        onProcessedRows(normalized.normalizedRows || []);
      }

      if (normalized.canRegister) {
        updateState({
          status: "processed_success",
          processedMessage:
            normalized.message ||
            `Se han validado ${normalized.processedRows || previewRows.length} recaudo(s).`,
        });
      } else {
        updateState({
          status: "processed_error",
          processedMessage:
            normalized.message ||
            "El Excel contiene errores en los datos. Revise los valores resaltados.",
        });
      }
    } catch (error) {
  console.error("Error procesando Excel de recaudos:", {
    error,
    response: error?.response,
    data: error?.response?.data,
    status: error?.response?.status,
  });

  updateState({
    file: selectedFile,
    status: "processed_error",
    rows: [],
    normalizedRows: [],
    canRegister: false,
    processedMessage:
      error?.response?.data?.message ||
      error?.message ||
      "Ocurrió un error al procesar el archivo. Intente nuevamente.",
    errorCount: 1,
    summary: {},
    modalError:
      error?.response?.data?.message ||
      error?.message ||
      "Ocurrió un error al procesar el archivo. Intente nuevamente.",
    registerSummary: null,
  });
}
  };

  const handlePickFile = async (event) => {
    const picked = event.target.files?.[0];

    if (!picked) return;

    if (!isValidExcelFile(picked)) {
      setInitialIdleState(null);
      updateState({
        modalError:
          "La carga masiva de recaudos solo acepta archivos xlsx o xls.",
      });
      event.target.value = "";
      return;
    }

    await handleProcessSelectedFile(picked);
    event.target.value = "";
  };

  const handleDeleteRow = (row) => {
    const rowKey = getUploadRowKey(row);

    if (!rowKey) return;

    const updatedRows = (rows || []).filter(
      (item) => getUploadRowKey(item) !== rowKey
    );

    const updatedNormalizedRows = (normalizedRows || []).filter(
      (item) => getUploadRowKey(item) !== rowKey
    );

    const updatedErrorCount = updatedRows.filter((item) => item?.hasErrors).length;
    const updatedSummary = buildSummaryFromRows(
      updatedRows.filter((item) => !item?.hasErrors)
    );

    const nextCanRegister =
      updatedRows.length > 0 &&
      updatedNormalizedRows.length > 0 &&
      updatedErrorCount === 0;

    updateState({
      rows: updatedRows,
      normalizedRows: updatedNormalizedRows,
      errorCount: updatedErrorCount,
      canRegister: nextCanRegister,
      summary: updatedSummary,
      registerSummary: null,
      status:
        updatedRows.length === 0
          ? "idle"
          : updatedErrorCount > 0
          ? "processed_error"
          : "processed_success",
      processedMessage:
        updatedRows.length === 0
          ? ""
          : updatedErrorCount > 0
          ? "El Excel contiene errores en los datos. Revise los valores resaltados."
          : `Se han validado ${updatedRows.length} recaudo(s).`,
    });

    if (typeof onProcessedRows === "function") {
      onProcessedRows(updatedNormalizedRows);
    }
  };

  const handleRegisterReceipts = async () => {
  if (!registerReceipts || !normalizedRows?.length || !canRegister) return;

  updateState({
    status: "processing",
    processedMessage: "Registrando recaudos...",
    modalError: "",
  });

  try {
    const response = await registerReceipts(normalizedRows);
    const data = response?.data ?? response ?? {};

    const createdCount = Number(
      data?.createdCount ??
        data?.created_count ??
        data?.count ??
        (Array.isArray(data?.data) ? data.data.length : 0) ??
        0
    );

    const normalizedData = {
      ...data,
      createdCount,
    };

    const failed =
      normalizedData?.error === true ||
      normalizedData?.success === false ||
      !response;

    if (failed) {
      throw new Error(
        normalizedData?.message || "No fue posible registrar los recaudos."
      );
    }

    updateState({
      status: "registered_success",
      processedMessage: `Se registraron ${createdCount} recaudo(s).`,
      registerSummary: normalizedData,
      createdCount,
    });

    if (typeof onNext === "function") {
      onNext(normalizedData);
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Ocurrió un error al registrar los recaudos.";

    updateState({
      status: "register_error",
      processedMessage: errorMessage,
      modalError: errorMessage,
      registerSummary: null,
    });
  }
};

  const columns = useMemo(
    () => [
      {
        field: "statusKey",
        headerName: "",
        width: 28,
        minWidth: 28,
        maxWidth: 28,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const config = STATUS_CONFIG[params.row.statusKey] || {};

          return (
            <Box
              sx={{
                width: 17,
                height: 17,
                borderRadius: "50%",
                bgcolor: config.color || "#9E9E9E",
              }}
            />
          );
        },
      },
      {
        field: "billNumber",
        headerName: "Factura",
        width: 150,
        minWidth: 150,
        renderCell: (params) => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
            <ErrorCell
              value={params.value}
              error={getFieldErrorMessage(params.row, ["billNumber", "bill_number", "billId", "factura"])}
            />
            <Typography sx={{ fontSize: 9.5, color: "#111", pl: 0.5 }}>
              Fracción: {params.row.fraction || "-"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "investorName",
        headerName: "Inversionista",
        width: 190,
        minWidth: 190,
        renderCell: (params) => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
            <ErrorCell
              value={params.value}
              error={getFieldErrorMessage(params.row, ["investorName", "investor_name", "inversionista"])}
            />
            <Typography sx={{ fontSize: 9.5, color: "#111", pl: 0.5 }}>
              OpID: {params.row.opId || "-"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "period",
        headerName: "Periodo",
        width: 95,
        minWidth: 95,
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
        width: 120,
        minWidth: 120,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["futureValue", "future_value"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "nominalValue",
        headerName: "Valor Nominal",
        width: 125,
        minWidth: 125,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["nominalValue", "nominal_value"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "pending",
        headerName: "Pendiente",
        width: 110,
        minWidth: 110,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["pending"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "additionalDays",
        headerName: "Días adic.",
        width: 78,
        minWidth: 78,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <ErrorCell
            value={params.value ?? 0}
            error={getFieldErrorMessage(params.row, ["additionalDays", "additional_days"])}
            align="center"
          />
        ),
      },
      {
        field: "interests",
        headerName: "Intereses",
        width: 115,
        minWidth: 115,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["interests", "additionalInterests"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "toCollect",
        headerName: "Por Cobrar",
        width: 125,
        minWidth: 125,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["toCollect", "to_collect"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "payedAmount",
        headerName: "Monto Aplicado",
        width: 130,
        minWidth: 130,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["payedAmount", "monto_aplicacion"])}
            align="right"
            formatter={formatCurrency}
          />
        ),
      },
      {
        field: "daysInfo",
        headerName: "Días Cal / Reales",
        width: 105,
        minWidth: 105,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <ErrorCell
            value={`${params.row.calculatedDays ?? 0} / ${params.row.realDays ?? 0}`}
            error={getFieldErrorMessage(params.row, ["calculatedDays", "dias_calculo"])}
            align="center"
          />
        ),
      },
      {
        field: "receiptTypeLabel",
        headerName: "Recaudo",
        width: 145,
        minWidth: 145,
        renderCell: (params) => (
          <ErrorCell
            value={params.value}
            error={getFieldErrorMessage(params.row, ["receiptType", "typeReceipt"])}
          />
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
        headerAlign: "center",
        renderCell: (params) => (
          <Tooltip title="Excluir del registro">
            <IconButton
              size="small"
              onClick={() => handleDeleteRow(params.row)}
              sx={{
                color: "#E74B4B",
                p: 0.25,
                "&:hover": {
                  backgroundColor: "rgba(231,75,75,0.08)",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [rows, normalizedRows]
  );

  const showEmptyPreview = status === "idle" && rows.length === 0;

  const showRegisterButton =
    (status === "processed_success" || status === "processed_error") &&
    canRegister;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <FileErrorModal
        open={Boolean(modalError)}
        onClose={() => updateState({ modalError: "" })}
        message={modalError}
      />

      {status !== "registered_success" && (
        <>
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1, mt: 1 }}>
              Carga de Excel
            </Typography>

            <Box
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
                const count = summary?.[config.summaryKey] || 0;

                return (
                  <Box
                    key={statusKey}
                    sx={{
                      height: 32,
                      bgcolor: "#D9D9D9",
                      color: "#111",
                      fontSize: 11.5,
                      fontWeight: 500,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      gap: 0.8,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: config.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {config.label} ({count})
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                height: 64,
                px: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                bgcolor:
                  status === "processed_success" || status === "registered_success"
                    ? "#DDF5D6"
                    : "#F1F1F1",
                boxShadow: "0 4px 7px rgba(0,0,0,0.25)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                <UploadCard
                  file={file}
                  onPickFile={handlePickFile}
                  inputRef={inputRef}
                  disabled={status === "processing"}
                />

                <ProcessingBanner
                  status={status}
                  processedMessage={processedMessage}
                  errorCount={errorCount}
                />
              </Box>

              <Button
                variant="contained"
                disabled={!showRegisterButton}
                onClick={handleRegisterReceipts}
                sx={{
                  width: 180,
                  height: 44,
                  borderRadius: "7px",
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  bgcolor: showRegisterButton ? "#0D939D" : "#D8D8D8",
                  color: "#fff",
                  boxShadow: "none",
                  border: showRegisterButton ? "none" : "1px solid #A7A7A7",
                  "&:hover": {
                    bgcolor: showRegisterButton ? "#087F88" : "#D8D8D8",
                    boxShadow: "none",
                  },
                }}
              >
                Registrar
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 1.5,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              getRowClassName={buildRowClassName}
              disableRowSelectionOnClick
              hideFooter={rows.length <= 10}
              pageSizeOptions={[10, 20, 50]}
              loading={status === "processing"}
              localeText={{
                noRowsLabel: "Aún no has cargado un archivo",
                footerRowsPerPage: "Filas por página:",
                MuiTablePagination: {
                  labelRowsPerPage: "Filas por página:",
                  labelDisplayedRows: ({ from, to, count }) =>
                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
                },
              }}
              sx={{
                height: "100%",
                minHeight: 460,
                border: 0,
                backgroundColor: "transparent",
                "& .MuiDataGrid-main": {
                  minHeight: 0,
                  minWidth: 0,
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowY: "auto",
                  overflowX: "auto",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#fff",
                  borderBottom: "none",
                  minHeight: "32px !important",
                  maxHeight: "32px !important",
                },
                "& .MuiDataGrid-columnHeader": {
                  px: 0.5,
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  fontSize: 10.5,
                  color: "#222",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
                "& .MuiDataGrid-cell": {
                  fontSize: 10.5,
                  borderBottom: "1px solid #E6E6E6",
                  color: "#222",
                  display: "flex",
                  alignItems: "center",
                  px: 0.5,
                  overflow: "hidden",
                },
                "& .MuiDataGrid-row": {
                  minHeight: "38px !important",
                  maxHeight: "38px !important",
                },
                "& .MuiDataGrid-row.upload-row-error": {
                  backgroundColor: "#fff",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                },
              }}
              slots={{
                noRowsOverlay: () =>
                  showEmptyPreview ? (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#D2D2D2",
                      }}
                    >
                      <InsertDriveFileOutlinedIcon sx={{ fontSize: 120, opacity: 0.6 }} />
                    <Typography sx={{ mt: 1, fontWeight: 600, color: "#C8C8C8" }}>
  {file
    ? "No se pudieron previsualizar filas"
    : "Aún no has cargado un archivo"}
</Typography>
<Typography sx={{ fontSize: 13, color: "#D1D1D1" }}>
  {file
    ? "Revisa el error del archivo o valida la respuesta del backend."
    : "Al seleccionar un archivo, los datos se previsualizan aquí."}
</Typography>
                      <Typography sx={{ fontSize: 13, color: "#D1D1D1" }}>
                        Al seleccionar un archivo, los datos se previsualizan aquí.
                      </Typography>
                    </Box>
                  ) : null,
              }}
            />
          </Box>
        </>
      )}

      
    </Box>
  );
};