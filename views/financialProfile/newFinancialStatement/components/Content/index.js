//React imports
import { useEffect, useState } from "react";

import Link from "next/link";
//Next imports
import { useRouter } from "next/router";

//Material UI imports
import { Box, Button, Grid, Typography } from "@mui/material";

//Custom imports
import Header from "@components/header";
import TitleModal from "@components/modals/titleModal";
//Queries imports
import { Toast } from "@components/toast";

import BackButton from "@styles/buttons/BackButton";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import FinancialCentral from "../FinancialCentral";
import TableNet from "../TableNet";

export const FinancialStat = ({ formik, data, fetch, id, setID }) => {
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) {
      setID(router.query.id);
    }
  }, [router.query]);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [id]);

  //Number format

  const [fiancialCentralsOpened, setFiancialCentralsOpened] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleDocumentMenuClick = () => {
    setFiancialCentralsOpened(!fiancialCentralsOpened);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        sx={{
          height: "100vh",
        }}
      >
        <Grid item xs={1}>
          <Header />
        </Grid>
        <Grid
          item
          xs
          sx={{
            margin: "1% 5%",
            "@media all and (display-mode: fullscreen)": {
              margin: "0% 1%",
              paddingTop: "1vh",
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            sx={{
              "@media all and (display-mode: fullscreen)": {
                display: "none",
              },
            }}
          >
            <BackButton path={`/customers/customerList`} />
            <Typography
              letterSpacing={0}
              fontSize="1.2vw"
              fontWeight="500"
              color="#488B8F"
              marginLeft="3%"
            >
              Estado de situación financiera
            </Typography>
            <Box flexGrow={1} />

            <Link href={`/financialProfile/indicators/?id=${id}`}>
              <Button
                variant="standard"
                color="primary"
                size="large"
                sx={{
                  height: "2.6rem",
                  backgroundColor: "transparent",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#63595C"
                >
                  Visualizar indicadores
                </Typography>

                <i
                  style={{
                    color: "#63595C",
                    marginLeft: "0.7rem",
                  }}
                  className="fa-regular fa-chart-column"
                ></i>
              </Button>
            </Link>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            mt="1%"
            sx={{
              "@media all and (display-mode: fullscreen)": {
                display: "none",
              },
            }}
          >
            <Box display="flex" flexDirection="column">
              <InputTitles marginBottom={1}>N° Identificación</InputTitles>
              <Typography
                letterSpacing={0}
                fontSize="1.042vw"
                fontWeight="medium"
                color="#333333"
              >
                {data?.data?.document_number}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" marginLeft="5%">
              <InputTitles marginBottom={1}>Cliente</InputTitles>
              <Typography
                letterSpacing={0}
                fontSize="1.042vw"
                fontWeight="medium"
                color="#333333"
              >
                {`${data?.data?.first_name ?? ""} ${
                  data?.data?.last_name ?? ""
                } ${data?.data?.social_reason ?? ""}`}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" marginLeft="5%">
              <InputTitles marginBottom={1}>PERFIL DE RIESGO</InputTitles>

              {data?.data?.riskProfile === null && (
                <Link href={`/riskProfile?id=${id}`} underline="none">
                  <Button
                    variant="standard"
                    sx={{
                      backgroundColor: "#488B8F",
                      color: "#FFFFFF",
                      textTransform: "none",
                      borderRadius: "4px",
                      width: "40%",

                      "&:hover": { backgroundColor: "#5EA3A3" },
                    }}
                  >
                    <Typography
                      fontSize="0.7vw"
                      fontWeight="bold"
                      color="#FFFFFF"
                      textTransform="uppercase"
                    >
                      Cargar
                    </Typography>
                  </Button>
                </Link>
              )}
              {data?.data?.riskProfile && (
                <Link href={`/riskProfile?id=${id}`} underline="none">
                  <Button
                    variant="standard"
                    sx={{
                      backgroundColor: "#488B8F",
                      color: "#FFFFFF",
                      textTransform: "none",
                      borderRadius: "4px",
                      width: "40%",

                      "&:hover": { backgroundColor: "#5EA3A3" },
                    }}
                  >
                    <Typography
                      fontSize="0.7vw"
                      fontWeight="bold"
                      color="#FFFFFF"
                      textTransform="uppercase"
                    >
                      Ver
                    </Typography>
                  </Button>
                </Link>
              )}
            </Box>
            <Box display="flex" flexDirection="column" marginLeft="5%">
              <Button
                variant="standard"
                color="primary"
                size="large"
                sx={{
                  height: "2.6rem",
                  backgroundColor: "transparent",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                }}
                onClick={handleDocumentMenuClick}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#63595C"
                >
                  MODIFICAR CENTRALES FINANCIERAS
                </Typography>

                <i
                  style={{
                    color: "#63595C",
                    marginLeft: "0.7rem",
                  }}
                  className={`fa-regular fa-chevron-${
                    fiancialCentralsOpened ? "up" : "down"
                  }`}
                ></i>
              </Button>
            </Box>

            <Box flexGrow={1} />
            <Button
              variant="standard"
              color="primary"
              size="large"
              onClick={(e) => {
                var docElm = document.documentElement;
                setIsFullView(true);
                setIsEditing(false);
                setFiancialCentralsOpened(false);
                if (docElm.requestFullscreen) {
                  docElm.requestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                  docElm.mozRequestFullScreen();
                } else if (docElm.webkitRequestFullScreen) {
                  docElm.webkitRequestFullScreen();
                }
              }}
              sx={{
                height: "2.6rem",
                backgroundColor: "#488B8F",
                border: "1.4px solid #5EA3A3",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#5EA3A3",
                },
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#FFFFFF"
              >
                Ver en modo de presentación
              </Typography>

              <i
                style={{
                  color: "#FFFFFF",
                  marginLeft: "0.7rem",
                }}
                className="fa-regular fa-expand"
              ></i>
            </Button>
          </Box>
          <TitleModal
            open={fiancialCentralsOpened}
            handleClose={() => {
              setFiancialCentralsOpened(false);
            }}
            containerSx={{
              width: "70%",
              height: "80vh",
            }}
            title="Centrales Financieras"
          >
            <FinancialCentral
              clientId={id}
              onClose={() => {
                setFiancialCentralsOpened(false);
              }}
            />
          </TitleModal>

          <Box
            display="flex"
            flexDirection="column"
            mt="2%"
            borderTop="2px solid #A1A1A1"
            paddingTop="2%"
            sx={{
              height: "65vh",
              width: "90vw",
              ["@media (max-height: 850px)"]: {
                height: "56vh",
              },
              "@media all and (display-mode: fullscreen)": {
                border: "none",
                margin: "0px",
                paddingTop: "0",
                height: "88vh",
                width: "98vw",
              },
              ...scrollSx,
            }}
          >
            <TableNet
              clientId={id}
              isFullView={isFullView}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
