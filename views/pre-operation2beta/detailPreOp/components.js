// components/RegisterOperationForm.js
import React, { useEffect, useState } from "react";
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { Bills, billById, GetOperationById,GetBillFraction,GetRiskProfile, payerByBill,BrokerByClient,AccountsFromClient } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, parseISO, set, isValid } from "date-fns";
export const ManageOperationDetails = ({
  opId,
  emitters,
  investors,
  dataDetails,
  users,
}) => {
  console.log('data details',dataDetails)
  const emisores = emitters;
  const tipoOperaciones = ['Compra Título', 'Lorem Ipsum', 'Lorem Ipsum'];
  
      // Encontrar el usuario que coincide con dataDetails.user_id
const usuarioEncontrado = users?.data?.find(user => user.id === dataDetails?.data?.user_created_at);

console.log(usuarioEncontrado)

  // Formatear monto como moneda colombiana
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value);

// Función para formatear el número con separadores de miles
const formatNumberWithThousandsSeparator = (value) => {
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Agrega separadores de miles
};

const validationSchema = Yup.object({
  numeroOperacion: Yup.number()
    .required('Este campo es obligatorio')
    .typeError('Debe ser un número válido'), // Validación para campo numérico
  fechaOperacion: Yup.date().required('Este campo es obligatorio'),
  tipoOperacion: Yup.string()
    .required('Este campo es obligatorio')
    .oneOf(tipoOperaciones, 'Tipo de operación no válido'),
  nombreEmisor: Yup.string().required('Este campo es obligatorio'),
  corredorEmisor: Yup.string().required('Este campo es obligatorio'),
  nombrePagador: Yup.string().required('Este campo es obligatorio'),
  facturas: Yup.array().of(
    Yup.object({
      nombreInversionista: Yup.string().required('Este campo es obligatorio'),
      cuentaInversionista: Yup.string().required('Este campo es obligatorio'),
      factura: Yup.string().required('Este campo es obligatorio'),
      fraccion: Yup.number().required('Este campo es obligatorio'),
      valorFuturo: Yup.number()
        .required('Este campo es obligatorio')
        .typeError('Debe ser un número válido'),
      porcentajeDescuento: Yup.number()
        .required('Este campo es obligatorio')
        .min(0, 'El descuento no puede ser menor a 0%')
        .max(100, 'El descuento no puede ser mayor a 100%'),
      fechaEmision: Yup.date().required('Este campo es obligatorio'),
      valorNominal: Yup.number().required('Este campo es obligatorio'),
      tasaInversionista: Yup.number().required('Este campo es obligatorio'),
      fechaFin: Yup.date().required('Este campo es obligatorio'),
      diasOperaciones: Yup.date().required('Este campo es obligatorio'),
      comisionSF: Yup.number().required('Este campo es obligatorio'),
      gastoMantenimiento: Yup.number().required('Este campo es obligatorio'),
    })
  ),
});
  const [] = useState([
    { id: 1, titulo: "Factura 1", contenido: "Detalles de Factura 1" }
  ]);
  const [expanded, setExpanded] = useState(0); // Primer acordeón abierto por defecto

  const handleChange = (index) => (_event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const initialValues = {
    numeroOperacion: dataDetails.opId, // Valor por defecto (correlativo)
    fechaOperacion: new Date(), // Fecha actual por defecto
    tipoOperacion: 'Compra Título', // Valor por defecto
    nombreEmisor: '',
    corredorEmisor: '',
    nombrePagador: '',
    tasaInversionista: 0,
    tasaDescuento:0,
    facturas: [
      {
        nombreInversionista: '',
        cuentaInversionista: '',
        factura: '',
        fraccion: 1,
        valorFuturo: '',
        valorFuturoManual: false, // Rastrea si el valor futuro ha sido editado manualmente
        fechaEmision: null,
        valorNominal: 0,
        porcentajeDescuento:0,
        fechaFin: null,
        diasOperaciones: '',
        comisionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,

      },
    ],
  };

    


  const handleSubmit = (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario
  };
  





  // Función para calcular el valor nominal basado en el valor futuro y el porcentaje de descuento
  const calcularValorNominal = (valorFuturo, porcentajeDescuento) => {
    return valorFuturo * (1 - porcentajeDescuento / 100);
  };

// Función para calcular el porcentaje de descuento basado en el valor futuro y el valor nominal
const calcularPorcentajeDescuento = (valorFuturo, valorNominal) => {
  if (valorFuturo === 0) return 0;
  return ((1 - valorNominal / valorFuturo) * 100).toFixed(2);
};

//Formatear la fecha en la cabecera del acordeon. 
const formatDate = (date) => {
  if (!date) return "N/A";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
  {/* Para mostrar los toast */}
  <ToastContainer position="top-right" autoClose={5000} />
  <Box sx={{ padding: 3 }}>
       <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 3 
      }}
    >
            <Typography variant="h4" gutterBottom>
              Ver Operación
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Creado por : 
        {usuarioEncontrado?.social_reason 
          ? usuarioEncontrado?.social_reason 
          : `${usuarioEncontrado?.first_name} ${usuarioEncontrado?.last_name}`}
      </Typography>
      </Box>

    <Grid container spacing={2}>
      {/* Número de Operación */}
      <Grid item xs={12} md={1.5}>
        <TextField
          label="Número de Operación *"
          fullWidth
          type="text"
          value={dataDetails?.data?.opId || ""}
          InputProps={{ readOnly: true }}
          disabled
        />
      </Grid>

      {/* Fecha de Operación */}
      <Grid item xs={12} md={1.5}>
        <TextField
          label="Fecha de Operación *"
          fullWidth
          type="text"
          value={dataDetails?.data?.opDate|| ""}
          InputProps={{ readOnly: true }}
          disabled
        />
      </Grid>

      {/* Tipo de Operación */}
      <Grid item xs={12} md={2}>
        <TextField
          label="Tipo de Operación"
          fullWidth
          type="text"
          value={dataDetails?.data?.opType.description || ""}
          InputProps={{ readOnly: true }}
          disabled
        />
      </Grid>

      {/* Emisor */}
      <Grid item xs={12} md={4}>
        <TextField
          label="Emisor"
          fullWidth
          type="text"
          value={(dataDetails?.data?.emitter.first_name && dataDetails?.data?.emitter.last_name) ? `${dataDetails.data.emitter.first_name} ${dataDetails.data.emitter.last_name}` : dataDetails?.data?.emitter.social_reason}
          InputProps={{ readOnly: true }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
      </Grid>

      {/* Corredor Emisor */}
      <Grid item xs={12} md={3}>
        <TextField
          label="Corredor Emisor"
          fullWidth
          type="text"
          value={(dataDetails?.data?.emitterBroker.first_name && dataDetails?.data?.emitterBroker.last_name) ? `${dataDetails.data.emitterBroker.first_name} ${dataDetails.data.emitterBroker.last_name}` : dataDetails?.data?.emitterBroker.social_reason}
          InputProps={{ readOnly: true }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
      </Grid>
      
      <Grid item xs={12}>
                          {/* Contenedor principal para el botón de eliminar y el acordeón */}
                          <Grid container alignItems="flex-start" spacing={2}>
                            
                            {/* Acordeón */}
                            <Grid item xs>
                              
                                <Grid container alignItems="center" spacing={2}>
                                {/* Número de factura de la cabecera del acordeon */}
                                <Grid item>
                                  <Typography>
                                    {dataDetails?.data?.bill?.billId }
                                  </Typography>
                                </Grid>
                                {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                <Grid item>
                                  <Typography variant="body2" color="textSecondary">
                                    Emisión: {dataDetails?.data?.bill?.dateBill ? formatDate(dataDetails?.data?.bill?.dateBill) : "-- -- ----"} | 
                                    Vencimiento: {dataDetails?.data?.bill?.expirationDate ? formatDate(dataDetails?.data?.bill?.expirationDate) : "-- -- ----"}
                                  </Typography>
                                </Grid>
                              </Grid>
                               
                                  <Grid container spacing={3}>
                                    <Grid item xs={12} md={2}>
                                    <TextField
                                        label="Número de Factura *"
                                        fullWidth
                                        type="text"
                                        value={dataDetails?.data?.bill?.billId || ""}
                                        disabled
                                      />
                                     
                                    </Grid>

                                    {/* Fracción */}
                                    <Grid item xs={12} md={1}>
                                        <TextField
                                          label="Fracción"
                                          fullWidth
                                          type="number"
                                          value={dataDetails?.data?.billFraction || 1}  // Valor por defecto si no existe fracción
                                          disabled
                                        />
                                      </Grid>

                                      {/* Saldo Disponible de la factura */}
                                      <Grid item xs={12} md={3}>
                                        <TextField
                                          label="Saldo Disponible en factura"
                                          fullWidth
                                          value={formatCurrency(dataDetails?.data?.bill?.currentBalance || 0)}
                                          disabled
                                          
                                        />
                                      </Grid>
                                       {/* Fecha Probable*/}
                                      <Grid item xs={12} md={1.5}>
                                       <TextField
                                          label="Fecha Probable"
                                          fullWidth
                                          value={dataDetails?.data?.probableDate || 0}
                                          disabled
                                        />
                                      </Grid> 
                                     
                                      {/* Nombre de Inversionista */}
                                      <Grid item xs={12} md={4.5}>

                                      <TextField
                                          label="Nombre Inversionista / ID *"
                                          fullWidth
                                          value={(dataDetails?.data?.investor.first_name && dataDetails?.data?.investor.last_name) ? `${dataDetails.data.investor.first_name} ${dataDetails.data.investor.last_name}` : dataDetails?.data?.investor.social_reason}
                                          disabled
                                          InputLabelProps={{ shrink: true }}
                                        />
                                     
                                      </Grid>

                                      {/* Cuenta de Inversionista */}
                                      <Grid item xs={12} md={3}>

                                        
                                       <TextField
                                         
                                          value={dataDetails?.data?.clientAccount?.account_number|| 'no hay'} // Mostrar el corredor asignado // Evitar errores de comparación con null// Comparación correcta
                                          label="Cuenta Inversionista *"
                                          fullWidth
                                          disabled
                                        />
                                      </Grid>
                                      {/*Monto disponible en cuenta inversionista */}                                    
                                      <Grid item xs={12} md={3}>
                                        <TextField
                                          label="Monto Disponible Cuenta Inversionista"
                                          fullWidth
                                          value={formatCurrency(dataDetails?.data?.clientAccount?.balance || 0)}
                                          disabled // Deshabilita la edición manual
                                        />
                                      </Grid>
                                    {/*Selector de Pagadores*/}
                                    <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre Pagador"
                                        fullWidth
                                        type="text" // Usamos tipo "text" para manejar el formato
                                        value={(dataDetails?.data?.payer.first_name && dataDetails?.data?.payer.last_name) ? `${dataDetails.data.payer.first_name} ${dataDetails.data.payer.last_name}` : dataDetails?.data?.payer.social_reason} // Aplicamos el formato solo en la visualización, usando Math.floor para eliminar decimales
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </Grid>
                                    {/* Valor Futuro */}
                                    <Grid item xs={12} md={3} style={{ position: 'relative' }}>
                                      <TextField
                                        label="Valor Futuro"
                                        fullWidth
                                        type="text" // Usamos tipo "text" para manejar el formato
                                        value={dataDetails?.data?.amount ? formatNumberWithThousandsSeparator(Math.floor(dataDetails?.data?.clientAccount?.balance )) : ""} // Aplicamos el formato solo en la visualización, usando Math.floor para eliminar decimales
                                        disabled
                                      />
                                      {/** Ícono Infotip con Tooltip */}
                                      <Tooltip 
                                        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis eros, elementum et egestas sit amet, ullamcorper non purus.
                                        Donec id tincidunt mauris, non consequat dolor. Duis semper elementum rutrum. In hac habitasse platea dictumst. Pellentesque et felis interdum, efficitur nulla ut, vestibulum risus."
                                        placement="top-end" // Cambiar la posición para que esté a la derecha, alineado con el campo
                                        enterDelay={200} // Retardo para aparecer rápidamente
                                        leaveDelay={200} // Retardo para desaparecer rápidamente
                                        arrow
                                        PopperProps={{
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, 5], // Ajusta el desplazamiento del tooltip
                                              },
                                            },
                                          ],
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          style={{
                                            position: 'absolute', // Alineado dentro del contenedor
                                            top: '50%', 
                                            right: 2, // Colocado a la derecha del campo
                                            transform: 'translateY(-50%)', // Centrado verticalmente en el campo
                                            padding: 0.8,
                                            marginLeft: 8,
                                          }}
                                        >
                                          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                        </IconButton>
                                      </Tooltip>
                                    </Grid>
                                    {/* Campo de porcentaje de descuento */}
                                    <Grid item xs={12} md={1} style={{ position: 'relative' }}>
                                      <TextField
                                        label="% Descuento"
                                        fullWidth
                                        type="number"
                                        value={dataDetails?.data?.payedPercent|| 0}
                                        disabled
                                        inputProps={{ min: 0, max: 100 }}
                                      />                                   
                                    {/** Ícono Infotip con Tooltip */}
                                      <Tooltip 
                                        title="Este campo se utiliza para aplicar un descuento sobre el valor futuro de la factura."
                                        placement="top-end" // Cambiar la posición para que esté a la derecha, alineado con el campo
                                        enterDelay={200} // Retardo para aparecer rápidamente
                                        leaveDelay={200} // Retardo para desaparecer rápidamente
                                        arrow
                                        PopperProps={{
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, 5], // Ajusta el desplazamiento del tooltip
                                              },
                                            },
                                          ],
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          style={{
                                            position: 'absolute', // Alineado dentro del contenedor
                                            top: '50%', 
                                            right: 2, // Colocado a la derecha del campo
                                            transform: 'translateY(-50%)', // Centrado verticalmente en el campo
                                            padding: 0.8,
                                            marginLeft: 8,
                                          }}
                                        >
                                          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                        </IconButton>
                                      </Tooltip>
                                    </Grid>

                                    {/*Tasa Descuento */}
                                     <Grid item xs={12} md={1} style={{ position: 'relative' }}>
                                      <TextField
                                        label="Tasa Descuento"
                                        fullWidth
                                        type="number"
                                        value={dataDetails?.data?.discountTax}
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </Grid>

                                    {/* Campo de valor nominal */}
                                    <Grid item xs={12} md={3}>
                                      <TextField
                                        label="Valor Nominal"
                                        fullWidth
                                        value={dataDetails?.data?.payedAmount? formatNumberWithThousandsSeparator(Math.floor(dataDetails?.data?.payedAmount)) : ""}
                                        disabled
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                                            </InputAdornment>
                                          ),
                                        }}
                                       
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1.5}>
                                      <TextField
                                        label="Tasa Inversionista"
                                        fullWidth
                                        type="number"
                                        value={dataDetails?.data?.investorTax}
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1.5}>
                                      <DatePicker
                                        label="Fecha Fin"
                                        value={dataDetails?.data?.opExpiration }
                                        disabled
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                      <TextField
                                        label="Días Operación"
                                        fullWidth
                                        type="number"
                                        value={dataDetails?.data?.operationDays }
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </Grid>
                                    {/* Campo Utilidad Inversión*/ }
                                    <Grid item xs={12} md={3}>
                                      <TextField
                                        label="Utilidad Inversión"
                                        fullWidth
                                        value={formatCurrency(dataDetails?.data?.investorProfit)} // Formato moneda
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                          
                                        }}
                                      />
                                    </Grid>
                                    {/* Valor Presente Inversión*/ }
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="Valor Presente Inversión"
                                        fullWidth
                                        value={formatCurrency(dataDetails?.data?.presentValueInvestor
                                        )} // Formato moneda
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                        }}
                                       
                                      />
                                    </Grid>
                                    {/* Valor Presente SF*/ }
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="Valor Presente SF"
                                        fullWidth
                                        value={formatCurrency(dataDetails?.data?.presentValueSF )} // Formato moneda
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                        }}
                                        
                                      />
                                    </Grid>
                                    {/* Comisión SF*/ }
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="Comisión SF"
                                        fullWidth
                                        value={formatCurrency(dataDetails?.data?.commissionSF )} // Formato moneda
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                        }}
                                        
                                      />
                                    </Grid>
                                    {/*Selector de Corredor Inversionista */}
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        label="Corredor Inversionista *"
                                        fullWidth
                                        value={(dataDetails?.data?.investorBroker.first_name && dataDetails?.data?.investorBroker.last_name) ? `${dataDetails.data.investorBroker.first_name} ${dataDetails.data?.investorBroker.last_name}` : dataDetails?.data?.investorBroker.social_reason} // Mostrar el corredor asignado
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        
                                      />
                                    </Grid>
                                    {/* Gasto de Mantenimiento */}
                                    <Grid item xs={12} md={4}>
                                      <div className="flex flex-row gap-2 items-center p-2 border rounded-lg shadow-md">
                                        <label className="text-lg font-medium flex-shrink-0">Gasto de Mantenimiento (GM)</label>
                                        
                                        <TextField
                                          type="text"
                                          placeholder="$ 0,00"
                                          value={dataDetails?.data?.GM || 0}
                                          
                                          disabled    

                                          fullWidth
                                          variant="outlined"
                                          className={`"bg-gray-200 text-gray-500"}`}
                                        />
                                      </div>
                                    </Grid>
                                  </Grid>
                               
                            </Grid>
                        
                          
                          </Grid>
                        </Grid>
                   
                   
    </Grid>
  </Box>
</LocalizationProvider>

  );
};
