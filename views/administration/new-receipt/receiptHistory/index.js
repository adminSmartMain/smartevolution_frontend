import Head from "next/head";

import { ReceiptHistoryComponent } from "./components";

export default function ReceiptHistory() {
  return (
    <>
      <Head>
        <title>Historial de cambios de recaudos</title>
        <meta name="description" content="Historial de edición y anulación de recaudos" />
      </Head>
      <ReceiptHistoryComponent />
    </>
  );
}
