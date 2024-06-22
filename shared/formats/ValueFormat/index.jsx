import { NumericFormat } from "react-number-format";

const ValueFormat = (props) => {
  const { value, ...rest } = props;

  return (
    <>
      <NumericFormat
        {...rest}
        value={value}
        displayType="text"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
      />
    </>
  );
};

export default ValueFormat;
