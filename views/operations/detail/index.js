import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import OperationDetail from "./components";
import { GetBuyOrderPDF, getOperationById, sendBuyOrder } from "./queries";

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

  const {
    fetch: GetBuyOrderPDFFetch,
    loading: loadingGetBuyOrderPDFFetch,
    error: errorGetBuyOrderPDFFetch,
    data: dataGetBuyOrderPDFFetch,
  } = useFetch({ service: GetBuyOrderPDF, init: false });

  // Effects
  useEffect(() => {
    if (router.query.id) {
      getOperationFetch({
        opId: router.query.id,
        investor: router.query.investor,
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (dataGetOperation) {
      const mappedData = {
        emitter: {
          name: dataGetOperation?.data?.emitter?.name,
          document: dataGetOperation?.data?.emitter?.document,
        },
        investor: {
          id: dataGetOperation?.data?.investor?.investorId,
          name: dataGetOperation?.data?.investor?.investor,
          document: dataGetOperation?.data?.investor?.investorDocumentNumber,
          phone: dataGetOperation?.data?.investor?.investorPhoneNumber,
          account: dataGetOperation?.data?.investor?.investorAccount,
          investorAccountNumber:
            dataGetOperation?.data?.investor?.investorAccountNumber,
          investorAccountBalance:
            dataGetOperation?.data?.investor?.investorAccountBalance,
        },
        bills: {
          averageTerm: dataGetOperation?.data?.bills?.averageTerm,
          billsCount: dataGetOperation?.data?.bills?.bills,
          amount: dataGetOperation?.data?.bills?.total,
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
        errorBuyOrderFetch.message === "Overview matching query does not exist."
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
    data = {
      investorId: dataGetOperation?.data?.investor?.investorId,
      investor: dataGetOperation?.data?.investor?.investor,
      balance: dataGetOperation?.data?.investor?.investorAccountBalance,
      emitter: dataGetOperation?.data?.emitter?.name,
      payers: dataGetOperation?.data?.payers?.map((payer) => {
        return {
          name: payer.name,
        };
      }),
      bills: dataGetOperation?.data?.bills?.bills,
      averageTerm: `${dataGetOperation?.data?.bills?.averageTerm} días`,
      amount: dataGetOperation?.data?.bills?.total,
      opId: router.query.id,
      phone: dataGetOperation?.data?.investor?.investorPhoneNumber,
    };

    sendBuyOrderFetch(data);
  };

  const handlePDFView = () => {
    GetBuyOrderPDFFetch(router.query.id, router.query.investor);
  };

  return (
    <>
      <Head>
        <title>Detalle de operación</title>
        <meta name="description" content="Página de detalle de operación" />
      </Head>
      <OperationDetail
        data={data}
        sendBuyOrderFunc={sendBuyOrderFunc}
        handlePDFView={handlePDFView}
        PDFData={dataGetBuyOrderPDFFetch}
        ToastContainer={ToastContainer}
        sendingBuyOrder={loadingBuyOrderFetch}
      />
    </>
  );
};

export default Detail;
