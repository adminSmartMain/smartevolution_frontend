import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton,
  Typography
} from '@mui/material';
import { Lock as LockIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CHRISTMAS_IMAGE =
  'https://devsmartevolution.s3.us-east-1.amazonaws.com/Imagenes/tarjeta-navidad+v3.png';

const SecurityDialog = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isDecember, setIsDecember] = useState(false);

  useEffect(() => {
    // 🛡️ solo navegador
    if (typeof window === 'undefined') return;

    const today = new Date().toDateString();
    const lastShownDate = localStorage.getItem('securityDialogLastShown');

    // detectar mes
    const month = new Date().getMonth(); // 0=ene ... 11=dic
    setIsDecember(month === 11);

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
      {isDecember ? (
        // 🎄 DICIEMBRE → TARJETA NAVIDAD
        <>
          <DialogContent
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 3,
  }}
>
  <img
    src={CHRISTMAS_IMAGE}
    alt="Tarjeta de Navidad"
    style={{
      maxWidth: '820px',   // 👈 controla tamaño
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
    }}
  />
</DialogContent>


          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              size="large"
              sx={{ mr: 2, mb: 2 }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </>
      ) : (
        // 🔒 ENERO – NOVIEMBRE → SEGURIDAD
        <>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h6">Seguridad de Datos</Typography>

            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500]
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
                Por seguridad, nunca compartas tu usuario o clave, ni dentro ni
                fuera de SmartEvolution. Así garantizamos transparencia y
                protección en todas las transacciones.
              </Typography>
            </Alert>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              size="large"
              sx={{ mr: 2, mb: 2 }}
            >
              Entendido
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default SecurityDialog;
