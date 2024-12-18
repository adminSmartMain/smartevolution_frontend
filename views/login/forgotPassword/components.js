import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/router";
import { Toast } from "@components/toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForgotPassword = ({ email, setEmail, onSubmit, loading, error, attempts,success,resendEmail,attemptsFinish }) => {
  const [openToast, setOpenToast] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false); // Modal de bloqueo
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(180); // Tiempo restante para el temporizador
  const [timeLeftError, setTimeLeftError] = useState(180); // Tiempo restante para el temporizador

  
  // Mostrar el toast si hay error
  useEffect(() => {
    if (error) {
      setOpenToast(true);
      
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      setOpenSuccessModal(true);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);  // Limpiar el intervalo cuando llegue a 0
            router.push("/auth/login");  // Redirigir al login
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Limpiar el intervalo cuando se cierre el modal o se cambie el estado
      return () => clearInterval(timer);
    }
  }, [success, router]);


console.log(attempts)




// Función para reenviar el correo
const handleResendEmail = () => {
  resendEmail(email);  // Esta función se pasa como prop para manejar el reenvío
  setTimeLeft(30);  // Reiniciar el temporizador
};
 
  // Estado para manejar la animación de carga
  const [loading2, setLoading2] = useState(false);

  const handleAccept = () => {
    setLoading2(true); // Inicia la animación de carga
    setTimeout(() => {
      router.push("/auth/login"); // Redirige después de un pequeño delay
    }, 2000); // Delay de 2 segundos (puedes ajustar el tiempo)
  };





//timer de errores


 // Mostrar el modal de éxito si success es true
 //useEffect(() => {
 // if (attempts=='0') {
    //setOpenErrorModal(true);
    //setTimeout(() => {
      
      //router.push("/auth/login");  // Redirigir después de unos segundos
    //}, 3000); // Redirigir después de 3 segundos
  //}
//}, [attempts, router]);

useEffect(() => {
  if (attempts=='0') {
    setOpenErrorModal(true);
    const timer = setInterval(() => {
      setTimeLeftError((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);  // Limpiar el intervalo cuando llegue a 0
            // Recargar la página
            window.location.reload();
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Limpiar el intervalo cuando se cierre el modal o se cambie el estado
    return () => clearInterval(timer);
  }
}, [attempts, router]);

  return (
    <>
     <Container
  maxWidth="sm"
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh", // Ocupar toda la pantalla vertical
    backgroundColor: "transparent",
    padding: "20px",
    gap: "20px", // Espacio entre elementos
  }}
>
      
    <Link href="/login">
      <a>
        <Image
          
          src="/assets/Icono Smart + Texto.svg"
          height={78}
          width={312}
          alt="Smart Evolution"
          style={{ marginBottom: "50px" ,
              marginTop:"0px"
          }}
        />
      </a>
    </Link>
      {/* Título */}
      <Typography
        sx={{
          color: "#1E88E5",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Recuperar Contraseña
      </Typography>

      {/* Subtítulo */}
      <Typography
        sx={{
          color: "#757575",
          fontSize: "0.9rem",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        ¿No tienes cuenta? Contacta con la administración.
      </Typography>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <TextField
          id="email" 
          aria-label="Ingresar correo"
    
          label="Ingresa tu correo electrónico"
          variant="outlined"
          type="email"
          fullWidth
          sx={{ marginBottom: "20px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Error */}
        {error && (
          <Typography
            color="error"
            sx={{ marginBottom: "10px", textAlign: "center" }}
          >
            {error.message || "Correo no encontrado."}
          </Typography>
        )}

        {/* Botón */}
        <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", // Acomoda los botones en extremos opuestos
        alignItems: "center", // Alinea verticalmente
        width: "100%", // Ocupa el ancho total del contenedor
        marginTop: "20px",
      }}
    >
      {/* Botón de flecha a la izquierda */}
      <Link href="/auth/login" passHref>
      <Button
      aria-label="Ir hacia atrás"
      id="back"
  variant="contained"
  startIcon={
    <ArrowBackIcon
      sx={{
        color: "white", // Color de la flecha en blanco para mayor contraste
        fontSize: "2rem", // Tamaño más grande
      }}
    />
  }
  sx={{
    backgroundColor: "red", // Fondo rojo más intenso
    color: "white", // Texto blanco para contraste
    border: "1px solid red", // Borde rojo
    textTransform: "none",
    padding: "10px 20px", // Agregar más espacio alrededor del botón
    borderRadius: "8px", // Bordes redondeados
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra suave para profundidad
    "&:hover": {
      backgroundColor: "#e53935", // Sombra más oscura en hover
      transform: "scale(1.05)", // Escala ligeramente el botón al pasar el mouse
      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)", // Más sombra en hover
    },
  }}
>
  {/* Sin texto, solo flecha */}
</Button>
      </Link>

      {/* Botón Cambiar a la derecha */}
      <Button
        aria-label="Cambiar contraseña"
        id="change-password"
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#64b5f6",
          color: "#fff",
          width: "170px",
          height: "40px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#42a5f5",
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Cambiar"}
      </Button>
    </Box>
      </Box>

      {/* Modal de Éxito */}
      <Dialog
        aria-live="polite"
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
            backgroundColor: "#f4f6f8",
          }}
        >
          {/* Imagen */}
          <img
            src="/assets/Gemini_Generated_Image_s3hst5s3hst5s3hs.jpeg"
            alt="Logo"
            style={{
              width: "80px",
              height: "80px",
              marginBottom: "10px",
            }}
          />

          {/* Mensaje */}
          <DialogContent>
            <DialogContentText
              sx={{
                textAlign: "center",
                color: "#333",
              }}
            >
              Hemos enviado a la dirección de correo proporcionada las
              instrucciones para restablecer tu contraseña.
            </DialogContentText>
            <DialogContentText
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {timeLeft}
            </DialogContentText>
          </DialogContent>

          {/* Acciones */}
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Botón de Reenviar */}
            <Button
            role="button" 
            aria-label="Reenviar token"
            id="resend-code-button" 
            className="modal-button secondary-button disabled"
              onClick={handleResendEmail}
              disabled={loading}
              sx={{
                backgroundColor: "#B0BEC5",
                color: "white",
                width: "160px",
                "&:hover": { backgroundColor: "#90A4AE" },
              }}
            >
              Reenviar Correo
            </Button>

            {/* Botón de Aceptar */}
            <Button
            id="confirm-button" 
            className="modal-button primary-button"
            role="button"  
            aria-label="Cerrar"
              onClick={handleAccept}
              disabled={loading2}
              sx={{
                backgroundColor: "#65b5f6",
                color: "white",
                width: "160px",
                "&:hover": { backgroundColor: "#42a5f5" },
                marginLeft: "10px",
              }}
            >
              {loading2 ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Aceptar"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>

      {/* Modal de Bloqueo */}
      <Dialog open={openErrorModal}>
        <DialogTitle>Intentos Excedidos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has excedido el número máximo de intentos permitidos. Por favor espera
            el tiempo asignado e intentalo de nuevo
          </DialogContentText>
          <DialogContentText
            sx={{
              
              fontWeight: 'bold', // Para poner el texto en negrita
              fontSize: '1.5rem', // Tamaño grande
              textAlign: 'center', // Centrar el texto
              marginTop:'20px'
            }}
          >
            {timeLeftError}
          </DialogContentText>
          
        </DialogContent>


      </Dialog>

      {/* Toast de Error */}
      <Snackbar
  open={openToast}
  autoHideDuration={4000}
  onClose={() => setOpenToast(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Posición bottom-right
  sx={{
    position: "fixed",
    bottom: 10,
    right: 10, // Ajusta la posición
    transition: "transform 0.3s ease-out", // Agrega la animación
    transform: openToast ? "translateX(0%)" : "translateX(100%)", // Desliza de derecha a izquierda cuando aparece y hacia la derecha cuando desaparece
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffebee", // Fondo rojo claro
      color: "white", // Texto en blanco
      borderRadius: "50px",
      padding: "20px 20px",
      width: "auto",
      border: "1.5px solid #f44336", // Bordes rojos más intensos
    }}
  >
    <img
      style={{ display: "inline-block" }}
      src="/assets/error-svgrepo-com.svg"
      alt="Error icon"
      width={20}
      height={30}
    />
    <strong
      style={{
        fontSize: "13px", // Tamaño de fuente más grande
        marginLeft: "10px",
        color: "#212121", // Gris oscuro (más fuerte que el gris claro)
        fontFamily: "'Roboto', sans-serif", // Fuente más suave y moderna
        fontWeight: "bold", // negrita
      }}
    >
      {`Error al enviar el correo. Te quedan ${attempts} intento(s).`}
    </strong>
  </div>
</Snackbar>




      
    </>
    
  );
};

export default ForgotPassword;
