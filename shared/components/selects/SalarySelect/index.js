import GenericSelect from "../GenericSelect";

const SalarySelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const documentTypes = [
    { label: "De 1 a 50 SMMLV", value: "De 1 a 50 SMMLV" },
    { label: "De 51 a 100 SMMLV", value: "De 51 a 100 SMMLV" },
    { label: "De 101 a 500 SMMLV", value: "De 101 a 500 SMMLV" },
    { label: "Más de 500 SMMLV", value: "Más de 500 SMMLV" },
    { label: "Ilimitado", value: "Ilimitado" },
  ];

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

export default SalarySelect;
