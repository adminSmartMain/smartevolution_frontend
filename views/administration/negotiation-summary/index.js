import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { NegotiationSummary } from "./components";
import {
  GetRiskProfile,
  GetSummaryByID,
  ModifyDepositQuery,
  RegisterDepositQuery,
} from "./queries";

import { useFormik } from "formik";
import { object, string } from "yup";

export default function FinancialProf() {
  const router = useRouter();
  const [option, setOption] = useState("");
  useEffect(() => {
    if (router && router.query) {
      setOption(Object.keys(router.query)[0]);
    }
  }, [router.query]);

  
  const initialValues = {
    id: null,
    opId: router.query.id,
    description: "",
    amount: null,
    date: `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`,
    third: null,
    accountingControl: null,
    typeExpenditure: null,
    modify: false,
  };
  const validationSchema = object({
    description: string("Ingresa una descripción").required(
      "La descripción es requerida"
    ),

    amount: string("Ingresa un monto")
      .nullable(true)
      .required("El monto es requerido"),

    date: string("Ingresa una fecha").required("La fecha es requerida"),

    third: string("Selecciona un tercero")
      .nullable(true)
      .required("El tercero es requerido"),

    accountingControl: string("Selecciona una cuenta contable")
      .nullable(true)
      .required("La cuenta es requerida"),

    typeExpenditure: string("Selecciona un tipo de egreso")
      .nullable(true)
      .required("El tipo de egreso es requerido"),
  });


  const [pendingAccounts, setPendingAccounts] = useState([]);

  const {
    fetch: fetchSummaryByID,
    loading: loadingSummaryByID,
    error: errorSummaryByID,
    data: dataSummaryByID,
  } = useFetch({ service: GetSummaryByID, init: false });

  useEffect(() => {
    if (option === "modify") {
      fetchSummaryByID(router.query.opId);
    }
  }, [option]);

  useEffect(() => {
    if (dataSummaryByID) {

      setPendingAccounts(dataSummaryByID?.data?.pendingAccounts);
      setDeposits(dataSummaryByID?.data?.emitterDeposits);
    }
  }, [dataSummaryByID]);


  //aca se crea la lista con el pendingAccounts
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: (values) => {
      if (!values.modify) {
        console.log("Agregando nuevo descuento:", values)
        setPendingAccounts([...pendingAccounts, values]);
        Toast("Descuento agregado", "success");
      } else {
        const index = pendingAccounts.findIndex(
          (item) => item.id === values.id
        );
        pendingAccounts[index] = values;
        setPendingAccounts([...pendingAccounts]);
        Toast("Descuento modificado", "success");
      }
      formik.resetForm();
    },
  });

  const handleDeletePendingAccount = (id) => {
    const index = pendingAccounts.findIndex((item) => item.id === id);
    pendingAccounts.splice(index, 1);
    setPendingAccounts([...pendingAccounts]);
    Toast("Descuento eliminado", "success");
  };

  const validationSchema2 = object({
  client: string("Selecciona el emisor")
    .nullable(true)
    .required("El emisor es requerido"),

  account: string("Selecciona la cuenta")
    .nullable(true)
    .required("La cuenta es requerida"),

  date: string("Ingresa la fecha de giro").required("La fecha es requerida"),

  amount: string("Ingresa el monto de operación").required(
    "El monto es requerido"
  ),

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

  egressType: string("Selecciona el tipo de egreso")
    .nullable(true)
    .required("El tipo de egreso es requerido"),
});

//valores iniciales para el deposito
const initialValues2 = {
  client: null,
  account: null,
  amount: "",
  date: "",
  observations: "",
  beneficiary: "",
  bank: null,
  accountNumber: null,
  accountType: null,
  egressType: null,
  operation: null,
  modify: false,
};



const [deposits, setDeposits] = useState([]);

const {
  fetch: fetchRegisterDeposit,
  loading: loadingRegisterDeposit,
  error: errorRegisterDeposit,
  data: dataRegisterDeposit,
} = useFetch({ service: RegisterDepositQuery, init: false });

const {
  fetch: fetchModifyDeposit,
  loading: loadingModifyDeposit,
  error: errorModifyDeposit,
  data: dataModifyDeposit,
} = useFetch({ service: ModifyDepositQuery, init: false });


useEffect(() => {
  if (option === "modify") {
    fetchSummaryByID(router.query.opId);
  }
}, [option]);


  //aqui es donde se generan los depositos modificado
  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: validationSchema2,
    onSubmit: (values) => {
      console.log("Agregando nuevo deposito:", values)
      if (!values.modify) {
        
        setDeposits([...deposits, values]);
        fetchRegisterDeposit(values)
        fetchModifyDeposit(values);
        Toast("Depósito registrado", "success");
      } else {
        const index = deposits.findIndex(
          (item) => item.id === values.id
        );
        deposits[index] = values;
        console.log(deposits)
        setDeposits([...deposits]);
        
        fetchModifyDeposit(values);
        Toast("Depósito modificado", "success");
      }
      formik2.resetForm();
    },
  });

  const handleDeleteDeposits = (id) => {
    const index = deposits.findIndex((item) => item.id === id);
    console.log("objeto eliminado",index)
    deposits.splice(index, 1);
    setDeposits([...deposits]);
    Toast("deposito eliminado", "success");
  };

  return (
    <>
      <Head>
        <title>Resumen de Negociación</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <NegotiationSummary
        formik={formik}
        formik2={formik2}
        ToastContainer={ToastContainer}
        PendingAccounts={pendingAccounts}
        handleDeletePendingAccount={handleDeletePendingAccount}
        handleDeleteDeposits={handleDeleteDeposits}
        option={option}
        Deposits={deposits}
      />
    </>
  );
}
