import React, { useState } from "react";
import ForgotPassword from "./components";
import { resetPassword } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { useRouter } from "next/router";

const ForgotPasswordIndex = () => {
  const [email, setEmail] = useState("");
  const [attempts, setAttempts] = useState(3); // Intentos restantes
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { fetch: resetPasswordFetch, loading, error, data } = useFetch({
    service: resetPassword,
    init: false,
  });


  const resendEmail = async () => {
    if (email) {
      try {
        // Realizamos la solicitud para restablecer la contraseña
        const response = await resetPasswordFetch({ email });

        if (response?.error === false) {
          console.log("Correo reenviado exitosamente:", response?.message);
          // Puedes mostrar un mensaje de éxito o algo similar
        } else {
          console.log("Error al reenviar el correo:", response?.message || "Error desconocido");
        }
      } catch (err) {
        console.log("Error en el reenvío del correo:", err.message || err);
      }
    }
  };


  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar la acción por defecto del formulario

    if (email) {
      try {
        // Realizamos la solicitud para restablecer la contraseña
        const response = await resetPasswordFetch({ email });

        if (response?.error === false) {
          console.log(response?.message);
          setSuccess(true);
          setTimeout(() => {
          //  router.push("/auth/login");
          }, 3000); // Redirigir al login después de 3 segundos
        } else {
          // Si hay un error, disminuimos los intentos restantes
          console.log(response?.message || "Error desconocido");
          console.log(response)
          setAttempts((prevAttempts) => {
            const newAttempts = prevAttempts - 1;
            if (newAttempts <= 0) {
             console.log('finalizaron los intentos') //setTimeout(() => router.push("/auth/login"), 3000); // Redirigir al login si se agotaron los intentos
            
            }
            return newAttempts;
          });
        }
      } catch (err) {
        console.log("Error en el envío:", err.message || err);
      }
    }
  };

  return (
    <ForgotPassword
      email={email}
      setEmail={setEmail}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      attempts={attempts}
      success={success}
      resendEmail={resendEmail}
     

    />
  );
};

export default ForgotPasswordIndex;
