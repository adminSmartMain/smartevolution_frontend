import React from "react";
import { Typography, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { CheckCircle, Error } from "@mui/icons-material";

export default function ProcessModal({ open, success, onClose }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: "10px", 
          textAlign: "center", 
          p: 3,
          minWidth: 300
        } 
      }}
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
            <Typography variant="h5" color="success.main">
              ¡Registro Exitoso!
            </Typography>
          </>
        ) : (
          <>
            <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
            <Typography variant="h5" color="error.main">
              Error al Registrar
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}