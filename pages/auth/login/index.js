import Head from "next/head";
import Image from "next/image";

import { Grid } from "@mui/material";

import { InputV } from "@views/login/index";

export default function Home() {
  return (
    <div>
  <Head>
    <title>Smart Evolution - Inicio de sesión</title>
    <meta name="description" content="Prueba de contenido 2.0" />
  </Head>

  <Grid container spacing={0}>
    {/* Relleno Izquierdo - Login */}
    <Grid
      item
      xs={12}
      md={4} // Reducir el tamaño del recuadro izquierdo
      style={{
        height: "100vh", // Altura ajustada para mayor proporción
        background: "#ebebeb",
        margin: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Mejor estética
        borderRadius: "10px", // Bordes redondeados
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <div style={{ textAlign: "center" }}>
        <Image
          src="/assets/Icono Smart + Texto.svg"
          height={78}
          width={312}
          alt="Smart Evolution"
        />
        <InputV />
      </div>
    </Grid>

    {/* Fondo derecho - Imagen */}
    <Grid
      item
      xs={12}
      md={8} // Aumentar el espacio del recuadro derecho
      style={{
        height: "100vh",
        backgroundImage: 'url("https://devsmartevolution.s3.us-east-1.amazonaws.com/imagenes/fondo-login-bogota-por+Raul+Cuellar+.jpg")', // Cambiar por la ruta de la imagen
        backgroundSize: "cover", // Ajustar la imagen a la pantalla
        backgroundPosition: "center", // Centrar la imagen
        backgroundRepeat: "no-repeat", // Evitar repetición
      }}
    >
      <div></div>
    </Grid>
  </Grid>
</div>

  );
}
