import { FormGroup } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

import responsiveFontSize from "@lib/responsiveFontSize";

import SMCheckBox from "@styles/fields/SMCheckBox";

export const CheckBoxElement = (props) => {
  const { checked, label, ...rest } = props;

  return (
    <FormControlLabel
      {...rest}
      control={<SMCheckBox checked={checked} />}
      label={label}
      sx={{
        alignItems: "start",
        m: 0,
        mb: 2,
        "	.MuiFormControlLabel-label": {
          color: "#333333",
          fontWeight: 500,
          fontSize: responsiveFontSize(16, 0.8205, 2),
        },
      }}
    />
  );
};

const CheckBoxGroup = (props) => {
  const { value, error, helperText, handleChange, children, ...rest } = props;

  return (
    <FormControl
      error={error}
      component="fieldset"
      variant="standard"
      sx={{ py: 0.5, pl: 1, pr: 3 }}
    >
      <FormGroup name="quiz" value={value} onChange={handleChange}>
        {children}
      </FormGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default CheckBoxGroup;
