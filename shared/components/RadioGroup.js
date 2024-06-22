import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MUIRadioGroup from "@mui/material/RadioGroup";

import responsiveFontSize from "@lib/responsiveFontSize";

import Radio from "@styles/fields/Radio";

export const Element = (props) => {
  const { value, label, ...rest } = props;

  return (
    <FormControlLabel
      value={value}
      control={<Radio />}
      label={label}
      sx={{
        m: 0,
        "	.MuiFormControlLabel-label": {
          color: "#333333",
          fontWeight: 500,
          fontSize: responsiveFontSize(16, 0.8205, 2),
        },
      }}
    />
  );
};

const RadioGroup = (props) => {
  const { value, error, helperText, handleChange, children, ...rest } = props;

  return (
    <FormControl
      error={error}
      variant="standard"
      sx={{
        border: "1px solid #5EA3A380",
        backgroundColor: "#FAFAFA",
        borderRadius: "4px",
        py: 0.5,
        pl: 1,
        pr: 3,
      }}
    >
      <MUIRadioGroup name="quiz" value={value} onChange={handleChange}>
        {children}
      </MUIRadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default RadioGroup;
