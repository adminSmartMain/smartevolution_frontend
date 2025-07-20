// components/RegisterOperationForm.js
import React, { useEffect, useState, useMemo } from "react";
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray } from 'formik';
import {  startOfDay,isSameDay } from "date-fns";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { Bills, GetBillFraction, GetRiskProfile, payerByBill, BrokerByClient, AccountsFromClient, UpdateOperation } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { CheckCircle, Error } from "@mui/icons-material";
import { addDays, differenceInDays, parseISO, set, isValid } from "date-fns";
import EmitterSelector from "@components/selects/preOperationEdit/EmitterSelector";
import PayerSelector from "@components/selects/preOperationEdit/PayerSelector";

import BillSelector from "@components/selects/preOperationEdit/BillSelector";
import InvestorSelector from "@components/selects/preOperationEdit/InvestorSelector";
import ValorNominalSelector from "@components/selects/preOperationEdit/ValorNominalSelector";
import TasaInversionistaSelector from "@components/selects/preOperationEdit/TasaInversionista";
import EmitterBrokerModal from "@components/modals/emitterBrokerModal";
import EmitterDeleteModal from "@components/modals/emitterDeleteModal";
import ModalConfirmation from "@components/modals/modalConfirmation";
import ProcessModal from "@components/modals/processModal";

import ValorFuturoSelector from "@components/selects/preOperationEdit/valorFuturoSelector";
import GastoMantenimiento from "@components/selects/preOperationEdit/GastoMantenimientoSelector";
import CuentaInversionistaSelector from "@components/selects/preOperationEdit/cuentaInversionistaSelector";

import TasaDescuentoSelector from "@components/selects/preOperationEdit/TasaDescuentoSelector";
import PorcentajeDescuentoSelector from "@components/selects/preOperationEdit/PorcentajeDescuentoSelector";

import EndDateSelector from "@components/selects/preOperationEdit/EndDateSelector";
import ProbableDateSelector from "@components/selects/preOperationEdit/ProbableDateSelector";




export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  dataDetails,
  payers,
  typeOperation,
  onFormSubmit,
  loading,
  success,
  isModalOpen,
  validationSchema2,
  showConfirmationModal,
  handleConfirm,
  setShowConfirmationModal,
  actionsFormik,
  users,


}) => {
const [orchestDisabled, setOrchestDisabled] = useState([{ indice: 0, status: false }])
  const emisores = emitters;
   const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
  const [openEmitterBrokerModal, setOpenEmitterBrokerModal] = useState(false)
  const tipoOperaciones = ['Compra Titulo', 'Lorem Ipsum', 'Lorem Ipsum'];
  const [brokeDelete, setBrokeDelete] = useState(false)
  const [clientPagador, setClientPagador] = useState(null);
  const [isSelectedPayer, setIsSelectedPayer] = useState(false)
    const [clientInvestor, setClientInvestor] = useState(null);
  // Encontrar el usuario que coincide con dataDetails.user_id
  const usuarioEncontrado = users?.data?.find(user => user.id === dataDetails?.data?.user_created_at);
const [isModalEmitterAd, setIsModalEmitterAd] = useState(false)
  const usuarioEncontradoEdit = users?.data?.find(user => user.id === dataDetails?.data?.user_updated_at);
  const [clientEmitter, setClientEmitter] = useState(null);
  const createdAt = new Date(dataDetails?.data?.created_at);
  const updatedAt = dataDetails?.data?.updated_at ? new Date(dataDetails?.data?.updated_at) : null;
const [clientBrokerEmitter, setClientBrokerEmitter] = useState(null);
  const opcionesFormato = {
    dateStyle: 'short',
    timeStyle: 'medium'
  };

  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const createdAtLocal = createdAt.toLocaleString(undefined, opcionesFormato);
  const updatedAtLocal = updatedAt ? updatedAt.toLocaleString(undefined, opcionesFormato) : null;

  const tooltipText = `
🕒 Creado el: ${createdAtLocal} (${zonaHoraria})
🛠️ Última actualización: ${updatedAtLocal ? `${updatedAtLocal} (${zonaHoraria})` : 'No ha sido actualizado'}
`;
  const {
    fetch: fetchBills,
    loading: loadingBills,
    error: errorBills,
    data: dataBills,
  } = useFetch({ service: Bills, init: false });


  const {
    fetch: fetchBrokerByClient,
    loading: loadingBrokerByClient,
    error: errorBrokerByClient,
    data: dataBrokerByClient,
  } = useFetch({ service: BrokerByClient, init: false });

  const {
    fetch: fetchAccountFromClient,
    loading: loadingAccountFromClient,
    error: errorAccountFromClient,
    data: dataAccountFromClient,
  } = useFetch({ service: AccountsFromClient, init: false });

  const {
    fetch: riskProfileFetch,
    loading: loadingRiskProfile,
    error: errorRiskProfile,
    data: dataRiskProfile,
  } = useFetch({ service: GetRiskProfile, init: false });


  const {
    fetch: getBillFractionFetch,
    loading: loadingGetBillFraction,
    error: errorGetBillFraction,
    data: dataGetBillFraction,
  } = useFetch({ service: GetBillFraction, init: false });


  const {
    fetch: updateOperationFetch,
    loading: loadingUpdateOperation,
    error: errorUpdateOperation,
    data: dataUpdateOperation,
  } = useFetch({ service: UpdateOperation, init: false });
  // get the payer of the bill
  const {
    fetch: fetchPayer,
    loading: loadingPayer,
    error: errorPayer,
    data: dataPayer,
  } = useFetch({ service: payerByBill, init: false });
  // Formatear monto como moneda colombiana
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);

  // Función para formatear el número con separadores de miles
  const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  // Parseamos la fecha ISO del backend
  const date = parseISO(dateString);
  // Ajustamos por zona horaria
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};
  const initialValues = {
    amount: 0,
    applyGm: false,
    bill: "",
    billFraction: 0,
    client: "",
    clientAccount: "",
    commissionSF: 0,
    filtroEmitterPagador: { emitter: "", payer: "" },
    takedBills: "",
    filteredPayers: "",
    DateBill: `${new Date()}`,
    DateExpiration: `${new Date()}`,
    discountTax: 0,
    emitter: "",
    emitterBroker: "",
    cuentaInversionista: '',
    GM: 0,
    id: "",
    investor: "",
    investorBroker: "",
    investorProfit: 0,
    investorTax: 0,
    opDate: `${new Date()}`,
    operationDays: 0,
    opExpiration: `${new Date()}`,
    opId: null,
    opType: "",
    payedAmount: 0,
    payedPercent: 0,
    payer: "",
    presentValueInvestor: 0,
    presentValueSF: 0,
    probableDate: `${new Date()}`,
    status: 0,
    billCode: "",
    isReBuy: false,
    massive: false,
    integrationCode: ""
  };






  const [isRecompra, setIsRecompra] = useState(false); // Estado para el aviso de Recompra

  const [initialPayer, setInitialPayer] = useState(null);
  
  // Función para cargar cuentas cuando se selecciona un inversionista
  const cargarCuentas = async (inversionista) => {
    if (!inversionista) return null; // Retorna null si no hay inversionista

    try {
      const cuentas = await fetchAccountFromClient(inversionista);
      return cuentas; // 🔹 Devuelve las cuentas obtenidas
    } catch (error) {
      console.error("Error al cargar cuentas:", error);
      return null; // Retorna null en caso de error
    }
  };

  const cargarBrokerFromInvestor = async (inversionista) => {
    if (!inversionista) return null; // Retorna null si no hay inversionista

    try {
      const brokerFromInvestor = await fetchBrokerByClient(inversionista);
      return brokerFromInvestor; // 🔹 Devuelve las cuentas obtenidas
    } catch (error) {
      console.error("Error al cargar brokerFromInvestor:", error);
      return null; // Retorna null en caso de error
    }
  };



  const cargarTasaDescuento = async (emisor) => {
    if (!emisor) return null; // Retorna null si no hay emisor

    try {
      const tasaDescuento = await riskProfileFetch(emisor);
      return tasaDescuento; // 🔹 Devuelve las cuentas obtenidas
    } catch (error) {
      console.error("Error al cargar tasaDescuento:", error);
      return null; // Retorna null en caso de error
    }
  };


  // Función para convertir una cadena ISO a fecha local
  const parseDateToLocal = (dateString) => {
    if (!dateString) return null; // Manejar casos donde dateString sea null o undefined

    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(dateString);

    // Ajustar la fecha a la zona horaria local sin restar el offset
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };



  const cargarFraccionFactura = async (factura) => {
    if (!factura) return null; // Retorna null si no hay emisor

    try {
      const tasaInversionista = await getBillFractionFetch(factura);
      return tasaInversionista; // 🔹 Devuelve las cuentas obtenidas
    } catch (error) {
      console.error("Error al cargar brokerFromInvestor:", error);
      return null; // Retorna null en caso de error
    }
  };
  // Función para verificar si es una recompra
  const checkRecompra = (numeroOperacion) => {
    // Simulación: Si el número de operación es par, es una recompra
    return numeroOperacion % 2 === 0;
  };


  const cargarFacturas = async (emisor, pagadorId = null) => {
    if (!emisor) {
      setFacturasFiltradas([]);
      return [];
    }

    const facturas = fetchBills(emisor);



    //S setFacturasFiltradas(filtradas);
    return facturas; // Retorna directamente el array filtrado
  };


  const [brokerByClient, setBrokerByClient] = useState()

  useEffect(() => {
 
    setBrokerByClient(dataBrokerByClient)
  }, [dataBrokerByClient]); // Se ejecuta cuando cambia el estado








  const [AccountFromClient, setAccountFromClient] = useState()
  useEffect(() => {
    
    setAccountFromClient(dataAccountFromClient)
  }, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado


 
  // Función para calcular el porcentaje de descuento basado en el valor futuro y el valor nominal
  const calcularPorcentajeDescuento = (valorFuturo, valorNominal) => {
    if (valorFuturo === 0) return 0;
    return ((1 - valorNominal / valorFuturo) * 100).toFixed(2);
  };



  useEffect(() => {
    if (dataDetails?.data?.emitter?.id) {
      cargarFacturas(dataDetails.data.emitter.id);
    }
  }, [dataDetails?.data?.emitter?.id]); // Se ejecuta solo cuando el ID del emisor cambia

  const [filteredPayers, setFilteredPayers] = useState([]);
  const [filteredPayersBills, setFilteredPayerBills] = useState([]);
  const [filteredAcountsInvestor, setAcountsInvestor] = useState([]);

  // Efecto para cargar pagadores filtrados
  useEffect(() => {
  
    // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
    if (dataDetails?.data?.payer) {
      const payerFromDetails = {
        id: dataDetails.data.payer.id,
        data: {
          document_number: dataDetails.data.payer.document_number,
          social_reason: dataDetails.data.payer.social_reason,
          first_name: dataDetails.data.payer.first_name,
          last_name: dataDetails.data.payer.last_name
        }
      };
      setInitialPayer(payerFromDetails);

    }
    const loadFilteredPayers = async () => {
      const emitterId = dataDetails?.data?.emitter?.id;

      if (!emitterId) {
 
        setFilteredPayers([]);
        return;
      }

      try {
       
        const facturasEmisor = await cargarFacturas(emitterId);
        

        if (!facturasEmisor?.data?.length) {
       
          setFilteredPayers([]);
          return;
        }

        const facturasConSaldo = facturasEmisor.data.filter(
          f => Number(f.currentBalance) >= 0
        );
        

        const payerIdsUnicos = [...new Set(
          facturasConSaldo.map(f => f.payerId).filter(Boolean)
        )];


        const pagadoresFiltrados = payers?.filter(p =>
          p?.data?.document_number &&
          payerIdsUnicos.includes(p.data.document_number)
        ) || [];

        setFilteredPayers(pagadoresFiltrados);

      } catch (error) {
        console.error('Error en loadFilteredPayers:', error);
        setFilteredPayers([]);
      }
    };

    loadFilteredPayers();
  }, [dataDetails?.data?.emitter?.id, payers]); // Dependencias específicas

  // Combinar el pagador inicial con los filtrados
  const allPayers = useMemo(() => {
    if (!initialPayer) return filteredPayers;
    // Evitar duplicados
    const existsInFiltered = filteredPayers.some(p =>
      p.data.document_number === initialPayer.data.document_number
    );
    return existsInFiltered ? filteredPayers : [initialPayer, ...filteredPayers];
  }, [initialPayer, filteredPayers]);


  // Combinar el pagador inicial con los filtrados

  // Efecto para cargar bills con pagadores filtrados
  useEffect(() => {
    
    // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
    if (dataDetails?.data?.bill) {
      const payerFromDetails = {
        id: dataDetails.data.bill.id,
        data: {
          billId: dataDetails.data.bill.billId,

        }
      };
      setInitialPayer(payerFromDetails);

    }
    const loadBillsByPayers = async () => {
      const emitterId = dataDetails?.data?.emitter?.id;
      const document_numberPayer = dataDetails?.data?.payer?.document_number;
    
      if (!emitterId) {
        
        setFilteredPayerBills([]);
        return;
      }

      try {
        
        const facturasEmisor = await cargarFacturas(emitterId);
      

        if (!facturasEmisor?.data?.length) {
          
          setFilteredPayerBills([]);
          return;
        }

        const facturasFiltradas = facturasEmisor.data.filter(
          factura =>
            factura.payerId === document_numberPayer &&
            Number(factura.currentBalance) >= 0  // Filtro por saldo positivo
        );
       
        setFilteredPayerBills(facturasFiltradas);


      } catch (error) {
        console.error('Error en loadFilteredPayers:', error);
        setFilteredPayerBills([]);
      }
    };

    loadBillsByPayers();
  }, [dataDetails?.data?.emitter?.id]); // Dependencias específicas


  // Efecto para cargar bills con pagadores filtrados
  useEffect(() => {
 
    // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
    if (dataDetails?.data?.bill) {
      const payerFromDetails = {
        id: dataDetails.data.bill.id,
        data: {
          billId: dataDetails.data.bill.billId,

        }
      };
      setInitialPayer(payerFromDetails);

    }
    const loadAccountByInvestor = async () => {
      const emitterId = dataDetails?.data?.investor?.id;
      const document_numberPayer = dataDetails?.data?.payer?.document_number;
     
      if (!emitterId) {
     
        setAcountsInvestor([]);
        return;
      }

      try {
        
        const facturasEmisor = await cargarCuentas(emitterId);


        if (!facturasEmisor?.data?.length) {

          setAcountsInvestor([]);
          return;
        }


        setAcountsInvestor(facturasEmisor);


      } catch (error) {
        console.error('Error en loadCuentasByInvestor:', error);
        setAcountsInvestor([]);
      }
    };

    loadAccountByInvestor();
  }, [dataDetails?.data?.investor?.id]); // Dependencias específicas


 

  const initialValues2 = {
    bill_total:dataDetails.data?.bill?.total|| 0,
    currentBalanceActual:dataDetails.data?.bill?.currentBalance|| 0,
      amount: dataDetails.data?.amount || 0,
      amountInitial: dataDetails.data?.amount || 0,
      applyGm: dataDetails.data?.applyGm || false,
      billBack: dataDetails.data?.bill?.id || "",
      bill: dataDetails.data?.bill?.billId || "",
      billFraction: dataDetails.data?.billFraction || 0,
      client: dataDetails.data?.clientAccount?.account_number || "",
      clientId: dataDetails.data?.investor?.id || "",
      clientAccount: dataDetails.data?.clientAccount?.id || "",
      accountsInvestorArray: filteredAcountsInvestor,
      commissionSF: dataDetails.data?.commissionSF || 0,
      filtroEmitterPagador: {
        emitter: dataDetails.data?.emitter?.id || "",
        payer: dataDetails.data?.payer?.document_number || ""
      },
      emitterBrokerInfo: {
        emitterBrokerid: dataDetails.data?.emitterBroker?.id || "",
        emitterBrokerName: dataDetails?.data?.emitterBroker?.social_reason ||
          `${dataDetails?.data?.emitterBroker?.first_name || ''} ${dataDetails?.data?.emitterBroker?.last_name || ''}`.trim() ||
          ""
      },
      investorBrokerInfo: {
        investorBrokerid: dataDetails.data?.investorBroker?.id || "",
        investorBrokerName: dataDetails?.data?.investorBroker?.social_reason ||
          `${dataDetails?.data?.investorBroker?.first_name || ''} ${dataDetails?.data?.investorBroker?.last_name || ''}`.trim() ||
          ""
      },
      investorAccountInfo: {
        investorAccountid: dataDetails.data?.clientAccount?.id || "",
        investorAccountMonto: dataDetails.data?.clientAccount?.balance || ""
      },
      montoDisponibleCuenta: dataDetails.data?.clientAccount?.balance.toFixed(0)-dataDetails.data?.presentValueInvestor.toFixed(0)-dataDetails.data?.GM.toFixed(0),
      saldoDisponible: dataDetails.data?.bill?.currentBalance.toFixed(0) ,
      saldoDisponibleInfo: dataDetails.data?.bill?.currentBalance.toFixed(0) ,
      montoDisponibleInfo: dataDetails.data?.clientAccount?.balance.toFixed(0),
      billsComplete: dataDetails.data?.bill,
      takedBills: filteredPayersBills,
      filteredPayers: "",
      DateBill: dataDetails.data?.DateBill || new Date().toISOString().substring(0, 10),
      DateExpiration: dataDetails.data?.DateExpiration || new Date().toISOString().substring(0, 10),
      discountTax: dataDetails.data?.discountTax || 0,
      emitter: dataDetails.data?.emitter?.id || "",
      emitterBroker: dataDetails.data?.emitterBroker?.id || "",
      cuentaInversionista: dataDetails.data?.investor?.id || '',
      GM: dataDetails.data?.GM || 0,
      id: dataDetails.data?.id || "",
      investor: dataDetails.data?.investor?.id || "",
      investorInfo: dataDetails.data?.investor,
      investorBroker: dataDetails.data?.investorBroker?.id || "",
      investorProfit: dataDetails.data?.investorProfit || 0,
      investorTax: dataDetails.data?.investorTax || 0,
      opDate:parseBackendDate(dataDetails.data?.opDate)|| new Date().toISOString().substring(0, 10),
      operationDays: dataDetails.data?.operationDays || 0,
      opExpiration: parseBackendDate(dataDetails.data?.opExpiration) || new Date().toISOString().substring(0, 10),
      opId: dataDetails.data?.opId || null,
      opType: dataDetails.data?.opType?.id || "",
      opTypeInfo: dataDetails.data?.opType,
      payedAmount: dataDetails.data?.payedAmount || 0,
      payedPercent: dataDetails.data?.payedPercent || 0,
      payer: dataDetails.data?.payer?.id || "",
      arrayPayers: allPayers,
      presentValueInvestor: dataDetails.data?.presentValueInvestor.toFixed(0) || 0,
      presentValueSF: dataDetails.data?.presentValueSF.toFixed(0) || 0,
      probableDate: parseBackendDate(dataDetails.data?.probableDate)|| new Date().toISOString().substring(0, 10),
      status: dataDetails.data?.status || 0,
      billCode: dataDetails.data?.bill?.billId || "",
      isReBuy: dataDetails.data?.isRebuy || false,
      massive: false,
      valorFuturoManual:true,
      integrationCode: dataDetails.data?.bill?.integrationCode || ""
    };

    console.log(initialValues2)
  const handleSubmit = async (values, actions) => {
    try {
      await onFormSubmit(values, actions);
    } catch (error) {
      // Esto evita que el error se propague a React
      console.error("Error en handleSubmit:", getErrorMessage(error));
      actions.setSubmitting(false);
    }
  };

  const renderNombreUsuario = (usuario) => (
    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {usuario?.social_reason || `${usuario?.first_name} ${usuario?.last_name}`}
    </Box>
  );

    const formatDate2 = (dateString) => {
    if (!dateString) return "-- -- ----";

    let dateObj;

    // Si dateString es un objeto Date, convertirlo a cadena
    if (dateString instanceof Date) {
      const year = dateString.getFullYear();
      const month = String(dateString.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
      const day = String(dateString.getDate()).padStart(2, "0");
      dateObj = { year, month, day };
    }
    // Si dateString es una cadena en formato "YYYY-MM-DD"
    else if (typeof dateString === "string" && dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      dateObj = { year, month, day };
    }
    // Si el formato no es válido
    else {
      return "-- -- ----";
    }

    return `${dateObj.day}/${dateObj.month}/${dateObj.year}`; // Formato DD/MM/YYYY
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box sx={{ padding: 9, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
            paddingBottom: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Editar Operación
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {usuarioEncontrado || usuarioEncontradoEdit ? (
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {usuarioEncontrado?.id === usuarioEncontradoEdit?.id ? (
                  <>Creado y editado por: {renderNombreUsuario(usuarioEncontrado)}</>
                ) : (
                  <>
                    {usuarioEncontrado && <>Creado por: {renderNombreUsuario(usuarioEncontrado)}</>}
                    {usuarioEncontrado && usuarioEncontradoEdit && <br />}
                    {usuarioEncontradoEdit && <>Editado por: {renderNombreUsuario(usuarioEncontradoEdit)}</>}
                  </>
                )}
              </Typography>
            ) : (
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Sin información de autoría
              </Typography>
            )}

            {/* Tooltip pegado al texto */}
            {(usuarioEncontrado || usuarioEncontradoEdit) && (
              <Tooltip
                title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
                arrow
                placement="top"
                PopperProps={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4], // un poco de separación vertical
                      },
                    },
                  ],
                }}
              >
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <InfoIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Formik
          initialValues={initialValues2}
          validationSchema={validationSchema2}
          onSubmit={handleConfirm}
          enableReinitialize={true} >
          {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
          {({ values, setFieldValue, touched, errors, handleBlur, setTouched, setFieldTouched, setFieldError }) => (
            <Form>
              <Grid container spacing={2}>

                {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
                <Grid item xs={12} md={2}>

                  <TextField
                    label="Número de Operación *"
                    fullWidth
                    type="number"
                    value={values?.opId}
                    name="opId"
                    InputLabelProps={{
                      shrink: true, // Esto fuerza al label a permanecer arriba
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('opId', value);
                      setIsRecompra(checkRecompra(value)); // Verifica si es recompra
                    }}
                    onBlur={handleBlur}
                    error={touched.opId && Boolean(errors.opId)}
                    helperText={touched.opId && errors.opId}
                    inputProps={{ min: 0 }} // Asegura que no se ingresen números negativos
                    disabled
                  />
                  {/* Aviso de Recompra */}
                  {isRecompra && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                      Operación de Recompra
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={2}>
<DatePicker
        id="opDate-name" // Para CSS/JS si es necesario
        data-testid="fecha-operacion"
        label="Fecha de Operación *"
        value={values.opDate}
        name="opDate"
        inputFormat="dd/MM/yyyy"
        mask="__/__/____"
        onChange={(newValue) => {
          const parsedDate = newValue ? new Date(newValue) : null;
          if (!parsedDate) return;
          setFieldValue('opDate', parsedDate);
         
            if (!values.opExpiration) return;
            // 1. Calcula operationDays (como ya lo hacías)
            const operationDays = Math.max(0, differenceInDays(
              startOfDay(parseDateToLocal(values.opExpiration)),
              startOfDay(parsedDate)
            ));
            setFieldValue(`operationDays`, operationDays);
            setFieldValue(`opDate`, parsedDate);
            // 2. Recalcula los valores presentes y comisiones SOLO si hay días y valor futuro
            if (operationDays > 0 && values.amount > 0) {
              const presentValueInvestor = Math.round(
                PV(values.investorTax / 100, operationDays / 365, 0, values.amount, 0) * -1
              );
              const presentValueSF = Math.round(
                PV(values.discountTax / 100, operationDays / 365, 0, values.amount, 0) * -1
              );

              setFieldValue(`presentValueInvestor`, presentValueInvestor || 0);
              setFieldValue(`presentValueSF`, presentValueSF || 0);
              setFieldValue(`comisionSF`, presentValueInvestor - presentValueSF || 0);
              setFieldValue(`finvestorProfit`,values.payedAmount- presentValueInvestor  || 0);
            } else {
              // Resetea a valores por defecto si no hay días o valor futuro
              setFieldValue(`presentValueInvestor`, values.currentBalance || 0);
              setFieldValue(`presentValueSF`, values.currentBalance || 0);
              setFieldValue(`comisionSF`, 0);
              setFieldValue(`investorProfit`, 0);
            }
          
        }}
        
        
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            errors={!errors.opDate}
            helperText={errors.opDate}
            onKeyDown={(e) => {
              // Permite solo números y barras
                              if (!/[0-9/]/.test(e.key) && 
                              !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                              e.preventDefault();
                          }
                          }}
          />
        )}
        PopperProps={{
          placement: 'bottom-start',
        }}
      />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Autocomplete
                    options={typeOperation?.data || []}
                    getOptionLabel={(option) => option.description || ''}
                    value={typeOperation?.data?.find(op => op.description === values?.opTypeInfo?.description) || null}
                    onChange={async (event, newValue) => {
                      
                      setFieldValue('opType', newValue?.id || '');
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Operación *"
                        name="opType"
                        fullWidth
                        errors={touched.opType && Boolean(errors.opType)}
                        helperText={touched.opType && errors.opType}
                      />
                    )}
                  />
                </Grid>


                <Grid item xs={12} md={5.9}>
                 <EmitterSelector
                  errors={errors}
                  payers={payers}
                  setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  touched={touched}
                  values={values}
                  emisores={emisores}
                  fetchBrokerByClient={fetchBrokerByClient}
                  cargarFacturas={cargarFacturas}
                  cargarTasaDescuento={cargarTasaDescuento}
                 
                 />
                </Grid>

                {/* Selector de Pagadores */}
                <Grid item xs={12} md={6}>
                  <PayerSelector
                  errors={errors}
                  dataBills={dataBills}
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  setClientPagador={setClientPagador}
                  setIsSelectedPayer={setIsSelectedPayer}

                  
                  />
                </Grid>
                {/*Selector de Corredor Emisor */}
                <Grid item xs={12} md={5.9}>

                  <TextField
                    label="Corredor Emisor *"
                    fullWidth
                    disabled
                    name="corredorEmisor"
                    value={
                      dataDetails?.data?.emitterBroker?.social_reason ||
                      `${dataDetails?.data?.emitterBroker?.first_name || ''} ${dataDetails?.data?.emitterBroker?.last_name || ''}`.trim() ||
                      ""
                    }
                    onChange={(event) => {
                      setFieldValue('corredorEmisor', event.target.value); // Actualiza el valor
                      setFieldTouched('corredorEmisor', true); // Marca el campo como "touched"
                    }}
                    // Deshabilitar edición manual
                    error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                    helperText={touched.corredorEmisor && errors.corredorEmisor}
                  />

                </Grid>

                {/* Factura */}
                       
                <Grid container item xs={12} spacing={2} sx={{ display: 'flex', alignItems: 'stretch' }}>

                     
                  <Grid container item xs={12} spacing={2}>
                    <Grid container spacing={2} sx={{ margin: 0, width: '100%' }}>
                      <Grid container alignItems="center" spacing={3} sx={{ mb: 2 ,mt:1,ml:0}}>
                                        {/* Número de factura de la cabecera del acordeon */}
                                        <Grid item>
                                          <Typography >
                                            {values.bill  ?  values.bill : "ID Factura"}
                                          </Typography>
                                        </Grid>
                      
                                        {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                        <Grid item>
                                          <Typography variant="body2" color="textSecondary">
                                            Emisión: {values.DateBill ? formatDate2(values.DateBill) : "-- -- ----"} |
                                            Vencimiento: {values.DateExpiration ? formatDate2(values.DateExpiration) : "-- -- ----"}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                      <Grid xs={12} md={2} item>

                        
                       <BillSelector
                       
                       values={values}
                       setFieldValue={setFieldValue}
                       errors={errors}
                       touched={touched}
                       cargarFraccionFactura={cargarFraccionFactura}
                       dataDetails={dataDetails}
                       />
                      </Grid>

                      <Grid item xs={12} md={0.6}>
                        <TextField
                          label="Fracción"
                          fullWidth
                          type="number"
                          value={values?.billFraction || 1}  // Valor por defecto si no existe fracción
                          onChange={(e) => {
                            let fraccion = parseFloat(e.target.value);
                            if (isNaN(fraccion) || fraccion <= 0) fraccion = 1;  // Evitar valores inválidos o negativos

                            // Obtener el saldo disponible de la factura
                            const saldoDisponible = dataDetails?.data?.bill?.billValue || 0;

                            // Calcular el valor futuro sin decimales
                            const valorFuturoCalculado = Math.floor(saldoDisponible / fraccion);


                          }}
                          onBlur={handleBlur}  // Si tienes validación adicional, puedes manejarla aquí
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Saldo Disponible en factura"
                          fullWidth
                          value={formatNumberWithThousandsSeparator(values?.saldoDisponible || 0)}
                          disabled
                          helperText={
                            `Saldo actual factura: ${values?.saldoDisponibleInfo ? formatNumberWithThousandsSeparator(values?.saldoDisponibleInfo ) : 0}`
                          }
                        />
                      </Grid>
                      {/* Fecha Probable*/}
                      <Grid item xs={12} md={1.8}>
                        <ProbableDateSelector
                        
                          values={values}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          
                        />
                      </Grid>

                      <Grid item xs={12} md={5.5}>
                      <InvestorSelector
                        errors={errors}
                        touched={touched}
                        values={values}
                        investors={investors}
                        cargarCuentas={cargarCuentas}
                        cargarBrokerFromInvestor={cargarBrokerFromInvestor}
                        setFieldValue={setFieldValue}
                        setClientInvestor={setClientInvestor}
                        cargarTasaDescuento={cargarTasaDescuento}
                        
                      
                      />
                      </Grid>
                      <Grid container spacing={2} sx={{ margin: 0, width: '100%' }}>
                        {/* Cuenta de Inversionista */}
                        <Grid item xs={12} sm={5} md={3.8}>
                         <CuentaInversionistaSelector
                         
                          values={values}
                          setFieldValue={setFieldValue}
                          touched={touched}
                          errors={errors}
                         
                         />
                        </Grid>

                        {/* Monto disponible en cuenta inversionista */}
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Monto Disponible Cuenta Inversionista"
                            fullWidth
                            value={formatCurrency(values?.montoDisponibleCuenta || 0)}
                            disabled

                            helperText={
                              `Monto Disponible Inversionista: ${values?.montoDisponibleInfo ? formatNumberWithThousandsSeparator(Math.floor(values?.montoDisponibleInfo)) : 0}`
                            }
                          />
                        </Grid>

                        {/* Valor Futuro */}
                        <Grid item xs={5} md={3}>
                          <Box sx={{ position: 'relative' }}>
                            <ValorFuturoSelector
                              parseFloat={parseFloat}
  

                              formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}

                              values={values}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            
                            
                            
                            />
                          </Box>

                        </Grid>
                        {/* Campo de porcentaje de descuento */}
                        <Grid item xs={12} md={1} >
                          <Box sx={{ position: 'relative' }}>
                          <PorcentajeDescuentoSelector 
                          
                           values={values}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                          
                          />

                            {/* Tooltip integrado */}
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
                          </Box>

                        </Grid>
                        {/*Tasa Descuento */}
                        <Grid item xs={12} md={1.1}>
                          <TasaDescuentoSelector

                          values={values}
                          setFieldValue={ setFieldValue}
                           setFieldError={setFieldError}
                           errors={errors}
                            parseFloat ={parseFloat}
                          
                          />
                        </Grid>
                      </Grid>




                      {/* Campo de valor nominal */}
                      <Grid item xs={12} md={3}>
                        <ValorNominalSelector
                          calcularPorcentajeDescuento={calcularPorcentajeDescuento} 
                          setFieldValue={setFieldValue} 
                          values={values} 
                          errors={errors} 
                          touched={touched} 
                          formatNumberWithThousandsSeparator={ formatNumberWithThousandsSeparator} 

                        
                        />
                      </Grid>

                      {/* Tasa Inversionista */}
                      <Grid item xs={12} md={1.5}>
                        <TasaInversionistaSelector
                         values={values}
                          setFieldValue={setFieldValue}
                          setFieldError={setFieldError}
                           errors={errors}
                            parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                       <EndDateSelector
                       values={values}
                       setFieldValue={setFieldValue}
                     
                        errors={errors}
               
                       />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Días Operación"
                          fullWidth
                          type="number"
                          value={values?.operationDays || 0}
                          disabled
                          
                        />
                      </Grid>
                      {/* Campo Utilidad Inversión*/}
                      <Grid item xs={12} md={3.4}>
                        <TextField
                          label="Utilidad Inversión"
                          fullWidth
                          value={formatCurrency(values?.investorProfit)} // Formato moneda
                          disabled // Bloquear edición
                          InputProps={{
                            inputComponent: "input", // Asegura que se muestre correctamente
                          }}
                        />
                      </Grid>
                      {/* Valor Presente Inversión*/}
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Valor Presente Inversión"
                          fullWidth
                          value={formatCurrency(values?.presentValueInvestor)} // Formato moneda
                          disabled // Bloquear edición
                          InputProps={{
                            inputComponent: "input", // Asegura que se muestre correctamente
                          }}
                        />
                      </Grid>
                      {/* Valor Presente SF*/}
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Valor Presente SF"
                          fullWidth
                          value={formatCurrency(values?.presentValueSF)} // Formato moneda
                          disabled // Bloquear edición
                          InputProps={{
                            inputComponent: "input", // Asegura que se muestre correctamente
                          }}
                        />
                      </Grid>
                      {/* Comisión SF*/}
                      <Grid item xs={12} md={3.9}>
                        <TextField
                          label="Comisión SF"
                          fullWidth
                          value={formatCurrency(values?.commissionSF)} // Formato moneda
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
                          value={
                            values?.investorBrokerInfo?.investorBrokerName ||
                            'No asignado'
                          }
                          disabled
                          InputProps={{
                            inputComponent: "input",
                          }}
                        />
                      </Grid>



                      {/* Gasto de Mantenimiento */}
                      <Grid item xs={12} md={7.82}>
                       <GastoMantenimiento 
                       
                       values={values}
                       setFieldValue={setFieldValue}
                       formatCurrency={formatCurrency}
                       parseFloat={parseFloat}
                       /></Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Editar Operación
                    </Button>
                  </Grid>

                </Grid>

              </Grid>
   <ModalConfirmation
                  showConfirmationModal={showConfirmationModal}
                  setShowConfirmationModal={setShowConfirmationModal}
                  handleSubmit={handleSubmit}
                  actionsFormik={actionsFormik}
                  values={values}

                />
                <ProcessModal
                  success={success}
                />
                <EmitterBrokerModal
                  openEmitterBrokerModal={openEmitterBrokerModal}
                  setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
                  clientWithoutBroker={clientWithoutBroker}

                />
                <EmitterDeleteModal
                  orchestDisabled={orchestDisabled}
                  isModalEmitterAd={isModalEmitterAd}
                  setIsModalEmitterAd={setIsModalEmitterAd}
                  setBrokeDelete={setBrokeDelete}
                  setFieldValue={setFieldValue}
                  values={values}
                  setClientEmitter={setClientEmitter}
                  setClientBrokerEmitter={setClientBrokerEmitter}
                />



              {/* Modal de Confirmación usando Dialog */}
             
              {/* Debug */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: 20 }}>
                  <h4>Errores:</h4>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
                   <pre>{JSON.stringify(values, null, 2)}</pre>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </LocalizationProvider>
  );
};
