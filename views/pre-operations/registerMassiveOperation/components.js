import { useEffect, useMemo, useState, useContext } from "react";
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
import { ToastContainer } from "react-toastify";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Home as HomeIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";

import { Formik, Form } from "formik";

import authContext from "@context/authContext";
import smartLogo from "../../../public/assets/Logo Smart - Lite.svg";

import EmitterSelector from "@components/selects/registerMassiveOperations/EmitterSelector";
import PayerSelector from "@components/selects/registerMassiveOperations/PayerSelector";

import { BillsDualTable } from "./components/BillsDualTable";
import { InvestorsAssignmentTable } from "./components/InvestorsAssigmentTable";
import { UploadExcelStep } from "./components/uploadExcel";

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
import { useFetch } from "@hooks/useFetch";

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

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: "#444" }}>
            Creado por: {user?.name ?? "Desconocido"}
          </Typography>
        </Box>

        <Formik
          initialValues={{
            ...initialValues,
            billsToNegotiate: initialValues?.billsToNegotiate || [],
            investorAssignments: initialValues?.investorAssignments || [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleConfirm}
          enableReinitialize
        >
          {({ values, setFieldValue, touched, errors, setFieldTouched, submitForm }) => {

            const safeDateToIso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
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
        width: 300,
        flexShrink: 0,
        display: "flex",
        minHeight: 0,
      }}
    >
                    <Box
  sx={{
    bgcolor: "#F8F8F8",
    borderRadius: 2,
    boxShadow: 1,
    p: 2.5,
    width: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  }}
>
                      <Box sx={{ mb: 3 }}>
                        <Image
                          src={smartLogo}
                          alt="logo"
                          style={{
                            maxWidth: 180,
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
                          "& .MuiStep-root": {
  minHeight: 92,
},
                          "& .MuiStepLabel-root": {
                            alignItems: "flex-start",
                          },
                          "& .MuiStepLabel-labelContainer": {
                            mt: "1px",
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    lineHeight: 1.15,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "#7D7D7D",
                                      mb: 0.3,
                                    }}
                                  >
                                    Paso {index + 1}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      color: isCurrent
                                        ? "#111"
                                        : isDone
                                        ? "#666"
                                        : "#8D8D8D",
                                      mb: 0.3,
                                    }}
                                  >
                                    {s.title}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: isCurrent
                                        ? "#1A73C9"
                                        : isDone
                                        ? "#4E8D5D"
                                        : "#B4B4B4",
                                    }}
                                  >
                                    {status}
                                  </Typography>
                                </Box>
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

  <Grid item xs={12} md={3.5} sx={{ minWidth: 280 }}>
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
                        nombrePagador={values?.nombrePagador}
                        emitterKey={
                          values?.emitter?.value || values?.emitterId || ""
                        }
                        setFieldValue={setFieldValue}
                      />
                    )}

                    {activeStep === 1 && (
                      <>
                    

                   <InvestorsAssignmentTable
  billsToNegotiate={values?.billsToNegotiate || []}
  investorAssignments={values?.investorAssignments || []}
  investors={investors || []}
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

  setRegisterSummary({
    operationId:
      opIdInfo?.final ??
      summary?.operationId ??
      values?.opId ??
      null,
    totalOperacion:
      summary?.totalOperacion ??
      summary?.total_amount ??
      summary?.total ??
      0,
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
                        onNext={() => setActiveStep(3)}
                        createdByLabel="Usuario Smart Evolution"
                        state={uploadExcelState}
                        setState={setUploadExcelState}
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
    onClick={() => {
      if (activeStep === 0) {
        if (selectedBillsCount < 5) return;
        setInvestorsExcelGenerated(false);
        setCanGenerateInvestorsExcel(false);
        setGenerateInvestorsExcelFn(null);
        setActiveStep(1);
        return;
      }

      if (activeStep === 1) {
        if (!investorsExcelGenerated) return;
        setActiveStep(2);
        return;
      }
    }}
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