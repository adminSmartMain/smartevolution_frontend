import Head from "next/head";

import { BillsComponents } from "./components";

export default function Bills() {
  return (
    <>
      <Head>
        <title>Control de Factura Electrónica</title>
        <meta name="description" content="Control de Factura Electrónica" />
      </Head>
      <BillsComponents />
    </>
  );
}
