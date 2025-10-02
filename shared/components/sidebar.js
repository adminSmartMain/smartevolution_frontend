// components/sidebar.js
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import {
  Home as HomeIcon,
  Attribution as AttributionIcon,
  AccountCircle as AccountCircleIcon,
  ReceiptLong as ReceiptLongIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  SupportAgent as SupportAgentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";
import React, { useMemo, useCallback } from "react";
import { useSidebar } from "@context/sideBarContext";

// ESTILOS FIJOS - NO CAMBIAN
const containerSx = {
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  transition: 'width 0.2s ease',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  overflow: 'hidden',
  borderRight: "2px solid #B5D1C9",
  zIndex: 1200,
};

const headerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  borderBottom: "2px solid #B5D1C9",
  backgroundColor: '#FFFFFF',
  flexShrink: 0,
  height: '72px',
};

const logoContainerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

const primaryPathsContainerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 1,
  flex: 1,
  borderBottom: "2px solid #B5D1C9",
  overflowY: "auto",
  padding: '14px 0',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#B5D1C9',
    borderRadius: '2px',
  },
};

const secondaryPathsContainerSx = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FAFAFA",
  justifyContent: "center",
  alignItems: "center",
  gap: 1,
  padding: '16px 0',
  flexShrink: 0,
};

const navItemSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: "80%",
  height: 48,
  padding: '0 16px',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
  color: '#488B8F',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: '#E8F3F3',
  },
};

const activeNavItemSx = {
  backgroundColor: '#E8F3F3',
  color: '#488B8F',
};

const navItemCollapsedSx = {
  width: 48,
  height: 48,
  padding: '0',
  justifyContent: 'center',
  minWidth: 48,
};

const iconSx = {
  color: 'inherit',
  fontSize: 24,
  flexShrink: 0,
};

const textSx = {
  marginLeft: 2,
  fontSize: '0.875rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'inherit',
};

// USAR COMPONENTES EN LUGAR DE ELEMENTOS JSX
const primaryPaths = [
  { href: "/dashboard", text: "Inicio", Icon: HomeIcon },
  { href: "/brochures", text: "Prospecto", Icon: AttributionIcon },
  { href: "/customers/customerList", text: "Clientes", Icon: AccountCircleIcon },
  { href: "/bills/billList", text: "Facturas", Icon: ReceiptLongIcon },
  { href: "/pre-operations", text: "Pre-operaciones", Icon: AssignmentIcon },
  { href: "/operations", text: "Operaciones", Icon: AssignmentTurnedInIcon },
  { href: "/brokers/brokerList", text: "Corredores", Icon: SupportAgentIcon },
];

const secondaryPaths = [
  { href: "/administration", text: "Administración", Icon: AdminPanelSettingsIcon },
];

// NAVITEM OPTIMIZADO
const NavItem = React.memo(({ path, isExpanded, isActive }) => {
  const { closeMobile } = useSidebar();
  const { Icon } = path;

  const handleClick = useCallback(() => {
    // Cerrar sidebar móvil al hacer click
    if (window.innerWidth < 1024) {
      closeMobile();
    }
  }, [closeMobile]);

  const itemSx = useMemo(() => ({
    ...navItemSx,
    ...(isActive && activeNavItemSx),
    ...(!isExpanded && navItemCollapsedSx),
  }), [isActive, isExpanded]);

  return (
    <Link href={path.href} passHref legacyBehavior>
      <Box
        component="a"
        sx={itemSx}
        onClick={handleClick}
        title={!isExpanded ? path.text : ''}
      >
        <Icon sx={iconSx} />
        {isExpanded && <Box sx={textSx}>{path.text}</Box>}
      </Box>
    </Link>
  );
});

NavItem.displayName = 'NavItem';

// COMPONENTE SIDEBAR PRINCIPAL
export default function Sidebar({ isMobile = false }) {
  const router = useRouter();
  const { isSidebarExpanded, toggleSidebar, closeMobile } = useSidebar();

  // EN MÓVIL, SIEMPRE ESTÁ EXPANDIDO - EN DESKTOP DEPENDE DEL ESTADO
  const shouldBeExpanded = isMobile ? true : isSidebarExpanded;

  // MEMOIZAR ESTILOS DEL CONTENEDOR
  const currentContainerSx = useMemo(() => ({
    ...containerSx,
    // En móvil: ancho fijo de 280px (igual que el Drawer)
    // En desktop: depende del estado expandido/contraído
    width: isMobile ? 280 : (shouldBeExpanded ? 310 : 80),
  }), [shouldBeExpanded, isMobile]);

  // MEMOIZAR ESTILOS DEL LOGO
  const currentLogoSx = useMemo(() => ({
    ...logoContainerSx,
    // En móvil: logo expandido (120px)
    // En desktop: depende del estado
    width: isMobile ? 120 : (shouldBeExpanded ? 120 : 40),
  }), [shouldBeExpanded, isMobile]);

  // HANDLER OPTIMIZADO
  const handleLogoClick = useCallback(() => {
    if (isMobile) {
      closeMobile();
    } else {
      toggleSidebar();
    }
  }, [isMobile, closeMobile, toggleSidebar]);

  // MEMOIZAR RUTAS ACTIVAS
  const isPathActive = useCallback((pathHref) => {
    return router.pathname.includes(pathHref);
  }, [router.pathname]);

  // MEMOIZAR RENDERIZADO DE RUTAS
  const renderedPrimaryPaths = useMemo(() => 
    primaryPaths.map((path) => (
      <NavItem 
        key={`primary-${path.href}`}
        path={path}
        isExpanded={shouldBeExpanded} // Usar shouldBeExpanded en lugar de isSidebarExpanded
        isActive={isPathActive(path.href)}
      />
    )), [shouldBeExpanded, isPathActive]
  );

  const renderedSecondaryPaths = useMemo(() => 
    secondaryPaths.map((path) => (
      <NavItem 
        key={`secondary-${path.href}`}
        path={path}
        isExpanded={shouldBeExpanded} // Usar shouldBeExpanded en lugar de isSidebarExpanded
        isActive={isPathActive(path.href)}
      />
    )), [shouldBeExpanded, isPathActive]
  );

  return (
    <Box sx={currentContainerSx}>
      {/* Header del sidebar */}
      <Box sx={headerSx}>
        {!isMobile ? (
          <Box 
            sx={currentLogoSx}
            onClick={handleLogoClick}
            title={shouldBeExpanded ? "Contraer menú" : "Expandir menú"}
          >
            <Image
              src={shouldBeExpanded ? "/assets/Logo Smart - Lite.svg" : "/assets/Icono Smart.svg"}
              width={shouldBeExpanded ? 120 : 40}
              height={40}
              alt="Smart Evolution"
              priority
              style={{
                objectFit: 'contain',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '16px'
            }}
          >
    
          </Box>
        )}
      </Box>

      {/* Rutas principales */}
      <Box sx={primaryPathsContainerSx}>
        {renderedPrimaryPaths}
      </Box>

      {/* Rutas secundarias */}
      <Box sx={secondaryPathsContainerSx}>
        {renderedSecondaryPaths}
      </Box>
    </Box>
  );
}