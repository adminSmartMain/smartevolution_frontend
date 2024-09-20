import { Box, Typography } from "@mui/material";

import { hintTextSx } from "./styles";

const Hint = (props) => {
  const { show, children, ...rest } = props;

  if (!show) return <></>;
  return (
    <Box sx={{ mx: 1.75, my: 0.5 }}>
      <Typography sx={{ ...hintTextSx }}>{children}</Typography>
    </Box>
  );
};

export default Hint;
