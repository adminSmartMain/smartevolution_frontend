// React
import { useEffect, useState } from "react";
// Alerts
import { ToastContainer } from "react-toastify";

// Hooks
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

// Components
import { RefundV } from "./components";
// Queries
import {
  GetRefundByID,
  GetRiskProfile,
  SaveRefund,
  UpdateRefund,
} from "./queries";

import { useFormik } from "formik";
// Validations
import { object, string } from "yup";

export const RefundC = () => {
  const [option, setOption] = useState("");
  // Router
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) {
      setOption(Object.keys(router.query)[0]);
    }
  }, [router.query]);

  // Get the refund data
  useEffect(() => {
    if (router.query.id != undefined) {
      RefundByIdFetch(router.query.id);
    }
  }, [router.query.id]);

  // Validations
  const validationSchema = object({
    client: string("Selecciona el emisor")
      .nullable(true)
      .required("El emisor es requerido"),

    account: string("Selecciona la cuenta")
      .nullable(true)
      .required("La cuenta es requerida"),

    date: string("Ingresa la fecha de giro").required("La fecha es requerida"),

    amount: string("Ingresa el monto de operación")
      .required("El monto es requerido")
      .nullable(true)
      .matches(/^[0-9]+$/, "El monto es requerido"),

    observations: string("Ingresa una observación").nullable(true),

    beneficiary: string("Ingresa el beneficiario").required(
      "El beneficiario es requerido"
    ),

    bank: string("Ingresa el banco")
      .nullable(true)
      .required("El banco es requerido"),

    accountNumber: string("Ingresa el número de cuenta")
      .nullable(true)
      .required("El número de cuenta es requerido"),

    accountType: string("Selecciona el tipo de cuenta")
      .nullable(true)
      .required("El tipo de cuenta es requerido"),
  });

  // Queries
  const {
    fetch: saveRefundFetch,
    loading: saveRefundLoading,
    error: saveRefundError,
    data: saveRefundData,
  } = useFetch({ service: SaveRefund, init: false });

  const {
    fetch: updateRefundFetch,
    loading: updateRefundLoading,
    error: updateRefundError,
    data: updateRefundData,
  } = useFetch({ service: UpdateRefund, init: false });

  const {
    fetch: RefundByIdFetch,
    loading: RefundByIdLoading,
    error: RefundByIdError,
    data: RefundByIdData,
  } = useFetch({ service: GetRefundByID, init: false });

  const {
    fetch: fetch4,
    loading: loading4,
    error: error4,
    data: data4,
  } = useFetch({ service: GetRiskProfile, init: false });

  useEffect(() => {
    if (saveRefundLoading) Toast("Se está registrando el reintegro", "info");

    if (saveRefundError) Toast(saveRefundError.message, "error");

    if (saveRefundData) {
      Toast("Se ha registrado el reintegro correctamente", "success");
      setTimeout(() => {
        router.push("/administration/refund/refundList");
      }, 2000);
    }
  }, [saveRefundData, saveRefundError, saveRefundLoading]);

  useEffect(() => {
    if (updateRefundLoading) Toast("Se está actualizando el reintegro", "info");

    if (updateRefundError) Toast(updateRefundError.message, "error");

    if (updateRefundData) {
      Toast("Se ha actualizado el reintegro correctamente", "success");
      setTimeout(() => {
        router.push("/administration/refund/refundList");
      }, 2000);
    }
  }, [updateRefundData, updateRefundError, updateRefundLoading]);

  useEffect(() => {
    if (RefundByIdData !== undefined) {
      formik.setValues(RefundByIdData?.data);
      formik.setFieldValue("client", RefundByIdData?.data?.client?.id);
      formik.setFieldValue("account", RefundByIdData?.data?.account?.id);
      formik.setFieldValue("bank", RefundByIdData?.data?.bank?.id);
      formik.setFieldValue(
        "accountType",
        RefundByIdData?.data?.accountType?.id
      );
    }
  }, [RefundByIdData, RefundByIdError, RefundByIdLoading]);

  useEffect(() => {
    if (option === "register") {
      if (data4) {
        formik.setValues({
          ...formik.values,
          beneficiary: data4?.data?.client,
          accountNumber: data4?.data?.account_number,
          accountType: data4?.data?.account_type,
          bank: data4?.data?.bank,
        });
        formik.setFieldValue("applyGM", data4?.data?.gmf);
      }

      if (error4) {
        formik.setValues({
          ...formik.values,
          beneficiary: error4.message.client,
          accountNumber: "",
          accountType: "",
          bank: "",
        });
        Toast("Cliente sin cuenta en el perfil de riesgo", "error");
      }
    } else {
      if (data4) {
        formik.setValues({
          ...formik.values,
          beneficiary: data4?.data?.client,
        });
      }
    }
  }, [data4, loading4, error4]);

  // Form
  const formik = useFormik({
    initialValues: {
      id: "",
      client: "",
      account: "",
      date: "",
      amount: 0,
      applyGM: false,
      gmAmount: 0,
      bank: "",
      accountType: "",
      accountNumber: "",
      beneficiary: "",
      observations: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (formik.values.id == "") saveRefundFetch(values);
      else updateRefundFetch(values);
    },
  });

  useEffect(() => {
    if (
      formik.errors &&
      Object.keys(formik.errors).length !== 0 &&
      formik.isSubmitting
    ) {
      Toast("Faltan campos", "error");
    }
  }, [formik.errors, formik.isSubmitting]);

  useEffect(() => {
    if (formik.values.client) {
      fetch4(formik.values.client);
    }
  }, [formik?.values?.client]);

  return (
    <RefundV formik={formik} option={option} ToastContainer={ToastContainer} />
  );
};
