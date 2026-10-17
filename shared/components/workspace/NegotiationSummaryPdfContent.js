import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import { GetNegotiationSummaryPDF } from "@views/administration/negotiation-summary/summaryList/queries";

export default function NegotiationSummaryPdfContent({ opId }) {
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await GetNegotiationSummaryPDF(opId);
        if (!active) return;
        setPdf(response?.pdf || null);
        if (!response?.pdf) {
          setError("No fue posible obtener el PDF del resumen de negociación.");
        }
      } catch (err) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Ocurrió un error al generar el resumen de negociación."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [opId]);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <CircularProgress sx={{ color: "#488B8F" }} />
        <Typography sx={{ color: "#52656d", fontSize: "0.95rem" }}>
          Generando resumen de negociación...
        </Typography>
        <Typography sx={{ color: "#8b9aa0", fontSize: "0.8rem" }}>
          Esto puede tardar unos segundos.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: 0 }}>
      <iframe
        title={`Resumen de negociación ${opId}`}
        src={`data:application/pdf;base64,${pdf}`}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block", background: "#f7f9fa" }}
      />
    </Box>
  );
}
