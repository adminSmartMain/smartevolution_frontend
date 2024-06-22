import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { Cities } from "../queries";

const CitiesSelect = (props) => {
  const {
    value,
    onChange,
    fullWidth,
    error,
    helperText,
    departmentdId,
    ...rest
  } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
    fetch: fetch,
  } = useFetch({ service: Cities, init: false });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!departmentdId) return;

    fetch({ department: departmentdId });
  }, [departmentdId]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const cities = data.data.map((city) => ({
      label: city.description,
      value: city.id,
    }));

    setCities(cities);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={cities}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default CitiesSelect;
