import { useContext } from "react";
import Head from "next/head";
import { Box, Button, Paper, Typography } from "@mui/material";
import authContext from "@context/authContext";

export default function ClientPortalUnavailable(){
  const {logout}=useContext(authContext);
  return <><Head><title>Portal de clientes</title></Head><Box sx={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"#f4f7f7",p:3}}><Paper sx={{maxWidth:560,p:{xs:4,md:6},textAlign:"center",borderRadius:3}}><Box component="img" src="/assets/Logo Smart - Lite.svg" alt="Smart Evolution" sx={{width:190,mb:4}}/><Typography variant="h4" gutterBottom>Portal de clientes</Typography><Typography color="text.secondary" sx={{mb:4}}>Tu cuenta está activa, pero el portal exclusivo para clientes todavía no está disponible. Esta cuenta no tiene acceso a la plataforma administrativa.</Typography><Button variant="contained" onClick={logout}>Cerrar sesión</Button></Paper></Box></>;
}
