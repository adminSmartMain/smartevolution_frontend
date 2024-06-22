import { Box, Typography } from "@mui/material";

import Modal from "./modal";

const TitleModal = (props) => {
  const { children, title, containerSx, open, handleClose } = props;
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      containerSx={{
        width: "70%",
        height: "max-content",
        ...containerSx,
      }}
    >
      <>
        <Box
          sx={{
            width: "100%",
            borderBottom: "2px solid #5EA3A3",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            letterSpacing={0}
            fontSize="1.7vw"
            fontWeight="500"
            color={"#488B8F"}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </>
    </Modal>
  );
};

export default TitleModal;
