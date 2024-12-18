import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import { InputNewPassword } from "./components";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { verifyToken, resetPassword } from "./queries";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Container, Paper } from '@mui/material';

export const NewPasswordIndex = () => {
  const router = useRouter();
  const { uidb64, token } = router.query;
  const [invalidToken, setInvalidToken] = useState(false);
  const [circularProgressVisible, setCircularProgressVisible] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  console.log(uidb64, token);

  // Estado para manejar el token válido
  const [isTokenValid, setIsTokenValid] = useState(null); // null indica que aún no se valida

  const { fetch: verifyTokenFetch, loading: loadingVerify } = useFetch({
    service: verifyToken,
    init: false,
  });

  const { fetch: resetPasswordFetch, loading: loadingReset } = useFetch({
    service: resetPassword,
    init: false,
  });

  // Validar el token al cargar
  useEffect(() => {
    if (uidb64 && token) {
      verifyTokenFetch({ uidb64, token })
        .then((response) => {
          if (response?.error === false) {
            setIsTokenValid(true);
          } else {
            
            setIsTokenValid(false);
            setInvalidToken(true);
            setCircularProgressVisible(false);
          }
        })
        .catch(() => {
          Toast("Hubo un problema al validar el enlace.", "error");
          setIsTokenValid(false);
          setInvalidToken(true);
          setCircularProgressVisible(false);
        });
    }
  }, [uidb64, token]);

  // Redirigir automáticamente después de un tiempo
  useEffect(() => {
    if (invalidToken) {
      setTimeout(() => {
        setRedirecting(true);
        router.push("/auth/login");
      }, 3000); // 3 segundos para dar tiempo al Toast y al círculo de carga
    }
  }, [invalidToken]);

  // Esquema de validación con Yup
  const validationSchema = object({
    newPassword: string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
      .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
      .matches(/[#*_.\-]/, "La contraseña debe contener al menos un símbolo válido (#, *, _, -, .).")
      .required("La nueva contraseña es requerida."),
    confirmPassword: string()
      .oneOf([ref("newPassword"), null], "Las contraseñas no coinciden.")
      .required("Confirma tu nueva contraseña."),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Mapear los nombres de los campos
      const payload = {
        new_password: values.newPassword,
        new_password2: values.confirmPassword,
        uidb64: uidb64,
        token: token,
      };

      resetPassword(payload)
        .then(() => {
          Toast("Contraseña actualizada con éxito.", "success");
          router.push("/auth/login");
        })
        .catch(() => {
          Toast("Hubo un problema al actualizar la contraseña.", "error");
        });
    },
  });

  return (
    <>
     {isTokenValid === null ? (
 <Container maxWidth="sm">
 
    <CircularProgress color="primary" size={50} />
    <Typography variant="h6" sx={{ marginTop: "20px", fontWeight: "bold", color: "#555" }}>
      Estamos verificando el enlace...
    </Typography>
    <Typography variant="body2" sx={{ color: "#777", marginTop: "10px" }}>
      Por favor, espere un momento mientras completamos la verificación.
    </Typography>
  
</Container>
 
) : isTokenValid === false ? (
  
  <Container maxWidth="sm">
      <CircularProgress color="error" size={50} />
      <Typography variant="h6" style={{ marginTop: "20px", fontWeight: "bold", color: "#d32f2f" }}>
        El enlace no es válido o ha expirado
      </Typography>
      <Typography variant="body2" style={{ color: "#777", marginTop: "10px" }}>
        Redirigiendo a la página principal en unos momentos...
      </Typography>
      </Container>
  

      ) : (
        <InputNewPassword
          formik={formik}
          ToastContainer={ToastContainer}
          loading={loadingReset}
          invalidToken={invalidToken}
        />
      )}
    </>
  );
};
