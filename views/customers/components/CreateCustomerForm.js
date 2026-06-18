import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { Button, IconButton, InputAdornment } from "@mui/material";
import smartLogo from "../../../public/assets/Logo Smart - Lite.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import CIIUSelect from "@components/selects/CIIUSelect";
import BrokerSelect from "@components/selects/brokerSelect";
import CitizenshipSelect from "@components/selects/citizenshipSelect";
import CitizenshipSelect2 from "@components/selects/citizenshipSelect2";
import CitySelect from "@components/selects/citySelect";
import ClientRoleSelect from "@components/selects/ClientCreateSelects/clientRoleSelect";
import CitySelect2 from "@components/selects/citySelect2";
import ClientTypeSelect from "@components/selects/clientTypeSelect";
import DepartmentSelect from "@components/selects/departmentSelect";
import DepartmentSelect2 from "@components/selects/departmentSelect2";
import TypeIDSelect from "@components/selects/typeIdentitySelect";
import TypeIDSelect2 from "@components/selects/typeIdentitySelect2";
import { Toast } from "@components/toast";
import { useTheme, useMediaQuery } from "@mui/material";
import { useFetch } from "@hooks/useFetch";


import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import LoadingCircle from "@styles/loading";
import Image from "next/image";
import DocumentNumberSelect from "@components/selects/ClientCreateSelects/documentNumberSelect";
import NombreClientSelect from "@components/selects/ClientCreateSelects/NombreClientSelect";
import ApellidoClientSelect from "@components/selects/ClientCreateSelects/apellidoClientSelect";
import DirecciónClientSelect from "@components/selects/ClientCreateSelects/direcciónClientSelect";
import TelefonoClientSelect from "@components/selects/ClientCreateSelects/telefonoClientSelect";
import DatePickerSelect from "@components/selects/ClientCreateSelects/datePickerSelect";
import LegalRepresentativeDireccionSelect from "@components/selects/ClientCreateSelects/legalRepresentativeDireccionSelect";
import LegalRepresentativeDocumentNumberSelect from "@components/selects/ClientCreateSelects/legalRepresentativeDocumentNumberSelect";
import LegalRepresentativeEmailSelect from "@components/selects/ClientCreateSelects/legalRepresentativeEmailSelect";
import LegalRepresentativeFirstNameSelect from "@components/selects/ClientCreateSelects/legalRepresentativeFirstNameSelect";
import LegalRepresentativeLastNameSelect from "@components/selects/ClientCreateSelects/legalRepresentativeLastNameSelect";
import LegalRepresentativeNacimientoSelect from "@components/selects/ClientCreateSelects/legalRepresentativeNacimientoSelect";
import LegalRepresentativePhoneNumberSelect from "@components/selects/ClientCreateSelects/legalRepresentativePhoneNumberSelect";
import LegalRepresentativePositionSelect from "@components/selects/ClientCreateSelects/legalRepresentativePositionSelect";
import EmailClientSelect from "@components/selects/ClientCreateSelects/correoElectronicoClientSelect";
import RazonSocialSelect from "@components/selects/ClientCreateSelects/razonSocialSelect";

// ---- Config
const DEFAULT_AVATAR =
  "https://devsmartevolution.s3.us-east-1.amazonaws.com/clients-profiles/default-profile.svg";

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png"];

// ✅ Dropzone Avatar
function AvatarDropzone({ valueUrl, onPickFile, disabled }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const validate = (file) => {
    if (!ALLOWED.includes(file.type)) {
      Toast("Solo JPG o PNG", "error");
      return false;
    }
    if (file.size > MAX_BYTES) {
      Toast(`Máximo ${MAX_MB}MB`, "error");
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!validate(file)) return;
    onPickFile(file);
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => e.preventDefault();

  return (
    <Box
      onClick={openPicker}
      onDrop={onDrop}
      onDragOver={onDragOver}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 78,
          height: 78,
          borderRadius: "999px",
          overflow: "hidden",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "2px dashed #D9E7E7",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#fff",
          transition: "0.15s",
          "&:hover": disabled
            ? {}
            : { borderColor: "#2B8C90", transform: "translateY(-1px)" },
        }}
        title={disabled ? "" : "Click o arrastra una imagen (JPG/PNG, máx 2MB)"}
      >
        <Box
          component="img"
          src={valueUrl || DEFAULT_AVATAR}
          alt="avatar"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: "none" }}
        onChange={onChange}
      />
    </Box>
  );
}

export function Paso0ConAvatar({ formik, option }) {
  const disabled = option === "preview";

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

 const avatarUrl = avatarPreview || formik?.values?.profile_image || DEFAULT_AVATAR;
  const onPickFile = (file) => {
  setAvatarFile(file);
  formik.setFieldValue("profile_changed", true);

  const reader = new FileReader();
  reader.onload = (e) => {
    formik.setFieldValue("profile_image", e.target.result); // dataURL completo
  };
  reader.readAsDataURL(file);
};


  return (
    <Box sx={{ textAlign: "center", mb: 0.75, ml: 0 }}>
      <Box sx={{ textAlign: "center", mb: 0.75, ml: 0 }}>
        <AvatarDropzone
          valueUrl={avatarUrl}
          onPickFile={onPickFile}
          disabled={disabled}
        />

        
      </Box>
    </Box>
  );
}

// ✅ Conector (la línea entre pasos)
const SmartConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderLeftWidth: 3,
    borderColor: "#D9E7E7",
    minHeight: 26,
    marginLeft: 10,
  },
}));

/**
 * ✅ Icono personalizado (círculo)
 * - completed: verde lleno + número blanco
 * - active: borde verde + número verde
 * - error: borde rojo + número rojo
 */
function SmartStepIcon(props) {
  const { active, completed, icon, error } = props;

  const border = error ? "#D32F2F" : completed || active ? "#2E7D32" : "#BFDADA";
  const bg = error ? "#D32F2F" : completed ? "#2E7D32" : "#FFFFFF";
  const color = error ? "#FFFFFF" : completed ? "#FFFFFF" : active ? "#2E7D32" : "#BFDADA";

  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "999px",
        border: `2px solid ${border}`,
        backgroundColor: bg,
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 800,
        color,
      }}
    >
      {icon}
    </Box>
  );
}


// ✅ Texto del label con “Paso X” + estado
function StepLabelContent({ stepNumber, title, status, active, completed, error }) {
  const titleColor = completed ? "#333" : active ? "#333" : "#666";
  const statusColor = error ? "#D32F2F" : completed ? "#2E7D32" : active ? "#2B8C90" : "#9AA3A3";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#777" }}>
        Paso {stepNumber}
      </Typography>

      <Typography sx={{ fontSize: 13, fontWeight: 800, color: titleColor }}>
        {title}
      </Typography>

      <Typography sx={{ fontSize: 12, fontWeight: 700, color: statusColor }}>
        {status}
      </Typography>
    </Box>
  );
}

const FormWrap = ({ children }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: "none",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      rowGap: { xs: 0.75, md: 0.85 },
      alignItems: "start",
      boxSizing: "border-box",
    }}
  >
    {children}
  </Box>
);

const FieldWrap = ({ children }) => (
  <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>{children}</Box>
);

const fullRowSx = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const namePairRowSx = {
  width: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
  columnGap: { xs: 0, sm: 1.4 },
  rowGap: { xs: 0.75, sm: 0 },
  alignItems: "start",
  boxSizing: "border-box",
  mb: 0.55,
};

const cleanNativeInputSx = (hasError = false) => ({
  width: "100%",
  minWidth: 0,
  height: 40,
  border: `1.4px solid ${hasError ? "#E66431" : "#9CCFD0"}`,
  borderRadius: "6px",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  color: "#202A33",
  fontFamily: "inherit",
  fontSize: "0.98rem",
  lineHeight: "40px",
  px: 1.5,
  outline: "none",
  display: "block",
  boxShadow: "none",
  "&::placeholder": {
    color: "#C9C9C9",
    opacity: 1,
  },
  "&:focus": {
    borderColor: hasError ? "#E66431" : "#5EA9AA",
  },
  "&:disabled": {
    color: "#202A33",
    WebkitTextFillColor: "#202A33",
    opacity: 1,
    backgroundColor: "#FFFFFF",
    cursor: "default",
  },
});

const phoneNativeWrapSx = (hasError = false) => ({
  width: "100%",
  minWidth: 0,
  height: 40,
  border: `1.4px solid ${hasError ? "#E66431" : "#9CCFD0"}`,
  borderRadius: "6px",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  mb: 0.55,
  "&:focus-within": {
    borderColor: hasError ? "#E66431" : "#5EA9AA",
  },
});

function CleanCustomerInput({ formik, name, placeholder, disabled }) {
  const hasError = Boolean(formik?.touched?.[name] && formik?.errors?.[name]);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        component="input"
        name={name}
        value={formik?.values?.[name] || ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        sx={cleanNativeInputSx(hasError)}
      />
      {hasError && <HelperText>{formik?.errors?.[name]}</HelperText>}
    </Box>
  );
}

function CleanCustomerPhoneInput({ formik, disabled }) {
  const value = formik?.values?.phone_number ?? formik?.values?.phone ?? "";
  const hasError = Boolean(
    (formik?.touched?.phone_number && formik?.errors?.phone_number) ||
      (formik?.touched?.phone && formik?.errors?.phone)
  );
  const errorText = formik?.errors?.phone_number || formik?.errors?.phone;

  return (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", display: "block" }}>
      <Box sx={phoneNativeWrapSx(hasError)}>
        <Box
          component="span"
          sx={{
            flex: "0 0 auto",
            px: 1.15,
            color: "#5EA9AA",
            fontSize: "1.15rem",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          +
        </Box>
        <Box
          component="input"
          name="phone_number"
          value={value || ""}
          placeholder="Ingresa tu número de teléfono"
          disabled={disabled}
          onChange={(event) => {
            const nextValue = event.target.value;
            formik?.setFieldValue?.("phone_number", nextValue);
            formik?.setFieldValue?.("phone", nextValue);
          }}
          onBlur={formik?.handleBlur}
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            height: "100%",
            border: 0,
            outline: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            color: "#202A33",
            fontFamily: "inherit",
            fontSize: "0.98rem",
            px: 0.5,
            "&::placeholder": { color: "#C9C9C9", opacity: 1 },
            "&:disabled": {
              color: "#202A33",
              WebkitTextFillColor: "#202A33",
              opacity: 1,
              cursor: "default",
            },
          }}
        />
      </Box>
      {hasError && <HelperText>{errorText}</HelperText>}
    </Box>
  );
}


const cleanNamePairShellSx = (hasFirstError = false, hasLastError = false) => ({
  width: "100%",
  minWidth: 0,
  height: 40,
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
  border: `1.4px solid ${hasFirstError || hasLastError ? "#E66431" : "#9CCFD0"}`,
  borderRadius: "6px",
  overflow: "hidden",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  mb: 0.55,
  "&:focus-within": {
    borderColor: hasFirstError || hasLastError ? "#E66431" : "#5EA9AA",
  },
});

const cleanNamePairInputSx = (side = "left") => ({
  width: "100%",
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  boxShadow: "none",
  backgroundColor: "#FFFFFF",
  color: "#202A33",
  fontFamily: "inherit",
  fontSize: "0.98rem",
  lineHeight: "1.25",
  padding: "7px 14px",
  boxSizing: "border-box",
  borderLeft: {
    xs: 0,
    sm: side === "right" ? "1.4px solid #9CCFD0" : 0,
  },
  "&::placeholder": {
    color: "#C9C9C9",
    opacity: 1,
  },
  "&:disabled": {
    color: "#202A33",
    WebkitTextFillColor: "#202A33",
    opacity: 1,
    cursor: "default",
  },
});

function CleanCustomerNamePair({ formik, disabled }) {
  const firstError = Boolean(formik?.touched?.first_name && formik?.errors?.first_name);
  const lastError = Boolean(formik?.touched?.last_name && formik?.errors?.last_name);

  return (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", display: "block" }}>
      <Box sx={cleanNamePairShellSx(firstError, lastError)}>
        <Box
          component="input"
          name="first_name"
          value={formik?.values?.first_name || ""}
          placeholder="Nombre"
          disabled={disabled}
          onChange={formik?.handleChange}
          onBlur={formik?.handleBlur}
          sx={cleanNamePairInputSx("left")}
        />
        <Box
          component="input"
          name="last_name"
          value={formik?.values?.last_name || ""}
          placeholder="Apellido"
          disabled={disabled}
          onChange={formik?.handleChange}
          onBlur={formik?.handleBlur}
          sx={cleanNamePairInputSx("right")}
        />
      </Box>
      {(firstError || lastError) && (
        <HelperText>{formik?.errors?.first_name || formik?.errors?.last_name}</HelperText>
      )}
    </Box>
  );
}


const twoColumnPersonSx = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  columnGap: { xs: 0, sm: 1.4, md: 1.6 },
  rowGap: { xs: 0.35, sm: 0 },
  alignItems: "start",
  mb: 0.25,
};

const compactPhoneSx = {
  my: "4px !important",
  width: "100%",
  border: "1px solid #9CCFD0 !important",
  borderRadius: "6px !important",
  backgroundColor: "#FFFFFF",
  overflow: "hidden",
  boxSizing: "border-box",
  boxShadow: "none !important",
  "& .MuiInputBase-root, & .MuiOutlinedInput-root": {
    minHeight: "40px !important",
    height: "40px !important",
    border: "0 !important",
    boxShadow: "none !important",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiInputAdornment-root": {
    marginLeft: "4px",
    marginRight: "2px",
    color: "#5EA9AA",
  },
  "& input": {
    padding: "7px 12px !important",
    fontSize: "0.98rem !important",
    lineHeight: "1.25 !important",
  },
  "& fieldset": {
    border: "0 !important",
  },
};


const personFieldItemSx = {
  minWidth: 0,
  width: "100%",
  "& .MuiFormControl-root": {
    width: "100%",
    margin: "4px 0 !important",
  },
};

const compactMuiTextFieldSx = {
  my: "4px !important",
  width: "100%",
  "& .MuiInputBase-root": {
    minHeight: "40px !important",
    border: "1px solid #9CCFD0 !important",
    borderRadius: "6px !important",
    backgroundColor: "#FFFFFF",
    boxShadow: "none !important",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .MuiInputBase-input": {
    padding: "7px 12px !important",
    fontSize: "0.98rem !important",
    lineHeight: "1.25 !important",
  },
  "& .MuiInput-root:before, & .MuiInput-root:after": {
    display: "none !important",
  },
  "& fieldset": {
    border: "0 !important",
  },
};

const compactMuiTextFieldErrorSx = {
  "& .MuiInputBase-root": {
    borderColor: "#E66431 !important",
  },
};

const phoneFieldWrapperSx = {
  width: "100%",
  minWidth: 0,
  "& .MuiFormControl-root": {
    width: "100%",
    margin: "4px 0 !important",
  },
  "& .MuiInputBase-root, & .MuiOutlinedInput-root": {
    minHeight: "40px !important",
    borderRadius: "6px !important",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
  "& input": {
    padding: "7px 12px !important",
    fontSize: "0.98rem !important",
    lineHeight: "1.25 !important",
  },
  "& .MuiInputAdornment-root": {
    marginLeft: "4px",
    marginRight: "2px",
    color: "#5EA9AA",
  },
};




const SmartStepperSidebar = ({
  steps,
  activeStep,
  getStepHasError,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => (
  <Grid
    item
    sx={{
      display: { xs: "none", md: "flex" },
      width: sidebarCollapsed ? 78 : 292,
      flexShrink: 0,
      minHeight: 0,
      transition: "width 0.25s ease",
    }}
  >
    <Box
      sx={{
        bgcolor: "#F8FAFA",
        border: "1px solid #E3EEEE",
        borderRadius: 3,
        boxShadow: "0px 10px 28px rgba(28, 62, 62, 0.08)",
        p: sidebarCollapsed ? 1 : 1.5,
        width: "100%",
        height: "calc(100vh - 48px)",
        minHeight: "calc(100vh - 48px)",
        maxHeight: "calc(100vh - 48px)",
        position: { md: "sticky", xs: "static" },
        top: { md: 12, xs: "auto" },
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        size="small"
        onClick={() => setSidebarCollapsed((prev) => !prev)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          color: "#6D7777",
          bgcolor: "transparent",
          border: "0",
          boxShadow: "none",
          zIndex: 2,
          "&:hover": { bgcolor: "#EAF4F4", color: "#2B8C90" },
        }}
        aria-label={sidebarCollapsed ? "Expandir pasos" : "Contraer pasos"}
      >
        <Typography sx={{ fontSize: 22, lineHeight: 1, fontWeight: 900 }}>
          {sidebarCollapsed ? "›" : "‹"}
        </Typography>
      </IconButton>

      <Box
        sx={{
          mb: sidebarCollapsed ? 4 : 2,
          mt: sidebarCollapsed ? 3.2 : 0,
          display: "flex",
          justifyContent: sidebarCollapsed ? "center" : "flex-start",
        }}
      >
        <Image
          src={smartLogo}
          alt="logo"
          style={{
            maxWidth: sidebarCollapsed ? 54 : 148,
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {false && !sidebarCollapsed && null}

      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={<SmartConnector />}
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: sidebarCollapsed ? 0 : 0.5,
          alignItems: sidebarCollapsed ? "center" : "stretch",
          "& .MuiStep-root": { minHeight: sidebarCollapsed ? 88 : 82 },
          "& .MuiStepLabel-root": {
            alignItems: "flex-start",
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
          },
          "& .MuiStepLabel-labelContainer": {
            display: sidebarCollapsed ? "none" : "block",
            mt: "1px",
            ml: 1,
          },
          "& .MuiStepConnector-root": {
            ml: sidebarCollapsed ? 0 : undefined,
          },
        }}
      >
        {steps.map((s, index) => {
          const completed = index < activeStep && !getStepHasError(index);
          const active = index === activeStep;
          const error = getStepHasError(index);
          const status = error
            ? "Incompleto"
            : completed
            ? "Completado"
            : active
            ? "En proceso"
            : "Pendiente";

          return (
            <Step key={`${s.title}-${index}`} completed={completed} active={active}>
              <StepLabel StepIconComponent={SmartStepIcon} error={error}>
                {!sidebarCollapsed && (
                  <StepLabelContent
                    stepNumber={index + 1}
                    title={s.title}
                    status={status}
                    active={active}
                    completed={completed}
                    error={error}
                  />
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  </Grid>
);


// -------------------- Helpers: errores por step --------------------

const getIn = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const setTouchedByPaths = (paths = []) => {
  // convierte ["a.b", "c"] => { a: { b: true }, c: true }
  const out = {};
  for (const p of paths) {
    const parts = p.split(".");
    let cur = out;
    parts.forEach((k, i) => {
      if (i === parts.length - 1) cur[k] = true;
      else {
        cur[k] = cur[k] || {};
        cur = cur[k];
      }
    });
  }
  return out;
};

/**
 * ✅ Ajusta esto a tus nombres reales en Formik/Yup.
 * - Paso 0: info básica
 * - Paso 1: contacto
 * - Paso 2: rol
 * - Paso 3: representante legal (jurídica)
 * - Paso 4: contactos (jurídica)
 */
const STEP_FIELDS = {
  0: [
    "type_client",
    "type_id",
    "document_number",
    // "first_name", "last_name" (natural)
    // "razon_social" (juridica)
    "birth_or_constitution_date",
  ],
  1: ["citizenship", "department", "city", "address", "phone", "email", "broker_id"],
  2: ["rol_client"],

  // solo jurídica
  3: [
    "legal_representative.type_id",
    "legal_representative.document_number",
    "legal_representative.first_name",
    "legal_representative.last_name",
    "legal_representative.birth_date",
    "legal_representative.address",
    "legal_representative.phone",
    "legal_representative.email",
    "legal_representative.department",
    "legal_representative.city",
    "legal_representative.position",
    "legal_representative.citizenship",
  ],
  4: ["contacts"], // aquí normalmente validas por Yup interno del array
};

export const CreateCustomerForm = ({
  formik,
  option,
  handleChange,
  loading,
  valueD,
  enteredBy,
  valueDate,
  handleChangeDate,
  roles,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const JURIDICA_ID = "21cf32d9-522c-43ac-b41c-4dfdf832a7b8";
  const isJuridica = formik?.values?.type_client === JURIDICA_ID;

  // ✅ marca pasos que el usuario intentó avanzar (para pintarlos en rojo si fallan)
  const [attemptedSteps, setAttemptedSteps] = useState({}); // { [index]: true }

  // ✅ Steps dinámicos
  const steps = useMemo(() => {
    const base = [
      { title: "Información Básica" },
      { title: "Información de contacto" },
      { title: "Rol de Cliente" },
    ];
    if (isJuridica) {
      base.push({ title: "Representante Legal" });
      base.push({ title: "Contacto" });
    }
    return base;
  }, [isJuridica]);

  useEffect(() => {
    const lastIndex = steps.length - 1;
    if (activeStep > lastIndex) setActiveStep(lastIndex);
  }, [steps.length, activeStep]);

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const addContact = () => {
    const next = [
      ...(formik.values.contacts || []),
      {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
      },
    ];
    formik.setFieldValue("contacts", next);
  };

  const handleRemoveContact = (index) => {
    const next = [...(formik.values.contacts || [])];
    next.splice(index, 1);
    formik.setFieldValue("contacts", next);
  };

  // ✅ decide si un paso debe mostrarse como error (rojo)
  const getStepHasError = (index) => {
    if (!attemptedSteps[index]) return false; // solo se pone rojo si lo intentaron
    const fields = STEP_FIELDS[index] || [];

    // Si el paso no aplica (ej: representante/contactos en natural), no hay error
    if (!isJuridica && (index === 3 || index === 4)) return false;

    // error directo por paths
    for (const p of fields) {
      const err = getIn(formik.errors, p);
      if (err) return true;
    }

    // caso especial: contacts suele ser array -> si yup devuelve errors.contacts[0].x, esto lo detecta:
    if (index === 4 && formik.errors?.contacts) return true;

    return false;
  };

  // ✅ valida el paso actual antes de avanzar
  const handleNext = async () => {
    // marca que intentó avanzar este paso
    setAttemptedSteps((prev) => ({ ...prev, [activeStep]: true }));

    // fuerza validación
    const errors = await formik.validateForm();

    // marca touched en los campos del paso (para que se vean helperText)
    const fields = STEP_FIELDS[activeStep] || [];
    if (fields.length) {
      formik.setTouched(
        {
          ...(formik.touched || {}),
          ...setTouchedByPaths(fields),
        },
        true
      );
    }

    // si este paso tiene errores, no avanza
    const hasErrorNow = (() => {
      if (!isJuridica && (activeStep === 3 || activeStep === 4)) return false;
      for (const p of fields) {
        if (getIn(errors, p)) return true;
      }
      if (activeStep === 4 && errors?.contacts) return true;
      return false;
    })();

    if (hasErrorNow) {
  Toast("Faltan campos", "error");

  // ✅ AVANZA IGUAL (pero ya quedó marcado el paso en rojo por attemptedSteps)
  setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  return;
}


    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  // ✅ Toast si intentan enviar con errores (submit)
  useEffect(() => {
    if (
      formik?.errors &&
      Object.keys(formik.errors).length !== 0 &&
      formik?.isSubmitting
    ) {
      // marca todos los pasos como intentados para que el stepper muestre en rojo
      const all = {};
      for (let i = 0; i < steps.length; i++) all[i] = true;
      setAttemptedSteps(all);

      Toast("Faltan campos", "error");
    }
  }, [formik?.errors, formik?.isSubmitting, steps.length]);

  return (
  <Box
    sx={{
      width: "100%",
      maxWidth: "100%",
      mx: 0,
      px: { xs: 1, sm: 1.25, md: 1.5 },
      py: { xs: 1, md: 1.5 },
      bgcolor: { xs: "transparent", md: "transparent" },
      boxSizing: "border-box",
      overflowX: "hidden",
    }}
  >
    <Grid container spacing={0} alignItems="stretch" sx={{ minHeight: { md: "calc(100vh - 48px)" }, columnGap: { md: 1.5 }, flexWrap: { md: "nowrap" }, width: "100%", m: 0, overflowX: "hidden" }}>

      <SmartStepperSidebar
        steps={steps}
        activeStep={activeStep}
        getStepHasError={getStepHasError}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* ===================== RIGHT PANEL (FORM) ===================== */}
      <Grid item xs sx={{ minWidth: 0, display: "flex" }}>
        {/* Card wrapper */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: { xs: "none", md: "0px 10px 28px rgba(28, 62, 62, 0.07)" },
            border: { xs: "none", md: "1px solid #E8F0F0" },
            p: { xs: 1.25, sm: 1.75, md: 2.25 },
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarGutter: "stable",
            height: { md: "calc(100vh - 48px)" },
            minHeight: { md: "calc(100vh - 48px)" },
            "& form": { margin: 0 },
            "& .MuiFormControl-root": { my: "4px" },
            "& .MuiInputBase-root": {
              minHeight: 38,
              fontSize: "0.98rem",
            },
            "& .MuiInputBase-input": {
              py: "7px !important",
              px: "12px !important",
            },
            "& .MuiAutocomplete-inputRoot": {
              py: "0px !important",
              minHeight: 38,
            },
            "& label": { fontSize: "0.84rem" },
            "& .MuiTypography-root": { lineHeight: 1.18 },
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarGutter: "stable",
            height: { md: "calc(100vh - 48px)" },
            minHeight: { md: "calc(100vh - 48px)" },
            "& form": { margin: 0 },
            "& .MuiFormControl-root": { my: "4px" },
            "& .MuiInputBase-root": {
              minHeight: 38,
              fontSize: "0.98rem",
            },
            "& .MuiInputBase-input": {
              py: "7px !important",
              px: "12px !important",
            },
            "& .MuiAutocomplete-inputRoot": {
              py: "0px !important",
              minHeight: 38,
            },
            "& label": { fontSize: "0.84rem" },
            "& .MuiTypography-root": { lineHeight: 1.18 },
          }}
        >
          {/* Title */}
          <Typography
            letterSpacing={0}
            fontSize={{ xs: "1.15rem", sm: "1.35rem", md: "1.55rem" }}
            fontWeight="700"
            mb={{ xs: 1, md: 1 }}
            color="#2B8C90"
            sx={{ textAlign: { xs: "left", md: "left" } }}
          >
            {option === "register" && "Registrar Nuevo Cliente"}
          </Typography>

          {/* ===================== MOBILE STEPPER (TOP) ===================== */}
          {isMobile && (
            <Box
              sx={{
                mb: 2,
                px: 0.5,
              }}
            >
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  "& .MuiStepConnector-line": { borderTopWidth: 3 },
                  "& .MuiStepLabel-label": { display: "none" }, // ✅ más limpio en mobile
                }}
              >
                {steps.map((s, index) => {
                  const completed = index < activeStep && !getStepHasError(index);
                  const active = index === activeStep;
                  const error = getStepHasError(index);

                  return (
                    <Step key={s.title} completed={completed} active={active}>
                      <StepLabel StepIconComponent={SmartStepIcon} error={error} />
                    </Step>
                  );
                })}
              </Stepper>

              {/* Texto compacto */}
              <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 12, color: "#777", fontWeight: 700 }}>
                  Paso {activeStep + 1} / {steps.length}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#2B8C90", fontWeight: 800 }}>
                  {steps?.[activeStep]?.title}
                </Typography>
              </Box>
            </Box>
          )}

          {/* ===================== FORM BODY (CENTERED) ===================== */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "none", // ✅ usa todo el ancho disponible
              mx: 0, // ✅ evita espacios laterales innecesarios
              px: { xs: 0.75, md: 1.5 },
              boxSizing: "border-box",
            }}
          >
            {/* PASO 0 */}
            {activeStep === 0 &&
              (!loading ? (
                <Box sx={{ width: "100%" }}>
                  <Paso0ConAvatar formik={formik} option={option} />

                  <FormWrap>
                    <FieldWrap>
                      <ClientTypeSelect formik={formik} disabled={option === "preview"} />
                    </FieldWrap>

                    <FieldWrap>
                      <TypeIDSelect formik={formik} disabled={option === "preview"} />
                    </FieldWrap>

                    <FieldWrap>
                      <DocumentNumberSelect formik={formik} option={option} />
                    </FieldWrap>

                    {/* Natural */}
                    {formik?.values.type_client === "26c885fc-2a53-4199-a6c1-7e4e92032696" && (
                      <CleanCustomerNamePair formik={formik} disabled={option === "preview"} />
                    )}

                    {/* Jurídica */}
                    {formik?.values.type_client === "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" && (
                      <Box sx={{ width: "100%" }}>
                        <FieldWrap>
                          <RazonSocialSelect formik={formik} option={option} />
                        </FieldWrap>
                      </Box>
                    )}

                    {formik?.values.type_client === "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" && (
                      <Box sx={{ width: "100%" }}>
                        <FieldWrap>
                          <CIIUSelect formik={formik} disabled={option === "preview"} />
                        </FieldWrap>
                      </Box>
                    )}

                    <Box sx={{ width: "100%" }}>
                      <InputTitles>
                        {formik?.values.type_client === "21cf32d9-522c-43ac-b41c-4dfdf832a7b8"
                          ? "Fecha de constitución"
                          : "Fecha de nacimiento"}
                      </InputTitles>
                      <DatePickerSelect
                        formik={formik}
                        option={option}
                        valueDate={valueDate}
                        handleChangeDate={handleChangeDate}
                      />
                    </Box>
                  </FormWrap>
                </Box>
              ) : (
                <LoadingCircle />
              ))}

            {/* PASO 1 */}
            {activeStep === 1 && (
              <FormWrap>
                <FieldWrap>
                  <CitizenshipSelect formik={formik} disabled={option === "preview"} />
                </FieldWrap>

                <FieldWrap>
                  <DepartmentSelect formik={formik} />
                </FieldWrap>

                <FieldWrap>
                  <CitySelect formik={formik} />
                </FieldWrap>

                <FieldWrap>
                  <DirecciónClientSelect formik={formik} option={option} />
                </FieldWrap>

                <FieldWrap>
                  <CleanCustomerPhoneInput formik={formik} disabled={option === "preview"} />
                </FieldWrap>

                <FieldWrap>
                  <EmailClientSelect formik={formik} option={option} />
                </FieldWrap>

                <FieldWrap>
                  <BrokerSelect formik={formik} disabled={option === "preview"} />
                </FieldWrap>
              </FormWrap>
            )}

            {/* PASO 2 */}
            {activeStep === 2 &&
              (!loading ? (
                <FormWrap>
                  <FieldWrap>
                    <ClientRoleSelect
                      formik={formik}
                      disabled={option === "preview"}
                      roles={roles}
                    />
                  </FieldWrap>
                </FormWrap>
              ) : (
                <LoadingCircle />
              ))}

            {/* PASO 3 */}
            {activeStep === 3 &&
              (isJuridica ? (
                !loading ? (
                  <FormWrap>
                    <TypeIDSelect2 formik={formik} disabled={option === "preview"} />
                    <LegalRepresentativeDocumentNumberSelect formik={formik} option={option} />
                    <LegalRepresentativeFirstNameSelect formik={formik} option={option} />
                    <LegalRepresentativeLastNameSelect option={option} formik={formik} />
                    <LegalRepresentativeNacimientoSelect
                      formik={formik}
                      option={option}
                      handleChange={handleChange}
                      valueD={valueD}
                    />
                    <LegalRepresentativeDireccionSelect formik={formik} option={option} />
                    <LegalRepresentativePhoneNumberSelect formik={formik} option={option} />
                    <LegalRepresentativeEmailSelect formik={formik} option={option} />
                    <DepartmentSelect2 formik={formik} disabled={option === "preview"} />
                    <CitySelect2 formik={formik} disabled={option === "preview"} />
                    <LegalRepresentativePositionSelect formik={formik} option={option} />
                    <CitizenshipSelect2 formik={formik} disabled={option === "preview"} />
                  </FormWrap>
                ) : (
                  <LoadingCircle />
                )
              ) : null)}

            {/* PASO 4 */}
            {activeStep === 4 &&
              (isJuridica ? (
                !loading ? (
                  <FormWrap>
                    <Box display="flex" flexDirection="column" alignItems="stretch">
                      {formik?.values.contacts?.map((contact, index) => (
                        <Box key={index} sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                            <Typography
                              letterSpacing={0}
                              fontSize="1.1rem"
                              fontWeight="700"
                              color="#5EA3A3"
                            >
                              Contacto {index + 1}
                            </Typography>

                            <Button
                              sx={{ ml: 1 }}
                              onClick={() => handleRemoveContact(index)}
                              disabled={option === "preview" || formik?.values.contacts.length === 1}
                            >
                              <i
                                className="fa-regular fa-trash"
                                style={{
                                  color:
                                    option === "preview" || formik?.values.contacts.length === 1
                                      ? ""
                                      : "#5EA3A3",
                                  fontSize: "1rem",
                                }}
                              />
                            </Button>
                          </Box>

                          {/* Campos */}
                          <InputTitles>Nombres</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.first_name`}
                            placeholder="Ingresa su nombre"
                            name={`contacts.${index}.first_name`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.first_name}
                            InputProps={{ disableUnderline: true, sx: { marginTop: "-5px" } }}
                            onChange={formik?.handleChange}
                          />

                          <InputTitles>Apellidos</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.last_name`}
                            placeholder="Ingresa su apellido"
                            name={`contacts.${index}.last_name`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.last_name}
                            InputProps={{ disableUnderline: true, sx: { marginTop: "-5px" } }}
                            onChange={formik?.handleChange}
                          />

                          <InputTitles>Teléfono</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.phone_number`}
                            placeholder="Ingresa su teléfono"
                            name={`contacts.${index}.phone_number`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.phone_number}
                            InputProps={{ disableUnderline: true, sx: { marginTop: "-5px" } }}
                            onChange={formik?.handleChange}
                          />

                          <InputTitles>Email</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.email`}
                            placeholder="Ingresa su correo electrónico"
                            name={`contacts.${index}.email`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.email}
                            InputProps={{ disableUnderline: true, sx: { marginTop: "-5px" } }}
                            onChange={formik?.handleChange}
                          />

                          <InputTitles>Cargo</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.position`}
                            placeholder="Ingresa su cargo"
                            name={`contacts.${index}.position`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.position}
                            InputProps={{ disableUnderline: true, sx: { marginTop: "-5px" } }}
                            onChange={formik?.handleChange}
                          />
                        </Box>
                      ))}

                      <Button
                        onClick={addContact}
                        variant="standard"
                        startIcon={<i className="far fa-circle-plus" />}
                        sx={{
                          color: "#5EA3A3",
                          backgroundColor: "#5EA3A31A",
                          borderRadius: "8px",
                          width: "100%",
                          boxShadow: "none",
                          textTransform: "none",
                          fontWeight: "700",
                          py: 0.8,
                          "& .MuiButton-startIcon i": { fontSize: "16px" },
                        }}
                        disabled={option === "preview"}
                      >
                        Agregar contacto
                      </Button>
                    </Box>
                  </FormWrap>
                ) : (
                  <LoadingCircle />
                )
              ) : null)}
          </Box>

          {!loading && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "none",
                mx: 0,
               
                display: "flex",
                justifyContent: activeStep === 0 ? "flex-end" : "space-between",
                gap: { xs: 0.75, sm: 1, md: 1 },
                mt: { xs: 1, md: 1 },
              }}
            >
              <MuiButton
                variant="standard"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  display: activeStep === 0 ? "none" : "inline-flex",
                  minWidth: 132,
                  width: 132,
                  boxShadow: "none",
                  borderRadius: "10px",
                  "&:disabled": { color: "#999999", backgroundColor: "#CECECE" },
                }}
              >
                <Typography fontSize="90%" fontWeight="bold">
                  Atrás
                </Typography>
              </MuiButton>

              {activeStep === steps.length - 1 ? (
                option === "register" || option === "modify" ? (
                  <MuiButton
                    type="submit"
                    onClick={formik.handleSubmit}
                    sx={{
                      minWidth: 132,
                      width: 132,
                      boxShadow: "none",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography fontSize="90%" fontWeight="bold">
                      {option === "register" && "Registrar"}
                      {option === "modify" && "Modificar"}
                    </Typography>
                  </MuiButton>
                ) : (
                  <MuiButton
                    onClick={() => console.log("")}
                    sx={{
                      minWidth: 132,
                      width: 132,
                      boxShadow: "none",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography fontSize="90%" fontWeight="bold">
                      Volver a clientes
                    </Typography>
                  </MuiButton>
                )
              ) : (
                <MuiButton
                  onClick={handleNext}
                  sx={{
                    minWidth: 132,
                    width: 132,
                    boxShadow: "none",
                    borderRadius: "10px",
                  }}
                >
                  <Typography fontSize="90%" fontWeight="bold" color="#fff">
                    Siguiente
                  </Typography>
                </MuiButton>
              )}
            </Box>
          )}

                  </Box>
                </Grid>
              </Grid>
            </Box>

            
);

};
