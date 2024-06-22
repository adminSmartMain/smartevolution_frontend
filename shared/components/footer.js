import { Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <>
      <Divider sx={{ borderBottomWidth: 4 }} />
      <Typography fontSize="0.6rem" align="left">
        Copyright © 2022 Infinity. Desarrollado por Infinity Todos los Derechos
        Reservados
      </Typography>
    </>
  );
}
