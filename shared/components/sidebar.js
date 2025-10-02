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

const containerSx = {
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFF",
  transition: 'width 0.3s ease',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  overflow: 'hidden',
  borderRight: "2px solid #B5D1C9",
  zIndex: 1200,
};

const expandedContainerSx = {
  width: 310,
};

const collapsedContainerSx = {
  width: 80,
};

const headerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  borderBottom: "2px solid #B5D1C9",
  backgroundColor: '#FFFFFF',
  flexShrink: 0,
  height: '72px', // Misma altura que el header
};

const logoContainerSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const logoExpandedSx = {
  width: 120,
  opacity: 1,
};

const logoCollapsedSx = {
  width: 40,
  opacity: 1,
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
  transition: 'all 0.2s ease',
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

const primaryPaths = [
  {
    href: "/dashboard",
    text: "Inicio",
    icon: <HomeIcon sx={iconSx} />,
  },
  {
    href: "/brochures",
    text: "Prospecto",
    icon: <AttributionIcon sx={iconSx} />,
  },
  {
    href: "/customers/customerList",
    text: "Clientes",
    icon: <AccountCircleIcon sx={iconSx} />,
  },
  {
    href: "/bills/billList",
    text: "Facturas",
    icon: <ReceiptLongIcon sx={iconSx} />,
  },
  {
    href: "/pre-operations",
    text: "Pre-operaciones",
    icon: <AssignmentIcon sx={iconSx} />,
  },
  {
    href: "/operations",
    text: "Operaciones",
    icon: <AssignmentTurnedInIcon sx={iconSx} />,
  },
  {
    href: "/brokers/brokerList",
    text: "Corredores",
    icon: <SupportAgentIcon sx={iconSx} />,
  },
];

const secondaryPaths = [
  {
    href: "/administration",
    text: "Administración",
    icon: <AdminPanelSettingsIcon sx={iconSx} />,
  },
];

const NavItem = ({ path, isExpanded, isActive, onClick }) => {
  const itemSx = {
    ...navItemSx,
    ...(isActive && activeNavItemSx),
    ...(!isExpanded && navItemCollapsedSx),
  };

  return (
    <Link href={path.href} passHref>
      <Box
        component="a"
        sx={itemSx}
        onClick={onClick}
        title={!isExpanded ? path.text : ''}
      >
        {path.icon}
        {isExpanded && (
          <Box sx={textSx}>
            {path.text}
          </Box>
        )}
      </Box>
    </Link>
  );
};

// components/sidebar.js - Modifica esta parte
export default function Sidebar(props) {
  const { onClick, isExpanded = true, onToggle, isMobile = false } = props;
  const router = useRouter();

  const currentContainerSx = {
    ...containerSx,
    ...(isExpanded ? expandedContainerSx : collapsedContainerSx),
  };

  const currentLogoSx = {
    ...logoContainerSx,
    ...(isExpanded ? logoExpandedSx : logoCollapsedSx),
  };

  const handleLogoClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <Box sx={currentContainerSx}>
      {/* Header del sidebar - MANTENER EL ESPACIO PERO SIN CONTENIDO EN MÓVIL */}
      <Box sx={headerSx}>
        {!isMobile ? ( // ← Mostrar logo solo en desktop
          <Box 
            sx={currentLogoSx}
            onClick={handleLogoClick}
            title={isExpanded ? "Contraer menú" : "Expandir menú"}
          >
            <Image
              src={isExpanded ? "/assets/Logo Smart - Lite.svg" : "/assets/Icono Smart.svg"}
              width={isExpanded ? 120 : 40}
              height={isExpanded ? 40 : 40}
              alt="Smart Evolution"
              style={{
                objectFit: 'contain',
                transition: 'all 0.3s ease',
              }}
            />
          </Box>
        ) : (
          // ← En móvil, mantener el espacio pero vacío o con un botón de cerrar
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
            {/* Opcional: puedes agregar un botón de cerrar aquí si quieres */}
          </Box>
        )}
      </Box>

      {/* Rutas principales */}
      <Box sx={primaryPathsContainerSx}>
        {primaryPaths.map((path, i) => (
          <NavItem 
            key={`button-nav-${i}`}
            path={path}
            isExpanded={isExpanded}
            isActive={router.pathname.includes(path.href)}
            onClick={onClick}
          />
        ))}
      </Box>

      {/* Rutas secundarias */}
      <Box sx={secondaryPathsContainerSx}>
        {secondaryPaths.map((path, i) => (
          <NavItem 
            key={`sec-button-nav-${i}`}
            path={path}
            isExpanded={isExpanded}
            isActive={router.pathname.includes(path.href)}
            onClick={onClick}
          />
        ))}
      </Box>
    </Box>
  );
}