//React imports
import { useEffect, useState,useRef } from "react";

import Link from "next/link";
//Next imports
import { useRouter } from "next/router";

//Material UI imports
import {
  Box,
  Button,
  
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

     <Box
          sx={{
            ...scrollSx,
            width: "100%",
            backgroundColor: "#F3F3F5",
            borderRadius: "8px",
            padding: "14px 16px 22px 16px",
            paddingRight: "42px",
            boxSizing: "border-box",
          }}
        >
 <Grid
        container
        direction="column"
        sx={{
          height: "100vh",
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
            flexDirection="column"
            
           
          
            id="print"
            sx={{
              
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
          {/* ====== Actividad / Eficiencia ====== */}
<Box display="flex" flexDirection="column" width="100%" mt="1%">
  {/* Card blanco (columna) */}
  <Box
    sx={{
      ...scrollSx,
      width: "100%",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "14px 16px 22px 16px",
      paddingRight: "42px",
      boxSizing: "border-box",
    }}
  >
    {/* ✅ TITULO ARRIBA */}
    <Typography
      letterSpacing={0}
      fontSize="1.6vw"
      fontWeight="500"
      color="#333333"
      sx={{
        mb: 2,
        whiteSpace: "nowrap",
      }}
    >
      Actividad / Eficiencia
    </Typography>

    {/* ✅ CONTENIDO ABAJO (fila) */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
      }}
    >
      {/* ================= TABLA (35%) ================= */}
      <Box display="flex" flexDirection="column" sx={{ width: "35%", minWidth: 360 }}>
        {/* Header años */}
        <Box display="flex" flexDirection="row">
          <Box width="40%"></Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw", height: "6vh" }}>
                  {dataIndicators?.data?.results?.period_3?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_2?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_1?.period}
                </InputTitles>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* FILAS */}
        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>ROTACIÓN CARTERA</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.walletRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.walletRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.walletRotation ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>ROTACIÓN INVENTARIOS</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.inventoryRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.inventoryRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.inventoryRotation ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>CICLO OPERACIONAL</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.operationalCycle ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.operationalCycle ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.operationalCycle ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>ROTACIÓN PROVEEDORES</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.providersRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.providersRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.providersRotation ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>ROTACIÓN GASTOS ACUMULADOS</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.accumulatedExpensesRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.accumulatedExpensesRotation ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.accumulatedExpensesRotation ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>CICLO CONVERSIÓN EFECTIVO</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_3?.cashConversionCycle ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_2?.cashConversionCycle ?? "")}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {NumberFormat.format(dataIndicators?.data?.activityEfficiency?.period_1?.cashConversionCycle ?? "")}
              </Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="row">
          <Box width="40%">
            <InputTitles sx={{ fontSize: "0.7vw" }}>ROTACIÓN DE ACTIVOS</InputTitles>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {Math.round(dataIndicators?.data?.activityEfficiency?.period_3?.assetsRotation ?? 0)}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {Math.round(dataIndicators?.data?.activityEfficiency?.period_2?.assetsRotation ?? 0)}
              </Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ ...sxNumbers }}>
                {Math.round(dataIndicators?.data?.activityEfficiency?.period_1?.assetsRotation ?? 0)}
              </Typography></Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ================= GRAFICAS (65%) ================= */}
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
          height: "42vh",
          minHeight: 320,
        }}
      >
        {/* Card 1 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Rotación de Cartera
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart ref={chartRef} data={getData("activityEfficiency", "walletRotation")} />
          </Box>
        </Box>

        {/* Card 2 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Rotación de Inventarios
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("activityEfficiency", "inventoryRotation")} />
          </Box>
        </Box>

        {/* Card 3 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Rotación de Proveedores
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("activityEfficiency", "providersRotation")} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>
{/* ====== Fin Actividad / Eficiencia ====== */}

       

          {/* ====== Rentabilidad ====== */}
<Box display="flex" flexDirection="column" width="100%" mt="2%">
  <Box
    sx={{
      ...scrollSx,
      width: "100%",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "14px 16px 22px 16px",
      paddingRight: "42px",
      boxSizing: "border-box",
    }}
  >
    {/* ✅ TÍTULO ARRIBA */}
    <Typography
      letterSpacing={0}
      fontSize="1.6vw"
      fontWeight="500"
      color="#333333"
      sx={{ mb: 2, whiteSpace: "nowrap" }}
    >
      Rentabilidad
    </Typography>

    {/* ✅ CONTENIDO ABAJO (TABLA + GRÁFICAS) */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
      }}
    >
      {/* ================= TABLA (35%) ================= */}
      <Box display="flex" flexDirection="column" sx={{ width: "35%", minWidth: 360 }}>
        {/* Header años */}
        <Box display="flex" flexDirection="row">
          <Box width="40%"></Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw", height: "6vh" }}>
                  {dataIndicators?.data?.results?.period_3?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_2?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_1?.period}
                </InputTitles>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Helper para no repetir calc/ml: usamos gap + flex */}
        {[
          {
            label: "MARGEN BRUTO",
            v3: `${dataIndicators?.data?.rentability?.period_3?.grossMargin ?? ""} %`,
            v2: `${dataIndicators?.data?.rentability?.period_2?.grossMargin ?? ""} %`,
            v1: `${dataIndicators?.data?.rentability?.period_1?.grossMargin ?? ""} %`,
          },
          {
            label: "MARGEN OPERACIONAL",
            v3: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_3?.operationalMargin ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_2?.operationalMargin ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_1?.operationalMargin ?? "")} %`,
          },
          {
            label: "EBITDA",
            v3: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_3?.EBITDA ?? "")}`,
            v2: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_2?.EBITDA ?? "")}`,
            v1: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_1?.EBITDA ?? "")}`,
          },
          {
            label: "MARGEN EBITDA",
            v3: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_3?.EBITDAMargin ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_2?.EBITDAMargin ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_1?.EBITDAMargin ?? "")} %`,
          },
          {
            label: "MARGEN NETO",
            v3: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_3?.netMargin ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_2?.netMargin ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.rentability?.period_1?.netMargin ?? "")} %`,
          },
          {
            label: "RENTABILIDAD ACTIVO TOTAL",
            v3: `${Math.round(dataIndicators?.data?.rentability?.period_3?.rentabilityTotalAssets ?? 0)} %`,
            v2: `${Math.round(dataIndicators?.data?.rentability?.period_2?.rentabilityTotalAssets ?? 0)} %`,
            v1: `${Math.round(dataIndicators?.data?.rentability?.period_1?.rentabilityTotalAssets ?? 0)} %`,
          },
          {
            label: "RENTABILIDAD PATRIMONIO",
            v3: `${Math.round(dataIndicators?.data?.rentability?.period_3?.patrimonyRentability ?? 0)} %`,
            v2: `${Math.round(dataIndicators?.data?.rentability?.period_2?.patrimonyRentability ?? 0)} %`,
            v1: `${Math.round(dataIndicators?.data?.rentability?.period_1?.patrimonyRentability ?? 0)} %`,
          },
        ].map((row) => (
          <Box key={row.label} display="flex" flexDirection="row" sx={{ mt: 1 }}>
            <Box width="40%">
              <InputTitles sx={{ fontSize: "0.7vw" }}>{row.label}</InputTitles>
            </Box>
            <Box width="60%">
              <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v3}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v2}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v1}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= GRÁFICAS (65%) ================= */}
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
          height: "42vh",
          minHeight: 320,
        }}
      >
        {/* Card 1 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Margen bruto
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("rentability", "grossMargin")} />
          </Box>
        </Box>

        {/* Card 2 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            EBITDA
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("rentability", "EBITDA")} />
          </Box>
        </Box>

        {/* Card 3 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Margen neto
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("rentability", "netMargin")} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>
{/* ====== Fin Rentabilidad ====== */}

         {/* ====== Riesgo financiero ====== */}
<Box display="flex" flexDirection="column" width="100%" mt="2%">
  <Box
    sx={{
      ...scrollSx,
      width: "100%",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "14px 16px 22px 16px",
      paddingRight: "42px",
      boxSizing: "border-box",
    }}
  >
    {/* ✅ TÍTULO ARRIBA */}
    <Typography
      letterSpacing={0}
      fontSize="1.6vw"
      fontWeight="500"
      color="#333333"
      sx={{ mb: 2, whiteSpace: "nowrap" }}
    >
      Riesgo financiero
    </Typography>

    {/* ✅ CONTENIDO ABAJO (TABLA + GRÁFICAS) */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
      }}
    >
      {/* ================= TABLA (35%) ================= */}
      <Box display="flex" flexDirection="column" sx={{ width: "35%", minWidth: 360 }}>
        {/* Header años */}
        <Box display="flex" flexDirection="row">
          <Box width="40%"></Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw", height: "6vh" }}>
                  {dataIndicators?.data?.results?.period_3?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_2?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_1?.period}
                </InputTitles>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Filas (sin calc/ml): gap + flex */}
        {[
          {
            label: "RAZÓN CORRIENTE",
            v3: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.currentReason ?? ""),
            v2: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.currentReason ?? ""),
            v1: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.currentReason ?? ""),
          },
          {
            label: "CAPITAL DE TRABAJO",
            v3: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.workingCapital ?? ""),
            v2: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.workingCapital ?? ""),
            v1: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.workingCapital ?? ""),
          },
          {
            label: "ENDEUDAMIENTO",
            v3: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.debt ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.debt ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.debt ?? "")} %`,
          },
          {
            label: "COSTO PROM. DEUDA FINANCIERA",
            v3: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.avgFinancialDebt ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.avgFinancialDebt ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.avgFinancialDebt ?? "")} %`,
          },
          {
            label: "DEUDA FINANCIERA / EBITDA",
            v3: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.["financialDebt_EBITDA"] ?? "")} %`,
            v2: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.["financialDebt_EBITDA"] ?? "")} %`,
            v1: `${NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.["financialDebt_EBITDA"] ?? "")} %`,
          },
          {
            label: "EBITDA / GASTOS FINANCIEROS",
            v3: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_3?.["EBITDA_financialExpenses"] ?? ""),
            v2: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_2?.["EBITDA_financialExpenses"] ?? ""),
            v1: NumberFormat.format(dataIndicators?.data?.financialRisk?.period_1?.["EBITDA_financialExpenses"] ?? ""),
          },
          {
            label: "EBITDA / SERV. DE LA DEUDA (GASTOS FIN + OBL. CP)",
            v3: Math.round(dataIndicators?.data?.financialRisk?.period_3?.["EBITDA/debtServices"] ?? 0),
            v2: Math.round(dataIndicators?.data?.financialRisk?.period_2?.["EBITDA/debtServices"] ?? 0),
            v1: Math.round(dataIndicators?.data?.financialRisk?.period_1?.["EBITDA/debtServices"] ?? 0),
          },
          {
            label: "CAPITAL PAGADO + PRIMA / PATRIMONIO TOTAL",
            v3: `${Math.round(dataIndicators?.data?.financialRisk?.period_3?.["payedCapital+prim/totalPatrimony"] ?? 0)} %`,
            v2: `${Math.round(dataIndicators?.data?.financialRisk?.period_2?.["payedCapital+prim/totalPatrimony"] ?? 0)} %`,
            v1: `${Math.round(dataIndicators?.data?.financialRisk?.period_1?.["payedCapital+prim/totalPatrimony"] ?? 0)} %`,
          },
        ].map((row) => (
          <Box key={row.label} display="flex" flexDirection="row" sx={{ mt: 1 }}>
            <Box width="40%">
              <InputTitles sx={{ fontSize: "0.7vw" }}>{row.label}</InputTitles>
            </Box>
            <Box width="60%">
              <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v3}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v2}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v1}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= GRÁFICAS (65%) ================= */}
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "row",
          gap: 2,
          height: "42vh",
          minHeight: 320,
        }}
      >
        {/* Card 1 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Endeudamiento
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("financialRisk", "debt")} />
          </Box>
        </Box>

        {/* Card 2 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            EBITDA / Gastos financieros
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("financialRisk", "EBITDA_financialExpenses")} />
          </Box>
        </Box>

        {/* Card 3 */}
        <Box sx={{ flex: 1, bgcolor: "#fff", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Capital de trabajo
          </Typography>
          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("financialRisk", "workingCapital")} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>
{/* ====== Fin Riesgo financiero ====== */}
         

           {/* ====== Resultados ====== */}
<Box display="flex" flexDirection="column" width="100%" mt="2%">
  <Box
    sx={{
      ...scrollSx,
      width: "100%",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "14px 16px 22px 16px",
      paddingRight: "42px",
      boxSizing: "border-box",
    }}
  >
    {/* ✅ TÍTULO ARRIBA */}
    <Typography
      letterSpacing={0}
      fontSize="1.6vw"
      fontWeight="500"
      color="#333333"
      sx={{ mb: 2, whiteSpace: "nowrap" }}
    >
      Resultados
    </Typography>

    {/* ✅ CONTENIDO ABAJO (TABLA + GRÁFICA) */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
      }}
    >
      {/* ================= TABLA (35%) ================= */}
      <Box display="flex" flexDirection="column" sx={{ width: "35%", minWidth: 360 }}>
        {/* Header años */}
        <Box display="flex" flexDirection="row">
          <Box width="40%"></Box>
          <Box width="60%">
            <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw", height: "6vh" }}>
                  {dataIndicators?.data?.results?.period_3?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_2?.period}
                </InputTitles>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  {dataIndicators?.data?.results?.period_1?.period}
                </InputTitles>
              </Box>
            </Box>
          </Box>
        </Box>

        {[
          {
            label: "VENTAS",
            v3: NumberFormat.format(dataIndicators?.data?.results?.period_3?.sales ?? ""),
            v2: NumberFormat.format(dataIndicators?.data?.results?.period_2?.sales ?? ""),
            v1: NumberFormat.format(dataIndicators?.data?.results?.period_1?.sales ?? ""),
          },
          {
            label: "FACTURACIÓN PROMEDIO MES",
            v3: NumberFormat.format(dataIndicators?.data?.results?.period_3?.avgMonthBilling ?? ""),
            v2: NumberFormat.format(dataIndicators?.data?.results?.period_2?.avgMonthBilling ?? ""),
            v1: NumberFormat.format(dataIndicators?.data?.results?.period_1?.avgMonthBilling ?? ""),
          },
          {
            label: "% DESCUENTOS Y REBAJAS / VENTAS",
            v3: `${Math.round(dataIndicators?.data?.results?.period_3?.discountsSalesRefunds ?? 0)} %`,
            v2: `${Math.round(dataIndicators?.data?.results?.period_2?.discountsSalesRefunds ?? 0)} %`,
            v1: `${Math.round(dataIndicators?.data?.results?.period_1?.discountsSalesRefunds ?? 0)} %`,
          },
        ].map((row) => (
          <Box key={row.label} display="flex" flexDirection="row" sx={{ mt: 1 }}>
            <Box width="40%">
              <InputTitles
                sx={{
                  fontSize: "0.7vw",
                  // ✅ si el label es largo, que rompa en 2 líneas sin desalinear columnas
                  whiteSpace: "normal",
                  lineHeight: 1.2,
                }}
              >
                {row.label}
              </InputTitles>
            </Box>

            <Box width="60%">
              <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v3}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v2}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...sxNumbers }}>{row.v1}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= GRÁFICA (65%) ================= */}
      <Box
        sx={{
          width: "65%",
          display: "flex",
          flexDirection: "row",
          height: "42vh",
          minHeight: 320,
        }}
      >
        <Box
          sx={{
            flex: 1,
            bgcolor: "#fff",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "0.7vw", fontWeight: 600, color: "#8C7E82", ml: "4%", mt: "8px" }}>
            Comparativo
          </Typography>
          <Typography sx={{ fontSize: "1.042vw", fontWeight: 500, color: "#333333", ml: "4%", mb: "8px" }}>
            Ventas
          </Typography>

          <Box sx={{ flex: 1, px: 1 }}>
            <BarChart data={getData("results", "sales")} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>
{/* ====== Fin Resultados ====== */}
          </Box>
        </Grid>

        </Box>
     
     
    </>
  );
};
