import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import moment from "moment";
import {
  Box,
  Breadcrumbs,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

import ValueFormat from "@formats/ValueFormat";
import { useFetch } from "@hooks/useFetch";
import CustomTooltip from "@styles/customTooltip";
import { Toast } from "@components/toast";
import { GetReceiptHistory } from "./queries";

const tableHeaderCellSx = {
  backgroundColor: "#F5F5F5",
  color: "#5E5558",
  fontWeight: "bold",
  fontSize: "0.84rem",
  borderBottom: "1px solid #E2E2E2",
};

const tableCellSx = {
  color: "#333333",
  fontSize: "0.84rem",
  borderBottom: "1px solid #E7E7E7",
};

const TableSkeleton = ({ rows = 8 }) => (
  <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={56} sx={{ mb: 0.5 }} />
    ))}
  </Box>
);

const safeText = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const getClientName = (client) => {
  if (!client) return "N/A";
  return (
    client.social_reason ||
    `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
    client.document_number ||
    "N/A"
  );
};

const getControlStatus = (receipt) => String(receipt?.controlStatus || "ACTIVE").toUpperCase();

const hasRelation = (value) => {
  if (!value) return false;
  if (typeof value === "object") return Boolean(value.id);
  return true;
};

const isVoided = (receipt) => getControlStatus(receipt) === "VOIDED" || receipt?.state === 0 && !hasRelation(receipt?.replacedBy);
const isAdjusted = (receipt) => getControlStatus(receipt) === "ADJUSTED" || hasRelation(receipt?.replacedBy);
const isCorrected = (receipt) => hasRelation(receipt?.originalReceipt);

const getStatusLabel = (receipt) => {
  if (receipt?.actionLabel) return receipt.actionLabel;
  if (isVoided(receipt)) return "Anulado";
  if (isAdjusted(receipt)) return "Editado";
  if (isCorrected(receipt)) return "Corregido vigente";
  return "Activo";
};

const getStatusIcon = (receipt) => {
  if (isVoided(receipt)) return <BlockIcon sx={{ fontSize: "1rem" }} />;
  if (isAdjusted(receipt) || isCorrected(receipt)) return <EditIcon sx={{ fontSize: "1rem" }} />;
  return <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />;
};

const getStatusSx = (receipt) => {
  if (isVoided(receipt)) {
    return { color: "#8C4A4A", bgcolor: "#F7EAEA", borderColor: "#D6A4A4" };
  }

  if (isAdjusted(receipt) || isCorrected(receipt)) {
    return { color: "#488B8F", bgcolor: "#E7F3F3", borderColor: "#9CCFD0" };
  }

  return { color: "#5E7778", bgcolor: "#F2F7F7", borderColor: "#D5E7E7" };
};

const getReason = (receipt) => {
  return (
    receipt?.reason ||
    receipt?.adjustmentReason ||
    receipt?.voidReason ||
    receipt?.originalReceipt?.adjustmentReason ||
    receipt?.replacedBy?.adjustmentReason ||
    receipt?.blockReason ||
    "Sin motivo registrado"
  );
};

const normalizeReceipt = (receipt) => {
  const operation = receipt.operation || {};
  const bill = operation.bill || receipt.bill || {};
  const account = receipt.account || operation.clientAccount || {};
  const opId = operation.opId || receipt.opId || "N/A";
  const billId = bill.billId || receipt.billId || "N/A";
  const fraction = receipt.fraction || operation.fraction || operation.billFraction || bill.fraction || 1;
  const key = `${operation.id || receipt.operation_id || opId}-${bill.id || billId}-${fraction}`;

  return {
    ...receipt,
    groupKey: key,
    opId,
    billId,
    fraction,
    operation,
    investorName: getClientName(account.client || operation.investor || operation.clientAccount?.client),
    payerName: getClientName(operation.payer || bill.payer),
    emitterName: getClientName(operation.emitter || bill.emitter),
    hasChange:
      isVoided(receipt) ||
      isAdjusted(receipt) ||
      isCorrected(receipt) ||
      Boolean(receipt.voidReason || receipt.adjustmentReason),
  };
};

const buildGroups = (receipts) => {
  const map = new Map();

  receipts.map(normalizeReceipt).forEach((receipt) => {
    if (!receipt.hasChange) return;

    if (!map.has(receipt.groupKey)) {
      map.set(receipt.groupKey, {
        id: receipt.groupKey,
        opId: receipt.opId,
        billId: receipt.billId,
        fraction: receipt.fraction,
        investorName: receipt.investorName,
        payerName: receipt.payerName,
        emitterName: receipt.emitterName,
        receipts: [],
      });
    }

    map.get(receipt.groupKey).receipts.push(receipt);
  });

  return Array.from(map.values()).map((group) => ({
    ...group,
    receipts: group.receipts.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    }),
  }));
};

function HistoryRow({ group }) {
  const [open, setOpen] = useState(false);
  const lastChange = group.lastChange || group.receipts?.[0];

  return (
    <>
      <TableRow hover>
        <TableCell sx={tableCellSx} width={54}>
          <IconButton size="small" onClick={() => setOpen((value) => !value)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={tableCellSx}>
          <Typography fontWeight={700} color="#488B8F">{group.opId}</Typography>
        </TableCell>
        <TableCell sx={tableCellSx}>{group.billId}</TableCell>
        <TableCell sx={tableCellSx}>{group.fraction}</TableCell>
        <TableCell sx={tableCellSx}>{group.investorName}</TableCell>
        <TableCell sx={tableCellSx}>{(group.changesCount || group.receipts?.length || 0)}</TableCell>
        <TableCell sx={tableCellSx}>{getStatusLabel(lastChange)}</TableCell>
        <TableCell sx={tableCellSx}>
          {lastChange?.changedAt ? moment(lastChange.changedAt).format("DD/MM/YYYY HH:mm") : lastChange?.created_at ? moment(lastChange.created_at).format("DD/MM/YYYY HH:mm") : moment(lastChange?.date).format("DD/MM/YYYY")}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2.5, bgcolor: "#FAFAFA" }}>
              <Typography sx={{ color: "#488B8F", fontWeight: 700, mb: 1.5 }}>
                Movimientos de edición/anulación
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeaderCellSx}>Estado</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Aplicado</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Monto</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Días R.</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Días +</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Intereses +</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Valor presente</TableCell>
                    <TableCell sx={tableHeaderCellSx}>Motivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(group.receipts || []).map((receipt) => {
                    const badgeSx = getStatusSx(receipt);
                    const reason = getReason(receipt);

                    return (
                      <TableRow key={receipt.id} hover>
                        <TableCell sx={tableCellSx}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.7,
                              px: 1.1,
                              py: 0.4,
                              borderRadius: "999px",
                              border: `1px solid ${badgeSx.borderColor}`,
                              bgcolor: badgeSx.bgcolor,
                              color: badgeSx.color,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          >
                            {getStatusIcon(receipt)}
                            {getStatusLabel(receipt)}
                          </Box>
                        </TableCell>
                        <TableCell sx={tableCellSx}>{receipt.date ? moment(receipt.date).format("DD/MM/YYYY") : "N/A"}</TableCell>
                        <TableCell sx={tableCellSx}><ValueFormat prefix="$ " value={receipt.payedAmount || 0} thousandSeparator /></TableCell>
                        <TableCell sx={tableCellSx}>{safeText(receipt.realDays, 0)}</TableCell>
                        <TableCell sx={tableCellSx}>{safeText(receipt.additionalDays, 0)}</TableCell>
                        <TableCell sx={tableCellSx}><ValueFormat prefix="$ " value={receipt.additionalInterests || 0} thousandSeparator /></TableCell>
                        <TableCell sx={tableCellSx}><ValueFormat prefix="$ " value={receipt.presentValueInvestor || 0} thousandSeparator /></TableCell>
                        <TableCell sx={{ ...tableCellSx, maxWidth: 380 }}>
                          <CustomTooltip title={reason} placement="bottom-start">
                            <Typography noWrap fontSize="0.82rem">{reason}</Typography>
                          </CustomTooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const ReceiptHistoryComponent = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading, error, fetch } = useFetch({
    service: (params) => GetReceiptHistory(params),
    init: false,
  });

  useEffect(() => {
    const params = { page };
    if (search.trim()) params.opId_billId = search.trim();
    fetch(params);
  }, [page]);

  useEffect(() => {
    if (error) Toast(error.message || "No fue posible cargar el historial", "error");
  }, [error]);

  const groups = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  }, [data]);

  const handleSearch = () => {
    setPage(1);
    const params = { page: 1 };
    if (search.trim()) params.opId_billId = search.trim();
    fetch(params);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    fetch({ page: 1 });
  };

  return (
    <>
      <Box className="view-header">
        <Typography letterSpacing={0} fontSize="1.7rem" fontWeight="regular" marginBottom="0.7rem" color="#5EA3A3">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ ml: 1, mt: 1 }}>
            <Link href="/dashboard" underline="none">
              <a>
                <HomeIcon fontSize="large" sx={{ color: "#488b8f", opacity: 0.8, strokeWidth: 1 }} />
              </a>
            </Link>
            <Link href="/administration" underline="hover" color="#5EA3A3">
              <Typography component="h1" className="view-title">Administración</Typography>
            </Link>
            <Typography component="h1" className="view-title">Historial de cambios de recaudos</Typography>
          </Breadcrumbs>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Buscar por OpID o factura"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && handleSearch()}
          sx={{ width: { xs: "100%", sm: 520 }, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          InputProps={{
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} size="small">
                  <ClearIcon sx={{ color: "#488b8f", fontSize: "18px" }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{ bgcolor: "#488B8F", textTransform: "none", borderRadius: "8px", px: 3, "&:hover": { bgcolor: "#356f73" } }}
        >
          Buscar historial
        </Button>
      </Box>

      <Typography sx={{ color: "#555", fontSize: "0.92rem", mb: 2 }}>
        Esta vista agrupa por operación, factura y fracción. Al desplegar cada fila se ven las ediciones/anulaciones con su motivo.
      </Typography>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "8px", border: "1px solid #E4E4E4", boxShadow: "none" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 260px)", overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderCellSx} />
                  <TableCell sx={tableHeaderCellSx}>opID</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Factura</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Fracción</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Inversionista</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Cambios</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Último estado</TableCell>
                  <TableCell sx={tableHeaderCellSx}>Último movimiento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 6, textAlign: "center", color: "#488B8F", fontWeight: 700 }}>
                      No hay ediciones o anulaciones registradas en esta página.
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group) => <HistoryRow key={group.id} group={group} />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};
