import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";

import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { InputAdornments } from "./components";
import { login } from "./queries";

import { useFormik } from "formik";
import { object, string } from "yup";
import { setAccessToken } from "@lib/auth/session";

export const InputV = () => {
  // Hooks
  const {
    fetch: loginFetch,
    loading: Loading,
    error: Error,
    data: data,
  } = useFetch({ service: login, init: false });

  const router = useRouter();
  const loginInFlight = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Effects
  useEffect(() => {
    if (Error) {
      if (Error.code === 429) {
        const seconds = Math.max(1, Error.retryAfter || 1);
        setCooldownSeconds(seconds);
        const wait = seconds >= 60
          ? `${Math.ceil(seconds / 60)} minuto${Math.ceil(seconds / 60) === 1 ? "" : "s"}`
          : `${seconds} segundo${seconds === 1 ? "" : "s"}`;
        Toast(`Detectamos demasiados intentos. Por seguridad, el acceso está temporalmente restringido. Intenta nuevamente en ${wait}.`, "error");
      } else {
        Toast("Usuario y/o Contraseña incorrectos", "error");
      }
      setCaptchaRequired(Boolean(Error.metadata?.captcha_required));
      loginInFlight.current = false;
      setIsSubmitting(false);
    }

    if (data !== undefined) {
      setAccessToken(data.access);
      loginInFlight.current = false;
      setIsSubmitting(false);
      Toast("Bienvenido", "success");
      // Authorization data is obtained from /access-control/me/ by the
      // AuthProvider. The JWT intentionally contains no profile snapshot.
      router.push("/dashboard");
    }
  }, [data, Error, router]);

  useEffect(() => {
    if (!cooldownSeconds) return undefined;
    const timeout = window.setTimeout(() => setCooldownSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [cooldownSeconds]);

  const validationSchema = object({
    email: string("Ingresa un email")
      .matches(
        /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
        "Ingresa un email válido"
      )
      .required("El email es requerido"),

    password: string("Ingresa una contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("La contraseña es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      captcha_token: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (loginInFlight.current || isSubmitting || Loading || cooldownSeconds > 0) return;
      loginInFlight.current = true;
      setIsSubmitting(true);
      // useFetch resolves both success and failure into state; the effect
      // above releases this synchronous guard once the request settles.
      await loginFetch(values);
    },
  });

  const [values, setValues] = useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCaptchaToken = useCallback((token) => {
    formik.setFieldValue("captcha_token", token);
  }, [formik]);

  return (
    <>
      <InputAdornments
        formik={formik}
        values={values}
        setValues={setValues}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        ToastContainer={ToastContainer}
        loading={Loading}
        isSubmitting={isSubmitting}
        captchaRequired={captchaRequired}
        onCaptchaToken={handleCaptchaToken}
        cooldownSeconds={cooldownSeconds}
      />
    </>
  );
};
