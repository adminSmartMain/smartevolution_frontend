import { useContext, useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import authContext from "@context/authContext";

const getNavSpacingSx = {
  backgroundColor: "#EBEBEB",
  transition: "all 0.3s ease-in-out",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  zIndex: 1300,
};

export default function Header({
  isSidebarExpanded,
  onToggleSidebar,
  onToggleMobile,
  user,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useContext(authContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (evt, reason) => {
    setAnchorEl(null);
    if (reason !== "backdropClick") {
      logout();
    }
  };

  const nameInitials = user?.name
    ? user.name
        .split(" ")
        .map((n, i) => (i > 1 || !n ? "" : n[0]?.toUpperCase()))
        .join("")
    : "US";

  return (
    <AppBar elevation={0} position="fixed" sx={getNavSpacingSx}>
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "72px !important",
          px: 0, // sin padding lateral
        }}
      >
        {/* IZQUIERDA: Logo + Hamburguesa */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Logo - SOLO EN DESKTOP */}
          <Box
            sx={{
              width: "130px",
              height: "40px",
              display: { xs: "none", lg: "flex" }, // ← OCULTO EN MÓVIL
              alignItems: "center",
              justifyContent: "flex-start",
              ml: { xs: 1, md: 2 },
            }}
          >
            <Image
              src="/assets/Logo Smart - Lite.svg"
              width={130}
              height={40}
              alt="Smart Evolution"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Botón hamburguesa - Desktop */}
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: "text.primary",
              display: { xs: "none", lg: "flex" },
              ml: 0,
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Botón hamburguesa - Mobile */}
          <IconButton
            onClick={onToggleMobile}
            sx={{
              color: "text.primary",
              display: { xs: "flex", lg: "none" },
              ml: { xs: 1, lg: 0 }, // ← Margen en móvil para separar del borde
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* DERECHA: Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            pr: { xs: 2, sm: 3, md: 4 },
          }}
        >
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
        </Box>

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