import Link from "next/link";

import { Box, Button, Typography } from "@mui/material";

const EnterButton = (props) => {
  const {
    disabled,
    path,
    showPressEnter,
    wrapperSx,
    buttonSx,
    onClick,
    children,
    ...rest
  } = props;

  return (
    <Box
      component={path ? Link : "div"}
      href={path}
      sx={{ width: "fit-content", display: "flex", gap: 0.5, ...wrapperSx }}
    >
      <Button
        disabled={disabled}
        variant="standard"
        onClick={onClick}
        endIcon={<Typography fontFamily="icomoon"></Typography>}
        sx={{
          py: "2px",
          borderRadius: "4px",

          backgroundColor: "#5EA3A3",

          color: "white",
          fontSize: "70%",
          fontWeight: "bold",
          textTransform: "uppercase",

          "&:hover": {
            backgroundColor: "#78BDBD",
          },

          ...buttonSx,
        }}
      >
        {children}
      </Button>

      {showPressEnter && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ color: "#5EA3A3", fontSize: 12, fontWeight: 500 }}>
            Presiona <strong>Enter</strong>{" "}
            <i className="fas fa-arrow-turn-down-left" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EnterButton;
