// components/layout.js
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Drawer, useMediaQuery } from "@mui/material";

import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import authContext from "@context/authContext";

export default function Layout({ children }) {
  const { user } = useContext(authContext);
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const headerHeight = 72;

  // CERRAR SIDEBAR CUANDO CAMBIA LA RUTA
  useEffect(() => {
    setIsSidebarExpanded(false);
    setIsMobileOpen(false);
  }, [router.pathname]); // Se ejecuta cuando cambia la ruta

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  const handleMobileItemClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* Header - Solo el avatar */}
      <Box sx={{ flexShrink: 0 }}>
        <Header 
          isSidebarExpanded={isSidebarExpanded}
          user={user}
        />
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          pt: `${headerHeight}px`,
          boxSizing: "border-box",
          position: 'relative',
        }}
      >
        {/* Sidebar para desktop - El logo funciona como toggle */}
        {isDesktop && (
          <Sidebar 
            isExpanded={isSidebarExpanded}
            onToggle={handleToggleSidebar}
            onClick={handleMobileItemClick}
          />
        )}

        {/* OVERLAY PARA DESKTOP CUANDO SIDEBAR ESTÁ EXPANDIDO */}
        {isDesktop && isSidebarExpanded && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1199,
              transition: 'all 0.3s ease',
            }}
            onClick={handleToggleSidebar}
          />
        )}

        {/* Logo para móvil - CAMBIA SEGÚN ESTADO DEL DRAWER */}
        {!isDesktop && (
          <Box
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1300,
              cursor: 'pointer',
            }}
            onClick={handleToggleMobile}
          >
            <img
              src={isMobileOpen ? "/assets/Logo Smart - Lite.svg" : "/assets/Icono Smart.svg"}
              width={isMobileOpen ? 120 : 40}
              height={isMobileOpen ? 40 : 40}
              alt="Smart Evolution"
              style={{
                objectFit: 'contain',
                transition: 'all 0.3s ease',
              }}
            />
          </Box>
        )}

        <Drawer 
          anchor="left" 
          open={isMobileOpen} 
          onClose={handleCloseMobile}
          sx={{ 
            display: { lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              border: 'none',
              top: 0,
              height: '100vh',
              width: 280,
            },
          }}
        >
          <Sidebar 
            isExpanded={true}
            onClick={handleMobileItemClick}
            isMobile={true}
          />
        </Drawer>

        {/* Contenido principal - MARGIN SOLO CUANDO SIDEBAR ESTÁ CONTRAÍDO */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, sm: 3, md: "5%" },
            py: 3,
            transition: 'margin-left 0.3s',
            marginLeft: { 
              xs: 0, 
              lg: isSidebarExpanded ? 0 : '80px' // ← Solo margen cuando está contraído
            },
            width: { 
              xs: '100%', 
              lg: isSidebarExpanded ? '100%' : 'calc(100% - 80px)' // ← Ajuste de ancho
            },
            minHeight: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer - MARGIN SOLO CUANDO SIDEBAR ESTÁ CONTRAÍDO */}
      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          backgroundColor: "background.paper",
          marginLeft: { 
            xs: 0, 
            lg: isSidebarExpanded ? 0 : '80px' // ← Solo margen cuando está contraído
          },
          width: { 
            xs: '100%', 
            lg: isSidebarExpanded ? '100%' : 'calc(100% - 80px)' // ← Ajuste de ancho
          },
          transition: 'margin-left 0.3s, width 0.3s',
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3, md: "5%" }, py: 2 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}