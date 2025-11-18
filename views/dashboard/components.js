import React, { useEffect, useState } from "react";
import {
  Box,
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
  InputLabel,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BarChartIcon from "@mui/icons-material/BarChart";
import PortfolioIcon from "@mui/icons-material/AccountTree";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Colores para el gráfico de torta
const COLORS = ['#488B8F', '#5B898E', '#6A8790', '#7A8592', '#8A8394', '#9A8196'];

export const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState("este_anio");

  const formatCurrency = (value) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(3)}M`;
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


// Componente para mostrar tendencias
const TrendIndicator = ({ metricKey }) => {
  if (!dashboardData?.tendencias?.[metricKey]) {
    console.log(`❌ No hay tendencia para: ${metricKey}`);
    return null;
  }
  
  const trend = dashboardData.tendencias[metricKey];
  console.log(`✅ Tendencia encontrada para ${metricKey}:`, trend);
  
  const isPositive = trend.trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      mt: 0.5
    }}>
      <TrendIcon 
        sx={{ 
          fontSize: 16,
          color: isPositive ? '#4caf50' : '#f44336',
          mr: 0.5
        }} 
      />
      <Typography 
        variant="caption" 
        sx={{
          color: isPositive ? '#4caf50' : '#f44336',
          fontWeight: 'medium',
          fontSize: '0.7rem'
        }}
      >
        {Math.abs(trend.percentage)}% {trend.description}
      </Typography>
    </Box>
  );
};

  // Skeleton para las tarjetas de métricas
  const MetricSkeleton = () => (
    <Card sx={{ textAlign: "center", p: 2, height: "100%", minHeight: 140 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
      <Skeleton variant="text" width="80%" height={32} sx={{ mx: "auto", mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mx: "auto" }} />
    </Card>
  );

  // Skeleton para el gráfico de barras
  const ChartSkeleton = () => (
    <Box sx={{ width: "100%", height: 350 }}>
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 1 }} />
    </Box>
  );

  // Skeleton para el gráfico de torta
  const PieChartSkeleton = () => (
    <Box sx={{ width: "100%", height: 350 }}>
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Skeleton variant="circular" width={200} height={200} />
      </Box>
    </Box>
  );

  // Skeleton para la tabla
  const TableSkeleton = () => (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 1 }} />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" width="100%" height={40} sx={{ mb: 1 }} />
      ))}
    </Box>
  );

  // Skeleton para el header
  const HeaderSkeleton = () => (
    <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
      <Box>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={150} height={20} />
      </Box>
      <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: 1, mt: { xs: 2, sm: 0 } }} />
    </Box>
  );

  if (error)
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  const metrics = [
    { 
      title: "Valor Total del Portafolio", 
      value: formatCurrency(dashboardData?.valor_total_portafolio), 
      icon: <PortfolioIcon />,
      trendKey: 'valor_total_portafolio'
    },
    { 
      title: "Total Operaciones", 
      value: dashboardData?.totalOperaciones?.toLocaleString(), 
      icon: <TrendingUpIcon />,
      trendKey: 'totalOperaciones'
    },
    { 
      title: "Facturas Procesadas", 
      value: dashboardData?.cantidad_facturas?.toLocaleString(), 
      icon: <ReceiptIcon />,
      trendKey: 'cantidad_facturas'
    },
    { 
      title: "Tasa Descuento Promedio", 
      value: `${dashboardData?.tasa_descuento_promedio}%`, 
      icon: <PieChartIcon />,
      trendKey: 'tasa_descuento_promedio'
    },
    { 
      title: "Tasa Inversionista Promedio", 
      value: `${dashboardData?.tasa_inversionista_promedio}%`, 
      icon: <BarChartIcon />,
      trendKey: 'tasa_inversionista_promedio'
    },
    { 
      title: "Plazo Promedio", 
      value: `${dashboardData?.plazo_originacion_promedio} días`, 
      icon: <ScheduleIcon />,
      trendKey: null // No aplica tendencia
    },
    { 
      title: "Plazo Recaudo Promedio", 
      value: `${dashboardData?.plazo_recaudo_promedio} días`, 
      icon: <CalendarIcon />,
      trendKey: null // No aplica tendencia
    },
    { 
      title: "Saldo Disponible", 
      value: formatCurrency(dashboardData?.saldo_disponible), 
      icon: <AccountBalanceIcon />,
      trendKey: 'saldo_disponible'
    }
  ];

  // Datos de ejemplo para el gráfico de torta (distribución por sector)
  const distribucionSector = [
    { name: "Manufactura", value: 35 },
    { name: "Tecnología", value: 25 },
    { name: "Retail", value: 20 },
    { name: "Servicios", value: 12 },
    { name: "Energía", value: 8 }
  ];

  // Datos de ejemplo para la tabla (top operaciones)
  const topOperaciones = [
    { id: 1, empresa: "Empresa A", monto: 1500000, fecha: "2024-01-15", estado: "Completada" },
    { id: 2, empresa: "Empresa B", monto: 1200000, fecha: "2024-01-14", estado: "Completada" },
    { id: 3, empresa: "Empresa C", monto: 900000, fecha: "2024-01-13", estado: "En proceso" },
    { id: 4, empresa: "Empresa D", monto: 800000, fecha: "2024-01-12", estado: "Completada" },
    { id: 5, empresa: "Empresa E", monto: 750000, fecha: "2024-01-11", estado: "Pendiente" }
  ];

  return (
    <Box sx={{ py: 3 }}>
      {/* Encabezado + Filtros */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          
<Box>
  <Typography variant="h6" fontWeight="bold" color="#5B898E" className="view-title">
    Dashboard de Operaciones
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Actualizado: {dashboardData?.ultima_actualizacion || new Date().toLocaleString("es-ES")}
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
      )}

      {/* Tarjetas de métricas - 2 filas de 4 */}
      <Grid container spacing={3} sx={{ mb: 10 }}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricSkeleton />
            </Grid>
          ))
        ) : (
          metrics.map((metric, i) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              key={i}
              sx={{ mb: i < 4 ? 4 : 0 }}
            >
              <Card sx={{ 
                textAlign: "center", 
                p: 3, 
                height: '120px',
                //minHeight: 100,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": { 
                  boxShadow: 4, 
                  transform: "translateY(-3px)" 
                } 
              }}>
                <Avatar sx={{ 
                  bgcolor: "#488B8F", 
                  mx: "auto", 
                  mb: 2,
                  width: 48,
                  height: 48,
                }}>
                  {metric.icon}
                </Avatar>
                <Typography 
                  variant="h6" 
                  color="#5B898E" 
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {metric.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {metric.title}
                </Typography>
                {/* Indicador de tendencia */}
                {metric.trendKey && <TrendIndicator metricKey={metric.trendKey} />}
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Primera fila de gráficos */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 10 }}>
        {/* Gráfico de volumen */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 4, height: "100%" }}>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
                  Volumen de Negocio
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
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
                          labelFormatter={(label) => `Periodo: ${label}`}
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
              </>
            )}
          </Card>
        </Grid>

        {/* Gráfico de torta - Distribución por sector */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 4, height: "100%" }}>
            {loading ? (
              <PieChartSkeleton />
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
                  Distribución por Sector
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  Porcentaje de operaciones por sector económico
                </Typography>

                <Box sx={{ width: "100%", height: 350 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={distribucionSector}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribucionSector.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Participación']}
                        contentStyle={{ borderRadius: 10, borderColor: "#488B8F" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de últimas operaciones */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            {loading ? (
              <TableSkeleton />
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
                  Últimas Operaciones
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  Listado de las operaciones más recientes procesadas en el sistema
                </Typography>

                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#5B898E' }}>Empresa</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#5B898E' }}>Monto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#5B898E' }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#5B898E' }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topOperaciones.map((operacion) => (
                        <TableRow 
                          key={operacion.id}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'background-color 0.2s',
                            '&:hover': { backgroundColor: '#f8f9fa' }
                          }}
                        >
                          <TableCell>{operacion.empresa}</TableCell>
                          <TableCell sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(operacion.monto)}
                          </TableCell>
                          <TableCell>
                            {new Date(operacion.fecha).toLocaleDateString('es-ES')}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                fontWeight: 'medium',
                                backgroundColor: 
                                  operacion.estado === 'Completada' ? '#e8f5e8' :
                                  operacion.estado === 'En proceso' ? '#fff3e0' :
                                  '#ffebee',
                                color:
                                  operacion.estado === 'Completada' ? '#2e7d32' :
                                  operacion.estado === 'En proceso' ? '#f57c00' :
                                  '#c62828'
                              }}
                            >
                              {operacion.estado}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};