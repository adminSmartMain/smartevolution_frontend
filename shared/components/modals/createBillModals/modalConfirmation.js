// components/RegisterOperationForm.js
import React from "react";

import {  Typography,  Button } from '@mui/material';

import { Dialog,DialogContent, DialogTitle,DialogActions,} from "@mui/material";


export default function ModalConfirmation({ values,showConfirmationModal, setShowConfirmationModal, handleSubmit, actionsFormik }) {

    return (

        <>
                         {/* Modal de Confirmación usando Dialog */}
                  <Dialog 
                    open={showConfirmationModal} 
                    onClose={() => setShowConfirmationModal(false)}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        padding: 3,
                        minWidth: 400
                      }
                    }}
                  >
                    <DialogTitle>Confirmar Registro</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1" mb={3}>
                        ¿Estás seguro de registrar esta factura?
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowConfirmationModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                          setShowConfirmationModal(false);
                          handleSubmit(values,actionsFormik); // Usar formik.values o manejar según tu implementación
                        }}
                      >
                        Confirmar
                      </Button>
                    </DialogActions>
                  </Dialog>
        </>
    )
}