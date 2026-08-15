import { Fragment, useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import smartLogo from "../../public/assets/Logo Smart - Lite.svg";
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
import { styled } from "@mui/material/styles";
import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import LoadingCircle from "@styles/loading";
import scrollSx from "@styles/scroll";

import { ModifyClientQuery } from "./queries";
import { Dialog,DialogContent, CircularProgress } from "@mui/material";
import { CheckCircle, Create, Error } from "@mui/icons-material";
import dayjs from "dayjs";
import { CreateCustomerForm } from "./components/CreateCustomerForm";
import { VisualizeCustomerForm } from "./components/VisualizeCustomerForm";
import { EditCustomerForm } from "./components/EditCustomerForm";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";


{/* Configuracion para visualizacion de clientes */}



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

  const avatarUrl =
    avatarPreview || formik?.values?.profile_url || DEFAULT_AVATAR;

  const onPickFile = (file) => {
    setAvatarFile(file);
    formik.setFieldValue("profile_changed", true);
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
export const SignUpClient = ({
  formik,
  option,
  ToastContainer,
  loading,
  enteredBy,
  updatedAt,
  roles,
  success,
  isModalOpen
}) => {
  const [steps, setSteps] = useState(["Primer paso", "Segundo paso"]);
  const [valueD, setValue] = useState(dayjs());
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [valueDate, setValueDate] = useState(dayjs());
  const handleChangeDate = (newValue) => {
    setValueDate(newValue);
  };

  useEffect(() => {
    
    if (
      formik.values.type_client &&
      formik.values.type_client === "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" &&
      steps.length === 2
    ) {
      steps.push("Tercer paso", "Cuarto paso");
      setSteps(steps);
    } else if (
      formik.values.type_client &&
      formik.values.type_client !== "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" &&
      steps.length === 4
    ) {
      steps.pop();
      steps.pop();
      setSteps(steps);
    }
  }, [formik.values.type_client]);
  console.log(formik?.values)
  useEffect(() => {
    if (
      formik.errors &&
      Object.keys(formik.errors).length !== 0 &&
      formik.isSubmitting
      
    ) {
      Toast("Faltan campos", "error");
    }
  }, [formik.errors, formik.isSubmitting]);

  return (
    <>
 
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        
         {option=="register" ? (
      
    <CreateCustomerForm formik={formik} loading={loading} option={option} valueD={valueD} enteredBy={enteredBy} valueDate={valueDate} handleChangeDate={handleChangeDate} roles={roles} handleChange={handleChange}/>

    ): option=="modify" ?(
      <>
      <EditCustomerForm formik={formik} loading={loading} option={option} valueD={valueD} enteredBy={enteredBy} valueDate={valueDate} handleChangeDate={handleChangeDate} roles={roles} handleChange={handleChange}/>
     
    </>
    ):(
      <>


      <VisualizeCustomerForm formik={formik} loading={loading} option={option} valueD={valueD} enteredBy={enteredBy} valueDate={valueDate} handleChangeDate={handleChangeDate} roles={roles} handleChange={handleChange}/>
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
          {/* fin Visualización de cliente */}
    </>
    )}

         {/* MODAL DE PROCESO */}
            <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
              <DialogContent>
                {success === null ? (
                  <>
                    <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
                    <Typography variant="h6">Procesando...</Typography>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
                    <Typography variant="h5" color="success.main">
                      {option === "register" && "¡Registro Exitoso!"}
                      {option === "modify" && "¡El cliente se ha modificado con éxito!"}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
                    <Typography variant="h5" color="error.main">
                      {option === "register" && "Error al Registrar"}
                      {option === "modify" && "Error al Modificar"}
                    </Typography>
                  </>
                )}
              </DialogContent>
            </Dialog>
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
