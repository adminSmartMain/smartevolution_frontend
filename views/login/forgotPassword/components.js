import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
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
import MuiTextField from "@styles/fields";
import BackButton from "@styles/buttons/BackButton";
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Controla si el botón de reenviar está desactivado


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
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
    setIsButtonDisabled(true);  // Desactivar el botón de reenviar
    setTimeLeft(180);  // Reiniciar el temporizador
  };

useEffect(() => {
  if (isButtonDisabled && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);  // Limpiar el intervalo cuando llegue a 0
          setIsButtonDisabled(false);  // Rehabilitar el botón de reenviar
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }
}, [isButtonDisabled, timeLeft]);

  // Estado para manejar la animación de carga
  const [loading2, setLoading2] = useState(false);

  const handleAccept = () => {
    setLoading2(true); // Inicia la animación de carga
    setTimeout(() => {
      router.push("/auth/login"); // Redirige después de un pequeño delay
    }, 2000); // Delay de 2 segundos (puedes ajustar el tiempo)
  };







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
          marginBottom: "25px",
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
  }}
>
  <FormControl fullWidth sx={{ marginBottom: "12px" }}>
    <MuiTextField
      id="email"
      placeholder="Ingresa tu email"
      name="email"
      type="email"
      aria-label="Correo electrónico"
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      variant="standard"
      margin="normal"
      fullWidth
      InputProps={{
        disableUnderline: true, // Deshabilita la línea inferior
        sx: {
          backgroundColor: "transparent", // Fondo transparente
          marginTop: "-5px",
        },
      }}
      error={error && Boolean(error.message)} // Muestra error si lo hay
      sx={{
        backgroundColor: "transparent", // Fondo transparente
        border: error ? "1.4px solid #E6643180" : "1px solid rgba(0, 0, 0, 0.23)", // Borde con color rojo si hay error
        borderRadius: "4px", // Bordes redondeados para un estilo limpio
        padding: "8px 14px", // Espaciado dentro del campo de texto
      }}
    />
    {error && (
      <Typography color="error" sx={{ marginBottom: "10px", textAlign: "center",fontSize: "0.75rem" }}>
        {error.message || "Correo no encontrado."}
      </Typography>
    )}
    {/* Mensaje de error para campo vacío */}
    {!email && !loading && (
      <Typography color="error" sx={{ marginTop: "10px", textAlign: "center",fontSize: "0.75rem" }}>
        El campo de correo electrónico es obligatorio.
      </Typography>
    )}
  </FormControl>

  {/* Botón */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: "20px",
      gap: "40px",
    }}
  >
    {/* Botón de flecha a la izquierda */}
    <BackButton path="/auth/login" />

    {/* Botón Cambiar a la derecha */}
    <Button
      aria-label="Cambiar contraseña"
      id="change-password"
      type="submit"
      variant="contained"
      sx={{
        backgroundColor: "#64b5f6",
        color: "#fff",
        width: "200px",
        height: "35px",
        fontSize: "0.75rem",
        textTransform: "none",
        borderRadius: "5px",
        "&:hover": {
          backgroundColor: "#42a5f5",
        },
      }}
      disabled={loading || !email} // Deshabilitar si no hay email
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
            src="/assets/Gemini_Generated_Image_s3hst5s3hst5s3hs-removebg-preview.png"
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
              {formatTime(timeLeft)}
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
                onClick={handleResendEmail}
                disabled={isButtonDisabled}
                sx={{
                  backgroundColor: "#B0BEC5",
                  color: "white",
                  width: "200px",
                  height: "40px",
                  "&:hover": { backgroundColor: "#90A4AE" },
                  textTransform: "none",
                  fontSize: "16px",
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
    width: "200px", // Aumenta el ancho del botón
    height: "40px", // Aumenta la altura para hacerlo más grande
    "&:hover": { backgroundColor: "#42a5f5" },
    marginLeft: "20px", // Aumenta el espacio entre los botones
    textTransform: 'none', // Evitar mayúsculas sostenidas
    fontSize: '16px',
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
