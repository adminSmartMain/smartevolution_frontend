/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { BookOutlined, SaveOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

//Toastify
import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import FileUploadButton from "@styles/buttons/uploadFileButton";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import { GetCustomerById } from "./queries";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const FinancialProfile = ({ formik }) => {
  //Get ID from URL

  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetCustomerById, init: false });

  const [id, setID] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) setID(router.query.id);
  }, [router.query]);

  useEffect(() => {
    if (id) fetch(id);
  }, [id]);

  const [tabValue, setTabValue] = useState("2022-I");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmission = () => {};

  const [allFiles, setAllFiles] = useState({});

  const changeHandler = (event) => {
    setAllFiles({ ...allFiles, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Box height="76vh" display="flex" flexDirection="column" marginLeft="5%">
        <Box
          container
          borderBottom="2px solid #A1A1A1"
          display="flex"
          flexDirection="column"
          pb={2}
          sx={{ ...scrollSx }}
        >
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <BackButton path="/customers/customerList" />
              <Link href={`/financialProfile/financialStatement/?id=${id}`}>
                <Button
                  variant="standard"
                  color="primary"
                  size="large"
                  sx={{
                    height: "2.6rem",
                    backgroundColor: "transparent",
                    border: "1.4px solid #63595C",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="80%"
                    fontWeight="bold"
                    color="#63595C"
                  >
                    Estado de situación financiera
                  </Typography>

                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.5rem"
                    color="#63595C"
                    marginLeft="0.9rem"
                  >
                    &#xe905;
                  </Typography>
                </Button>
              </Link>
            </Box>
            <Box marginBottom={3}>
              <Typography
                letterSpacing={0}
                fontSize="1.7vw"
                fontWeight="regular"
                color="#488B8F"
              >
                Perfil Financiero
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr"
                gridTemplateRows="1fr 1fr"
                gap={2}
                width="80%"
              >
                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>N° Identificación</InputTitles>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                  >
                    {data?.data?.document_number}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>Cliente</InputTitles>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                  >
                    {`${data?.data?.first_name ?? ""} ${
                      data?.data?.last_name ?? ""
                    } ${data?.data?.social_reason ?? ""}`}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>PERFIL DE RIESGO</InputTitles>
                  {data?.data?.riskProfile === null && (
                    <Link href={`/riskProfile?id=${id}`} underline="none">
                      <Button
                        variant="standard"
                        sx={{
                          backgroundColor: "#488B8F",
                          color: "#FFFFFF",
                          textTransform: "none",
                          borderRadius: "4px",
                          width: "40%",

                          "&:hover": { backgroundColor: "#5EA3A3" },
                        }}
                      >
                        <Typography
                          fontSize="0.7vw"
                          fontWeight="bold"
                          color="#FFFFFF"
                          textTransform="uppercase"
                        >
                          Cargar
                        </Typography>
                      </Button>
                    </Link>
                  )}
                  {data?.data?.riskProfile && (
                    <Link href={`/riskProfile?id=${id}`} underline="none">
                      <Button
                        variant="standard"
                        sx={{
                          backgroundColor: "#488B8F",
                          color: "#FFFFFF",
                          textTransform: "none",
                          borderRadius: "4px",
                          width: "40%",

                          "&:hover": { backgroundColor: "#5EA3A3" },
                        }}
                      >
                        <Typography
                          fontSize="0.7vw"
                          fontWeight="bold"
                          color="#FFFFFF"
                          textTransform="uppercase"
                        >
                          Ver
                        </Typography>
                      </Button>
                    </Link>
                  )}
                </Box>
                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>INGRESADO POR</InputTitles>
                  <Box borderRadius="4px">
                    <Typography
                      fontSize="0.7vw"
                      fontWeight="bold"
                      color="#63595C"
                      backgroundColor="transparent"
                      textTransform="uppercase"
                      borderRadius="4px"
                      display="inline-block"
                      border="1.4px solid #63595C"
                      padding="4px 8px"
                    >
                      {`${data?.data?.entered_by?.first_name ?? ""} ${
                        data?.data?.entered_by?.last_name ?? ""
                      }`}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>
                    REPRESENTANTE LEGAL
                  </InputTitles>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    noWrap
                  >
                    {`${data?.data?.legal_representative?.first_name ?? ""} ${
                      data?.data?.legal_representative?.last_name ?? ""
                    } 
                    ${data?.data?.legal_representative?.social_reason ?? ""}`}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <InputTitles marginBottom={1}>CORREO ELECTRÓNICO</InputTitles>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                  >
                    {data?.data?.email ?? ""}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          container
          display="flex"
          flexDirection="column"
          sx={{ ...scrollSx }}
          height="60%"
        ></Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
