import {
  Box,
  Typography,
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

const getIcon = (type) => {
  switch (type) {
    case "bill":
      return <ReceiptLongOutlinedIcon fontSize="small" />;

    case "operation":
      return <SwapHorizOutlinedIcon fontSize="small" />;

    case "electronic_signature":
      return <DrawOutlinedIcon fontSize="small" />;

    case "preoperation":
      return <FactCheckOutlinedIcon fontSize="small" />;

    default:
      return <NotificationsNoneOutlinedIcon fontSize="small" />;
  }
};

export default function NotificationItem({
  notification,
  selected,
  onClick,
}) {
  const formattedDate = new Date(
    notification.createdAt
  ).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        px: {
          xs: 1.25,
          sm: 1.5,
          md: 2,
        },
        py: {
          xs: 1.4,
          sm: 1.6,
          md: 2,
        },

        cursor: "pointer",
        minWidth: 0,

        borderLeft: selected
          ? "3px solid #488B8F"
          : "3px solid transparent",

        backgroundColor: selected
          ? "rgba(72,139,143,0.10)"
          : notification.read
          ? "#FFFFFF"
          : "rgba(72,139,143,0.045)",

        transition:
          "background-color .15s ease, border-color .15s ease",

        "&:hover": {
          backgroundColor:
            "rgba(72,139,143,0.08)",
        },

        "&:active": {
          backgroundColor:
            "rgba(72,139,143,0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: {
            xs: 1,
            sm: 1.25,
            md: 1.5,
          },
          minWidth: 0,
        }}
      >
        {/* Icono */}
        <Box
          sx={{
            width: {
              xs: 34,
              sm: 36,
              md: 38,
            },
            height: {
              xs: 34,
              sm: 36,
              md: 38,
            },

            borderRadius: {
              xs: 1.5,
              md: 2,
            },

            bgcolor: "#EEF5F5",
            color: "#488B8F",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,

            "& svg": {
              fontSize: {
                xs: 18,
                md: 20,
              },
            },
          }}
        >
          {getIcon(notification.entity?.type)}
        </Box>

        {/* Contenido */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Título */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.75,
              minWidth: 0,
            }}
          >
            {!notification.read && (
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#488B8F",
                  flexShrink: 0,
                  mt: "6px",
                }}
              />
            )}

            <Typography
              sx={{
                fontSize: {
                  xs: 13,
                  sm: 13.5,
                  md: 14,
                },
                fontWeight:
                  notification.read ? 500 : 700,
                color: "#364242",

                lineHeight: 1.35,

                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: {
                  xs: 2,
                  md: 1,
                },

                minWidth: 0,
                wordBreak: "break-word",
              }}
            >
              {notification.title}
            </Typography>
          </Box>

          {/* Mensaje */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,

              fontSize: {
                xs: 12,
                sm: 12.5,
                md: 13,
              },

              lineHeight: 1.45,

              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: {
                xs: 3,
                sm: 2,
              },

              wordBreak: "break-word",
            }}
          >
            {notification.message}
          </Typography>

          {/* Footer */}
          <Box
            sx={{
              mt: {
                xs: 0.8,
                sm: 1,
              },

              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "flex-start",
                sm: "center",
              },

              justifyContent: {
                sm: "space-between",
              },

              gap: {
                xs: 0.25,
                sm: 1,
              },

              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#488B8F",
                fontWeight: 600,

                fontSize: {
                  xs: 11,
                  sm: 11.5,
                },

                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {notification.entity?.label}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: 10.5,
                  sm: 11,
                },

                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}