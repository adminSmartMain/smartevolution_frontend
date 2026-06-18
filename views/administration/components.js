import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography, Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Home as HomeIcon } from "@mui/icons-material";

const adminCards = [
  {
    title: "Giros Emisor",
    iconClass: "fa-regular fa-paper-plane",
    actions: [{ label: "Acceder a esta sección", href: "/administration/deposit-emitter/depositList" }],
  },
  {
    title: "Giros Inversionista",
    iconClass: "fa-regular fa-paper-plane",
    actions: [{ label: "Acceder a esta sección", href: "/administration/deposit-investor/depositList" }],
  },
  {
    title: "Negociaciones",
    iconClass: "fa-regular fa-handshake",
    actions: [{ label: "Acceder a esta sección", href: "/administration/negotiation-summary/summaryList" }],
  },
  {
    title: "Reintegros",
    iconClass: "fa-solid fa-person-walking-arrow-loop-left",
    actions: [{ label: "Acceder a esta sección", href: "/administration/refund/refundList" }],
  },
  {
    title: "Recaudos",
    iconClass: "fa-light fa-coin",
    actions: [
      { label: "Consulta de recaudos", href: "/administration/new-receipt/receiptList" },
      { label: "Historial de cambios", href: "/administration/new-receipt/receiptHistory" },
    ],
  },
];

const actionButtonSx = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: "2px solid #488B8F",
  padding: "0.5rem 0.7rem",
  textDecoration: "none",
  color: "#488B8F",
  width: "100%",
  boxSizing: "border-box",
  "&:hover": {
    backgroundColor: "#E7F3F3",
  },
};

function AdminCard({ title, iconClass, actions }) {
  return (
    <Box
      height="100%"
      width="19%"
      minWidth={{ xs: "100%", sm: "230px", md: "19%" }}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      sx={{
        borderRadius: "4px",
        border: "2px solid #488B8F",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "#CFDDDD",
        },
        cursor: "default",
        alignItems: "center",
        p: 0,
        boxSizing: "border-box",
      }}
    >
      <Box flexGrow={0} />
      <Box textAlign="center">
        <i
          className={iconClass}
          style={{
            fontSize: "3rem",
            color: "#488B8F",
            marginBottom: "1.5rem",
          }}
        />
        <Typography
          letterSpacing={0}
          fontSize="80%"
          fontWeight="bold"
          color="#488B8F"
          textTransform="uppercase"
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ width: "70%", mb: "3rem", display: "flex", flexDirection: "column", gap: 1 }}>
        {actions.map((action) => (
          <Link key={action.href} href={action.href} passHref>
            <Box component="a" sx={actionButtonSx}>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
                textAlign="center"
              >
                {action.label}
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                  flexShrink: 0,
                }}
              />
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export const AdministrationComponents = () => {
  return (
    <>
      <Box className="view-header">
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ ml: 1, mt: 1 }}
          >
            <Link href="/dashboard" underline="none">
              <a>
                <HomeIcon
                  fontSize="large"
                  sx={{
                    color: "#488b8f",
                    opacity: 0.8,
                    strokeWidth: 1,
                  }}
                />
              </a>
            </Link>
            <Link underline="hover" color="#5EA3A3" href="/administration" sx={{ fontSize: "1.3rem" }}>
              <Typography component="h1" className="view-title">
                Administración
              </Typography>
            </Link>
          </Breadcrumbs>
        </Typography>
      </Box>

      <Typography
        letterSpacing={0}
        fontSize="1.2vw"
        fontWeight="medium"
        marginBottom="0.7rem"
        color="#333333"
      >
        Bienvenido al módulo de Administración.
        <br />A continuación selecciona a donde deseas acceder
      </Typography>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        height="100%"
        gap={2}
        sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
      >
        {adminCards.map((card) => (
          <AdminCard key={card.title} {...card} />
        ))}
      </Box>
    </>
  );
};
