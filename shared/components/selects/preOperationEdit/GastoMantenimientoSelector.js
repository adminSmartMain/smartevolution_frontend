import React from "react";
import { Box, Typography, Switch, TextField } from '@mui/material';

export default function GM({ values, setFieldValue, formatCurrency, parseFloat }) {

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        const valorGm = values.presentValueInvestor * 0.002;
        
        // Actualizar estado del GM
        setFieldValue('applyGm', isChecked);
        setFieldValue('GM', isChecked ? valorGm : 0);
        
        // Calcular nuevo monto disponible
        const baseAmount = Number(values.montoDisponibleInfo) - Number(values.presentValueInvestor);
        const newAmount = isChecked ? baseAmount - valorGm : baseAmount;
        setFieldValue('montoDisponibleCuenta', newAmount);
    };

    const handleGmChange = (e) => {
        const nuevoValor = parseFloat(e.target.value) || 0;
        
        // Actualizar valor de GM
        setFieldValue('GM', nuevoValor);
        
        // Calcular nuevo monto disponible
        const newAmount = Number(values.montoDisponibleInfo) - Number(values.presentValueInvestor) - nuevoValor;
        setFieldValue('montoDisponibleCuenta', newAmount);
    };

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1,
                p: 1,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                borderRadius: 2,
                boxShadow: 0,
                bgcolor: 'background.paper',
                width: '100%',
            }}
        >
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                Gasto de Mantenimiento (GM)
            </Typography>
            <Switch
                checked={values.applyGm || false}
                onChange={handleSwitchChange}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#488B8F',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#488B8F',
                    },
                }}
            />
            <TextField
                type="text"
                placeholder="$ 0,00"
                id="GMname"
                data-testid="campo-GM"
                value={formatCurrency(values.GM) ?? 0}
                onChange={handleGmChange}
                disabled
                size="small"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                fullWidth
                variant="outlined"
                sx={{
                    backgroundColor: values.applyGm ? "background.paper" : "action.disabledBackground",
                    color: values.applyGm ? "text.primary" : "text.disabled",
                }}
            />
        </Box>
    );
}