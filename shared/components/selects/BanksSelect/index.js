import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { ListBanks } from "../queries";

const BanksSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: ListBanks, init: true });

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const banks = data.data.map((bank) => ({
      label: bank.description,
      value: bank.id,
    }));

    setBanks(banks);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={banks}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default BanksSelect;
