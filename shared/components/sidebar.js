// components/sidebar.js
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Box, Collapse, Typography } from "@mui/material";
import {
  Home as HomeIcon,
  Attribution as AttributionIcon,
  AccountCircle as AccountCircleIcon,
  ReceiptLong as ReceiptLongIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  SupportAgent as SupportAgentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import React, { useMemo, useCallback, useState, useEffect } from "react";
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

  zIndex: 1200,
};

const headerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0px',
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
  backgroundColor: "white",
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
  flex: 1,
};

const subMenuSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 0.5,
  padding: '8px 0',
};

const subMenuItemSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: "70%",
  height: 40,
  padding: '0 16px',
  borderRadius: '4px',
 
  color: '#488B8F',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  fontSize: '0.8rem',
  marginLeft: '10%',
  '&:hover': {
    backgroundColor: '#E8F3F3',
  },
};

const activeSubMenuItemSx = {
  backgroundColor: '#E8F3F3',
  color: '#488B8F',
};

// ESTILOS PARA TÍTULOS DE SECCIÓN
const sectionTitleSx = {
  width: "80%",
  padding: '8px 16px',
  marginTop: '16px',
  marginBottom: '4px',
  color: '#666666',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const sectionTitleCollapsedSx = {
  display: 'none',
};

// OVERLAY PARA CERRAR SIDEBAR EN DESKTOP
const desktopOverlaySx = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1199,
  display: { xs: 'none', lg: 'block' ,md:'block'}, // SOLO en desktop
};

// COMPONENTE SUBMENÚ (solo para desktop)
const SubMenuItem = React.memo(({ item, isExpanded, isActive, onClick }) => {
  return (
    <Link href={item.href} passHref legacyBehavior>
      <Box
        component="a"
        sx={{
          ...subMenuItemSx,
          ...(isActive && activeSubMenuItemSx),
        }}
        onClick={onClick}
        title={item.text}
      >
        {isExpanded && <Box sx={{ fontSize: '0.8rem', marginLeft: 2 }}>{item.text}</Box>}
      </Box>
    </Link>
  );
});

SubMenuItem.displayName = 'SubMenuItem';


// COMPONENTE NAVITEM CON SUBMENÚ (solo para desktop)
const NavItemWithSubmenu = React.memo(({ path, isExpanded, isActive, openSubmenus, toggleSubmenu }) => {
  const { Icon, subItems } = path;
  const isSubmenuOpen = openSubmenus[path.href];

  const handleMainClick = useCallback((e) => {
    // Solo prevenir comportamiento por defecto si está expandido y tiene subitems
    if (isExpanded && subItems && subItems.length > 0) {
      e.preventDefault();
      toggleSubmenu(path.href);
    }
    // Si está contraído, dejar que el link navegue normalmente
  }, [isExpanded, subItems, path.href, toggleSubmenu]);

  const itemSx = useMemo(() => ({
    ...navItemSx,
    ...(isActive && activeNavItemSx),
    ...(!isExpanded && navItemCollapsedSx),
  }), [isActive, isExpanded]);

  const router = useRouter();

  // Determinar el href: si está expandido y tiene subitems usa '#', sino usa el path.href normal
  const href = (isExpanded && subItems && subItems.length > 0) ? '#' : path.href;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link href={href} passHref legacyBehavior>
        <Box
          component="a"
          sx={itemSx}
          onClick={handleMainClick}
          title={!isExpanded ? path.text : ''}
        >
          <Icon sx={iconSx} />
          {isExpanded && (
            <>
              <Box sx={textSx}>{path.text}</Box>
              {subItems && subItems.length > 0 && isExpanded && (
                isSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
              )}
            </>
          )}
        </Box>
      </Link>

      {subItems && subItems.length > 0 && isExpanded && (
        <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
          <Box sx={subMenuSx}>
            {subItems.map((subItem) => (
              <SubMenuItem
                key={subItem.href}
                item={subItem}
                isExpanded={isExpanded}
                isActive={router.pathname === subItem.href}
                onClick={() => {}}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
});

NavItemWithSubmenu.displayName = 'NavItemWithSubmenu';

// COMPONENTE NAVITEM SIMPLE (para móvil y desktop sin submenús)
const NavItem = React.memo(({ path, isExpanded, isActive, isMobile }) => {
  const { closeMobile } = useSidebar();
  const { Icon } = path;

  const handleClick = useCallback(() => {
    // Cerrar sidebar móvil al hacer click
    if (isMobile) {
      closeMobile();
    }
  }, [isMobile, closeMobile]);

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

// COMPONENTE TÍTULO DE SECCIÓN
const SectionTitle = React.memo(({ title, isExpanded }) => {
  const titleSx = useMemo(() => ({
    ...sectionTitleSx,
    ...(!isExpanded && sectionTitleCollapsedSx),
  }), [isExpanded]);

  return (
    <Box sx={titleSx}>
      <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
        {title}
      </Typography>
    </Box>
  );
});

SectionTitle.displayName = 'SectionTitle';

// RUTAS PRIMARIAS ORGANIZADAS POR SECCIONES
const primarySections = [
  {
    title: "Cuentas de clientes",
    paths: [
      { href: "/brochures", text: "Prospectos", Icon: AttributionIcon,
        subItems: [
          { href: "/brochures", text: "Jurídicos" },
          { href: "/brochures", text: "Naturales" }
        ]
      },
      { 
        href: "/customers/customerList", 
        text: "Clientes", 
        Icon: AccountCircleIcon,
        subItems: [
          { href: "/customers?register", text: "Agregar Cliente" },
          { href: "/customers/customerList", text: "Consulta" },
          { href: "/customers/accountList", text: "Gestión de cuentas", 
            subItems: [
            { href: "/customers/account?register", text: "Agregar Cuenta" }
          ]}
        ]
      },
    ]
  },
  {
    title: "Operaciones",
    paths: [
      { href: "/bills/billList", text: "Facturas", Icon: ReceiptLongIcon,
        subItems: [
          { href: "/bills/billList", text: "Consulta de Facturas" },
          { href: "/bills?=register", text: "Extraer Factura" },
          { href: "/bills/createBill", text: "Registrar Factura" }
        ]
      },
      { href: "/pre-operations", text: "Operaciones", Icon: AssignmentTurnedInIcon,
        subItems: [
          { href: "/pre-operations/manage", text: "Registrar Operación" },
          { href: "/pre-operations", text: "Operaciones por Aprobar" },
          { href: "/administration/negotiation-summary/summaryList", text: "Resumen de Negociación" },
          { href: "/operations/electronicSignature", text: "Notificaciones de Compra" },
          { href: "/operations", text: "Operaciones Aprobadas" },
          { href: "/administration/new-receipt/receiptList", text: "Consulta de Recaudos" }
        ]
      },
    ]
  }
];

// RUTA ÚNICA (Estadísticas)
const dashboardPath = { href: "/dashboard", text: "Estadisticas", Icon: HomeIcon };

// RUTAS SECUNDARIAS ORGANIZADAS POR SECCIONES
const secondarySections = [
  {
    title: "Otros",
    paths: [
      { href: "/brokers/brokerList", text: "Corredores", Icon: SupportAgentIcon,
        subItems: [
          { href: "/brokers?register", text: "Registrar Corredor" },
        ]
      },
      { href: "/administration", text: "Administración", Icon: AdminPanelSettingsIcon,
        subItems: [
          { href: "/administration/deposit-emitter/depositList", text: "Giro Emisor" },
          { href: "/administration/deposit-investor/depositList", text: "Giro Inversionista" },
          { href: "/administration/refund/refundList", text: "Reintegros" },
        ]
      },
    ]
  }
];

// COMPONENTE SIDEBAR PRINCIPAL
export default function Sidebar({ isMobile = false }) {
  const router = useRouter();
  const { isSidebarExpanded, toggleSidebar, closeMobile, isMobileOpen } = useSidebar();
  
  // Estado para controlar submenús abiertos (solo desktop)
  const [openSubmenus, setOpenSubmenus] = useState({});
  // Estado para trackear si fue una navegación
  const [isNavigating, setIsNavigating] = useState(false);

  // EN MÓVIL, SIEMPRE ESTÁ EXPANDIDO - EN DESKTOP DEPENDE DEL ESTADO
  const shouldBeExpanded = isMobile ? true : isSidebarExpanded;

  // TOGGLE SUBMENÚ - SOLO UNO ABIERTO A LA VEZ
  const toggleSubmenu = useCallback((pathHref) => {
    // Solo permite toggle si el sidebar está expandido
    if (shouldBeExpanded) {
      setOpenSubmenus(prev => {
        // Si el menú ya está abierto, lo cerramos
        if (prev[pathHref]) {
          return { [pathHref]: false };
        }
        // Si no está abierto, cerramos todos y abrimos solo este
        return { [pathHref]: true };
      });
    }
  }, [shouldBeExpanded]);

  // CERRAR TODOS LOS SUBMENÚS
  const closeAllSubmenus = useCallback(() => {
    setOpenSubmenus({});
  }, []);

  // CERRAR SIDEBAR DESKTOP AL HACER CLICK FUERA
  const handleDesktopOverlayClick = useCallback(() => {
    if (!isMobile && isSidebarExpanded) {
      toggleSidebar();
    }
  }, [isMobile, isSidebarExpanded, toggleSidebar]);

  // EFECTO PARA DETECTAR CAMBIOS DE RUTA
  useEffect(() => {
    const handleRouteChange = () => {
      // Cerrar todos los submenús cuando cambia la ruta
      closeAllSubmenus();
      
      // Cerrar sidebar (en ambos dispositivos)
      if (isMobile) {
        // En móvil: cerrar el drawer
        closeMobile();
      } else {
        // En desktop: contraer el sidebar
        if (isSidebarExpanded) {
          toggleSidebar();
        }
      }
    };

    // Escuchar cambios de ruta
    router.events.on('routeChangeComplete', handleRouteChange);

    // Limpiar el event listener
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, isMobile, isSidebarExpanded, toggleSidebar, closeMobile, closeAllSubmenus]);

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

  // HANDLER OPTIMIZADO - SIN EFECTO DE CIERRE AUTOMÁTICO
  const handleLogoClick = useCallback(() => {
    if (isMobile) {
      closeMobile();
    } else {
      toggleSidebar();
    }
  }, [isMobile, closeMobile, toggleSidebar]);

  // MEMOIZAR RUTAS ACTIVAS
  const isPathActive = useCallback((pathHref) => {
    if (pathHref === "/customers/customerList") {
      return router.pathname.includes("/customers");
    }
    return router.pathname.includes(pathHref);
  }, [router.pathname]);

  // RENDERIZADO CONDICIONAL DE RUTAS
  const renderNavItem = useCallback((path) => {
    // PARA TODOS LOS DISPOSITIVOS, usar con submenús si los tiene
    if (path.subItems && path.subItems.length > 0)  {
      return (
        <NavItemWithSubmenu 
          key={`primary-${path.href}`}
          path={path}
          isExpanded={shouldBeExpanded}
          isActive={isPathActive(path.href)}
          openSubmenus={openSubmenus}
          toggleSubmenu={toggleSubmenu}
        />
      );
    } else {
      // Sin subitems, usar componente simple
      return (
        <NavItem 
          key={`primary-${path.href}`}
          path={path}
          isExpanded={shouldBeExpanded}
          isActive={isPathActive(path.href)}
          isMobile={isMobile}
        />
      );
    }
  }, [shouldBeExpanded, isPathActive, openSubmenus, toggleSubmenu, isMobile]);

  // MEMOIZAR RENDERIZADO DE SECCIONES PRIMARIAS
  const renderedPrimarySections = useMemo(() => 
    primarySections.map((section, index) => (
      <Box key={`primary-section-${index}`} sx={{ width: '100%' }}>
        <SectionTitle title={section.title} isExpanded={shouldBeExpanded} />
        {section.paths.map(renderNavItem)}
      </Box>
    )),
    [shouldBeExpanded, renderNavItem]
  );

  // MEMOIZAR RENDERIZADO DE SECCIONES SECUNDARIAS
  const renderedSecondarySections = useMemo(() => 
    secondarySections.map((section, index) => (
      <Box key={`secondary-section-${index}`} sx={{ width: '100%' }}>
        <SectionTitle title={section.title} isExpanded={shouldBeExpanded} />
        {section.paths.map(renderNavItem)}
      </Box>
    )),
    [shouldBeExpanded, renderNavItem]
  );

  // RENDERIZAR DASHBOARD (único item sin sección)
  const renderedDashboard = useMemo(() => 
    renderNavItem(dashboardPath),
    [renderNavItem]
  );

  return (
    <>
      {/* Overlay para cerrar sidebar en desktop cuando está expandido */}
      {!isMobile && isSidebarExpanded && (
        <Box sx={desktopOverlaySx} onClick={handleDesktopOverlayClick} />
      )}

      <Box sx={currentContainerSx}>
        {/* Header del sidebar - MANTENIENDO VERSIÓN MÓVIL INTACTA */}
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
              {/* VERSIÓN MÓVIL INTACTA - SIN CAMBIOS */}
            </Box>
          )}
        </Box>

        {/* Rutas principales */}
        <Box sx={primaryPathsContainerSx}>
          {renderedDashboard}
          {renderedPrimarySections}
        </Box>

        {/* Rutas secundarias */}
        <Box sx={secondaryPathsContainerSx}>
          {renderedSecondarySections}
        </Box>
      </Box>
    </>
  );
}