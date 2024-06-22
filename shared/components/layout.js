import { useRouter } from "next/router";

import { Grid } from "@mui/material";
import Box from "@mui/material/Box";

import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

const gridContentSx = {
  display: "flex",
  alignItems: "center",
  margin: "0% 5%",

  "@media only screen and (max-width: 1600px)": {
    "&": {
      margin: "0% max(2.5%, 32px)",
    },
  },
};

const sidebarContainerSx = {
  "@media only screen and (max-width: 1600px)": {
    "&": {
      display: "none",
    },
  },
};

const pageContainerSx = {
  display: "flex",
  flexDirection: "column",

  height: "72vh",
  marginLeft: "5%",

  "@media only screen and (max-width: 1600px)": {
    "&": {
      margin: 0,
      height: "80vh",
    },
  },
};

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <>
      <Grid
        container
        direction="column"
        sx={{
          height: "100vh",
          flexFlow:
            router.pathname == "/dashboard" ||
            router.pathname == "/operations/manage" ||
            router.pathname == "/operations/manage2" ||
            router.pathname == "/customers" ||
            router.pathname == "/customers/account" ||
            router.pathname == "/brokers" ||
            router.pathname == "/administration/deposit-emitter" ||
            router.pathname == "/administration/deposit-investor" ||
            router.pathname == "/administration/refund" ||
            router.pathname == "/riskProfile" ||
            router.pathname == "/administration/new-receipt"
              ? "column"
              : "column wrap",
        }}
      >
        <Grid item sx={{ height: 70 }}>
          <Header />
        </Grid>

        <Grid item xs sx={{ ...gridContentSx }}>
          <Grid container direction="row">
            <Grid item xs={2.3} sx={{ ...sidebarContainerSx }}>
              <Sidebar />
            </Grid>

            <Grid item xs>
              <Box sx={pageContainerSx}>{children}</Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={0.5}>
          <Box margin="0% 5%">
            <Footer />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
