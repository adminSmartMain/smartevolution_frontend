import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function CurrentOwnerSelector({
  values,
  setFieldValue,
  emisores,
}) {

  const getOptionLabel = (option) =>
    option?.data?.social_reason ||
    `${option?.data?.first_name || ""} ${option?.data?.last_name || ""}`.trim();

  const isOptionEqualToValue = (option, value) =>
    option?.data?.id === value?.data?.id;

  const getCurrentValue = () => {
    if (!values.currentOwnerid) return null;

    return (
      emisores.find(
        (e) => e?.data?.document_number === values.currentOwnerid
      ) || null
    );
  };

  const handleChange = (_, newValue) => {
    if (!newValue) {
      setFieldValue("currentOwnerid", "");
      setFieldValue("currentOwnerName", "");
      return;
    }

    setFieldValue("currentOwnerid", newValue.data.document_number);
    setFieldValue("currentOwnerName", getOptionLabel(newValue));
  };

  return (
    <Autocomplete
      id="currentOwner-name"
      options={emisores}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      value={getCurrentValue()}
      onChange={handleChange}
      disabled
      renderInput={(params) => (
        <TextField
          {...params}
          label="Legítimo Tenedor"
          fullWidth
          disabled
        />
      )}
    />
  );
}
