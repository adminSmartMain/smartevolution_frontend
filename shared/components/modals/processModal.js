
// components/RegisterOperationForm.js
import React from "react";

import { Button, Typography } from '@mui/material';

import { Dialog, DialogActions, DialogContent, CircularProgress } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";


export default function ProcessModal({ open, success, onClose }) {

    return (

    <>

            {/* MODAL DE PROCESO */}
            <Dialog
                open={open}
                onClose={success === null ? undefined : onClose}
                PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}
            >
                <DialogContent>
                {success === null ? (
                    <>
                    <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
                    <Typography variant="h6">Procesando...</Typography>
                    </>
                ) : success ? (
                    <>
                    <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
                    <Typography variant="h5" color="success.main">¡Registro Exitoso!</Typography>
                    </>
                ) : (
                    <>
                    <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
                    <Typography variant="h5" color="error.main">Error al Registrar</Typography>
                    </>
                )}
                </DialogContent>
                {success === false && (
                    <DialogActions>
                        <Button onClick={onClose}>Cerrar</Button>
                    </DialogActions>
                )}
            </Dialog>
    </>
    )
}
