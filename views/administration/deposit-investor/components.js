import { useState } from "react";

import { useRouter } from "next/router";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Grid, Typography } from "@mui/material/";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Header from "@components/header";
import AccountSelect from "@components/selects/accountSelect";
import ClientSelect from "@components/selects/customerSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import dayjs from "dayjs";

export const Deposit = ({ formik, option, ToastContainer }) => {
  const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const router = useRouter();

  return (
    <>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <form onSubmit={formik.handleSubmit}>
          <BackButton path="/administration/deposit-investor/depositList" />
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography
              letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="4rem"
              color="#5EA3A3"
            >
              {option === "register" && "Registro de giro-inversionista"}
              {option === "modify" && "Modificacion de giro-inversionista"}
              {option === "preview" && "Visualización de giro-inversionista"}
            </Typography>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              <ClientSelect formik={formik} disabled={option === "preview"} />
              <Box ml={5} position="relative">
                <Box width="17vw">
                  <AccountSelect
                    formik={formik}
                    disabled={option === "preview"}
                  />
                  <HelperText>
                    {formik.touched.document_number &&
                      formik.errors.document_number}
                  </HelperText>
                </Box>
              </Box>
            </Box>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              <Box width="17vw">
                <InputTitles>Monto operación</InputTitles>
                <BaseField
                  fullWidth
                  margin="normal"
                  sx={
                    formik.touched.amount && Boolean(formik.errors.amount)
                      ? {
                          width: "18vw",
                          border: "1.4px solid #E6643180",
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
                  id="amount"
                  placeholder="Ingresa monto de operación"
                  name="amount"
                  isMasked
                  disabled={option === "preview"}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  value={formik.values.amount}
                  onChangeMasked={(values) => {
                    formik.setFieldValue("amount", values.floatValue || null);
                  }}
                />

                <HelperText>
                  {formik.touched.amount && formik.errors.amount}
                </HelperText>
              </Box>
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
            <Box display="flex" flexDirection="row">
              <Box mb={4} width="calc(34vw + 3%)">
                <InputTitles>Observaciones</InputTitles>
                <MuiTextField
                  id="description"
                  placeholder="Ingresa una observación"
                  name="description"
                  type="text"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled={option === "preview"}
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
                  {formik.touched.description && formik.errors.description}
                </HelperText>
              </Box>
            </Box>
          </Box>
        </form>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "calc(34vw + 4rem)",
            justifyContent: "flex-end",
          }}
        >
          <Box>
            {option === "register" || option === "modify" ? (
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
                  router.push("/administration/deposit-investor/depositList")
                }
                sx={{
                  mb: 2,
                  boxShadow: "none",
                  borderRadius: "4px",
                }}
              >
                <Typography fontSize="90%" fontWeight="bold">
                  Volver a giros-inversionistas
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
