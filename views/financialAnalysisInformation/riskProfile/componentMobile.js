import React from "react";
import { InfoOutlined } from "@mui/icons-material";
import { Box, Button, Switch, Typography } from "@mui/material";

import AccountTypeSelect from "@components/selects/RPAccountTypeSelect";
import BankSelect from "@components/selects/bankSelect";

import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

/**
 * Mobile version (full width, sin espacios en blanco laterales)
 * - 1 columna
 * - full-bleed para ignorar Container/Layout padding
 */
const FIELD_H = 44;

const uniformFieldSx = {
  width: "100%",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E6E6E6",
  borderRadius: "10px",
  height: FIELD_H,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  px: 1.5,
  "& .MuiInputBase-root": {
    height: FIELD_H,
    display: "flex",
    alignItems: "center",
  },
  "& .MuiInputBase-input": {
    padding: "0 !important",
    height: FIELD_H,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
  },
  "& input": {
    padding: "0 !important",
    height: FIELD_H,
    fontSize: 14,
  },
};

const uniformInputPropsSx = {
  height: FIELD_H,
  display: "flex",
  alignItems: "center",
  marginTop: 0,
};

const uniformBaseFieldSx = {
  ...uniformFieldSx,
  "& .MuiFormControl-root": { width: "100%" },
  "& .MuiOutlinedInput-root": {
    height: "100%",
    width: "100%",
    padding: "0 !important",
    backgroundColor: "transparent",
  },
  "& .MuiOutlinedInput-notchedOutline": { border: "0 !important" },
  "& .MuiInputBase-root": {
    height: "100%",
    width: "100%",
    padding: "0 !important",
    backgroundColor: "transparent",
  },
  "& input": {
    width: "100%",
    height: "100%",
    padding: "0 !important",
  },
};

const sectionCardSx = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E6E6E6",
  borderRadius: "14px",
  padding: "12px",
};

const switchCardSx = {
  ...sectionCardSx,
  padding: "10px 12px",
};

const switchRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  py: 0.75,
};

const switchSx = {
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": { color: "#FFFFFF" },
    "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#488B8F" },
  },
  "& .MuiSwitch-track": { backgroundColor: "#BDBDBD" },
};

const counterSx = {
  fontSize: 11,
  lineHeight: 1.2,
  color: "#8A969B",
  mt: 0.6,
  textAlign: "right",
};


const AnalysisTextarea = ({ value, onChange, maxLength = 2000 }) => (
  <Box>
    <Box
      component="textarea"
      value={value ?? ""}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        display: "block",
        width: "100%",
        height: { xs: 96, sm: 108 },
        minHeight: { xs: 96, sm: 108 },
        maxHeight: { xs: 96, sm: 108 },
        boxSizing: "border-box",
        resize: "none",
        overflowY: "auto",
        overflowX: "hidden",
        border: "1px solid #B9D8D9",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        color: "#4A5B60",
        fontFamily: "inherit",
        fontSize: { xs: 12, sm: 13 },
        lineHeight: 1.45,
        padding: "10px 12px",
        outline: "none",
        WebkitOverflowScrolling: "touch",
        "&:focus": {
          borderColor: "#5EA3A3",
          boxShadow: "0 0 0 1px rgba(94, 163, 163, 0.12)",
        },
      }}
    />
    <Typography sx={counterSx}>
      {String(value ?? "").length}/{maxLength}
    </Typography>
  </Box>
);

export const RiskProfileComponentMobile = ({
  formik,
  ToastContainer,
  loading,
  data,
}) => {
  return (
    <>
      {/* FULL BLEED WRAPPER: elimina el “espacio blanco” lateral aunque el padre tenga Container/padding */}
 <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Banco */}
          <Box sx={sectionCardSx}>
            <BankSelect formik={formik} width="100%" compact />
          </Box>

          {/* Tipo cuenta */}
          <Box sx={sectionCardSx}>
            <AccountTypeSelect formik={formik} width="100%" compact />
          </Box>

          {/* Número de cuenta */}
          <Box sx={sectionCardSx}>
            <InputTitles marginBottom={1}>Número de cuenta</InputTitles>
            <MuiTextField
              id="account_number"
              name="account_number"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.account_number}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true, sx: uniformInputPropsSx }}
              sx={uniformFieldSx}
            />
          </Box>

          {/* Puntaje + Fecha */}
          <Box sx={sectionCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InputTitles marginBottom={1}>Puntaje</InputTitles>
              <InfoOutlined sx={{ color: "#488B8F", fontSize: 16, mt: "-2px" }} />
            </Box>

            <MuiTextField
              variant="standard"
              fullWidth
              value={formik?.values?.data_credit_score ?? ""}
              onChange={(e) =>
                formik?.setFieldValue?.("data_credit_score", e.target.value)
              }
              InputProps={{ disableUnderline: true, sx: uniformInputPropsSx }}
              sx={uniformFieldSx}
            />

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Fecha puntaje</InputTitles>
              <MuiTextField
                variant="standard"
                fullWidth
                value={formik?.values?.score_date ?? ""}
                onChange={(e) =>
                  formik?.setFieldValue?.("score_date", e.target.value)
                }
                InputProps={{ disableUnderline: true, sx: uniformInputPropsSx }}
                sx={uniformFieldSx}
              />
            </Box>
          </Box>

          {/* Tasas */}
          <Box sx={sectionCardSx}>
            <InputTitles marginBottom={1}>Tasa de inversionista</InputTitles>
            <MuiTextField
              id="discount_rate_investor"
              placeholder="0"
              name="discount_rate_investor"
              type="number"
              onChange={formik.handleChange}
              value={
                formik.values.discount_rate_investor
                  ? Math.round(formik.values.discount_rate_investor * 100) / 100
                  : formik.values.discount_rate_investor
              }
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: uniformInputPropsSx,
                endAdornment: (
                  <i style={{ color: "#5EA3A3" }} className="fa-light fa-percent" />
                ),
              }}
              sx={uniformFieldSx}
            />

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Tasa descuento</InputTitles>
              <MuiTextField
                id="discount_rate"
                placeholder="0"
                name="discount_rate"
                type="number"
                onChange={formik.handleChange}
                value={
                  formik.values.discount_rate
                    ? Math.round(formik.values.discount_rate * 100) / 100
                    : formik.values.discount_rate
                }
                variant="standard"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: uniformInputPropsSx,
                  endAdornment: (
                    <i style={{ color: "#5EA3A3" }} className="fa-light fa-percent" />
                  ),
                }}
                sx={uniformFieldSx}
              />
            </Box>
          </Box>

          {/* Cupos */}
          <Box sx={sectionCardSx}>
            <InputTitles marginBottom={1}>Cupo emisor</InputTitles>
            <BaseField
              id="emitter_balance"
              name="emitter_balance"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="0"
              value={formik?.values?.emitter_balance ?? 0}
              error={Boolean(formik?.errors?.emitter_balance)}
              helperText={formik?.errors?.emitter_balance}
              onChangeMasked={(values) =>
                formik?.setFieldValue?.("emitter_balance", values.floatValue)
              }
              sx={uniformBaseFieldSx}
            />

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Cupo inversionista</InputTitles>
              <BaseField
                id="investor_balance"
                name="investor_balance"
                isMasked
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                placeholder="0"
                value={formik?.values?.investor_balance ?? 0}
                error={Boolean(formik?.errors?.investor_balance)}
                helperText={formik?.errors?.investor_balance}
                onChangeMasked={(values) =>
                  formik?.setFieldValue?.("investor_balance", values.floatValue)
                }
                sx={uniformBaseFieldSx}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Cupo pagador</InputTitles>
              <BaseField
                id="payer_balance"
                name="payer_balance"
                isMasked
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                placeholder="0"
                value={formik?.values?.payer_balance ?? 0}
                error={Boolean(formik?.errors?.payer_balance)}
                helperText={formik?.errors?.payer_balance}
                onChangeMasked={(values) =>
                  formik?.setFieldValue?.("payer_balance", values.floatValue)
                }
                sx={uniformBaseFieldSx}
              />
            </Box>
          </Box>

          {/* Switches */}
          <Box sx={switchCardSx}>
            <Box sx={switchRowSx}>
              <Typography sx={{ fontSize: 14, color: "#333" }}>Aplica GM</Typography>
              <Switch
                checked={Boolean(formik.values.gmf)}
                sx={switchSx}
                onChange={(e) => formik.setFieldValue("gmf", e.target.checked)}
              />
            </Box>

            <Box sx={switchRowSx}>
              <Typography sx={{ fontSize: 14, color: "#333" }}>
                Aplica Retención ICA
              </Typography>
              <Switch
                checked={Boolean(formik.values.ica)}
                sx={switchSx}
                onChange={(e) => formik.setFieldValue("ica", e.target.checked)}
              />
            </Box>

            <Box sx={switchRowSx}>
              <Typography sx={{ fontSize: 14, color: "#333" }}>
                Aplica Retención IVA
              </Typography>
              <Switch
                checked={Boolean(formik.values.iva)}
                sx={switchSx}
                onChange={(e) => formik.setFieldValue("iva", e.target.checked)}
              />
            </Box>
          </Box>

          {/* Textareas */}
          <Box sx={{ ...sectionCardSx, overflow: "hidden" }}>
            <InputTitles marginBottom={1}>Análisis Cualitativo</InputTitles>
            <AnalysisTextarea
              value={formik?.values?.qualitative_analysis}
              onChange={(value) =>
                formik?.setFieldValue?.("qualitative_analysis", value)
              }
            />
          </Box>

          <Box sx={{ ...sectionCardSx, overflow: "hidden" }}>
            <InputTitles marginBottom={1}>Análisis Financiero</InputTitles>
            <AnalysisTextarea
              value={formik?.values?.financial_analysis}
              onChange={(value) =>
                formik?.setFieldValue?.("financial_analysis", value)
              }
            />
          </Box>

          {/* Entidad financiera (ornamental) */}
          <Box sx={sectionCardSx}>
            <Typography sx={{ fontSize: 13, color: "#488B8F", mb: 1 }}>
              Entidad financiera
            </Typography>

            <InputTitles marginBottom={1}>Nombre Entidad</InputTitles>
            <MuiTextField
              variant="standard"
              fullWidth
              value={"Nombre Entidad"}
              onChange={() => {}}
              InputProps={{ disableUnderline: true }}
              sx={uniformFieldSx}
            />

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Saldo</InputTitles>
              <MuiTextField
                variant="standard"
                fullWidth
                value={"$0"}
                onChange={() => {}}
                InputProps={{ disableUnderline: true }}
                sx={uniformFieldSx}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <InputTitles marginBottom={1}>Calificación</InputTitles>
              <MuiTextField
                variant="standard"
                fullWidth
                value={"590"}
                onChange={() => {}}
                InputProps={{ disableUnderline: true }}
                sx={uniformFieldSx}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
              <Typography sx={{ color: "#488B8F", fontSize: 13, cursor: "pointer" }}>
                Agregar
              </Typography>
            </Box>
          </Box>

          {/* Botón */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              disabled={Boolean(loading)}
              onClick={formik.handleSubmit}
              sx={{
                backgroundColor: "#488B8F",
                borderRadius: "10px",
                color: "#FFFFFF",
                height: "2.9rem",
                width: "100%",
                fontSize: "0.9rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#347B80", boxShadow: "none" },
                textTransform: "none",
              }}
            >
              {formik.values.id ? "Actualizar" : "Guardar"}
            </Button>
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
      </Box>
    </>
  );
};