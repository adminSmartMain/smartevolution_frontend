import { useEffect, useState } from "react";

import { useFetch } from "@hooks/useFetch";

import GenericSelect from "../GenericSelect";
import { Departments } from "../queries";

const DepartmentsSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const {
    loading: loading,
    error: fetchError,
    data: data,
  } = useFetch({ service: Departments, init: true });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (fetchError) return;
    if (!data) return;

    const departments = data.data.map((department) => ({
      label: department.description,
      value: department.id,
    }));

    setDepartments(departments);
  }, [data, loading, fetchError]);

  return (
    <GenericSelect
      error={error}
      value={value}
      onChange={onChange}
      options={departments}
      fullWidth={fullWidth}
      helperText={helperText}
    />
  );
};

export default DepartmentsSelect;
