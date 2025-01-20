import { Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <>
      <Divider sx={{ borderBottomWidth: 4 }} />
      <Typography fontSize="0.6rem" align="left">
        Copyright © 2025 Smart Evolution. Este software es propiedad exclusiva de Smart Evolution. Todos los derechos reservados.
      </Typography>
      <Typography fontSize="0.6rem" align="rigth" sx={{ mt: 1 }}>
        Para más información, contáctanos: <a href="mailto:info@smartevolution.com.co">info@smartevolution.com.co</a>
      </Typography>
    </>
  );
}
