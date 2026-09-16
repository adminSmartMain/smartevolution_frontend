import { useCallback, useEffect, useState } from "react";
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

import {
  createNotificationsSocket,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notifyNotificationsChanged,
} from "@views/notifications/queries";

const formatNotificationDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationBell() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications({
        page: 1,
        pageSize: 20,
      });

      setNotifications(data.results || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error(
        "No fue posible cargar la campana de notificaciones",
        error
      );
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const stopSocket = createNotificationsSocket({
      onNotification: (notification) => {
        setNotifications((current) => [
          notification,
          ...current.filter(
            (item) => item.id !== notification.id
          ),
        ].slice(0, 20));

        setUnreadCount((current) => current + 1);
      },
      onReconnect: loadNotifications,
    });

    const handleExternalChange = () => {
      loadNotifications();
    };

    window.addEventListener(
      "notifications:changed",
      handleExternalChange
    );

    return () => {
      stopSocket();
      window.removeEventListener(
        "notifications:changed",
        handleExternalChange
      );
    };
  }, [loadNotifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
      notifyNotificationsChanged();
    } catch (error) {
      console.error(
        "No fue posible marcar todas como leídas",
        error
      );
      await loadNotifications();
    }
  };

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.read) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );
      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );

      try {
        await markNotificationRead(notification.id);
        notifyNotificationsChanged();
      } catch (error) {
        console.error(
          "No fue posible marcar la notificación como leída",
          error
        );
        await loadNotifications();
      }
    }

    handleClose();
    router.push(`/notifications?id=${notification.id}`);
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

        {notifications.slice(0, 5).map(
          (notification) => (
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
                      {formatNotificationDate(
                        notification.createdAt
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          )
        )}

        {notifications.length === 0 && (
          <Box
            sx={{
              px: 2,
              py: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No tienes notificaciones.
            </Typography>
          </Box>
        )}

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
