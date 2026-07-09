import { useContext, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import authContext from "@context/authContext";
import { isPublicRoute, permissionForRoute } from "@lib/routePermissions";

export default function RouteGuard({children}){
  const router=useRouter();
  const {authReady,can,client}=useContext(authContext);
  const isPublic=isPublicRoute(router.pathname);
  const required=permissionForRoute(router.pathname);
  const allowed=isPublic || (authReady && !client && (required==="__authenticated__" || can(required)));

  useEffect(()=>{
    if(isPublic || !authReady) return;
    if(client){ router.replace("/403"); return; }
    if(required!=="__authenticated__" && !can(required)) router.replace("/dashboard");
  },[router.pathname,authReady,client,required]);

  if(allowed) return children;
  return <Box sx={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><CircularProgress/></Box>;
}
