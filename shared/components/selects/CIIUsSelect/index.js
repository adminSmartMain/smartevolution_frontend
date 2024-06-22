import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { CIIU } from "../queries";

const CIIUsSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: CIIU, init: true });

  const [ciius, setCiius] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const ciius = data.data.map((ciiu) => ({
      label: `${ciiu.code} - ${ciiu.activity.description}`,
      value: ciiu.id,
    }));

    setCiius(ciius);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={ciius}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default CIIUsSelect;
