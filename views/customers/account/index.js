import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { AccountComponent } from "./components";
import {
  GetAccountByID,
  ModifyAccountQuery,
  RegisterAccountQuery,
} from "./queries";

import { useFormik } from "formik";
import { object, string } from "yup";

export default function RegisterAccount() {
  const [option, setOption] = useState("");
  const router = useRouter();
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (router && router.query) {
      setOption(Object.keys(router.query)[0]);
    }
  }, [router.query]);

  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: RegisterAccountQuery, init: false });

  const {
    fetch: fetch2,
    loading: loading2,
    error: error2,
    data: data2,
  } = useFetch({ service: GetAccountByID, init: false });

  const {
    fetch: fetch3,
    loading: loading3,
    error: error3,
    data: data3,
  } = useFetch({ service: ModifyAccountQuery, init: false });

  useEffect(() => {
    if (option === "modify" || option === "preview") {
      console.log({
        id: data?.data?.id || "",
        accountType: data?.data?.primary === true ? "Primaria" : "Secundaria",
        client: data?.data?.client.id || null,
        account_number: data?.data?.account_number || "",
        state: data?.data?.state === true ? "Activo" : "Inactivo",
        observations: data?.data?.observations || "", 
      })
      fetch2(Object.values(router.query)[0]).then((data) => {
        formik.setValues({
          id: data?.data?.id || "",
          accountType: data?.data?.primary === true ? "Primaria" : "Secundaria",
          client: data?.data?.client.id || null,
          account_number: data?.data?.account_number || "",
          state: data?.data?.state === true ? "Activo" : "Inactivo",
          observations: data?.data?.observations || "", 
        });
      });
      
    }
  }, [option]);

  const validationSchema = object({
    client: string().required("Este campo es requerido").nullable(),
    accountType: string().required("Este campo es requerido").nullable(),
  });

  const initialValues = {
    id: "",
    accountType: null,
    client: null,
    account_number: "",
    state: null,
    observations: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values,{ setSubmitting }) => {
      if (option === "register") {
        if(values.accountType === "Primaria"){
          Toast(`Solo se puede tener una cuenta primaria por cliente`, "error");
        } else {

        
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
          fetch({
            client: values.client,
            primary: values.accountType === "Primaria" ? true : false,
            observations: values.observations,
          });
        }
      } else {
        
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
        fetch3({
          client: values.client,
          primary: values.accountType === "Primaria" ? true : false,
          observations: values.observations,
          state: values.state === "Activo" ? true : false,
          id: values.id,
          account_number: values.account_number,
        });
      }
    },
  });

  useEffect(() => {
    if (loading3) Toast("Cargando...", "loading");

    if (error3) Toast("Error al actualizar la cuenta", "error");

    if (data3) {
      setSuccess(true);
      Toast("Cuenta actualizada correctamente", "success");
      console.log(data3)
      setTimeout(() => {
        router.push("accountList");
      }, 8000);
    }
  }, [loading3, data3, error3]);

  useEffect(() => {
    if (loading == true) {
      Toast("Cargando...", "loading");
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setSuccess(false);
     
      setTimeout(() => {
        setIsModalOpen(false); // Cerrar el modal de error después de 4 segundos
      }, 4000);
  
      // Mostrar el mensaje de error
      typeof error.message === "object"
        ? Toast(`${Object.values(error.message)}`, "error")
        : Toast(`${error.message}`, "error");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSuccess(true);
      Toast("Cuenta creada correctamente", "success");
      setIsModalOpen(true);
      setTimeout(() => {
        router.push("accountList");
      }, 8000);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>
          {option === "register" ? "Registrar cuenta" : null}
          {option === "modify" ? "Modificar cuenta" : null}
          {option === "preview" ? "Visualizar cuenta" : null}
        </title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <AccountComponent
        formik={formik}
        option={option}
        ToastContainer={ToastContainer}
        loading={loading2}
        success={success}
        isModalOpen={isModalOpen}
      />
    </>
  );
}
