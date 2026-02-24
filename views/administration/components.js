import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";

import BackButton from "@styles/buttons/BackButton";
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Skeleton from '@mui/material/Skeleton';
import {
  Home as HomeIcon,

} from "@mui/icons-material";
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
                                          color: '#488b8f',
                                          opacity: 0.8, // Ajusta la transparencia (0.8 = 80% visible)
                                          strokeWidth: 1, // Grosor del contorno
                                        }} 
                                      />

              </a>

            </Link>
                    <Link
                      underline="hover"
                      color="#5EA3A3"
                      href="/administration"
                      sx={{ fontSize: "1.3rem" }}
                    >
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
      >
        
        <Link
          href="/administration/deposit-emitter/depositList"
          underline="none"
        >
          <Box
            height="100%"
            width="19%"
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
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box flexGrow={0} />
            <Box textAlign="center">
              <i
                className="fa-regular fa-paper-plane"
                style={{
                  fontSize: "3rem",
                  color: "#488B8F",
                  marginBottom: "1.5rem",
                }}
              ></i>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Giros Emisor
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                border: "2px solid #488B8F",
                padding: "0.5rem 0.7rem",
                marginBottom: "3rem",
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Acceder a esta sección
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                }}
              />
            </Box>
          </Box>
        </Link>
        <Link
          href="/administration/deposit-investor/depositList"
          underline="none"
        >
          <Box
            height="100%"
            width="19%"
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
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box flexGrow={0} />
            <Box textAlign="center">
              <i
                className="fa-regular fa-paper-plane"
                style={{
                  fontSize: "3rem",
                  color: "#488B8F",
                  marginBottom: "1.5rem",
                }}
              ></i>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Giros Inversionista
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                border: "2px solid #488B8F",
                padding: "0.5rem 0.7rem",
                marginBottom: "3rem",
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Acceder a esta sección
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                }}
              />
            </Box>
          </Box>
        </Link>
        <Link
          href="/administration/negotiation-summary/summaryList"
          underline="none"
        >
          <Box
            height="100%"
            width="19%"
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
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box flexGrow={0} />
            <Box textAlign="center">
              <i
                className="fa-regular fa-handshake"
                style={{
                  fontSize: "3rem",
                  color: "#488B8F",
                  marginBottom: "1.5rem",
                }}
              ></i>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Negociaciones
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                border: "2px solid #488B8F",
                padding: "0.5rem 0.7rem",
                marginBottom: "3rem",
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Acceder a esta sección
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                }}
              />
            </Box>
          </Box>
        </Link>
        <Link href="/administration/refund/refundList" underline="none">
          <Box
            height="100%"
            width="19%"
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
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box flexGrow={0} />
            <Box textAlign="center">
              <i
                className="fa-solid fa-person-walking-arrow-loop-left"
                style={{
                  fontSize: "3rem",
                  color: "#488B8F",
                  marginBottom: "1.5rem",
                }}
              ></i>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Reintegros
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                border: "2px solid #488B8F",
                padding: "0.5rem 0.7rem",
                marginBottom: "3rem",
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Acceder a esta sección
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                }}
              />
            </Box>
          </Box>
        </Link>
        <Link href="/administration/new-receipt/receiptList" underline="none">
          <Box
            height="100%"
            width="19%"
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
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box flexGrow={0} />
            <Box textAlign="center">
              <i
                className="fa-light fa-coin"
                style={{
                  fontSize: "3rem",
                  color: "#488B8F",
                  marginBottom: "1.5rem",
                }}
              ></i>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Recaudos
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                border: "2px solid #488B8F",
                padding: "0.5rem 0.7rem",
                marginBottom: "3rem",
              }}
            >
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#488B8F"
                textTransform="uppercase"
              >
                Acceder a esta sección
              </Typography>
              <ArrowBackIcon
                sx={{
                  color: "#488B8F",
                  transform: "rotate(180deg)",
                  marginLeft: "0.5rem",
                }}
              />
            </Box>
          </Box>
        </Link>
      </Box>
    </>
  );
};
