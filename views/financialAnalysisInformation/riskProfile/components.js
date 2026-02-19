import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { RiskProfileComponentDesktop } from "./componentDesktop";
import { RiskProfileComponentMobile } from "./componentMobile";

export const RiskProfileC = ({ formik, ToastContainer, loading, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        m: 0,
        p: 0,
        overflowX: "hidden",

        // ✅ en mobile NO metas margen superior (se ve ese “aire”)
        mt: { xs: 0, sm: 4 },
      }}
    >
      {isMobile ? (
        <RiskProfileComponentMobile
          formik={formik}
          ToastContainer={ToastContainer}
          loading={loading}
          data={data}
        />
      ) : (
        <RiskProfileComponentDesktop
          formik={formik}
          ToastContainer={ToastContainer}
          loading={loading}
          data={data}
        />
      )}
    </Box>
  );
};