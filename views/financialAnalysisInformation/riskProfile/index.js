/* eslint-disable react-hooks/exhaustive-deps */
// Next imports
import { useEffect, useState } from "react";
// alerts
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

// Component
import { RiskProfileC } from "./components";
// Queries
import {
  GetCustomerById,
  getRiskProfile,
  saveRiskProfile,
  updateRiskProfile,
} from "./queries";

// Hooks
import { useFormik } from "formik";

export const RiskProfileV = ({dataClient,dataRiskProfile1, errorRiskProfileFetch1,loadingRiskProfileFetch1}) => {
  // router
  const router = useRouter();

  // Hooks
  const [customer, setCustomer] = useState(null);
  const [riskProfileData, setRiskProfileData] = useState(null);

  // Queries hooks

  // Get customer data
  const {
    fetch: getCustomer,
    loading: loadingGetCustomer,
    error: errorGetCustomer,
    data: dataCustomer,
  } = useFetch({ service: GetCustomerById, init: false });

  // get the client risk profile
  const {
    fetch: getRiskProfileFetch,
    loading: loadingRiskProfileFetch,
    error: errorRiskProfileFetch,
    data: dataRiskProfileFetch,
  } = useFetch({ service: getRiskProfile, init: true });

  // save the risk profile
  const {
    fetch: riskProfile,
    loading: loadingRiskProfile,
    error: errorRiskProfile,
    data: dataRiskProfile,
  } = useFetch({ service: saveRiskProfile, init: false });

  // Update the risk profile

  const {
    fetch: updateRiskProfileFetch,
    loading: loadingUpdateRiskProfile,
    error: errorUpdateRiskProfile,
    data: dataUpdateRiskProfile,
  } = useFetch({ service: updateRiskProfile, init: false });

  // Formik
  const formik = useFormik({
    initialValues: {
      gmf: false,
      iva: false,
      ica: false,
      discount_rate: 0,
      discount_rate_investor: 0,
      investor_balance: 0,
      emitter_balance: 0,
      payer_balance: 0,
      account_number: 0,
      account_type: "",
      accountType: "",
      client: "",
      id: "",
      data_credit_score:0,
    },
    onSubmit: (values) => {
      if (values.id == "") {
        riskProfile(values);
      } else {
        updateRiskProfileFetch(values);
      }
    },
  });
  // useEffects

  // Get customer data
  useEffect(() => {
    if (router.query.id != undefined) {
      getCustomer(router.query.id);
      getRiskProfileFetch(router.query.id);
    }
  }, [router.query.id]);

  console.log(dataClient,dataRiskProfile1)
  // set the customer data
  useEffect(() => {
    if (dataClient) {
      setCustomer(dataClient);
      formik.setFieldValue("client", dataClient.data.id);
    }
  }, [dataClient]);

  // get the risk profile fetch response
  useEffect(() => {
    if (dataRiskProfile) {
      Toast("Perfil de riesgo guardado", "success");
      setTimeout(() => {
        router.push("/customers/customerList");
      }, 2000);
    }

    if (errorRiskProfile) {
      Toast("Error al guardar el perfil de riesgo", errorRiskProfile.message);
    }

    if (loadingRiskProfile) {
      Toast("Guardando perfil de riesgo", "info");
    }
  }, [dataRiskProfile, errorRiskProfile, loadingRiskProfile]);

  // get the update risk profile fetch response
  useEffect(() => {
    if (dataUpdateRiskProfile) {
      Toast("Perfil de riesgo actualizado", "success");
      setTimeout(() => {
        router.push("/customers/customerList");
      }, 2000);
    }

    if (errorUpdateRiskProfile) {
      Toast("Error al actualizar el perfil de riesgo", "error");
    }

    if (loadingUpdateRiskProfile) {
      Toast("Actualizando perfil de riesgo", "info");
    }
  }, [loadingUpdateRiskProfile, errorUpdateRiskProfile, dataUpdateRiskProfile]);

  useEffect(() => {
    if (dataRiskProfile1) {
      formik.setFieldValue("gmf", dataRiskProfile1.data.gmf);
      formik.setFieldValue("iva", dataRiskProfile1.data.iva);
      formik.setFieldValue("ica", dataRiskProfile1.data.ica);
      formik.setFieldValue(
        "discount_rate",
        dataRiskProfile1.data.discount_rate
      );
      formik.setFieldValue(
        "discount_rate_investor",
        dataRiskProfile1.data.discount_rate_investor
      );
      formik.setFieldValue(
        "investor_balance",
        dataRiskProfile1.data.investor_balance
      );
      formik.setFieldValue(
        "emitter_balance",
        dataRiskProfile1.data.emitter_balance
      );
      formik.setFieldValue(
        "payer_balance",
        dataRiskProfile1.data.payer_balance
      );
      formik.setFieldValue(
        "account_number",
        dataRiskProfile1.data.account_number
      );
      formik.setFieldValue(
        "accountType",
       dataRiskProfile1.data.account_type
      );
      formik.setFieldValue(
        "account_type",
        dataRiskProfile1.data.account_type
      );
      formik.setFieldValue("bank", dataRiskProfile1.data.bank);
      formik.setFieldValue("id", dataRiskProfile1.data.id);
      formik.setFieldValue("client", dataRiskProfile1.data.client.id);
    }
  }, [dataRiskProfile1, errorRiskProfileFetch1, loadingRiskProfileFetch1]);
  return (
    <>
      <Head>
        <title>Perfil de riesgo</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <RiskProfileC
        formik={formik}
        data={dataCustomer}
        ToastContainer={ToastContainer}
      />
    </>
  );
};
