import { useContext, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import HeaderButton from "@styles/buttons/button_2";

import Navbar from "./sidebar";

import authContext from "@context/authContext";

const navSpacingSx = {
  backgroundColor: "#EBEBEB",
  borderBottom: "1.4px solid #5EA3A380",
  p: "0% 5%",

  justifyContent: "center",

  "@media all and (display-mode: fullscreen)": {
    height: "10vh",
  },

  "@media only screen and (max-width: 1600px)": {
    "&": {
      p: "0% max(2.5%, 32px)",
    },
  },
};

const iconWrapperSx = {
  width: 24,
  height: 24,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  color: "#488B8F",
  fontSize: 19,
};

const imageWrapperSx = {
  aspectRatio: "90/30",
  width: "max(90px + 2vw, 45px)",
};

const HomeIcon = (props) => {
  const { sx, ...rest } = props;

  return <Typography sx={{ ...sx }}></Typography>;
};

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user, logout } = useContext(authContext);

  const downScale = useMediaQuery("(max-width: 1600px)");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
  };

  const handleClose = (evt, any) => {
    setAnchorEl(null);
    if (!any) logout();
  };

  const nameInitials = useMemo(
    () =>
      (user &&
        user.name
          .split(" ")
          .map((name, i) => {
            if (i > 1 || !name) return;
            return name[0].toUpperCase();
          })
          .join("")) ||
      "XD",
    [user.name]
  );

  return (
    <>
      <AppBar
        elevation={0}
        position="relative" // static, fixed, absolute, sticky, relative
        sx={{ ...navSpacingSx }}
      >
        <Toolbar disableGutters>
          <>
            {downScale && (
              <IconButton sx={{ mr: 1 }} onClick={handleOpenDrawer}>
                <Box sx={{ ...iconWrapperSx }}>
                  <i className="fas fa-bars" />
                </Box>
              </IconButton>
            )}

            <Link href="/dashboard" passHref>
              <a>
                <Box sx={imageWrapperSx}>
                  <Image
                    layout="responsive"
                    src="/assets/Logo Smart - Lite.svg"
                    width={90}
                    height={30}
                    alt=""
                  />
                </Box>
              </a>
            </Link>
          </>

          <Box flexGrow={1} />

          <Avatar
            id="menu-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ backgroundColor: "#488B8F", fontSize: 16, cursor: "pointer" }}
          >
            {nameInitials}
          </Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "menu-button",
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem dense onClick={handleClose}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 300, height: "100vh" }}>
          <Navbar
            onClick={() => {
              setDrawerOpen(false);
            }}
          />
        </Box>
      </Drawer>
    </>
  );
}

import { useContext, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import HeaderButton from "@styles/buttons/button_2";

import Navbar from "./sidebar";

import authContext from "@context/authContext";

const navSpacingSx = {
  backgroundColor: "#EBEBEB",
  borderBottom: "1.4px solid #5EA3A380",
  p: "0% 5%",

  justifyContent: "center",

  "@media all and (display-mode: fullscreen)": {
    height: "10vh",
  },

  "@media only screen and (max-width: 1600px)": {
    "&": {
      p: "0% max(2.5%, 32px)",
    },
  },
};

const iconWrapperSx = {
  width: 24,
  height: 24,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  color: "#488B8F",
  fontSize: 19,
};

const imageWrapperSx = {
  aspectRatio: "90/30",
  width: "max(90px + 2vw, 45px)",
};

const HomeIcon = (props) => {
  const { sx, ...rest } = props;

  return <Typography sx={{ ...sx }}></Typography>;
};

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user, logout } = useContext(authContext);

  const downScale = useMediaQuery("(max-width: 1600px)");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
  };

  const handleClose = (evt, any) => {
    setAnchorEl(null);
    if (!any) logout();
  };

  const nameInitials = useMemo(
    () =>
      (user &&
        user.name
          .split(" ")
          .map((name, i) => {
            if (i > 1 || !name) return;
            return name[0].toUpperCase();
          })
          .join("")) ||
      "XD",
    [user.name]
  );

  return (
    <>
      <AppBar
        elevation={0}
        position="relative" // static, fixed, absolute, sticky, relative
        sx={{ ...navSpacingSx }}
      >
        <Toolbar disableGutters>
          <>
            {downScale && (
              <IconButton sx={{ mr: 1 }} onClick={handleOpenDrawer}>
                <Box sx={{ ...iconWrapperSx }}>
                  <i className="fas fa-bars" />
                </Box>
              </IconButton>
            )}

            <Link href="/dashboard" passHref>
              <Box sx={imageWrapperSx}>
                <Image
                  layout="responsive"
                  src="/assets/Logo Smart - Lite.svg"
                  width={90}
                  height={30}
                  alt=""
                />
              </Box>
            </Link>
          </>

          <Box flexGrow={1} />

          <Avatar
            id="menu-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ backgroundColor: "#488B8F", fontSize: 16, cursor: "pointer" }}
          >
            {nameInitials}
          </Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "menu-button",
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem dense onClick={handleClose}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 300, height: "100vh" }}>
          <Navbar
            onClick={() => {
              setDrawerOpen(false);
            }}
          />
        </Box>
      </Drawer>
    </>
  );
}
