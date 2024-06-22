import Head from "next/head";

import { AdministrationComponents } from "./components";

export default function Bills() {
  return (
    <>
      <Head>
        <title>Administración</title>
        <meta name="description" content="Control de Factura Electrónica" />
      </Head>
      <AdministrationComponents />
    </>
  );
}
