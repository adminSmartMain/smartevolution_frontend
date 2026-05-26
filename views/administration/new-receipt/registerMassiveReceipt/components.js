import { useEffect, useMemo, useState, useContext, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Tooltip,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import ReceiptStatusSelect from "@components/selects/registerMassiveReceipts/receiptStatusSelect";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Home as HomeIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from "react-toastify";
import esLocale from "date-fns/locale/es";

import { Formik, Form } from "formik";

import authContext from "@context/authContext";
import smartLogo from "../../../../public/assets/Logo Smart - Lite.svg";

import EmitterSelector from "@components/selects/registerMassiveReceipts/EmitterSelector";
import PayerSelector from "@components/selects/registerMassiveReceipts/PayerSelector";

import { BillsDualTable } from "./components/BillsDualTable";
import { ReceiptConsignmentTable } from "./components/ReceiptConsignmentTable";
import { ReceiptUploadExcelStep } from "./components/ReceiptUploadExcelStep";
import { useRouter } from "next/router";
import {
  getTypeBill,
  Bills,
  GetBillFraction,
  GetRiskProfile,
  BrokerByClient,
  AccountsFromClient,
  GetBillFractionBulk,
  uploadExcel,
  registerOperationFromUpload,
  downloadMassiveOperationReceiptPdf,
  GetOperationsByEmitterPayer,
  GetPayersFromOperationRelated,
  MassiveReceiptUploadExcel,

} from "./queries";

import {
  createMassiveOperationDraft,
  updateMassiveOperationDraft,
  getMassiveOperationDraft,
  validateMassiveOperationDraft,
  markMassiveOperationDraftRegistered,
  MassiveReceiptPreview,
MassiveReceiptRegister,
} from "./queries";
import { useFetch } from "@hooks/useFetch";
import { useMassiveOperationDraft } from "@hooks/useMassiveOperationDraft";

const SmartConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderLeftWidth: 2,
    borderColor: "#D9E7E7",
    minHeight: 22,
    marginLeft: 10,
  },
}));

function SmartStepIcon(props) {
  const { active, completed, icon } = props;

  const border = active || completed ? "#9ED7A8" : "#BFC7CC";
  const bg = "#FFFFFF";
  const color = active || completed ? "#5E8D67" : "#9AA3A3";

  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "999px",
        border: `2px solid ${border}`,
        backgroundColor: bg,
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 700,
        color,
      }}
    >
      {icon}
    </Box>
  );
}

const getStepStatus = (index, activeStep) => {
  if (index < activeStep) return "Completado";
  if (index === activeStep) return "En proceso";
  return "Pendiente";
};

export const RegisterMassiveReceiptComponent = ({
  formik,
  initialValues,
  validationSchema,
  handleConfirm,
  emitters,
  investors,
  payers,
  typeOperation,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const { user } = useContext(authContext);
  const [registeredReceiptsCount, setRegisteredReceiptsCount] = useState(0);
  const generateReceiptExcelRef = useRef(null);
  const JURIDICA_ID = "21cf32d9-522c-43ac-b41c-4dfdf832a7b8";
  const isJuridica = formik?.values?.type_client === JURIDICA_ID;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const emisores = emitters || [];
  const [clientEmitter, setClientEmitter] = useState(null);
  const [clientPagador, setClientPagador] = useState(null);
  const [clientBrokerEmitter, setClientBrokerEmitter] = useState(null);
  const [investorsExcelGenerated, setInvestorsExcelGenerated] = useState(false);
  const [openEmitterBrokerModal, setOpenEmitterBrokerModal] = useState(false);
  const [pendingClear, setPendingClear] = useState(false);
  const [showAllPayers, setShowAllPayers] = useState(false);
  const [orchestDisabled, setOrchestDisabled] = useState([
    { indice: 0, status: false },
  ]);
  const [isSelectedPayer, setIsSelectedPayer] = useState(false);
  const [isModalEmitterAd, setIsModalEmitterAd] = useState(false);
  const [brokeDelete, setBrokeDelete] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [emitterSaved, setEmitterSaved] = useState(false);
  const [canGenerateInvestorsExcel, setCanGenerateInvestorsExcel] = useState(false);
  const [generateInvestorsExcelFn, setGenerateInvestorsExcelFn] = useState(null);
  const [registerSummary, setRegisterSummary] = useState(null);
  const [isRestoringDraft, setIsRestoringDraft] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState(null);
  const [receiptPreviewLoading, setReceiptPreviewLoading] = useState(false);
const [receiptExcelGenerated, setReceiptExcelGenerated] = useState(false);
const [generateReceiptExcelFn, setGenerateReceiptExcelFn] = useState(null);
const [registeringMassiveReceipts, setRegisteringMassiveReceipts] = useState(false);
const hydratedDraftRef = useRef(null);
  const router = useRouter();
  const routeDraftId = router?.query?.draftId;
  const [uploadExcelState, setUploadExcelState] = useState({
    file: null,
    status: "idle",
    rows: [],
    normalizedRows: [],
    canRegister: false,
    operationId: null,
    processedMessage: "",
    errorCount: 0,
    modalError: "",
  });

  const {
    fetch: fetchBills,
    data: dataBills,
    loading: billsLoading,
    isLoading: billsIsLoading,
  } = useFetch({
    service: Bills,
    init: false,
  });

  const {
  fetch: fetchOperationsByEmitterPayer,
  data: dataOperationsByEmitterPayer,
  loading: OperationsByEmitterPayerLoading,
  isLoading: OperationsByEmitterPayerIsLoading,
} = useFetch({
  service: GetOperationsByEmitterPayer,
  init: false,
});

const {
  fetch: fetchGetPayersFromOperationRelated,
  data: dataGetPayersFromOperationRelated,
  loading: GetPayersFromOperationRelatedLoading,
  isLoading: GetPayersFromOperationRelatedIsLoading,
} = useFetch({
  service: GetPayersFromOperationRelated,
  init: false,
});

  console.log(dataOperationsByEmitterPayer)

  const { fetch: createDraftFetch } = useFetch({
  service: createMassiveOperationDraft,
  init: false,
});

const { fetch: fetchMassiveReceiptPreview } = useFetch({
  service: MassiveReceiptPreview,
  init: false,
});

const { fetch: fetchMassiveReceiptRegister } = useFetch({
  service: MassiveReceiptRegister,
  init: false,
});

const { fetch: updateDraftFetch } = useFetch({
  service: updateMassiveOperationDraft,
  init: false,
});

const { fetch: getDraftFetch } = useFetch({
  service: getMassiveOperationDraft,
  init: false,
});

const { fetch: validateDraftFetch } = useFetch({
  service: validateMassiveOperationDraft,
  init: false,
});

const { fetch: markDraftRegisteredFetch } = useFetch({
  service: markMassiveOperationDraftRegistered,
  init: false,
});

const { fetch: fetchMassiveReceiptUploadExcel } = useFetch({
  service: MassiveReceiptUploadExcel,
  init: false,
});
const {
  draftId,
  setDraftId,
  draftStatus,
  lastSavedAt,
  saveDraft,
} = useMassiveOperationDraft({
  createDraftFetch,
  updateDraftFetch,
});
  const isLoadingBills = billsLoading ?? billsIsLoading ?? false;
const { fetch: downloadMassiveOperationReceiptPdfFetch } = useFetch({
  service: downloadMassiveOperationReceiptPdf,
  init: false,
});
  const { fetch: fetchBrokerByClient } = useFetch({
    service: BrokerByClient,
    init: false,
  });

  const { fetch: riskProfileFetch } = useFetch({
    service: GetRiskProfile,
    init: false,
  });

  const { fetch: getBillFractionFetch } = useFetch({
    service: GetBillFraction,
    init: false,
  });

  const { fetch: getBillFractionBulkFetch } = useFetch({
    service: GetBillFractionBulk,
    init: false,
  });

  const { fetch: fetchAccountsFromClient } = useFetch({
    service: AccountsFromClient,
    init: false,
  });

  const { fetch: registerOperationFromUploadFetch } = useFetch({
    service: registerOperationFromUpload,
    init: false,
  });

  const { fetch: uploadExcelFetch } = useFetch({
    service: uploadExcel,
    init: false,
  });

  const { fetch: fetchBrokerByClientInvestor } = useFetch({
    service: BrokerByClient,
    init: false,
  });

  useFetch({ service: getTypeBill, init: true });




  

  const cargarTasaDescuento = async (emisor) => {
    if (!emisor) return null;
    try {
      return await riskProfileFetch(emisor);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const cargarBrokerFromInvestor = async (inversionista) => {
    if (!inversionista) return null;
    try {
      return await fetchBrokerByClientInvestor(inversionista);
    } catch (error) {
      console.error("Error al cargar brokerFromInvestor:", error);
      return null;
    }
  };

  const cargarFacturas = async (emisor) => {
    if (!emisor) return [];
    return fetchBills(emisor);
  };

const steps = useMemo(() => {
  const base = [
    { title: "Selección de Operaciones" },
    { title: "Consignación de recaudos" },
    { title: "Carga de Excel" },
    { title: "Confirmación" },
  ];

  if (isJuridica) {
    base.push({ title: "Representante Legal" });
    base.push({ title: "Contacto" });
  }

  return base;
}, [isJuridica]);

  useEffect(() => {
    const lastIndex = steps.length - 1;
    if (activeStep > lastIndex) setActiveStep(lastIndex);
  }, [steps.length, activeStep]);


 

  const HeaderReadOnlyField = ({ label, value, minWidth = 140 }) => {


  return (
    <Box
      sx={{
        minWidth,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pt: 0.25,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: "#111",
          lineHeight: 1.1,
          mb: 0.6,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
};



useEffect(() => {
  if (!routeDraftId) return;

  const loadDraft = async () => {
    try {
      setIsRestoringDraft(true);

      const validateResponse = await validateDraftFetch(routeDraftId);
      const validateData = validateResponse?.data ?? validateResponse;

      if (validateData?.valid === false) {
        console.warn("Conflictos del borrador:", validateData?.conflicts);

        toast.warning(
          validateData?.message ||
            "El borrador tiene conflictos, puedes revisarlo y corregirlo."
        );
      }

      const draft = validateData?.data;

      if (!draft) {
        const response = await getDraftFetch(routeDraftId);
        const raw = response?.data ?? response;
        setDraftToRestore(raw?.data ?? raw);
      } else {
        setDraftToRestore(draft);
      }

      const currentDraft = draft || validateData?.data;

      setDraftId(routeDraftId);
      setActiveStep(Number(currentDraft?.currentStep || 0));
      setInvestorsExcelGenerated(
        Boolean(currentDraft?.metadata?.investorsExcelGenerated)
      );
      setCanGenerateInvestorsExcel(
        Boolean(currentDraft?.metadata?.canGenerateInvestorsExcel)
      );
    } catch (error) {
      console.error("Error cargando borrador:", error);
      toast.error("No fue posible cargar el borrador.");
    } finally {
      setIsRestoringDraft(false);
    }
  };

  loadDraft();
}, [routeDraftId]);


const getClientData = (option) => option?.data || option || {};

const getClientId = (option) =>
  option?.id || option?.value || option?.data?.id || "";

const buildFilteredPayersFromPreoperationIds = (payerIds = [], payersList = []) => {
  const ids = new Set((payerIds || []).map((id) => String(id)));

  return (payersList || []).filter((payer) =>
    ids.has(String(getClientId(payer)))
  );
};

const getClientLabel = (option) => {
  const data = getClientData(option);

  return (
    option?.label ||
    data?.social_reason ||
    data?.full_name ||
    `${data?.first_name || ""} ${data?.last_name || ""}`.trim() ||
    ""
  );
};

const getClientDocument = (option) => {
  const data = getClientData(option);

  return String(
    data?.document_number ||
      data?.nit ||
      data?.identification ||
      data?.document ||
      ""
  ).trim();
};


const findClientOptionById = (list = [], id) => {
  if (!id) return null;

  return (
    list.find((item) => String(getClientId(item)) === String(id)) || null
  );
};

const buildFilteredPayersFromBills = (facturasEmisor = [], payersList = []) => {
  const payerDocuments = [
    ...new Set(
      (facturasEmisor || [])
        .map((bill) => String(bill?.payerId || "").trim())
        .filter(Boolean)
    ),
  ];

  return (payersList || []).filter((payer) => {
    const payerDocument = getClientDocument(payer);
    return payerDocument && payerDocuments.includes(payerDocument);
  });
};

const getBrokerName = (broker) => {
  const data = broker?.data || broker || {};

  const fullName = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

  return (
    broker?.label ||
    data?.social_reason ||
    fullName ||
    data?.name ||
    ""
  );
};

const getBrokerId = (broker) => {
  const data = broker?.data || broker || {};

  return broker?.id || broker?.value || data?.id || "";
};

const hydrateDraft = async (draft, setFieldValue) => {
  if (!draft) return;

  const selectedBills = draft.selectedBills || [];
  const investorAssignments = draft.investorAssignments || [];

  const emitterObj = findClientOptionById(emisores, draft.emitterId);
  const payerObj = findClientOptionById(payers, draft.payerId);

  if (emitterObj) {
    setFieldValue("emitter", emitterObj);
    setFieldValue("emitterLabel", getClientLabel(emitterObj));
    setClientEmitter(emitterObj);
  }

  if (payerObj) {
    const payerData = getClientData(payerObj);

    setFieldValue("nombrePagador", payerData.id || draft.payerId);
    setFieldValue("payerId", payerData.id || draft.payerId);
    setFieldValue("nombrepayer", getClientLabel(payerObj));
    setClientPagador(payerData);
  }

  setFieldValue("emitterId", draft.emitterId || "");
  setFieldValue("payerId", draft.payerId || "");
  setFieldValue("emitterBrokerId", draft.emitterBrokerId || "");
  setFieldValue("emitterBroker", draft.emitterBrokerId || "");
if (draft.emitterId) {
  try {
    const brokerResponse = await fetchBrokerByClient(draft.emitterId);

    const brokerRaw =
      brokerResponse?.data?.data ??
      brokerResponse?.data ??
      brokerResponse ??
      null;

    const broker = Array.isArray(brokerRaw) ? brokerRaw[0] : brokerRaw;

    const brokerId = draft.emitterBrokerId || getBrokerId(broker);
    const brokerName =
      draft?.metadata?.emitterBrokerName || getBrokerName(broker);

    if (brokerId) {
      setClientBrokerEmitter(broker);
      setFieldValue("emitterBroker", brokerId);
      setFieldValue("emitterBrokerId", brokerId);
    }

    if (brokerName) {
      setFieldValue("emitterBrokerName", brokerName);
    }
  } catch (error) {
    console.error("Error cargando corredor del emisor:", error);
  }
}
  setFieldValue("billsToNegotiate", selectedBills);
  setFieldValue("investorAssignments", investorAssignments);

  if (!draft.emitterId) return;

  const billsResponse = await cargarFacturas(draft.emitterId);
  const bills = billsResponse?.data || [];

  const filteredPayers = buildFilteredPayersFromBills(bills, payers);
  setFieldValue("filteredPayers", filteredPayers);

  const payerDocument =
    getClientDocument(payerObj) ||
    String(selectedBills?.[0]?.payerId || "").trim();

  const payerBills = bills.filter((bill) => {
    const samePayer = payerDocument
      ? String(bill?.payerId || "").trim() === payerDocument
      : true;

    const hasBalance = Number(bill?.currentBalance || 0) > 0;

    return samePayer && hasBalance;
  });

  setFieldValue("takedBills", payerBills);
};





const baseInitialValuesRef = useRef(initialValues || {});

const formInitialValues = useMemo(() => {
  const base = baseInitialValuesRef.current || {};

  return {
    ...base,

    opId: draftToRestore?.opId ?? base?.opId ?? "",
    opDate: draftToRestore?.opDate
      ? new Date(draftToRestore.opDate)
      : base?.opDate ?? null,

    opType: draftToRestore?.opTypeId ?? base?.opType ?? "",

    emitterId: draftToRestore?.emitterId ?? base?.emitterId ?? "",
    payerId: draftToRestore?.payerId ?? base?.payerId ?? "",

    emitterBrokerId:
      draftToRestore?.emitterBrokerId ?? base?.emitterBrokerId ?? "",

    emitterBrokerName:
      draftToRestore?.metadata?.emitterBrokerName ??
      base?.emitterBrokerName ??
      "",

    emitterLabel:
      draftToRestore?.metadata?.emitterName ??
      base?.emitterLabel ??
      "",

    nombrepayer:
      draftToRestore?.metadata?.payerName ??
      base?.nombrepayer ??
      "",

    nombrePagador:
      draftToRestore?.payerId ??
      base?.nombrePagador ??
      "",

    facturas: base?.facturas ?? [],
    takedBills: base?.takedBills ?? [],
    filteredPayers: base?.filteredPayers ?? [],

    billsToNegotiate:
      draftToRestore?.selectedBills ??
      base?.billsToNegotiate ??
      [],

    investorAssignments:
      draftToRestore?.investorAssignments ??
      base?.investorAssignments ??
      [],

    applicationDate:
      draftToRestore?.metadata?.applicationDate
        ? new Date(draftToRestore.metadata.applicationDate)
        : base?.applicationDate ?? new Date(),

    receiptStatus:
      draftToRestore?.metadata?.receiptStatus ??
      base?.receiptStatus ??
      "",

    receiptType:
      draftToRestore?.metadata?.receiptType ??
      base?.receiptType ??
      "Transferencia",

    receiptPreviewRows:
      draftToRestore?.metadata?.receiptPreviewRows ??
      base?.receiptPreviewRows ??
      [],

    receiptPreviewSummary:
      draftToRestore?.metadata?.receiptPreviewSummary ??
      base?.receiptPreviewSummary ??
      {},
  };
}, [draftToRestore?.id]);




  return (
   <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
  <ToastContainer position="top-right" autoClose={5000} />

<Box
  sx={{
    width: "100%",
    maxWidth: "1680px",
    minWidth: "1280px",
    mx: "auto",
    px: 2.5,
    pt: 2.5,
    pb: 2,
    minHeight: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  }}
>
        <Box className="view-header" sx={{ flexShrink: 0 }}>
  <Typography fontSize="1.7rem" marginBottom="0.7rem" color="#5EA3A3">
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ ml: 1, mt: 0 }}
    >
              <Link href="/dashboard">
                <HomeIcon sx={{ color: "#488b8f" }} />
              </Link>
              <Typography>Operaciones por Aprobar</Typography>
              <Typography>Registrar Operación Masiva</Typography>
            </Breadcrumbs>
          </Typography>
        </Box>

        <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mb: 0.25,
    pr: 0.75,
  }}
>
  <Typography sx={{ fontSize: 12, color: "#444" }}>
    Creado por: {user?.name ?? "Desconocido"}
  </Typography>
</Box>

        <Formik
     
  initialValues={formInitialValues}
  enableReinitialize={Boolean(draftToRestore?.id)}
  validationSchema={validationSchema}
  onSubmit={handleConfirm}
>
          {({ values, setFieldValue, touched, errors, setFieldTouched, submitForm }) => {
console.log(values)
const DEFAULT_RECEIPT_STATUS = "ea8518e8-168a-46d7-b56a-1286bf0037cd";
            const safeDateToIso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};
          




const normalizeReceiptOperationPayload = (row) => ({
  id: row?.preOperationId || row?.id,
  preOperationId: row?.preOperationId || row?.id,
  operation: row?.preOperationId || row?.id,
  billUniqueId: row?.billUniqueId || row?.bill?.id || "",
  billId: row?.billId || row?.bill?.billId || "",
  payedAmount:0
});

const buildMassiveReceiptPreviewPayload = () => ({
  applicationDate: safeDateToIso(values?.applicationDate || new Date()),
  receiptStatus: values?.receiptStatus || DEFAULT_RECEIPT_STATUS,
  receiptType: values?.receiptType || "Transferencia",
  operations: (values?.billsToNegotiate || []).map(normalizeReceiptOperationPayload),
});

const loadMassiveReceiptPreview = async (overrideApplicationDate) => {
  const selectedOperations = Array.isArray(values?.billsToNegotiate)
    ? values.billsToNegotiate
    : [];

  if (selectedOperations.length < 5) {
    toast.warning("Debe seleccionar mínimo 5 facturas.");
    return false;
  }

  const applicationDateToUse = overrideApplicationDate || values?.applicationDate;

if (!applicationDateToUse) {
    toast.warning("Debe seleccionar la fecha de aplicación.");
    return false;
  }

 const operationsPayload = selectedOperations.map(normalizeReceiptOperationPayload);

  try {
    setReceiptPreviewLoading(true);
    setReceiptExcelGenerated(false);

    const response = await fetchMassiveReceiptPreview({
      applicationDate: safeDateToIso(applicationDateToUse || new Date()),
      receiptStatus: values?.receiptStatus || DEFAULT_RECEIPT_STATUS,
      receiptType: values?.receiptType || "Transferencia",
      operations: operationsPayload,
    });

   const payload =
  response?.data && !Array.isArray(response?.data)
    ? response.data
    : response;

if (payload?.error) {
  toast.error(payload?.message || "No fue posible calcular los recaudos.");
  return false;
}

const previewRows = Array.isArray(payload?.data)
  ? payload.data
  : Array.isArray(payload)
  ? payload
  : [];

    if (!previewRows.length) {
  console.warn("Preview vacío. Payload enviado:", operationsPayload);
  console.warn("Respuesta preview:", payload);
  toast.warning(
    "El backend no devolvió recaudos calculados para las operaciones seleccionadas."
  );

  setFieldValue("receiptPreviewRows", []);
  setFieldValue("receiptPreviewSummary", {});
  setFieldValue("investorAssignments", []);
  return false;
}

setFieldValue("receiptPreviewRows", previewRows);
setFieldValue("receiptPreviewSummary", payload?.summary || {});
setFieldValue("investorAssignments", previewRows);

return true;
  } catch (error) {
    console.error("Error calculando recaudos:", error);
    toast.error("No fue posible calcular los recaudos.");
    return false;
  } finally {
    setReceiptPreviewLoading(false);
  }
};

const handleNextStep = async () => {
  if (activeStep === 0) {
    const ok = await loadMassiveReceiptPreview();
    if (!ok) return;

    setActiveStep(1);
    return;
  }

  if (activeStep === 1) {
    if (!receiptExcelGenerated) {
      toast.warning("Debe generar el Excel antes de continuar.");
      return;
    }

 setUploadExcelState({
  file: null,
  status: "idle",
  rows: [],
  normalizedRows: [],
  canRegister: false,
  operationId: null,
  processedMessage: "",
  errorCount: 0,
  modalError: "",
  summary: {},
  registerSummary: null,
});

setRegisterSummary(null);
setRegisteredReceiptsCount(0);
setActiveStep(2);
    return;
  }

  setActiveStep((prev) => prev + 1);
};


const buildDraftPayload = () => ({
  opId: values.opId || null,
  opDate: safeDateToIso(values.opDate),
  opTypeId: values.opType || null,

  emitterId:
    values?.emitter?.value ||
    values?.emitter?.data?.id ||
    values?.emitterId ||
    null,

  payerId:
    clientPagador?.id ||
    values?.payerId ||
    values?.nombrePagador ||
    null,

  emitterBrokerId:
    values?.emitterBroker ||
    values?.emitterBrokerId ||
    clientBrokerEmitter?.id ||
    null,

  currentStep: activeStep,
  status: activeStep >= 1 ? "READY_FOR_EXCEL" : "DRAFT",

  selectedBills: values?.billsToNegotiate || [],

  investorAssignments:
    values?.receiptPreviewRows ||
    values?.investorAssignments ||
    [],

  metadata: {
    emitterName:
      values?.emitterLabel ||
      values?.emitter?.label ||
      values?.emitter?.data?.social_reason ||
      "",

    payerName:
      values?.nombrepayer ||
      values?.payer?.label ||
      "",

    emitterBrokerName:
      values?.emitterBrokerName ||
      getBrokerName(clientBrokerEmitter),

    receiptType: values?.receiptType || "Transferencia",
    receiptStatus: values?.receiptStatus || "",
    applicationDate: safeDateToIso(values?.applicationDate || new Date()),

    receiptPreviewRows: values?.receiptPreviewRows || [],
    receiptPreviewSummary: values?.receiptPreviewSummary || {},

    receiptExcelGenerated,
    investorsExcelGenerated: receiptExcelGenerated,

    selectedBillsCount: values?.billsToNegotiate?.length || 0,
    assignmentsCount:
      values?.receiptPreviewRows?.length ||
      values?.investorAssignments?.length ||
      0,

    canGenerateInvestorsExcel:
      Boolean(values?.receiptPreviewRows?.length),
  },
});

   const uploadContext = {
  applicationDate: safeDateToIso(values?.applicationDate || new Date()),
  receiptStatus: values?.receiptStatus || DEFAULT_RECEIPT_STATUS,
  receiptType: values?.receiptType || "Transferencia",

  emitterId:
    values?.emitter?.value ||
    values?.emitter?.data?.id ||
    values?.emitterId ||
    "",

  payerId:
    clientPagador?.id ||
    values?.payerId ||
    values?.nombrePagador ||
    "",

  rows: (values?.receiptPreviewRows || []).map((row) => ({
    preOperationId: row?.preOperationId || row?.id || "",
    operation: row?.operation || row?.preOperationId || row?.id || "",
    billId: row?.billUniqueId || "",
    billNumber: row?.billId || "",
    billFraction: Number(row?.fraction ?? 1),
    investorName: row?.investorName || "",
    investorAccount: row?.accountNumber || "",
    account: row?.account || row?.accountId || "",
    receiptStatus: values?.receiptStatus || DEFAULT_RECEIPT_STATUS,
    periodStart: row?.periodStart || "",
    periodEnd: row?.periodEnd || "",
    toCollect: Number(row?.toCollect || 0),
    opPendingAmount: Number(row?.opPendingAmount || 0),
  })),
};


            const selectedBillsCount = values?.billsToNegotiate?.length || 0;
            const isHeaderLocked = activeStep >= 1;
            const isSuccessView = activeStep === 3;

            const allAssignmentsComplete =
              Array.isArray(values?.investorAssignments) &&
              values.investorAssignments.length > 0 &&
              values.investorAssignments.every(
                (row) =>
                  row?.investorId && row?.accountId && row?.investorBrokerId
              );

            const excelLoadedAndValid =
              Boolean(uploadExcelState?.file) &&
              uploadExcelState?.status === "processed_success" &&
              uploadExcelState?.canRegister === true &&
              Number(uploadExcelState?.errorCount || 0) === 0 &&
              Array.isArray(uploadExcelState?.normalizedRows) &&
              uploadExcelState.normalizedRows.length > 0;

  const canGoNext =
  activeStep === 0
    ? selectedBillsCount >= 5
    : activeStep === 1
    ? receiptExcelGenerated && (values?.receiptPreviewRows || []).length > 0
    : true;

const getRegisteredCount = (...sources) => {
  for (const source of sources) {
    if (!source) continue;

    const directCount = Number(
      source?.createdCount ??
        source?.created_count ??
        source?.count ??
        source?.registeredRows ??
        source?.registered_rows
    );

    if (Number.isFinite(directCount) && directCount > 0) {
      return directCount;
    }

    if (Array.isArray(source?.data) && source.data.length > 0) {
      return source.data.length;
    }

    if (Array.isArray(source?.rows) && source.rows.length > 0) {
      return source.rows.length;
    }

    if (Array.isArray(source?.receipts) && source.receipts.length > 0) {
      return source.receipts.length;
    }
  }

  return 0;
};

const registeredCount = getRegisteredCount(
  registerSummary,
  uploadExcelState?.registerSummary,
  uploadExcelState,
  { createdCount: registeredReceiptsCount }
);


const parseLocalDate = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const stringValue = String(value).slice(0, 10);
  const match = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getOperationStartDate = (row) => {
  return (
    row?.periodStart ||
    row?.opDate ||
    row?.raw?.periodStart ||
    row?.raw?.opDate ||
    null
  );
};

const getMinApplicationDate = (selectedOperations = []) => {
  const dates = selectedOperations
    .map((row) => parseLocalDate(getOperationStartDate(row)))
    .filter(Boolean);

  if (!dates.length) return null;

  return dates.reduce((latest, current) =>
    current > latest ? current : latest
  );
};

const minApplicationDate = getMinApplicationDate(
  Array.isArray(values?.billsToNegotiate) ? values.billsToNegotiate : []
);


const buildReceiptSummaryFromRows = (rows = []) => {
  const summary = {
    canceledAnticipated: 0,
    partialAnticipated: 0,
    canceledExpired: 0,
    partialExpired: 0,
    canceledCurrent: 0,
    partialCurrent: 0,
  };

  const summaryKeyByStatusKey = {
    canceled_anticipated: "canceledAnticipated",
    partial_anticipated: "partialAnticipated",
    canceled_expired: "canceledExpired",
    partial_expired: "partialExpired",
    canceled_current: "canceledCurrent",
    partial_current: "partialCurrent",
  };

  rows.forEach((row) => {
    const summaryKey = summaryKeyByStatusKey[row?.statusKey];

    if (summaryKey) {
      summary[summaryKey] += 1;
    }
  });

  return summary;
};

const handleDeletePreviewReceiptRow = (row) => {
  const rowId = String(row?.preOperationId || row?.operation || row?.id || "");

  if (!rowId) return;

  const nextPreviewRows = (values?.receiptPreviewRows || []).filter((item) => {
    const itemId = String(item?.preOperationId || item?.operation || item?.id || "");
    return itemId !== rowId;
  });

  const nextBillsToNegotiate = (values?.billsToNegotiate || []).filter((item) => {
    const itemId = String(item?.preOperationId || item?.operation || item?.id || "");
    return itemId !== rowId;
  });

  setFieldValue("receiptPreviewRows", nextPreviewRows);
  setFieldValue("investorAssignments", nextPreviewRows);
  setFieldValue("billsToNegotiate", nextBillsToNegotiate);
  setFieldValue("receiptPreviewSummary", buildReceiptSummaryFromRows(nextPreviewRows));

  setReceiptExcelGenerated(false);
  setInvestorsExcelGenerated(false);
  setCanGenerateInvestorsExcel(false);

  setUploadExcelState({
    file: null,
    status: "idle",
    rows: [],
    normalizedRows: [],
    canRegister: false,
    operationId: null,
    processedMessage: "",
    errorCount: 0,
    modalError: "",
  });

  toast.info("Operación removida del lote. Debes generar un nuevo Excel.");
};

            return (
              <>
<Grid
  container
  spacing={2}
  alignItems="stretch"
  sx={{
    flex: 1,
    minHeight: 0,
    overflow: "visible",
  }}
>
<Grid
  item
  sx={{
    width: sidebarCollapsed ? 120 : 300,
    flexShrink: 0,
    display: "flex",
    minHeight: 0,
    transition: "width 0.25s ease",
  }}
>        <Box
  sx={{
    bgcolor: "#F8F8F8",
    borderRadius: 2,
    boxShadow: 1,
    p: sidebarCollapsed ? 1.5 : 2.5,
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  }}
>
  <IconButton
    size="small"
    onClick={() => setSidebarCollapsed((prev) => !prev)}
    sx={{
      position: "absolute",
      top: 8,
      right: 8,
      color: "#6D6D6D",
      zIndex: 2,
    }}
  >
    {sidebarCollapsed ? "›" : "‹"}
  </IconButton>
                      <Box
  sx={{
    mb: sidebarCollapsed ? 7 : 3,
    display: "flex",
    justifyContent: sidebarCollapsed ? "center" : "flex-start",
    mt: sidebarCollapsed ? 3 : 0,
  }}
>
  <Image
    src={smartLogo}
    alt="logo"
    style={{
      maxWidth: sidebarCollapsed ? 72 : 180,
      width: "100%",
      height: "auto",
      objectFit: "contain",
    }}
  />
</Box>

                      <Stepper
  activeStep={activeStep}
  orientation="vertical"
  connector={<SmartConnector />}
  sx={{
    alignItems: sidebarCollapsed ? "center" : "stretch",
    "& .MuiStep-root": {
      minHeight: 92,
    },
    "& .MuiStepLabel-root": {
      alignItems: "flex-start",
      justifyContent: sidebarCollapsed ? "center" : "flex-start",
    },
    "& .MuiStepLabel-labelContainer": {
      display: sidebarCollapsed ? "none" : "block",
      mt: "1px",
    },
    "& .MuiStepConnector-root": {
      ml: sidebarCollapsed ? 0 : undefined,
    },
  }}
>
                        {steps.map((s, index) => {
                          const status = getStepStatus(index, activeStep);
                          const isCurrent = index === activeStep;
                          const isDone = index < activeStep;

                          return (
                            <Step key={`${s.title}-${index}`}>
                              <StepLabel StepIconComponent={SmartStepIcon}>
  {!sidebarCollapsed && (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.15,
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#7D7D7D", mb: 0.3 }}>
        Paso {index + 1}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: isCurrent ? "#111" : isDone ? "#666" : "#8D8D8D",
          mb: 0.3,
        }}
      >
        {s.title}
      </Typography>

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: isCurrent ? "#1A73C9" : isDone ? "#4E8D5D" : "#B4B4B4",
        }}
      >
        {status}
      </Typography>
    </Box>
  )}
</StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Box>
                  </Grid>

          <Grid
  item
  xs
  sx={{
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
><Box
  sx={{
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    flex: 1,
    overflow: "hidden",
  }}
>
                   {!isSuccessView && (
  <Form>
    <Box
      sx={{
        flexShrink: 0,
        pt: 1,
        px: 0.75,
        overflow: "visible",
      }}
    >
     <Grid
  container
  columnSpacing={1.5}
  rowSpacing={0}
  wrap="nowrap"
  alignItems="flex-start"
  sx={{
    m: 0,
    width: "100%",
  }}
>
  

 

  

  <Grid item xs={12} md={3.4} sx={{ minWidth: 260 }}>
    {isHeaderLocked ? (
      <HeaderReadOnlyField
        label="Nombre Emisor"
        value={
  values?.emitterLabel ||
  values?.emitter?.label ||
  values?.emitter?.data?.social_reason ||
  (values?.emitter?.data?.first_name
    ? `${values?.emitter?.data?.first_name || ""} ${values?.emitter?.data?.last_name || ""}`.trim()
    : "") ||
  "-"
}
        minWidth={260}
      />
    ) : (
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <EmitterSelector
  disabled={isHeaderLocked}
  setClientPagador={setClientPagador}
  orchestDisabled={orchestDisabled}
  setIsSelectedPayer={setIsSelectedPayer}
  setPendingClear={setPendingClear}
  setFieldValue={setFieldValue}
  setFieldTouched={setFieldTouched}
  setEmitterSaved={setEmitterSaved}
  emitterSaved={emitterSaved}
  touched={touched}
  values={values}
  payers={payers}
  emisores={emisores}
  brokeDelete={brokeDelete}
  isCreatingBill={isCreatingBill}
  fetchBrokerByClient={fetchBrokerByClient}
  cargarTasaDescuento={cargarTasaDescuento}
  setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
  setClientEmitter={setClientEmitter}
  setClientBrokerEmitter={setClientBrokerEmitter}
  cargarFacturas={cargarFacturas}
  fetchGetPayersFromOperationRelated={fetchGetPayersFromOperationRelated}
  buildFilteredPayersFromPreoperationIds={buildFilteredPayersFromPreoperationIds}
  errors={errors}
  setIsModalEmitterAd={setIsModalEmitterAd}
/>
        </Box>

        {clientEmitter && (
          <IconButton
            size="small"
            onClick={() =>
              window.open(
                `${window.location.origin}/customers?modify=${clientEmitter.data.id}`,
                "_blank"
              )
            }
            sx={{
              mt: "6px",
              color: "#488F88",
              "&:hover": {
                color: "#3a726c",
                backgroundColor: "rgba(72, 143, 136, 0.1)",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    )}
  </Grid>

  <Grid item xs={12} md={3.1} sx={{ minWidth: 260 }}>
    {isHeaderLocked ? (
      <HeaderReadOnlyField
        label="Nombre Pagador"
        value={
          values?.nombrepayer ||
          values?.payer?.label ||
          ""
        }
        minWidth={280}
      />
    ) : (
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PayerSelector
  disabled={isHeaderLocked}
  errors={errors}
  showAllPayers={showAllPayers}
  payers={payers}
  values={values}
  setFieldValue={setFieldValue}
  setClientPagador={setClientPagador}
  setIsSelectedPayer={setIsSelectedPayer}
  touched={touched}
  orchestDisabled={orchestDisabled}
  fetchOperationsByEmitterPayer={fetchOperationsByEmitterPayer}
/>
        </Box>
      </Box>
    )}
  </Grid>
  {activeStep === 1 && (
  <>
     <Grid item sx={{ width: 260, minWidth: 260, flexShrink: 0 }}>
  <ReceiptStatusSelect
    disabled={false}
    formik={{
      values,
      touched,
      errors,
      setFieldValue,
      setFieldTouched,
    }}
  />
</Grid>

    <Grid item sx={{ width: 180, minWidth: 180, flexShrink: 0 }}>
      <DatePicker
  label="Fecha Aplicación"
  value={values.applicationDate}
  minDate={minApplicationDate}
  inputFormat="dd/MM/yyyy"
  onChange={async (newValue) => {
    const isInvalid =
      minApplicationDate && newValue && newValue < minApplicationDate;

    const nextDate = isInvalid ? minApplicationDate : newValue;

    if (isInvalid) {
      toast.warning(
        "La fecha de aplicación no puede ser menor a la fecha de inicio de las operaciones seleccionadas."
      );
    }

    setFieldValue("applicationDate", nextDate);
    setFieldValue("receiptPreviewRows", []);
    setFieldValue("receiptPreviewSummary", {});
    setReceiptExcelGenerated(false);

    if (activeStep === 1 && nextDate) {
      await loadMassiveReceiptPreview(nextDate);
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 44,
          borderRadius: "10px",
          backgroundColor: "#fff",
        },
        "& .MuiInputBase-input": {
          fontSize: 13,
        },
        "& .MuiInputLabel-root": {
          fontSize: 13,
        },
      }}
    />
  )}
/>
    </Grid>
  </>
)}

{/*<Grid
  item
  sx={{
    width: 210,
    minWidth: 210,
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    pt: "0px",
  }}
>
 <Box
  sx={{
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 1.25,
    width: "100%",
    mt: "-8px",
  }}
>
    <Tooltip title="Guardar borrador">
      <span>
        <IconButton
          size="small"
          disabled={draftStatus === "saving"}
          onClick={() => {
           const hasMinimumDraftData =
  (
    values?.emitter?.value ||
    values?.emitter?.data?.id ||
    values?.emitterId
  ) &&
  (
    values?.payerId ||
    values?.nombrePagador
  ) &&
  values?.billsToNegotiate?.length > 0;

            if (!hasMinimumDraftData) {
              toast.warning("Selecciona facturas antes de guardar el borrador.");
              return;
            }

            saveDraft(buildDraftPayload());
          }}
          sx={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            border: "1px solid #DDECEC",
            backgroundColor: "#F8FFFF",
            color: "#4C989B",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "#EEF9F9",
              borderColor: "#4C989B",
            },
            "&.Mui-disabled": {
              color: "#AEBBBB",
              backgroundColor: "#F8F8F8",
            },
          }}
        >
          <SaveOutlinedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>

    <Typography
      sx={{
        fontSize: 15,
        fontWeight: 700,
        color:
          draftStatus === "error"
            ? "#D32F2F"
            : draftStatus === "saved"
            ? "#3E9B59"
            : draftStatus === "saving"
            ? "#4C989B"
            : "#FF6B6B",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {draftStatus === "saving"
        ? "Guardando..."
        : draftStatus === "saved"
        ? "Guardado"
        : draftStatus === "error"
        ? "Error"
        : "No guardado"}
    </Typography>
  </Box>
</Grid>

*/}



  
</Grid>
      </Box>

     
    </Form>
)}


<Box
  sx={{
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  }}
>   {activeStep === 0 && (
  <BillsDualTable
    takedBills={values?.takedBills || []}
    billsToNegotiate={values?.billsToNegotiate || []}
    loading={isLoadingBills}
    nombrePagador={values?.nombrePagador}
    emitterKey={values?.emitter?.value || values?.emitterId || ""}
    setFieldValue={setFieldValue}
    OperationsByEmitterPayerLoading={OperationsByEmitterPayerLoading}
  />
)}

{activeStep === 1 && (
  <ReceiptConsignmentTable
    rows={values?.receiptPreviewRows || []}
    summary={values?.receiptPreviewSummary || {}}
    loading={receiptPreviewLoading}
    user={user}
    emitterName={
      values?.emitterLabel ||
      values?.emitter?.label ||
      values?.emitter?.data?.social_reason ||
      ""
    }
    payerName={values?.nombrepayer || values?.payer?.label || ""}
    applicationDate={values?.applicationDate}
    receiptTypeLabel={values?.receiptType || "Transferencia"}
    onDeleteRow={handleDeletePreviewReceiptRow}
    onExcelGenerated={(generated) => {
      setReceiptExcelGenerated(Boolean(generated));
      setInvestorsExcelGenerated(Boolean(generated));
      setCanGenerateInvestorsExcel(Boolean(generated));
    }}
    exposeGenerateExcel={(fn) => {
      generateReceiptExcelRef.current = fn;
    }}
  />
)}

{activeStep === 2 && (
  <ReceiptUploadExcelStep
    uploadExcelFetch={fetchMassiveReceiptUploadExcel}
    state={uploadExcelState}
onNext={(payload) => {
  const createdCount = Number(
    payload?.createdCount ??
      payload?.created_count ??
      payload?.count ??
      (Array.isArray(payload?.data) ? payload.data.length : 0) ??
      0
  );

  const normalizedPayload = {
    ...(payload || {}),
    createdCount,
  };

  console.log("REGISTER SUCCESS PAYLOAD:", normalizedPayload);

  setRegisterSummary(normalizedPayload);
  setRegisteredReceiptsCount(createdCount);

  setUploadExcelState((prev) => ({
    ...(prev || {}),
    status: "registered_success",
    registerSummary: normalizedPayload,
    createdCount,
  }));

  setActiveStep(3);
}}


    setState={setUploadExcelState}
    uploadContext={uploadContext}
    onProcessedRows={(rows) => {
      setFieldValue("receiptUploadedRows", rows);
    }}
 registerReceipts={async (normalizedRows) => {
  const response = await fetchMassiveReceiptRegister({
    applicationDate: safeDateToIso(values?.applicationDate || new Date()),
    receiptStatus: values?.receiptStatus || DEFAULT_RECEIPT_STATUS,
    receiptType: values?.receiptType || "Transferencia",
    rows: normalizedRows,
  });

  const rawPayload =
    response?.data && !Array.isArray(response?.data)
      ? response.data
      : response;

  if (rawPayload?.error) {
    throw new Error(
      rawPayload?.message || "No fue posible registrar los recaudos."
    );
  }

  const createdCount = Number(
    rawPayload?.createdCount ??
      rawPayload?.created_count ??
      rawPayload?.count ??
      (Array.isArray(rawPayload?.data) ? rawPayload.data.length : normalizedRows?.length) ??
      0
  );

  const payload = {
    ...(rawPayload || {}),
    createdCount,
  };

  setRegisterSummary(payload);
  setRegisteredReceiptsCount(createdCount);

  return payload;
}}
  />
)}

{activeStep === 3 && (
  <Box
    sx={{
      width: "100%",
      minHeight: 520,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
    }}
  >
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
        fontSize: 28,
      }}
    >
      Recaudos registrados correctamente
    </Typography>

  <Typography sx={{ color: "#666", fontSize: 15 }}>
  Se registraron {registeredCount} recaudo(s).
</Typography>
  </Box>
)}</Box>
                   
                    </Box>
                  </Grid>
                </Grid>

                {!isSuccessView && (
  <Grid
    container
    spacing={2}
    sx={{
      mt: 1,
      flexShrink: 0,
    }}
  >
                    <Grid item sx={{ width: 300, flexShrink: 0 }} />
<Grid item xs sx={{ minWidth: 0 }}>
                     <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    mt: 2,
    gap: 2,
  }}
>

   {activeStep > 0 && (

    
                        <Button
  variant="text"
  onClick={() => setActiveStep((prev) => prev - 1)}
  sx={{
    minWidth: "auto",
    padding: 0,
    fontSize: 14,
    fontWeight: 500,
    textTransform: "none",
    color: "#2E9B9B",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  }}
>
  Atrás
</Button>
                        )}
  {activeStep === 1 && (
<Button
  variant="outlined"
onClick={() => {
 generateReceiptExcelRef.current?.();
}}
  disabled={
  !Array.isArray(values?.receiptPreviewRows) ||
  values.receiptPreviewRows.length === 0
}
  startIcon={<DownloadIcon />}
  sx={{
    minWidth: 175,
    height: 36,
    borderRadius: "6px",
    px: 2,
    backgroundColor: "#fff",
    borderColor: "#4C989B",
    color: "#2E9B9B",
    fontSize: 13,
    fontWeight: 500,
    textTransform: "none",
    boxShadow: "none",
    "& .MuiButton-startIcon svg": {
      fontSize: 18,
    },
    "&:hover": {
      backgroundColor: "#F8FFFF",
      borderColor: "#43898B",
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      backgroundColor: "#fff",
      borderColor: "#C9D6D6",
      color: "#AEBBBB",
    },
  }}
>
  Generar Excel
</Button>
)}
                       

            {activeStep < 2 && (
  <Button
    variant="contained"
    disabled={receiptPreviewLoading || !canGoNext}
    onClick={handleNextStep}
    sx={{
      bgcolor: "#2C9A9A",
      color: "#fff",
      px: 4,
      "&:hover": {
        bgcolor: "#258383",
      },
      "&.Mui-disabled": {
        bgcolor: "#D0D0D0",
        color: "#fff",
      },
    }}
  >
    {activeStep === 0 && receiptPreviewLoading ? "Calculando..." : "Siguiente"}
  </Button>
)}
                      </Box>
                      
                    </Grid>
                    
                  </Grid>
                )}
              </>
            );
          }}
        </Formik>
      </Box>
    </LocalizationProvider>
  );
};