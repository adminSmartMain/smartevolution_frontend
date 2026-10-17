import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Head from "next/head";
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import phoneNumberSchema from "@schemas/internationalPhoneNumber";

import { SignUpClient } from "./components";
import {
  GetClientByID,
  ModifyClientQuery,
  RegisterClientQuery,
  GetClienteRoles,
} from "./queries";

import { useFormik } from "formik";
import { array, object, string } from "yup";

export default function RegisterClient() {
  const [option, setOption] = useState("");
  const [enteredBy, setEnteredBy] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const router = useRouter();
  const [loading6, setLoading] = useState(false);
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
  } = useFetch({ service: RegisterClientQuery, init: false });

  const {
    fetch: fetch2,
    loading: loading2,
    error: error2,
    data: data2,
  } = useFetch({ service: GetClientByID, init: false });

  const {
    fetch: fetch3,
    loading: loading3,
    error: error3,
    data: data3,
  } = useFetch({ service: ModifyClientQuery, init: false });
  

    const {
    fetch: fetch4,
    loading: loading4,
    error: error4,
    data: data4,
  } = useFetch({ service: GetClienteRoles, init: true});
  
  useEffect(() => {
    if (loading3) Toast("Cargando...", "loading");
    if (error3) Toast("Error al actualizar el cliente", "error");
    if (data3) {
      Toast("Cliente actualizado correctamente", "success");
      setTimeout(() => {
        router.push("/customers/customerList");
      }, 2000);
    }
  }, [loading3, data3, error3]);



  
useEffect(() => {
  if (option !== "register" && option !== "" && option !== undefined) {
    fetch2(Object.values(router.query)[0]).then((data) => {
      const roleIds = (data?.data?.rolesData || [])
        .map((x) => x?.role?.id)
        .filter(Boolean);

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
        type_client: data?.data?.type_client,
        profile_image: data?.data?.profile_image,
        broker: data?.data?.broker,
        ciiu: data?.data?.ciiu,
        citizenship: data?.data?.citizenship,
        contacts: data?.data?.contacts,
        legal_representative: data?.data?.legal_representative,
        social_reason: data?.data?.social_reason,
        birth_date: data?.data?.birth_date,
        updatedAt: data?.data?.updated_at?.split("T")[0],

        // ✅ AQUÍ
        rol_client: roleIds,
      });

      const enterBy = data?.data?.entered_by.first_name
        ? data?.data?.entered_by.first_name + " " + data?.data?.entered_by.last_name
        : data?.data?.entered_by.social_reason;

      setEnteredBy(enterBy);
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
      .when("type_client", {
        is: "26c885fc-2a53-4199-a6c1-7e4e92032696",
        then: string("Ingresa un nombre").required("El nombre es requerido"),
      }),
    last_name: string("Ingresa un apellido")
      .nullable()
      .when("type_client", {
        is: "26c885fc-2a53-4199-a6c1-7e4e92032696",
        then: string("Ingresa un apellido").required(
          "El apellido es requerido"
        ),
      }),

    birth_date: string("Ingresa una fecha de nacimiento")
      .nullable()
      .required("La fecha de nacimiento es requerida"),

    email: string("Ingresa un email")
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Ingresa un email válido"
      )
      .required("El email es requerido"),

    address: string("Ingresa una dirección").required(
      "La dirección es requerida"
    ),

    ...phoneNumberSchema("phone_number"),

    city: string("Selecciona una ciudad")
      .nullable(true)
      .required("La ciudad es requerida"),

    type_client: string("Selecciona un tipo de cliente")
      .nullable(true)
      .required("El tipo de cliente es requerido"),
  rol_client:string("Selecciona un tipo de cliente")
      .nullable(true)
      .required("El tipo de cliente es requerido"),
    broker: string("Selecciona un corredor")
      .nullable(true)
      .required("El corredor es requerido"),

    ciiu: string("Selecciona un CIIU")
      .nullable(true)
      .when("type_client", {
        is: "21cf32d9-522c-43ac-b41c-4dfdf832a7b8",
        then: string("Selecciona un CIIU").required("El CIIU es requerido"),
      }),

    citizenship: string("Selecciona un lugar de constitución")
      .nullable(true)
      .when("type_client", {
        is: "21cf32d9-522c-43ac-b41c-4dfdf832a7b8",
        then: string("Ingresa un lugar de constitución").required(
          "El lugar de constitución es requerido"
        ),
      }),

    contacts: array()
      .of(
        object({
          first_name: string("Ingresa un nombre").nullable(),
          last_name: string("Ingresa un apellido").nullable(),
          phone_number: string("Ingresa un número de teléfono").nullable(),
          email: string("Ingresa un email").matches(
            /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
            "Ingresa un email válido"
          ),
          position: string("Ingresa un cargo")
            .matches(/[a-zA-Z]+/, "Ingresa un cargo válido")
            .nullable(),
        })
      )
      .when("type_client", {
        is: "21cf32d9-522c-43ac-b41c-4dfdf832a7b8",
        then: array().of(
          object({
            first_name: string("Ingresa un nombre")
              .nullable()
              .required("El nombre es requerido"),
            last_name: string("Ingresa un apellido")
              .nullable()
              .required("El apellido es requerido"),
            phone_number: string("Ingresa un número de teléfono").required(
              "El número de teléfono es requerido"
            ),
            email: string("Ingresa un email")
              .matches(
                /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
                "Ingresa un email válido"
              )
              .required("El email es requerido"),
            position: string("Ingresa un cargo")
              .matches(/[a-zA-Z]+/, "Ingresa un cargo válido")
              .nullable()
              .required("El cargo es requerido"),
          })
        ),
      })
      .min(1, "Ingresa al menos un contacto")
      .required("Los contactos son requeridos"),

    social_reason: string("Ingresa una razón social")
      .nullable()
      .when("type_client", {
        is: "21cf32d9-522c-43ac-b41c-4dfdf832a7b8",
        then: string("Ingresa una razón social").required(
          "La razón social es requerida"
        ),
      }),
    legal_representative: object({
      first_name: string("Ingresa un nombre").nullable(),

      last_name: string("Ingresa un apellido").nullable(),
      type_identity: string("Ingresa el tipo de identificación").nullable(),

      document_number: string("Ingresa un número de documento").nullable(),

      birth_date: string("Ingresa una fecha de nacimiento").nullable(),

      email: string("Ingresa un correo electrónico").matches(
        /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
        "Ingresa un email válido"
      ),

      city: string("Selecciona una ciudad").nullable(),

      citizenship: string("Selecciona una nacionalidad").nullable(),

      address: string("Ingresa una dirección").nullable(),

      phone_number: string("Ingresa un número de teléfono").nullable(),

      position: string("Ingresa un cargo").nullable(),
    }).when("type_client", {
      is: "21cf32d9-522c-43ac-b41c-4dfdf832a7b8",
      then: object({
        first_name: string("Ingresa un nombre")
          .nullable()
          .required("El nombre es requerido"),

        last_name: string("Ingresa un apellido")
          .nullable()
          .required("El apellido es requerido"),
        type_identity: string("Ingresa el tipo de identificación")
          .nullable()
          .required("El tipo de identificación es requerido"),

        document_number: string("Ingresa un número de documento")
          .nullable()
          .required("El número de documento es requerido"),

        birth_date: string("Ingresa una fecha de nacimiento")
          .nullable()
          .required("La fecha de nacimiento es requerida"),

        email: string("Ingresa un correo electrónico")
          .matches(
            /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
            "Ingresa un email válido"
          )
          .required("El correo electrónico es requerido"),

        city: string("Selecciona una ciudad")
          .nullable()
          .required("La ciudad es requerida"),

        citizenship: string("Selecciona una nacionalidad")
          .nullable()
          .required("La nacionalidad es requerida"),

        address: string("Ingresa una dirección")
          .nullable()
          .required("La dirección es requerida"),

        phone_number: string("Ingresa un número de teléfono").required(
          "El número de teléfono es requerido"
        ),

        position: string("Ingresa un cargo")
          .nullable()
          .required("El cargo es requerido"),
      }),
    }),
  });

  const initialValues = {
    type_identity: null,
    document_number: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
    city: null,
    type_client: null,
    rol_client:[],
    department: null,
    broker: null,
    ciiu: null,
    citizenship: null,
    social_reason: null,
    birth_date: "",
    contacts: [
      {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        position: "",
      },
    ],
    legal_representative: {
      type_identity: null,
      document_number: "",
      first_name: "",
      last_name: "",
      citizenship: null,
      city: null,
      address: "",
      position: "",
      birth_date: "",
      phone_number: "",
    },
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (option === "register") {
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
      setSuccess(null); 
      setIsModalOpen(true); // Abrir el modal
      console.log(values)
      fetch(values);

      } else if (option === "modify") {
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
        fetch3(values);
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
          router.push("/customers/customerList");
        }, 5000);
      }
    }, [loading3, data3, error3]);
  
  useEffect(() => {
    if (loading == true) {
      Toast("Cargando..", "loading");
    }

    if (error) {
      setSuccess(false);
      setLoading(false);
      setTimeout(() => {
        setIsModalOpen(false)
      }, 4000);
      
      typeof error.message === "object"
        ? Toast(`${Object.values(error.message)}`, "error")
        : Toast(`${error.message}`, "error");
    }

    if (data) {
      setSuccess(true);
      Toast("Cliente creado correctamente", "success");
      setTimeout(() => {
        router.push("customers/customerList");
      }, 5000);
    }
  }, [loading, data, error]);

  return (
    <>
      <Head>
        <title>
          {option === "register" ? "Registrar cliente" : null}
          {option === "modify" ? "Modificar cliente" : null}
          {option === "preview" ? "Visualizar cliente" : null}
        </title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <SignUpClient
        formik={formik}
        option={option}
        ToastContainer={ToastContainer}
        loading={loading2}
        enteredBy={enteredBy}
        updatedAt={updatedAt}
        roles={data4}
        success={success}
        isModalOpen={isModalOpen}
      />
    </>
  );
}
