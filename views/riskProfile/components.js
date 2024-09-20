import { BookOutlined } from "@mui/icons-material";
import { Button, Switch } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountTypeSelect from "@components/selects/RPAccountTypeSelect";
import BankSelect from "@components/selects/bankSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

export const RiskProfileC = ({ formik, ToastContainer, loading, data }) => {
  return (
    <>
      <Box
        borderBottom="2px solid #A1A1A1"
        display="flex"
        flexDirection="column"
        sx={{ ...scrollSx }}
      >
        <Box display="flex" flexDirection="column" height={"50vh"}>
          <BackButton path="/customers/customerList" />
          <Box marginBottom={3}>
            <Typography
              letterSpacing={0}
              fontSize="1.8vw"
              fontWeight="regular"
              color="#488B8F"
            >
              Perfil De Riesgo
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gridTemplateRows="1fr 1fr"
              gap={3.5}
              width="80%"
            >
              <Box display="flex" flexDirection="column">
                <InputTitles marginBottom={1}>N° Identificación</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1.042vw"
                  fontWeight="medium"
                  color="#333333"
                >
                  {data?.data?.document_number}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <InputTitles marginBottom={1}>Cliente</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1.042vw"
                  fontWeight="medium"
                  color="#333333"
                >
                  {`${data?.data?.first_name ?? ""} ${
                    data?.data?.last_name ?? ""
                  } ${data?.data?.social_reason ?? ""}`}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column">
                <InputTitles marginBottom={2}>Representante legal</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1.042vw"
                  fontWeight="medium"
                  color="#333333"
                >
                  {`${
                    data?.data?.legal_representative?.social_reason
                      ? data?.data?.legal_representative?.social_reason
                      : `${data?.data?.legal_representative?.first_name} 
                        ${data?.data?.legal_representative?.last_name} `
                  } `}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <InputTitles marginBottom={2}>Correo Electrónico</InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1.042vw"
                  fontWeight="medium"
                  color="#333333"
                >
                  {`${data?.data?.email} `}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography
        letterSpacing={0}
        fontSize="1.242vw"
        fontWeight="regular"
        color="#488B8F"
        marginTop={"20px"}
      >
        Información de Análisis Financiero
      </Typography>
      <Box container display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <Box
          display={"flex"}
          flexDirection="row"
          marginTop={"20px"}
          sx={{ ...scrollSx }}
        >
          <Box display="flex" flexDirection="column" width={"35%"}>
            <InputTitles marginBottom={2}>Aplica GM</InputTitles>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#fafafa"}
              borderRadius={"4px"}
              border={"0.1rem solid #5EA3A380"}
              padding={"0 7px 0 5px"}
              marginBottom={"30px"}
              sx={{
                marginTop: "0",
                width: "17vw",
                height: "5vh",
                marginBottom: "30px",
                ["@media (max-height:900px)"]: {
                  width: "23vw ",
                  color: "red",
                  height: "6vh",
                },
              }}
            >
              <Typography
                variant="h6"
                fontSize="0.9vw"
                letterSpacing={0}
                fontWeight="regular"
                color="#333333"
              >
                Aplica GM
              </Typography>
              <Switch
                value={formik.values.gmf}
                checked={formik.values.gmf}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      color: "#FFFFFF",
                    },
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
                    formik.setFieldValue("gmf", true);
                  } else {
                    formik.setFieldValue("gmf", false);
                  }
                }}
              />
            </Box>
            <InputTitles marginBottom={2}>Aplica ret IVA</InputTitles>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#fafafa"}
              borderRadius={"4px"}
              border={"0.1rem solid #5EA3A380"}
              padding={"0 7px 0 5px"}
              marginBottom={"30px"}
              sx={{
                marginTop: "0",
                width: "17vw",
                height: "5vh",
                marginBottom: "30px",
                ["@media (max-height:900px)"]: {
                  width: "23vw ",
                  color: "red",
                  height: "6vh",
                },
              }}
            >
              <Typography
                variant="h6"
                fontSize="0.9vw"
                letterSpacing={0}
                fontWeight="regular"
                color="#333333"
              >
                Aplica ret IVA
              </Typography>
              <Switch
                value={formik.values.iva}
                checked={formik.values.iva}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      color: "#FFFFFF",
                    },
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
                    formik.setFieldValue("iva", true);
                  } else {
                    formik.setFieldValue("iva", false);
                  }
                }}
              />
            </Box>

            <Box>
              <InputTitles marginBottom={2}>Tasa de Inversionista</InputTitles>
              <MuiTextField
                id="discount_rate_investor"
                placeholder="Tasa de inversionista"
                name="discount_rate_investor"
                type="number"
                onChange={formik.handleChange}
                value={
                  formik.values.discount_rate_investor
                    ? Math.round(formik.values.discount_rate_investor * 100) /
                      100
                    : formik.values.discount_rate_investor
                }
                variant="standard"
                margin="normal"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    marginTop: "-5px",
                    "input::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "input::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
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
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "72%",
                    height: "3vh",
                  },
                  marginTop: "0",
                  width: "16.7vw",
                  height: "1.77vh",
                  marginBottom: "30px",
                }}
              />
            </Box>

            <Box>
              <InputTitles marginBottom={2}>Cupo Inversionista</InputTitles>
              <BaseField
                sx={{
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "78%",
                    height: "10%",
                  },
                  marginTop: "0",
                  width: "18vw",
                  height: "4vh",
                  marginBottom: "30px",
                  "input::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
                id="investor_balance"
                name="investor_balance"
                isMasked
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.investor_balance)}
                value={formik.values.investor_balance}
                onChangeMasked={(values) => {
                  formik.setFieldValue("investor_balance", values.floatValue);
                }}
                helperText={formik.errors.investor_balance}
              />
            </Box>
            <Box display="flex" flexDirection="row">
              <BankSelect formik={formik} width="23vw" />
            </Box>

            <Box>
              <InputTitles
                marginBottom={2}
                sx={{
                  marginTop: "30px",
                }}
              >
                Numero de cuenta
              </InputTitles>
              <MuiTextField
                id="account_number"
                placeholder="Numero de cuenta"
                name="account_number"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.account_number}
                variant="standard"
                margin="normal"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    marginTop: "-5px",
                  },
                }}
                sx={{
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "74%",
                    height: "3vh",
                  },
                  marginTop: "0",
                  width: "17vw",
                  height: "1.77vh",
                  marginBottom: "30px",
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
          </Box>
          <Box display="flex" flexDirection="column" width={"35%"}>
            <InputTitles marginBottom={2}>Aplica ICA</InputTitles>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#fafafa"}
              borderRadius={"4px"}
              border={"0.1rem solid #5EA3A380"}
              padding={"0 7px 0 5px"}
              marginBottom={"30px"}
              sx={{
                marginTop: "0",
                width: "17vw",
                height: "5vh",
                marginBottom: "30px",
                ["@media (max-height:900px)"]: {
                  width: "23vw ",
                  color: "red",
                  height: "6vh",
                },
              }}
            >
              <Typography
                variant="h6"
                fontSize="0.9vw"
                letterSpacing={0}
                fontWeight="regular"
                color="#333333"
              >
                Aplica ICA
              </Typography>
              <Switch
                value={formik.values.ica}
                checked={formik.values.ica}
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
                    formik.setFieldValue("ica", true);
                  } else {
                    formik.setFieldValue("ica", false);
                  }
                }}
              />
            </Box>
            <Box>
              <InputTitles marginBottom={2}>Tasa de descuento</InputTitles>
              <MuiTextField
                id="discount_rate"
                placeholder="Tasa de descuento"
                name="discount_rate"
                type="number"
                onChange={formik.handleChange}
                value={
                  formik.values.discount_rate
                    ? Math.round(formik.values.discount_rate * 100) / 100
                    : formik.values.discount_rate
                }
                variant="standard"
                margin="normal"
                fullWidth
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
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "72%",
                    height: "3vh",
                  },
                  marginTop: "0",
                  width: "17vw",
                  height: "1.77vh",
                  marginBottom: "30px",
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

            <Box>
              <InputTitles marginBottom={2}>Cupo Emisor</InputTitles>
              <BaseField
                sx={{
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "78%",
                    height: "10%",
                  },
                  marginTop: "0",
                  width: "18vw",
                  height: "4vh",
                  marginBottom: "30px",
                  "input::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
                id="emitter_balance"
                name="emitter_balance"
                isMasked
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.emitter_balance)}
                value={formik.values.emitter_balance}
                onChangeMasked={(values) => {
                  formik.setFieldValue("emitter_balance", values.floatValue);
                }}
                helperText={formik.errors.emitter_balance}
              />
            </Box>

            <Box>
              <InputTitles marginBottom={2}>Cupo Pagador</InputTitles>
              <BaseField
                sx={{
                  ["@media (max-width:1366px)"]: {
                    // eslint-disable-line no-useless-computed-key
                    width: "78%",
                    height: "6vh",
                  },
                  marginTop: "0",
                  width: "18vw",
                  height: "4vh",
                  marginBottom: "30px",
                  "input::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
                id="payer_balance"
                name="payer_balance"
                isMasked
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.payer_balance)}
                value={formik.values.payer_balance}
                onChangeMasked={(values) => {
                  formik.setFieldValue("payer_balance", values.floatValue);
                }}
                helperText={formik.errors.payer_balance}
              />
            </Box>

            <Box display="flex" flexDirection="row">
              <AccountTypeSelect formik={formik} width="23vw" />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width={"30%"}
            justifyContent={"flex-end"}
          >
            <Button
              variant="standard"
              onClick={formik.handleSubmit}
              sx={{
                backgroundColor: "#488B8F",
                borderRadius: "4px",
                color: "#FFFFFF",
                height: "3rem",
                width: "14vw",
                marginTop: "2rem",
                marginBottom: "2rem",
                position: "absolute",
                bottom: "3.5rem",
                right: "8rem",
                fontSize: "0.7rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#5EA3A3",
                },
              }}
              aria-label="add"
            >
              {formik.values.id ? "Actualizar" : "Guardar"}
              <BookOutlined sx={{ ml: 1, fontSize: "medium" }} />
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
