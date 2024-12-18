import ForgotPasswordIndex from "@views/login/forgotPassword";
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import { Grid } from "@mui/material";

export default function ForgotPasswordPage() {

  
  return (
    <>
    <Head>
  <title>Smart Evolution - Olvidé contraseña</title>
  <meta name="description" content="Prueba de contenido 2.0" />
</Head>

<Grid container spacing={0} style={{ height: "100vh" }}>
  {/* Columna Izquierda - Formulario */}
  <Grid
    item
    xs={12}
    md={4}
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#ebebeb",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px 0 0 10px", // Bordes redondeados solo a la izquierda
      minHeight: "100vh", // Ajusta altura
    }}
  >
    
    <ForgotPasswordIndex />
  </Grid>

  {/* Columna Derecha - Imagen de Fondo */}
  <Grid
    item
    xs={12}
    md={8}
    sx={{
      backgroundImage:
        'url("https://devsmartevolution.s3.us-east-1.amazonaws.com/imagenes/fondo-login-bogota-por+Raul+Cuellar+.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh", // Altura fija para cubrir toda la pantalla
    }}
  />
</Grid>

  </>
   );
}