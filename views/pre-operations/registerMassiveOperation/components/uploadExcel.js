import { useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Switch,
  TextField,
  LinearProgress,
} from "@mui/material";


import Skeleton from "@mui/material/Skeleton";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];

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
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};


const SummaryCard = ({ value, label }) => (
  <Box
    sx={{
      bgcolor: "#fff",
      borderRadius: "18px",
      boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
      border: "1px solid #E8E8E8",
      py: 4,
      px: 3,
      textAlign: "center",
      minHeight: 140,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: 24, md: 28 },
        fontWeight: 800,
        color: "#3FA7AE",
        mb: 1.2,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontSize: 14,
        color: "#7A7A7A",
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
  </Box>
);

const formatPercent = (value) => {
  if (value === null || value === undefined || value === "") return "0.00%";
  return `${Number(value).toFixed(2)}%`;
};

const normalizeUploadResponse = (response) => {
  const data = response?.data ?? response ?? {};

  return {
    success: Boolean(data?.success),
    message: data?.message ?? "",
    operationId: data?.operationId ?? data?.operation_id ?? null,
    totalRows: Number(data?.totalRows ?? data?.total_rows ?? 0),
    processedRows: Number(data?.processedRows ?? data?.processed_rows ?? 0),
    errorCount: Number(data?.errorCount ?? data?.error_count ?? 0),
    canRegister: Boolean(data?.canRegister ?? data?.can_register ?? false),
    rows: Array.isArray(data?.rows) ? data.rows : [],
    summary: data?.summary ?? null,
    normalizedRows: Array.isArray(data?.normalizedRows ?? data?.normalized_rows)
      ? data?.normalizedRows ?? data?.normalized_rows
      : [],
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
      : hasError
      ? ""
      : "";

  const inner = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 32,
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
        px: 0.75,
        bgcolor: hasError ? "#FDECEC" : "transparent",
        color: hasError ? "#D32F2F" : "#222",
        fontWeight: hasError ? 700 : 400,
        borderRadius: 0.5,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
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

const FileErrorModal = ({ open, onClose, title = "Error de Archivo", message }) => {
  return (
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
        {title}
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
            "El proceso de carga masiva solo acepta archivos xlsx o xls. Por favor verifique el documento e intente nuevamente."}
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
};

const UploadCard = ({ file, onPickFile, inputRef, disabled = false }) => {
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".xlsx,.xls"
        onChange={onPickFile}
      />

      <Paper
        elevation={1}
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{
          p: 2,
          height: 90,
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: disabled ? "default" : "pointer",
          borderRadius: 1,
          bgcolor: "#F5F5F5",
          "&:hover": {
            bgcolor: disabled ? "#F5F5F5" : "#F1F1F1",
          },
        }}
      >
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: 1.5,
            bgcolor: file ? "#9DB8D2" : "#D9D9D9",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 46 }} />
        </Box>

        {!file ? (
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#B2B2B2", lineHeight: 1.2 }}>
              Carga el archivo de Excel generado
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#C0C0C0", mt: 0.5 }}>
              Solo se aceptan archivos .xlsx o .xls
            </Typography>
          </Box>
        ) : (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#B8B8B8",
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {file.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#C0C0C0", mt: 0.5 }}>
              Peso {bytesToKb(file.size)}
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  );
};

const ProcessingBanner = ({ status, processedMessage, errorCount }) => {
  if (status === "idle") return null;

  if (status === "processing") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AutorenewIcon sx={{ fontSize: 74, color: "#2F89D9" }} />
        <Box>
          <Typography sx={{ color: "#2F89D9", fontWeight: 700, fontSize: 16 }}>
            Procesando Excel
          </Typography>
          <Typography sx={{ color: "#2F89D9", fontSize: 14 }}>
            Estamos validando los datos del archivo. Por favor espere.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (status === "processed_success") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 74, color: "#7EAF86" }} />
        <Box>
          <Typography sx={{ color: "#7EAF86", fontWeight: 700, fontSize: 16 }}>
            Excel procesado.
          </Typography>
          <Typography sx={{ color: "#7EAF86", fontSize: 14 }}>
            {processedMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (status === "register_error") {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ErrorOutlineIcon sx={{ fontSize: 74, color: "#FF1C14" }} />
      <Box>
        <Typography sx={{ color: "#FF1C14", fontWeight: 700, fontSize: 16 }}>
          Error al registrar la operación.
        </Typography>
        <Typography sx={{ color: "#FF1C14", fontSize: 14 }}>
          {processedMessage || "No fue posible completar el registro."}
        </Typography>
      </Box>
    </Box>
  );
}

  if (status === "registered_success") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 74, color: "#7EAF86" }} />
        <Box>
          <Typography sx={{ color: "#7EAF86", fontWeight: 700, fontSize: 16 }}>
            Operación registrada.
          </Typography>
          <Typography sx={{ color: "#7EAF86", fontSize: 14 }}>
            {processedMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export const UploadExcelStep = ({
  uploadExcelFetch,
  registerOperation,
  onNext,
  createdByLabel = "Usuario Smart Evolution",
  onProcessedRows,
  state,
  downloadReceiptPdfFetch,
  setState,
  setRegisterSummary,
  setUploadExcelState,
  setActiveStep
}) => {
  const inputRef = useRef(null);
const [downloadingPdf, setDownloadingPdf] = useState(false);
const [downloadingExcel, setDownloadingExcel] = useState(false);
const [downloadProgress, setDownloadProgress] = useState(0);
const downloadTimerRef = useRef(null);

const [downloadMessageIndex, setDownloadMessageIndex] = useState(0);
const downloadMessageTimerRef = useRef(null);

const downloadMessages = [
  "Por favor no cierre esta ventana.",
  "Esto puede tardar unos minutos.",
  "Estamos generando su informe.",
];
  const {
    file = null,
    status = "idle",
    rows = [],
    normalizedRows = [],
    canRegister = false,
    operationId = null,
    processedMessage = "",
    errorCount = 0,
    modalError = "",
    registerSummary = null,
  } = state || {};

  const updateState = (patch) => {
    setState((prev) => ({
      ...(prev || {}),
      ...patch,
    }));
  };

  const startDownloadMessages = () => {
  setDownloadMessageIndex(0);

  if (downloadMessageTimerRef.current) {
    clearInterval(downloadMessageTimerRef.current);
  }

  downloadMessageTimerRef.current = setInterval(() => {
    setDownloadMessageIndex((prev) => {
      if (prev >= downloadMessages.length - 1) return 0;
      return prev + 1;
    });
  }, 2200);
};

const stopDownloadMessages = () => {
  if (downloadMessageTimerRef.current) {
    clearInterval(downloadMessageTimerRef.current);
    downloadMessageTimerRef.current = null;
  }
  setDownloadMessageIndex(0);
};

const startFakeProgress = () => {
  setDownloadProgress(0);
  startDownloadMessages();

  if (downloadTimerRef.current) {
    clearInterval(downloadTimerRef.current);
  }

  downloadTimerRef.current = setInterval(() => {
    setDownloadProgress((prev) => {
      if (prev >= 90) return prev;
      return prev + 10;
    });
  }, 180);
};

const finishFakeProgress = () => {
  if (downloadTimerRef.current) {
    clearInterval(downloadTimerRef.current);
    downloadTimerRef.current = null;
  }

  setDownloadProgress(100);

  setTimeout(() => {
    stopDownloadMessages();
    setDownloadingPdf(false);
    setDownloadingExcel(false);
    setDownloadProgress(0);
  }, 400);
};

const resetFakeProgress = () => {
  if (downloadTimerRef.current) {
    clearInterval(downloadTimerRef.current);
    downloadTimerRef.current = null;
  }

  stopDownloadMessages();
  setDownloadingPdf(false);
  setDownloadingExcel(false);
  setDownloadProgress(0);
};

useEffect(() => {
  return () => {
    if (downloadTimerRef.current) {
      clearInterval(downloadTimerRef.current);
    }
    if (downloadMessageTimerRef.current) {
      clearInterval(downloadMessageTimerRef.current);
    }
  };
}, []);


  const validRows = useMemo(() => {
    return (rows || []).filter((row) => !row.hasErrors);
  }, [rows]);


  const diasPromedioCalculado = useMemo(() => {
  if (!validRows.length) return 0;

  const totalDias = validRows.reduce((acc, row) => {
    return acc + Number(row.opDays || 0);
  }, 0);

  return totalDias / validRows.length;
}, [validRows]);

const tasaInversionistaPromedioCalculada = useMemo(() => {
  if (!validRows.length) return 0;

  const totalTasaInv = validRows.reduce((acc, row) => {
    return acc + Number(row.tasaInv || 0);
  }, 0);

  return totalTasaInv / validRows.length;
}, [validRows]);


  const totalOperacionCalculada = useMemo(() => {
    return validRows.reduce((acc, row) => {
      return acc + Number(row.valorNominal || 0);
    }, 0);
  }, [validRows]);

  const tasaPromedioPonderadaCalculada = useMemo(() => {
    const totalPeso = validRows.reduce((acc, row) => {
      return acc + Number(row.valorNominal || 0);
    }, 0);

    if (!totalPeso) return 0;

    const ponderado = validRows.reduce((acc, row) => {
      return acc + Number(row.valorNominal || 0) * Number(row.tasaInv || 0);
    }, 0);

    return ponderado / totalPeso;
  }, [validRows]);

  const setInitialIdleState = (nextFile = null) => {
    updateState({
      file: nextFile,
      status: "idle",
      rows: [],
      normalizedRows: [],
      canRegister: false,
      operationId: null,
      processedMessage: "",
      errorCount: 0,
      modalError: "",
      registerSummary: null,
    });
  };

  const syncRowsAndNormalized = (rowId, updater) => {
    const updatedRows = rows.map((row) =>
      String(row.id) === String(rowId) ? updater(row) : row
    );

    const updatedNormalizedRows = normalizedRows.map((row) => {
      const normalizedId = row.rowNumber ?? row.id;
      if (String(normalizedId) !== String(rowId)) return row;
      return updater(row);
    });

    updateState({
      rows: updatedRows,
      normalizedRows: updatedNormalizedRows,
    });

    if (typeof onProcessedRows === "function") {
      onProcessedRows(updatedNormalizedRows);
    }
  };

  const handleToggleGm = (rowId, checked) => {
  const updatedRows = rows.map((row) => {
    if (String(row.id) !== String(rowId)) return row;

    const presentValueInvestor = Number(
      row.presentValueInvestor ??
      row.valorInversionista ??
      row.valor_inversionista ??
      row.calculated?.presentValueInvestor ??
      0
    );

    const calculatedGm = Number((presentValueInvestor * 0.082).toFixed(2));

    return {
      ...row,
      applyGm: checked,
      gmValue: checked ? calculatedGm : 0,
      gmOriginalValue: calculatedGm,
      calculated: {
        ...(row.calculated || {}),
        GM: checked ? calculatedGm : 0,
        applyGm: checked,
      },
    };
  });

  const updatedNormalizedRows = normalizedRows.map((row) => {
    const normalizedId = row.rowNumber ?? row.id;
    if (String(normalizedId) !== String(rowId)) return row;

    const presentValueInvestor = Number(
      row.presentValueInvestor ??
      row.valorInversionista ??
      row.valor_inversionista ??
      row.calculated?.presentValueInvestor ??
      0
    );

    const calculatedGm = Number((presentValueInvestor * 0.082).toFixed(2));

    return {
      ...row,
      applyGm: checked,
      gmValue: checked ? calculatedGm : 0,
      gmOriginalValue: calculatedGm,
      calculated: {
        ...(row.calculated || {}),
        GM: checked ? calculatedGm : 0,
        applyGm: checked,
      },
    };
  });

  updateState({
    rows: updatedRows,
    normalizedRows: updatedNormalizedRows,
  });

  if (typeof onProcessedRows === "function") {
    onProcessedRows(updatedNormalizedRows);
  }
};


const handleDownloadReceiptPdf = async () => {
  const finalOpId = registerSummary?.operationId ?? operationId;

  if (!finalOpId || !downloadReceiptPdfFetch) return;

  try {
    setDownloadingPdf(true);
    setDownloadingExcel(false);
    startFakeProgress();

    const pdfBlob = await downloadReceiptPdfFetch(finalOpId);

    const blob =
      pdfBlob instanceof Blob
        ? pdfBlob
        : new Blob([pdfBlob], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Comprobante_OP_${finalOpId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    finishFakeProgress();
  } catch (error) {
    console.error("Error descargando comprobante PDF:", error);
    resetFakeProgress();
  }
};

  const handleChangeGmValue = (rowId, rawValue) => {
  const parsed = Number(rawValue);
  const safeValue = Number.isNaN(parsed) ? 0 : parsed;

  const updatedRows = rows.map((row) => {
    if (String(row.id) !== String(rowId)) return row;

    return {
      ...row,
      gmValue: safeValue,
      gmOriginalValue: safeValue,
      applyGm: safeValue > 0 ? true : row.applyGm,
      calculated: {
        ...(row.calculated || {}),
        GM: safeValue,
        applyGm: safeValue > 0 ? true : row.applyGm,
      },
    };
  });

  const updatedNormalizedRows = normalizedRows.map((row) => {
    const normalizedId = row.rowNumber ?? row.id;
    if (String(normalizedId) !== String(rowId)) return row;

    return {
      ...row,
      gmValue: safeValue,
      gmOriginalValue: safeValue,
      applyGm: safeValue > 0 ? true : row.applyGm,
      calculated: {
        ...(row.calculated || {}),
        GM: safeValue,
        applyGm: safeValue > 0 ? true : row.applyGm,
      },
    };
  });

  updateState({
    rows: updatedRows,
    normalizedRows: updatedNormalizedRows,
  });

  if (typeof onProcessedRows === "function") {
    onProcessedRows(updatedNormalizedRows);
  }
};
  const handleProcessSelectedFile = async (selectedFile) => {
    if (!selectedFile || !uploadExcelFetch) return;

    updateState({
      file: selectedFile,
      status: "processing",
      rows: [],
      normalizedRows: [],
      canRegister: false,
      operationId: null,
      processedMessage: "",
      errorCount: 0,
      modalError: "",
      registerSummary: null,
    });

    try {
      const formData = new FormData();
      formData.append("uploadExcel", selectedFile);

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

        const normalizedSource = (normalized.normalizedRows || []).find(
          (n) => String(n.rowNumber ?? n.id) === String(row.id ?? row.rowId ?? row.row_id ?? index + 1)
        );

        const backendApplyGm =
          normalizedSource?.applyGm ??
          row.applyGm ??
          row.calculated?.applyGm ??
          false;

        const backendGm =
          normalizedSource?.gmValue ??
          normalizedSource?.calculated?.GM ??
          row.gmValue ??
          row.calculated?.GM ??
          0;
        console.log("Row:", row);
        return {
          id: row.id ?? row.rowId ?? row.row_id ?? index + 1,
          facturaId: row.facturaId ?? row.factura_id ?? row.billId ?? row.bill_id ?? "",
          inversionista: row.inversionista ?? "",
          porcentajeDescuento:
            row.porcentajeDescuento ??
            row.porcentaje_descuento ??
            normalizedSource?.porcentaje_descuento ??
            "",
          tasaDesc: row.tasaDesc ?? row.tasa_desc ?? "",
          tasaInv: row.tasaInv ?? row.tasa_inv ?? "",
          valorFuturo: row.valorFuturo ?? row.valor_futuro ?? "",
          valorNominal: row.valorNominal ?? row.valor_nominal ?? "",
          valorInversionista: row.valorInversionista ?? row.valor_inversionista ?? "",
          fechaProbable: row.fechaProbable ?? row.fecha_probable ?? "",
          fechaFin: row.fechaFin ?? row.fecha_fin ?? "",
          present_value_sf:row.present_value_sf ?? row.presentValueSf ?? row.valor_presente_sf ?? "",
            investor_profit:row.investor_profit ?? row.investorProfit ?? row.utilidad_inversion ?? "",
            opDays:row.opDays ?? row.operation_days ?? row.op_days ?? "",
            commission_sf: row.commission_sf ?? row.commissionSf ?? row.comision_sf ?? "",
          applyGm: Boolean(backendApplyGm),
          gmValue: Number(backendGm || 0),
          gmOriginalValue: Number(backendGm || 0),
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
        operationId: normalized.operationId,
        errorCount: normalized.errorCount,
        registerSummary: null,
      });

      if (typeof onProcessedRows === "function") {
        onProcessedRows(normalized.normalizedRows || []);
      }

      if (normalized.canRegister) {
        updateState({
          status: "processed_success",
          processedMessage:
            `Se han registrado ${normalized.processedRows || previewRows.length} facturas a la operación ${normalized.operationId ?? ""}`.trim(),
        });
      } else {
        updateState({
          status: "processed_error",
          processedMessage: normalized.message || "",
        });
      }
    } catch (error) {
      updateState({
        status: "idle",
        rows: [],
        normalizedRows: [],
        canRegister: false,
        operationId: null,
        processedMessage: "",
        errorCount: 0,
        modalError:
          error?.response?.data?.message ||
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
          "El proceso de carga masiva solo acepta archivos xlsx o xls. Por favor verifique el documento e intente nuevamente.",
      });
      event.target.value = "";
      return;
    }

    await handleProcessSelectedFile(picked);
    event.target.value = "";
  };

  const handleDeleteRow = (rowId) => {
    const updatedRows = rows.filter((row) => row.id !== rowId);
    const updatedNormalizedRows = normalizedRows.filter(
      (row) => String(row.rowNumber ?? row.id) !== String(rowId)
    );

    const updatedErrorCount = updatedRows.filter((row) => row.hasErrors).length;

    updateState({
      rows: updatedRows,
      normalizedRows: updatedNormalizedRows,
      errorCount: updatedErrorCount,
      registerSummary: null,
    });

    if (typeof onProcessedRows === "function") {
      onProcessedRows(updatedNormalizedRows);
    }

    if (updatedRows.length > 0 && updatedErrorCount === 0) {
      updateState({
        status: "processed_success",
        canRegister: true,
        processedMessage:
          `Se han registrado ${updatedRows.length} facturas a la operación ${operationId ?? ""}`.trim(),
      });
      return;
    }

    if (updatedRows.length > 0 && updatedErrorCount > 0) {
      updateState({
        status: "processed_error",
        canRegister: false,
      });
      return;
    }

    updateState({
      status: "idle",
      canRegister: false,
    });
  };

 const handleRegisterOperation = async () => {
  if (!registerOperation || !normalizedRows?.length || !canRegister) return;

  updateState({
    status: "processing",
    processedMessage: "Registrando operación...",
    modalError: "",
  });

  try {
    const response = await registerOperation(normalizedRows);
    const data = response?.data ?? response ?? {};
    const summary = data?.summary ?? data?.data ?? data ?? {};
    const opIdInfo = data?.opIdInfo ?? summary?.opIdInfo ?? null;

    const finalOperationId =
      opIdInfo?.final ??
      summary?.operationId ??
      data?.operationId ??
      operationId ??
      null;

    const failed =
      data?.error === true ||
      data?.success === false ||
      summary?.error === true ||
      !response;

    if (failed) {
      throw new Error(
        data?.message ||
          summary?.message ||
          "No fue posible registrar la operación."
      );
    }

    updateState({
      status: "registered_success",
      processedMessage:
        data?.message ||
        summary?.message ||
        `¡Operación #${finalOperationId ?? ""} Registrada con Éxito!`,
      operationId: finalOperationId,
      registerSummary: {
        operationId: finalOperationId,
        totalOperacion:
          summary?.totalOperacion ??
          summary?.total_amount ??
          totalOperacionCalculada,
        facturasRegistradas:
          summary?.facturasRegistradas ??
          summary?.registered_rows ??
          validRows.length ??
          0,
        tasaPromedioPonderada:
          summary?.tasaPromedioPonderada ??
          summary?.weightedAverageRate ??
          summary?.weighted_average_rate ??
          tasaPromedioPonderadaCalculada,
        raw: summary,
        opIdInfo,
      },
    });

    if (typeof onNext === "function") {
      onNext();
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Ocurrió un error al registrar la operación. Intente nuevamente.";

    updateState({
      status: "register_error",
      processedMessage: errorMessage,
      modalError: errorMessage,
      registerSummary: null,
    });
  }
};
const handleDownloadValidExcel = async () => {
  const cleanRows = (rows || []).filter((row) => !row.hasErrors);

  if (!cleanRows.length) return;

  try {
    setDownloadingExcel(true);
    setDownloadingPdf(false);
    startFakeProgress();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Facturas válidas");

    const headers = [
      "FACTURA ID",
      "INVERSIONISTA",
      "% DESCUENTO",
      "TASA DESC.",
      "TASA INV.",
      "VALOR FUTURO",
      "VALOR NOMINAL",
      "VALOR INVERSIONISTA",
      "GM",
      "FECHA PROBABLE",
      "FECHA FIN",
    ];

    headers.forEach((header, index) => {
      const cell = sheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F78D1" },
      };
    });

    cleanRows.forEach((row, index) => {
      const excelRow = index + 2;

      sheet.getCell(excelRow, 1).value = row.facturaId || "";
      sheet.getCell(excelRow, 2).value = row.inversionista || "";
      sheet.getCell(excelRow, 3).value =
        row.porcentajeDescuento === "" ? "" : Number(row.porcentajeDescuento || 0);
      sheet.getCell(excelRow, 4).value = Number(row.tasaDesc || 0);
      sheet.getCell(excelRow, 5).value = Number(row.tasaInv || 0);
      sheet.getCell(excelRow, 6).value = Number(row.valorFuturo || 0);
      sheet.getCell(excelRow, 7).value = Number(row.valorNominal || 0);
      sheet.getCell(excelRow, 8).value = Number(row.valorInversionista || 0);
      sheet.getCell(excelRow, 9).value = Number(row.gmValue || 0);
      sheet.getCell(excelRow, 10).value = row.fechaProbable || "";
      sheet.getCell(excelRow, 11).value = row.fechaFin || "";
    });

    sheet.columns = [
      { width: 24 },
      { width: 32 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 18 },
      { width: 18 },
      { width: 20 },
      { width: 14 },
      { width: 18 },
      { width: 18 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Operacion-${operationId || "resultado"}-facturas-validas.xlsx`
    );

    finishFakeProgress();
  } catch (error) {
    console.error("Error descargando Excel sin errores:", error);
    resetFakeProgress();
  }
};


  const formatDateDDMMYYYY = (value) => {
  if (!value) return "";

  const raw = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split("-");
    return `${day}-${month}-${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

  const columns = useMemo(
  () => [
    {
      field: "facturaId",
      headerName: "Factura ID",
      minWidth: 120,
      flex: 0.9,
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["factura_id", "bill_id", "facturaId"])}
        />
      ),
    },
    {
      field: "inversionista",
      headerName: "Inversionista",
      minWidth: 170,
      flex: 1.2,
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["inversionista", "investor_name", "investor_id"])}
        />
      ),
    },
    {
      field: "porcentajeDescuento",
      headerName: "% Desc.",
      minWidth: 78,
      flex: 0.55,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;

        const numericValue =
          value === "" || value === null || value === undefined
            ? ""
            : Number(value);

        return (
          <ErrorCell
            value={numericValue === "" ? "" : `${numericValue}%`}
            error={getFieldErrorMessage(params.row, [
              "porcentaje_descuento",
              "porcentajeDescuento",
            ])}
            align="center"
          />
        );
      },
    },
    {
      field: "tasaDesc",
      headerName: "Tasa Desc.",
      minWidth: 78,
      flex: 0.55,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["tasa_descuento", "tasaDesc"])}
          align="center"
        />
      ),
    },
    {
      field: "tasaInv",
      headerName: "Tasa Inv.",
      minWidth: 78,
      flex: 0.55,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["tasa_inversionista", "tasaInv"])}
          align="center"
        />
      ),
    },
    {
      field: "valorFuturo",
      headerName: "Valor Futuro",
      minWidth: 115,
      flex: 0.9,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["valor_futuro", "valorFuturo"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "valorNominal",
      headerName: "Valor Nominal",
      minWidth: 115,
      flex: 0.9,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value}
          error={getFieldErrorMessage(params.row, ["valor_nominal", "valorNominal"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "valorInversionista",
      headerName: "Valor Presente Inv.",
      minWidth: 125,
      flex: 0.95,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={Math.round(params.value, 0)}
          error={getFieldErrorMessage(params.row, ["valor_inversionista", "valorInversionista"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "opDays",
      headerName: "Días",
      minWidth: 72,
      flex: 0.45,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value ?? 0}
          error={getFieldErrorMessage(params.row, ["op_days", "opDays", "operation_days"])}
          align="right"
        />
      ),
    },
    {
      field: "investor_profit",
      headerName: "Utilidad",
      minWidth: 105,
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value ?? 0}
          error={getFieldErrorMessage(params.row, ["investor_profit", "investorProfit"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "present_value_sf",
      headerName: "V. Presente Mesa",
      minWidth: 120,
      flex: 0.9,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value ?? 0}
          error={getFieldErrorMessage(params.row, ["present_value_sf", "presentValueSF"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "commission_sf",
      headerName: "Comisión Mesa",
      minWidth: 110,
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <ErrorCell
          value={params.value ?? 0}
          error={getFieldErrorMessage(params.row, ["commission_sf", "commissionSF"])}
          align="right"
          formatter={formatCurrency}
        />
      ),
    },
    {
      field: "gm",
      headerName: "GM",
      minWidth: 135,
      flex: 0.9,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const applyGm = Boolean(params.row.applyGm);
        const hasGmError = getFieldErrorMessage(params.row, ["GM", "gmValue", "applyGm"]);

        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.25,
              bgcolor: hasGmError ? "#FDECEC" : "transparent",
              borderRadius: 0.5,
              px: 0.25,
            }}
          >
            <Switch
              size="small"
              checked={applyGm}
              onChange={(e) => handleToggleGm(params.row.id, e.target.checked)}
              sx={{
                mr: 0.25,
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#2E9B9B",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#2E9B9B",
                },
              }}
            />

            <TextField
              size="small"
              value={formatCurrency(params.row.gmValue ?? 0)}
              InputProps={{ readOnly: true }}
              variant="standard"
              sx={{
                width: 72,
                "& .MuiInputBase-root": {
                  height: 28,
                  backgroundColor: "transparent",
                  fontSize: 10,
                },
                "& .MuiInputBase-input": {
                  textAlign: "right",
                  padding: "4px 6px",
                  color: applyGm ? "#222" : "#9E9E9E",
                },
                "& .MuiInput-underline:before": {
                  display: "none",
                },
                "& .MuiInput-underline:after": {
                  display: "none",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  display: "none",
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "fechaProbable",
      headerName: "F. Probable",
      minWidth: 92,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ErrorCell
          value={formatDateDDMMYYYY(params.value)}
          error={getFieldErrorMessage(params.row, ["fecha_probable", "fechaProbable"])}
          align="center"
        />
      ),
    },
    {
      field: "fechaFin",
      headerName: "F. Fin",
      minWidth: 85,
      flex: 0.65,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ErrorCell
          value={formatDateDDMMYYYY(params.value)}
          error={getFieldErrorMessage(params.row, ["fecha_fin", "fechaFin"])}
          align="center"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: "#E74B4B", p: 0.25 }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ],
  [rows, normalizedRows, operationId]
);

  const showEmptyPreview = status === "idle" && rows.length === 0;
  const showRegisterButton =
    (status === "processed_success" || status === "processed_error") && canRegister;

  const finalTotalOperacion =
    registerSummary?.totalOperacion ?? totalOperacionCalculada;

  const finalFacturasRegistradas =
    registerSummary?.facturasRegistradas ?? validRows.length;

  const finalTasaPromedio =
    registerSummary?.tasaPromedioPonderada ?? tasaPromedioPonderadaCalculada;

    const finalDiasPromedio =
  registerSummary?.diasPromedio ??
  registerSummary?.averageDays ??
  registerSummary?.avgDays ??
  diasPromedioCalculado;

const finalTasaInversionistaPromedio =
  registerSummary?.tasaInversionistaPromedio ??
  registerSummary?.averageInvestorRate ??
  registerSummary?.avgInvestorRate ??
  tasaInversionistaPromedioCalculada;

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

      <Dialog
  open={downloadingPdf || downloadingExcel}
  maxWidth="sm"
  fullWidth
>
  <DialogContent sx={{ py: 4, px: 3 }}>
    <Typography
      sx={{
        textAlign: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "#69AEB0",
        mb: 2,
      }}
    >
      {downloadingPdf ? "Generando PDF" : "Generando Excel"}
    </Typography>

    <LinearProgress
      variant="determinate"
      value={downloadProgress}
      sx={{
        height: 22,
        borderRadius: 1,
        bgcolor: "#EAEAEA",
        "& .MuiLinearProgress-bar": {
          bgcolor: "#69AEB0",
        },
      }}
    />

    <Typography
  key={downloadMessageIndex}
  sx={{
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    mt: 1.5,
    minHeight: 24,
    animation: "fadeMsg 0.35s ease",
    "@keyframes fadeMsg": {
      from: { opacity: 0.3, transform: "translateY(4px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }}
>
  {downloadMessages[downloadMessageIndex]}
</Typography>
  </DialogContent>
</Dialog>

      {status !== "registered_success" && (
        <>
          <Grid
  container
  spacing={2}
  alignItems="center"
  sx={{ flexShrink: 0 }}
>
  <Grid item xs={12} md={4.5}>
              <UploadCard
                file={file}
                onPickFile={handlePickFile}
                inputRef={inputRef}
                disabled={status === "processing"}
              />
            </Grid>

            <Grid item xs={12} md={7.5}>
              <Box
              sx={{
  minHeight: 90,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  overflow: "hidden",
}}
              >
                <ProcessingBanner
                  status={status}
                  processedMessage={processedMessage}
                  errorCount={errorCount}
                />

                {showRegisterButton ? (
                  <Button
                    variant="contained"
                    onClick={handleRegisterOperation}
                    sx={{
                      minWidth: 180,
                      height: 38,
                      bgcolor: "#fff",
                      color: "#2E9B9B",
                      border: "1px solid #2E9B9B",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#F6FFFF",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Registrar 
                  </Button>
                ) : null}
              </Box>
            </Grid>
          </Grid>

          <Box
  sx={{
    mt: 1.5,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  }}
>
            <DataGrid
              autoHeight={false}
              rows={rows}
              columns={columns}
              getRowClassName={buildRowClassName}
              disableRowSelectionOnClick
              hideFooter={rows.length <= 10}
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
              loading={status === "processing"}
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
    backgroundColor: "#EAEAEA",
    borderBottom: "none",
    minHeight: "30px !important",
    maxHeight: "30px !important",
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
    borderBottom: "none",
    color: "#222",
    display: "flex",
    alignItems: "center",
    px: 0.5,
    overflow: "hidden",
  },
  "& .MuiDataGrid-row": {
    minHeight: "34px !important",
    maxHeight: "34px !important",
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
                        Aún no has cargado un archivo
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#D1D1D1" }}>
                        Al seleccionar un archivo, los datos se han previsualizado aquí.
                      </Typography>
                    </Box>
                  ) : null,
                loadingOverlay: () => (
                  <Box sx={{ p: 2, width: "100%" }}>
                    {Array.from({ length: 14 }).map((_, rowIndex) => (
                      <Box
                        key={rowIndex}
                        sx={{
                          display: "grid",
                         gridTemplateColumns:
  "1fr 1.4fr 0.6fr 0.6fr 0.8fr 0.8fr 0.9fr 0.7fr 0.8fr 0.8fr",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {Array.from({ length: 10 }).map((__, colIndex) => (
                          <Skeleton key={colIndex} variant="rounded" height={16} />
                        ))}
                      </Box>
                    ))}
                  </Box>
                ),
              }}
            />
          </Box>
        </>
      )}

      {status === "registered_success" && (
        <Box
          sx={{
            width: "100%",
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            pt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "8px solid #8BB38F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8BB38F",
                fontSize: 58,
                fontWeight: 800,
              }}
            >
              ✓
            </Box>

            <Typography
              sx={{
                color: "#7EAF86",
                fontWeight: 700,
                fontSize: 32,
              }}
            >
              ¡Operación #{registerSummary?.operationId ?? operationId} Registrada con Éxito!
            </Typography>
          </Box>

          <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      lg: "repeat(5, 1fr)",
    },
    gap: 3,
    width: "100%",
    maxWidth: 1280,
    alignItems: "stretch",
  }}
>
  <SummaryCard
    value={Number(finalTotalOperacion || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
    label="Total de la Operación"
  />

  <SummaryCard
    value={finalFacturasRegistradas ?? 0}
    label="Facturas Registradas"
  />

  <SummaryCard
    value={formatPercent(finalTasaPromedio)}
    label="Tasa Promedio"
  />

  <SummaryCard
    value={Number(finalDiasPromedio || 0).toFixed(
      Number(finalDiasPromedio || 0) % 1 === 0 ? 0 : 1
    )}
    label="Días Promedio"
  />

  <SummaryCard
    value={Number(finalTasaInversionistaPromedio || 0).toFixed(0)}
    label="Tasa Inversionista promedio"
  />
</Box>
        <Box
  sx={{
    display: "flex",
    gap: 2,
    justifyContent: "flex-end", // ✅ derecha real
    alignItems: "center",
    width: "100%",
    mt: 2,
  }}
>
  {/* Botón secundario */}
  <Button
    variant="outlined"
    onClick={() => window.location.reload()}
    sx={{
      minWidth: 240,
      height: 42,
      borderRadius: "8px",
      color: "#6FAFB2",
      borderColor: "#6FAFB2",
      textTransform: "none",
      fontWeight: 600,
      "&:hover": {
        borderColor: "#2E9B9B",
        color: "#2E9B9B",
        backgroundColor: "#F4FBFB",
      },
    }}
  >
    Registrar otra operación
  </Button>

  {/* Botón principal */}
  <Button
    variant="contained"
    onClick={handleDownloadReceiptPdf}
    sx={{
      minWidth: 280,
      height: 42,
      borderRadius: "8px",
      backgroundColor: "#1C9AA0", // ✅ verde fuerte
      textTransform: "none",
      fontWeight: 600,
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#16848A",
        boxShadow: "none",
      },
    }}
  >
    Descargar comprobante PDF
  </Button>
</Box>
        </Box>
      )}
      
    </Box>
  );
};