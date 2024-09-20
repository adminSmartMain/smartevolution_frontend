import React from "react";

import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";

const BackButton = (props) => {
  const { path, text = "Atrás", wrapperSx, buttonSx, onClick, ...rest } = props;

  return (
    <Box
      component={path ? Link : "div"}
      href={path}
      sx={{ width: "fit-content", ...wrapperSx }}
    >
      <Button
        variant="standard"
        onClick={onClick}
        startIcon={<ArrowBackIcon sx={{ color: "#5EA3A3" }} />}
        sx={{
          width: "fit-content",
          py: "4px",
          borderRadius: "4px",
          color: "#5EA3A3",
          fontSize: "70%",
          fontWeight: "bold",
          textTransform: "uppercase",
          ...buttonSx,
        }}
      >
        {text}
      </Button>
    </Box>
  );
};

export default BackButton;
