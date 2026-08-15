import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";

import Layout from "@components/layout";
import PageHeader from "@components/pageHeader";
import { SidebarProvider } from '@context/sideBarContext';
import "../public/icomoon/style.css";
import "../styles/globals.css";
import theme from "../styles/themes";
import SecurityDialog from "@components/modals/infoModal";
import { AuthProvider } from "@context/authContext";
import RouteGuard from "@components/routeGuard";
import { getPageHeader } from "../shared/config/pageHeaders";

const pathsWithoutDefaultLayout = [
  "/",
  "/self-management",
  "/auth/login",
  "/financialProfile/financialStatement",
  "/financialProfile/indicators",
  "/auth/resetPassword",
  "/auth/forgotPassword",
  "/auth/clientPortalUnavailable",
  "/403",
  "/pre-operations/manage",
  "/pre-operations/detailPreOp",
  "/pre-operations/editPreOp",
   "/bills/createBill",
    "/bills/editBill",
      "/bills/detailBill",
      "/administration/new-receipt",
      "/administration/new-receipt/receipt-visualization",
      "/customers",
      "/pre-operations/registerMassiveOperation",
      "/administration/new-receipt/registerMassiveReceipt"
];

const publicStandalonePaths = [
  "/",
  "/self-management",
  "/auth/login",
  "/auth/resetPassword",
  "/auth/forgotPassword",
  "/auth/clientPortalUnavailable",
  "/403",
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isErrorPage = pageProps?.statusCode === 404;
  const usesDefaultLayout = !pathsWithoutDefaultLayout.includes(router.pathname) && !isErrorPage;
  const usesPlatformStandaloneHeader = !usesDefaultLayout
    && !publicStandalonePaths.includes(router.pathname)
    && !isErrorPage;
  const standaloneHeader = getPageHeader(router.pathname);

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SidebarProvider>
<>      
<SecurityDialog />
            <Head>
              <title>Smart Evolution</title>
            </Head>

            <RouteGuard>{usesDefaultLayout ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : usesPlatformStandaloneHeader ? (
              <Box
                sx={{
                  minHeight: "100vh",
                  bgcolor: "#fff",
                  p: { xs: 2, md: 3 },
                  "& .platform-page-content .MuiBreadcrumbs-root": { display: "none" },
                  "& .platform-page-content .view-title, & .platform-page-content .legacy-page-title": { display: "none" },
                  "& .platform-page-content .view-header": { display: "none" },
                }}
              >
                <PageHeader {...standaloneHeader} />
                <Box className="platform-page-content">
                  <Component {...pageProps} />
                </Box>
              </Box>
            ) : (
              <Component {...pageProps} />
            )}</RouteGuard>
          </>

          </SidebarProvider>
          
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
