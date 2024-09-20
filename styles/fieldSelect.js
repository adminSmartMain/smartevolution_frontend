import { Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";

const SelectField = styled(Autocomplete)({
  backgroundColor: "white",
  border: "1px solid #ACCFCF",
  borderRadius: "5px",
  padding: "10px",
  "& .MuiInputBase-input": {
    padding: "2px",
  },
});

export default SelectField;
