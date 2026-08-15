import {
  BookOutlined,
  EditOutlined,
  DeleteOutline,
  ExpandMore,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Button,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountTypeSelect from "@components/selects/RPAccountTypeSelect";
import BankSelect from "@components/selects/bankSelect";

import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

/**
 * Objetivo: QUE SE VEA IGUAL AL SCREENSHOT (aunque algunos campos sean ornamentales).
 * - Layout: 3 columnas arriba (izq / centro / panel switches)
 * - 2 textareas grandes
 * - bloque "Entidad financiera" con header + inputs + Agregar + botón centrado
 */
const FIELD_H = 40;
const uniformFieldSx = {
  width: "100%",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E6E6E6",
  borderRadius: "8px",
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
const uniformBaseFieldSx = {
  ...uniformFieldSx,

  // fuerza que el control interno ocupe todo el ancho
  "& .MuiFormControl-root": { width: "100%" },

  // si BaseField usa OutlinedInput / TextField variant="outlined"
  "& .MuiOutlinedInput-root": {
    height: "100%",
    width: "100%",
    padding: "0 !important",
    backgroundColor: "transparent",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0 !important", // quita el borde interno
  },

  // si usa InputBase (standard/filled)
  "& .MuiInputBase-root": {
    height: "100%",
    width: "100%",
    padding: "0 !important",
    backgroundColor: "transparent",
  },

  // input real
  "& input": {
    width: "100%",
    height: "100%",
    padding: "0 !important",
  },
};

const uniformInputPropsSx = {
  height: FIELD_H,
  display: "flex",
  alignItems: "center",
  marginTop: 0, // 👈 NO -5
};
const fieldSx = {
  width: "100%",
  border: "1px solid #E6E6E6",
  borderRadius: "6px",
  backgroundColor: "#FFFFFF",
  padding: "8px 10px",
};

const smallInputSx = {
  ...fieldSx,
  padding: "8px 10px",
};

const counterSx = { fontSize: 12, color: "#6B7280", mt: 0.5 };

const panelSx = {
  width: "100%",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E6E6E6",
  borderRadius: "12px",
  padding: "18px",
  minHeight: 175,
};

const switchRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  paddingY: "12px",
};

const switchSx = {
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": { color: "#FFFFFF" },
    "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#488B8F" },
  },
  "& .MuiSwitch-track": { backgroundColor: "#BDBDBD" },
};


const compactFieldSx = {
  ...fieldSx,
  height: "44px",
  padding: "0px 10px",
  display: "flex",
  alignItems: "center",
  "& input": {
    padding: "0 !important",
    height: "44px",
    fontSize: "14px",
  },
};

const compactInputPropsSx = {
  marginTop: "0px",
  height: "44px",
  display: "flex",
  alignItems: "center",
};
export const RiskProfileComponentDesktop = ({ formik, ToastContainer, loading, data }) => {
  return (
    <>
     

        <Box
        sx={{
          ...scrollSx,
          width: "100%",
          backgroundColor: "#F3F3F5",
          borderRadius: "8px",
          padding: "14px 16px 22px 16px",
          paddingRight: "42px", // 👈 AQUI: espacio extra a la derecha
          boxSizing: "border-box",
        }}
      >
  
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 0.85fr",
    gap: "28px",
    width: "100%",
    alignItems: "start",
  }}
>
  {/* ===== IZQ + CENTRO en una MISMA GRILLA DE FILAS ===== */}
  <Box
    sx={{
      gridColumn: "1 / 3",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "28px",
      rowGap: "18px",
      alignItems: "start",
    }}
  >
    {/* Fila 1 */}
    <Box sx={{ minWidth: 0 }}>
      
      {/* ✅ NO envuelvas BankSelect con uniformFieldSx (para evitar doble borde) */}
      <BankSelect formik={formik} width="100%" />
    </Box>

    <Box sx={{ minWidth: 0 }}>
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

    {/* Fila 2 */}
    <Box sx={{ minWidth: 0 }}>

      {/* ✅ NO envuelvas AccountTypeSelect con uniformFieldSx */}
      <AccountTypeSelect formik={formik} width="100%" />
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "22px",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InputTitles marginBottom={1}>Puntaje</InputTitles>
            <InfoOutlined sx={{ color: "#488B8F", fontSize: 16, mt: "-2px" }} />
          </Box>
          <MuiTextField
            variant="standard"
            fullWidth
            value={formik?.values?.data_credit_score ?? 0}
            onChange={(e) =>
              formik?.setFieldValue?.("data_credit_score", e.target.value)
            }
            InputProps={{ disableUnderline: true, sx: uniformInputPropsSx }}
            sx={uniformFieldSx}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <InputTitles marginBottom={1}>Fecha puntaje</InputTitles>
          <MuiTextField
            variant="standard"
            fullWidth
            value={formik?.values?.score_date ?? "13/08/2024"}
            onChange={(e) => formik?.setFieldValue?.("score_date", e.target.value)}
            InputProps={{ disableUnderline: true, sx: uniformInputPropsSx }}
            sx={uniformFieldSx}
          />
        </Box>
      </Box>
    </Box>

    {/* Fila 3 */}
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "22px",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
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
        </Box>

        <Box sx={{ minWidth: 0 }}>
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
    </Box>

    <Box sx={{ minWidth: 0 }}>
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
    </Box>

    {/* Fila 4 */}
    <Box sx={{ minWidth: 0 }}>
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

    <Box sx={{ minWidth: 0 }}>
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

  {/* ===== DERECHA (PANEL SWITCHES) ===== */}
  <Box sx={{ gridColumn: "3 / 4", minWidth: 260 }}>
    <Box sx={panelSx}>
      <Box sx={switchRowSx}>
        <Typography sx={{ fontSize: 15, color: "#333" }}>
          Aplica Gasto de Mantenimiento (GM)
        </Typography>
        <Switch
          checked={Boolean(formik.values.gmf)}
          sx={switchSx}
          onChange={(e) => formik.setFieldValue("gmf", e.target.checked)}
        />
      </Box>

      <Box sx={switchRowSx}>
        <Typography sx={{ fontSize: 15, color: "#333" }}>
          Aplica Retención ICA
        </Typography>
        <Switch
          checked={Boolean(formik.values.ica)}
          sx={switchSx}
          onChange={(e) => formik.setFieldValue("ica", e.target.checked)}
        />
      </Box>

      <Box sx={switchRowSx}>
        <Typography sx={{ fontSize: 15, color: "#333" }}>
          Aplica Retención IVA
        </Typography>
        <Switch
          checked={Boolean(formik.values.iva)}
          sx={switchSx}
          onChange={(e) => formik.setFieldValue("iva", e.target.checked)}
        />
      </Box>
    </Box>
  </Box>
</Box>

        {/* =========================
            TEXTAREAS GRANDES (igual screenshot)
            ========================= */}
        <Box sx={{ mt: 2 }}>
          <InputTitles marginBottom={1}>Análisis Cualitativo</InputTitles>
          <MuiTextField
            variant="standard"
            fullWidth
            multiline
            rows={5}
            value={formik?.values?.qualitative_analysis ?? ""}
            onChange={(e) =>
              formik?.setFieldValue?.("qualitative_analysis", e.target.value)
            }
            InputProps={{ disableUnderline: true }}
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E6E6",
              borderRadius: "8px",
              padding: "10px 12px",
            }}
          />
          <Typography sx={counterSx}>0/2000</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <InputTitles marginBottom={1}>Análisis Financiero</InputTitles>
          <MuiTextField
            variant="standard"
            fullWidth
            multiline
            rows={5}
            value={formik?.values?.financial_analysis ?? ""}
            onChange={(e) =>
              formik?.setFieldValue?.("financial_analysis", e.target.value)
            }
            InputProps={{ disableUnderline: true }}
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E6E6",
              borderRadius: "8px",
              padding: "10px 12px",
            }}
          />
          <Typography sx={counterSx}>0/2000</Typography>
        </Box>

        {/* =========================
            ENTIDAD FINANCIERA 
            ========================= */}

            
        <Box sx={{ mt: 2, backgroundColor: "#FFFFFF", borderRadius: "8px" }}>
          {/* header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderBottom: "1px solid #E6E6E6",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ fontSize: 13, color: "#488B8F" }}>
                Nombre Entidad Financiera $ 0
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#488B8F" }}>590</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small">
                <ExpandMore sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small">
                <EditOutlined sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" color="error">
                <DeleteOutline sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* inputs fila */}
          <Box sx={{ padding: "14px 12px" }}>
            <Box sx={{ display: "flex", gap: "22px", alignItems: "center" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <InputTitles marginBottom={1}>Nombre Entidad</InputTitles>
                <MuiTextField
                  variant="standard"
                  fullWidth
                  value={"Nombre Entidad"}
                  onChange={() => {}}
                  InputProps={{ disableUnderline: true }}
                  sx={smallInputSx}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <InputTitles marginBottom={1}>Saldo</InputTitles>
                <MuiTextField
                  variant="standard"
                  fullWidth
                  value={"$0"}
                  onChange={() => {}}
                  InputProps={{ disableUnderline: true }}
                  sx={smallInputSx}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <InputTitles marginBottom={1}>Calificación</InputTitles>
                <MuiTextField
                  variant="standard"
                  fullWidth
                  value={"590"}
                  onChange={() => {}}
                  InputProps={{ disableUnderline: true }}
                  sx={smallInputSx}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography sx={{ color: "#488B8F", fontSize: 13, cursor: "pointer" }}>
                Agregar
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* =========================
            BOTÓN ACTUALIZAR centrado (gris)
            ========================= */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={formik.handleSubmit}
            sx={{
              backgroundColor: "#9CA3AF",
              borderRadius: "6px",
              color: "#FFFFFF",
              height: "2.6rem",
              width: "11rem",
              fontSize: "0.75rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#6B7280" },
              textTransform: "none",
            }}
          >
            {formik.values.id ? "Actualizar" : "Guardar"}
          </Button>

           {/* Debug */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ marginTop: 20 }}>
                    <h4>Errores:</h4>
                    <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
                    <pre>{JSON.stringify(formik.values, null, 2)}</pre>
                  </div>
                )}
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