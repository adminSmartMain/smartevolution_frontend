import { useEffect } from "react";

import { TypeSpecimenOutlined } from "@mui/icons-material";

import { Toast } from "@components/toast";

const useToatsStatus = (
  loading,
  data,
  error,
  successCondtion,
  successMessage,
  errorMessage,
  loadingMessage = "Cargando..."
) => {
  useEffect(() => {
    if (error) Toast(errorMessage, "error");
    if (loading == true) Toast(loadingMessage, "loading");
    if (successCondtion(loading, data, error)) Toast(successMessage, "success");
  }, [loading, data, error]);

  return null;
};

export default useToatsStatus;
