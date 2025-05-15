import React, { useState } from 'react';
import { Modal, Box, IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// Helper function to format numbers with . for thousands and , for decimals
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  const number = typeof num === 'string' ? parseFloat(num.replace(/\./g, '').replace(',', '.')) : num;
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const ModalValorAGirar = ({ open, handleClose, data }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [otrosValor, setOtrosValor] = useState(data?.others || 0);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

const handleOtrosChange = (e) => {
  const value = e.target.value;
  
  // Eliminar cualquier caracter que no sea número, punto o coma
  let sanitizedValue = value.replace(/[^0-9.,]/g, '');
  
  // Si el valor actual es "0" y el usuario empieza a escribir, eliminar el cero
  if (otrosValor === 0 && sanitizedValue.length > 0 && sanitizedValue !==0) {
    sanitizedValue = sanitizedValue.replace(/^0+/, '');
  }
  
  // Si el campo queda vacío después de borrar, poner "0"
  if (sanitizedValue === '') {
    sanitizedValue = 0;
  }
  
  setOtrosValor(sanitizedValue);
};

  // Usamos los datos proporcionados o un objeto vacío como fallback
  const effectiveData = data || {
    commission: 0,
    iva: 0,
    rteFte: 0,
    retIca: 0,
    retIva: 0,
    others: otrosValor,
    investorValue: 0,
    netFact: 0,
    futureValue: 0,
    depositValue: 0
  };

  // Convert otrosValor to number for calculations
  const otrosValorNumerico = parseFloat(otrosValor.toString().replace(/\./g, '').replace(',', '.')) || 0;

  return (
    <>
      {/* Modal Principal (NO editable) */}
      <Modal open={open && !isMinimized} onClose={handleClose}>
        <Box className="modal-container">
          <div className="modal-header">
            <h2>Valor a Girar</h2>
            <div>
              <IconButton onClick={handleMinimize}>
                <MinimizeIcon />
              </IconButton>
              <IconButton onClick={handleClose}>
                <ClearIcon />
              </IconButton>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-row">
              <div className="modal-column">
                <p><strong>Comisión:</strong> {formatNumber(effectiveData.commission)}</p>
                <p><strong>IVA:</strong> {formatNumber(effectiveData.iva)}</p>
                <p><strong>Retefuente:</strong> {formatNumber(effectiveData.rteFte)}</p>
                <p><strong>Reteica:</strong> {formatNumber(effectiveData.retIca)}</p>
                <p><strong>ReteIVA:</strong> {formatNumber(effectiveData.retIva)}</p>
              </div>
              <div className="modal-column">
                <p><strong>Otros:</strong> {formatNumber(otrosValorNumerico || effectiveData.others)}</p>
                <p><strong>Valor Inversor:</strong> {formatNumber(effectiveData.investorValue)}</p>
                <p><strong>Facturar Neto:</strong> {formatNumber(effectiveData.netFact)}</p>
                <p><strong>Valor Futuro:</strong> {formatNumber(effectiveData.futureValue)}</p>
                <p><strong>Valor a Girar:</strong> {formatNumber(effectiveData.depositValue - otrosValorNumerico)}</p>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Modal Minimizada (con campo Otros editable) */}
      {open && isMinimized && (
        <Box className="modal-minimized">
          <div className="modal-minimized-content">
            <p><strong>Comisión:</strong> {formatNumber(effectiveData.commission)}</p>
            <p><strong>IVA:</strong> {formatNumber(effectiveData.iva)}</p>
            <p><strong>Retefuente:</strong> {formatNumber(effectiveData.rteFte)}</p>
            <p><strong>Reteica:</strong> {formatNumber(effectiveData.retIca)}</p>
            <p><strong>ReteIVA:</strong> {formatNumber(effectiveData.retIva)}</p>
            <p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ccc', padding: '4px', borderRadius: '4px' }}>
                <strong style={{ minWidth: '100px' }}>Otros:</strong>
                <TextField
                  value={otrosValor}
                  onChange={handleOtrosChange}
                  variant="standard"
                  size="small"
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      padding: '4px 0 4px 4px',
                      fontSize: '0.875rem'
                    },
                    '& .MuiInput-root': {
                      '&:before': { borderBottom: 'none' },
                      '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                    },
                    width: '100px'
                  }}
                  InputProps={{
                    disableUnderline: true,
                    inputProps: {
                      inputMode: 'decimal',
                      pattern: '[0-9,.]*'
                    }
                  }}
                />
              </div>
            </p>
            <p><strong>Valor Inversor:</strong> {formatNumber(effectiveData.investorValue)}</p>
            <p><strong>Facturar Neto:</strong> {formatNumber(effectiveData.netFact)}</p>
            <p><strong>Valor Futuro:</strong> {formatNumber(effectiveData.futureValue)}</p>
            <p><strong>Valor a Girar:</strong> {formatNumber(effectiveData.depositValue - otrosValorNumerico)}</p>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <IconButton onClick={handleMinimize}>
                <FullscreenIcon />
              </IconButton>
              <IconButton onClick={handleClose}>
                <ClearIcon />
              </IconButton>
            </Box>
          </div>
        </Box>
      )}
    </>
  );
};

export default ModalValorAGirar;