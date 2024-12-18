//React imports
import { useEffect, useState,useRef } from "react";

import Link from "next/link";
//Next imports
import { useRouter } from "next/router";

//Material UI imports
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import BarChart from "@components/barchart";
//Custom imports
import Header from "@components/header";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import { FinancialStatInput } from "@styles/financialStatInput";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

//Queries imports
import {
  GetCustomerById,
  GetFinancialProfileIndicatorsById,
  GetFinancialProfileIndicatorsPDF,
} from "./queries";

import { saveAs } from "file-saver";

export const FinancialInd = () => {
  // Obtener ID de la URL
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetCustomerById, init: false });

  // Obtener Indicadores del Perfil Financiero por ID
  const {
    fetch: fetchIndicators,
    loading: loadingIndicators,
    error: errorIndicators,
    data: dataIndicators,
  } = useFetch({ service: GetFinancialProfileIndicatorsById, init: false });

  const {
    fetch: fetchPDF,
    loading: loadingPDF,
    error: errorPDF,
    data: dataPDF,
  } = useFetch({ service: GetFinancialProfileIndicatorsPDF, init: false });

  const [id, setID] = useState("");
  const router = useRouter();
  const chartRef = useRef(null); // Referencia para el gráfico

  useEffect(() => {
    if (router && router.query) {
      setID(router.query.id);
    }
  }, [router.query]);

  useEffect(() => {
    if (id) {
      fetch(id);
      fetchIndicators(id);
    }
  }, [id]);

  const getData = (dataKey, dataKey2) => {
    let dataObject = [];
    if (dataIndicators) {
      console.log(dataIndicators);
      Object.keys(dataIndicators.data[dataKey]).forEach((period) => {
        dataObject.push({
          name: dataIndicators.data[dataKey][period].period,
          value: dataIndicators.data[dataKey][period][dataKey2],
        });
      });
    }
    return dataObject.reverse();
  };

  const sxNumbers = {
    letterSpacing: 0,
    fontSize: "0.9vw",
    fontWeight: "medium",
    color: "#333333",
    height: "5.5vh",
  };

  const options = {
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  const NumberFormat = new Intl.NumberFormat("en-EN", options);

  const handlePrint = () => {
    if (id) {
      // Obtener la gráfica en base64 y enviarla al backend
      const chartCanvas = chartRef.current?.getCanvas();
      if (chartCanvas) {
        const base64Image = chartCanvas.toDataURL("image/png");
        sendImageToBackend(base64Image);
      }

      fetchPDF(id); // Llamada al servicio que genera el PDF
    }
  };

  const sendImageToBackend = (base64Image) => {
    const requestData = {
      id,
      graphImage: base64Image,
    };

    fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("PDF generado correctamente.");
      })
      .catch((error) => {
        console.error("Error generando el PDF", error);
      });
  };

  useEffect(() => {
    if (dataPDF) {
      console.log(dataPDF);
      const base64Data = dataPDF.data;

      const decodedData = window.atob(base64Data);
      const byteNumbers = new Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        byteNumbers[i] = decodedData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "application/pdf" });
      saveAs(blob, "Indicadores Financieros.pdf");
    }
  }, [dataPDF]);

  return (
    <>
      <Grid
        container
        direction="column"
        sx={{
          height: "100vh",
        }}
      >
        <Grid item xs={1}>
          <Header />
        </Grid>
        <Grid
          item
          xs
          sx={{
            margin: "1% 5%",
            "@media all and (display-mode: fullscreen)": {
              margin: "0% 1%",
              paddingTop: "1vh",
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            sx={{
              "@media all and (display-mode: fullscreen)": {
                display: "none",
              },
            }}
          >
            <BackButton
              path={`/financialProfile/financialStatement?id=${id}`}
            />
            <Typography
              letterSpacing={0}
              fontSize="1.2vw"
              fontWeight="500"
              color="#488B8F"
              marginLeft="3%"
            >
              Indicadores financieros
            </Typography>
            <Box flexGrow={1} />
            <Button
              variant="standard"
              color="primary"
              size="large"
              onClick={handlePrint}
              sx={{
                height: "2.6rem",
                backgroundColor: "#488B8F",
                border: "1.4px solid #5EA3A3",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#5EA3A3",
                },
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#FFFFFF"
              >
                Descargar indicadores
              </Typography>

              <i
                style={{
                  color: "#FFFFFF",
                  marginLeft: "0.7rem",
                }}
                className="fa-regular fa-download"
              ></i>
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            marginTop="1%"
            sx={{
              "@media all and (display-mode: fullscreen)": {
                display: "none",
              },
            }}
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
            <Box display="flex" flexDirection="column" marginLeft="3%">
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
            <Box display="flex" flexDirection="column" marginLeft="3%">
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
            <Box display="flex" flexDirection="column" marginLeft="3%">
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
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            marginTop="2%"
            borderTop="2px solid #A1A1A1"
            paddingTop="2%"
            id="print"
            sx={{
              /* ...scrollSx, */
              height: "65vh",
              width: "100%",
              ["@media (max-height: 850px)"]: {
                height: "56vh",
              },
              "@media all and (display-mode: fullscreen)": {
                border: "none",
                margin: "0px",
                paddingTop: "0",
                height: "88vh",
              },
            }}
          >
            <Box display="flex" flexDirection="column">
              {/* Actividad / Eficiencia */}
              <Box display="flex" flexDirection="row" width="100%" mt="1%">
                <Box width="100%">
                  <Typography
                    letterSpacing={0}
                    fontSize="1.6vw"
                    fontWeight="500"
                    color="#333333"
                  >
                    Actividad / Eficiencia
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="row" width="100%" mt="1%">
                <Box display="flex" flexDirection="column" width="35%">
                  <Box display="flex" flexDirection="row">
                    <Box width="40%"></Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <InputTitles
                            sx={{ fontSize: "0.7vw", height: "6vh" }}
                          >
                            {dataIndicators?.data?.results?.period_3?.period}
                          </InputTitles>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <InputTitles sx={{ fontSize: "0.7vw" }}>
                            {dataIndicators?.data?.results?.period_2?.period}
                          </InputTitles>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <InputTitles sx={{ fontSize: "0.7vw" }}>
                            {dataIndicators?.data?.results?.period_1?.period}
                          </InputTitles>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        ROTACIÓN CARTERA
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.walletRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.walletRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.walletRotation ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        ROTACIÓN INVENTARIOS
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.inventoryRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.inventoryRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.inventoryRotation ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        CICLO OPERACIONAL
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.operationalCycle ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.operationalCycle ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.operationalCycle ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        ROTACIÓN PROVEEDORES
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.providersRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.providersRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.providersRotation ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        ROTACIÓN GASTOS ACUMULADOS
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.accumulatedExpensesRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.accumulatedExpensesRotation ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.accumulatedExpensesRotation ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        CICLO CONVERSIÓN EFECTIVO
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3
                              ?.cashConversionCycle ?? "")}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2
                              ?.cashConversionCycle ?? "")}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers }}>
                            {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1
                              ?.cashConversionCycle ?? "")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Box width="40%">
                      <InputTitles sx={{ fontSize: "0.7vw" }}>
                        ROTACIÓN DE ACTIVOS
                      </InputTitles>
                    </Box>
                    <Box width="60%">
                      <Box display="flex" flexDirection="row">
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers, height: "0%" }}>
                            {Math.round(
                              dataIndicators?.data?.activityEfficiency?.period_3
                                ?.assetsRotation ?? ""
                            )}
                          </Typography>
                        </Box>
                        <Box
                          width="calc(91%/3)"
                          ml="3%"
                          borderRight="1px solid #57575780"
                        >
                          <Typography sx={{ ...sxNumbers, height: "0%" }}>
                            {Math.round(
                              dataIndicators?.data?.activityEfficiency?.period_2
                                ?.assetsRotation ?? ""
                            )}
                          </Typography>
                        </Box>
                        <Box width="calc(91%/3)" ml="3%">
                          <Typography sx={{ ...sxNumbers, height: "0%" }}>
                            {Math.round(
                              dataIndicators?.data?.activityEfficiency?.period_1
                                ?.assetsRotation ?? ""
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {/* Gráficas Actvidad / Eficiencia */}
                <Box
                  display="flex"
                  flexDirection="row"
                  width="65%"
                  height="42vh"
                >
                  <Box
                    width="calc(94%/3)"
                    ml="2%"
                    bgcolor="#fff"
                    borderRadius="4px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="0.7vw"
                      fontWeight="600"
                      color="#8C7E82"
                      ml="4%"
                      mb="0%"
                    >
                      Comparativo
                    </Typography>
                    <Typography
                      letterSpacing={0}
                      fontSize="1.042vw"
                      fontWeight="medium"
                      color="#333333"
                      ml="4%"
                      mb="5%"
                    >
                      Rotación de Cartera
                    </Typography>
                    <BarChart
                      ref={chartRef} // Pasar la referencia al componente BarChart
                      data={getData("activityEfficiency", "walletRotation")}
                    />
                  </Box>
                  <Box
                    width="calc(94%/3)"
                    ml="2%"
                    bgcolor="#fff"
                    borderRadius="4px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="0.7vw"
                      fontWeight="600"
                      color="#8C7E82"
                      ml="4%"
                      mb="0%"
                    >
                      Comparativo
                    </Typography>
                    <Typography
                      letterSpacing={0}
                      fontSize="1.042vw"
                      fontWeight="medium"
                      color="#333333"
                      ml="4%"
                      mb="5%"
                    >
                      Rotación de Inventarios
                    </Typography>
                    <BarChart
                      data={getData("activityEfficiency", "inventoryRotation")}
                    />
                  </Box>
                  <Box
                    width="calc(94%/3)"
                    ml="2%"
                    bgcolor="#fff"
                    borderRadius="4px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="0.7vw"
                      fontWeight="600"
                      color="#8C7E82"
                      ml="4%"
                      mb="0%"
                    >
                      Comparativo
                    </Typography>
                    <Typography
                      letterSpacing={0}
                      fontSize="1.042vw"
                      fontWeight="medium"
                      color="#333333"
                      ml="4%"
                      mb="5%"
                    >
                      Rotación de Proveedores
                    </Typography>
                    <BarChart
                      data={getData("activityEfficiency", "providersRotation")}
                    />
                  </Box>
                </Box>
              </Box>
              {/* Fin Actvidad / Eficiencia */}
            </Box>

            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
                margin: "4% 0%",
              }}
            />

            {/* Rentabilidad */}
            <Box display="flex" flexDirection="row" width="100%">
              <Box width="100%">
                <Typography
                  letterSpacing={0}
                  fontSize="1.6vw"
                  fontWeight="500"
                  color="#333333"
                >
                  Rentabilidad
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt="1%">
              <Box display="flex" flexDirection="column" width="35%">
                <Box display="flex" flexDirection="row">
                  <Box width="40%"></Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw", height: "6vh" }}>
                          {dataIndicators?.data?.results?.period_3?.period}
                        </InputTitles>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_2?.period}
                        </InputTitles>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_1?.period}
                        </InputTitles>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      MARGEN BRUTO
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {dataIndicators?.data?.rentability?.period_3
                            ?.grossMargin ?? ""}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {dataIndicators?.data?.rentability?.period_2
                            ?.grossMargin ?? ""}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {dataIndicators?.data?.rentability?.period_1
                            ?.grossMargin ?? ""}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      MARGEN OPERACIONAL
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_3
                            ?.operationalMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_2
                            ?.operationalMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_1
                            ?.operationalMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>EBITDA</InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.rentability?.period_3?.EBITDA
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.rentability?.period_2?.EBITDA
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.rentability?.period_1?.EBITDA
                           ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      MARGEN EBITDA
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_3
                            ?.EBITDAMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_2
                            ?.EBITDAMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_1
                            ?.EBITDAMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      MARGEN NETO
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_3
                            ?.netMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_2
                            ?.netMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.rentability?.period_1
                            ?.netMargin ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      RENTABILIDAD ACTIVO TOTAL
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {Math.round(dataIndicators?.data?.rentability?.period_3
                            ?.rentabilityTotalAssets ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {Math.round(dataIndicators?.data?.rentability?.period_2
                            ?.rentabilityTotalAssets ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {Math.round(dataIndicators?.data?.rentability?.period_1
                            ?.rentabilityTotalAssets ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      RENTABILIDAD PATRIMONIO
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.rentability?.period_3
                              ?.patrimonyRentability ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.rentability?.period_2
                              ?.patrimonyRentability ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.rentability?.period_1
                              ?.patrimonyRentability ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Gráficas Rentabilidad */}
              <Box display="flex" flexDirection="row" width="65%" height="42vh">
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    Margen bruto
                  </Typography>
                  <BarChart data={getData("rentability", "grossMargin")} />
                </Box>
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    EBITDA
                  </Typography>
                  <BarChart data={getData("rentability", "EBITDA")} />
                </Box>
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    Margen neto
                  </Typography>
                  <BarChart data={getData("rentability", "netMargin")} />
                </Box>
              </Box>
            </Box>
            {/* Fin Rentabilidad */}

            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
                margin: "4% 0%",
              }}
            />

            {/* Riesgo financiero */}
            <Box display="flex" flexDirection="row" width="100%">
              <Box width="100%">
                <Typography
                  letterSpacing={0}
                  fontSize="1.6vw"
                  fontWeight="500"
                  color="#333333"
                >
                  Riesgo financiero
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt="1%">
              <Box display="flex" flexDirection="column" width="35%">
                <Box display="flex" flexDirection="row">
                  <Box width="40%"></Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw", height: "6vh" }}>
                          {dataIndicators?.data?.results?.period_3?.period}
                        </InputTitles>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_2?.period}
                        </InputTitles>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_1?.period}
                        </InputTitles>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      RAZÓN CORRIENTE
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3
                            ?.currentReason ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2
                            ?.currentReason ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1
                            ?.currentReason ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      CAPITAL DE TRABAJO
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.financialRisk?.period_3
                              ?.workingCapital
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.financialRisk?.period_2
                              ?.workingCapital
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.financialRisk?.period_1
                              ?.workingCapital
                           ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      ENDEUDAMIENTO
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3
                            ?.debt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2
                            ?.debt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1
                            ?.debt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      COSTO PROM. DEUDA FINANCIERA
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3
                            ?.avgFinancialDebt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2
                            ?.avgFinancialDebt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1
                            ?.avgFinancialDebt ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      DEUDA FINANCIERA / EBITDA
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3[
                            "financialDebt_EBITDA"
                          ] ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2[
                            "financialDebt_EBITDA"
                          ] ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1[
                            "financialDebt_EBITDA"
                          ] ?? "")}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      EBITDA / GASTOS FINANCIEROS
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3[
                            "EBITDA_financialExpenses"
                          ] ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2[
                             "EBITDA_financialExpenses"
                          ] ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1[
                             "EBITDA_financialExpenses"
                          ] ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      EBITDA / SERV. DE LA DEUDA (GASTOS FIN + OBL. CP)
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_3[
                              "EBITDA/debtServices"
                            ] ?? ""
                          )}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_2[
                              "EBITDA/debtServices"
                            ] ?? ""
                          )}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_1[
                              "EBITDA/debtServices"
                            ] ?? ""
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      CAPITAL PAGADO + PRIMA / PATRIMONIO TOTAL
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_3[
                              "payedCapital+prim/totalPatrimony"
                            ] ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_2[
                              "payedCapital+prim/totalPatrimony"
                            ] ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.financialRisk?.period_1[
                              "payedCapital+prim/totalPatrimony"
                            ] ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Gráficas Riesgo Financiero */}
              <Box display="flex" flexDirection="row" width="65%" height="42vh">
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    Endeudamiento
                  </Typography>
                  <BarChart data={getData("financialRisk", "debt")} />
                </Box>
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    EBITDA / Gastos financieros
                  </Typography>
                  <BarChart
                    data={getData("financialRisk", "EBITDA_financialExpenses")}
                  />
                </Box>
                <Box
                  width="calc(94%/3)"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    Capital de trabajo
                  </Typography>
                  <BarChart data={getData("financialRisk", "workingCapital")} />
                </Box>
              </Box>
            </Box>
            {/* Fin Riesgo financiero */}
            <Divider
              sx={{
                borderBottomWidth: "1.4px",
                borderColor: "#575757",
                opacity: "0.5",
                margin: "4% 0%",
              }}
            />
            {/* Resultados */}
            <Box display="flex" flexDirection="row" width="100%">
              <Box width="100%">
                <Typography
                  letterSpacing={0}
                  fontSize="1.6vw"
                  fontWeight="500"
                  color="#333333"
                >
                  Resultados
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt="1%">
              <Box display="flex" flexDirection="column" width="35%">
                <Box display="flex" flexDirection="row">
                  <Box width="40%"></Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw", height: "6vh" }}>
                          {dataIndicators?.data?.results?.period_3?.period}
                        </InputTitles>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_2?.period}
                        </InputTitles>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <InputTitles sx={{ fontSize: "0.7vw" }}>
                          {dataIndicators?.data?.results?.period_1?.period}
                        </InputTitles>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>VENTAS</InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_3?.sales
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_2?.sales
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_1?.sales
                           ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      FACTURACIÓN PROMEDIO MES
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_3
                              ?.avgMonthBilling
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_2
                              ?.avgMonthBilling
                           ?? "")}
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers }}>
                          {NumberFormat.format(
                            dataIndicators?.data?.results?.period_1
                              ?.avgMonthBilling
                           ?? "")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Box width="40%">
                    <InputTitles sx={{ fontSize: "0.7vw" }}>
                      % DESCUENTOS Y REBAJAS / VENTAS
                    </InputTitles>
                  </Box>
                  <Box width="60%">
                    <Box display="flex" flexDirection="row">
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.results?.period_3
                              ?.discountsSalesRefunds ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box
                        width="calc(91%/3)"
                        ml="3%"
                        borderRight="1px solid #57575780"
                      >
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.results?.period_2
                              ?.discountsSalesRefunds ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                      <Box width="calc(91%/3)" ml="3%">
                        <Typography sx={{ ...sxNumbers, height: "0%" }}>
                          {Math.round(
                            dataIndicators?.data?.results?.period_1
                              ?.discountsSalesRefunds ?? ""
                          )}{" "}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Gráficas Riesgo Financiero */}
              <Box display="flex" flexDirection="row" width="65%" height="42vh">
                <Box
                  width="98%"
                  ml="2%"
                  bgcolor="#fff"
                  borderRadius="4px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="0.7vw"
                    fontWeight="600"
                    color="#8C7E82"
                    ml="4%"
                    mb="0%"
                  >
                    Comparativo
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.042vw"
                    fontWeight="medium"
                    color="#333333"
                    ml="4%"
                    mb="5%"
                  >
                    Ventas
                  </Typography>
                  <BarChart data={getData("results", "sales")} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
