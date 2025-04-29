import React, { useState } from 'react';
import { Modal, Box, IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const ModalValorAGirar = ({ open, handleClose, data }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [otrosValor, setOtrosValor] = useState(data?.others || 0);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOtrosChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setOtrosValor(value);
  };

  // Usamos los datos proporcionados o un objeto vacío como fallback
  const effectiveData = data || {
    commission: 0,
    iva: 0,
    rteFte: 0,
    retIca: 0,
    retIva: 0,
    others: otrosValor, // Usamos el estado local para "Otros"
    investorValue: 0,
    netFact: 0,
    futureValue: 0,
    depositValue: 0
  };

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
                <p><strong>Comisión:</strong> {Math.round(effectiveData.commission)}</p>
                <p><strong>IVA:</strong> {Math.round(effectiveData.iva)}</p>
                <p><strong>Retefuente:</strong> {Math.round(effectiveData.rteFte)}</p>
                <p><strong>Reteica:</strong> {Math.round(effectiveData.retIca)}</p>
                <p><strong>ReteIVA:</strong> {Math.round(effectiveData.retIva)}</p>
              </div>
              <div className="modal-column">
                <p><strong>Otros:</strong> {Math.round(effectiveData.others)}</p>
                <p><strong>Valor Inversor:</strong> {Math.round(effectiveData.investorValue)}</p>
                <p><strong>Facturar Neto:</strong> {Math.round(effectiveData.netFact)}</p>
                <p><strong>Valor Futuro:</strong> {Math.round(effectiveData.futureValue)}</p>
                <p><strong>Valor a Girar:</strong> {Math.round(effectiveData.depositValue - otrosValor)}</p>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Modal Minimizada (con campo Otros editable) */}
      {open && isMinimized && (
        <Box className="modal-minimized">
          <div className="modal-minimized-content">
          
            
            <p><strong>Comisión:</strong> {Math.round(effectiveData.commission)}</p>
            <p><strong>IVA:</strong> {Math.round(effectiveData.iva)}</p>
            <p><strong>Retefuente:</strong> {Math.round(effectiveData.rteFte)}</p>
            <p><strong>Reteica:</strong> {Math.round(effectiveData.retIca)}</p>
            <p><strong>ReteIVA:</strong> {Math.round(effectiveData.retIva)}</p>
            <p><div style={{ display: 'flex', alignItems: 'center', gap: '8px' ,border:'1px solid #ccc', padding: '4px', borderRadius: '4px'}}>
                <strong style={{ minWidth: '100px' }}>Otros:</strong>
                <TextField
                  type="number"
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
                    disableUnderline: true
                  }}
                />
              </div></p>
            <p><strong>Valor Inversor:</strong> {Math.round(effectiveData.investorValue)}</p>
            <p><strong>Facturar Neto:</strong> {Math.round(effectiveData.netFact)}</p>
            <p><strong>Valor Futuro:</strong> {Math.round(effectiveData.futureValue)}</p>
            <p><strong>Valor a Girar:</strong> {Math.round(effectiveData.depositValue - otrosValor)}</p>

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