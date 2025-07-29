// components/RegisterOperationForm.js
import React from "react";

import {  Typography,  Button } from '@mui/material';

import { Dialog,DialogContent, DialogTitle,DialogActions,} from "@mui/material";


export default function ModalIntegrationCode({ 
    values,
    showConfirmationModal, 
    setIsIntegrationCode,
    integrationCode,
    setIsFilterIntegrationActive,
    selectedFactura,
    onConfirm  // Nuevo prop
}) {
    return (
        <Dialog 
            open={showConfirmationModal} 
            onClose={() => setIsIntegrationCode(false)}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    padding: 3,
                    minWidth: 400
                }
            }}
        >
            <DialogTitle>Alerta</DialogTitle>
            <DialogContent>
                <Typography variant="body1" mb={3}>
                    Estás por seleccionar una factura con el código {integrationCode}. Solo podrás elegir otras facturas con el mismo código.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="outlined" 
                    onClick={() => setIsIntegrationCode(false)}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={onConfirm}  // Usar el prop onConfirm
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}