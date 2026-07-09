import { Box, Button, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import authContext from "@context/authContext";
export default function Forbidden(){const {logout}=useContext(authContext);return <Box sx={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"#f4f7f7",p:3}}><Paper sx={{maxWidth:520,p:6,textAlign:"center"}}><Typography variant="h2" color="primary">403</Typography><Typography variant="h5" gutterBottom>Acceso no autorizado</Typography><Typography color="text.secondary" sx={{mb:3}}>Tu cuenta no tiene permiso para abrir esta vista.</Typography><Button variant="contained" onClick={logout}>Cerrar sesión</Button></Paper></Box>}
