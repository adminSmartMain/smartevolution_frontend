import { useContext } from "react";
import Link from "next/link";
import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import authContext from "@context/authContext";

const sections=[
  {title:"Tesorería",description:"Giros y movimientos financieros.",Icon:AccountBalanceWalletOutlinedIcon,items:[
    {label:"Giros emisor",href:"/administration/deposit-emitter/depositList",permission:"deposits.view"},
    {label:"Giros inversionista",href:"/administration/deposit-investor/depositList",permission:"deposits.view"},
  ]},
  {title:"Operaciones",description:"Procesos administrativos de las operaciones.",Icon:PaidOutlinedIcon,items:[
    {label:"Negociaciones",href:"/administration/negotiation-summary/summaryList",permission:"negotiations.view"},
    {label:"Reintegros",href:"/administration/refund/refundList",permission:"refunds.view"},
    {label:"Recaudos",href:"/administration/new-receipt/receiptList",permission:"receipts.view"},
    {label:"Historial de recaudos",href:"/administration/new-receipt/receiptHistory",permission:"receipts.history"},
  ]},
  {title:"Usuarios y accesos",description:"Cuentas internas y cuentas de clientes.",Icon:ManageAccountsOutlinedIcon,items:[
    {label:"Administrar usuarios",href:"/administration/users",permission:"users.view"},
    {label:"Cuentas de clientes",href:"/administration/users",permission:"client_access.view"},
  ]},
  {title:"Seguridad",description:"Roles, permisos y trazabilidad.",Icon:SecurityOutlinedIcon,items:[
    {label:"Roles y permisos",href:"/administration/security",permission:"security.access"},
    {label:"Auditoría",href:"/administration/security",permission:"audit.view"},
  ]},
  {title:"Organización",description:"Terceros y estructura comercial.",Icon:BusinessCenterOutlinedIcon,items:[
    {label:"Lista de corredores",href:"/brokers/brokerList",permission:"brokers.view"},
    {label:"Crear corredor",href:"/brokers?register",permission:"brokers.create"},
  ]},
];

function SectionCard({title,description,Icon,items}){
  return (
    <Card variant="outlined" sx={{width:"100%",minHeight:{xs:0,sm:340},borderColor:"#d5dddd",borderRadius:2,transition:"transform .18s, box-shadow .18s","&:hover":{transform:"translateY(-2px)",boxShadow:"0 8px 24px rgba(72,139,143,.12)"}}}>
      <CardContent sx={{p:{xs:2.5,md:3},display:"flex",flexDirection:"column",boxSizing:"border-box","&:last-child":{pb:{xs:2.5,md:3}}}}>
        <Box sx={{display:"flex",alignItems:"center",gap:1.5,mb:1.5}}>
          <Icon sx={{color:"#16777c",fontSize:31}}/>
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
        </Box>
        <Typography color="text.secondary" variant="body2" sx={{minHeight:{sm:40},mb:2}}>{description}</Typography>
        <Box sx={{borderTop:"1px solid #e5eaea",pt:1.25,mt:{xs:1,sm:"auto"}}}>
          {items.map(item=>(
            <Link key={`${item.href}-${item.label}`} href={item.href} passHref>
              <Box component="a" sx={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:2,py:1.05,px:1.25,borderRadius:1,textDecoration:"none",color:"#16777c",fontWeight:600,"&:hover":{bgcolor:"#eef7f7"}}}>
                <span>{item.label}</span><span>{"→"}</span>
              </Box>
            </Link>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export const AdministrationComponents=()=>{
  const {can}=useContext(authContext);
  const visibleSections=sections.map(section=>({...section,items:section.items.filter(item=>can(item.permission))})).filter(section=>section.items.length);
  return <Box sx={{width:"100%",maxWidth:1500,mx:"auto",pb:{xs:3,md:5}}}><Box sx={{display:"flex",alignItems:"center",gap:1,mb:{xs:3,md:4},flexWrap:"wrap"}}><Chip size="small" label={`${visibleSections.length} secciones habilitadas`} sx={{bgcolor:"#e8f3f3",color:"#16777c"}}/></Box>{visibleSections.length?<Grid container spacing={{xs:2,md:3}} alignItems="stretch">{visibleSections.map(section=><Grid item xs={12} sm={6} lg={4} key={section.title} sx={{display:"flex"}}><SectionCard {...section}/></Grid>)}</Grid>:<Card variant="outlined"><CardContent><Typography>No tienes secciones administrativas asignadas. Solicita acceso al administrador de seguridad.</Typography></CardContent></Card>}</Box>;
};
