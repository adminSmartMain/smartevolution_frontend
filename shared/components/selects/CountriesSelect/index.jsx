import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { Citizenship } from "../queries";

const CountriesSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: Citizenship, init: true });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const countries = data.data.map((country) => ({
      label: country.name_es,
      value: country.id,
    }));

    setCountries(countries);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={countries}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default CountriesSelect;
