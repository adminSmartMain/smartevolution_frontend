import { useState } from "react";

import { useRouter } from "next/router";

import { Box, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Header from "@components/header";
import AccountTypeSelect from "@components/selects/accountTypeSelect";
import AccountingAccountSelect from "@components/selects/accountingAccountSelect";
import BankSelect from "@components/selects/bankSelect";
import ClientSelect from "@components/selects/customerSelect";
import EgressSelect from "@components/selects/egressSelect";
import OperationSelect from "@components/selects/operationBySelect";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import dayjs from "dayjs";

const steps = ["Primer paso", "Segundo paso", "Tercer paso"];

export const Deposit = ({ formik, option, ToastContainer }) => {
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

  const router = useRouter();

  return (
    <>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <form onSubmit={formik.handleSubmit}>
          <BackButton path="/administration/deposit-emitter/depositList" />
          {activeStep === 0 && (
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                {option === "register" && "Registrar giro-emisor"}
                {option === "modify" && "Modificar giro-emisor"}
                {option === "preview" && "Visualización de giro-emisor"}
              </Typography>

              <Box Box mb={4} width="17vw">
                <InputTitles>Id DEPOSITO</InputTitles>
                <MuiTextField
                  id="edId"
                  placeholder="Ingresa el ID del depósito"
                  name="edId"
                  type="text"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled={option === "preview"}
                  value={formik.values.edId}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.edId && Boolean(formik.errors.edId)}
                  sx={
                    formik.touched.edId && Boolean(formik.errors.edId)
                      ? { border: "1.4px solid #E6643180" }
                      : null
                  }
                />
              </Box>
              <Box
                display="flex"
                mb={6}
                flexDirection="row"
                position="relative"
              >
                <ClientSelect
                  formik={formik}
                  customer={"Cliente"}
                  disabled={option === "preview"}
                />
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
                          disabled={option === "preview"}
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
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box width="17vw">
                  <InputTitles>Monto operación</InputTitles>
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
                    disabled={option === "preview"}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={0}
                    allowNegative={false}
                    error={
                      formik.touched.amount && Boolean(formik.errors.amount)
                    }
                    value={formik.values.amount}
                    onChangeMasked={(values) => {
                      formik.setFieldValue("amount", values.floatValue || null);
                    }}
                    placeholder="Ingresa monto de operación"
                  />

                  <HelperText>
                    {formik.touched.amount && formik.errors.amount}
                  </HelperText>
                </Box>
                <OperationSelect
                  ml={5}
                  formik={formik}
                  disabled={option === "preview" || option === "modify"}
                />
              </Box>
            </Box>
          )}
          {activeStep === 1 && (
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                {option === "register" && "Registro de giro-emisor"}
                {option === "modify" && "Modificación de giro-emisor"}
                {option === "preview" && "Visualización de giro-emisor"}
              </Typography>

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
                    disabled={option === "preview"}
                    value={formik.values.beneficiary}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.beneficiary &&
                      Boolean(formik.errors.beneficiary)
                    }
                    sx={
                      formik.touched.beneficiary &&
                      Boolean(formik.errors.beneficiary)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText>
                    {formik.touched.beneficiary && formik.errors.beneficiary}
                  </HelperText>
                </Box>
                <Box ml={5} position="relative">
                  <Box width="17vw">
                    <BankSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
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
                    <AccountTypeSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
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
                    disabled={option === "preview"}
                    value={formik.values.accountNumber}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.accountNumber &&
                      Boolean(formik.errors.accountNumber)
                    }
                    sx={
                      formik.touched.accountNumber &&
                      Boolean(formik.errors.accountNumber)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText>
                    {formik.touched.accountNumber &&
                      formik.errors.accountNumber}
                  </HelperText>
                </Box>
              </Box>
            </Box>
          )}
          {activeStep === 2 && (
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                {option === "register" && "Registro de giro-emisor"}
                {option === "modify" && "Modificación de giro-emisor"}
                {option === "preview" && "Visualización de giro-emisor"}
              </Typography>

              <Box
                display="flex"
                mb={6}
                flexDirection="row"
                position="relative"
              >
                <Box mb={4} position="relative">
                  <Box width="17vw">
                    <EgressSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                  </Box>
                </Box>
                <Box ml={5} position="relative">
                  <Box width="17vw">
                    <AccountingAccountSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
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
                    disabled={option === "preview"}
                    value={formik.values.observations}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.observations &&
                      Boolean(formik.errors.observations)
                    }
                    sx={
                      formik.touched.observations &&
                      Boolean(formik.errors.observations)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText>
                    {formik.touched.observations && formik.errors.observations}
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
              option === "register" || option === "modify" ? (
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
                    {option === "register" && "Registrar"}
                    {option === "modify" && "Modificar"}
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
                  onClick={() =>
                    router.push("/administration/deposit-emitter/depositList")
                  }
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    borderRadius: "4px",
                  }}
                >
                  <Typography fontSize="90%" fontWeight="bold">
                    Volver a giros-emisor
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
              )
            ) : (
              <MuiButton
                onClick={handleNext}
                sx={{
                  mb: 2,
                  boxShadow: "none",
                  borderRadius: "4px",
                }}
              >
                <Typography fontSize="90%" fontWeight="bold" color="#fff">
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
      <ToastContainer
        position="top-right"
        autoClose={50000}
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
