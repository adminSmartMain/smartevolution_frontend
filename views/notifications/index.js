import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { mockNotifications } from "./mockData";

import NotificationList from "./components/NotificationList";
import NotificationPreview from "./components/NotificationPreview";

export default function NotificationsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [notifications, setNotifications] =
    useState(mockNotifications);

  const [selectedId, setSelectedId] =
    useState(null);

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

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
          .toLowerCase()
          .includes(search) ||
        notification.message
          .toLowerCase()
          .includes(search) ||
        notification.entity?.label
          ?.toLowerCase()
          .includes(search);

      return matchesTab && matchesSearch;
    });
  }, [
    notifications,
    tab,
    query,
  ]);

  const selectedNotification =
    notifications.find(
      (notification) =>
        notification.id === selectedId
    ) || null;

  const handleSelect = (notification) => {
    setSelectedId(notification.id);

    if (!notification.read) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    }
  };

  const handleBackToList = () => {
    setSelectedId(null);
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const showMobilePreview =
    isMobile && selectedNotification;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* Barra superior del módulo */}
      {!showMobilePreview && (
        <Box
          sx={{
            mb: {
              xs: 1.5,
              md: 2,
            },
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
            gap: {
              xs: 1.5,
              sm: 2,
            },
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
              px: {
                xs: 0,
                sm: 1,
              },
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
          borderRadius: {
            xs: 0,
            md: 3,
          },
          overflow: "hidden",
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* Tabs: ocultas mientras vemos preview en móvil */}
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
                px: {
                  xs: 0.5,
                  sm: 1,
                  md: 2,
                },
                minHeight: {
                  xs: 44,
                  md: 48,
                },

                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "auto",
                  px: {
                    xs: 1.5,
                    sm: 2,
                  },
                  fontSize: {
                    xs: 13,
                    md: 14,
                  },
                },

                "& .Mui-selected": {
                  color:
                    "#488B8F !important",
                },

                "& .MuiTabs-indicator": {
                  backgroundColor:
                    "#488B8F",
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

        {/* Mobile: preview ocupa todo el ancho */}
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

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <NotificationPreview
                notification={
                  selectedNotification
                }
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
              notifications={
                filteredNotifications
              }
              selectedId={selectedId}
              query={query}
              onQueryChange={setQuery}
              onSelect={handleSelect}
            />

            {/* Desktop/tablet grande */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                flex: 1,
                minWidth: 0,
                p: {
                  md: 3,
                  lg: 4,
                },
                bgcolor: "#FCFDFD",
              }}
            >
              <NotificationPreview
                notification={
                  selectedNotification
                }
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}