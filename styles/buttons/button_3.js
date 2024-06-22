import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const DashboardButton = styled(Button)({
  borderRadius: "4px",
  border: "1.4px solid #63595C",
  color: "#63595C",
  fontSize: "0.7rem",
  "&:hover": {
    backgroundColor: "#CDCDCD",
  },
  fontWeight: "bold",
});

export default DashboardButton;
