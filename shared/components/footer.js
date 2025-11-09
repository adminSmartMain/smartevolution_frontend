import { Divider, Typography, Box } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ width: '100%', py: 2 }}>
      <Divider
        sx={{
          borderBottomWidth: 2,
          borderColor: '#488B8F',
          mb: 1,
          width: '100%',
        }}
      />
      <Typography fontSize="0.6rem" align="center">
        Copyright © 2025 Smart Evolution. Este software es propiedad exclusiva de Smart Evolution. Todos los derechos reservados. Para más información, contáctanos: <a href="mailto:info@smartevolution.com.co">info@smartevolution.com.co</a>
      </Typography>
    </Box>
  );
}