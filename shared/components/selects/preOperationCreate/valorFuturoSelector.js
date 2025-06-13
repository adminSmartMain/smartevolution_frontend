// components/RegisterOperationForm.js
import React from "react";

import { TextField, InputAdornment, } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar

import { PV } from "@formulajs/formulajs";


export default function ValorFuturoSelector({parseFloat,index,factura,formatNumberWithThousandsSeparator,dataBills,values,setFieldValue,errors,touched}) {
        return(

        <TextField
                id="amountname" // Para CSS/JS si es necesario
                    data-testid="campo-valorFuturo"
                label="Valor Futuro"
                fullWidth
                type="text" // Usamos tipo "text" para manejar el formato
                value={factura.valorFuturo ? formatNumberWithThousandsSeparator(factura.valorFuturo) : 0} // Usar 0 como valor predeterminado
                onChange={(e) => {
                    // Eliminar caracteres no numéricos para mantener el valor limpio
                    
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    let valorFuturoManual = parseFloat(rawValue) || 0;

                    if (valorFuturoManual > factura.saldoDisponibleInfo) {
                    valorFuturoManual =factura.saldoDisponibleInfo;
                    }
                
                    // Obtener el saldo disponible actual de la factura seleccionada
                    const saldoDisponibleActual = factura.saldoDisponible || 0;

                    // Calcular el saldo disponible total de la factura original
                    const saldoDisponibleTotal = dataBills?.data.find((f) => f.billId === factura.factura)?.currentBalance || 0;

                    // Calcular el valor futuro total de todas las instancias de la misma factura
                    const valorFuturoTotal = values.facturas
                    .filter((f) => f.factura === factura.factura)
                    .reduce((sum, f) => sum + (f.valorFuturo || 0), 0);

                

                    // Calcular la diferencia entre el nuevo valor futuro y el valor anterior
                    const diferenciaValorFuturo = valorFuturoManual - (factura.valorFuturo || 0);
                

                    // Calcular el valor nominal (valorFuturo * porcentajeDescuento)
                    const valorNominal = valorFuturoManual * (factura.porcentajeDescuento || 0)/100;

                    // Actualizar el valor futuro
                    setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                    setFieldValue(`facturas[${index}].valorFuturoManual`, true);

                    // Actualizar el valor nominal
                    setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
                    setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
                    // Actualizar el saldo disponible de la factura actual
                    const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo || 0;
                    
                    setFieldValue(`facturas[${index}].saldoDisponible`, nuevoSaldoDisponible);
                
                    {/* // Actualizar el saldo disponible en todas las facturas con el mismo billId
                    values.facturas.forEach((f, i) => {
                    if (f.factura === factura.factura && i !== index) {
                        const saldoDisponiblePosterior = f.saldoDisponible || 0;
                        const nuevoSaldoDisponiblePosterior = saldoDisponiblePosterior - diferenciaValorFuturo;
                        setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponiblePosterior, 0);
                    }
                    });*/}
                    
                    // Actualizar saldo disponible en facturas con mismo billId (versión para facturas creadas)
                    values.facturas.forEach((f, i) => {
                        // 1. Validar que sea una factura con el mismo billId pero diferente índice
                        if (f.billId === factura.billId && i !== index) {
                        
                        // 2. Calcular nuevo saldo con protección contra valores inválidos
                        const saldoActual = f.saldoDisponible || 0;
                        const diferencia = diferenciaValorFuturo || 0;
                        const nuevoSaldo = saldoActual - diferencia;
                        
                        // 3. Asegurar que el saldo no sea negativo
                        const saldoFinal =nuevoSaldo;
                        
                        // 4. Actualizar solo si hay cambio real
                        if (saldoActual !== saldoFinal) {
                            
                            
                            setFieldValue(`facturas[${i}].saldoDisponible`, saldoFinal);
                            
                            
                        }
                        }
                    });
                    
                    if (values.opDate) {
                    
                    const operationDays = factura.operationDays 
                    const presentValueInvestor = operationDays > 0 && valorNominal > 0
                    ? Math.round(PV(values.investorTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                    : valorFuturoManual;

                    const nuevoInvestorProfit =  valorNominal -presentValueInvestor;
                    setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoInvestorProfit).toFixed(0));
                    // 2. Calcular el total acumulado de presentValueInvestor para el mismo inversionista
                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, factura.montoDisponibleInfo-presentValueInvestor, 0);
                    const presentValueInvesTotal = values.facturas
                    .filter((f, i) => 
                        f.idCuentaInversionista === factura.idCuentaInversionista && 
                        i !== index  // Excluir la factura actual del acumulado
                    )
                    .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
                    + presentValueInvestor;  // Sumar el valor recién calculado
                    
                    
                    const presentValueSF =  operationDays > 0 && valorNominal > 0
                        ? Math.round(PV(values.discountTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                        : valorFuturoManual;
                    
                        // Calcular el presentValueInvestor total de todas las facturas del mismo inversionista
                    
                    setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                    setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0); // Actualizar el valor
                    setFieldValue(`facturas[${index}].comisionSF`,presentValueInvestor- presentValueSF || 0)
                    if(values.facturas[index].applyGm) {
                        setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor * 0.002);
                    } else {
                    setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);} 
                    
                    //setFieldValue(`facturas[${index}].montoDisponibleCuenta`,factura.montoDisponibleInfo - presentValueInvestor || 0); // Actualizar el valor
                    // Actualizar el monto disponible en todas las facturas con el mismo nombreInversionista

                

                    
                
                    // 1. Encontrar TODAS las facturas con el mismo billId (incluyendo la actual)
                    const facturasMismoBillId = values.facturas.filter(item => item.idCuentaInversionista === factura.idCuentaInversionista);
                    const facturasMismoInvestor = values.facturas.filter(item => 
                        Boolean(item.idCuentaInversionista) && 
                        item.idCuentaInversionista === factura.idCuentaInversionista
                    );
                    

                    
                    values.facturas.forEach((f, i) => {
                        if (f.idCuentaInversionista=== factura.idCuentaInversionista && f.idCuentaInversionista ) {
                        
                        const montoDisponibleActualizado = f.montoDisponibleInfo  - presentValueInvesTotal;
                        
                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleActualizado, 0);
                        
                        } else if (f.idCuentaInversionista!== factura.idCuentaInversionista && f.idCuentaInversionista )  {
                        
                        
                    }});      
                    
                    
                    
            
                            }
                }}
                onFocus={(e) => {
                    // Al hacer foco, removemos el formato para permitir la edición del valor numérico
                    e.target.value = factura.valorFuturo ? factura.valorFuturo.toString() : "";
                }}
                onBlur={(e) => {
                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    const valorFuturoManual = parseFloat(rawValue) || 0;
                    setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                }}
                placeholder={`Sugerido: ${factura.saldoDisponible && factura.fraccion ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) : ""}`} // Aseguramos que el placeholder muestre el valor formateado como número entero
                helperText={
                    !factura.valorFuturoManual
                    ? `Sugerido: ${factura.saldoDisponible && factura.fraccion ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) : ""}`
                    : "Valor ingresado manualmente"
                }
                error={touched.facturas?.[index]?.valorFuturo && Boolean(errors.facturas?.[index]?.valorFuturo)}
            
                InputProps={{
                    min: 0,
                    startAdornment: (
                    <InputAdornment position="start">
                        <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                    </InputAdornment>
                    ),
                }}
                />
        )
 

}
