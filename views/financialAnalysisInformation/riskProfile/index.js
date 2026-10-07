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
  updateFinancialOverview,
} from "./queries";

// Hooks
import { useFormik } from "formik";

export const RiskProfileV = ({
  dataClient,
  dataRiskProfile1,
  dataFinancialProfile,
  errorRiskProfileFetch1,
  loadingRiskProfileFetch1,
}) => {
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
  } = useFetch({ service: getRiskProfile, init: false });

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

  // The two analysis texts belong to FinancialProfile -> Overview, not RiskProfile.
  const {
    fetch: updateFinancialOverviewFetch,
  } = useFetch({ service: updateFinancialOverview, init: false });

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
      data_credit_score: 0,
      score_date: "",
      qualitative_analysis: "",
      financial_analysis: "",
    },
    onSubmit: async (values) => {
      const clientId =
        dataClient?.data?.id ||
        (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id);

      // These fields already existed in the legacy Financial Central view and
      // are persisted in Overview through /financialProfile/:clientId.
      if (clientId) {
        await updateFinancialOverviewFetch(
          clientId,
          values.qualitative_analysis,
          values.financial_analysis
        );
      }

      // Keep the existing RiskProfile persistence unchanged. The analysis
      // fields are deliberately removed because they are not RiskProfile fields.
      const { qualitative_analysis, financial_analysis, ...riskProfileValues } = values;

      if (values.id == "") {
        riskProfile(riskProfileValues);
      } else {
        updateRiskProfileFetch(riskProfileValues);
      }
    },
  });
  // useEffects

  // Get customer data
  useEffect(() => {
    if (!router.isReady) return;

    const clientId = router.query.id;
    if (!clientId || Array.isArray(clientId)) return;

    getCustomer(clientId);
    getRiskProfileFetch(clientId);
  }, [router.isReady, router.query.id]);

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
      formik.setFieldValue(
        "data_credit_score",
        dataRiskProfile1.data.data_credit_score ?? dataRiskProfile1.data.score ?? 0
      );
      formik.setFieldValue(
        "score_date",
        dataRiskProfile1.data.score_date ?? ""
      );
      formik.setFieldValue("id", dataRiskProfile1.data.id);
      formik.setFieldValue(
        "client",
        dataClient?.data?.id ||
          (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id) ||
          ""
      );
    }
  }, [dataRiskProfile1, errorRiskProfileFetch1, loadingRiskProfileFetch1]);

  // Load the legacy Overview fields used by the old "Centrales Financieras" view.
  useEffect(() => {
    const overview = dataFinancialProfile?.data?.overview;
    if (!overview || Array.isArray(overview)) return;

    formik.setFieldValue(
      "qualitative_analysis",
      overview.qualitativeOverview ?? ""
    );
    formik.setFieldValue(
      "financial_analysis",
      overview.financialAnalisis ?? ""
    );
  }, [dataFinancialProfile]);

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
