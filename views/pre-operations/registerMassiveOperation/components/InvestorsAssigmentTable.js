import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

const extractRowsFromBulkResponse = (response) => {
  const candidates = [
    response?.data?.data,
    response?.data?.rows,
    response?.data,
    response?.rows,
    response,
  ];

  const raw = candidates.find((item) => Array.isArray(item)) || [];
  return raw.flat(Infinity).filter(Boolean);
};

const buildExistingAssignmentsMap = (assignments = []) => {
  const map = new Map();
  assignments.forEach((item) => {
    map.set(String(item?.id), item);
  });
  return map;
};

const dedupeById = (rows = []) => {
  const map = new Map();

  rows.forEach((row, index) => {
    const id = String(
      row?.id ??
        row?.billFractionId ??
        row?.fractionId ??
        row?.billId ??
        `row-${index}`
    );

    if (!map.has(id)) {
      map.set(id, {
        ...row,
        id,
      });
    }
  });

  return Array.from(map.values());
};

export const InvestorsAssignmentTable = ({
  billsToNegotiate = [],
  investorAssignments = [],
  investors = [],
  getBillFractionFetch,
  getBillFractionBulkFetch,
  cargarCuentas,
  cargarBrokerFromInvestor,
  cargarTasaDescuento,
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
  onExcelReadyChange,
  exposeGenerateExcel,
}) => {
  const [loadingRows, setLoadingRows] = useState(false);
  const [search, setSearch] = useState("");
  const [validInvestors, setValidInvestors] = useState([]);
  const [loadingValidInvestors, setLoadingValidInvestors] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
const [selectionModel, setSelectionModel] = useState([]);

  const [bulkInvestor, setBulkInvestor] = useState(null);
  const [bulkAccounts, setBulkAccounts] = useState([]);
  const [bulkAccount, setBulkAccount] = useState(null);
  const [bulkLoadingAccounts, setBulkLoadingAccounts] = useState(false);

    const latestAssignmentsRef = useRef(investorAssignments);

  useEffect(() => {
    latestAssignmentsRef.current = investorAssignments;
  }, [investorAssignments]);

  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  }, [search, investorAssignments.length]);
  

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

 const selectedRowIds = useMemo(() => {
  return Array.isArray(selectionModel)
    ? selectionModel.map(String)
    : [];
}, [selectionModel]);

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
        billId: bill?.billId ?? bill?.number ?? "",
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

        const extractedRows = extractRowsFromBulkResponse(response);
        const rowsFromApi = dedupeById(extractedRows);

        if (cancelled) return;

        const existingAssignmentsMap =
          buildExistingAssignmentsMap(investorAssignments);

        const merged = rowsFromApi.map((row, index) => {
          const rowId = String(
            row?.id ??
              row?.billFractionId ??
              row?.fractionId ??
              row?.billId ??
              `row-${index}`
          );

          const existing = existingAssignmentsMap.get(rowId);

          return existing
            ? {
                ...row,
                ...existing,
                id: rowId,
                investorId: existing.investorId ?? "",
                investorLabel: existing.investorLabel ?? "",
                selectedInvestor: existing.selectedInvestor ?? null,
                investorBrokerId: existing.investorBrokerId ?? "",
                investorBrokerName: existing.investorBrokerName ?? "",
                accountId: existing.accountId ?? "",
                selectedAccount: existing.selectedAccount ?? null,
                availableAccounts: existing.availableAccounts ?? [],
                accountAvailableBalance:
                  existing.accountAvailableBalance ?? 0,
                accountTotalBalance: existing.accountTotalBalance ?? 0,
              }
            : {
                ...row,
                id: rowId,
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
              };
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

    const tasaDescuento = await cargarTasaDescuento?.(investorId);

    if (!tasaDescuento) {
      Toast(
        "Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agréguelo en el módulo de clientes.",
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
    const availableBalance = totalBalance;

    updateRow(row.id, {
      accountId: newAccount?.id ?? "",
      selectedAccount: newAccount,
      accountAvailableBalance: availableBalance,
      accountTotalBalance: totalBalance,
    });
  };

  const handleBulkInvestorChange = async (newInvestor) => {
    setBulkInvestor(newInvestor);
    setBulkAccount(null);
    setBulkAccounts([]);

    if (!newInvestor) return;

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
      setBulkInvestor(null);
      return;
    }

    const tasaDescuento = await cargarTasaDescuento?.(investorId);

    if (!tasaDescuento) {
      Toast(
        "Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agréguelo en el módulo de clientes.",
        "warning"
      );
      setBulkInvestor(null);
      return;
    }

    setBulkLoadingAccounts(true);
    try {
      const cuentasResponse = await cargarCuentas?.(investorId);
      setBulkAccounts(cuentasResponse?.data || []);
    } catch (error) {
      setBulkAccounts([]);
    } finally {
      setBulkLoadingAccounts(false);
    }
  };

  const handleApplyToSelected = async () => {
    if (!bulkInvestor) {
      Toast("Debe seleccionar un inversionista.", "warning");
      return;
    }

    if (selectedRowIds.length === 0) {
      Toast("Debe seleccionar al menos una factura.", "warning");
      return;
    }

    const investorId =
      bulkInvestor?.value ?? bulkInvestor?.data?.id ?? bulkInvestor?.id ?? "";

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
      return;
    }

    const tasaDescuento = await cargarTasaDescuento?.(investorId);
    if (!tasaDescuento) {
      Toast(
        "Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agréguelo en el módulo de clientes.",
        "warning"
      );
      return;
    }

    const investorLabel =
      bulkInvestor?.label ??
      (bulkInvestor?.data?.first_name && bulkInvestor?.data?.last_name
        ? `${bulkInvestor.data.first_name} ${bulkInvestor.data.last_name}`
        : bulkInvestor?.data?.social_reason || "");

    let investorBrokerId = "";
    let investorBrokerName = "";

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

    const updated = (investorAssignments || []).map((row) => {
      const rowId = String(row.id);
      if (!selectedRowIds.includes(rowId)) return row;

      return {
        ...row,
        investorId,
        investorLabel,
        selectedInvestor: bulkInvestor,
        investorBrokerId,
        investorBrokerName,
        accountId: bulkAccount?.id ?? "",
        selectedAccount: bulkAccount ?? null,
        availableAccounts: bulkAccounts,
        accountAvailableBalance: Number(bulkAccount?.balance ?? 0),
        accountTotalBalance: Number(bulkAccount?.balance ?? 0),
      };
    });

    setFieldValue("investorAssignments", updated);
    setInvestorsExcelGenerated?.(false);

    Toast(
      `Se aplicó el inversionista a ${selectedRowIds.length} factura(s).`,
      "success"
    );
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

  useEffect(() => {
    if (typeof onExcelReadyChange === "function") {
      onExcelReadyChange(
        allAssignmentsComplete &&
          Array.isArray(investorAssignments) &&
          investorAssignments.length > 0
      );
    }
  }, [allAssignmentsComplete, investorAssignments, onExcelReadyChange]);

  const generateExcel = useCallback(async () => {
    if (!Array.isArray(investorAssignments) || investorAssignments.length === 0) {
      Toast("No hay registros para generar el Excel.", "warning");
      return;
    }

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
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.protection = { locked: true };
    });

    investorAssignments.forEach((row, index) => {
      const excelRow = 7 + index;

      const emitterName =
        formik?.emitter?.label ||
        formik?.emitter?.data?.social_reason ||
        emitter?.label ||
        emitter?.data?.social_reason ||
        "";

      const emitterId =
        formik?.emitter?.value ||
        formik?.emitter?.data?.id ||
        emitter?.value ||
        emitter?.data?.id ||
        "";

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
          cell.numFmt = '"$"#,##0.00';
        }

        cell.protection = {
          locked: colIndex < 16,
        };
      });

      sheet.getCell(`Q${excelRow}`).numFmt = "dd/mm/yyyy";
      sheet.getCell(`R${excelRow}`).numFmt = "dd/mm/yyyy";
      sheet.getCell(`S${excelRow}`).numFmt = '"$"#,##0.00';
      sheet.getCell(`T${excelRow}`).numFmt = "0.00";
      sheet.getCell(`U${excelRow}`).numFmt = "0.00";
      sheet.getCell(`V${excelRow}`).numFmt = "0.00";

      ["Q", "R", "S", "T", "U", "V"].forEach((col) => {
        const cell = sheet.getCell(`${col}${excelRow}`);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8E1" },
        };
      });

      sheet.getCell(`Q${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(Q${excelRow}="",AND(ISNUMBER(Q${excelRow}),ISNUMBER(B${excelRow}),INT(Q${excelRow})>=INT(B${excelRow})))`,
        ],
        showInputMessage: true,
        promptTitle: "Fecha probable",
        prompt:
          "Ingrese una fecha válida en formato dd/mm/yyyy, mayor o igual a la fecha de operación.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Fecha inválida",
        error:
          "La fecha probable debe ser una fecha válida y no puede ser menor a la fecha de operación.",
      };

      sheet.getCell(`R${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(R${excelRow}="",AND(ISNUMBER(R${excelRow}),ISNUMBER(Q${excelRow}),R${excelRow}>=Q${excelRow}))`,
        ],
        showInputMessage: true,
        promptTitle: "Fecha fin",
        prompt:
          "Ingrese una fecha válida en formato dd/mm/yyyy, mayor o igual a la fecha probable.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Fecha inválida",
        error:
          "La fecha fin debe ser una fecha válida y no puede ser menor a la fecha probable.",
      };

      sheet.getCell(`S${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(S${excelRow}="",AND(ISNUMBER(S${excelRow}),S${excelRow}>=0))`,
        ],
        showInputMessage: true,
        promptTitle: "Valor futuro",
        prompt: "Ingrese un número mayor o igual a 0.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Valor inválido",
        error: "El valor futuro debe ser un número positivo o cero.",
      };

      sheet.getCell(`T${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(T${excelRow}="",AND(ISNUMBER(T${excelRow}),T${excelRow}>=0))`,
        ],
        showInputMessage: true,
        promptTitle: "% Descuento",
        prompt: "Ingrese un número mayor o igual a 0.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Valor inválido",
        error: "El porcentaje de descuento debe ser positivo o cero.",
      };

      sheet.getCell(`U${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(U${excelRow}="",AND(ISNUMBER(U${excelRow}),U${excelRow}>=0))`,
        ],
        showInputMessage: true,
        promptTitle: "Tasa descuento",
        prompt: "Ingrese un número mayor o igual a 0.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Valor inválido",
        error: "La tasa de descuento debe ser positiva o cero.",
      };

      sheet.getCell(`V${excelRow}`).dataValidation = {
        type: "custom",
        allowBlank: true,
        formulae: [
          `=OR(V${excelRow}="",AND(ISNUMBER(V${excelRow}),V${excelRow}>=0,ISNUMBER(U${excelRow}),V${excelRow}<=U${excelRow}))`,
        ],
        showInputMessage: true,
        promptTitle: "Tasa inversionista",
        prompt:
          "Ingrese un número mayor o igual a 0 y menor o igual a la tasa de descuento.",
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Tasa inválida",
        error:
          "La tasa inversionista debe ser positiva o cero y no puede ser mayor a la tasa de descuento.",
      };
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
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 16 },
      { width: 18 },
      { width: 20 },
    ];

    sheet.autoFilter = {
      from: { row: 6, column: 1 },
      to: { row: 6, column: allHeaders.length },
    };

    sheet.views = [
      {
        state: "frozen",
        ySplit: 6,
      },
    ];

    await sheet.protect("smart-evolution", {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      deleteColumns: false,
      deleteRows: false,
      sort: true,
      autoFilter: true,
      pivotTables: false,
    });

    const fileName = `${
      formik?.opId || opId || "Operacion"
    }-CargaMasiva${formatDateForFile(new Date())}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );

    setInvestorsExcelGenerated?.(true);
  }, [
    investorAssignments,
    formik,
    opId,
    opDate,
    emitter,
    payerName,
    payerId,
    user,
    setInvestorsExcelGenerated,
  ]);

  useEffect(() => {
    if (typeof exposeGenerateExcel === "function") {
      exposeGenerateExcel(generateExcel);
    }
  }, [exposeGenerateExcel, generateExcel]);

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
      width: 180,
      minWidth: 180,
      sortable: false,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Typography
          sx={{
            width: "100%",
            fontSize: 13,
            color: "#4D4D4D",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
        >
          {formatCurrency(params.row.currentBalance)}
        </Typography>
      ),
    },
    {
      field: "fraction",
      headerName: "Fracción",
      flex: 1,
      minWidth: 65,
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
      width: 290,
      minWidth: 290,
      maxWidth: 290,
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
      width: 220,
      minWidth: 220,
      maxWidth: 220,
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
          disabled={
            !params.row.investorId ||
            !(params.row.availableAccounts || []).length
          }
        />
      ),
    },
    {
      field: "accountAvailableBalance",
      headerName: "Saldo",
      width: 230,
      minWidth: 230,
      maxWidth: 230,
      sortable: false,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const value = Number(params.row.accountAvailableBalance || 0);
        const isNegative = value < 0;

        return (
          <Typography
            sx={{
              width: "100%",
              fontSize: 13,
              color: isNegative ? "#D32F2F" : "#4D4D4D",
              fontWeight: isNegative ? 700 : 400,
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            {formatCurrency(value)}
          </Typography>
        );
      },
    },
  ];

  return (
    <Grid
      container
      spacing={0}
      sx={{
        mt: 0.5,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Grid item xs={12} sx={{ minHeight: 0, display: "flex" }}>
        <Box
          sx={{
            bgcolor: "#F5F5F5",
            borderRadius: 2,
            border: "1px solid #D9D9D9",
            px: 1.5,
            py: 1.25,
            width: "100%",
            height: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            boxSizing: "border-box",
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

          <Box
            sx={{
              mb: 1.25,
              px: 1.25,
              py: 1,
              borderRadius: 1,
              backgroundColor: "#fff",
              border: "1px solid #F1F1F1",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  flexShrink: 0,
                  width: 170,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#2E9B9B",
                  whiteSpace: "nowrap",
                }}
              >
                Aplicación masiva
              </Typography>

              <Box sx={{ flex: 1, minWidth: 0 }} />

              <Box sx={{ width: 290, flexShrink: 0 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={validInvestors || []}
                  loading={loadingValidInvestors}
                  value={bulkInvestor}
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
                  onChange={(_, newValue) => handleBulkInvestorChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
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
              </Box>

              <Box sx={{ width: 220, flexShrink: 0 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={bulkAccounts}
                  loading={bulkLoadingAccounts}
                  value={bulkAccount}
                  getOptionLabel={(option) =>
                    option?.account_number ?? option?.number ?? option?.id ?? ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  onChange={(_, newValue) => setBulkAccount(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
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
                  disabled={!bulkInvestor}
                />
              </Box>

              <Box
                sx={{
                  width: 160,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleApplyToSelected}
                  sx={{
                    width: "100%",
                    height: 32,
                    minWidth: 0,
                    borderRadius: "4px",
                    borderColor: "#67C3C3",
                    color: "#2E9B9B",
                    backgroundColor: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 12,
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#2E9B9B",
                      backgroundColor: "#F7FFFF",
                      boxShadow: "none",
                    },
                  }}
                >
                  Aplicar
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
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
  getRowId={(row) => String(row.id)}
  checkboxSelection
  keepNonExistentRowsSelected
  selectionModel={selectionModel}
  onSelectionModelChange={(newSelection) => {
    setSelectionModel(newSelection);
  }}
  disableSelectionOnClick
                rowHeight={40}
                columnHeaderHeight={34}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                localeText={{
                  footerRowsPerPage: "Filas por página:",
                  footerTotalRows: "Total de filas:",
                  MuiTablePagination: {
                    labelRowsPerPage: "Filas por página:",
                    labelDisplayedRows: ({ from, to, count }) =>
                      `${from}-${to} de ${
                        count !== -1 ? count : `más de ${to}`
                      }`,
                  },
                }}
                sx={{
                  border: 0,
                  height: "100%",
                  backgroundColor: "transparent",
                  "& .MuiDataGrid-main": {
                    border: 0,
                    minWidth: 0,
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
                    fontSize: 12,
                    color: "#333",
                    whiteSpace: "nowrap",
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
                    overflow: "visible",
                  },
                  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                    {
                      outline: "none",
                    },
                }}
              />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};