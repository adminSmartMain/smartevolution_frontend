import React from "react";
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

export default function CuentaInversionistaSelector({ index, factura, values, setFieldValue, parseFloat, touched, errors }) {
    // Determinar si está cargando
    const isLoading = !values.accountsInvestorArray; // Esto será true mientras no haya datos

    return (
        <Autocomplete
        
            options={values?.accountsInvestorArray?.data || []}
            
            getOptionLabel={(option) =>
                option?.account_number ||
                option?.number ||
                option?.id ||
                'Sin número de cuenta'
            }
            value={
                values?.accountsInvestorArray?.data?.find(account =>
                    String(account?.id) === String(values?.clientAccount)
                ) ?? null
            }
            isOptionEqualToValue={(option, value) =>
                String(option?.id) === String(value?.id)
            }
            onChange={(event, newValue) => {
                if (!newValue) {
                    setFieldValue('montoDisponibleCuenta', 0);
                    setFieldValue('montoDisponibleInfo', 0);
                    setFieldValue('investorTax', 0);
                    setFieldValue('cuentasDelInversionistaSelected', []);
                    setFieldValue('numbercuentaInversionista', '');
                    setFieldValue('client', '');
                    setFieldValue('clientAccount', '');
                }
                if (newValue) {
                    setFieldValue('clientAccount', newValue?.id);
                    setFieldValue('montoDisponibleCuenta', newValue?.balance - values?.presentValueInvestor - values?.GM);
                    setFieldValue('montoDisponibleInfo', newValue?.balance || 0);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cuenta Inversionista*"
                    fullWidth
                    variant="outlined"
                    error={touched.investorAccountInfo?.investorAccountid && Boolean(errors.investorAccountInfo?.investorAccountid)}
                    helperText={touched.investorAccountInfo?.investorAccountid && errors.investorAccountInfo?.investorAccountid}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading && <CircularProgress size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
            noOptionsText="No hay cuentas disponibles"
            disabled={!values.investor}
            loading={isLoading} // Propiedad de loading de Autocomplete
        />
    );
}