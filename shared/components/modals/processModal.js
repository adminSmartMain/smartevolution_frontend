
// components/RegisterOperationForm.js
import React from "react";

import {  Typography } from '@mui/material';

import { Dialog,DialogContent,CircularProgress} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";


export default function ProcessModal({  success }) {

    return (

    <>

            {/* MODAL DE PROCESO */}
            <Dialog  open={false} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
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
            </Dialog>
    </>
    )
}