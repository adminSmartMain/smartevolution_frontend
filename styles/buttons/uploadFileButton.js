import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const FileUploadButton = styled(Button)({
  backgroundColor: "white",
  border: "1.4px solid #ACCFCF",
  borderRadius: "4px",
  height: "2.5rem",
  width: "17vw",
  textAlign: "left",
  letterSpacing: "0",
  fontSize: "calc(0.3rem + 0.5vw)",
  fontWeight: "regular",
  textTransform: "none",
  color: "#57575780",
  "&:hover": {
    backgroundColor: "#EBFAF6",
  },
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: "1rem",
});

export default FileUploadButton;
