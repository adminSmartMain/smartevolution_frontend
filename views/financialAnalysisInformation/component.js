import {
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  Divider,
  Card,
  Grid,
  Avatar
} from '@mui/material';
import InputTitles from '@styles/inputTitles';
import { useEffect, useState, useContext, useMemo } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import MoneyOffCsredOutlinedIcon from "@mui/icons-material/MoneyOffCsredOutlined";
import { RiskProfileV } from '@views/financialAnalysisInformation/riskProfile';
import { useRouter } from "next/router";
import {
  GetCustomerById,
  getRiskProfile,
  saveRiskProfile,
  updateRiskProfile,
} from "./queries";
import { useFetch } from "@hooks/useFetch";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedSharpIcon from '@mui/icons-material/SentimentSatisfiedSharp';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import { Tooltip, Fade } from "@mui/material";
import { FinancialSituationIndex } from './financialSituation';
import FinancialIndicators from './indicators';
import { StateResultsIndex } from './stateResults';

// ✅ MAP (déjalo en el mismo archivo o en un utils y lo importas)
const map = {
  "Muy Bajo": { bg: "#E6F4EA", color: "#1E8E3E", Icon: AddReactionIcon },
  "Bajo": { bg: "#E6F4EA", color: "#43A047", Icon: SentimentSatisfiedSharpIcon },
  "Regular": { bg: "#FFF4E5", color: "#E3A400", Icon: SentimentNeutralRoundedIcon },
  "Alto": { bg: "#FCE8E6", color: "#E66431", Icon: SentimentVeryDissatisfiedIcon },
  "Muy Alto": { bg: "#FCE8E6", color: "#D93025", Icon: SentimentVeryDissatisfiedRoundedIcon },
  "No aplica": { bg: "#eeeeee", color: "#777777", Icon: AddReactionIcon },
};

const riskLegend = [
  {
    level: "Muy Bajo",
    score: "891-950",
    text:
      "El cliente tiene un historial impecable, alta probabilidad de pago y excelente manejo de deudas.",
  },
  {
    level: "Bajo",
    score: "791-890",
    text:
      "Cumplidor constante. Puede tener algún uso elevado de sus líneas de crédito, pero sin moras significativas.",
  },
  {
    level: "Regular",
    score: "591-790",
    text:
      "Presenta algunas señales de alerta, como retrasos ocasionales o un nivel de endeudamiento cercano al límite.",
  },
  {
    level: "Alto",
    score: "301-590",
    text:
      "Historial con reportes negativos recientes o morosidad recurrente. Capacidad de pago comprometida.",
  },
  {
    level: "Muy Alto",
    score: "1-300",
    text:
      "Incumplimiento severo. Alta probabilidad de que la empresa entre en insolvencia o no pueda responder por sus obligaciones.",
  },
  {
    level: "No aplica",
    score: "Sin calcular",
    text:
      "El cliente aún no cuenta con información suficiente para determinar su perfil de riesgo. Se requiere completar el cuestionario o validar datos antes de emitir una recomendación.",
  },
];

// ✅ Tooltip tipo tabla (rectangular, compacto)
const RiskLegendTooltip = () => {
  return (
    <Box sx={{ px: 1.25, py: 1, width: "100%" }}>
      {/* header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "44px 120px 95px 1fr",
          columnGap: 1.5,
          alignItems: "center",
          borderBottom: "1px solid #D1D5DB",
          pb: 0.6,
          mb: 0.6,
          fontWeight: 700,
          color: "#111827",
          fontSize: 12.5,
        }}
      >
        <Box>Ícono</Box>
        <Box>Nivel</Box>
        <Box>Puntaje</Box>
        <Box>Interpretación</Box>
      </Box>

      {/* rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
        {riskLegend.map((row) => {
          const cfg = map[row.level] ?? map["No aplica"];
          const Icon = cfg.Icon;

          return (
            <Box
              key={row.level}
              sx={{
                display: "grid",
                gridTemplateColumns: "44px 120px 95px 1fr",
                columnGap: 1.5,
                alignItems: "start",
                fontSize: 12.5,
                lineHeight: 1.15,
                py: 0.15,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: 0.1 }}>
                <Icon sx={{ color: cfg.color, fontSize: 18 }} />
              </Box>

              <Box sx={{ color: cfg.color, fontWeight: 700, whiteSpace: "nowrap" }}>
                {row.level}
              </Box>

              <Box sx={{ color: cfg.color, fontWeight: 700, whiteSpace: "nowrap" }}>
                {row.score}
              </Box>

              <Box sx={{ color: "#111827" }}>{row.text}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ✅ RiskBadge (icono grande + puntaje rojo + nivel color + i con tooltip)
export const RiskBadge = ({ score = 0, level = "No aplica", title = "Contacto" }) => {
  const cfg = map[level] ?? map["No aplica"];
  const Icon = cfg.Icon;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.8, md: 1.25 },
        minWidth: 0,
      }}
    >
      {/* Icono grande */}
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          backgroundColor: cfg.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <Icon sx={{ fontSize: 25, color: cfg.color }} />
      </Box>

      {/* Textos */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <InputTitles sx={{ mb: 0.25 }}>{title}</InputTitles>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography sx={{ fontSize: 11.5, color: "#333", lineHeight: 1.3 }}>
            Puntaje:{" "}
            <Box component="span" sx={{ color: "#D93025", fontWeight: 700 }}>
              {score}
            </Box>
          </Typography>

          {/* i con tooltip (más rectangular y compacto) */}
          <Tooltip
            placement="right-start"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#FFFFFF",
                  color: "#111827",
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
                  p: 0,
                  minWidth: 0,
                  width: { xs: "min(92vw, 560px)", md: 640 },
                  maxWidth: "min(92vw, 760px)",
                },
              },
              arrow: { sx: { color: "#FFFFFF" } },
            }}
            title={<RiskLegendTooltip />}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "4px",
                border: "1.5px solid #488B8F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#488B8F",
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 800,
                userSelect: "none",
                cursor: "pointer",
              }}
            >
              i
            </Box>
          </Tooltip>
        </Box>

        <Typography sx={{ fontSize: 11.5, color: "#333", lineHeight: 1.3 }}>
          Nivel de Riesgo:{" "}
          <Box component="span" sx={{ color: cfg.color, fontWeight: 700 }}>
            {level}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};



export const InformationHeader = ({ data }) => {
  const iconUrl =
    data?.data?.profile_image ??
    "https://devsmartevolution.s3.us-east-1.amazonaws.com/clients-profiles/default-profile.svg";

  const valueSx = {
    fontSize: { xs: 11.5, md: 12 },
    lineHeight: 1.35,
    color: "#181b1d",
    fontWeight: 500,
  };

  const labelSx = {
    fontSize: 10,
    lineHeight: 1.15,
    fontWeight: 700,
    color: "#66727c",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    mb: 0.35,
  };

  const cellSx = {
    minWidth: 0,
    alignSelf: "center",
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "34px minmax(0, 1fr)",
            sm: "34px minmax(0, 1fr) minmax(0, 1fr)",
            md: "34px minmax(180px, 1.35fr) minmax(90px, .55fr) minmax(150px, 1fr)",
            lg: "34px minmax(200px, 1.35fr) minmax(90px, .55fr) minmax(160px, .95fr) minmax(160px, .95fr) auto",
          },
          gridTemplateAreas: {
            xs: `
              "avatar name"
              "avatar nit"
              "avatar legal"
              "avatar contact"
              "avatar risk"
            `,
            sm: `
              "avatar name name"
              "avatar nit legal"
              "avatar contact risk"
            `,
            md: `
              "avatar name nit legal"
              "avatar contact contact risk"
            `,
            lg: `"avatar name nit legal contact risk"`,
          },
          columnGap: { xs: 1, sm: 1.5, lg: 2 },
          rowGap: { xs: 0.9, sm: 1, md: 0.75 },
          alignItems: "center",
          py: { xs: 1, md: 1.25 },
        }}
      >
        <Box
          component="img"
          src={iconUrl}
          alt="Cliente"
          sx={{
            gridArea: "avatar",
            width: 30,
            height: 30,
            objectFit: "contain",
            borderRadius: "50%",
            alignSelf: { xs: "start", lg: "center" },
            mt: { xs: 0.25, lg: 0 },
          }}
        />

        <Box sx={{ ...cellSx, gridArea: "name" }}>
          <Typography sx={labelSx}>Nombre cliente</Typography>
          <Typography
            sx={{
              ...valueSx,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {`${data?.data?.first_name ?? ""} ${data?.data?.last_name ?? ""} ${data?.data?.social_reason ?? ""}`.trim() || "—"}
          </Typography>
        </Box>

        <Box sx={{ ...cellSx, gridArea: "nit" }}>
          <Typography sx={labelSx}>NIT</Typography>
          <Typography sx={valueSx}>{data?.data?.document_number || "—"}</Typography>
        </Box>

        <Box sx={{ ...cellSx, gridArea: "legal" }}>
          <Typography sx={labelSx}>Representante legal</Typography>
          <Typography
            sx={{
              ...valueSx,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.data?.legal_representative?.social_reason
              ? data.data.legal_representative.social_reason
              : `${data?.data?.legal_representative?.first_name ?? ""} ${data?.data?.legal_representative?.last_name ?? ""}`.trim() || "—"}
          </Typography>
        </Box>

        <Box sx={{ ...cellSx, gridArea: "contact" }}>
          <Typography sx={labelSx}>Contacto</Typography>
          <Typography
            sx={{
              ...valueSx,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.data?.email || "—"}
          </Typography>
          <Typography sx={{ ...valueSx, color: "#66727c", fontWeight: 400 }}>
            {data?.data?.phone_number || "—"}
          </Typography>
        </Box>

        <Box sx={{ ...cellSx, gridArea: "risk", justifySelf: { xs: "start", lg: "end" } }}>
          <RiskBadge
            title="Riesgo"
            score={data?.data_credit_score ?? 590}
            level={data?.data?.risk_level ?? "Alto"}
          />
        </Box>
      </Box>

      <Divider />
    </>
  );
};


export const ProfileRisk = ({data}) => {

    return (  
          <>
            <Box>
                <RiskProfileV/>


            </Box>
            </>
                )
            }


export const FinancialSituationStatus = () => {

    return (

        <>
        
            <FinancialSituationIndex/>
        
        </>
    )
}

export const StatusResults = () => {

    return (

        <>
        <Box>
            <Typography>
                Estado de resultados
            </Typography>
        </Box>
        </>
    )
}


const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

const mockData = {
  cards: [
    {
      key: "assets",
      label: "Total Activos",
      value: 344956067,
      delta: "-19%",
      color: "#D32F2F",
      icon: <AccountBalanceOutlinedIcon />,
    },
    {
      key: "liabilities",
      label: "Total Pasivos",
      value: 344956067,
      delta: "-1468%",
      color: "#D32F2F",
      icon: <CreditCardOutlinedIcon />,
    },
    {
      key: "equity",
      label: "Total Patrimonio",
      value: 3277327248,
      delta: "+4578%",
      color: "#2E7D32",
      icon: <PaidOutlinedIcon />,
    },
    {
      key: "income",
      label: "Total Ingresos",
      value: 303003,
      delta: "+??%",
      color: "#2E7D32",
      icon: <AttachMoneyOutlinedIcon />,
    },
    {
      key: "expenses",
      label: "Total Egresos",
      value: 939393,
      delta: "+??%",
      color: "#2E7D32",
      icon: <MoneyOffCsredOutlinedIcon />,
    },
  ],
};

const StatCard = ({ icon, value, label, delta, color }) => (
  <Box
    sx={{
      minWidth: 0,
      minHeight: 58,
      display: "grid",
      gridTemplateColumns: "30px 1fr",
      alignItems: "center",
      columnGap: 1,
      px: 1.15,
      bgcolor: "#FFFFFF",
      border: "1px solid #E1E7E9",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(25,45,50,.04)",
    }}
  >
    <Avatar
      sx={{
        width: 28,
        height: 28,
        bgcolor: "#F0F6F6",
        color: "#2E7D7A",
        "& .MuiSvgIcon-root": { fontSize: 17 },
      }}
    >
      {icon}
    </Avatar>

    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontWeight: 700,
          color,
          fontSize: 11.5,
          lineHeight: 1.15,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {money(value)}
      </Typography>
      <Box sx={{ display: "flex", gap: 0.6, alignItems: "baseline", mt: 0.25 }}>
        <Typography sx={{ color: "#6D7A80", fontSize: 9.5, lineHeight: 1.15 }}>
          {label}
        </Typography>
        <Typography sx={{ color, fontSize: 9, lineHeight: 1.15 }}>
          {delta}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export const CardsInfo = ({ data = mockData }) => (
  <Box
    sx={{
      mt: 1,
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(3, minmax(0, 1fr))",
        lg: "repeat(5, minmax(0, 1fr))",
      },
      gap: 0.9,
      width: "100%",
    }}
  >
    {data.cards.map((c) => (
      <StatCard key={c.key} {...c} />
    ))}
  </Box>
);

export const FinancialAnalysisInformationComponent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const router = useRouter();
    console.log(router.query.id)

  // Get customer data
  const {
    fetch: getCustomer,
    loading: loadingGetCustomer,
    error: errorGetCustomer,
    data: dataCustomer,
  } = useFetch({ service: GetCustomerById, init: false });
  const {
      fetch: getRiskProfileFetch,
      loading: loadingRiskProfileFetch,
      error: errorRiskProfileFetch,
      data: dataRiskProfileFetch,
    } = useFetch({ service: getRiskProfile, init: true });
    // Get customer data
  useEffect(() => {
    if (router.query.id != undefined) {
      getCustomer(router.query.id);
      getRiskProfileFetch(router.query.id);
    }
  }, [router.query.id]);

  console.log(dataCustomer)
  return (

    <>
    <Box
      sx={{
        width: "100%",
        mb: 1.25,
        fontFamily: '"Montserrat", sans-serif',
        "& .MuiInputBase-input, & .MuiSelect-select": {
          fontSize: "12px",
        },
        "& .MuiFormLabel-root, & .MuiInputLabel-root": {
          fontSize: "11px",
        },
        "& .MuiFormControlLabel-label": {
          fontSize: "12px",
        },
        "& .MuiButton-root": {
          fontSize: "12px",
        },
        "& .MuiTableCell-root": {
          fontSize: "12px",
          py: 0.9,
        },
      }}
    >

        <Box>

        <InformationHeader data={dataCustomer}/>

          <CardsInfo />
        </Box>
         <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mt: 1,
              minHeight: 34,
              px: 0.5,
              bgcolor: "#F5F8F8",
              borderRadius: "8px",
              border: "1px solid #E1E7E9",
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                minHeight: 32,
                px: 1.4,
                py: 0.5,
                color: '#607078',
                borderRadius: '6px',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
              },
              '& .Mui-selected': {
                color: '#2F7479 !important',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0,0,0,.06)',
              },
            }}
            >
        <Tab label="Perfil de Riesgo" />
        <Tab label="Estado de Situacion Financiera" />
        <Tab label="Estado de Resultados" />
        <Tab label="Indicadores Financieros" />
        </Tabs>

      {activeTab === 0 && (

        <>
        <RiskProfileV dataClient={dataCustomer} dataRiskProfile1={dataRiskProfileFetch} errorRiskProfileFetch1={errorRiskProfileFetch} loadingRiskProfileFetch1={loadingRiskProfileFetch}/>
        </>
      )}
      {activeTab === 1 && (

        <>
        
        <FinancialSituationStatus/>
        </>
      )}
      {activeTab === 2 && (

        <>
        <StateResultsIndex/>
        </>
      )}
      {activeTab === 3 && (

        <>
         <FinancialIndicators/>
        </>
      )}
      </Box>


    </>
  ) ;
}
