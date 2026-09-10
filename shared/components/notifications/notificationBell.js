import { useState } from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const mockNotifications = [
  {
    id: 1,
    title: "Nueva negociación creada",
    message: "Se creó la negociación NEG-2026-0015.",
    date: "Hace 5 min",
    read: false,
  },
  {
    id: 2,
    title: "Factura pendiente de aprobación",
    message: "La factura FAC-2026-0042 requiere revisión.",
    date: "Hace 20 min",
    read: false,
  },
  {
    id: 3,
    title: "Operación aprobada",
    message: "La operación OP-2026-0081 fue aprobada.",
    date: "Ayer",
    read: true,
  },
];

export default function NotificationBell() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleNotificationClick = (notification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const goToNotifications = () => {
    handleClose();
    router.push("/notifications");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Notificaciones"
        sx={{
          mr: 1.5,
          color: "#4F4F4F",
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
        >
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            mt: 1,
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              Notificaciones
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {unreadCount} sin leer
            </Typography>
          </Box>

          {unreadCount > 0 && (
            <Typography
              component="button"
              onClick={markAllAsRead}
              sx={{
                border: 0,
                background: "none",
                cursor: "pointer",
                color: "#488B8F",
                fontSize: 13,
              }}
            >
              Marcar todas como leídas
            </Typography>
          )}
        </Box>

        <Divider />

        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() =>
              handleNotificationClick(notification)
            }
            sx={{
              alignItems: "flex-start",
              whiteSpace: "normal",
              py: 1.5,
              px: 2,
              backgroundColor: notification.read
                ? "transparent"
                : "rgba(72, 139, 143, 0.08)",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      mt: 0.7,
                      borderRadius: "50%",
                      backgroundColor: "#488B8F",
                      flexShrink: 0,
                    }}
                  />
                )}

                <Box>
                  <Typography
                    fontSize={14}
                    fontWeight={
                      notification.read ? 400 : 600
                    }
                  >
                    {notification.title}
                  </Typography>

                  <Typography
                    fontSize={13}
                    color="text.secondary"
                    sx={{ mt: 0.25 }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography
                    fontSize={11}
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {notification.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          onClick={goToNotifications}
          sx={{
            justifyContent: "center",
            color: "#488B8F",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Ver todas las notificaciones
        </MenuItem>
      </Menu>
    </>
  );
}