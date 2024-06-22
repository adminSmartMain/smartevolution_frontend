import { useContext } from "react";

import { Box, Button, Typography } from "@mui/material";

import { FormContext } from "./Context";

const Pagination = () => {
  const { pagination, data } = useContext(FormContext);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        overflow: "auto",
      }}
    >
      {/*      <Typography component="pre" sx={{ width: "100%", fontSize: 14 }}>
        {JSON.stringify(data.body, null, 2)}
      </Typography> */}

      <Typography>Current: {pagination.step}</Typography>
      <Button variant="outlined" onClick={pagination.controls.nextStep}>
        Increase
      </Button>
      <Button variant="outlined" onClick={pagination.controls.prevStep}>
        Decrease
      </Button>
    </Box>
  );
};

export default Pagination;
