import GenericSelect from "../GenericSelect";

const EmployeeNumberSelect = (props) => {
  const { value, onChange, fullWidth, error, helperText, ...rest } = props;

  const documentTypes = [
    { label: "De 1 a 10", value: "De 1 a 10" },
    { label: "De 11 a 25", value: "De 11 a 25" },
    { label: "De 26 a 50", value: "De 26 a 50" },
    { label: "Más de 50", value: "Más de 50" },
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

export default EmployeeNumberSelect;
