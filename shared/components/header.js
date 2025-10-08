// components/header.js
import { useContext, useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";

import authContext from "@context/authContext";

const getNavSpacingSx = (isSidebarExpanded) => ({
  backgroundColor: "#EBEBEB",
  borderBottom: "1.4px solid #5EA3A380",
  justifyContent: "center",
  transition: 'margin-left 0.3s ease, width 0.3s ease',
  marginLeft: { 
    xs: 0, 
    lg: isSidebarExpanded ? 0 : '80px' // ← Cambiado para que no se mueva
  },
  width: { 
    xs: '100%', 
    lg: isSidebarExpanded ? '100%' : 'calc(100% - 80px)' // ← Cambiado para que no se mueva
  },
  left: 0,
  "@media all and (display-mode: fullscreen)": {
    height: "10vh",
  },
  "@media only screen and (max-width: 1600px)": {
    "&": {
      padding: "0% max(2.5%, 32px)",
    },
  },
  "@media (min-width: 1024px)": {
    "&": {
      padding: "0% 5%",
    },
  },
});

const imageWrapperSx = {
  aspectRatio: "90/30",
  width: "max(90px + 2vw, 45px)",
  // Ocultar en dispositivos móviles y pantallas pequeñas
  display: {
    xs: "none", // Oculta en extra small (0px - 599px)
    sm: "none", // Oculta en small (600px - 899px) 
    md: "block", // Muestra en medium (900px - 1199px) y superiores
  },
};

export default function Header({ isSidebarExpanded, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useContext(authContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (evt, reason) => {
    setAnchorEl(null);
    if (reason !== 'backdropClick') {
      logout();
    }
  };

  const nameInitials = user?.name
    ? user.name
        .split(' ')
        .map((name, i) => {
          if (i > 1 || !name) return '';
          return name[0]?.toUpperCase();
        })
        .join('')
    : 'US';

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={getNavSpacingSx(isSidebarExpanded)}
    >
      <Toolbar disableGutters>
        {/* Logo decorativo - SIN FUNCIONALIDAD */}
        {/* Se ocultará en dispositivos móviles y pantallas pequeñas */}
        <Box sx={imageWrapperSx}>
          <Image
            layout="responsive"
            src="/assets/Logo Smart - Lite.svg"
            width={90}
            height={30}
            alt="Smart Evolution"
          />
        </Box>

        <Box flexGrow={1} />

        {/* Avatar del usuario */}
        <Avatar
          onClick={handleClick}
          sx={{ 
            backgroundColor: "#488B8F", 
            fontSize: 16, 
            cursor: "pointer",
            width: 40,
            height: 40,
          }}
        >
          {nameInitials}
        </Avatar>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem dense onClick={handleClose}>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}