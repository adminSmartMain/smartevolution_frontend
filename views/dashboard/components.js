import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Alert,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";


const API_URL=process.env.NEXT_PUBLIC_API_URL
export const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState("este_anio");

  const formatCurrency = (value) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value?.toFixed(2) || "0.00"}`;
  };

  const fetchDashboardData = async (selectedPeriod) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/dashboard?periodo=${selectedPeriod}`
      );
      const result = await response.json();
      if (result.success) setDashboardData(result.data);
      else setError("Error al cargar los datos del dashboard");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(periodo);
  }, [periodo]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress sx={{ color: "#488B8F" }} />
        <Typography sx={{ ml: 2 }} color="#5B898E">
          Cargando datos del dashboard...
        </Typography>
      </Box>
    );

  if (error)
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  const metrics = [
    { title: "Total Operaciones", value: dashboardData.totalOperaciones?.toLocaleString(), icon: <TrendingUpIcon /> },
    { title: "Facturas Procesadas", value: dashboardData.cantidad_facturas?.toLocaleString(), icon: <ReceiptIcon /> },
    { title: "Tasa Descuento Promedio", value: `${dashboardData.tasa_descuento_promedio}%`, icon: <PieChartIcon /> },
    { title: "Tasa Inversionista Promedio", value: `${dashboardData.tasa_inversionista_promedio}%`, icon: <BarChartIcon /> },
    { title: "Plazo Promedio", value: `${dashboardData.plazo_originacion_promedio} días`, icon: <ScheduleIcon /> },
    { title: "Saldo Disponible", value: formatCurrency(dashboardData.saldo_disponible), icon: <AccountBalanceIcon /> }
  ];

  return (
    <Box>
      {/* Encabezado + Filtros */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#5B898E">
            Dashboard de Operaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actualizado: {new Date().toLocaleString("es-ES")}
          </Typography>
        </Box>

        {/* Select de filtros */}
        <FormControl size="small" sx={{ minWidth: 180, mt: { xs: 2, sm: 0 } }}>
          <InputLabel>Periodo</InputLabel>
          <Select
            value={periodo}
            label="Periodo"
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <MenuItem value="este_anio">Este año</MenuItem>
            <MenuItem value="este_mes">Este mes</MenuItem>
            <MenuItem value="esta_semana">Esta semana</MenuItem>
            <MenuItem value="ultimo_trimestre">Último trimestre</MenuItem>
            <MenuItem value="2024">Año 2024</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tarjetas de métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Card sx={{ textAlign: "center", p: 2, "&:hover": { boxShadow: 4, transform: "translateY(-3px)" } }}>
              <Avatar sx={{ bgcolor: "#488B8F", mx: "auto", mb: 1 }}>{metric.icon}</Avatar>
              <Typography variant="h6" color="#5B898E" fontWeight="bold">
                {metric.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metric.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráfico de volumen */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
          Volumen de Negocio
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Barras = Volumen originado (payedAmount puntual) &nbsp;|&nbsp; Línea = Volumen acumulado (payedAmount acumulado)
        </Typography>

        {dashboardData?.volumen_negocio?.length > 0 ? (
          <Box sx={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <ComposedChart data={dashboardData.volumen_negocio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#5B898E" }} />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "volumen_originado") {
                      return [formatCurrency(value), "Volumen Originado"];
                    }
                    if (name === "volumen_acumulado") {
                      return [formatCurrency(value), "Volumen Acumulado"];
                    }
                    return [formatCurrency(value), name];
                  }}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{ borderRadius: 10, borderColor: "#488B8F" }}
                  itemSorter={(item) => item.dataKey === "volumen_acumulado" ? 1 : -1}
                />
                <Legend />
                <Bar dataKey="volumen_originado" fill="#488B8F" name="Volumen Originado" barSize={40} />
                <Line type="monotone" dataKey="volumen_acumulado" stroke="#FF9800" strokeWidth={2} name="Volumen Acumulado" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No hay datos disponibles.
          </Typography>
        )}
      </Card>
    </Box>
  );
};
