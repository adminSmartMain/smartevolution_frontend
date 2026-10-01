import { useEffect, useMemo, useRef, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  CalendarMonthOutlined,
  DeleteOutline,
  EditOutlined,
  ExpandMore,
  InfoOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { NumericFormat } from "react-number-format";

import { useFetch } from "@hooks/useFetch";
import { AccountTypes, Banks } from "@components/selects/queries";

const H = 32;
const TEAL = "#3F8E93";
const OPS_BORDER = "#70787D";

const floatingLabelSx = {
  fontSize: "10.5px",
  color: "#6B7378",
  backgroundColor: "#FFFFFF",
  px: "4px",
  "&.Mui-focused": { color: TEAL },
};
const TEXT = "#263238";
const MUTED = "#718087";
const BORDER = "#D7E0E3";
const SURFACE = "#FFFFFF";
const SOFT = "#F7F9FA";

const LIMITS = {
  accountNumber: 255,
  score: 950,
  rate: 999.99,
  analysis: 2000,
  money: 999999999999.99,
};

const sanitizeAlphaNumeric = (value, maxLength = 255) =>
  String(value ?? "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, maxLength);

const sanitizeInteger = (value, max = Number.MAX_SAFE_INTEGER) => {
  const cleaned = String(value ?? "").replace(/\D/g, "");
  if (!cleaned) return "";
  return String(Math.min(Number(cleaned), max));
};

const sanitizeDecimal = (value, max = 999.99, decimals = 2) => {
  const cleaned = String(value ?? "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  const firstDot = cleaned.indexOf(".");
  const normalized =
    firstDot === -1
      ? cleaned
      : `${cleaned.slice(0, firstDot + 1)}${cleaned
          .slice(firstDot + 1)
          .replace(/\./g, "")}`;

  const [integerPart = "", decimalPart = ""] = normalized.split(".");
  const limited = `${integerPart.slice(0, 3)}${
    normalized.includes(".") ? `.${decimalPart.slice(0, decimals)}` : ""
  }`;

  if (limited === "" || limited === ".") return "";
  if (Number(limited) > max) return String(max);
  return limited;
};

const normalizeDateForInput = (value) => {
  if (!value) return "";
  const raw = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const legacy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (legacy) return `${legacy[3]}-${legacy[2]}-${legacy[1]}`;

  return "";
};

const labelSx = {
  display: "block",
  mb: "5px",
  fontSize: "10px",
  lineHeight: 1,
  fontWeight: 700,
  color: "#556168",
  letterSpacing: ".035em",
  textTransform: "uppercase",
};

const inputSx = {
  width: "100%",
  "& .MuiInputBase-root": {
    height: H,
    minHeight: H,
    bgcolor: SURFACE,
    borderRadius: "7px",
    fontSize: "11.5px",
  },
  "& .MuiOutlinedInput-root": {
    p: "0 !important",
    "& fieldset": { borderColor: OPS_BORDER, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#505B60" },
    "&.Mui-focused fieldset": {
      borderColor: TEAL,
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    height: H,
    boxSizing: "border-box",
    px: "9px !important",
    py: "0 !important",
    fontSize: "11.5px !important",
    lineHeight: `${H}px`,
    color: TEXT,
  },
  "& .MuiInputLabel-root": floatingLabelSx,
  "& .MuiInputLabel-shrink": {
    transform: "translate(11px, -6px) scale(.9)",
  },
  "& .MuiInputAdornment-root": {
    m: 0,
    color: TEAL,
  },
  "& .MuiFormHelperText-root": {
    m: "3px 0 0",
    fontSize: "9px",
    lineHeight: 1.1,
  },
};

const autoSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: H,
    minHeight: H,
    p: "0 30px 0 0 !important",
    bgcolor: SURFACE,
    borderRadius: "7px",
    "& fieldset": { borderColor: OPS_BORDER, borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#505B60" },
    "&.Mui-focused fieldset": {
      borderColor: TEAL,
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root": floatingLabelSx,
  "& .MuiInputLabel-shrink": {
    transform: "translate(11px, -6px) scale(.9)",
  },
  "& .MuiAutocomplete-input": {
    height: H,
    boxSizing: "border-box",
    px: "9px !important",
    py: "0 !important",
    fontSize: "11.5px !important",
    lineHeight: `${H}px`,
  },
  "& .MuiAutocomplete-endAdornment": {
    top: "50%",
    right: 4,
    transform: "translateY(-50%)",
  },
  "& .MuiIconButton-root": {
    p: "2px",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 16,
    color: TEAL,
  },
};

const panelSx = {
  bgcolor: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  p: "14px",
};

const sectionTitleSx = {
  m: 0,
  mb: "12px",
  fontSize: "11px",
  lineHeight: 1,
  fontWeight: 700,
  color: TEXT,
  letterSpacing: ".02em",
  textTransform: "uppercase",
};

function Label({ children }) {
  return <Typography component="label" sx={labelSx}>{children}</Typography>;
}

function DenseText({
  name,
  label,
  value,
  onChange,
  type = "text",
  endAdornment,
  placeholder,
  inputMode,
  maxLength,
  sanitize,
  error,
  helperText,
}) {
  const handleChange = (event) => {
    const nextValue = sanitize
      ? sanitize(event.target.value)
      : event.target.value;

    onChange({
      ...event,
      target: {
        ...event.target,
        name,
        value: nextValue,
      },
    });
  };

  return (
    <TextField
      id={name}
      name={name}
      label={label}
      value={value ?? ""}
      onChange={handleChange}
      type={type}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      size="small"
      error={Boolean(error)}
      helperText={helperText || ""}
      inputProps={{
        inputMode,
        maxLength,
        autoComplete: "off",
      }}
      InputProps={{ endAdornment }}
      InputLabelProps={{ shrink: true }}
      sx={inputSx}
    />
  );
}

function DenseDate({ name, label, value, onChange }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <TextField
      id={name}
      inputRef={inputRef}
      name={name}
      label={label}
      type="date"
      value={normalizeDateForInput(value)}
      onChange={onChange}
      variant="outlined"
      fullWidth
      size="small"
      InputLabelProps={{ shrink: true }}
      inputProps={{
        min: "1900-01-01",
        max: "2100-12-31",
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              size="small"
              aria-label={`Abrir calendario de ${label}`}
              onClick={openPicker}
              edge="end"
              sx={{ p: "3px", color: TEAL }}
            >
              <CalendarMonthOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        ...inputSx,
        "& input[type='date']::-webkit-calendar-picker-indicator": {
          display: "none",
          WebkitAppearance: "none",
        },
      }}
    />
  );
}

function DenseMoney({ name, label, value, setFieldValue, error }) {
  return (
    <NumericFormat
      id={name}
      name={name}
      label={label}
      value={value ?? 0}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale={false}
      allowNegative={false}
      allowedDecimalSeparators={[",", "."]}
      customInput={TextField}
      variant="outlined"
      fullWidth
      size="small"
      error={Boolean(error)}
      helperText={error || ""}
      inputProps={{
        inputMode: "decimal",
        maxLength: 18,
        autoComplete: "off",
      }}
      InputLabelProps={{ shrink: true }}
      isAllowed={({ floatValue }) =>
        floatValue === undefined ||
        (floatValue >= 0 && floatValue <= LIMITS.money)
      }
      onValueChange={(values) =>
        setFieldValue(name, values.floatValue ?? 0)
      }
      sx={inputSx}
    />
  );
}

function Field({ children, sx }) {
  return <Box sx={{ minWidth: 0, ...sx }}>{children}</Box>;
}

function CatalogSelect({
  label,
  service,
  value,
  onChange,
  clientId,
  placeholder,
}) {
  const { fetch, data } = useFetch({ service, init: false });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(clientId ? { client: clientId } : {});
  }, [clientId]);

  useEffect(() => {
    const rows = data?.data || [];
    setOptions(
      rows.map((item) => ({
        label: item.description,
        value: item.id,
      }))
    );
  }, [data]);

  const selected = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  return (
    <Field>
      <Autocomplete
        disablePortal
        options={options}
        value={selected}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, current) => option.value === current.value}
        onChange={(_, option) => onChange(option?.value ?? null)}
        popupIcon={<KeyboardArrowDown />}
        clearIcon={null}
        sx={autoSx}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
            size="small"
          />
        )}
      />
    </Field>
  );
}

function CompactSwitch({ label, checked, onChange }) {
  return (
    <Box
      sx={{
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: "10px",
        bgcolor: SOFT,
        borderRadius: "6px",
      }}
    >
      <Typography sx={{ fontSize: "11px", lineHeight: 1.2, color: TEXT }}>
        {label}
      </Typography>
      <Switch
        size="small"
        checked={Boolean(checked)}
        onChange={onChange}
        sx={{
          mr: "-5px",
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#FFF" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: TEAL,
            opacity: 1,
          },
          "& .MuiSwitch-track": {
            bgcolor: "#C9D1D4",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
}

function AnalysisBox({ title, field, value, setFieldValue }) {
  const stringValue = value || "";

  return (
    <Box sx={panelSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "8px",
        }}
      >
        <Typography sx={{ ...sectionTitleSx, mb: 0 }}>{title}</Typography>
        <Typography sx={{ fontSize: "9.5px", color: MUTED }}>
          {String(stringValue).length}/2000
        </Typography>
      </Box>

      <TextField
        multiline
        minRows={2}
        maxRows={4}
        value={stringValue}
        onChange={(e) =>
          setFieldValue(field, e.target.value.slice(0, LIMITS.analysis))
        }
        inputProps={{ maxLength: LIMITS.analysis }}
        fullWidth
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            p: "7px 9px",
            borderRadius: "6px",
            bgcolor: "#FBFCFC",
            alignItems: "flex-start",
            "& fieldset": { borderColor: OPS_BORDER, borderWidth: "1px" },
            "&:hover fieldset": { borderColor: "#505B60" },
            "&.Mui-focused fieldset": {
              borderColor: TEAL,
              borderWidth: "1px",
            },
          },
          "& textarea": {
            p: "0 !important",
            fontSize: "11.5px",
            lineHeight: 1.45,
            color: TEXT,
          },
        }}
      />
    </Box>
  );
}

export const RiskProfileComponentDesktop = ({
  formik,
  ToastContainer,
  loading,
}) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#F6F8F9",
          borderRadius: "10px",
          p: "12px",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.2fr) minmax(250px, .8fr)",
            gap: "12px",
            alignItems: "stretch",
          }}
        >
          <Box sx={panelSx}>
            <Typography sx={sectionTitleSx}>Condiciones de riesgo</Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                columnGap: "12px",
                rowGap: "12px",
                alignItems: "end",
              }}
            >
              <Box sx={{ gridColumn: "span 2" }}>
                <CatalogSelect
                  label="Banco"
                  service={Banks}
                  value={formik.values.bank}
                  clientId={formik.values.client}
                  placeholder="Banco"
                  onChange={(value) => formik.setFieldValue("bank", value)}
                />
              </Box>

              <Field sx={{ gridColumn: "span 2" }}>
                <DenseText
                  name="account_number"
                  label="Número de cuenta"
                  value={formik.values.account_number}
                  inputMode="text"
                  maxLength={LIMITS.accountNumber}
                  sanitize={(value) =>
                    sanitizeAlphaNumeric(value, LIMITS.accountNumber)
                  }
                  onChange={formik.handleChange}
                />
              </Field>

              <Box sx={{ gridColumn: "span 2" }}>
                <CatalogSelect
                  label="Tipo de cuenta"
                  service={AccountTypes}
                  value={formik.values.account_type}
                  clientId={formik.values.client}
                  placeholder="Tipo de cuenta"
                  onChange={(value) =>
                    formik.setFieldValue("account_type", value)
                  }
                />
              </Box>

              <Field>
                <DenseText
                  name="data_credit_score"
                  label="Puntaje"
                  value={formik.values.data_credit_score ?? ""}
                  inputMode="numeric"
                  maxLength={3}
                  sanitize={(value) => sanitizeInteger(value, LIMITS.score)}
                  onChange={(e) =>
                    formik.setFieldValue("data_credit_score", e.target.value)
                  }
                  endAdornment={
                    <InfoOutlined sx={{ fontSize: 12.5, color: TEAL }} />
                  }
                />
              </Field>

              <Field>
                <DenseDate
                  name="score_date"
                  label="Fecha puntaje"
                  value={formik.values.score_date ?? ""}
                  onChange={(e) =>
                    formik.setFieldValue("score_date", e.target.value)
                  }
                />
              </Field>

              <Field>
                <DenseText
                  name="discount_rate_investor"
                  label="Tasa inversionista"
                  value={formik.values.discount_rate_investor ?? ""}
                  inputMode="decimal"
                  maxLength={6}
                  sanitize={(value) =>
                    sanitizeDecimal(value, LIMITS.rate, 2)
                  }
                  onChange={formik.handleChange}
                  endAdornment={
                    <Typography sx={{ fontSize: 11, color: TEAL }}>%</Typography>
                  }
                />
              </Field>

              <Field>
                <DenseText
                  name="discount_rate"
                  label="Tasa descuento"
                  value={formik.values.discount_rate ?? ""}
                  inputMode="decimal"
                  maxLength={6}
                  sanitize={(value) =>
                    sanitizeDecimal(value, LIMITS.rate, 2)
                  }
                  onChange={formik.handleChange}
                  endAdornment={
                    <Typography sx={{ fontSize: 11, color: TEAL }}>%</Typography>
                  }
                />
              </Field>

              <Field sx={{ gridColumn: "span 2" }}>
                <DenseMoney
                  name="emitter_balance"
                  label="Cupo emisor"
                  value={formik.values.emitter_balance}
                  error={formik.errors.emitter_balance}
                  setFieldValue={formik.setFieldValue}
                />
              </Field>

              <Field sx={{ gridColumn: "span 2" }}>
                <DenseMoney
                  name="investor_balance"
                  label="Cupo inversionista"
                  value={formik.values.investor_balance}
                  error={formik.errors.investor_balance}
                  setFieldValue={formik.setFieldValue}
                />
              </Field>

              <Field sx={{ gridColumn: "span 2" }}>
                <DenseMoney
                  name="payer_balance"
                  label="Cupo pagador"
                  value={formik.values.payer_balance}
                  error={formik.errors.payer_balance}
                  setFieldValue={formik.setFieldValue}
                />
              </Field>
            </Box>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={sectionTitleSx}>Retenciones</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <CompactSwitch
                label="Gasto de mantenimiento (GM)"
                checked={formik.values.gmf}
                onChange={(e) => formik.setFieldValue("gmf", e.target.checked)}
              />
              <CompactSwitch
                label="Retención ICA"
                checked={formik.values.ica}
                onChange={(e) => formik.setFieldValue("ica", e.target.checked)}
              />
              <CompactSwitch
                label="Retención IVA"
                checked={formik.values.iva}
                onChange={(e) => formik.setFieldValue("iva", e.target.checked)}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: "12px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <AnalysisBox
            title="Análisis cualitativo"
            field="qualitative_analysis"
            value={formik.values.qualitative_analysis}
            setFieldValue={formik.setFieldValue}
          />
          <AnalysisBox
            title="Análisis financiero"
            field="financial_analysis"
            value={formik.values.financial_analysis}
            setFieldValue={formik.setFieldValue}
          />
        </Box>

        <Box
          sx={{
            ...panelSx,
            mt: "12px",
            p: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              minHeight: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "14px",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: TEXT }}>
                Entidad financiera
              </Typography>
              <Typography sx={{ fontSize: 10, color: MUTED }}>
                Nombre Entidad · $0 · 590
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <IconButton size="small">
                <ExpandMore sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small">
                <EditOutlined sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton size="small" color="error">
                <DeleteOutline sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr .75fr auto",
              gap: "10px",
              alignItems: "end",
              p: "12px 14px",
            }}
          >
            <Field>
              <DenseText
                name="financial_entity_name"
                label="Nombre entidad"
                value="Nombre Entidad"
                maxLength={120}
                sanitize={(value) =>
                  String(value ?? "")
                    .replace(/[^A-Za-zÀ-ÿ0-9 .-]/g, "")
                    .slice(0, 120)
                }
                onChange={() => {}}
              />
            </Field>

            <Field>
              <DenseText
                name="financial_entity_balance"
                label="Saldo"
                value="0"
                inputMode="decimal"
                maxLength={18}
                sanitize={(value) =>
                  String(value ?? "").replace(/[^\d.,]/g, "").slice(0, 18)
                }
                onChange={() => {}}
              />
            </Field>

            <Field>
              <DenseText
                name="financial_entity_score"
                label="Calificación"
                value="590"
                inputMode="numeric"
                maxLength={3}
                sanitize={(value) => sanitizeInteger(value, LIMITS.score)}
                onChange={() => {}}
              />
            </Field>

            <Button
              variant="text"
              sx={{
                height: H,
                minWidth: 0,
                px: "10px",
                color: TEAL,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Agregar
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "12px" }}>
          <Button
            variant="contained"
            onClick={formik.handleSubmit}
            disabled={loading}
            sx={{
              height: 34,
              minWidth: 118,
              px: "20px",
              bgcolor: TEAL,
              borderRadius: "6px",
              boxShadow: "none",
              fontSize: 11.5,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#347B80",
                boxShadow: "none",
              },
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
    </>
  );
};
