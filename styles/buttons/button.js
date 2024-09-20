import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const RoundButton = styled(Button)({
  borderRadius: "4px",
  marginBottom: "10px",
  color: "white",
  backgroundColor: "#5EA3A3",
  padding: "16px",
  "&:hover": {
    backgroundColor: "#5EA3A3C8",
  },
  marginTop: "40px",
  fontWeight: "bold",
});

export default RoundButton;
