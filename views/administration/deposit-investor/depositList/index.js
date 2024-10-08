import Head from "next/head";

import { useFetch } from "@hooks/useFetch";

import { DepositListComponent } from "./components";

export default function DepositList() {
  return (
    <>
      <Head>
        <title>Consulta de giro-inversionista</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <DepositListComponent />
    </>
  );
}
