// React
import { useEffect, useState } from "react";

import { useRouter } from "next/router";

// MUI
import { Grid, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Components
import Header from "@components/header";
import AccountSelect from "@components/selects/accountSelect";
import AccountTypeSelect from "@components/selects/accountTypeSelect";
import BankSelect from "@components/selects/bankSelect";
import ClientSelect from "@components/selects/customerSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

// Utils
import dayjs from "dayjs";

export const RefundV = ({ formik, option, ToastContainer }) => {
  const router = useRouter();
  const steps = ["Primer paso", "Segundo paso"];

  const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));

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
  /*Cambio en el factor de GM
Por solicitud cambia el factor de GM de 0,004 a 0,002 a partir del 26 de octubre de 2024.
*/
  useEffect(() => {
    if (formik.values.applyGM) {
      formik.setFieldValue("gmAmount", formik.values.amount * 0.004);
    } else {
      formik.setFieldValue("gmAmount", 0);
    }
  }, [formik.values.applyGM, formik.values.amount]);

  return (
    <>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <form onSubmit={formik.handleSubmit}>
          <BackButton path="/administration/refund/refundList" />
          {activeStep === 0 && (
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                {option === "register" ? "Registro de reintegro" : null}
                {option === "modify" ? "Modificación de reintegro" : null}
                {option === "preview" ? "Visualización de reintegro" : null}
              </Typography>

              <Box
                display="flex"
                mb={2}
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
                          disabled={option === "preview"}
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

                  {
                    <HelperText rText position="fixed">
                      {formik.touched.date && formik.errors.date}
                    </HelperText>
                  }
                </Box>
              </Box>

              <Box
                display="flex"
                mb={1}
                flexDirection="row"
                position="relative"
              >
                <AccountSelect
                  formik={formik}
                  account={"Cuenta"}
                  disabled={option === "preview"}
                />
                <Box>
                  <InputTitles
                    sx={{
                      marginBottom: "1rem",
                      marginLeft: "2.5rem",
                    }}
                  >
                    GM
                  </InputTitles>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"17.5vw"}
                    bgcolor={"#fafafa"}
                    borderRadius={"4px"}
                    border={"0.1rem solid #5EA3A380"}
                    padding={"0 7px 0 5px"}
                    marginBottom={"30px"}
                    marginLeft={"2.5rem"}
                    height={"2.25rem"}
                  >
                    <Typography
                      variant="h6"
                      fontSize="0.8vw"
                      letterSpacing={0}
                      fontWeight="regular"
                      color="#333333"
                    >
                      ¿Aplica GM?
                    </Typography>
                    <Switch
                      value={formik.values.applyGM}
                      checked={formik.values.applyGM}
                      disabled={option === "preview"}
                      sx={{
                        "& .MuiSwitch-switchBase": {
                          color: "#FFFFFF",
                          "&.Mui-checked": {},
                          "&.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#488B8F",
                          },

                          "&.Mui-disabled": {
                            color: "#488B8F",
                          },
                          "&.Mui-disabled + .MuiSwitch-track": {
                            backgroundColor: "#B5D1C9",
                          },
                        },
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("applyGM", true);
                        } else {
                          formik.setFieldValue("applyGM", false);
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" position="relative">
                <Box>
                  <InputTitles>Monto</InputTitles>
                  <BaseField
                    id="amount"
                    placeholder="Ingresa un Monto"
                    name="amount"
                    isMasked
                    thousandSeparator="."
                    decimalSeparator=","
                    margin="normal"
                    decimalScale={0}
                    disabled={option === "preview"}
                    allowNegative={false}
                    error={
                      formik.touched.amount && Boolean(formik.errors.amount)
                    }
                    value={formik.values.amount}
                    onChangeMasked={(values) => {
                      formik.setFieldValue("amount", values.floatValue || null);
                    }}
                    sx={
                      formik.touched.amount && Boolean(formik.errors.amount)
                        ? {
                            width: "18vw",
                            border: "2px solid #E6643180",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                          }
                        : {
                            width: "18vw",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                          }
                    }
                  />
                  <HelperText>
                    {formik.touched.amount && formik.errors.amount}
                  </HelperText>
                </Box>

                <Box ml={"2%"}>
                  <InputTitles sx={{}}>Monto GM</InputTitles>
                  <BaseField
                    id="gmAmount"
                    placeholder="Ingresa un Monto"
                    name="gmAmount"
                    isMasked
                    value={formik.values.gmAmount}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={0}
                    allowNegative={false}
                    disabled={true}
                    margin="normal"
                    onChangeMasked={(values) => {
                      formik.setFieldValue("amount", values.floatValue);
                    }}
                    sx={
                      formik.touched.amount && Boolean(formik.errors.amount)
                        ? {
                            width: "18vw",
                            border: "2px solid #E6643180",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                          }
                        : {
                            width: "18vw",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                          }
                    }
                  />
                </Box>
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
                {option === "register"
                  ? "Registro de reintegro - Datos Bancarios"
                  : null}
                {option === "modify"
                  ? "Modificación de reintegro - Datos Bancarios"
                  : null}
                {option === "preview"
                  ? "Visualización de reintegro - Datos Bancarios"
                  : null}
              </Typography>

              <Box
                display="flex"
                mb={3}
                flexDirection="row"
                position="relative"
              >
                <Box
                  sx={{
                    marginRight: "1.3rem",
                  }}
                >
                  <InputTitles>beneficiario</InputTitles>
                  <MuiTextField
                    id="beneficiary"
                    placeholder="Ingresa un beneficiario"
                    name="beneficiary"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.beneficiary}
                    variant="standard"
                    margin="normal"
                    disabled={option === "preview"}
                    fullWidth
                    error={
                      formik.touched.beneficiary &&
                      Boolean(formik.errors.beneficiary)
                    }
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    helperText={formik.errors.beneficiary}
                    sx={
                      formik.touched.amount &&
                      Boolean(formik.errors.beneficiary)
                        ? {
                            border: "2px solid #E6643180",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            width: "16.8vw",
                          }
                        : {
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            width: "16.8vw",
                          }
                    }
                  />
                </Box>

                <BankSelect formik={formik} disabled={option === "preview"} />
              </Box>
              <Box
                display="flex"
                mb={1.2}
                flexDirection="row"
                position="relative"
              >
                <AccountTypeSelect
                  formik={formik}
                  disabled={option === "preview"}
                />

                <Box
                  sx={{
                    width: "16.8vw",
                    marginLeft: "3%",
                  }}
                >
                  <InputTitles>Número de Cuenta</InputTitles>
                  <MuiTextField
                    id="accountNumber"
                    placeholder="Ingresa un numero de cuenta"
                    name="accountNumber"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.accountNumber}
                    variant="standard"
                    helperText={formik.errors.accountNumber}
                    margin="normal"
                    fullWidth
                    disabled={option === "preview"}
                    error={
                      formik.touched.accountNumber &&
                      Boolean(formik.errors.accountNumber)
                    }
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    sx={
                      formik.touched.accountNumber &&
                      Boolean(formik.errors.accountNumber)
                        ? {
                            border: "2px solid #E6643180",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            width: "16.8vw",
                          }
                        : {
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            width: "16.8vw",
                          }
                    }
                  />
                </Box>
              </Box>

              <Box
                display="flex"
                mb={6}
                flexDirection="row"
                position="relative"
              >
                <Box>
                  <InputTitles>Observaciones</InputTitles>
                  <MuiTextField
                    id="observations"
                    placeholder="Ingresa una observación"
                    name="observations"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.observations}
                    variant="standard"
                    margin="normal"
                    disabled={option === "preview"}
                    fullWidth
                    error={
                      formik.touched.observations &&
                      Boolean(formik.errors.observations)
                    }
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    sx={
                      formik.touched.observations &&
                      Boolean(formik.errors.observations)
                        ? {
                            border: "2px solid #E6643180",
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                            width: "36vw",
                          }
                        : {
                            "input::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },

                            "input::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",

                              margin: 0,
                            },
                            width: "36vw",
                          }
                    }
                  />
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
                    router.push("/administration/refund/refundList")
                  }
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    borderRadius: "4px",
                  }}
                >
                  <Typography fontSize="90%" fontWeight="bold">
                    Volver a reintegros
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
