import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import AccountTypeSelect from "@components/selects/accountTypeSelect";
import AccountingAccountSelect1 from "@components/selects/accountingAccountSelect";
import AccountingAccountSelect from "@components/selects/accountingAccountSelect2";
import BankSelect from "@components/selects/bankSelect";
import ClientSelect1 from "@components/selects/customerSelect";
import ClientSelect from "@components/selects/customerSelect2";
import EgressSelect1 from "@components/selects/egressSelect";
import EgressSelect from "@components/selects/egressSelect2";
import OperationSelect from "@components/selects/negotiationSummaryOpSelect";
//Toastify
import { Toast } from "@components/toast";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import {
  CreateNegotiationSummary,
  DeleteDepositById,
  GetDepositsOnly,
  GetNegotiationSummary,
  GetPurchaseOrderPDF,
  GetSummaryByID,
  ModifyDepositQuery,
  ModifyNegotiationSummary,
} from "./queries";

import dayjs from "dayjs";
import moment from "moment/moment";

const steps = ["Primer paso", "Segundo paso", "Tercer paso"];

export const NegotiationSummary = ({
  formik,
  formik2,
  ToastContainer,
  PendingAccounts,
  handleDeletePendingAccount,
  option,
}) => {
  //Get ID from URL

  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetNegotiationSummary, init: false });

  const {
    fetch: fetchCreateSummary,
    loading: loadingCreateSummary,
    error: errorCreateSummary,
    data: dataCreateSummary,
  } = useFetch({ service: CreateNegotiationSummary, init: false });

  const {
    fetch: fetchModifySummary,
    loading: loadingModifySummary,
    error: errorModifySummary,
    data: dataModifySummary,
  } = useFetch({ service: ModifyNegotiationSummary, init: false });

  const {
    fetch: fetchPurchaseOrder,
    loading: loadingPurchaseOrder,
    error: errorPurchaseOrder,
    data: dataPurchaseOrder,
  } = useFetch({ service: GetPurchaseOrderPDF, init: false });

  const {
    fetch: fetchSummaryByID,
    loading: loadingSummaryByID,
    error: errorSummaryByID,
    data: dataSummaryByID,
  } = useFetch({ service: GetSummaryByID, init: false });

  const [id, setID] = useState("");
  const [OpID, setOpID] = useState("");
  const router = useRouter();
  const [NegotiationSummaryData, setNegotiationSummaryData] = useState({});
  const [billId, setBillId] = useState(null);
  const [manualAdjustment, setManualAdjustment] = useState(0);
  const [observations, setObservations] = useState("");
  const [deposit, setDeposit] = useState([]);

  useEffect(() => {
    if (router && router.query.id) {
      setID(router.query.id);
      if (option === "modify") {
        setOpID(router.query.opId);
      }
    }
  }, [router.query, option]);

  useEffect(() => {
    if (id) fetch(id);
  }, [id, PendingAccounts]);

  useEffect(() => {
    if (OpID) {
      fetchSummaryByID(OpID);
    }
  }, [OpID]);

  useEffect(() => {
    if (dataSummaryByID) {
      setObservations(dataSummaryByID?.data?.observations);
      setBillId(dataSummaryByID?.data?.billId.substring(3));
    }
  }, [dataSummaryByID]);

  useEffect(() => {
    if (data) {
      setDeposit(data?.data?.emitterDeposits);
      Toast("Resumen de negociación cargado con éxito", "success");
      setNegotiationSummaryData({
        opId: id,
        emitter: data?.data?.emitter?.name,
        emitterId: data?.data?.emitter?.document,
        payer: data?.data?.payer?.name,
        payerId: data?.data?.payer?.document,
        ...data?.data?.operation,
        billId: billId,
        date: today,
        total:
          data?.data?.operation?.valueToDiscount -
          data?.data?.operation?.investorDiscount -
          data?.data?.operation?.billValue -
          PendingAccounts.reduce((a, b) => a + b.amount, 0),
        pendingToDeposit:
          data?.data?.operation?.valueToDiscount -
          data?.data?.operation?.investorDiscount -
          data?.data?.operation?.billValue -
          PendingAccounts.reduce((a, b) => a + b.amount, 0) -
          (manualAdjustment || 0),
        pendingAccounts: PendingAccounts,
        observations: observations,
        totalDeposits: data?.data?.emitterDeposits?.reduce(
          (a, b) => a + b.amount,
          0
        ),
      });
    }

    if (error) {
      error.message == "El Cliente no posee perfil de riesgo"
        ? Toast(error.message, "error")
        : Toast("La operación no existe", "error");
    }
  }, [
    data,
    error,
    id,
    billId,
    manualAdjustment,
    observations,
    PendingAccounts,
  ]);

  const {
    fetch: fetchUpdateDeposit,
    loading: loadingUpdateDeposit,
    error: errorUpdateDeposit,
    data: dataUpdateDeposit,
  } = useFetch({ service: GetDepositsOnly, init: false });

  useEffect(() => {
    if (Object.keys(formik2.errors).length === 0 && formik2.isSubmitting) {
      fetchUpdateDeposit(id);
    }
  }, [formik2.errors, formik2.isSubmitting]);

  useEffect(() => {
    if (dataUpdateDeposit) {
      setDeposit(dataUpdateDeposit?.data);
    }
  }, [dataUpdateDeposit]);

  useEffect(() => {
    if (dataCreateSummary) {
      Toast("Resumen de negociación creado con éxito", "success");
      setTimeout(() => {
        router.push("/administration/negotiation-summary/summaryList");
      }, 2000);
    }

    if (errorCreateSummary) {
      typeof errorCreateSummary.message === "object"
        ? Toast(`${Object.values(errorCreateSummary.message)}`, "error")
        : Toast(`${errorCreateSummary.message}`, "error");
    }
  }, [dataCreateSummary, errorCreateSummary]);
  useEffect(() => {
    if (dataModifySummary) {
      Toast("Resumen de negociación creado con éxito", "success");
      setTimeout(() => {
        router.push("/administration/negotiation-summary/summaryList");
      }, 2000);
    }

    if (errorModifySummary) {
      typeof errorModifySummary.message === "object"
        ? Toast(`${Object.values(errorModifySummary.message)}`, "error")
        : Toast(`${errorModifySummary.message}`, "error");
    }
  }, [dataModifySummary, errorModifySummary]);

  useEffect(() => {
    if (
      formik.errors &&
      Object.keys(formik.errors).length === 0 &&
      formik.isSubmitting
    ) {
      //Close pending accounts modal
      handleClose();
    }
  }, [formik.errors, formik.isSubmitting]);

  useEffect(() => {
    if (
      formik2.errors &&
      Object.keys(formik2.errors).length === 0 &&
      formik2.isSubmitting
    ) {
      //Close pending accounts modal
      handleClose2();
    }
  }, [formik2.errors, formik2.isSubmitting]);

  //Get today's date

  const fns = require("date-fns");
  const today = fns.format(new Date(), "yyyy-MM-dd");

  const handleOpEntered = (e) => {
    if (e.target.value) {
      router.push(
        `/administration/negotiation-summary?${option}&id=${e.target.value}`
      );
    }
  };

  const [open, setOpen] = useState([false, null]);
  const handleOpen = (option) => {
    if (option === "add") {
      formik.resetForm();
      formik.setFieldValue("opId", Number(OpID));
      setOpen([true, null]);
    } else {
      setOpen([true, option]);
    }
  };
  const handleClose = () => {
    //Reset form
    setOpen([false, null]);
  };

  const [open2, setOpen2] = useState([false, null]);
  const handleOpen2 = (option) => {
    if (option === "add") {
      formik2.resetForm();
      formik2.setFieldValue("client", data?.data?.emitter?.id);
      formik2.setFieldValue("operation", data?.data?.operation?.id[0]);
      setOpen2([true, option]);
    } else {
      setOpen2([true, option]);
    }
  };

  const handleClose2 = () => {
    //Reset form
    setOpen2(false);
  };

  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => {
    setOpen3(true);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };

  const [open4, setOpen4] = useState([false, null]);
  const handleOpen4 = (item) => {
    setOpen4([true, item.id]);
  };
  const handleClose4 = () => {
    setOpen4([false, null]);
  };

  const [open5, setOpen5] = useState([false, null]);
  const handleOpen5 = (item) => {
    setOpen5([true, item.id]);
  };
  const handleClose5 = () => {
    setOpen5([false, null]);
  };

  const [valueD, setValue] = useState(dayjs());

  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleManualAdjustment = (value) => {
    setManualAdjustment(value);
  };

  const handleObservations = (e) => {
    setObservations(e.target.value);
  };

  const handlePurchaseOrderClick = (e) => {
    fetchPurchaseOrder(id);
    handleOpen3();
  };

  const handleEditDepositClick = (item) => {
    formik2.setFieldValue("id", item.id);
    formik2.setFieldValue("client", item.client);
    formik2.setFieldValue("account", item.accountingControls[0].account);
    formik2.setFieldValue("amount", item.amount);
    formik2.setFieldValue("date", item.date);
    formik2.setFieldValue(
      "observations",
      item.accountingControls[0].observations
    );
    formik2.setFieldValue("beneficiary", item.beneficiary);
    formik2.setFieldValue("bank", item.bank.id);
    formik2.setFieldValue("accountNumber", item.accountNumber);
    formik2.setFieldValue("accountType", item.accountType);
    formik2.setFieldValue("egressType", item.egressType);
    formik2.setFieldValue("operation", item.operation);
    formik2.setFieldValue("egressType", item.accountingControls[0].type);
    formik2.setFieldValue("modify", true);
    handleOpen2("edit");
  };

  const handleEditPendingClick = (item) => {
    formik.setFieldValue("id", item.id);
    formik.setFieldValue("description", item.description);
    formik.setFieldValue("amount", item.amount);
    formik.setFieldValue("date", item.date);
    formik.setFieldValue("third", item.third);
    formik.setFieldValue("accountingControl", item.accountingControl);
    formik.setFieldValue("typeExpenditure", item.typeExpenditure);
    formik.setFieldValue("modify", true);
    handleOpen("edit");
  };

  const handleDeleteDepositClick = (id) => {
    DeleteDepositById(id);
    setOpen4([false, null]);
    setTimeout(() => {
      setDeposit(deposit.filter((deposit) => deposit.id !== id));
    }, 1000);
  };

  const handleDeletePendingClick = (id) => {
    handleDeletePendingAccount(id);
    setOpen5([false, null]);
  };

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <BackButton path="/administration/negotiation-summary/summaryList" />

          <Button
            variant="standard"
            color="primary"
            size="large"
            onClick={() => {
              if (option === "modify") {
                NegotiationSummaryData.billId = "FV-".concat(billId);
                fetchModifySummary(NegotiationSummaryData, OpID);
              } else {
                NegotiationSummaryData.billId = "FV-".concat(billId);
                fetchCreateSummary(NegotiationSummaryData);
              }
            }}
            sx={{
              height: "2.6rem",
              backgroundColor: "#488B8F",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#5EA3A3",
              },
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="80%"
              fontWeight="bold"
              color="#FFFFFF"
            >
              {option === "modify" ? "MODIFICAR" : "GUARDAR"}
            </Typography>

            <i
              className="fa-regular fa-floppy-disk"
              style={{ color: "#FFFFFF", marginLeft: "0.5rem" }}
            ></i>
          </Button>
        </Box>
        <Box marginBottom={3}>
          <Typography
            letterSpacing={0}
            fontSize="1.7vw"
            fontWeight="regular"
            color="#488B8F"
          >
            Resumen de Negociación
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <Box display="flex" flexDirection="column">
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gap={2}
            width="90%"
          >
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>N° operación</InputTitles>
              <TextField
                id="opId"
                placeholder="# OP"
                variant="outlined"
                size="small"
                type="number"
                disabled={option === "modify" ? true : false}
                value={option === "modify" ? id : null}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleOpEntered(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                sx={{
                  color: "#333333",
                  width: "35%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    backgroundColor: "#F5F5F5",
                    "& fieldset": {
                      borderColor: "#5C9E9F",
                    },
                    "&:hover fieldset": {
                      borderColor: "#5C9E9F",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#5C9E9F",
                    },
                  },
                  "input::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
              />
            </Box>
            <TitleModal
              open={open[0]}
              handleClose={handleClose}
              containerSx={{
                width: "50%",
                height: "max-content",
              }}
              title={open[1] ? "Modificar descuento" : "Registrar descuento"}
            >
              <Box
                display="flex"
                flexDirection="column"
                mt={5}
                sx={{ ...scrollSx }}
                height="50vh"
              >
                <form onSubmit={formik.handleSubmit}>
                  <Box display="flex" flexDirection="column">
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                      justifyContent="center"
                    >
                      <Box width="17vw">
                        <InputTitles>Fecha</InputTitles>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            renderInput={(params) => (
                              <MuiTextField
                                id="date"
                                placeholder="Ingresa la fecha"
                                name="date"
                                type="date"
                                variant="standard"
                                margin="normal"
                                fullWidth
                                value={formik.values.date}
                                InputProps={{
                                  disableUnderline: true,
                                  sx: {
                                    marginTop: "-5px",
                                  },
                                }}
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.date &&
                                  Boolean(formik.errors.date)
                                }
                                sx={
                                  formik.touched.date &&
                                  Boolean(formik.errors.date)
                                    ? {
                                        border: "1.4px solid #E6643180",
                                      }
                                    : null
                                }
                              />
                            )}
                            components={{
                              OpenPickerIcon: () => (
                                <Box color="#5EA3A3" width={24} height={24}>
                                  <i className="far fa-xs fa-calendar-range" />
                                </Box>
                              ),
                            }}
                          />
                        </LocalizationProvider>
                        <HelperText>
                          {formik.touched.date && formik.errors.date}
                        </HelperText>
                      </Box>
                      <Box ml={5} width="17vw">
                        <InputTitles>No. Operación Asociada</InputTitles>
                        <MuiTextField
                          id="opId"
                          name="opId"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          value={id}
                          disabled
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                      justifyContent="center"
                    >
                      <Box width="calc(34vw + 2.5em)">
                        <InputTitles>Descripción</InputTitles>
                        <MuiTextField
                          id="description"
                          name="description"
                          type="text"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          value={formik.values.description}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.description &&
                            Boolean(formik.errors.description)
                          }
                          sx={
                            formik.touched.description &&
                            Boolean(formik.errors.description)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />

                        <HelperText>
                          {formik.touched.description &&
                            formik.errors.description}
                        </HelperText>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                      justifyContent="center"
                    >
                      <Box width="17vw">
                        <InputTitles mb={2}>Monto</InputTitles>
                        <BaseField
                          sx={{
                            width: "18vw",

                            backgroundColor: "#F5F5F5",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                          }}
                          id="amount"
                          name="amount"
                          isMasked
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={0}
                          allowNegative={false}
                          error={
                            formik.touched.amount &&
                            Boolean(formik.errors.amount)
                          }
                          value={formik.values.amount}
                          onChangeMasked={(values) => {
                            formik.setFieldValue("amount", values.floatValue);
                          }}
                        />
                        <HelperText>
                          {formik.touched.amount && formik.errors.amount}
                        </HelperText>
                      </Box>
                      <ClientSelect formik={formik} customer={"Cliente"} />
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                      justifyContent="center"
                    >
                      <Box position="relative">
                        <Box width="17vw">
                          <EgressSelect formik={formik} />
                        </Box>
                      </Box>
                      <Box ml={5} position="relative">
                        <Box width="17vw">
                          <AccountingAccountSelect formik={formik} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",

                      justifyContent: "center",
                    }}
                  >
                    <Box>
                      <MuiButton
                        type="submit"
                        onClick={formik.handleSubmit}
                        sx={{
                          mb: 2,
                          boxShadow: "none",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography fontSize="90%" fontWeight="bold">
                          {open[1] ? "Modificar" : "Registrar"}
                        </Typography>
                        <Typography
                          fontFamily="icomoon"
                          sx={{
                            color: "#fff",
                            ml: 2,
                            fontSize: "medium",
                          }}
                        >
                          &#xe91f;
                        </Typography>
                      </MuiButton>
                    </Box>
                  </Box>
                </form>
              </Box>
            </TitleModal>
            <TitleModal
              open={open2[0]}
              handleClose={handleClose2}
              containerSx={{
                width: "50%",
                height: "max-content",
              }}
              title={
                open2[1] ? "Modificar giro-emisor" : "Registrar giro-emisor"
              }
            >
              <Box
                display="flex"
                flexDirection="column"
                mt={5}
                sx={{ ...scrollSx }}
                height="50vh"
                alignItems="center"
              >
                <form onSubmit={formik2.handleSubmit}>
                  {activeStep === 0 && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        mb={6}
                        flexDirection="row"
                        position="relative"
                      >
                        <ClientSelect1 formik={formik2} customer={"Cliente"} />
                        <Box ml={5} width="17vw">
                          <InputTitles>Fecha</InputTitles>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              label="Date desktop"
                              inputFormat="MM/DD/YYYY"
                              value={valueD}
                              onChange={handleChange}
                              renderInput={(params) => (
                                <MuiTextField
                                  id="date"
                                  placeholder="Ingresa la fecha"
                                  name="date"
                                  type="date"
                                  variant="standard"
                                  margin="normal"
                                  fullWidth
                                  value={formik2.values.date}
                                  InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                      marginTop: "-5px",
                                    },
                                  }}
                                  onChange={formik2.handleChange}
                                  error={
                                    formik2.touched.date &&
                                    Boolean(formik2.errors.date)
                                  }
                                  sx={
                                    formik2.touched.date &&
                                    Boolean(formik2.errors.date)
                                      ? { border: "1.4px solid #E6643180" }
                                      : null
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>

                          <HelperText>
                            {formik2.touched.date && formik2.errors.date}
                          </HelperText>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Box width="17vw">
                          <InputTitles mb={1}>Monto operación</InputTitles>
                          <BaseField
                            sx={{
                              width: "17vw",
                              backgroundColor: "#F5F5F5",
                              "input::-webkit-outer-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                              "input::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                            }}
                            id="amount"
                            name="amount"
                            isMasked
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={0}
                            allowNegative={false}
                            error={
                              formik2.touched.amount &&
                              Boolean(formik2.errors.amount)
                            }
                            value={formik2.values.amount}
                            onChangeMasked={(values) => {
                              formik2.setFieldValue(
                                "amount",
                                values.floatValue
                              );
                            }}
                            placeholder="Ingresa monto de operación"
                          />

                          <HelperText>
                            {formik2.touched.amount && formik2.errors.amount}
                          </HelperText>
                        </Box>
                        <OperationSelect formik={formik2} ml={5} disabled />
                      </Box>
                    </Box>
                  )}
                  {activeStep === 1 && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        mb={6}
                        flexDirection="row"
                        position="relative"
                      >
                        <Box mb={4} width="17vw">
                          <InputTitles>Beneficiario</InputTitles>
                          <MuiTextField
                            id="beneficiary"
                            placeholder="Ingresa el beneficiario"
                            name="beneficiary"
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            value={formik2.values.beneficiary}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik2.handleChange}
                            error={
                              formik2.touched.beneficiary &&
                              Boolean(formik2.errors.beneficiary)
                            }
                            sx={
                              formik2.touched.beneficiary &&
                              Boolean(formik2.errors.beneficiary)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik2.touched.beneficiary &&
                              formik2.errors.beneficiary}
                          </HelperText>
                        </Box>
                        <Box ml={5} position="relative">
                          <Box width="17vw">
                            <BankSelect formik={formik2} />
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        mb={6}
                        flexDirection="row"
                        position="relative"
                      >
                        <Box mb={4} position="relative">
                          <Box width="17vw">
                            <AccountTypeSelect formik={formik2} />
                          </Box>
                        </Box>
                        <Box ml={5} width="17vw">
                          <InputTitles>Número de cuenta</InputTitles>
                          <MuiTextField
                            id="accountNumber"
                            placeholder="Ingresa el número de cuenta"
                            name="accountNumber"
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            value={formik2.values.accountNumber}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik2.handleChange}
                            error={
                              formik2.touched.accountNumber &&
                              Boolean(formik2.errors.accountNumber)
                            }
                            sx={
                              formik2.touched.accountNumber &&
                              Boolean(formik2.errors.accountNumber)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik2.touched.accountNumber &&
                              formik2.errors.accountNumber}
                          </HelperText>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {activeStep === 2 && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        mb={6}
                        flexDirection="row"
                        position="relative"
                      >
                        <Box mb={4} position="relative">
                          <Box width="17vw">
                            <EgressSelect1 formik={formik2} />
                          </Box>
                        </Box>
                        <Box ml={5} position="relative">
                          <Box width="17vw">
                            <AccountingAccountSelect1 formik={formik2} />
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" flexDirection="row">
                        <Box mb={4} width="calc(34vw + 3%)">
                          <InputTitles>Observaciones</InputTitles>
                          <MuiTextField
                            id="observations"
                            placeholder="Ingresa una observación"
                            name="observations"
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            value={formik2.values.observations}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik2.handleChange}
                            error={
                              formik2.touched.observations &&
                              Boolean(formik2.errors.observations)
                            }
                            sx={
                              formik2.touched.observations &&
                              Boolean(formik2.errors.observations)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik2.touched.observations &&
                              formik2.errors.observations}
                          </HelperText>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </form>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "calc(34vw + 4rem)",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <MuiButton
                      variant="standard"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{
                        mb: 2,
                        boxShadow: "none",
                        borderRadius: "4px",
                        "&:disabled": {
                          color: "#999999",
                          backgroundColor: "#CECECE",
                        },
                      }}
                    >
                      <Typography
                        fontFamily="icomoon"
                        sx={{
                          color: "#fff",
                          mr: 2,
                          fontSize: "medium",
                          transform: "rotate(180deg)",
                        }}
                      >
                        &#xe91f;
                      </Typography>
                      <Typography fontSize="90%" fontWeight="bold">
                        Atrás
                      </Typography>
                    </MuiButton>
                  </Box>
                  <Box flexGrow={1} />
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <MuiButton
                        type="submit"
                        onClick={formik2.handleSubmit}
                        sx={{
                          mb: 2,
                          boxShadow: "none",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography fontSize="90%" fontWeight="bold">
                          {open2[1] === "edit" ? "Modificar" : "Registrar"}
                        </Typography>
                        <Typography
                          fontFamily="icomoon"
                          sx={{
                            color: "#fff",
                            ml: 2,
                            fontSize: "medium",
                          }}
                        >
                          &#xe91f;
                        </Typography>
                      </MuiButton>
                    ) : (
                      <MuiButton
                        onClick={handleNext}
                        sx={{
                          mb: 2,
                          boxShadow: "none",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography
                          fontSize="90%"
                          fontWeight="bold"
                          color="#fff"
                        >
                          Siguiente
                        </Typography>

                        <Typography
                          fontFamily="icomoon"
                          sx={{
                            color: "#fff",
                            ml: 2,
                            fontSize: "medium",
                          }}
                        >
                          &#xe91f;
                        </Typography>
                      </MuiButton>
                    )}
                  </Box>
                </Box>
              </Box>
            </TitleModal>
            <TitleModal
              open={open3}
              handleClose={handleClose3}
              containerSx={{
                width: "50%",
                height: "max-content",
              }}
              title={"Reporte de compra"}
            >
              <Box
                display="flex"
                flexDirection="column"
                mt={5}
                sx={{ ...scrollSx }}
                height="50vh"
                alignItems="center"
              >
                {dataPurchaseOrder && dataPurchaseOrder?.pdf && (
                  <iframe
                    src={`data:application/pdf;base64,${dataPurchaseOrder?.pdf}`}
                    width="100%"
                    height="100%"
                  />
                )}
              </Box>
            </TitleModal>
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>Emisor</InputTitles>
              <CustomTooltip
                title={data?.data?.emitter?.name}
                arrow
                placement="bottom-start"
                TransitionComponent={Fade}
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="100%"
                  fontWeight="medium"
                  color="#333333"
                >
                  {data?.data?.emitter?.name?.length > 20
                    ? data?.data?.emitter?.name?.substring(0, 20) + "..."
                    : data?.data?.emitter?.name}
                </Typography>
              </CustomTooltip>
            </Box>
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>
                {data?.data?.emitter?.typeDocument}
              </InputTitles>
              <Typography
                letterSpacing={0}
                fontSize="100%"
                fontWeight="medium"
                color="#333333"
              >
                {data?.data?.emitter?.document}
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>Fecha</InputTitles>
              <Box borderRadius="4px">
                <InputTitles
                  sx={{
                    borderRadius: "4px",
                    border: "1.4px solid #63595C",
                    padding: "4px 8px",
                  }}
                >
                  {moment(data?.data?.operation?.opDate).format("DD/MM/YYYY")}
                </InputTitles>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>Título Negociado</InputTitles>
              <Typography
                letterSpacing={0}
                fontSize="100%"
                fontWeight="medium"
                color="#333333"
                noWrap
              >
                Facturas
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>Pagador</InputTitles>
              <CustomTooltip
                title={data?.data?.payer?.name}
                arrow
                placement="bottom-start"
                TransitionComponent={Fade}
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="100%"
                  fontWeight="medium"
                  color="#333333"
                >
                  {data?.data?.payer?.name?.length > 20
                    ? data?.data?.payer?.name?.substring(0, 20) + "..."
                    : data?.data?.payer?.name}
                </Typography>
              </CustomTooltip>
            </Box>
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>
                {data?.data?.payer?.typeDocument}
              </InputTitles>
              <Typography
                letterSpacing={0}
                fontSize="100%"
                fontWeight="medium"
                color="#333333"
              >
                {data?.data?.payer?.document}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" marginTop={6} width="90%">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>Valor Futuro</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.futureValue || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>% a descontar</InputTitles>
            <InputTitles
              marginBottom={3}
              sx={{
                color:
                  typeof data?.data?.operation?.payedPercent === "string"
                    ? "#488B8F"
                    : "#63595C",
                cursor:
                  typeof data?.data?.operation?.discountedDays === "string"
                    ? "pointer"
                    : null,
              }}
              onClick={
                typeof data?.data?.operation?.discountedDays === "string"
                  ? handlePurchaseOrderClick
                  : null
              }
            >
              {data?.data ? data?.data?.operation?.payedPercent : ""}
            </InputTitles>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>Valor a descontar</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.valueToDiscount || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>Tasa de descuento</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat value={data?.data?.operation?.discountTax || ""} /> %
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>DÍAS DESCONTADOS</InputTitles>
            <InputTitles
              marginBottom={3}
              sx={{
                color:
                  typeof data?.data?.operation?.discountedDays === "string"
                    ? "#488B8F"
                    : "#63595C",
                cursor:
                  typeof data?.data?.operation?.discountedDays === "string"
                    ? "pointer"
                    : null,
              }}
              onClick={
                typeof data?.data?.operation?.discountedDays === "string"
                  ? handlePurchaseOrderClick
                  : null
              }
            >
              {data?.data ? data?.data?.operation?.discountedDays : ""}
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>
              VALOR DESCUENTO SMART EVOLUTION
            </InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.SMDiscount || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>
              VALOR VENTA INVERSIONISTAS
            </InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.investorValue || ""}
              />
            </InputTitles>
          </Box>
          <Box width="100%">
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={3}
          >
            <InputTitles marginBottom={3}>
              DESCUENTO PRONTO PAGO PARA INVERSIONISTAS
            </InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.investorDiscount || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>
              VALOR COMISIÓN MESA ANTES DE IMPUESTOS
            </InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.commissionValueBeforeTaxes || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>
              COSTO OPERACIÓN (DESCUENTO PRONTO PAGO + COMISIÓN)
            </InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.operationValue || ""}
              />
            </InputTitles>
          </Box>
          <Box width="100%">
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={3}
          >
            <InputTitles marginBottom={3}>Comisión mesa</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.tableCommission || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>IVA</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.iva || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>Retención IVA</InputTitles>
            <InputTitles marginBottom={3}>
              {data?.data?.operation?.retIva === 0 ? (
                "0"
              ) : (
                <ValueFormat
                  prefix="$ "
                  value={data?.data?.operation?.retIva || ""}
                />
              )}
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>RETENCIÓN EN LA FUENTE</InputTitles>
            <InputTitles marginBottom={3}>
              <ValueFormat
                prefix="$ "
                value={data?.data?.operation?.retFte || ""}
              />
            </InputTitles>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <InputTitles marginBottom={3}>ICA</InputTitles>
            <InputTitles marginBottom={3}>
              {data?.data?.operation?.retIca === 0 ? (
                "0"
              ) : (
                <ValueFormat
                  prefix="$ "
                  value={data?.data?.operation?.retIca || ""}
                />
              )}
            </InputTitles>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <Box>
              <InputTitles marginBottom={10}>Valor Factura</InputTitles>
            </Box>
            <Box flexGrow={1} />
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="center"
              mb={10}
            >
              <TextField
                id="billId"
                variant="outlined"
                size="small"
                type="text"
                value={billId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InputTitles>FV -</InputTitles>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setBillId(e.target.value);
                }}
                sx={{
                  color: "#333333",
                  width: "40%",

                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#63595c",
                    letterSpacing: "0px",
                    textTransform: "uppercase",
                    "& fieldset": {
                      borderColor: "#63595C",
                    },
                    "&:hover fieldset": {
                      borderColor: "#63595C",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#63595C",
                    },
                  },
                }}
              />
              <InputTitles ml={2}>
                <ValueFormat
                  prefix="$ "
                  value={data?.data?.operation?.billValue || ""}
                />
              </InputTitles>
            </Box>
          </Box>
          <Box width="100%">
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={5}
            mb={5}
          >
            <InputTitles sx={{ color: "#488B8F" }}>
              DETALLE DE SALDOS PENDIENTES,<br></br>COMPENSACIONES Y DESCUENTOS
            </InputTitles>
            <Box display="flex" flexDirection="row">
              <Button
                onClick={() => handleOpen("add")}
                variant="standard"
                startIcon={<i className="far fa-circle-plus" />}
                disabled={data?.data ? false : true}
                sx={{
                  color: "#5EA3A3",
                  backgroundColor: "#5EA3A31A",
                  borderRadius: "4px",
                  width: "14vw",
                  boxShadow: "none",
                  textTransform: "none",
                  fontWeight: "600",
                  "& .MuiButton-startIcon i": {
                    fontSize: "16px",
                  },
                }}
              >
                Agregar nuevo
              </Button>
            </Box>
          </Box>
          {PendingAccounts.length > 0 ? (
            <Box display="flex" flexDirection="column" width="100%" mb={5}>
              <Box display="flex" flexDirection="row" width="100%">
                <InputTitles width="60%">Descripción</InputTitles>
                <InputTitles width="20%">Fecha</InputTitles>
                <InputTitles width="20%">Monto</InputTitles>
              </Box>
              {PendingAccounts.map((item, index) => (
                <Box display="flex" flexDirection="row" mt={3} key={index}>
                  <CustomTooltip
                    title={item.description}
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="100%"
                      fontWeight="medium"
                      color="#333333"
                      width="60%"
                    >
                      {item.description.length > 50
                        ? item.description.substring(0, 50) + "..."
                        : item.description}
                    </Typography>
                  </CustomTooltip>
                  <Typography
                    letterSpacing={0}
                    fontSize="100%"
                    fontWeight="medium"
                    color="#333333"
                    width="15%"
                  >
                    {moment(item.date).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="100%"
                    fontWeight="medium"
                    color="#333333"
                    width="15%"
                  >
                    <ValueFormat prefix="$ " value={item.amount} />
                  </Typography>
                  <IconButton
                    sx={{ color: "#5EA3A3" }}
                    onClick={() => handleEditPendingClick(item)}
                  >
                    <i className="far fa-pen-to-square" />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#5EA3A3" }}
                    onClick={() => handleOpen5(item)}
                  >
                    <i className="far fa-trash" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : null}
          <Box width="100%">
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={5}
            mb={5}
          >
            <InputTitles sx={{ color: "#488B8F" }}>
              CONSIGNACIONES DE LA <br></br>OPERACIÓN
            </InputTitles>
            <Box display="flex" flexDirection="row">
              <Button
                onClick={() => handleOpen2("add")}
                variant="standard"
                startIcon={<i className="far fa-circle-plus" />}
                disabled={data?.data ? false : true}
                sx={{
                  color: "#5EA3A3",
                  backgroundColor: "#5EA3A31A",
                  borderRadius: "4px",
                  width: "14vw",
                  boxShadow: "none",
                  textTransform: "none",
                  fontWeight: "600",
                  "& .MuiButton-startIcon i": {
                    fontSize: "16px",
                  },
                }}
              >
                Agregar nuevo
              </Button>
            </Box>
          </Box>
          {deposit?.length > 0 ? (
            <Box display="flex" flexDirection="column" width="100%" mb={5}>
              <Box display="flex" flexDirection="row" width="100%">
                <InputTitles width="30%">Beneficiario</InputTitles>
                <InputTitles width="30%">Cuenta Bancaria</InputTitles>
                <InputTitles width="15%">Fecha</InputTitles>
                <InputTitles width="15%">Monto</InputTitles>
              </Box>
              {deposit?.map((item, index) => (
                <Box display="flex" flexDirection="row" mt={3} key={index}>
                  <CustomTooltip
                    title={item.beneficiary}
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="100%"
                      fontWeight="medium"
                      color="#333333"
                      width="30%"
                    >
                      {item.beneficiary.length > 30
                        ? item.beneficiary.substring(0, 30) + "..."
                        : item.beneficiary}
                    </Typography>
                  </CustomTooltip>
                  <CustomTooltip
                    title={`${item.accountNumber} - ${item.bank.description}`}
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="100%"
                      fontWeight="medium"
                      color="#333333"
                      width="30%"
                    >
                      {item.accountNumber.length +
                        item.bank.description.length >
                      30
                        ? item.accountNumber
                            .concat(" - ", item.bank.description)
                            .substring(0, 30) + "..."
                        : item.accountNumber.concat(
                            " - ",
                            item.bank.description
                          )}
                    </Typography>
                  </CustomTooltip>
                  <Typography
                    letterSpacing={0}
                    fontSize="100%"
                    fontWeight="medium"
                    color="#333333"
                    width="15%"
                  >
                    {moment(item.date).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="100%"
                    fontWeight="medium"
                    color="#333333"
                    width="15%"
                  >
                    <ValueFormat prefix="$ " value={item.amount} />
                  </Typography>
                  <IconButton
                    sx={{ color: "#5EA3A3" }}
                    onClick={() => handleEditDepositClick(item)}
                  >
                    <i className="far fa-pen-to-square" />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#5EA3A3" }}
                    onClick={() => handleOpen4(item)}
                  >
                    <i className="far fa-trash" />
                  </IconButton>
                </Box>
              ))}
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                width="89%"
                mt={3}
              >
                <InputTitles>Total Consignaciones</InputTitles>
                <InputTitles sx={{ fontSize: "16px" }}>
                  <ValueFormat
                    prefix="$ "
                    value={
                      deposit?.reduce(
                        (acc, item) => acc + parseFloat(item.amount),
                        0
                      ) || 0
                    }
                  />
                </InputTitles>
              </Box>
            </Box>
          ) : null}

          <Box width="100%">
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            mt={7}
            mb={5}
            border="1.4px solid #63595C"
            borderRadius="4px"
            p={2}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box display="flex" flexDirection="column" width="32%">
                <InputTitles>Total de descuentos</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="100%"
                  fontWeight="medium"
                  color="#57575780"
                  mt={2}
                  border="1.4px solid #5EA3A380"
                  borderRadius="4px"
                  p="6px"
                  bgcolor="#EFEFEF"
                >
                  {PendingAccounts.length > 0 ? (
                    <ValueFormat
                      prefix="$ "
                      value={PendingAccounts.reduce((a, b) => a + b.amount, 0)}
                    />
                  ) : (
                    <ValueFormat prefix="$ " value={0} />
                  )}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" width="32%">
                <InputTitles>Ajuste manual</InputTitles>
                <BaseField
                  sx={{
                    width: "100%",
                    mt: 2,
                    backgroundColor: "#F5F5F5",
                    "input::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "input::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                  id="amount"
                  name="amount"
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  value={manualAdjustment}
                  onChangeMasked={(values) => {
                    handleManualAdjustment(values.floatValue);
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column" width="32%">
                <InputTitles>Monto + Ajuste</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="100%"
                  fontWeight="medium"
                  color="#57575780"
                  mt={2}
                  border="1.4px solid #5EA3A380"
                  borderRadius="4px"
                  p="6px"
                  bgcolor="#EFEFEF"
                >
                  {PendingAccounts.length > 0 ? (
                    <ValueFormat
                      prefix="$ "
                      value={
                        PendingAccounts.reduce((a, b) => a + b.amount, 0) +
                        (manualAdjustment || 0)
                      }
                    />
                  ) : (
                    <ValueFormat prefix="$ " value={0} />
                  )}
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mt={3}
            >
              <InputTitles>Total a desembolsar</InputTitles>
              <InputTitles sx={{ fontSize: "16px" }}>
                <ValueFormat
                  prefix="$ "
                  value={NegotiationSummaryData?.total}
                />
              </InputTitles>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mt={3}
            >
              <InputTitles>Pendiente a desembolsar</InputTitles>
              <InputTitles sx={{ fontSize: "16px" }}>
                <ValueFormat
                  prefix="$ "
                  value={
                    NegotiationSummaryData?.pendingToDeposit -
                    deposit?.reduce(
                      (acc, item) => acc + parseFloat(item.amount),
                      0
                    )
                  }
                />
              </InputTitles>
            </Box>
          </Box>
          <InputTitles>Observaciones</InputTitles>
          <TextField
            sx={{
              width: "100%",
              mt: 2,
              mb: 2,
              backgroundColor: "#F5F5F5",

              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                backgroundColor: "#F5F5F5",
                "& fieldset": {
                  borderColor: "#5C9E9F",
                },
                "&:hover fieldset": {
                  borderColor: "#5C9E9F",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5C9E9F",
                },
              },
            }}
            id="observationsSummary"
            name="observationsSummary"
            value={observations}
            onChange={handleObservations}
          />
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal open={open4[0]} handleClose={handleClose4}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
          >
            ¿Estás seguro que deseas este giro
          </Typography>

          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
            mt={2}
          >
            de los giros-emisor?
          </Typography>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleClose4}>Volver</GreenButtonModal>
            <RedButtonModal
              sx={{
                ml: 2,
              }}
              onClick={() => handleDeleteDepositClick(open4[1])}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>
      <Modal open={open5[0]} handleClose={handleClose5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
          >
            ¿Estás seguro que deseas
          </Typography>

          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
            mt={2}
          >
            este descuento?
          </Typography>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleClose5}>Volver</GreenButtonModal>
            <RedButtonModal
              sx={{
                ml: 2,
              }}
              onClick={() => handleDeletePendingClick(open5[1])}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>
    </>
  );
};