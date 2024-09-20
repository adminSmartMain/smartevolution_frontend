import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const smartField = styled(TextField)({
  backgroundColor: "white",
  border: "1.4px solid #ACCFCF",
  borderRadius: "5px",
  padding: "10px",
  height: "1rem",
  "& .MuiInputBase-input": {
    padding: "2px",
    "&::placeholder": {
      color: "#57575780",
      fontSize: "0.9rem",
    },
  },
  "&:hover": {
    border: "1.4px solid #ACCFCF",
    backgroundColor: "#EBFAF6",
  },
});

export default smartField;
