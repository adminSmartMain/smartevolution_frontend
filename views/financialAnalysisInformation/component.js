import { Title } from '@mui/icons-material';
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {/* Icono grande */}
      <Box
        sx={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          backgroundColor: cfg.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <Icon sx={{ fontSize: 34, color: cfg.color }} />
      </Box>

      {/* Textos */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <InputTitles sx={{ mb: 0.25 }}>{title}</InputTitles>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, color: "#333" }}>
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
                  minWidth: 640,
                  maxWidth: 760,
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

        <Typography sx={{ fontSize: 13, color: "#333" }}>
          Nivel de Riesgo:{" "}
          <Box component="span" sx={{ color: cfg.color, fontWeight: 700 }}>
            {level}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};



export const InformationHeader = ({data}) =>{

const iconUrl =
       data?.data?.profile_image ??
        "https://devsmartevolution.s3.us-east-1.amazonaws.com/clients-profiles/default-profile.svg"; // placeholder

    return (

        <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box
                  component="img"
                  src={iconUrl}
                  alt="icon"
                  sx={{ width: 28, height: 28, objectFit: "contain" }}
                />
               
                    <Box>
                        <InputTitles>
                            Nombre Cliente
                        </InputTitles>
                        <Typography>
                              {`${data?.data?.first_name ?? ""} ${
                    data?.data?.last_name ?? ""
                  } ${data?.data?.social_reason ?? ""}`}
               
                        </Typography>

                    </Box>
                   
                        <Box>

                            <InputTitles>
                                    Nit
                            </InputTitles>

                            <Typography>
                                      {data?.data?.document_number}
                            </Typography>
                        </Box>
                    
                        <Box>
                            <InputTitles>
                                Representante Legal
                            </InputTitles>

                            <Typography>
                                    {`${
                    data?.data?.legal_representative?.social_reason
                      ? data?.data?.legal_representative?.social_reason
                      : `${data?.data?.legal_representative?.first_name} 
                        ${data?.data?.legal_representative?.last_name} `
                  } `}
                                </Typography>

                        </Box>
                     
                        <Box>

                            <InputTitles>
                                Contacto
                            </InputTitles>

                            <Typography>
                                    {`${data?.data?.email} `}
                                </Typography>
                                <Typography>
                                    {`${data?.data?.phone_number} `}
                                </Typography>
                        </Box>
                    
                            <Box>

                            <RiskBadge
                              title="Riesgo"
                              score={data?.data_credit_score ?? 590}
                              level={data?.data?.risk_level ?? "Alto"}
                            />
                            </Box>
                </Box>
        <Divider sx={{ mt: 3 }} />
                </>
            )
        }

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

const StatCard = ({ icon, value, label, delta, color }) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        minWidth: 180,
        textAlign: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
      }}
    >
      <Avatar
        sx={{
          mx: "auto",
          mb: 1,
          width: 34,
          height: 34,
          bgcolor: "#F3F7F7",
          color: "#2E7D7A",
        }}
      >
        {icon}
      </Avatar>

      <Typography sx={{ fontWeight: 700, color, fontSize: 14 }}>
        {money(value)}
      </Typography>

      <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.5 }}>
        {label}
      </Typography>

      <Typography sx={{ color, fontSize: 11, mt: 0.5 }}>
        {delta}
      </Typography>
    </Card>
  );
};

export const CardsInfo = ({ data = mockData }) => {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pb: 1,
          width: "fit-content",
          maxWidth: "100%",
          overflowX: "auto",
          justifyContent: "center",
          "&::-webkit-scrollbar": { height: 6 },
        }}
      >
        {data.cards.map((c) => (
          <Box key={c.key} sx={{ flex: "0 0 auto" }}>
            <StatCard {...c} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

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
    <Box sx={{ width: '100%', mb: 3 }}>

        <Box>

        <InformationHeader data={dataCustomer}/>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <CardsInfo />
          </Box>
        </Box>
         <Tabs 
            value={activeTab} 
            onChange={(event, newValue) => setActiveTab(newValue)}
            sx={{
                '& .MuiTabs-indicator': {
                backgroundColor: '#5EA3A3', // Color del indicador
                },
                '& .MuiTab-root': {
                color: '#5EA3A3', // Color del texto cuando no está seleccionado
                },
                '& .Mui-selected': {
                color: '#5EA3A3 !important', // Color del texto cuando está seleccionado
                },
            }}
            >
        <Tab 
            label="Perfil de Riesgo" 
            sx={{
            fontFamily: '"Montserrat", "icomoon", sans-serif', // Ejemplo de fuente

            fontSize: '1rem', // Tamaño de fuente
            textTransform: 'none', // Evita mayúsculas
            color: '#5EA3A3',
            '&.Mui-selected': {
                color: '#488B8F',
            }
            }}
        />
        <Tab 
            label="Estado de Situacion Financiera" 
            sx={{
            fontFamily: '"Montserrat", "icomoon", sans-serif',

            fontSize: '1rem',
            textTransform: 'none',
            color: '#5EA3A3',
            '&.Mui-selected': {
                color: '#488B8F',
            }
            }}
        />
        <Tab 
            label="Estado de Resultados" 
            sx={{
            fontFamily: '"Montserrat", "icomoon", sans-serif',

            fontSize: '1rem',
            textTransform: 'none',
            color: '#5EA3A3',
            '&.Mui-selected': {
                color: '#488B8F',
            }
            }}
        />
        <Tab 
            label="Indicadores Financieros" 
            sx={{
            fontFamily: '"Montserrat", "icomoon", sans-serif',

            fontSize: '1rem',
            textTransform: 'none',
            color: '#5EA3A3',
            '&.Mui-selected': {
                color: '#488B8F',
            }
            }}
        />
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