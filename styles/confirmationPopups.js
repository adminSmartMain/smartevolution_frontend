import { Modal } from "@mui/material";
import { styled } from "@mui/material/styles";

const ConfirmationModal = styled(Modal)({
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
});

export default ConfirmationModal;
