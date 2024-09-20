import { useContext } from "react";

import { Box, Typography } from "@mui/material";

import DashboardButton from "@styles/buttons/button_3";

import { FormContext } from "../Context";
import {
  centeredStepContainerSx,
  questionParagraphSx,
  titleStartSx,
} from "../styles";

const StartStep = () => {
  const { pagination } = useContext(FormContext);

  return (
    <Box sx={centeredStepContainerSx}>
      <Box>
        <Typography variant="h1" sx={{ ...titleStartSx, mb: 3.75 }}>
          Formato de vinculación online
          <br />
          para nuevos clientes
        </Typography>

        <Typography sx={questionParagraphSx}>
          Buen día, esperamos se encuentre estupendo.
        </Typography>
        <Typography sx={{ ...questionParagraphSx, mb: 8.75 }}>
          ¿Quiere empezar a diligenciar el formulario en este momento?
        </Typography>

        <DashboardButton
          onClick={pagination?.controls.nextStep}
          endIcon={<Typography fontFamily="icomoon"></Typography>}
        >
          Empezar el formulario
        </DashboardButton>
      </Box>
    </Box>
  );
};

export default StartStep;
