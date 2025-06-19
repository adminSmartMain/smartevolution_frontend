import EastIcon from "@mui/icons-material/East";
import { Box, CircularProgress, Typography } from "@mui/material";
// components/RegisterOperationForm.js
import React from "react";
import DashboardButton from "@styles/buttons/button_3";
import SecurityToast from "@components/modals/infoModal";
export const DashboardContent = () => {



  return (
    <>
       <SecurityToast />
      <Box height="46.9vh" bgcolor="#B5D1C9" display="flex">
        <Typography
          variant="h5"
          color="#5B898E"
          alignSelf="center"
          marginLeft="5rem"
          marginRight="2rem"
        >
          <strong>
            &ldquo;¿Qué es la riqueza? Nada, si no se gasta; nada, si se
            malgasta.&rdquo;
          </strong>
          <br></br> - André Breton
        </Typography>
      </Box>
      <Box
        height="26.1vh"
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        sx={{
          overflow: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          margin="0rem 3rem"
          flexDirection="row"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            justifyContent="center"
            marginRight="2rem"
          >
            <Typography
              letterSpacing={0}
              fontSize="1rem"
              fontWeight="bold"
              marginBottom="1rem"
            >
              Cartera Colocada
            </Typography>
            <Typography
              letterSpacing={0}
              fontSize="0.8rem"
              marginBottom="0.7rem"
            >
              Detalle de <br />
              prestamos
            </Typography>

            <DashboardButton
              sx={{ justifyContent: "flex-start" }}
              endIcon={<EastIcon />}
            >
              Revisar
            </DashboardButton>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress
              variant="determinate"
              value={82}
              size="10.5vw"
              style={{
                backgroundColor: "white",
                color: "#488B8F",
                borderRadius: "50%",
              }}
              thickness={4.5}
            />
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                position="absolute"
                color="#5EA3A3"
                marginTop={-2}
                fontSize="1.8rem"
                fontWeight="light"
              >
                {82}%
              </Typography>
              <Typography
                position="relative"
                color="#333333"
                marginTop={4}
                fontSize="0.6rem"
                fontWeight="bold"
              >
                junio 2022
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          margin="0rem 3rem"
          flexDirection="row"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            justifyContent="center"
            marginRight="2rem"
          >
            <Typography
              letterSpacing={0}
              fontSize="1rem"
              fontWeight="bold"
              marginBottom="1rem"
            >
              Cartera Colocada
            </Typography>
            <Typography
              letterSpacing={0}
              fontSize="0.8rem"
              marginBottom="0.7rem"
            >
              Detalle de <br />
              prestamos
            </Typography>

            <DashboardButton
              sx={{ justifyContent: "flex-start" }}
              endIcon={<EastIcon />}
            >
              Revisar
            </DashboardButton>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress
              variant="determinate"
              value={82}
              size="10.5vw"
              style={{
                backgroundColor: "white",
                color: "#488B8F",
                borderRadius: "50%",
              }}
              thickness={4.5}
            />
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                position="absolute"
                color="#5EA3A3"
                marginTop={-2}
                fontSize="1.8rem"
                fontWeight="light"
              >
                {82}%
              </Typography>
              <Typography
                position="relative"
                color="#333333"
                marginTop={4}
                fontSize="0.6rem"
                fontWeight="bold"
              >
                junio 2022
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
