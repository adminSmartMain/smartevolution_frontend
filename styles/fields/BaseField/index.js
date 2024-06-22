import { NumericFormat, PatternFormat } from "react-number-format";

import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import responsiveFontSize from "@lib/responsiveFontSize";

const DefaultTextField = (props) => (
  <TextField variant="outlined" size="small" {...props} />
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
  "& .MuiInputBase-root": {
    backgroundColor: "#fafafa",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#5EA3A380 !important",
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f !important",
  },

  "& .MuiOutlinedInput-input": {
    color: "#575757",
    fontWeight: 500,
    fontSize: responsiveFontSize(16, 0.8205, 2),
  },

  "& .MuiInputAdornment-root": {
    color: "#5EA3A3",
  },
}));

export default BaseField;
