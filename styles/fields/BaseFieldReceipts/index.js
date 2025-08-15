import { NumericFormat, PatternFormat } from "react-number-format";

import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import responsiveFontSize from "@lib/responsiveFontSize";

const DefaultTextField = (props) => (
  <TextField  {...props} />
);

export const StandardTextField = (props) => {
  const { isMasked, isPatterned, onChangeMasked, ...rest } = props;

  if (isPatterned)
    return (
      <PatternFormat
        {...rest}
        customInput={DefaultTextField}
        onValueChange={(values) => {
          onChangeMasked(values);
        }}
      />
    );

  if (isMasked)
    return (
      <NumericFormat
        {...rest}
        customInput={DefaultTextField}
        onValueChange={(values) => {
          onChangeMasked(values);
        }}
      />
    );

  return <DefaultTextField {...props} />;
};

const BaseField = styled(StandardTextField)(({ theme }) => ({

}));

export default BaseField;
