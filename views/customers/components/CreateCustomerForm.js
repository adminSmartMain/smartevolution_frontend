import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { Button, InputAdornment } from "@mui/material";
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
          width: 140,
          height: 140,
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
    <Box sx={{ textAlign: "center", mb: 2, ml: 2 }}>
      <Box sx={{ textAlign: "center", mb: 2, ml: 2 }}>
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
        width: 22,
        height: 22,
        borderRadius: "999px",
        border: `2px solid ${border}`,
        backgroundColor: bg,
        display: "grid",
        placeItems: "center",
        fontSize: 12,
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
      maxWidth: 560,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    {children}
  </Box>
);

const FieldWrap = ({ children }) => <Box sx={{ width: "100%" }}>{children}</Box>;

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
      width: "90%",
      px: { xs: 1.5, sm: 2, md: 3 },
      py: { xs: 2, md: 2 },
      bgcolor: { xs: "transparent", md: "transparent" },
    }}
  >
    <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
      {/* ===================== LEFT PANEL (DESKTOP ONLY) ===================== */}
      <Grid
        item
        xs={12}
        md={4}
        lg={4}
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",           // ✅
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
            p: 3,
            position: { md: "sticky", xs: "static" },
            top: { md: 16, xs: "auto" },
            height: "fit-content",
            maxHeight: "calc(100vh - 32px)",
            overflow: "auto",

          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Image
              component="img"
              src={smartLogo}
              alt="logo"
              sx={{ maxWidth: 180, width: "100%", objectFit: "contain" }}
            />
          </Box>

          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={<SmartConnector />}
            sx={{ "& .MuiStepLabel-labelContainer": { ml: 1 } }}
          >
            {steps.map((s, index) => {
              const completed = index < activeStep && !getStepHasError(index);
              const active = index === activeStep;
              const error = getStepHasError(index);

              const status = error
                ? "Incompleto"
                : completed
                ? "Completada"
                : active
                ? "En progreso"
                : "";

              return (
                <Step key={s.title} completed={completed} active={active}>
                  <StepLabel StepIconComponent={SmartStepIcon} error={error}>
                    <StepLabelContent
                      stepNumber={index + 1}
                      title={s.title}
                      status={status}
                      active={active}
                      completed={completed}
                      error={error}
                    />
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Grid>

      {/* ===================== RIGHT PANEL (FORM) ===================== */}
      <Grid item xs={12} md={8} lg={8}>
        {/* Card wrapper */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: { xs: "none", md: "0px 6px 20px rgba(0,0,0,0.06)" },
            p: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          {/* Title */}
          <Typography
            letterSpacing={0}
            fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.8rem" }}
            fontWeight="700"
            mb={{ xs: 1.5, md: 2 }}
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
              maxWidth: 560, // ✅ misma idea que tu FormWrap
              mx: "auto", // ✅ centra el formulario
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FieldWrap>
                          <NombreClientSelect formik={formik} option={option} />
                        </FieldWrap>
                        <FieldWrap>
                          <ApellidoClientSelect formik={formik} option={option} />
                        </FieldWrap>
                      </Box>
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
                  <TelefonoClientSelect formik={formik} option={option} />
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
                          py: 1.2,
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
                maxWidth: 560,
                mx: "auto",
               
                display: "flex",
                justifyContent: "space-between",
                gap: { xs: 0.75, sm: 1.25, md: 1.5 },
              }}
            >
              <MuiButton
                variant="standard"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  flex: 1,
                  minWidth: 0,     // ✅ evita que el botón empuje el layout
                  width: "100%",   // ✅ fuerza a ocupar su columna
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
                      flex: 1,
                      minWidth: 0,   // ✅
                      width: "100%", // ✅
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
                      flex: 1,
                      minWidth: 0,   // ✅
                      width: "100%", // ✅
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
                    flex: 1,
                    minWidth: 0,   // ✅
                    width: "100%", // ✅
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
              {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: 20 }}>
                  <h4>Errores:</h4>
                  <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
                  <pre>{JSON.stringify(formik.values, null, 2)}</pre>
                </div>
              )}
            </Box>

            
);

};
