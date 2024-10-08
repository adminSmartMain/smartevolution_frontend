import Head from "next/head";

import { useFetch } from "@hooks/useFetch";

import { SummaryListComponent } from "./components";
import { GetSummaryList } from "./queries";

export default function SummaryList() {
  return (
    <>
      <Head>
        <title>Consulta de resumen de negociación</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <SummaryListComponent />
    </>
  );
}
