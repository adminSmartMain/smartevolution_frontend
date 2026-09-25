import { useContext, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import authContext from "@context/authContext";
import { isPublicRoute, permissionForRoute } from "@lib/routePermissions";

export default function RouteGuard({children}){
  const router=useRouter();
  const {authReady,can,accountScope}=useContext(authContext);
  const isPublic=isPublicRoute(router.pathname);
  const required=permissionForRoute(router.pathname);
  const isClientPortal = accountScope === "CLIENT_PORTAL";
  const allowed=isPublic || (authReady && !isClientPortal && (required==="__authenticated__" || can(required)));

  useEffect(()=>{
    if(isPublic || !authReady) return;
    if(isClientPortal){ router.replace("/403"); return; }
    if(required!=="__authenticated__" && !can(required)) router.replace("/dashboard");
  },[router.pathname,authReady,isClientPortal,required]);

  if(allowed) return children;
  return <Box sx={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><CircularProgress/></Box>;
}
