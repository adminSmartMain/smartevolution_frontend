import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider } from "@mui/material/styles";

import Layout from "@components/layout";

import "../public/icomoon/style.css";
import "../styles/globals.css";
import theme from "../styles/themes";

import { AuthProvider } from "@context/authContext";

const pathsWithoutDefaultLayout = [
  "/",
  "/self-management",
  "/auth/login",
  "/financialProfile/financialStatement",
  "/financialProfile/indicators",
  "/auth/resetPassword",
  "/auth/forgotPassword",
  "/pre-operations2beta/manage",
  "/pre-operations2beta/detailPreOp",
  "/pre-operations2beta/editPreOp",
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isErrorPage = pageProps?.statusCode === 404;

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <>
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
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
