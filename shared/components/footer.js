import { Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <>
     <Divider
  sx={{
    borderBottomWidth: 2,
    borderColor: '#488B8F',
    mb: 1,
    width: '100%', // Se extiende completamente en su contenedor
  }}
/>

      <Typography fontSize="0.6rem" align="left">
        Copyright © 2025 Smart Evolution. Este software es propiedad exclusiva de Smart Evolution. Todos los derechos reservados.   Para más información, contáctanos: <a href="mailto:info@smartevolution.com.co">info@smartevolution.com.co</a>
      </Typography>
      <Typography fontSize="0.6rem" align="rigth" sx={{ mt: 1 }}>
      
      </Typography>
    </>
  );
}
