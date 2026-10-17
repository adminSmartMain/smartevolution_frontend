import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import {
  createNotificationsSocket,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notifyNotificationsChanged,
} from "./queries";

import NotificationList from "./components/NotificationList";
import NotificationPreview from "./components/NotificationPreview";

export default function NotificationsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoadError(false);

      const data = await getNotifications({
        page: 1,
        pageSize: 100,
      });

      setNotifications(data.results || []);
    } catch (error) {
      console.error(
        "No fue posible cargar las notificaciones",
        error
      );
      setLoadError(true);
    } finally {
      setLoading(false);
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
        ]);
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

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readCount =
    notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    const search = query.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesTab =
        tab === "all" ||
        (tab === "unread" && !notification.read) ||
        (tab === "read" && notification.read);

      const matchesSearch =
        !search ||
        notification.title
          ?.toLowerCase()
          .includes(search) ||
        notification.message
          ?.toLowerCase()
          .includes(search) ||
        notification.entity?.label
          ?.toLowerCase()
          .includes(search);

      return matchesTab && matchesSearch;
    });
  }, [notifications, tab, query]);

  const selectedNotification =
    notifications.find(
      (notification) =>
        notification.id === selectedId
    ) || null;

  const handleSelect = async (notification) => {
    setSelectedId(notification.id);

    if (notification.read) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
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
  };

  const handleBackToList = () => {
    setSelectedId(null);
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    try {
      await markAllNotificationsRead();
      notifyNotificationsChanged();
    } catch (error) {
      console.error(
        "No fue posible marcar todas las notificaciones como leídas",
        error
      );
      await loadNotifications();
    }
  };

  const showMobilePreview =
    isMobile && selectedNotification;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {loadError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadNotifications}
            >
              Reintentar
            </Button>
          }
        >
          No fue posible cargar las notificaciones.
        </Alert>
      )}

      {!showMobilePreview && (
        <Box
          sx={{
            mb: { xs: 1.5, md: 2 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            startIcon={<DoneAllIcon />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "#488B8F",
              fontWeight: 600,
              alignSelf: {
                xs: "flex-start",
                sm: "auto",
              },
              px: { xs: 0, sm: 1 },
            }}
          >
            Marcar todas como leídas
          </Button>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          border: {
            xs: 0,
            md: "1px solid #E1E7E7",
          },
          borderRadius: { xs: 0, md: 3 },
          overflow: "hidden",
          width: "100%",
          minWidth: 0,
        }}
      >
        {!showMobilePreview && (
          <Box
            sx={{
              overflowX: "auto",
              borderBottom: "1px solid #E6EAEA",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, value) => {
                setTab(value);
                setSelectedId(null);
              }}
              variant={
                isMobile
                  ? "scrollable"
                  : "standard"
              }
              scrollButtons={false}
              sx={{
                px: { xs: 0.5, sm: 1, md: 2 },
                minHeight: { xs: 44, md: 48 },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "auto",
                  px: { xs: 1.5, sm: 2 },
                  fontSize: { xs: 13, md: 14 },
                },
                "& .Mui-selected": {
                  color: "#488B8F !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#488B8F",
                },
              }}
            >
              <Tab
                value="all"
                label={`Todas (${notifications.length})`}
              />
              <Tab
                value="unread"
                label={`No leídas (${unreadCount})`}
              />
              <Tab
                value="read"
                label={`Leídas (${readCount})`}
              />
            </Tabs>
          </Box>
        )}

        {showMobilePreview ? (
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              bgcolor: "#FCFDFD",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                bgcolor: "#FFFFFF",
                borderBottom:
                  "1px solid #E6EAEA",
                px: 1,
                py: 0.75,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToList}
                size="small"
                sx={{
                  color: "#488B8F",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Volver a notificaciones
              </Button>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <NotificationPreview
                notification={selectedNotification}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              minWidth: 0,
              minHeight: {
                xs: "auto",
                md: 550,
              },
            }}
          >
            <NotificationList
              notifications={filteredNotifications}
              selectedId={selectedId}
              query={query}
              onQueryChange={setQuery}
              onSelect={handleSelect}
            />

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                flex: 1,
                minWidth: 0,
                p: { md: 3, lg: 4 },
                bgcolor: "#FCFDFD",
              }}
            >
              <NotificationPreview
                notification={selectedNotification}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
