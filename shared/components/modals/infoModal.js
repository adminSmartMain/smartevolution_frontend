// components/SecurityToast.js
import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton, Link } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SecurityToast = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Verificar si ya se mostró el mensaje hoy
    const lastShownDate = localStorage.getItem('securityToastLastShown');
    const today = new Date().toDateString();
    
    if (lastShownDate !== today) {
      setOpen(true);
      localStorage.setItem('securityToastLastShown', today);
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        [theme.breakpoints.down('sm')]: {
          width: '90%',
          left: '5%',
          right: '5%'
        }
      }}
    >
      <Alert
        severity="info"
        icon={<LockIcon fontSize="inherit" />}
        onClose={handleClose}
        sx={{ width: '100%' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            &times;
          </IconButton>
        }
      >
        <strong>🔒 ¡Protege los datos de nuestros clientes!</strong>
        <br />
        Por seguridad, nunca compartas tu usuario o clave, ni dentro ni fuera de SmartEvolution. Así garantizamos transparencia y protección en todas las transacciones.
        <br />
        <Link 
          href="/politicas-seguridad" 
          underline="hover" 
          sx={{ mt: 1, display: 'inline-block' }}
        >
          ¿Por qué es importante?
        </Link>
      </Alert>
    </Snackbar>
  );
};

export default SecurityToast;