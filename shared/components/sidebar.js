// components/sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Collapse, Paper } from "@mui/material";
import ReactDOM from "react-dom";
import {
  Home as HomeIcon,
  Attribution as AttributionIcon,
  AccountCircle as AccountCircleIcon,
  ReceiptLong as ReceiptLongIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  SupportAgent as SupportAgentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import React, { useCallback, useState, useEffect } from "react";

// ================== HOOK PERSONALIZADO PARA VENTANAS ==================
const useWindowManager = () => {
  const [openWindow, setOpenWindow] = useState(null);

  const handleOpenWindow = (url, windowFeatures = "width=1000,height=700,left=100,top=100") => {
    if (openWindow && !openWindow.closed) {
      openWindow.focus();
      return openWindow;
    } else {
      const newWindow = window.open(url, "_blank", windowFeatures);
      setOpenWindow(newWindow);
      
      if (newWindow) {
        newWindow.onbeforeunload = () => {
          setOpenWindow(null);
        };
      }
      
      return newWindow;
    }
  };

  return { handleOpenWindow, openWindow };
};

// ================== ESTILOS ==================
const containerSx = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#EBEBEB",
  position: "fixed",
  top: "72px",
  left: 0,
  bottom: 0,
  zIndex: 1200,
  borderRight: "1px solid #ddd",
  width: 280,
  transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  willChange: "width",
  transform: "translateZ(0)",
  overflow: "visible",
};

const primaryPathsContainerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 1,
  flex: 1,
  overflowY: "auto",
  padding: "14px 0",
  width: "100%",
};

const secondaryPathsContainerSx = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#EBEBEB",
  justifyContent: "center",
  alignItems: "center",
  gap: 1,
  padding: "16px 0",
  width: "100%",
};

const navItemSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "80%",
  height: 48,
  padding: "0 16px",
  borderRadius: "4px",
  backgroundColor: "#EBEBEB",
  color: "#488B8F",
  textDecoration: "none",
  cursor: "pointer",
  flexShrink: 0,
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  willChange: "width, padding",
  "&:hover": {
    backgroundColor: "#E8F3F3",
  },
};

const activeNavItemSx = {
  backgroundColor: "#E8F3F3",
  color: "#488B8F",
};

const navItemCollapsedSx = {
  width: 48,
  padding: "0 12px",
  justifyContent: "center",
};

const iconSx = {
  color: "inherit",
  fontSize: 24,
  flexShrink: 0,
  minWidth: 24,
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const textSx = {
  marginLeft: 2,
  fontSize: "0.875rem",
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "inherit",
  flex: 1,
  opacity: 1,
  transform: "translateX(0)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  willChange: "opacity, transform, margin-left, width",
};

const textCollapsedSx = {
  opacity: 0,
  transform: "translateX(-10px)",
  marginLeft: 0,
  width: 0,
  flex: 0,
  position: "absolute",
  left: -1000,
};

const subMenuItemSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  height: 40,
  padding: "0 70px",
  borderRadius: "4px",
  color: "#488B8F",
  textDecoration: "none",
  cursor: "pointer",
  fontSize: "0.8rem",
  "&:hover": {
    backgroundColor: "#E8F3F3",
  },
};

// ================== COMPONENTES ==================

// 🔥 COMPONENTE SUBITEM MEJORADO CON FUNCIONALIDAD DE VENTANAS
const SubMenuItem = ({ subItem, onItemClick, isExpanded }) => {
  const { handleOpenWindow } = useWindowManager();
  const router = useRouter();

  const handleClick = (e) => {
    if (subItem.openInWindow) {
      e.preventDefault();
      e.stopPropagation();
      
      handleOpenWindow(subItem.href, subItem.windowFeatures);
      
      if (onItemClick) {
        onItemClick();
      }
    } else {
      onItemClick?.();
    }
  };

  const isActive = router.pathname === subItem.href;

  if (!isExpanded) {
    return (
      <Link href={subItem.href} passHref legacyBehavior>
        <Box 
          component="a" 
          sx={{ 
            ...subMenuItemSx, 
            width: 180,
            ...(isActive && {
              backgroundColor: "#E8F3F3",
            })
          }}
          onClick={handleClick}
          target={subItem.openInWindow ? "_blank" : "_self"}
        >
          {subItem.text}
        </Box>
      </Link>
    );
  }

  return (
    <Link href={subItem.href} passHref legacyBehavior>
      <Box
        component="a"
        sx={{
          ...subMenuItemSx,
          ...(isActive && {
            backgroundColor: "#E8F3F3",
          }),
        }}
        onClick={handleClick}
        target={subItem.openInWindow ? "_blank" : "_self"}
      >
        {subItem.text}
      </Box>
    </Link>
  );
};

// 🔥 COMPONENTE HOVER SUBMENU MEJORADO
const HoverSubMenu = ({ subItems, anchor, visible, onClose, onItemClick }) => {
  if (!visible || typeof window === "undefined") return null;

  const content = (
    <Paper
      onMouseLeave={onClose}
      sx={{
        position: "fixed",
        top: anchor.top,
        left: anchor.left,
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 14px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        padding: "8px 0",
        zIndex: 3000,
        animation: "fadeIn 0.15s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateX(-5px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      {subItems.map((item) => (
        <SubMenuItem
          key={item.href}
          subItem={item}
          onItemClick={onItemClick}
          isExpanded={false}
        />
      ))}
    </Paper>
  );

  return ReactDOM.createPortal(content, document.body);
};

const NavItemWithSubmenu = ({
  path,
  isExpanded,
  isActive,
  openSubmenus,
  toggleSubmenu,
  onItemClick,
}) => {
  const { Icon, subItems } = path;
  const isSubmenuOpen = openSubmenus[path.href];
  const router = useRouter();

  const [hoverVisible, setHoverVisible] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    if (!isExpanded && subItems?.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setAnchor({
        top: rect.top,
        left: rect.right + 4,
      });
      setHoverVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded) setHoverVisible(false);
  };

  const handleMainClick = (e) => {
    if (isExpanded && subItems?.length > 0) {
      e.preventDefault();
      toggleSubmenu(path.href);
    }
    if (!isExpanded) onItemClick?.();
  };

  const href = isExpanded && subItems?.length > 0 ? "#" : path.href;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={href} passHref legacyBehavior>
          <Box
            component="a"
            sx={{
              ...navItemSx,
              ...(isActive && activeNavItemSx),
              ...(!isExpanded && navItemCollapsedSx),
            }}
            onClick={handleMainClick}
            title={!isExpanded ? path.text : ""}
          >
            <Icon sx={iconSx} />
            <Box sx={isExpanded ? textSx : textCollapsedSx}>{path.text}</Box>
            {subItems?.length > 0 && isExpanded && (
              isSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
            )}
          </Box>
        </Link>

        {/* Submenú colapsado (hover) */}
        {!isExpanded && subItems?.length > 0 && (
          <HoverSubMenu
            subItems={subItems}
            anchor={anchor}
            visible={hoverVisible}
            onClose={() => setHoverVisible(false)}
            onItemClick={onItemClick}
          />
        )}

        {/* Submenú expandido */}
        {subItems?.length > 0 && isExpanded && (
          <Collapse
            in={isSubmenuOpen}
            timeout={250}
            unmountOnExit
            sx={{ width: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, padding: "8px 0" }}>
              {subItems.map((subItem) => (
                <SubMenuItem
                  key={subItem.href}
                  subItem={subItem}
                  onItemClick={onItemClick}
                  isExpanded={isExpanded}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    </>
  );
};

// ================== OTROS COMPONENTES ==================

const NavItem = ({ path, isExpanded, isActive, onItemClick }) => {
  const { Icon } = path;

  return (
    <Link href={path.href} passHref legacyBehavior>
      <Box
        component="a"
        sx={{
          ...navItemSx,
          ...(isActive && activeNavItemSx),
          ...(!isExpanded && navItemCollapsedSx),
        }}
        onClick={onItemClick}
        title={!isExpanded ? path.text : ""}
      >
        <Icon sx={iconSx} />
        <Box sx={isExpanded ? textSx : textCollapsedSx}>{path.text}</Box>
      </Box>
    </Link>
  );
};

const SectionTitle = ({ title, isExpanded }) => (
  <Box
    sx={{
      ...(isExpanded
        ? {
            width: "80%",
            padding: "8px 16px",
            marginTop: "16px",
            marginBottom: "4px",
            color: "#666",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
          }
        : {
            opacity: 0,
            height: 0,
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }),
    }}
  >
    {title}
  </Box>
);

// ================== DATOS DE RUTAS ACTUALIZADOS ==================
const PRIMARY_SECTIONS = [
  {
    title: "Cuentas de clientes",
    paths: [
      { 
        href: "/brochures", 
        text: "Prospectos", 
        Icon: AttributionIcon,
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
          { 
            href: "/customers?register", 
            text: "Agregar Cliente", 
            openInWindow: true,
            windowFeatures: "width=900,height=800"
          },
          { href: "/customers/customerList", text: "Consulta" },
          { href: "/customers/accountList", text: "Gestión de cuentas" }
        ]
      },
    ]
  },
  {
    title: "Operaciones",
    paths: [
      { 
        href: "/bills/billList", 
        text: "Facturas", 
        Icon: ReceiptLongIcon,
        subItems: [
          { href: "/bills/billList", text: "Consulta de Facturas" },
          { 
            href: "/bills?=register", 
            text: "Extraer Factura", 
            openInWindow: true,
            windowFeatures: "width=800,height=600"
          },
          { 
            href: "/bills/createBill", 
            text: "Registrar Factura", 
            openInWindow: true,
            windowFeatures: "width=1000,height=700"
          }
        ]
      },
      { 
        href: "/pre-operations", 
        text: "Operaciones", 
        Icon: AssignmentTurnedInIcon,
        subItems: [
          { 
            href: "/pre-operations/manage", 
            text: "Registrar Operación", 
            openInWindow: true,
            windowFeatures: "width=1200,height=800"
          },
          { href: "/pre-operations", text: "Operaciones por Aprobar" },
          { href: "/administration/negotiation-summary/summaryList", text: "Resumen de Negociación" },
          { 
            href: "/operations/electronicSignature", 
            text: "Notificaciones de Compra", 
            openInWindow: true,
            windowFeatures: "width=900,height=700"
          },
          { href: "/operations", text: "Operaciones Aprobadas" },
          { href: "/administration/new-receipt/receiptList", text: "Consulta de Recaudos" }
        ]
      },
    ]
  }
];

const DASHBOARD_PATH = { href: "/dashboard", text: "Estadisticas", Icon: HomeIcon };

const SECONDARY_SECTIONS = [
  {
    title: "Otros",
    paths: [
      { 
        href: "/brokers/brokerList", 
        text: "Corredores", 
        Icon: SupportAgentIcon,
        subItems: [
          { 
            href: "/brokers?register", 
            text: "Registrar Corredor", 
            openInWindow: true,
            windowFeatures: "width=850,height=650"
          },
        ]
      },
      { 
        href: "/administration", 
        text: "Administración", 
        Icon: AdminPanelSettingsIcon,
        subItems: [
          { href: "/administration/deposit-emitter/depositList", text: "Giro Emisor" },
          { href: "/administration/deposit-investor/depositList", text: "Giro Inversionista" },
          { href: "/administration/refund/refundList", text: "Reintegros" },
        ]
      },
    ]
  }
];

// ================== COMPONENTE SIDEBAR PRINCIPAL ==================
export default function Sidebar({ isExpanded, onClick, isMobile = false }) {
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = useCallback(
    (pathHref) => {
      if (!isExpanded) return;
      setOpenSubmenus((prev) => ({ [pathHref]: !prev[pathHref] }));
    },
    [isExpanded]
  );

  const handleItemClick = useCallback(() => {
    isMobile && onClick?.();
  }, [isMobile, onClick]);

  useEffect(() => {
    setOpenSubmenus({});
  }, [router.pathname]);

  const isPathActive = useCallback(
    (pathHref) => {
      const currentPath = router.pathname;
      return currentPath === pathHref || currentPath.startsWith(pathHref + "/");
    },
    [router.pathname]
  );

  const renderNavItem = (path) => {
    const isActive = isPathActive(path.href);
    if (path.subItems?.length > 0) {
      return (
        <NavItemWithSubmenu
          key={path.href}
          path={path}
          isExpanded={isExpanded}
          isActive={isActive}
          openSubmenus={openSubmenus}
          toggleSubmenu={toggleSubmenu}
          onItemClick={handleItemClick}
        />
      );
    }
    return (
      <NavItem
        key={path.href}
        path={path}
        isExpanded={isExpanded}
        isActive={isActive}
        onItemClick={handleItemClick}
      />
    );
  };

  return (
    <Box sx={{ ...containerSx, width: isExpanded ? 280 : 80 }}>
      <Box sx={primaryPathsContainerSx}>
        {renderNavItem(DASHBOARD_PATH)}
        {PRIMARY_SECTIONS.map((section) => (
          <Box key={section.title} sx={{ width: "100%" }}>
            <SectionTitle title={section.title} isExpanded={isExpanded} />
            {section.paths.map(renderNavItem)}
          </Box>
        ))}
      </Box>
      <Box sx={secondaryPathsContainerSx}>
        {SECONDARY_SECTIONS.map((section) => (
          <Box key={section.title} sx={{ width: "100%" }}>
            <SectionTitle title={section.title} isExpanded={isExpanded} />
            {section.paths.map(renderNavItem)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}