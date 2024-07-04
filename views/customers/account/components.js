import { Fragment, useState } from "react";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";

import AccountTypeSelect from "@components/selects/accountTypeSelect2";
import ClientSelect from "@components/selects/customerSelect";
import StateTypeSelect from "@components/selects/stateSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

export const AccountComponent = ({
  formik,
  option,
  ToastContainer,
  loading,
}) => {
  const router = useRouter();
  return (
    <>
      <Grid
        container
        xs
        style={{
          background: "#EBEBEB",
          height: "auto",
          overflowY: "auto",
          marginLeft: "20px",
        }}
      >
        <Grid
          item
          xs={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            marginLeft: "20px",
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <BackButton path="/customers/accountList" />
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                {option === "register" && "Registro de cuentas"}
                {option === "modify" && "Modificacion de cuentas"}
                {option === "preview" && "Visualización de cuentas"}
              </Typography>

              <Box
                display="flex"
                mb={6}
                flexDirection="row"
                position="relative"
              >
                <AccountTypeSelect
                  formik={formik}
                  disabled={option === "preview"}
                />
                <Box ml={6}>
                  <ClientSelect
                    formik={formik}
                    customer="Cliente"
                    disabled={option === "preview"}
                  />
                </Box>
              </Box>
              <Box
                mb={6}
                flexDirection="row"
                position="relative"
                display={option === "register" ? "none" : "flex"}
              >
                <Box width="17vw">
                  <InputTitles>Número de cuenta</InputTitles>
                  <MuiTextField
                    id="account_number"
                    placeholder="Ingresa el número de cuenta"
                    name="account_number"
                    type="text"
                    variant="standard"
                    margin="normal"
                    fullWidth
                    disabled={option === "modify" || option === "preview"}
                    value={formik.values.account_number}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.account_number &&
                      Boolean(formik.errors.account_number)
                    }
                    sx={
                      formik.touched.account_number &&
                      Boolean(formik.errors.account_number)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText position="fixed">
                    {formik.touched.account_number &&
                      formik.errors.account_number}
                  </HelperText>
                </Box>
                <Box width="17vw" ml={6}>
                  <StateTypeSelect
                    formik={formik}
                    disabled={option === "preview"}
                  />
                </Box>
              </Box>

              <Box width="100%">
                <TextareaAutosize
                  minRows={5}
                  maxRows={5}
                  placeholder="Esribe aquí sus observaciones..."
                  name="observations"
                  type="text"
                  variant="standard"
                  margin="normal"
                  color="#575757"
                  value={formik.values.observations}
                  onChange={formik.handleChange}
                  disabled={option === "preview"}
                  error={
                    formik.touched.observations &&
                    Boolean(formik.errors.observations)
                  }
                  style={{
                    resize: "none",
                    width: "100%",
                    backgroundColor: "white",
                    border: "1.4px solid #ACCFCF",

                    borderRadius: "5px",
                    padding: "10px",

                    fontFamily: "Montserrat",
                    fontSize: "0.9rem",

                    letterSpacing: "0.28px",
                    outline: "none",
                  }}
                  sx={
                    formik.touched.observations &&
                    Boolean(formik.errors.observations)
                      ? { border: "1.4px solid #E6643180" }
                      : null
                  }
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row-reverse"
                width="100%"
                paddingLeft="20px"
              >
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
                      {option === "register" && "Registrar cuenta"}
                      {option === "modify" && "Modificar cuenta"}
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
                    onClick={() => router.push("/customers/accountList")}
                    sx={{
                      mb: 2,
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography fontSize="90%" fontWeight="bold">
                      Volver a cuentas
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
          </form>
        </Grid>
      </Grid>
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