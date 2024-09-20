import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { IdentityType } from "../queries";

const DocumentTypesSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: IdentityType, init: true });

  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const documentTypes = data.data.map((documentType) => ({
      label: documentType.description,
      value: documentType.id,
    }));

    setDocumentTypes(documentTypes);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={documentTypes}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default DocumentTypesSelect;
