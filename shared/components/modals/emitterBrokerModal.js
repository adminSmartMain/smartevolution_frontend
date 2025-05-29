// components/RegisterOperationForm.js
import React from "react";
import {  Box, Modal, Typography, Button, } from '@mui/material';


export default function EmitterBrokerModal({openEmitterBrokerModal, setOpenEmitterBrokerModal, clientWithoutBroker}) {

    return (

        <>
            <Modal open={openEmitterBrokerModal}   onClose={() => setOpenEmitterBrokerModal(false)}>
                <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 1
                }}>
                <Typography variant="h6" gutterBottom>
                    Corredor no asignado
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    El emisor seleccionado no tiene un corredor asignado. Debe asignar un corredor antes de continuar con el registro.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                        onClick={() => setOpenEmitterBrokerModal(false)}
                    variant="outlined"
                    color="secondary"
                    >
                    Cancelar
                    </Button>
                    <Button 
                        onClick={() => {
                        window.open(`${window.location.origin}/customers?modify=${clientWithoutBroker}`, '_blank');
                        setOpenEmitterBrokerModal(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Asignar Corredor
                        </Button>
                </Box>
                </Box>
            </Modal>
</>
    )
}