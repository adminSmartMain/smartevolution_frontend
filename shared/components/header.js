// components/header.js
import { useContext, useState } from "react";
import Image from "next/image";
import { AppBar, Avatar, Box, Toolbar, Menu, MenuItem } from "@mui/material";
import authContext from "@context/authContext";
import { useSidebar } from "@context/sideBarContext";

export default function Header({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout } = useContext(authContext);
  const { isSidebarExpanded } = useSidebar();

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
      sx={{
        backgroundColor: "#EBEBEB",
        borderBottom: "1.4px solid #5EA3A380",
        justifyContent: "center",
        transition: 'margin-left 0.2s ease, width 0.2s ease',
        marginLeft: { 
          xs: 0, 
          lg: isSidebarExpanded ? 0 : '80px'
        },
        width: { 
          xs: '100%', 
          lg: isSidebarExpanded ? '100%' : 'calc(100% - 80px)'
        },
        left: 0,
      }}
    >
      <Toolbar disableGutters>
        {/* Logo decorativo - OCULTAR EN MÓVIL */}
        <Box sx={{ 
          aspectRatio: "90/30",
          width: "max(90px + 2vw, 45px)",
          display: { xs: 'none', lg: 'block' }
        }}>
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