import Image from "next/image";

import { Box, Typography } from "@mui/material";

import smartLogo from "../../../public/assets/Logo Smart - Lite.svg";
import SelfManagementBackButton from "../SelfManagementBackButton";
import {
  headerContainerSx,
  headerTitleSx,
  imageHeaderContainer,
} from "../styles";

const LayoutHeader = (props) => {
  const { showTitle, showBackButton, ...rest } = props;

  return (
    <Box sx={headerContainerSx}>
      <Box>
        {showTitle && (
          <>
            <Typography
              sx={{ ...headerTitleSx, mb: showBackButton ? 2 : 5.5 }}
            >
              Formato de vinculación online
              <br />
              para nuevos clientes
            </Typography>
            {showBackButton && <SelfManagementBackButton />}
          </>
        )}
      </Box>

      <Box sx={imageHeaderContainer}>
        <Image src={smartLogo} width={200} height={58.78} alt="" />
      </Box>
    </Box>
  );
};

export default LayoutHeader;
