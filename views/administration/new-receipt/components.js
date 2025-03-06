import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AccountSelect from "@components/selects/accountSelect";
import BillsByOperationSelect from "@components/selects/billByOperationSelect";
import ClientSelect from "@components/selects/customerSelect";
import OperationSelect from "@components/selects/operationBySelect";
import ReceiptStatusSelect from "@components/selects/receiptStatusSelect";
import TypeReceiptSelect from "@components/selects/typeReceiptSelect";
import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import dayjs from "dayjs";

import { Dialog,DialogContent, CircularProgress} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
const aSx = {
  border: "1.4px solid #E6643180",
  marginTop: "0px",
  marginLeft: "3rem",
  width: "17vw",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

const bSx = {
  border: "1.4px solid #5EA3A3",
  marginTop: "0px",
  width: "17vw",
  marginLeft: "3rem",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

const cSx = {
  border: "1.4px solid #E6643180",
  marginTop: "0px",
  marginLeft: "3rem",
  width: "17vw",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

const dSx = {
  border: "1.4px solid #5EA3A3",
  marginTop: "0px",
  width: "17vw",
  marginLeft: "0.2rem",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

export const ReceiptC = ({ formik, data, pendingAmount, presentValueInvestor,loading,success,isModalOpen }) => {
  
  const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));
  const [valueDate, setValueDate] = useState(dayjs("2014-08-18T21:11:54"));
 

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (newValue) => {
    setValueDate(newValue);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ ...scrollSx, flexFlow: "column nowrap" }}
      >
        <form onSubmit={formik.onSubmit}>
          <BackButton path="/administration/new-receipt/receiptList" />
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography
              letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="3%"
              color="#5EA3A3"
            >
              Registrar Recaudo
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box ml={0} mb={2} width="17vw">
                <InputTitles>Fecha Aplicación</InputTitles>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="DD/MM/YYYY"
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
                        value={formik.values.date}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            marginTop: "-5px",
                          },
                        }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.date && Boolean(formik.errors.date)
                        }
                        sx={
                          formik.touched.date && Boolean(formik.errors.date)
                            ? { border: "1.4px solid #E6643180" }
                            : null
                        }
                      />
                    )}
                  />
                </LocalizationProvider>

                <HelperText>
                  {formik.touched.date && formik.errors.date}
                </HelperText>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "-1rem",
                }}
              >
                <InputTitles marginBottom={2} marginLeft={6}>
                  Dias Reales
                </InputTitles>
                <MuiTextField
                  id="realDays"
                  placeholder=""
                  name="realDays"
                  type="number"
                  variant="standard"
                  margin="normal"
                  value={formik.values.realDays}
                  disabled={true}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.realDays && Boolean(formik.errors.realDays)
                  }
                  sx={
                    formik.touched.realDays && Boolean(formik.errors.realDays)
                      ? aSx
                      : bSx
                  }
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              marginBottom={2}
            >
              <TypeReceiptSelect formik={formik} disabled={true} />
              <ReceiptStatusSelect
                formik={formik}
                disabled={false}
                ml={"3rem"}
              />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <ClientSelect
                formik={formik}
                disabled={true}
                customer={"inversionista"}
              />
              <AccountSelect
                formik={formik}
                disabled={true}
                marginLeft={"3rem"}
              />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={0.5}>
                  Monto Aplicación
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "0.1rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                    },
                  }}
                  id="payedAmount"
                  placeholder=""
                  name="payedAmount"
                  isMasked
                  value={formik.values.payedAmount}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  error={
                    formik.touched.payedAmount &&
                    Boolean(formik.errors.payedAmount)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue("payedAmount", values.floatValue);
                  }}
                />
              </Box>
              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={3.5}>
                  Remanente
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "1.7rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                      marginLeft: "1.7rem",
                    },
                  }}
                  id="remaining"
                  placeholder="Remanente"
                  name="remaining"
                  isMasked
                  value={formik.values.remaining}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.remaining && Boolean(formik.errors.remaining)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue("remaining", values.floatValue);
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={0.5}>
                  Pendiente Por Cobrar
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "0.1rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                    },
                  }}
                  id="pendingAmount"
                  placeholder=""
                  name="pendingAmount"
                  isMasked
                  value={pendingAmount}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.pendingAmount &&
                    Boolean(formik.errors.pendingAmount)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue("pendingAmount", values.floatValue);
                  }}
                />
              </Box>
                            <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={3.5}>
                  valor presente inversionista
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "1.7rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                      marginLeft: "1.7rem",
                    },
                  }}
                  id="presentValueInvestor"
                  placeholder=""
                  name="presentValueInvestor"
                  isMasked
                  value={presentValueInvestor}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.pendingAmount &&
                    Boolean(formik.errors.pendingAmount)
                  }
                  onChangeMasked={(values) => {
                    console.log(values,'values')
                    formik.setFieldValue("pendingAmount", values.floatValue);
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={0.5}>
                  Dias Calculo
                </InputTitles>
                <MuiTextField
                  id="calculatedDays"
                  placeholder=""
                  name="calculatedDays"
                  type="number"
                  variant="standard"
                  margin="normal"
                  value={formik.values.calculatedDays}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.calculatedDays &&
                    Boolean(formik.errors.calculatedDays)
                  }
                  sx={
                    formik.touched.calculatedDays &&
                    Boolean(formik.errors.calculatedDays)
                      ? cSx
                      : dSx
                  }
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginTop={3} marginBottom={2}>
                  Valor Futuro Recalculado
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "0.1rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                    },
                  }}
                  id="futureValueRecalculation"
                  placeholder=""
                  name="futureValueRecalculation"
                  isMasked
                  value={formik.values.futureValueRecalculation}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.futureValueRecalculation &&
                    Boolean(formik.errors.futureValueRecalculation)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      "futureValueRecalculation",
                      values.floatValue
                    );
                  }}
                />
              </Box>

              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={3.5}>
                  Remanente Mesa
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "1.7rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                      marginLeft: "1.7rem",
                    },
                  }}
                  id="tableRemaining"
                  placeholder=""
                  name="tableRemaining"
                  isMasked
                  value={formik.values.tableRemaining}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.tableRemaining &&
                    Boolean(formik.errors.tableRemaining)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue("tableRemaining", values.floatValue);
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginTop={2} marginBottom={4}>
                  Intereses Adicionales
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    width: "18.2vw",
                    marginLeft: "0.1rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                    },
                  }}
                  id="additionalInterests"
                  placeholder=""
                  name="additionalInterests"
                  isMasked
                  value={formik.values.additionalInterests}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.additionalInterests &&
                    Boolean(formik.errors.additionalInterests)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      "additionalInterests",
                      values.floatValue
                    );
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "1.5rem",
                }}
              >
                <InputTitles marginBottom={2} marginLeft={3.5}>
                  Dias Adicionales
                </InputTitles>
                <MuiTextField
                  id="additionalDays"
                  placeholder=""
                  name="additionalDays"
                  type="number"
                  variant="standard"
                  margin="normal"
                  value={formik.values.additionalDays}
                  disabled={true}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.additionalDays &&
                    Boolean(formik.errors.additionalDays)
                  }
                  sx={
                    formik.touched.additionalDays &&
                    Boolean(formik.errors.additionalDays)
                      ? { ...aSx, marginTop: "6px" }
                      : { ...bSx, marginTop: "6px", marginLeft: "1.7rem" }
                  }
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
                <InputTitles marginTop={3} marginBottom={2} marginLeft={0.3}>
                  Intereses Adicionales SM
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "0.1rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                    },
                  }}
                  id="additionalInterestsSM"
                  placeholder=""
                  name="additionalInterestsSM"
                  isMasked
                  value={formik.values.additionalInterestsSM}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.additionalInterestsSM &&
                    Boolean(formik.errors.additionalInterestsSM)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      "additionalInterestsSM",
                      values.floatValue
                    );
                  }}
                />
              </Box>

              <Box>
                <InputTitles marginBottom={2} marginTop={3} marginLeft={3.5}>
                  Intereses Adicionales inv
                </InputTitles>
                <BaseField
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                    startAdornment: (
                      <i
                        style={{
                          color: "#5EA3A3",
                          marginRight: "0.7vw",
                          fontSize: "1.1vw",
                        }}
                        className="far fa-dollar-sign"
                      ></i>
                    ),
                  }}
                  sx={{
                    marginTop: "6px",
                    width: "18.2vw",
                    marginLeft: "1.7rem",
                    "@media (max-height: 900px)": {
                      width: "18.5vw",
                      marginLeft: "1.7rem",
                    },
                  }}
                  id="investorInterests"
                  placeholder=""
                  name="investorInterests"
                  isMasked
                  value={formik.values.investorInterests}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  disabled={true}
                  error={
                    formik.touched.investorInterests &&
                    Boolean(formik.errors.investorInterests)
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      "investorInterests",
                      values.floatValue
                    );
                  }}
                />
              </Box>
            </Box>
            {formik.values.lastDate && (
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box mr={2} mt={4} width="17vw">
                    <InputTitles>Fecha Último Recaudo</InputTitles>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Date desktop"
                        inputFormat="DD/MM/YYYY"
                        value={valueDate}
                        onChange={handleChange2}
                        renderInput={(params) => (
                          <MuiTextField
                            id="lastDate"
                            placeholder="Ingresa la fecha"
                            name="lastDate"
                            type="date"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled
                            value={formik.values.lastDate}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.lastDate &&
                              Boolean(formik.errors.lastDate)
                            }
                            sx={
                              formik.touched.lastDate &&
                              Boolean(formik.errors.lastDate)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={2}
                >
                  <Box>
                    <InputTitles
                      marginTop={3}
                      marginBottom={2}
                      marginLeft={0.3}
                    >
                      Monto Recaudos Previos
                    </InputTitles>
                    <BaseField
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                        startAdornment: (
                          <i
                            style={{
                              color: "#5EA3A3",
                              marginRight: "0.7vw",
                              fontSize: "1.1vw",
                            }}
                            className="far fa-dollar-sign"
                          ></i>
                        ),
                      }}
                      sx={{
                        marginTop: "6px",
                        width: "18.2vw",
                        marginLeft: "0.1rem",
                        "@media (max-height: 900px)": {
                          width: "18.5vw",
                        },
                      }}
                      id="previousPayedAmount"
                      placeholder=""
                      name="previousPayedAmount"
                      isMasked
                      value={formik.values.previousPayedAmount}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={0}
                      allowNegative={false}
                      disabled={true}
                      error={
                        formik.touched.previousPayedAmount &&
                        Boolean(formik.errors.previousPayedAmount)
                      }
                      onChangeMasked={(values) => {
                        formik.setFieldValue(
                          "previousPayedAmount",
                          values.floatValue
                        );
                      }}
                    />
                  </Box>

                  <Box>
                    <InputTitles
                      marginBottom={2}
                      marginTop={3}
                      marginLeft={3.5}
                    >
                      Intereses
                    </InputTitles>
                    <BaseField
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                        startAdornment: (
                          <i
                            style={{
                              color: "#5EA3A3",
                              marginRight: "0.7vw",
                              fontSize: "1.1vw",
                            }}
                            className="far fa-dollar-sign"
                          ></i>
                        ),
                      }}
                      sx={{
                        marginTop: "6px",
                        width: "18.2vw",
                        marginLeft: "1.7rem",
                        "@media (max-height: 900px)": {
                          width: "18.5vw",
                          marginLeft: "1.7rem",
                        },
                      }}
                      id="interest"
                      placeholder=""
                      name="interest"
                      isMasked
                      value={formik.values.interest}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={0}
                      allowNegative={false}
                      disabled={true}
                      error={
                        formik.touched.interest &&
                        Boolean(formik.errors.interest)
                      }
                      onChangeMasked={(values) => {
                        formik.setFieldValue("interest", values.floatValue);
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}

            {data?.previousOperationBill && (
              <>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box mr={2} mt={4} width="17vw">
                    <InputTitles>Fecha Radicación</InputTitles>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Date desktop"
                        inputFormat="DD/MM/YYYY"
                        value={formik.values.previousOpDate}
                        onChange={handleChange2}
                        renderInput={(params) => (
                          <MuiTextField
                            id="previousOpDate"
                            placeholder="Ingresa la fecha"
                            name="previousOpDate"
                            type="date"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled
                            value={formik.values.previousOpDate}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.lastDate &&
                              Boolean(formik.errors.lastDate)
                            }
                            sx={
                              formik.touched.lastDate &&
                              Boolean(formik.errors.lastDate)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={2}
                >
                  <Box>
                    <InputTitles
                      marginTop={3}
                      marginBottom={2}
                      marginLeft={0.3}
                    >
                      Tasa Descuento
                    </InputTitles>
                    <BaseField
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                        endAdornment: (
                          <i
                            style={{
                              color: "#5EA3A3",
                            }}
                            className="fa-light fa-percent"
                          ></i>
                        ),
                      }}
                      sx={{
                        marginTop: "6px",
                        width: "18.2vw",
                        marginLeft: "0.1rem",
                        "@media (max-height: 900px)": {
                          width: "18.5vw",
                        },
                      }}
                      id="previousDiscountTax"
                      placeholder=""
                      name="previousDiscountTax"
                      isMasked
                      value={formik.values.previousDiscountTax}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      allowNegative={false}
                      disabled={true}
                      onChangeMasked={(values) => {
                        formik.setFieldValue(
                          "previousDiscountTax",
                          values.floatValue
                        );
                      }}
                    />
                  </Box>

                  <Box>
                    <InputTitles
                      marginBottom={2}
                      marginTop={3}
                      marginLeft={3.5}
                    >
                      Nro Operacion
                    </InputTitles>
                    <BaseField
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                      }}
                      sx={{
                        marginTop: "6px",
                        width: "18.2vw",
                        marginLeft: "1.7rem",
                        "@media (max-height: 900px)": {
                          width: "18.5vw",
                          marginLeft: "1.7rem",
                        },
                      }}
                      id="previousOpNumber"
                      placeholder=""
                      name="previousOpNumber"
                      isMasked
                      value={formik.values.previousOpNumber}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={0}
                      allowNegative={false}
                      disabled={true}
                      error={
                        formik.touched.previousOpNumber &&
                        Boolean(formik.errors.previousOpNumber)
                      }
                      onChangeMasked={(values) => {
                        formik.setFieldValue(
                          "previousOpNumber",
                          values.floatValue
                        );
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "calc(34vw + 4rem)",
                justifyContent: "flex-end",
              }}
            ></Box>
            <MuiButton
      type="submit"
      variant="contained"
      onClick={formik.handleSubmit}
      disabled={formik.isSubmitting || loading} // Deshabilita el botón correctamente
      sx={{
        mb: 2,
        boxShadow: "none",
        borderRadius: "4px",
        position: "absolute",
        bottom: "10%",
        right: "10%",
      }}
    >
      <Typography fontSize="90%" fontWeight="bold">Registrar</Typography>
      <Typography
        fontFamily="icomoon"
        sx={{ color: "#fff", ml: 2, fontSize: "medium" }}
      >
        &#xe91f;
      </Typography>
    </MuiButton>

    {/* MODAL DE PROCESO */}
    <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
      <DialogContent>
        {success === null ? (
          <>
            <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
            <Typography variant="h6">Procesando...</Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
            <Typography variant="h5" color="success.main">¡Registro Exitoso!</Typography>
          </>
        ) : (
          <>
            <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
            <Typography variant="h5" color="error.main">Error al Registrar</Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
          </Box>
        </form>
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
    </>
  );
};