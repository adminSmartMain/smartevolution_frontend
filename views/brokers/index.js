import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { SignUpBroker } from "./components";
import {
  GetBrokerByID,
  ModifyBrokerQuery,
  RegisterBrokerQuery,
} from "./queries";

import { useFormik } from "formik";
import { object, string } from "yup";

export default function RegisterBroker() {
  const [option, setOption] = useState("");
  const router = useRouter();
  const [loading7, setLoading] = useState(false);
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
  } = useFetch({ service: RegisterBrokerQuery, init: false });

  const {
    fetch: fetch2,
    loading: loading2,
    error: error2,
    data: data2,
  } = useFetch({ service: GetBrokerByID, init: false });

  const {
    fetch: fetch3,
    loading: loading3,
    error: error3,
    data: data3,
  } = useFetch({ service: ModifyBrokerQuery, init: false });

  useEffect(() => {
    if (option === "modify" || option === "preview") {
      fetch2(Object.values(router.query)[0]).then((data) => {
        formik.setValues({
          id: data?.data?.id,
          type_identity: data?.data?.type_identity,
          document_number: data?.data?.document_number,
          department: data?.data?.department,
          first_name: data?.data?.first_name,
          last_name: data?.data?.last_name,
          email: data?.data?.email,
          address: data?.data?.address,
          phone_number: data?.data?.phone_number,
          city: data?.data?.city,
        });
      });
    }
  }, [option]);

  const validationSchema = object({
    type_identity: string("Ingresa el tipo de identificación del corredor")
      .nullable(true)
      .required("El tipo de identificación es requerido"),

    document_number: string("Ingresa un número de documento")
      .matches(/^[0-9]+$/, "Ingresa un número de documento válido")
      .required("El número de documento es requerido"),

    first_name: string("Ingresa un nombre")
      .nullable()
      .when("type_identity", {
        is: (typeID) =>
          typeID !== "6b1a9326-00c6-4b72-a8b4-4453b889fbb7" || typeID === null,
        then: string("Ingresa un nombre").required("El nombre es requerido"),
      }),
    last_name: string("Ingresa un apellido")
      .nullable()
      .when("type_identity", {
        is: (typeID) =>
          typeID !== "6b1a9326-00c6-4b72-a8b4-4453b889fbb7" || typeID === null,
        then: string("Ingresa un apellido").required(
          "El apellido es requerido"
        ),
      }),

    social_reason: string("Ingresa una razón social")
      .nullable()
      .when("type_client", {
        is: "6b1a9326-00c6-4b72-a8b4-4453b889fbb7",
        then: string("Ingresa una razón social").required(
          "La razón social es requerida"
        ),
      }),

    email: string("Ingresa un email")
      .matches(
        /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
        "Ingresa un email válido"
      )
      .required("El email es requerido"),

    address: string("Ingresa una dirección").required(
      "La dirección es requerida"
    ),

    phone_number: string("Ingresa un número de teléfono")
      .matches(/^[0-9]+$/, "Ingresa un número de teléfono válido")
      .required("El número de teléfono es requerido"),

    city: string("Ingresa una ciudad")
      .nullable(true)
      .required("La ciudad es requerida"),
  });

  const initialValues = {
    type_identity: null,
    document_number: "",
    first_name: null,
    last_name: null,
    email: "",
    address: "",
    phone_number: "",
    city: null,
    department: null,
    social_reason: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (option === "register") {
        setLoading(true);
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
        fetch(values);
        
      } else {
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
        fetch3(values);
        
       // 🔥 Rehabilita el botón si hay error
      }
    },
  });

  useEffect(() => {
    if (loading3) Toast("Cargando...", "loading");

    if (error3) Toast("Error al actualizar el corredor", "error");

    if (data3) {
      setSuccess(true);
      Toast("Corredor actualizado correctamente", "success");
      setTimeout(() => {
        router.push("brokers/brokerList");
      }, 5000);
    }
  }, [loading3, data3, error3]);

  // Efecto para manejar el estado de "loading"
useEffect(() => {
  if (loading) {
    Toast("Cargando...", "loading");
  }
}, [loading]);

// Efecto para manejar el estado de "error"
useEffect(() => {
  if (error) {
    setSuccess(false);
    setLoading(false);
    setTimeout(() => {
      setIsModalOpen(false); // Cerrar el modal de error después de 4 segundos
    }, 4000);

    // Mostrar el mensaje de error
    typeof error.message === "object"
      ? Toast(`${Object.values(error.message)}`, "error")
      : Toast(`${error.message}`, "error");
  }
}, [error]);

// Efecto para manejar el estado de "data"
useEffect(() => {
  if (data) {
    setSuccess(true);
    Toast("Corredor creado correctamente", "success");
    setIsModalOpen(true); // Abrir el modal de éxito
    setTimeout(() => {
      router.push("brokers/brokerList"); // Redirigir después de 5 segundos
    }, 5000);
  }
}, [data]);

  return (
    <>
      <Head>
        <title>
          {option === "register" ? "Registro de corredores" : null}
          {option === "modify" ? "Modificacion de corredor" : null}
          {option === "preview" ? "Visualización de corredor" : null}
        </title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <SignUpBroker
        formik={formik}
        option={option}
        ToastContainer={ToastContainer}
        loading={loading}
      success={success}
      isModalOpen={isModalOpen}
      />
    </>
  );
}
