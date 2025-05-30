// components/RegisterOperationForm.js
import React from "react";

import { TextField, Autocomplete} from '@mui/material';



export default function PayerSelector( {errors,dataBills,showAllPayers,payers,values,setFieldValue,setClientPagador,setIsSelectedPayer,touched,orchestDisabled}) {

    return (

                <Autocomplete
                        id="payer-name" // Para CSS/JS si es necesario
                        data-testid="campo-pagador"
                        options={showAllPayers ? payers : values?.filteredPayers || []}
                    value={payers.find(p => p.id === values.nombrePagador) || null} // Buscar el objeto que coincide con el nombre
                    isOptionEqualToValue={(option, value) => 
                    option?.id === value?.id
                    }
                    getOptionLabel={(option) => option?.label || ''}
                    onChange={async (event, newValue) => {
                    const indicesEnModoCreacion = orchestDisabled?.filter(item => item.status === true)
                        .map(item => item.indice);

                    setIsSelectedPayer(true)
                    if (!newValue) {

                    const confirmChange = window.confirm(
                        "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
                        );
                        
                        if (!confirmChange) return;
                        setClientPagador(null);
                        setIsSelectedPayer(false);
                        
                        // 1. Identificar facturas no creadas por cuenta de inversionista
                        const facturasPorCuenta = values.facturas.reduce((acc, factura, idx) => {
                        const esCreada = orchestDisabled.find(item => item.indice === idx)?.status === true || factura.is_creada;
                        if (esCreada) return acc;
                        
                        const cuentaId = factura.idCuentaInversionista;
                        if (!acc[cuentaId]) {
                            acc[cuentaId] = [];
                        }
                        acc[cuentaId].push({ factura, index: idx });
                        return acc;
                        }, {});

                        // 2. Calcular totales por cuenta para facturas no creadas
                        Object.entries(facturasPorCuenta).forEach(([cuentaId, facturasConIdx]) => {
                        if (facturasConIdx.length > 1) {
                            const totalRestituir = facturasConIdx.reduce(
                            (sum, { factura }) => sum + factura.gastoMantenimiento + factura.presentValueInvestor, 
                            0
                            );
                            
                            // Actualizar montos disponibles manteniendo posiciones
                            facturasConIdx.forEach(({ index }) => {
                            setFieldValue(
                                `facturas[${index}].montoDisponibleCuenta`, 
                                values.facturas[index].montoDisponibleInfo
                            );
                            });
                        }
                        });

                        // 3. Resetear solo facturas no creadas manteniendo posición y orden
                        const nuevasFacturas = values.facturas.map((f, index) => {
                        const esCreada = orchestDisabled.find(item => item.indice === index)?.status === true || f.is_creada;
                        
                        if (esCreada) {
                            return f; // Mantener factura creada intacta en su posición
                        }
                        
                        // Resetear factura no creada manteniendo posición
                        return {
                            ...Object.fromEntries(
                            Object.keys(f)
                                .filter(key => ![
                                'nombreInversionista', 
                                'numbercuentaInversionista',
                                'cuentaInversionista', 
                                'idCuentaInversionista',
                                'investorBroker', 
                                'investorBrokerName',
                                'montoDisponibleCuenta', 
                                'montoDisponibleInfo'
                                ].includes(key))
                                .map(key => [key, 
                                typeof f[key] === 'number' ? 0 : 
                                key.includes('Date') || key.includes('fecha') ? new Date().toISOString().substring(0, 10) : 
                                ''
                                ])
                            ),
                            // Mantener campos del inversionista
                            nombreInversionista: f.nombreInversionista || '',
                            numbercuentaInversionista: f.numbercuentaInversionista || '',
                            cuentaInversionista: f.cuentaInversionista || '',
                            idCuentaInversionista: f.idCuentaInversionista || '',
                            investorBroker: f.investorBroker || "",
                            investorBrokerName: f.investorBrokerName || "",
                            montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                            montoDisponibleInfo: f.montoDisponibleInfo || 0,
                            is_creada: false
                        };
                        });
                        console.log("Nuevas facturas después de reset:", nuevasFacturas);

                        setFieldValue('facturas', nuevasFacturas);
                        setFieldValue('nombrePagador', '');
                        setFieldValue('filtroEmitterPagador.payer', '');
                        setFieldValue('takedBills', []);
                        
                        return;
                    }

                    // Caso 2: Cambio de pagador
                    if (values.nombrePagador && newValue.id !== values.nombrePagador) {
                        const confirmChange = window.confirm(
                        "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
                        );
                        
                        if (!confirmChange) return;
                        
                        // 1. Resetear solo facturas no creadas manteniendo posición y orden
                        const nuevasFacturas = values.facturas.map((f, index) => {
                        const esCreada = orchestDisabled.find(item => item.indice === index)?.status === true || f.is_creada;
                        
                        if (esCreada) {
                            return f; // Mantener factura creada intacta en su posición
                        }
                        
                        // Resetear factura no creada manteniendo posición
                        return {
                            ...Object.fromEntries(
                            Object.keys(f)
                                .filter(key => ![
                                'nombreInversionista', 
                                'numbercuentaInversionista',
                                'cuentaInversionista', 
                                'idCuentaInversionista',
                                'investorBroker', 
                                'investorBrokerName',
                                'montoDisponibleCuenta', 
                                'montoDisponibleInfo'
                                ].includes(key))
                                .map(key => [key, 
                                typeof f[key] === 'number' ? 0 : 
                                key.includes('Date') || key.includes('fecha') ? new Date().toISOString().substring(0, 10) : 
                                ''
                                ])
                            ),
                            // Mantener campos del inversionista
                            nombreInversionista: f.nombreInversionista || '',
                            numbercuentaInversionista: f.numbercuentaInversionista || '',
                            cuentaInversionista: f.cuentaInversionista || '',
                            idCuentaInversionista: f.idCuentaInversionista || '',
                            investorBroker: f.investorBroker || "",
                            investorBrokerName: f.investorBrokerName || "",
                            montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                            montoDisponibleInfo: f.montoDisponibleInfo || 0,
                            is_creada: false
                        };
                        });

                        // 2. Agregar factura vacía si no hay ninguna
                        if (nuevasFacturas.length === 0) {
                        nuevasFacturas.push({
                            fechaEmision: new Date().toISOString().substring(0, 10),
                            expirationDate: '',
                            valorFuturo: 0,
                            presentValueInvestor: 0,
                            gastoMantenimiento: 0,
                            is_creada: false,
                            ...(values.facturas[0] ? {
                            nombreInversionista: values.facturas[0].nombreInversionista || '',
                            numbercuentaInversionista: values.facturas[0].numbercuentaInversionista || '',
                            cuentaInversionista: values.facturas[0].cuentaInversionista || '',
                            idCuentaInversionista: values.facturas[0].idCuentaInversionista || '',
                            investorBroker: values.facturas[0].investorBroker || "",
                            investorBrokerName: values.facturas[0].investorBrokerName || "",
                            montoDisponibleCuenta: values.facturas[0].montoDisponibleInfo || 0,
                            montoDisponibleInfo: values.facturas[0].montoDisponibleInfo || 0
                            } : {})
                        });
                        }

                        setFieldValue('facturas', nuevasFacturas);
                        
                        // 3. Establecer nuevo pagador
                        setFieldValue('nombrePagador', newValue.id);
                        setClientPagador(newValue.id);
                        setFieldValue('filtroEmitterPagador.payer', newValue.data?.document_number || '');
                        
                        // 4. Cargar facturas del nuevo pagador
                        if (newValue.data?.document_number && dataBills?.data) {
                        const filteredBills = showAllPayers 
                            ? dataBills.data.filter(f => Number(f.currentBalance) > 0)
                            : dataBills.data.filter(f => 
                                f.payerId === newValue.data.document_number && 
                                Number(f.currentBalance) > 0
                            );
                        
                        setFieldValue('takedBills', filteredBills);
                        } else {
                        setFieldValue('takedBills', []);
                        }
                        
                        return;
                    }
                        // Limpiar cuando:
                        // 1. Se selecciona un pagador diferente al actual
                        // 2. Se borra manualmente (newValue === null)
                        const shouldReset = !newValue || (values.nombrePagador && newValue.id !== values.nombrePagador);
                        
                        if (shouldReset) {
                        // 1. Agrupar facturas por idCuentaInversionista
                        const facturasPorCuenta = values.facturas.reduce((acc, factura) => {
                            const cuentaId = factura.idCuentaInversionista;
                            if (!acc[cuentaId]) {
                            acc[cuentaId] = [];
                            }
                            acc[cuentaId].push(factura);
                            return acc;
                        }, {});

                        // 2. Calcular total a restituir para cuentas con múltiples facturas
                        Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
                            if (facturas.length > 1) {
                            const totalRestituir = facturas.reduce(
                                (sum, f) => sum + f.gastoMantenimiento + f.presentValueInvestor, 
                                0
                            );
                            
                            // 3. Actualizar montos disponibles
                            values.facturas.forEach((f, index) => {
                                if (f.idCuentaInversionista === cuentaId) {
                                setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                    f.montoDisponibleInfo
                                );
                                }
                            });
                            }
                        });
                        
                        // 4. Resetear solo facturas que NO están en modo creación
                        setFieldValue('facturas', values.facturas.map((f, index) => {
                            if (indicesEnModoCreacion.includes(index)) {
                            // Mantener factura sin cambios si está en modo creación
                            return f;
                            }
                            
                            // Resetear factura si NO está en modo creación
                            return {
                            ...Object.fromEntries(
                                Object.keys(f)
                                .filter(key => ![
                                    'nombreInversionista', 
                                    'numbercuentaInversionista',
                                    'cuentaInversionista', 
                                    'idCuentaInversionista',
                                    'investorBroker', 
                                    'investorBrokerName',
                                    'montoDisponibleCuenta', 
                                    'montoDisponibleInfo'
                                ].includes(key))
                                .map(key => [key, 
                                    typeof f[key] === 'number' ? 0 : 
                                    key.includes('Date') || key.includes('fecha') ? new Date().toISOString().substring(0, 10) : 
                                    ''
                                ])
                            ),
                            nombreInversionista: f.nombreInversionista || '',
                            numbercuentaInversionista: f.numbercuentaInversionista || '',
                            cuentaInversionista: f.cuentaInversionista || '',
                            idCuentaInversionista: f.idCuentaInversionista || '',
                            investorBroker: f.investorBroker || "",
                            investorBrokerName: f.investorBrokerName || "",
                            montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                            montoDisponibleInfo: f.montoDisponibleInfo || 0
                            };
                        }));

                        // 5. Limpiar campos adicionales
                        setFieldValue('nombrePagador', '');
                        setFieldValue('filtroEmitterPagador.payer', '');
                        setFieldValue('takedBills', []);
                        return;
                        }
                                                                // 1. Actualizar valores del formulario
                    setFieldValue('nombrePagador', newValue?.id || '');
                    setClientPagador(newValue?.id)
                    setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');
                    
                    // 2. Filtrar facturas si hay pagador seleccionado
                    if (newValue?.data?.document_number && dataBills?.data) {
                        if (showAllPayers) {
                        // Modo sin filtro - tomar todas las facturas con saldo positivo
                        const todasFacturasValidas = dataBills.data.filter(
                            factura => Number(factura.currentBalance) > 0
                        );
                        setFieldValue('takedBills', todasFacturasValidas);
                    
                        } else {
                        // Modo filtrado - lógica original (solo facturas del pagador seleccionado)
                        const facturasFiltradas = dataBills.data.filter(
                            factura => 
                            factura.payerId === newValue.data.document_number && 
                            Number(factura.currentBalance) > 0
                        );
                        setFieldValue('takedBills', facturasFiltradas);
                        
                        }
                    } else {
                        setFieldValue('takedBills', []); // Limpiar si no hay pagador
                    }
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Nombre Pagador *"
                        fullWidth
                        name="nombrePagador"
                        error={touched.nombrePagador && Boolean(errors?.nombrePagador)}
                        helperText={touched.nombrePagador && errors?.nombrePagador}
                    />
                    )}
                />
    )
}

