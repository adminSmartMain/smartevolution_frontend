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
        <Grid
          item
          xs={12}
          md={6}
          style={{ height: "100vh", background: "#ebebeb" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div>
            <Image
              src="/assets/Icono Smart + Texto.svg"
              height={78}
              width={312}
              alt="Smart Evolution"
            />
            <InputV />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ height: "100vh", background: "#b5d1c9", color: "black" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div></div>
        </Grid>
      </Grid>
    </div>
  );
}
