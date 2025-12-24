import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@mui/material/styles";

import Layout from "@components/layout";
import { SidebarProvider } from '@context/sideBarContext';
import "../public/icomoon/style.css";
import "../styles/globals.css";
import theme from "../styles/themes";
import SecurityDialog from "@components/modals/infoModal";
import { AuthProvider } from "@context/authContext";

const pathsWithoutDefaultLayout = [
  "/",
  "/self-management",
  "/auth/login",
  "/financialProfile/financialStatement",
  "/financialProfile/indicators",
  "/auth/resetPassword",
  "/auth/forgotPassword",
  "/pre-operations/manage",
  "/pre-operations/detailPreOp",
  "/pre-operations/editPreOp",
   "/bills/createBill",
    "/bills/editBill",
      "/bills/detailBill",
      "/administration/new-receipt",
      "/administration/new-receipt/receipt-visualization"
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isErrorPage = pageProps?.statusCode === 404;

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

            {!pathsWithoutDefaultLayout.includes(router.pathname) &&
            !isErrorPage ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </>

          </SidebarProvider>
          
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
