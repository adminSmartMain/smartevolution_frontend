// components/layout.js
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box, Drawer, useMediaQuery } from "@mui/material";

import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import PageHeader from "./pageHeader";
import authContext from "@context/authContext";
import { getPageHeader, ROUTES_WITH_LOCAL_PAGE_HEADER } from "../config/pageHeaders";

// EVITAR RE-RENDERS INNECESARIOS
export default function Layout({ children }) {
  const { user } = useContext(authContext);
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const headerHeight = 72;
  const pageHeader = getPageHeader(router.pathname);
  const hasLocalPageHeader = ROUTES_WITH_LOCAL_PAGE_HEADER.has(router.pathname);
  const fillsAvailableHeight = router.pathname === "/bills/billList";

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
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    padding: 3,
    paddingBottom: fillsAvailableHeight ? 1 : 3,
    marginLeft: isDesktop ? (isSidebarExpanded ? "280px" : "80px") : 0,
    width: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    maxWidth: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
    minHeight: fillsAvailableHeight ? 0 : `calc(100vh - ${headerHeight}px)`,
    // ELIMINAR TRANSICIONES DURANTE CARGA DE DATOS
   transition: "none",
  };

  const footerStyles = {
    flexShrink: 0,
    backgroundColor: "background.paper",
    position: "relative",
    zIndex: 1,
    marginTop: 2,
    marginLeft: isDesktop ? (isSidebarExpanded ? "280px" : "80px") : 0,
    width: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    maxWidth: isDesktop ? (isSidebarExpanded ? "calc(100% - 280px)" : "calc(100% - 80px)") : "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
    transition: isDesktop ? "margin-left 0.2s ease, width 0.2s ease" : "none",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "100vw", overflowX: "hidden", backgroundColor: 'white' }}>
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
      <Box sx={{ flex: "1 1 auto", display: "flex", alignItems: "stretch", width: "100%", minWidth: 0, maxWidth: "100%", overflowX: "hidden", pt: `${headerHeight}px` }}>
        
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
        <Box
          sx={{
            ...mainStyles,
            "& .platform-page-content": { minWidth: 0, maxWidth: "100%" },
            "& .platform-page-content .MuiBreadcrumbs-root": { display: "none" },
            "& .platform-page-content .view-title": { display: "none" },
            "& .platform-page-content .view-header": { display: "none" },
          }}
        >
          {!hasLocalPageHeader && <PageHeader {...pageHeader} />}
          <Box
            className={hasLocalPageHeader ? undefined : "platform-page-content"}
            sx={fillsAvailableHeight ? {
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            } : undefined}
          >
          {children}
          </Box>
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
