import { useContext } from "react";

import {
  Box,
  LinearProgress,
  Typography,
  linearProgressClasses,
  useMediaQuery,
} from "@mui/material";

import DashboardButton from "@styles/buttons/button_3";

import { FormContext } from "../Context";
import { footerTextSx } from "../styles";

const progressBarSx = {
  mb: 1.25,
  height: 12,
  borderRadius: 10,
  color: "red",

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#B5D1C9",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: "#488B8F",
  },
};

const LayoutFooter = (props) => {
  const { ...rest } = props;

  const { pagination } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const offSetCurrentStep = pagination.step - 1;
  const offCountSetSteps = pagination.steps.value - 2;

  const currentStepSection = `SECCIÓN ${offSetCurrentStep} DE ${offCountSetSteps}`;

  const percentageProgress =
    pagination.step <= 1
      ? 0
      : Math.round(100 * (offSetCurrentStep / offCountSetSteps));

  return (
    <Box
      sx={{
        display: pagination.step === 0 ? "none" : "flex",
        justifyContent: "space-between",
        pt: 2,
      }}
    >
      <Box sx={{ width: `clamp(150px,${isXs ? "40%" : "60%"}, 400px)` }}>
        <LinearProgress
          variant="determinate"
          value={percentageProgress}
          sx={{ ...progressBarSx }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: isXs && "column",
            justifyContent: "space-between",
          }}
        >
          {Boolean(percentageProgress) && (
            <Typography sx={{ ...footerTextSx }}>
              {currentStepSection}
            </Typography>
          )}
          <Typography sx={{ ...footerTextSx, color: "#488B8F" }}>
            {percentageProgress}% Completado
          </Typography>
        </Box>
      </Box>

      <DashboardButton
        onClick={pagination?.controls.nextStep}
        endIcon={<Typography fontFamily="icomoon"></Typography>}
        sx={{ height: 40 }}
      >
        {percentageProgress < 100 ? "SIGUIENTE SECCIÓN" : "ENVIAR"}
      </DashboardButton>
    </Box>
  );
};

export default LayoutFooter;
