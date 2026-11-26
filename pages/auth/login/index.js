import Head from "next/head";
import Image from "next/image";

import { Box, Grid, Typography } from "@mui/material";

import { InputV } from "@views/login/index";

export default function Home() {
  return (
    <div>
  <Head>
    <title>Smart Evolution - Inicio de sesión</title>
    <meta name="description" content="Prueba de contenido 2.0" />
  </Head>

  <Grid container spacing={0} sx={{ minHeight: "100vh" }}>
    {/* Acceso administrativo */}
    <Grid
    item
    xs={12}
    md={4}
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: { xs: "flex-start", md: "center" },
      alignItems: "center",
      background: "linear-gradient(160deg, #f8fafc 0%, #edf5f7 100%)",
      minHeight: "100vh",
      px: { xs: 3, sm: 6 },
      py: { xs: 5, md: 7 },
    }}
  >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        <Image
          src="/assets/Icono Smart + Texto.svg"
          height={78}
          width={312}
          alt="Smart Evolution"
        />
        <Typography component="p" sx={{ color: "#0089b6", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", mt: 6, mb: 1, textTransform: "uppercase" }}>
          Portal de administración
        </Typography>
        <Typography component="h1" sx={{ color: "#172b60", fontSize: { xs: "2.1rem", md: "2.5rem" }, fontWeight: 700, lineHeight: 1.15, m: 0 }}>
          Bienvenido
        </Typography>
        <InputV />
      </Box>
    </Grid>

    {/* Mensaje institucional */}
    <Grid
      item
      xs={12}
      md={8} // Aumentar el espacio del recuadro derecho
      sx={{
        minHeight: { xs: 440, md: "100vh" },
        backgroundImage: 'url("https://devsmartevolution.s3.us-east-1.amazonaws.com/imagenes/fondo-login-bogota-por+Raul+Cuellar+.jpg")', // Cambiar por la ruta de la imagen
        backgroundSize: "cover", // Ajustar la imagen a la pantalla
        backgroundPosition: "center", // Centrar la imagen
        backgroundRepeat: "no-repeat", // Evitar repetición
        display: "flex",
        alignItems: "flex-end",
        p: { xs: 3, md: 8 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5, 20, 48, 0.18) 0%, rgba(5, 20, 48, 0.72) 100%)",
        },
      }}
    >
      <Box sx={{ position: "relative", maxWidth: 690, width: "100%", p: { xs: 3, md: 4 }, borderRadius: 3, color: "#fff", backgroundColor: "rgba(7, 18, 44, 0.9)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 18px 50px rgba(0,0,0,0.3)" }}>
        <Typography sx={{ color: "#48d8f7", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", mb: 2, textTransform: "uppercase" }}>Gestión centralizada</Typography>
        <Typography component="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.35rem" }, fontWeight: 700, lineHeight: 1.2, m: 0, mb: 2 }}>Control y visibilidad de toda tu operación.</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: { xs: "1rem", md: "1.12rem" }, lineHeight: 1.7 }}>Administra usuarios, configura servicios y supervisa los procesos de la plataforma desde un entorno centralizado y seguro.</Typography>
      </Box>
    </Grid>
  </Grid>
</div>

  );
}
