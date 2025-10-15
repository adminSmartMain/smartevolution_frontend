// components/layout.js
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box, Drawer, useMediaQuery } from "@mui/material";

import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import authContext from "@context/authContext";

// EVITAR RE-RENDERS INNECESARIOS
export default function Layout({ children }) {
  const { user } = useContext(authContext);
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const headerHeight = 72;

  // USAR useRef PARA EVITAR RE-RENDERS
  const routerPathnameRef = useRef(router.pathname);

  useEffect(() => {
    if (routerPathnameRef.current !== router.pathname) {
      routerPathnameRef.current = router.pathname;
      setIsSidebarExpanded(false);
      setIsMobileOpen(false);
    }
  }, [router.pathname]);

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  const handleToggleMobile = () => {
    setIsMobileOpen(prev => !prev);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  const handleMobileItemClick = () => {
    setIsMobileOpen(false);
  };

  // CALCULAR ESTILOS UNA VEZ
  const mainStyles = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 3,
    marginLeft: isDesktop ? (isSidebarExpanded ? "280px" : "80px") : 0,
    width: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    minHeight: `calc(100vh - ${headerHeight}px)`,
    // ELIMINAR TRANSICIONES DURANTE CARGA DE DATOS
   transition: "none",
  };

  const footerStyles = {
    flexShrink: 0,
    backgroundColor: "background.paper",
    marginLeft: isDesktop ? (isSidebarExpanded ? "280px" : "80px") : 0,
    width: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    transition: isDesktop ? "margin-left 0.2s ease, width 0.2s ease" : "none",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: 'white' }}>
      {/* Header fijo y simple */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <Header 
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebar={handleToggleSidebar}
          onToggleMobile={handleToggleMobile}
          user={user}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", width: "100%", pt: `${headerHeight}px` }}>
        
        {/* Sidebar Desktop */}
        {isDesktop && (
          <Sidebar 
            isExpanded={isSidebarExpanded}
            onClick={handleMobileItemClick}
          />
        )}

        {/* Drawer Mobile */}
        {!isDesktop && (
          <Drawer anchor="left" open={isMobileOpen} onClose={handleCloseMobile}>
            <Sidebar isExpanded={true} isMobile={true} onClick={handleMobileItemClick} />
          </Drawer>
        )}

        {/* Content - SIN RE-RENDERS INNECESARIOS */}
        <Box sx={mainStyles}>
          {children}
        </Box>
      </Box>

      {/* Footer simple */}
      <Box component="footer" sx={footerStyles}>
        <Box sx={{ padding: 2 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}