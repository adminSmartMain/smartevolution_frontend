

import { Box, Typography } from "@mui/material";

import Modal from "@components/modals/modal";


import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";

import InputTitles from "@styles/inputTitles";

export const ClientDeleteModal = ({

    handleClose,
    open,
    handleDelete,
})=>{


    return (

        <>
        <Modal open={open[0]} handleClose={handleClose}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                width="100%"
              >
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                >
                  ¿Estás seguro que deseas eliminar a
                </Typography>
                <InputTitles mt={2} sx={{ fontSize: "1.1vw" }}>
                  {open[1]}
                </InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  mt={2}
                >
                  de los clientes?
                </Typography>
                <Typography
                  letterSpacing={0}
                  fontSize="0.8vw"
                  fontWeight="medium"
                  color="#333333"
                  mt={3.5}
                >
                  Si eliminas a este cliente, no podrás recuperarlo.
                </Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  mt={4}
                >
                  <GreenButtonModal onClick={handleClose}>
                    Volver
                  </GreenButtonModal>
                  <RedButtonModal
                    sx={{
                      ml: 2,
                    }}
                    onClick={() => handleDelete(open[2])}
                  >
                    Eliminar
                  </RedButtonModal>
                </Box>
              </Box>
            </Modal>
        </>
    )
}