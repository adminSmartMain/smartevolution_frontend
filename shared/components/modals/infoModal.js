// components/SecurityDialog.js
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Alert, 
  IconButton, 
  Link,
  Typography,
  Box
} from '@mui/material';
import { Lock as LockIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SecurityDialog = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Verificar si ya se mostró el mensaje hoy
    const lastShownDate = localStorage.getItem('securityDialogLastShown');
    const today = new Date().toDateString();
    
    if (lastShownDate !== today) {
      setOpen(true);
      localStorage.setItem('securityDialogLastShown', today);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="security-dialog-title"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          [theme.breakpoints.down('sm')]: {
            margin: 2,
            width: 'calc(100% - 32px)'
          }
        }
      }}
    >
      <DialogTitle id="security-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <LockIcon color="info" sx={{ mr: 1 }} />
        <Typography variant="h6" component="span">
          Seguridad de Datos
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Alert severity="info" icon={false} sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>🔒 ¡Protege los datos de nuestros clientes!</strong>
          </Typography>
          <Typography variant="body1">
            Por seguridad, nunca compartas tu usuario o clave, ni dentro ni fuera de SmartEvolution. Así garantizamos transparencia y protección en todas las transacciones.
          </Typography>
        </Alert>
        
        
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="primary"
          variant="contained"
          size="large"
          sx={{ mr: 2, mb: 2 }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SecurityDialog;