import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { AccountTypes } from "../queries";

const AccountTypesSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: AccountTypes, init: true });

  const [accountTypes, setAccountTypes] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const accountTypes = data.data.map((accountType) => ({
      label: accountType.description,
      value: accountType.id,
    }));

    setAccountTypes(accountTypes);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={accountTypes}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default AccountTypesSelect;
