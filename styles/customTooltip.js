import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

/* const CustomTooltip = styled(Tooltip)({
  backgroundColor: "#63595C",
  border: "1px solid #8C7E82",
  color: "#FFFFFF",
  fontSize: "0.8rem",
  fontWeight: "600",
}); */

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#63595C",
    border: "1px solid #8C7E82",
    color: "#FFFFFF",
    fontSize: "0.8rem",
    fontWeight: "600",
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: "#63595C",
  },
}));

export default CustomTooltip;
