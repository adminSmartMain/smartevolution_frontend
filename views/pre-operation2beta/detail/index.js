import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import PreOperationDetail from "./components";
import { getOperationById, sendBuyOrder } from "./queries";

const Detail = () => {
  // const
  const [data, setData] = useState([]);

  // Hooks
  const router = useRouter();

  // Queries
  const {
    fetch: getOperationFetch,
    loading: loadingGetOperation,
    error: errorGetOperation,
    data: dataGetOperation,
  } = useFetch({ service: getOperationById, init: false });

  const {
    fetch: sendBuyOrderFetch,
    loading: loadingBuyOrderFetch,
    error: errorBuyOrderFetch,
    data: dataBuyOrderFetch,
  } = useFetch({ service: sendBuyOrder, init: false });

  // Effects
  useEffect(() => {
    if (router.query.id) {
      getOperationFetch(router.query.id);
    }
  }, [router.query]);

  useEffect(() => {
    if (dataGetOperation) {
      const mappedData = {
        emitter: {
          name: dataGetOperation?.data?.emitter?.name,
          document: dataGetOperation?.data?.emitter?.documentNumber,
        },
        investor: {
          name: dataGetOperation?.data?.investor?.investor,
          document: dataGetOperation?.data?.investor?.investorDocumentNumber,
          phone: dataGetOperation?.data?.investor?.investorPhoneNumber,
          account: dataGetOperation?.data?.investor?.investorAccount,
        },
        bills: {
          averageTerm: dataGetOperation?.data?.operation?.averageTerm,
          billsCount: dataGetOperation?.data?.totalBills?.bills,
          amount: dataGetOperation?.data?.operation?.total,
        },
        payers: {
          data: dataGetOperation?.data?.payers,
        },
      };
      setData(mappedData);
    }
  }, [dataGetOperation, errorGetOperation, loadingGetOperation]);

  useEffect(() => {
    if (errorBuyOrderFetch) {
      if (
        errorBuyOrderFetch.message ===
          "Overview matching query does not exist." ||
        errorBuyOrderFetch.message === "float division by zero"
      ) {
        Toast("Emisor o Pagador sin Perfil Financiero Cargado", "error");
      } else {
        Toast(errorBuyOrderFetch.message, "error");
      }
    }

    if (dataBuyOrderFetch) {
      Toast("Orden de compra enviada exitosamente", "success");
    }

    if (loadingBuyOrderFetch) {
      Toast("Enviando Orden de compra", "info");
    }
  }, [dataBuyOrderFetch, errorBuyOrderFetch, loadingBuyOrderFetch]);
  // methods

  const sendBuyOrderFunc = () => {
    sendBuyOrderFetch(router.query.id);
  };

  return (
    <>
      <Head>
        <title>Detalle de operación</title>
        <meta name="description" content="Página de detalle de operación" />
      </Head>
      <PreOperationDetail
        data={data}
        sendBuyOrderFunc={sendBuyOrderFunc}
        ToastContainer={ToastContainer}
        sendingBuyOrder={loadingBuyOrderFetch}
      />
    </>
  );
};

export default Detail;
