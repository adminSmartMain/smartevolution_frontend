import EastIcon from "@mui/icons-material/East";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import React from "react";
import DashboardButton from "@styles/buttons/button_3";
import SecurityDialog from "@components/modals/infoModal";

export const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Datos de ejemplo
  const metrics = [
    { title: "Cartera Total", value: "$2.5M", change: "+12%", icon: <AccountBalanceIcon /> },
    { title: "Rendimiento", value: "15.2%", change: "+3.2%", icon: <TrendingUpIcon /> },
    { title: "Operaciones", value: "24", change: "+5", icon: <PieChartIcon /> },
    { title: "Alertas", value: "3", change: "-2", icon: <NotificationsIcon /> }
  ];

  const progressItems = [
    { title: "Cartera Colocada", value: 82, date: "junio 2024", description: "Detalle de préstamos" },
    { title: "Liquidez", value: 65, date: "junio 2024", description: "Disponibilidad inmediata" },
    { title: "Inversiones", value: 78, date: "junio 2024", description: "Portafolio activo" },
    { title: "Riesgo", value: 45, date: "junio 2024", description: "Nivel de exposición" }
  ];

  return (
    <>
      <SecurityDialog />
      
      {/* Header del Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            color="#5B898E"
          >
            Dashboard Financiero
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actualizado: Hoy, 10:30 AM
          </Typography>
        </Box>
        
        {/* Cita inspiradora */}
        <Card sx={{ bgcolor: '#B5D1C9', border: 'none', boxShadow: 2 }}>
          <CardContent>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              color="#5B898E" 
              textAlign="center"
              fontStyle="italic"
            >
              "¿Qué es la riqueza? Nada, si no se gasta; nada, si se malgasta."
              <br />
              <Typography variant="caption" color="#5B898E">
                - André Breton
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#488B8F', 
                    mx: 'auto', 
                    mb: 2,
                    width: 56,
                    height: 56
                  }}
                >
                  {metric.icon}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="#5B898E" gutterBottom>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {metric.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: metric.change.startsWith('+') ? '#4CAF50' : '#FF9800',
                    fontWeight: 'bold'
                  }}
                >
                  {metric.change} vs mes anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección de progresos circulares */}
      <Typography variant="h6" fontWeight="bold" color="#5B898E" sx={{ mb: 3 }}>
        Indicadores Clave
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {progressItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={item.value}
                  size={isSmall ? 80 : 100}
                  thickness={4}
                  sx={{
                    color: '#488B8F',
                    bgcolor: '#F0F0F0',
                    borderRadius: '50%'
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h6" color="#5EA3A3" fontWeight="bold">
                    {item.value}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.date}
              </Typography>
              
              <DashboardButton
                fullWidth
                sx={{ mt: 2 }}
                endIcon={<EastIcon />}
              >
                Revisar
              </DashboardButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos y datos adicionales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
              Rendimiento Mensual
            </Typography>
            <Box sx={{ 
              height: 200, 
              bgcolor: '#F8F9FA', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
              gap: 1
            }}>
              {[65, 80, 75, 90, 85, 95, 82].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${height}%`,
                    bgcolor: '#488B8F',
                    borderRadius: 1,
                    minHeight: 20
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
              Distribución
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1}}>
              {[
                { label: 'Acciones', value: 35, color: '#488B8F' },
                { label: 'Bonos', value: 25, color: '#5B898E' },
                { label: 'Efectivo', value: 20, color: '#5EA3A3' },
                { label: 'Otros', value: 20, color: '#B5D1C9' }
              ].map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        bgcolor: item.color, 
                        width: `${item.value}%` 
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Últimas transacciones */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="#5B898E" gutterBottom>
            Actividad Reciente
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { action: 'Inversión realizada', amount: '+$50,000', date: 'Hoy, 09:30', type: 'ingreso' },
              { action: 'Retiro de fondos', amount: '-$15,000', date: 'Ayer, 14:20', type: 'egreso' },
              { action: 'Dividendos', amount: '+$2,500', date: '15 Jun', type: 'ingreso' },
              { action: 'Comisión', amount: '-$500', date: '14 Jun', type: 'egreso' }
            ].map((transaction, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  bgcolor: index % 2 === 0 ? '#F8F9FA' : 'transparent',
                  borderRadius: 1
                }}
              >
                <Box>
                  <Typography fontWeight="bold">{transaction.action}</Typography>
                  <Typography variant="body2" color="text.secondary">{transaction.date}</Typography>
                </Box>
                <Typography 
                  fontWeight="bold"
                  color={transaction.type === 'ingreso' ? '#4CAF50' : '#FF9800'}
                >
                  {transaction.amount}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};