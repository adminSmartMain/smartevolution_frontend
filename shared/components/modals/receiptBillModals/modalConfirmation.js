import React from "react";
import { Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';

// Mapeo de UUIDs a nombres descriptivos
const TYPE_MAPPING = {
  '3d461dea-0545-4a92-a847-31b8327bf033': 'Cancelado Anticipado',
  '62b0ca1e-f999-4a76-a07f-be1fe4f38cfb': 'Cancelado Vencido',
  'd40e91b1-fb6c-4c61-9da8-78d4f258181d': 'Parcial vigente',
  'db1d1fa4-e467-4fde-9aee-bbf4008d688b': 'Cancelado Vigente',
  'ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f': 'Parcial vencido',
  'edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0': 'Parcial anticipado'
};

export default function ModalConfirmation({ 
  values, 
  showConfirmationModal, 
  setShowConfirmationModal, 
  handleSubmit 
}) {
  // Función para obtener el nombre legible del tipo
  const getTypeName = (typeId) => {
    return TYPE_MAPPING[typeId] || typeId; // Devuelve el nombre mapeado o el UUID si no está en el mapeo
  };

  return (
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
          ¿Estás seguro de registrar este recaudo?
        </Typography>
        <Typography variant="body2">
          <strong>Monto:</strong> {values.payedAmount}
        </Typography>
        <Typography variant="body2">
          <strong>Tipo:</strong> {getTypeName(values.typeReceipt)}
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
            handleSubmit();
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}