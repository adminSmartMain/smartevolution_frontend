import {
  Box,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
  selectedId,
  query,
  onQueryChange,
  onSelect,
}) {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: 390,
          lg: 410,
        },
        maxWidth: {
          xs: "100%",
          md: 390,
          lg: 410,
        },
        minWidth: 0,
        flexShrink: 0,

        borderRight: {
          xs: 0,
          md: "1px solid #E6EAEA",
        },

        bgcolor: "#FFFFFF",
      }}
    >
      {/* Buscador */}
      <Box
        sx={{
          p: {
            xs: 1.25,
            sm: 1.5,
            md: 2,
          },
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar notificaciones"
          value={query}
          onChange={(event) =>
            onQueryChange(event.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  fontSize="small"
                  sx={{
                    color: "text.secondary",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: {
                xs: 13,
                sm: 14,
              },
            },

            "& .MuiOutlinedInput-input": {
              py: {
                xs: 1.1,
                sm: 1.2,
              },
            },
          }}
        />
      </Box>

      <Divider />

      {/* Lista */}
      <Box
        sx={{
          maxHeight: {
            xs: "none",
            md: "calc(100vh - 310px)",
          },

          overflowY: {
            xs: "visible",
            md: "auto",
          },

          overflowX: "hidden",

          WebkitOverflowScrolling: "touch",
        }}
      >
        {notifications.length === 0 ? (
          <Box
            sx={{
              px: 2,
              py: {
                xs: 5,
                md: 6,
              },
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No se encontraron notificaciones.
            </Typography>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <Box
              key={notification.id}
              sx={{
                minWidth: 0,
              }}
            >
              <NotificationItem
                notification={notification}
                selected={selectedId === notification.id}
                onClick={() => onSelect(notification)}
              />

              {index < notifications.length - 1 && (
                <Divider />
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}