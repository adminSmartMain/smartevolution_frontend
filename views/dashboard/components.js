import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SavingsIcon from "@mui/icons-material/Savings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SURFACE_BORDER = "#E8EEEF";
const TEXT_PRIMARY = "#4A6166";
const TEXT_SECONDARY = "#667B80";
const TEXT_MUTED = "#8B9A9E";
const BRAND = "#4F969B";

const numberFormatter = new Intl.NumberFormat("es-CO");

const formatCurrency = (rawValue) => {
  const value = Number(rawValue || 0);
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    const millions = value / 1_000_000;
    const digits = Math.abs(millions) >= 1000 ? 0 : Math.abs(millions) >= 100 ? 1 : 2;
    return `$${millions.toLocaleString("es-CO", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })} M`;
  }

  if (absolute >= 1_000) {
    return `$${(value / 1_000).toLocaleString("es-CO", {
      maximumFractionDigits: 1,
    })} mil`;
  }

  return `$${value.toLocaleString("es-CO", {
    maximumFractionDigits: 2,
  })}`;
};

const panelSx = {
  border: `1px solid ${SURFACE_BORDER}`,
  borderRadius: 2.5,
  boxShadow: "0 2px 12px rgba(42, 71, 74, 0.04)",
  background: "#FFFFFF",
};

const SectionHeader = ({ title, subtitle, icon }) => (
  <Box sx={{ mb: 2.25 }}>
    <Stack direction="row" spacing={1.1} alignItems="center">
      {icon && (
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: "rgba(79, 150, 155, 0.10)",
            color: BRAND,
            "& svg": { fontSize: 16.5 },
          }}
        >
          {icon}
        </Avatar>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: TEXT_PRIMARY,
            fontWeight: 600,
            fontSize: { xs: "0.98rem", md: "1.02rem" },
            lineHeight: 1.25,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: TEXT_MUTED, fontSize: "0.76rem", mt: 0.3, lineHeight: 1.45 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

const EmptyState = ({ children }) => (
  <Box
    sx={{
      minHeight: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: TEXT_MUTED,
      textAlign: "center",
      px: 2,
    }}
  >
    <Typography variant="body2" sx={{ fontSize: "0.82rem" }}>
      {children}
    </Typography>
  </Box>
);

const TrendIndicator = ({ trend }) => {
  if (!trend) return null;

  const isPositive = trend.trend === "up";
  const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const color = isPositive ? "#4D8C76" : "#C67878";

  return (
    <Stack direction="row" spacing={0.45} alignItems="center" sx={{ mt: 0.7, color }}>
      <Icon sx={{ fontSize: 14 }} />
      <Typography sx={{ fontSize: "0.72rem", fontWeight: 500, color: "inherit", lineHeight: 1.2 }}>
        {Math.abs(Number(trend.percentage || 0))}% {trend.description}
      </Typography>
    </Stack>
  );
};

const MetricCard = ({ metric, trend }) => (
  <Card
    sx={{
      ...panelSx,
      height: "auto",
      minHeight: 106,
      p: { xs: 1.8, md: 2 },
      transition: "border-color .18s ease, box-shadow .18s ease",
      "&:hover": {
        borderColor: "#DCE6E8",
        boxShadow: "0 4px 16px rgba(42, 71, 74, 0.06)",
      },
    }}
  >
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "rgba(79, 150, 155, 0.10)",
          color: BRAND,
          "& svg": { fontSize: 18 },
        }}
      >
        {metric.icon}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ color: TEXT_MUTED, fontSize: "0.73rem", fontWeight: 500, mb: 0.45, lineHeight: 1.25 }}>
          {metric.title}
        </Typography>
        <Typography
          sx={{
            color: TEXT_PRIMARY,
            fontSize: { xs: "1.05rem", md: "1.22rem" },
            lineHeight: 1.15,
            fontWeight: 650,
            letterSpacing: "-0.01em",
            wordBreak: "break-word",
          }}
        >
          {metric.value}
        </Typography>
        {metric.trendKey && <TrendIndicator trend={trend} />}
      </Box>
    </Stack>
  </Card>
);

const MetricSkeleton = () => (
  <Card sx={{ ...panelSx, p: { xs: 1.8, md: 2 }, minHeight: 106 }}>
    <Stack direction="row" spacing={1.2}>
      <Skeleton variant="rounded" width={36} height={36} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="66%" height={16} />
        <Skeleton width="52%" height={30} />
        <Skeleton width="44%" height={16} />
      </Box>
    </Stack>
  </Card>
);

const ChartSkeleton = ({ height = 320 }) => (
  <Box>
    <Skeleton width="38%" height={24} />
    <Skeleton width="55%" height={17} sx={{ mb: 2.5 }} />
    <Skeleton variant="rounded" width="100%" height={height} />
  </Box>
);

const RankingList = ({ items, type }) => {
  const isEmitter = type === "emitter";
  const maxValue = Math.max(
    ...items.map((item) => Number(isEmitter ? item.invoice_value : item.invested_value) || 0),
    1
  );

  return (
    <Stack divider={<Divider flexItem sx={{ borderColor: "#EEF2F3" }} />}>
      {items.map((item, index) => {
        const amount = Number(isEmitter ? item.invoice_value : item.invested_value) || 0;
        const quantity = isEmitter ? item.invoice_count : item.operations;
        const quantityLabel = isEmitter
          ? `${numberFormatter.format(quantity || 0)} ${quantity === 1 ? "factura" : "facturas"}`
          : `${numberFormatter.format(quantity || 0)} ${quantity === 1 ? "operación" : "operaciones"}`;

        return (
          <Box key={`${item.client_id || item.document_number || item.name}-${index}`} sx={{ py: 1.45 }}>
            <Stack direction="row" spacing={1.15} alignItems="flex-start">
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: index === 0 ? "rgba(79, 150, 155, 0.14)" : "#F3F6F6",
                  color: index === 0 ? BRAND : TEXT_SECONDARY,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 600,
                  fontSize: "0.74rem",
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                {index + 1}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "flex-start" }}
                  spacing={0.8}
                >
                  <Box sx={{ minWidth: 0, pr: { sm: 1.5 } }}>
                    <Typography
                      title={item.name}
                      sx={{
                        color: TEXT_PRIMARY,
                        fontWeight: 600,
                        fontSize: "0.84rem",
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: { xs: 3, sm: 2 },
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Stack direction="row" spacing={0.65} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 0.5 }}>
                      {item.document_number && (
                        <Typography sx={{ color: TEXT_MUTED, fontSize: "0.7rem", lineHeight: 1.3 }}>
                          {item.document_number}
                        </Typography>
                      )}
                      <Chip
                        size="small"
                        label={quantityLabel}
                        sx={{
                          height: 19,
                          bgcolor: "#F5F8F8",
                          color: TEXT_SECONDARY,
                          fontSize: "0.64rem",
                          fontWeight: 500,
                          borderRadius: "999px",
                          "& .MuiChip-label": { px: 0.8 },
                        }}
                      />
                    </Stack>
                  </Box>

                  <Typography
                    sx={{
                      color: TEXT_PRIMARY,
                      fontWeight: 650,
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {formatCurrency(amount)}
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={(amount / maxValue) * 100}
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 99,
                    bgcolor: "#EEF3F3",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      bgcolor: index === 0 ? BRAND : "#9EC5C8",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState("este_anio");

  const fetchDashboardData = async (selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/dashboard?periodo=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        window.location.assign("/auth/login");
        return;
      }

      if (response.status === 403) {
        window.location.assign("/403");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError("Error al cargar los datos del dashboard");
      }
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

  const clientesPorRol = useMemo(
    () =>
      (dashboardData?.clientes?.por_rol || []).map((item) => ({
        name: item.role,
        value: item.count,
        percentage: item.percentage_of_clients,
      })),
    [dashboardData]
  );

  const topEmitters = dashboardData?.clientes?.top_emitters || [];
  const topInvestors = dashboardData?.clientes?.top_investors || [];
  const currentYear = new Date().getFullYear();

  const metrics = [
    {
      title: "Valor total del portafolio",
      value: formatCurrency(dashboardData?.valor_total_portafolio),
      icon: <AccountTreeIcon />,
      trendKey: "valor_total_portafolio",
    },
    {
      title: "Total operaciones",
      value: numberFormatter.format(dashboardData?.totalOperaciones || 0),
      icon: <TrendingUpIcon />,
      trendKey: "totalOperaciones",
    },
    {
      title: "Facturas procesadas",
      value: numberFormatter.format(dashboardData?.cantidad_facturas || 0),
      icon: <ReceiptIcon />,
      trendKey: "cantidad_facturas",
    },
    {
      title: "Tasa descuento promedio",
      value: `${Number(dashboardData?.tasa_descuento_promedio || 0).toLocaleString("es-CO", {
        maximumFractionDigits: 2,
      })}%`,
      icon: <PieChartIcon />,
      trendKey: "tasa_descuento_promedio",
    },
    {
      title: "Tasa inversionista promedio",
      value: `${Number(dashboardData?.tasa_inversionista_promedio || 0).toLocaleString("es-CO", {
        maximumFractionDigits: 2,
      })}%`,
      icon: <BarChartIcon />,
      trendKey: "tasa_inversionista_promedio",
    },
    {
      title: "Plazo promedio",
      value: `${Number(dashboardData?.plazo_originacion_promedio || 0).toLocaleString("es-CO", {
        maximumFractionDigits: 1,
      })} días`,
      icon: <ScheduleIcon />,
    },
    {
      title: "Plazo recaudo promedio",
      value: `${Number(dashboardData?.plazo_recaudo_promedio || 0).toLocaleString("es-CO", {
        maximumFractionDigits: 1,
      })} días`,
      icon: <CalendarTodayIcon />,
    },
    {
      title: "Saldo disponible",
      value: formatCurrency(dashboardData?.saldo_disponible),
      icon: <AccountBalanceIcon />,
      trendKey: "saldo_disponible",
    },
  ];

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ py: { xs: 1, md: 1.25 }, pb: { xs: 4, md: 5 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          {loading ? (
            <>
              <Skeleton width={220} height={30} />
              <Skeleton width={170} height={17} />
            </>
          ) : (
            <>
              <Typography
                component="h1"
                className="view-title"
                sx={{ color: TEXT_PRIMARY, fontSize: { xs: "1.05rem", md: "1.15rem" }, fontWeight: 600 }}
              >
                Estadísticas generales
              </Typography>
              <Typography sx={{ color: TEXT_MUTED, fontSize: "0.76rem", mt: 0.4 }}>
                Última operación registrada: {dashboardData?.ultima_actualizacion || "—"}
              </Typography>
            </>
          )}
        </Box>

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            maxWidth: { xs: "100%", sm: 180 },
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        >
          <InputLabel>Periodo</InputLabel>
          <Select value={periodo} label="Periodo" onChange={(event) => setPeriodo(event.target.value)}>
            <MenuItem value="este_anio">Este año</MenuItem>
            <MenuItem value="este_mes">Este mes</MenuItem>
            <MenuItem value="esta_semana">Esta semana</MenuItem>
            <MenuItem value="ultimo_trimestre">Último trimestre</MenuItem>
            {[0, 1, 2].map((offset) => {
              const year = currentYear - offset;
              return (
                <MenuItem key={year} value={String(year)}>
                  Año {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>

      <Grid
        container
        spacing={{ xs: 1.5, md: 1.75 }}
        alignItems="flex-start"
        sx={{ mb: { xs: 2.5, md: 3 } }}
      >
        {(loading ? Array.from({ length: 8 }) : metrics).map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ alignSelf: "flex-start" }}>
            {loading ? (
              <MetricSkeleton />
            ) : (
              <MetricCard
                metric={metric}
                trend={metric.trendKey ? dashboardData?.tendencias?.[metric.trendKey] : null}
              />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 1.75, md: 2 }} sx={{ mb: { xs: 3, md: 3.5 } }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ ...panelSx, p: { xs: 1.8, md: 2.3 }, height: "100%" }}>
            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <>
                <SectionHeader
                  title="Volumen de negocio"
                  subtitle="Originación del periodo y crecimiento acumulado"
                  icon={<BarChartIcon />}
                />

                {dashboardData?.volumen_negocio?.length > 0 ? (
                  <Box sx={{ width: "100%", height: isMobile ? 280 : 315 }}>
                    <ResponsiveContainer>
                      <ComposedChart data={dashboardData.volumen_negocio} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                        <CartesianGrid stroke="#EDF1F2" vertical={false} />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={formatCurrency}
                          tick={{ fill: TEXT_MUTED, fontSize: 10.5 }}
                          axisLine={false}
                          tickLine={false}
                          width={70}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            formatCurrency(value),
                            name === "volumen_originado" ? "Volumen originado" : "Volumen acumulado",
                          ]}
                          labelFormatter={(label) => `Periodo: ${label}`}
                          contentStyle={{
                            border: `1px solid ${SURFACE_BORDER}`,
                            borderRadius: 10,
                            boxShadow: "0 6px 18px rgba(35, 58, 62, .08)",
                          }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                        <Bar
                          dataKey="volumen_originado"
                          fill="#78AEB2"
                          name="Volumen originado"
                          barSize={isMobile ? 24 : 30}
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="volumen_acumulado"
                          stroke="#D59A56"
                          strokeWidth={2.2}
                          dot={{ r: 2.8, fill: "#D59A56", strokeWidth: 0 }}
                          activeDot={{ r: 4 }}
                          name="Volumen acumulado"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <EmptyState>No hay datos de volumen disponibles para este periodo.</EmptyState>
                )}
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ ...panelSx, p: { xs: 1.8, md: 2.3 }, height: "100%" }}>
            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <>
                <SectionHeader
                  title="Clientes por rol"
                  subtitle="Proporción de clientes activos que pertenece a cada rol"
                  icon={<GroupsIcon />}
                />

                {clientesPorRol.length > 0 ? (
                  <Stack spacing={2.1} sx={{ pt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 0.4 }}>
                      <Chip
                        size="small"
                        label={`${numberFormatter.format(dashboardData?.clientes?.total || 0)} clientes activos`}
                        sx={{
                          flexShrink: 0,
                          height: 24,
                          bgcolor: "#F3F7F7",
                          color: TEXT_SECONDARY,
                          fontSize: "0.68rem",
                          fontWeight: 500,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Box>

                    {clientesPorRol.map((item) => (
                      <Box key={item.name}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1.5} sx={{ mb: 0.8 }}>
                          <Typography sx={{ color: TEXT_SECONDARY, fontSize: "0.82rem", fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ flexShrink: 0 }}>
                            <Typography sx={{ color: TEXT_PRIMARY, fontSize: "0.86rem", fontWeight: 650 }}>
                              {numberFormatter.format(item.value)}
                            </Typography>
                            <Typography sx={{ color: TEXT_MUTED, fontSize: "0.72rem", minWidth: 48, textAlign: "right" }}>
                              {Number(item.percentage || 0).toLocaleString("es-CO", { maximumFractionDigits: 2 })}%
                            </Typography>
                          </Stack>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(Number(item.percentage || 0), 100)}
                          sx={{
                            height: 7,
                            borderRadius: 99,
                            bgcolor: "#EEF3F3",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 99,
                              bgcolor: BRAND,
                            },
                          }}
                        />
                      </Box>
                    ))}

                    <Typography
                      sx={{
                        color: TEXT_MUTED,
                        fontSize: "0.64rem",
                        lineHeight: 1.35,
                        whiteSpace: "nowrap",
                        pt: 0.15,
                      }}
                    >
                      Un mismo cliente puede pertenecer a más de un rol.
                    </Typography>
                  </Stack>
                ) : (
                  <EmptyState>No hay roles de clientes disponibles.</EmptyState>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ pt: { xs: 4, md: 4.5 } }}>
        <Grid container spacing={{ xs: 1.75, md: 2 }}>
          <Grid item xs={12} lg={6}>
          <Card sx={{ ...panelSx, p: { xs: 1.8, md: 2.3 }, height: "100%" }}>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : (
              <>
                <SectionHeader
                  title="Top 5 emisores"
                  subtitle="Por valor nominal total de las facturas emitidas"
                  icon={<BusinessIcon />}
                />
                {topEmitters.length > 0 ? (
                  <RankingList items={topEmitters} type="emitter" />
                ) : (
                  <EmptyState>No hay emisores con facturas para mostrar.</EmptyState>
                )}
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ ...panelSx, p: { xs: 1.8, md: 2.3 }, height: "100%" }}>
            {loading ? (
              <ChartSkeleton height={280} />
            ) : (
              <>
                <SectionHeader
                  title="Top 5 inversionistas"
                  subtitle="Por valor presente total invertido"
                  icon={<SavingsIcon />}
                />
                {topInvestors.length > 0 ? (
                  <RankingList items={topInvestors} type="investor" />
                ) : (
                  <EmptyState>No hay inversionistas con operaciones para mostrar.</EmptyState>
                )}
              </>
            )}
          </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
