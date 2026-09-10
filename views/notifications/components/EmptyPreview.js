import {
  Box,
  Typography,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function EmptyPreview({
  notification,
}) {
  return (
    <Box
      sx={{
        minHeight: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <NotificationsNoneOutlinedIcon
        sx={{
          fontSize: 48,
          color: "#9FB7B8",
          mb: 2,
        }}
      />

      <Typography
        fontWeight={600}
        color="#364242"
      >
        {notification
          ? notification.title
          : "Selecciona una notificación"}
      </Typography>

      <Typography
        variant="body2"
        sx={{ mt: 1, maxWidth: 380 }}
      >
        {notification
          ? notification.message
          : "Selecciona una notificación de la lista para ver sus detalles."}
      </Typography>
    </Box>
  );
}