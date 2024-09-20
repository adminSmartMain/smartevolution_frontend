import { Button, Typography } from "@mui/material";

import BackButton from "@styles/buttons/BackButton";

import { Container, ContentContainer, MenuContainer } from "./styled";

import { CustomTable } from '@components/tables/table'

export const RequestsC = () => {
  return (
    <Container>
      <MenuContainer>
        <BackButton path="/dashboard" />
        <Button
          variant="standard"
          color="primary"
          size="large"
          sx={{
            height: "2.6rem",
            backgroundColor: "transparent",
            border: "1.4px solid #63595C",
            borderRadius: "4px",
            marginTop: "2rem",
            marginRight: "1rem",
          }}
          onClick={() => {
            console.log("Ver prospectos");
          }}
        >
          <Typography
            letterSpacing={0}
            fontSize="80%"
            fontWeight="bold"
            color="#63595C"
          >
            Ver prospectos
          </Typography>

          <Typography
            fontFamily="icomoon"
            fontSize="1.8rem"
            color="#63595C"
            marginLeft="0.6rem"
          >
            &#xe923;
          </Typography>
        </Button>
      </MenuContainer>
      <ContentContainer>
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          color="#5EA3A3"
          sx={{ marginTop: "3.5rem" }}
        >
          Consulta y gestión de Prospectos
        </Typography>
      </ContentContainer>
      <CustomTable />
    </Container>
  );
};
