import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";

import scrollSx from "@styles/scroll";

import Pagination from "../deleteThis";
import {
  footerGridSx,
  headerGridSx,
  leftContainerSx,
  mainSx,
  rightContainerSx,
} from "../styles";
import LayoutFooter from "./footer";
import LayoutHeader from "./header";

const FormLayout = (props) => {
  const { showHeaderTitle, showBackButton, sectionId, children, ...rest } =
    props;

  const theme = useTheme();

  const hideLeftContainer = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box component="main" sx={mainSx}>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={0} lg={5} sx={leftContainerSx}>
          {false && !hideLeftContainer && <Pagination />}
        </Grid>

        <Grid container direction="column" item xs sx={rightContainerSx}>
          <Grid item xs={3} sx={headerGridSx}>
            <LayoutHeader
              showTitle={showHeaderTitle}
              showBackButton={showBackButton}
            />
          </Grid>

          <Grid item xs sx={{ ...scrollSx }}>
            {children}
          </Grid>

          <Grid item xs={2} sx={footerGridSx}>
            <LayoutFooter />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormLayout;
