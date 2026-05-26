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
import smartLogo from "../../../public/assets/Logo Smart - Lite.svg";

import EmitterSelector from "@components/selects/registerMassiveOperations/EmitterSelector";
import PayerSelector from "@components/selects/registerMassiveOperations/PayerSelector";

import { BillsDualTable } from "./components/BillsDualTable";
import { InvestorsAssignmentTable } from "./components/InvestorsAssigmentTable";
import { UploadExcelStep } from "./components/uploadExcel";
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
} from "./queries";

import {
  createMassiveOperationDraft,
  updateMassiveOperationDraft,
  getMassiveOperationDraft,
  validateMassiveOperationDraft,
  markMassiveOperationDraftRegistered,
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

export const RegisterMassiveOperationComponent = ({
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


  const { fetch: createDraftFetch } = useFetch({
  service: createMassiveOperationDraft,
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
      { title: "Generación de Facturas" },
      { title: "Asignación de inversionistas" },
      { title: "Carga de excel" },
      { title: "Confirmación" },
    ];

    if (isJuridica) {
      base.push({ title: "Representante Legal" });
      base.push({ title: "Contacto" });
    }

    return base;
  }, [isJuridica]);


  const clampStep = (step) => {
  const parsed = Number(step);

  if (Number.isNaN(parsed)) return 0;

  return Math.max(0, Math.min(parsed, steps.length - 1));
};

const getDraftCurrentStep = (draft) => {
  return clampStep(
    draft?.currentStep ??
      draft?.current_step ??
      draft?.metadata?.currentStep ??
      draft?.metadata?.current_step ??
      0
  );
};


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

      let currentDraft = validateData?.data || null;

      if (!currentDraft) {
        const response = await getDraftFetch(routeDraftId);
        const raw = response?.data ?? response;
        currentDraft = raw?.data ?? raw;
      }

      if (!currentDraft) {
        toast.error("No se encontró información del borrador.");
        return;
      }

      setDraftToRestore(currentDraft);

      setDraftId(routeDraftId);
      setActiveStep(getDraftCurrentStep(currentDraft));

      setInvestorsExcelGenerated(
        Boolean(currentDraft?.metadata?.investorsExcelGenerated)
      );

      setCanGenerateInvestorsExcel(
        Boolean(currentDraft?.metadata?.canGenerateInvestorsExcel)
      );

      setUploadExcelState((prev) => ({
        ...prev,
        ...(currentDraft?.metadata?.uploadExcelState || {}),
      }));
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

const normalizeDraftAssignments = async (assignments = []) => {
  if (!Array.isArray(assignments)) return [];

  const normalized = await Promise.all(
    assignments.map(async (row) => {
      const investorId =
        row?.investorId ||
        row?.investor_id ||
        row?.selectedInvestor?.value ||
        row?.selectedInvestor?.id ||
        row?.selectedInvestor?.data?.id ||
        "";

      const selectedInvestor =
        row?.selectedInvestor ||
        investors?.find((inv) => String(getClientId(inv)) === String(investorId)) ||
        null;

      const investorLabel =
        row?.investorLabel ||
        row?.investorName ||
        row?.selectedInvestor?.label ||
        getClientLabel(selectedInvestor) ||
        "";

      let availableAccounts = Array.isArray(row?.availableAccounts)
        ? row.availableAccounts
        : [];

      if (investorId && availableAccounts.length === 0) {
        try {
          const accountsResponse = await fetchAccountsFromClient(investorId);
          availableAccounts =
            accountsResponse?.data?.data ||
            accountsResponse?.data ||
            accountsResponse ||
            [];
        } catch (error) {
          console.error("Error restaurando cuentas del inversionista:", error);
          availableAccounts = [];
        }
      }

      const accountId =
        row?.accountId ||
        row?.account_id ||
        row?.selectedAccount?.id ||
        "";

      const selectedAccount =
        row?.selectedAccount ||
        availableAccounts.find((acc) => String(acc?.id) === String(accountId)) ||
        null;

      let investorBrokerId = row?.investorBrokerId || "";
      let investorBrokerName = row?.investorBrokerName || "";

      if (investorId && (!investorBrokerId || !investorBrokerName)) {
        try {
          const brokerResponse = await cargarBrokerFromInvestor(investorId);
          const brokerData =
            brokerResponse?.data?.data ||
            brokerResponse?.data ||
            brokerResponse ||
            null;

          investorBrokerId =
            investorBrokerId ||
            brokerData?.id ||
            brokerData?.value ||
            "";

          investorBrokerName =
            investorBrokerName ||
            brokerData?.label ||
            brokerData?.social_reason ||
            `${brokerData?.first_name || ""} ${brokerData?.last_name || ""}`.trim() ||
            "";
        } catch (error) {
          console.error("Error restaurando broker del inversionista:", error);
        }
      }

      return {
        ...row,
        investorId,
        investorLabel,
        selectedInvestor,
        availableAccounts,
        accountId,
        selectedAccount,
        investorBrokerId,
        investorBrokerName,
        accountAvailableBalance:
          row?.accountAvailableBalance ??
          selectedAccount?.availableBalance ??
          selectedAccount?.available_balance ??
          selectedAccount?.balance ??
          0,
        accountTotalBalance:
          row?.accountTotalBalance ??
          selectedAccount?.totalBalance ??
          selectedAccount?.total_balance ??
          selectedAccount?.balance ??
          0,
      };
    })
  );

  return normalized;
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
const investorAssignments = await normalizeDraftAssignments(
  draft.investorAssignments || []
);

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



const resetUploadExcelState = () => {
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
    registerSummary: null,
  });

  setRegisterSummary(null);
};
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
  initialValues={{
    ...initialValues,

    opId: draftToRestore?.opId ?? initialValues?.opId ?? "",
    opDate: draftToRestore?.opDate
      ? new Date(draftToRestore.opDate)
      : initialValues?.opDate ?? null,

    opType: draftToRestore?.opTypeId ?? initialValues?.opType ?? "",

    emitterId: draftToRestore?.emitterId ?? initialValues?.emitterId ?? "",
    payerId: draftToRestore?.payerId ?? initialValues?.payerId ?? "",

    emitterBrokerId:
      draftToRestore?.emitterBrokerId ?? initialValues?.emitterBrokerId ?? "",

    emitterBrokerName:
      draftToRestore?.metadata?.emitterBrokerName ??
      initialValues?.emitterBrokerName ??
      "",

    emitterLabel:
      draftToRestore?.metadata?.emitterName ??
      initialValues?.emitterLabel ??
      "",

    nombrepayer:
      draftToRestore?.metadata?.payerName ??
      initialValues?.nombrepayer ??
      "",

    nombrePagador:
      draftToRestore?.payerId ??
      initialValues?.nombrePagador ??
      "",

    facturas: initialValues?.facturas ?? [],
    takedBills: initialValues?.takedBills ?? [],

    billsToNegotiate:
      draftToRestore?.selectedBills ??
      initialValues?.billsToNegotiate ??
      [],

    investorAssignments:
      draftToRestore?.investorAssignments ??
      initialValues?.investorAssignments ??
      [],
  }}
  enableReinitialize
  validationSchema={validationSchema}
  onSubmit={handleConfirm}
>
          {({ values, setFieldValue, touched, errors, setFieldTouched, submitForm }) => {
console.log(values)
useEffect(() => {
  if (!draftToRestore) return;
  if (isRestoringDraft) return;
  if (!emisores?.length) return;
  if (!payers?.length) return;

  if (hydratedDraftRef.current === draftToRestore.id) return;

  hydratedDraftRef.current = draftToRestore.id;
  hydrateDraft(draftToRestore, setFieldValue);
}, [draftToRestore?.id, isRestoringDraft, emisores?.length, payers?.length]);
            const safeDateToIso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
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

  currentStep: clampStep(activeStep),

  status:
    activeStep >= 3
      ? "READY_TO_REGISTER"
      : activeStep >= 1
      ? "READY_FOR_EXCEL"
      : "DRAFT",

  selectedBills: values?.billsToNegotiate || [],
 investorAssignments: (values?.investorAssignments || []).map((row) => ({
  ...row,

  investorId:
    row?.investorId ||
    row?.selectedInvestor?.value ||
    row?.selectedInvestor?.id ||
    row?.selectedInvestor?.data?.id ||
    "",

  investorLabel:
    row?.investorLabel ||
    row?.selectedInvestor?.label ||
    getClientLabel(row?.selectedInvestor) ||
    "",

  accountId:
    row?.accountId ||
    row?.selectedAccount?.id ||
    "",

  selectedAccount: row?.selectedAccount || null,

  selectedInvestor: row?.selectedInvestor || null,

  availableAccounts: Array.isArray(row?.availableAccounts)
    ? row.availableAccounts
    : [],

  investorBrokerId: row?.investorBrokerId || "",
  investorBrokerName: row?.investorBrokerName || "",

  accountAvailableBalance: row?.accountAvailableBalance ?? 0,
  accountTotalBalance: row?.accountTotalBalance ?? 0,
})),

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

    currentStep: clampStep(activeStep),

    uploadExcelState,

    selectedBillsCount: values?.billsToNegotiate?.length || 0,
    assignmentsCount: values?.investorAssignments?.length || 0,

    investorsExcelGenerated,
    canGenerateInvestorsExcel,
  },
});

const persistDraftStep = async (nextStep, extraMetadata = {}) => {
  const safeStep = clampStep(nextStep);

  const hasMinimumDraftData =
    values?.opId &&
    values?.opDate &&
    Array.isArray(values?.billsToNegotiate) &&
    values.billsToNegotiate.length > 0;

  if (!hasMinimumDraftData) return;

  const payload = buildDraftPayload();

  await saveDraft({
    ...payload,
    currentStep: safeStep,
    metadata: {
      ...(payload?.metadata || {}),
      ...extraMetadata,
      currentStep: safeStep,
      investorsExcelGenerated,
      canGenerateInvestorsExcel,
      uploadExcelState,
    },
  });
};

const handleBackStep = async () => {
  const previousStep = clampStep(activeStep - 1);

  setActiveStep(previousStep);
  await persistDraftStep(previousStep);
};

const handleNextStep = async () => {
  if (activeStep === 0) {
    if (selectedBillsCount < 5) return;

    setInvestorsExcelGenerated(false);
    setCanGenerateInvestorsExcel(false);
    setGenerateInvestorsExcelFn(null);

    const nextStep = 1;
    setActiveStep(nextStep);
    await persistDraftStep(nextStep, {
      investorsExcelGenerated: false,
      canGenerateInvestorsExcel: false,
    });

    return;
  }

  if (activeStep === 1) {
    if (!investorsExcelGenerated) return;

    const nextStep = 2;
    setActiveStep(nextStep);
    await persistDraftStep(nextStep, {
      investorsExcelGenerated: true,
      canGenerateInvestorsExcel,
    });

    return;
  }

  const nextStep = clampStep(activeStep + 1);
  setActiveStep(nextStep);
  await persistDraftStep(nextStep);
};
    const uploadContext = {
   opDate: safeDateToIso(values?.opDate),
  emitterId:
    values?.emitter?.value ||
    values?.emitter?.data?.id ||
    values?.emitterId ||
    "",
  emitterBrokerId:
    
    values?.emitterBroker ||
    values?.emitterBrokerId ||
    clientBrokerEmitter?.id ||
    "",
    emitterBrokerName:
  values?.emitterBrokerName ||
  getBrokerName(clientBrokerEmitter) ||
  "",
  payerId:
    clientPagador?.id ||
    values?.payerId ||
    values?.nombrePagador ||
    "",
  rows: (values?.investorAssignments || []).map((row) => ({
  billId: row?.billUniqueId || row?.billId || "",
  billFraction: Number(row?.fraction ?? 0),
  investorId: row?.investorId || "",
  investorAccount:
    row?.selectedAccount?.account_number ||
    row?.selectedAccount?.accountNumber ||
    row?.selectedAccount?.number ||
    "",
  emitterBrokerName:
    values?.emitterBrokerName ||
    getBrokerName(clientBrokerEmitter) ||
    row?.emitterBrokerName ||
    "",
})),
};


            const selectedBillsCount = values?.billsToNegotiate?.length || 0;
            const isHeaderLocked = activeStep >= 1;
            const isSuccessView =
              uploadExcelState?.status === "registered_success";

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
                ? investorsExcelGenerated
                : activeStep === 2
                ? excelLoadedAndValid
                : true;






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
  <Grid item xs={12} md={1} sx={{ minWidth: 80 }}>
    {isHeaderLocked ? (
      <HeaderReadOnlyField
        label="Numero Operación"
        value={values.opId}
        minWidth={80}
      />
    ) : (
      <TextField
        label="OpID *"
        fullWidth
        size="small"
        value={values.opId}
        name="opId"
        disabled={isHeaderLocked}
        onChange={(e) => setFieldValue("opId", e.target.value)}
        error={touched.opId && Boolean(errors.opId)}
        helperText={touched.opId && errors.opId ? errors.opId : " "}
      />
    )}
  </Grid>

  <Grid item xs={12} md={1.8} sx={{ minWidth: 140 }}>
    {isHeaderLocked ? (
      <HeaderReadOnlyField
        label="Fecha de Operación"
        value={
          values.opDate
            ? new Date(values.opDate).toLocaleDateString("es-CO")
            : ""
        }
        minWidth={140}
      />
    ) : (
      <DatePicker
        label="Fecha de Operación *"
        value={values.opDate}
        disabled={isHeaderLocked}
        onChange={(newValue) => setFieldValue("opDate", newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            helperText=" "
          />
        )}
      />
    )}
  </Grid>

  <Grid item xs={12} md={1.8} sx={{ minWidth: 150 }}>
    {isHeaderLocked ? (
      <HeaderReadOnlyField
        label="Tipo de Operación"
        value={
          typeOperation?.data?.find((opt) => opt.id === values.opType)
            ?.description || ""
        }
        minWidth={150}
      />
    ) : (
      <Autocomplete
        options={typeOperation?.data || []}
        getOptionLabel={(o) => o.description || ""}
        disabled={isHeaderLocked}
        value={
          typeOperation?.data?.find((opt) => opt.id === values.opType) || null
        }
        onChange={(e, newVal) => setFieldValue("opType", newVal?.id)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tipo Operación *"
            fullWidth
            size="small"
            helperText=" "
          />
        )}
      />
    )}
  </Grid>

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
            dataBills={dataBills}
          />
        </Box>
      </Box>
    )}
  </Grid>
  

<Grid
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
          onClick={async () => {
  const hasMinimumDraftData =
    values?.opId &&
    values?.opDate &&
    values?.billsToNegotiate?.length > 0;

  if (!hasMinimumDraftData) {
    toast.warning("Selecciona facturas antes de guardar el borrador.");
    return;
  }

  await persistDraftStep(activeStep);
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
>    {activeStep === 0 && (
                      <BillsDualTable
                        takedBills={values?.takedBills || []}
                        billsToNegotiate={values?.billsToNegotiate || []}
                        loading={isLoadingBills}
                        investorAssignments={values.investorAssignments}
                        nombrePagador={values?.nombrePagador}
                        emitterKey={
                          values?.emitter?.value || values?.emitterId || ""
                        }
                        setFieldValue={setFieldValue}
          onInvalidateNextSteps={() => {
  // No borres investorAssignments aquí.
  // InvestorsAssignmentTable se encargará de conservar las asignaciones existentes
  // y agregar filas nuevas si seleccionas más facturas/fracciones.
  setInvestorsExcelGenerated(false);
  setCanGenerateInvestorsExcel(false);
  setGenerateInvestorsExcelFn(null);
  resetUploadExcelState();
}}
                      />
                    )}

                    {activeStep === 1 && (
                      <>
                    

                   <InvestorsAssignmentTable
  billsToNegotiate={values?.billsToNegotiate || []}
  investorAssignments={values?.investorAssignments || []}
  investors={investors || []}
   onInvalidateUploadExcel={() => {
    resetUploadExcelState();
  }}
  cargarTasaDescuento={cargarTasaDescuento}
  getBillFractionBulkFetch={getBillFractionBulkFetch}
  cargarCuentas={fetchAccountsFromClient}
  cargarBrokerFromInvestor={cargarBrokerFromInvestor}
  setFieldValue={setFieldValue}
  opId={values?.opId}
  opDate={values?.opDate}
  emitter={values?.emitter}
  payerId={values?.nombrePagador}
  payerName={values?.nombrepayer}
  user={user}
  formik={values}
  investorsExcelGenerated={investorsExcelGenerated}
  setInvestorsExcelGenerated={setInvestorsExcelGenerated}
  onExcelReadyChange={setCanGenerateInvestorsExcel}
  exposeGenerateExcel={(fn) => setGenerateInvestorsExcelFn(() => fn)}
/>
                      </>
                    )}

                    {(activeStep === 2 || isSuccessView) && (
                      <UploadExcelStep
                        uploadExcelFetch={uploadExcelFetch}
                        setActiveStep={setActiveStep}
                        setUploadExcelState={setUploadExcelState}
                          downloadReceiptPdfFetch={downloadMassiveOperationReceiptPdfFetch}
                        setRegisterSummary={setRegisterSummary}
                        registerOperation={async (normalizedRows) => {
  const response = await registerOperationFromUploadFetch({
    rows: normalizedRows,
    opTypeId: values?.opType,
  });

  const data = response?.data ?? response ?? {};
  const opIdInfo = data?.opIdInfo;

  if (opIdInfo?.changed) {
    toast.warning(
      `El opId fue ajustado automáticamente de ${opIdInfo.requested} a ${opIdInfo.final}`
    );

    // Opcional: actualizar el valor visible en el formulario
    setFieldValue("opId", opIdInfo.final);
  } else if (opIdInfo?.final) {
    // Opcional: sincronizar por si acaso
    setFieldValue("opId", opIdInfo.final);
  }

  const summary = data?.summary ?? data?.data ?? data ?? {};

const finalOperationId =
  opIdInfo?.final ??
  summary?.operationId ??
  data?.operationId ??
  values?.opId ??
  null;

if (draftId && finalOperationId) {
  await markDraftRegisteredFetch({
    draftId,
    registeredOpId: finalOperationId,
  });
}
await persistDraftStep(3, {
  registeredOperationId: finalOperationId,
  registerSummary: {
    operationId: finalOperationId,
    totalOperacion:
      summary?.totalOperacion ?? summary?.total_amount ?? summary?.total ?? 0,
    facturasRegistradas:
      summary?.facturasRegistradas ??
      summary?.registered_rows ??
      normalizedRows?.length ??
      0,
    tasaPromedioPonderada:
      summary?.tasaPromedioPonderada ??
      summary?.weightedAverageRate ??
      summary?.weighted_average_rate ??
      0,
  },
});

setRegisterSummary({
  operationId: finalOperationId,
  totalOperacion:
    summary?.totalOperacion ?? summary?.total_amount ?? summary?.total ?? 0,
  facturasRegistradas:
    summary?.facturasRegistradas ??
    summary?.registered_rows ??
    normalizedRows?.length ??
    0,
  tasaPromedioPonderada:
    summary?.tasaPromedioPonderada ??
    summary?.weightedAverageRate ??
    summary?.weighted_average_rate ??
    0,
  raw: summary,
});

  return response;
}}
                        onNext={async () => {
  const nextStep = 3;
  setActiveStep(nextStep);

  await persistDraftStep(nextStep, {
    uploadExcelState,
    investorsExcelGenerated: true,
    canGenerateInvestorsExcel,
  });
}}
                        createdByLabel="Usuario Smart Evolution"
                        state={uploadExcelState}
                        setState={(nextState) => {
  setUploadExcelState((prev) => {
    const resolved =
      typeof nextState === "function" ? nextState(prev) : nextState;

    return {
      ...prev,
      ...resolved,
    };
  });
}}
                      uploadContext={uploadContext}
/>
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
  onClick={handleBackStep}
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
  onClick={() => generateInvestorsExcelFn?.()}
  disabled={!canGenerateInvestorsExcel}
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
    disabled={!canGoNext}
    sx={{
      bgcolor: canGoNext ? "#2C9A9A" : "#D0D0D0",
      color: "#fff",
      px: 4,
      "&:hover": {
        bgcolor: canGoNext ? "#258383" : "#D0D0D0",
      },
      "&.Mui-disabled": {
        bgcolor: "#D0D0D0",
        color: "#fff",
      },
    }}
    onClick={handleNextStep}
  >
    Siguiente
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