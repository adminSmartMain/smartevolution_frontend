import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal as MUIModal,
} from "@mui/material";

const backDropStyles = {
  background: "#B5D1C915",
  backdropFilter: "blur(0.5px)",
};

const containerStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30vw",
  height: "35vh",
  backgroundColor: "white",
  borderRadius: "4px",
  boxShadow: "0px 10px 10px #5EA3A320",
  p: 4,
};

const closeButtonStyles = {
  width: "2rem",
  height: "2rem",
  "&:hover": {
    backgroundColor: "#B5D1C940",
    color: "#488B8F",
  },
};

const CloseButton = (props) => {
  const { handleClose, ...rest } = props;

  return (
    <Box position="absolute" right="0" mr={4}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={closeButtonStyles}
      >
        <i style={{ fontSize: "1.2vw" }} className="fa-regular fa-xmark" />
      </IconButton>
    </Box>
  );
};

const Modal = (props) => {
  const { open, handleClose, children, containerSx, ...rest } = props;

  return (
    <MUIModal
      closeAfterTransition
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{ sx: backDropStyles, timeout: 500 }}
    >
      <Fade in={open}>
        <Box sx={{ ...containerStyles, ...containerSx }}>
          <CloseButton handleClose={handleClose} />
          {children}
        </Box>
      </Fade>
    </MUIModal>
  );
};

export default Modal;
