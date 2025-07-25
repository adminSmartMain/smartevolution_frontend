// components/RegisterOperationForm.js
import React, { useEffect, useState, useContext } from "react";
import { debounce } from 'lodash';
import { Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, InputAdornment, Box, Typography, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray } from 'formik';
import Axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateField } from '@mui/x-date-pickers/DateField';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import {  getTypeBill,Bills, GetBillFraction, GetRiskProfile,BrokerByClient, AccountsFromClient } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { format, parseISO } from "date-fns";
import authContext from "@context/authContext";
import { useRouter } from 'next/router';
import Image from 'next/image';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { differenceInDays, startOfDay, addDays } from "date-fns";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error
import { styled } from '@mui/material/styles';


import EmitterSelector from "@components/selects/preOperationCreate/EmitterSelector";
import PayerSelector from "@components/selects/preOperationCreate/PayerSelector";
import BillManualSelector from "@components/selects/preOperationCreate/BillManualSelector";
import BillSelector from "@components/selects/preOperationCreate/BillSelector";
import InvestorSelector from "@components/selects/preOperationCreate/InvestorSelector";
import ValorNominalSelector from "@components/selects/preOperationCreate/ValorNominalSelector";
import TasaInversionistaSelector from "@components/selects/preOperationCreate/TasaInversionista";
import EmitterBrokerModal from "@components/modals/emitterBrokerModal";
import EmitterDeleteModal from "@components/modals/emitterDeleteModal";
import ModalConfirmation from "@components/modals/modalConfirmation";
import ProcessModal from "@components/modals/processModal";
import NoEditModal from "@components/modals/noEditModal";
import ValorFuturoSelector from "@components/selects/preOperationCreate/valorFuturoSelector";
import GastoMantenimiento from "@components/selects/preOperationCreate/GastoMantenimientoSelector";
import CuentaInversionistaSelector from "@components/selects/preOperationCreate/cuentaInversionistaSelector";
import DeleteButton from "@components/DeleteButton";
import TasaDescuentoSelector from "@components/selects/preOperationCreate/TasaDescuentoSelector";
import PorcentajeDescuentoSelector from "@components/selects/preOperationCreate/PorcentajeDescuentoSelector";
import SaldoDisponibleSelector from "@components/selects/preOperationCreate/SaldoDisponibleSelector";
import EndDateSelector from "@components/selects/preOperationCreate/EndDateSelector";
import ProbableDateSelector from "@components/selects/preOperationCreate/ProbableDateSelector";
import TypeBillSelector from "@components/selects/preOperationCreate/TypeBillSelector";
import fileToBase64 from "@lib/fileToBase64";

const FilePreviewModal = ({ open, onClose, file, fileUrl }) => {
  const renderPreviewContent = () => {
    if (!file && !fileUrl) return null;

    // Si hay una URL (archivo ya subido)
    if (fileUrl) {
      if (fileUrl.includes('.pdf')) {
        return (
          <iframe 
            src={fileUrl} 
            width="100%" 
            height="500px" 
            style={{ border: 'none' }}
            title="Vista previa del PDF"
          />
        );
      } else {
        return (
          <Image
            src={fileUrl}
            alt="Vista previa del documento"
            width={600}
            height={800}
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
          />
        );
      }
    }

    // Si hay un archivo local (aún no subido)
    if (file?.type?.includes('pdf')) {
      const fileObjectUrl = URL.createObjectURL(file);
      return (
        <iframe 
          src={fileObjectUrl} 
          width="100%" 
          height="500px" 
          style={{ border: 'none' }}
          title="Vista previa del PDF"
        />
      );
    } else {
      const fileObjectUrl = URL.createObjectURL(file);
      return (
        <Image
          src={fileObjectUrl}
          alt="Vista previa del documento"
          width={600}
          height={800}
          style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
          onLoad={() => URL.revokeObjectURL(fileObjectUrl)}
        />
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Previsualización del Documento</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {renderPreviewContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Estilo para input oculto
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Estilo para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};




export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  payers,
  typeOperation,
  onFormSubmit,
  isFinished,
  success,
  isModalOpen,
  validationSchema,
  showConfirmationModal,
  handleConfirm,
  setShowConfirmationModal,
  actionsFormik,
 
}) => {
  const emisores = emitters;
  
  const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
  const [clientEmitter, setClientEmitter] = useState(null);
  const [clientPagador, setClientPagador] = useState(null);
  const [clientBrokerEmitter, setClientBrokerEmitter] = useState(null);
  const [clientInvestor, setClientInvestor] = useState(null);
  const [AccountFromClient, setAccountFromClient] = useState()
  const [openEmitterBrokerModal, setOpenEmitterBrokerModal] = useState(false)
  const { user, logout } = useContext(authContext);
 const [pendingClear, setPendingClear] = useState(false);
  const [showAllPayers, setShowAllPayers] = useState(false);
  const [orchestDisabled, setOrchestDisabled] = useState([{ indice: 0, status: false }])
  const [editMode, setEditMode] = useState({});
  const [isSelectedPayer, setIsSelectedPayer] = useState(false)
  const [isModalEmitterAd, setIsModalEmitterAd] = useState(false)
  const [brokeDelete, setBrokeDelete] = useState(false)
  const [isCreatingBill, setIsCreatingBill] = useState(false)
  const [emitterSaved, setEmitterSaved] = useState(false)

// Estado inicial para manejar múltiples archivos
const [files, setFiles] = useState([]);
const [filePreviews, setFilePreviews] = useState([]);
const [fileUrls, setFileUrls] = useState([]);
const [openPreview, setOpenPreview] = useState(false);
const [previewIndex, setPreviewIndex] = useState(null);
const [isUploading, setIsUploading] = useState(false);

  const [openModal, setOpenModal] = React.useState(false);
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
    fetch: fetchBrokerByClientInvestor,
    loading: loadingBrokerByClientInvestor,
    error: errorBrokerByClientInvestor,
    data: dataBrokerByClientInvestor,
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
    fetch: investorRiskProfileFetch,
    loading: investorLoadingRiskProfile,
    error: investorErrorRiskProfile,
    data: investorDataRiskProfile,
  } = useFetch({ service: GetRiskProfile, init: false });
  const {
    fetch: getBillFractionFetch,
    loading: loadingGetBillFraction,
    error: errorGetBillFraction,
    data: dataGetBillFraction,
  } = useFetch({ service: GetBillFraction, init: false });

    const {
      fetch: fetchTypeBill,
      loading: loadingTypeBill,
      error: errorTypeBill,
      data: dataTypeBill,
    } = useFetch({ service: getTypeBill, init: true });

  
  // Formatear monto como moneda colombiana
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  // Función para formatear el número con separadores de miles
  // Safe version of formatNumberWithThousandsSeparator
  const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [] = useState([
    { id: 1, titulo: "Factura 1", contenido: "Detalles de Factura 1" }
  ]);
  const [expanded, setExpanded] = useState(0); // Primer acordeón abierto por defecto






  
  
const handleFileChange = (event, setFieldValue, index) => {
  const selectedFile = event.target?.files[0];
  console.log(selectedFile);
  
  if (selectedFile) {
    // Validar tipo de archivo
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Solo se permiten archivos PDF, JPEG o PNG');
      return;
    }

    // Validar tamaño (20MB máximo)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error('El archivo no debe exceder los 20MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Actualizamos el estado de archivos manteniendo los demás
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index] = selectedFile;
        return newFiles;
      });
      
      // Actualizamos Formik con el formato que espera el backend
      setFieldValue(`facturas[${index}].file`, e.target.result.split(',')[1]); // Solo el string base64 sin prefijo
      
      // Actualizamos las vistas previas
      setFilePreviews(prev => {
        const newPreviews = [...prev];
        if (selectedFile.type.includes('image')) {
          newPreviews[index] = e.target.result; // Aquí usamos el resultado completo con prefijo
        } else {
          newPreviews[index] = null;
        }
        return newPreviews;
      });
    };
    
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      toast.error('Error al procesar el archivo');
    };
    
    reader.readAsDataURL(selectedFile);
  }
};

  const handleChange = (index) => (_event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };
  // Función para convertir una cadena ISO a fecha local
  const parseDateToLocal = (dateString) => {
    if (!dateString) return null; // Manejar casos donde dateString sea null o undefined

    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(dateString);

    // Ajustar la fecha a la zona horaria local sin restar el offset
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  const initialValues = {
    opId: opId,
    opDate: `${new Date()}`, // Fecha actual por defecto
    // opType: 'Compra Titulo', // Valor por defecto
    emitter: '',
    emitterBroker: '',
    opType: '4ba7b2ef-07b1-47bd-8239-e3ce16ea2e94',
    corredorEmisor: '',
    discountTax: 0,
    nombrePagador: '',
    filtroEmitterPagador: { emitter: "", payer: "" },
    takedBills: "",
    filteredPayers: "",
    facturas: [

      {opDate: `${new Date()}`, // Fecha actual por defecto
        is_creada: false,
        applyGm: false,
        discountTax:0,
        amount: 0,
        payedAmount: 0,
        isRebuy: false,
        billId: '',
        nombreInversionista: '',
        cuentasDelInversionistaSelected:[],
        investorProfit: 0,
        numbercuentaInversionista: '',
        cuentaInversionista: '',
        idCuentaInversionista: '',
        investorBroker: "",
        investorBrokerName: "",
        tasaInversionistaPR: 0,
        tasaDescuentoPR: 0,
        factura: '',
        fraccion: 1,
        valorFuturo: '',
        valorFuturoManual: false, // Rastrea si el valor futuro ha sido editado manualmente
        fechaEmision: null,
        valorNominal: 0,
        porcentajeDescuento: 0,
        probableDate:  `${new Date()}`,
        investorTax: 0,
        expirationDate: '',
        fechaFin: `${addDays(new Date(),1)}`,
        diasOperaciones: 1,
        operationDays: 1,
        typeBill:'',
        comisionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
        opExpiration: '',
        presentValueInvestor: 0,
        presentValueSF: 0,
        integrationCode: "",
        saldoDisponibleInfo: 0,
        montoDisponibleInfo: 0,
        file:'',
      },
    ],
  };
  const [facturasFiltradas, setFacturasFiltradas] = useState([]); // Facturas filtradas por emisor

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
      const brokerFromInvestor = await fetchBrokerByClientInvestor(inversionista);
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
  const cargarFacturas = async (emisor, pagadorId = null) => {
    if (!emisor) {
      setFacturasFiltradas([]);
      return [];
    }

    const facturas = fetchBills(emisor);
    //S setFacturasFiltradas(filtradas);
    return facturas; // Retorna directamente el array filtrado
  };
  useEffect(() => {

  }, [facturasFiltradas]); // Se ejecuta cuando cambia el estado
  const [brokerByClient, setBrokerByClient] = useState()
  useEffect(() => {
    if (dataBrokerByClient) {

      setBrokerByClient(dataBrokerByClient);
    }
  }, [dataBrokerByClient, brokerByClient]);

  const [brokerByClientInvestor, setBrokerByClientInvestor] = useState()
  useEffect(() => {
    if (dataBrokerByClientInvestor) {

      setBrokerByClientInvestor(dataBrokerByClientInvestor);
    }
  }, [dataBrokerByClientInvestor, brokerByClientInvestor]);


  useEffect(() => {

    setAccountFromClient(dataAccountFromClient)
  }, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado
  // Función para calcular el porcentaje de descuento basado en el valor futuro y el valor nominal
  const calcularPorcentajeDescuento = (valorFuturo, valorNominal) => {
    if (valorFuturo === 0) return 0;
    return ((valorNominal / valorFuturo) * 100).toFixed(0);
  };

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
  // Función para cerrar la modal
  // Función para confirmar la operación
  const handleSubmit = async (values, actions) => {
    try {
      await onFormSubmit(values, actions); // 🔥 Ejecuta el submit del padre
    } finally {
      actions.setSubmitting(false);
    }
  };
  const renderNombreUsuario = (usuario) => (
    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {usuario?.name}
    </Box>
  );
  // Fuera del componente, o usando useMemo para optimizar
  const debouncedCheckBill = debounce(async (billNumber, callback) => {
    try {
      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bill/${billNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
          timeout: 10000,
        }
      );
      callback(response.data.count > 0);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error verificando factura:', error);
      }
      callback(false);
    }
  }, 500); // Espera 500ms después de la última escritura
  // Dentro de tu componente
  const [billExists, setBillExists] = useState(false);
  const [isCreatingOp, setIsCreatingOp] = useState(false);
  console.log(isCreatingOp)
  useEffect(() => {
    if (!isCreatingOp) return;
    function handleOnBeforeUnload(event) {
      event.preventDefault();
      return (event.returnValue = '');
    }
    window.addEventListener('beforeunload', handleOnBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleOnBeforeUnload);

    }
  }, [isCreatingOp]);

  function handleOnChange(event) {
    const data = new FormData(event.currentTarget)
    const values = Array.from(data.values())
    const changedFields = values.filter(value => value.length);
    console.log("changedFields")
    setIsCreatingOp(true)
  }

  const handleOpenPreview = (index) => {
  setPreviewIndex(index);
  setOpenPreview(true);
};


  const handleClosePreview = () => {
    setOpenPreview(false);
  };


  
const renderPreviewContent = () => {
  const file = files[previewIndex];
  const fileUrl = fileUrls[previewIndex];

  // Si hay una URL de archivo remoto
  if (fileUrl) {
    if (fileUrl.includes('.pdf')) {
      return (
        <iframe 
          src={fileUrl} 
          width="100%" 
          height="500px" 
          style={{ border: 'none' }}
          title="Vista previa del PDF"
        />
      );
    } else {
      return (
        <Image
          src={fileUrl}
          alt="Vista previa del documento"
          width={600}
          height={800}
          style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
        />
      );
    }
  }

  // Si hay un archivo local (aún no subido)
  if (file?.type?.includes('pdf')) {
    const fileObjectUrl = URL.createObjectURL(file);
    return (
      <iframe 
        src={fileObjectUrl} 
        width="100%" 
        height="500px" 
        style={{ border: 'none' }}
        title="Vista previa del PDF"
      />
    );
  } else if (file) {
    const fileObjectUrl = URL.createObjectURL(file);
    return (
      <Image
        src={fileObjectUrl}
        alt="Vista previa del documento"
        width={600}
        height={800}
        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
        onLoad={() => URL.revokeObjectURL(fileObjectUrl)}
      />
    );
  }

  return <Typography>No hay archivo para previsualizar</Typography>;
};
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
          paddingBottom: 2,
          borderBottom: '1px solid #e0e0e0'
        }}> <Typography variant="h4" gutterBottom>
            Registrar Operación
          </Typography>
          {user ? (
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Creado por: {renderNombreUsuario(user)}
            </Typography>
          ) : (
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Sin información de autoría
            </Typography>
          )}
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleConfirm}
          
        >
          {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
          {({ values, setFieldValue, touched, errors, handleBlur, setTouched, setFieldTouched, setFieldError, formikBag, dirty, isSubmitting }) => {
            setIsCreatingOp(true)
            // Efecto para cargar datos iniciales       
            return (
              <Form translate="no" onChange={handleOnChange}>
                <Grid container spacing={2}>
                  {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
                  <Grid item xs={12} md={2}>
                    <TextField
                      id="noOp-name" // Para CSS/JS si es necesario
                      data-testid="numero-operacion"
                      label="Número de Operación *"
                      fullWidth
                      type="number"
                      value={values.opId}
                      name="opId"
                      onChange={async (e) => {
                        const value = e.target.value;
                       setFieldValue('opId', value); // Actualiza el valor en el formulario
                      }}
                      onBlur={handleBlur}
                      error={touched.opId && Boolean(errors.opId)}
                      helperText={touched.opId && errors.opId}
                      inputProps={{ min: 0 }} // Asegura que no se ingresen números negativos
                    />
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
                        values.facturas.forEach((factura, index) => {
                          if (!factura.fechaFin) return;
                          // 1. Calcula operationDays (como ya lo hacías)
                          const operationDays = Math.max(0, differenceInDays(
                            startOfDay(parseDateToLocal(factura.fechaFin)),
                            startOfDay(parsedDate)
                          ));
                          setFieldValue(`facturas[${index}].operationDays`, operationDays);
                          setFieldValue(`facturas[${index}].opDate`, parsedDate);
                          // 2. Recalcula los valores presentes y comisiones SOLO si hay días y valor futuro
                          if (operationDays > 0 && factura.valorFuturo > 0) {
                            const presentValueInvestor = Math.round(
                              PV(factura.investorTax / 100, operationDays / 365, 0, factura.valorFuturo, 0) * -1
                            );
                            const presentValueSF = Math.round(
                              PV(values.discountTax / 100, operationDays / 365, 0, factura.valorFuturo, 0) * -1
                            );

                            setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor || 0);
                            setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0);
                            setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - presentValueSF || 0);
                            setFieldValue(`facturas[${index}].investorProfit`,factura.valorNominal- presentValueInvestor  || 0);
                          } else {
                            // Resetea a valores por defecto si no hay días o valor futuro
                            setFieldValue(`facturas[${index}].presentValueInvestor`, factura.currentBalance || 0);
                            setFieldValue(`facturas[${index}].presentValueSF`, factura.currentBalance || 0);
                            setFieldValue(`facturas[${index}].comisionSF`, 0);
                            setFieldValue(`facturas[${index}].investorProfit`, 0);
                          }
                        });
                      }}
                      
                      
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          errors={!errors.facturas?.probableDate}
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
                      id="typeOp-name" // Para CSS/JS si es necesario
                      data-testid="campo-typeOp"
                      options={typeOperation?.data || []} // Asegurar que options no sea undefined
                      getOptionLabel={(option) => option.description || ''} // Mostrar la descripción
                      value={
                        typeOperation?.data.find(item => item.id === values.opType) ||
                        typeOperation?.data.find(item => item.id === values.opType) || // Fallback si no se encuentra por ID
                        null
                      }
                      onChange={async (event, newValue) => {

                        setFieldValue('opType', newValue?.id);
                        setFieldTouched('opType', true);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tipo de Operación *"
                          name="opType"
                          fullWidth
                          //error={touched.opType && Boolean(errors.opType)}
                          helperText={touched.opType && errors.opType}
                        />
                      )}
                    />
                  </Grid>
                  {/* Campo de Emisor */}
                  <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
                      <EmitterSelector
                      setClientPagador={setClientPagador}
                      orchestDisabled={orchestDisabled}
                       setIsSelectedPayer={ setIsSelectedPayer}
                        setPendingClear={setPendingClear}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        setEmitterSaved={setEmitterSaved}
                        emitterSaved={emitterSaved}
                        touched={touched}
                        values={values}
                        payers={payers}
                        emisores={emisores}
                        brokeDelete={brokeDelete}
                        isCreatingBill={isCreatingBill}
                        fetchBrokerByClient={fetchBrokerByClient}
                        cargarTasaDescuento={cargarTasaDescuento}
                        setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
                        setClientEmitter={setClientEmitter}
                        setClientBrokerEmitter={setClientBrokerEmitter}
                        cargarFacturas={cargarFacturas}
                        errors={errors}
                        setIsModalEmitterAd={setIsModalEmitterAd}
                      />
                    </div>
                    {clientEmitter && (
                      <IconButton
                        onClick={() => {
                          window.open(`${window.location.origin}/customers?modify=${clientEmitter.data.id}`, '_blank');
                        }}
                        sx={{
                          marginTop: '15px',
                          height: '20px',
                          width: '20px',
                          color: '#488F88', // Aquí sí funciona
                          '&:hover': {
                            color: '#3a726c', // Color más oscuro para hover
                            backgroundColor: 'rgba(72, 143, 136, 0.1)' // Fondo sutil al hacer hover
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Grid>
                  {/*Selector de Pagadores*/}
                  <Grid item xs={12} md={6}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}

                        <PayerSelector
                          errors={errors}
                          showAllPayers={showAllPayers}
                          payers={payers}
                          values={values}
                          setFieldValue={setFieldValue}
                          setClientPagador={setClientPagador}
                          setIsSelectedPayer={setIsSelectedPayer}
                          touched={touched}
                          orchestDisabled={orchestDisabled}
                          dataBills={dataBills} />


                      </div>
                      {/* Botón para alternar entre todos los payers y los filtrados */}
                      <Tooltip title={showAllPayers ? "Mostrar solo pagadores filtrados" : "Mostrar todos los pagadores"}>
                        <IconButton
                          size="small"
                          onClick={() => setShowAllPayers(!showAllPayers)}
                          color={showAllPayers ? "primary" : "default"}
                          style={{ marginTop: '8px' }}
                        >
                          {showAllPayers ? <FilterAltOffIcon /> : <FilterAltIcon />}
                        </IconButton>
                      </Tooltip>
                      {clientPagador && (
                        <IconButton
                          color="primary"
                          onClick={() => {
                            window.open(`${window.location.origin}/customers?modify=${clientPagador}`, '_blank');
                          }}
                          sx={{
                            marginTop: '15px',
                            height: '20px',
                            width: '20px',
                            color: '#488F88', // Aquí sí funciona
                            '&:hover': {
                              color: '#3a726c', // Color más oscuro para hover
                              backgroundColor: 'rgba(72, 143, 136, 0.1)' // Fondo sutil al hacer hover
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                  {/*Selector de Corredor Emisor */}
                  <Grid item xs={12} md={5.8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
                        <TextField
                          id="brokerEmitter-name" // Para CSS/JS si es necesario
                          data-testid="corredor-emisor"
                          label="Corredor Emisor *"
                          fullWidth
                          name="corredorEmisor"
                          value={values.corredorEmisor || ""} // Usar el valor del campo
                          onChange={(event) => {
                            setFieldValue('corredorEmisor', event.target.value); // Actualiza el valor
                            setFieldTouched('corredorEmisor', true); // Marca el campo como "touched"
                            setClientBrokerEmitter(event.target.value)
                          }}
                          disabled // Deshabilitar edición manual
                          error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                          helperText={touched.corredorEmisor && errors.corredorEmisor}
                        />
                      </div>

                    </div>
                  </Grid>
                  {/*Array para cada acordeon de facturas de la operacion */}
                  <FieldArray name="facturas">
                    {({ push, remove }) => (
                      <>
                        {values.facturas.map((factura, index) => (
                          <Grid item xs={12} key={index}>
                            {/* Contenedor principal para el botón de eliminar y el acordeón */}
                            <Grid container alignItems="flex-start" spacing={2}>

                              {/* Acordeón */}
                              <Grid item xs>
                                <Accordion
                                  key={factura.id}
                                  sx={{
                                    border: factura.is_creada ? '2px solid #488F88' : 'none',
                                    transition: 'border 0.3s ease',
                                    '&:hover': {
                                      border: factura.is_creada ? '2px solidrgb(29, 89, 83)' : 'none'
                                    }
                                  }}
                                  expanded={expanded === index}
                                  onChange={handleChange(index)}>
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Grid container alignItems="center" spacing={1} style={{ width: '100%' }}>
                                      {/* Número de factura de la cabecera del acordeon */}
                                      <Grid item xs={10} container alignItems="center" wrap="nowrap" spacing={1}>
                                        <Grid item>
                                          <Typography>
                                            {factura.billId || `Factura ${index + 1}`}
                                          </Typography>
                                        </Grid>
                                        {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                        <Grid item>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {editMode[index] ? (
                                              // Modo edición - DatePickers
                                              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                                                <DatePicker
                                                  label="Emisión"
                                                  value={factura.fechaEmision ? parseISO(factura.fechaEmision) : null}
                                                  onChange={(newValue) => {
                                                    if (newValue) {
                                                      const formattedDate = newValue.toISOString().substring(0, 10);
                                                      setFieldValue(`facturas[${index}].fechaEmision`, formattedDate);

                                                      if (factura.billId) {
                                                        values.facturas.forEach((f, i) => {
                                                          if (f.billId === factura.billId && i !== index) {
                                                            setFieldValue(`facturas[${i}].fechaEmision`, formattedDate);
                                                          }
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  inputFormat="dd/MM/yyyy"
                                                  mask="__/__/____"
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      size="small"
                                                      fullWidth
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault(); // Agregado para mayor seguridad
                                                      }}
                                                    />
                                                  )}
                                                  PopperProps={{
                                                    onClick: (e) => {
                                                      e.stopPropagation(); // Previene la propagación en el calendario
                                                    }
                                                  }}
                                                />
                                                <DatePicker
                                                  label="Vencimiento"
                                                  value={factura.expirationDate ? parseISO(factura.expirationDate) : null}
                                                  onChange={(newValue) => {
                                                    if (newValue) {
                                                      const formattedDate = newValue.toISOString().substring(0, 10);
                                                      setFieldValue(`facturas[${index}].expirationDate`, formattedDate);

                                                      if (factura.billId) {
                                                        values.facturas.forEach((f, i) => {
                                                          if (f.billId === factura.billId && i !== index) {
                                                            setFieldValue(`facturas[${i}].expirationDate`, formattedDate);
                                                          }
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  inputFormat="dd/MM/yyyy"
                                                  mask="__/__/____"
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      size="small"
                                                      fullWidth
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                      }}
                                                    />
                                                  )}
                                                  PopperProps={{
                                                    onClick: (e) => {
                                                      e.stopPropagation();
                                                    }
                                                  }}
                                                  onClick={(e) => e.stopPropagation()}
                                                />
                                              </div>
                                            ) : (
                                              // Modo visualización - Texto
                                              <Typography variant="body2" color="textSecondary" style={{ flex: 1 }}>
                                                Emisión: {factura.fechaEmision ? formatDate2(factura.fechaEmision) : "-- -- ----"} |
                                                Vencimiento: {factura.expirationDate ? formatDate2(factura.expirationDate) : "-- -- ----"}
                                              </Typography>
                                            )}
                                            {/* Botón para alternar modos */}
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditMode(prev => ({ ...prev, [index]: !prev[index] }));
                                              }}
                                              disabled={!orchestDisabled.find(item => item.indice === index)?.status}
                                            >
                                              {editMode[index] ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                            </IconButton>
                                          </div>
                                       
                                        </Grid>
                                      </Grid>
                                      {/* Botón de eliminar */}
                                      <DeleteButton
                                      factura
                                       index ={index}
                                       values={values}
                                       setFieldValue={ setFieldValue}
                                      f={factura.is_creada}
                                      orchestDisabled ={orchestDisabled}
                                      setOrchestDisabledset={setOrchestDisabled}
                                      setIsCreatingBill ={ setIsCreatingBill}
                                      remove={remove}
                                      />
                                   </Grid>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Grid container item xs={12} spacing={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                      <Grid container item xs={12} spacing={2}>
                                        <Grid container spacing={2} sx={{ margin: 0, width: '100%' }}>
                                          <Grid xs={12} md={2} item>
                                            {(orchestDisabled.find(item => item.indice === index)?.status) ? (
                                              <>
                                              
                                              <Grid item xs={12} md={6}>
                                                <BillManualSelector
                                                  values={values}
                                                  setFieldValue={setFieldValue}
                                                  index={index}
                                                  touched={touched}
                                                  orchestDisabled={orchestDisabled}
                                                  factura={factura}
                                                  dataBills={dataBills}
                                                  setFieldTouched={setFieldTouched}
                                                  setFieldError={setFieldError}
                                                  setBillExists={setBillExists}
                                                  debouncedCheckBill={debouncedCheckBill}
                                                />
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <TypeBillSelector 
                                                  errors={errors}
                                                  setFieldTouched={setFieldTouched}
                                                  setFieldValue={setFieldValue}
                                                  touched={touched}
                                                  values={values}
                                                  dataTypeBill={dataTypeBill}
                                                  index={index}
                                                  factura={factura}
                                                />
                                              </Grid>
                                            
                                              </>
                                              
                                            ) : (
                                              <> <BillSelector
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                errors={errors}
                                                touched={touched}
                                                index={index}
                                                factura={factura}
                                                setFieldTouched={setFieldTouched}
                                                setFieldError={setFieldError}
                                                dataBills={dataBills}
                                                cargarFraccionFactura={cargarFraccionFactura}

                                              />
                                         </>
                                            )}
                                            <NoEditModal
                                              openModal={openModal}
                                              setOpenModal={setOpenModal}
                                              setEditMode={setEditMode}
                                              index={index}
                                              values={values}
                                              setFieldValue={setFieldValue}
                                              orchestDisabled={orchestDisabled}
                                              setOrchestDisabled={setOrchestDisabled}
                                              setIsCreatingBill={setIsCreatingBill}


                                            />
                                          </Grid>
                                           {/* <Grid item xs={12} md={0.5}>
                                            <Box
                                              sx={{
                                                color: (orchestDisabled.find(item => item.indice === index))?.status ? "#ffffff" : "#5EA3A3",
                                                backgroundColor: (orchestDisabled.find(item => item.indice === index))?.status ? "#5EA3A3" : "transparent",
                                                border: "1.4px solid #5EA3A3",
                                                width: { xs: "22px", sm: "25px" }, // Tamaño responsive
                                                minWidth: { xs: "22px", sm: "25px" }, // Evita compresión
                                                display: "flex",
                                                alignItems: "center",
                                                marginTop: { xs: "8px", sm: "12px" }, // Ajuste vertical responsive
                                                justifyContent: "center",
                                                borderRadius: "5px",
                                                height: { xs: "22px", sm: "25px" }, // Altura responsive
                                                cursor: (orchestDisabled.find(item => item.indice === index))?.status || isSelectedPayer ? "default" : "pointer",
                                                transition: "all 0.3s ease", // Transición suave
                                                '&:hover': {
                                                  backgroundColor: !(orchestDisabled.find(item => item.indice === index)?.status) && !isSelectedPayer ? "#f0f0f0" : undefined,
                                                  transform: !(orchestDisabled.find(item => item.indice === index)?.status) && !isSelectedPayer ? "scale(1.05)" : undefined // Efecto hover
                                                },
                                                '&:active': {
                                                  transform: !(orchestDisabled.find(item => item.indice === index)?.status) && !isSelectedPayer ? "scale(0.95)" : undefined // Efecto click
                                                }
                                              }}
                                              onClick={() => {
                                                if (!isSelectedPayer) {
                                                  toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                                                    <span>Debe seleccionar un pagador antes de crear facturas</span>
                                                  </div>);
                                                  return;
                                                }

                                                const isCurrentlyActive = (orchestDisabled.find(item => item.indice === index))?.status;

                                                if (isCurrentlyActive) {
                                                  setOpenModal(true); // Mostrar modal de confirmación

                                                } else {
                                                  setFieldValue(`facturas[${index}].is_creada`, true);
                                                  setIsCreatingBill(true);
                                                  setBrokeDelete(true)
                                                  
                                                  setOrchestDisabled(prev =>
                                                    prev.map(item =>
                                                      item.indice === index ? { ...item, status: true } : item
                                                    )
                                                  );
                                                }
                                              }}
                                            >
                                              {(orchestDisabled.find(item => item.indice === index))?.status ? (
                                                <i
                                                  className="fa-solid fa-xmark"
                                                  style={{ opacity: isSelectedPayer ? 0.5 : 1, pointerEvents: isSelectedPayer ? "none" : "auto" }}
                                                />
                                              ) : (
                                                <i
                                                  className="fa-solid fa-plus"
                                                  style={{ opacity: isSelectedPayer ? 0.5 : 1, pointerEvents: isSelectedPayer ? "none" : "auto" }}
                                                />
                                              )}
                                            </Box>
                                          </Grid> */}
                                        
                                          {/* Fracción */}
                                          <Grid item xs={12} md={0.6}>
                                            <TextField
                                              id="Fraction-name" // Para CSS/JS si es necesario
                                              data-testid="campo-fraccion"
                                              label="Fracción"
                                              fullWidth
                                              type="number"
                                              name="fraccion"
                                              value={factura.fraccion ?? 1} // Valor por defecto si no existe fracción
                                              onChange={(e) => {
                                                const fraccion = parseFloat(e.target.value) || 1; // Evitar valores inválidos

                                                // Verificar si alguna factura anterior tiene la misma factura seleccionada
                                                const facturaActual = values.facturas[index]?.factura;
                                                if (facturaActual) {
                                                  // Buscar todas las facturas anteriores que tengan la misma factura
                                                  const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.factura === facturaActual);

                                                  // Si hay coincidencias, encontrar la fracción más alta y sumarle 1
                                                  if (facturasAnteriores.length > 0) {
                                                    const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                                                    fraccion = fraccionMasAlta + 1;
                                                  }
                                                }
                                                // Actualizar el valor de la fracción en el estado
                                                setFieldValue(`facturas[${index}].fraccion`, fraccion);

                                                // Recalcular el valor futuro automáticamente cuando cambia la fracción
                                                const saldoDisponible = factura.saldoDisponible || 0;
                                                const valorFuturoCalculado = Math.floor(saldoDisponible); // Truncar los decimales
                                              }}
                                              onBlur={handleBlur} // Si tienes alguna lógica de validación, puedes usar onBlur
                                              helperText={touched.facturas?.[index]?.fraccion && errors.facturas?.[index]?.fraccion} // Ayuda para mostrar errores
                                              error={touched.facturas?.[index]?.fraccion && Boolean(errors.facturas?.[index]?.fraccion)} // Mostrar errores si es necesario
                                            />
                                          </Grid>
                                          {/* Saldo Disponible de la factura */}
                                          <Grid item xs={12} md={2}>

                                            <SaldoDisponibleSelector
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            factura={factura}
                                            index={index}
                                            orchestDisabled={orchestDisabled}
                                            formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                                            parseFloat={parseFloat}
                                            />
                                          </Grid>
                                          {/* Fecha Probable*/}
                                          <Grid item xs={12} md={1.8}>
                                            <ProbableDateSelector
                                            factura={factura}
                                            touched={ touched}
                                            errors={errors}
                                            setFieldValue={setFieldValue}
                                            index={index}
                                            values={values}
                                            
                                            />
                                          </Grid>
                                          {/* Fecha de Vencimiento */}
                                          {/* <Grid item xs={12} md={2}>
                                                <DatePicker
                                                  label="Vencimiento Factura"
                                                  value={factura.fechaFin}
                                                  onChange={(newValue) => setFieldValue(`facturas[${index}].fechaFin`, newValue)}
                                                  renderInput={(params) => <TextField {...params} fullWidth />}
                                                /> */}
                                          {/* </Grid> */}
                                          {/* Nombre de Inversionista */}
                                          <Grid item xs={12} md={5.5}>
                                            <InvestorSelector
                                              errors={errors}
                                              touched={touched}
                                              setFieldValue={setFieldValue}
                                              values={values}
                                              setClientInvestor={setClientInvestor}
                                              index={index}
                                              factura={factura}
                                              investors={investors}
                                              cargarCuentas={cargarCuentas}
                                              cargarTasaDescuento={cargarTasaDescuento}
                                              cargarBrokerFromInvestor={cargarBrokerFromInvestor}
                                              setFieldError={setFieldError}
                                              setFieldTouched={setFieldTouched}

                                            />
                                            {/*  {clientInvestor && (
                                          <IconButton
                                            color="primary"
                                            onClick={() => {
                                              window.open(`${window.location.origin}/customers?modify=${clientInvestor}`, '_blank');
                                            }}
                                            style={{ 
                                              marginTop: '0px',
                                              height: '56px', // Para coincidir con la altura del TextField
                                              width: '56px'
                                            }}
                                          >
                                            <EditIcon />
                                          </IconButton>
                                        )}
 */}
                                          </Grid>
                                        </Grid>
                                        <Grid container spacing={2} sx={{ margin: 0, width: '100%' }}>
                                          {/* Campo de monto disponible */}
                                          <Grid item xs={12} sm={5} md={3.8}>
                                            <CuentaInversionistaSelector
                                              index={index}
                                              factura={factura}
                                              values={values}
                                              setFieldValue={setFieldValue}
                                              parseFloat={parseFloat}
                                              touched={touched}
                                              errors={errors}
                                            />
                                          </Grid>
                                          {/*Monto disponible en cuenta inversionista */}
                                          <Grid item xs={12} md={3}>
                                            <TextField
                                              id="investorBalancename" // Para CSS/JS si es necesario
                                              data-testid="campo-investorBalance"
                                              label="Monto de Inversionista"
                                              fullWidth
                                              value={formatCurrency(values.facturas[index]?.montoDisponibleCuenta || 0)}
                                              disabled // Deshabilita la edición manual
                                              helperText={
                                                `Monto Disponible Inversionista: ${values.facturas[index]?.montoDisponibleInfo ? formatNumberWithThousandsSeparator(Math.floor(values.facturas[index]?.montoDisponibleInfo)) : 0}`
                                              }
                                            />
                                          </Grid>
                                          {/* Valor Futuro */}
                                          <Grid item xs={5} md={3} >
                                            <Box sx={{ position: 'relative' }}>
                                              <ValorFuturoSelector
                                               factura={factura}
                                                formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                                                dataBills={dataBills}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                errors={errors}
                                                touched={touched}
                                                index={index}
                                                parseFloat={parseFloat}

                                              />

                                              {/** Ícono Infotip con Tooltip */}
                                              <Tooltip
                                                title="El Valor Futuro: (1) Resta de tu Saldo Disponible, (2) Define tu Valor Nominal (cupo), y (3) Nunca puede superar tu Saldo Disponible."
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
                                                    transform: 'translateY(-100%)', // Centrado verticalmente en el campo
                                                    padding: 0.8,
                                                    marginLeft: 1,
                                                  }}
                                                >
                                                  <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                                </IconButton>
                                              </Tooltip>
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
                                            factura={factura}
                                            index={index}
                                            />
                                              
                                            </Box>
                                          </Grid>
                                          {/*Tasa Descuento */}
                                          <Grid item xs={12} md="auto" sx={{ width: { md: '9%' } }}>
                                            <TasaDescuentoSelector
                                            values={values}
                                            setFieldValue = {setFieldValue}
                                            setFieldError = {setFieldError}
                                            errors  = {errors}
                                            factura  = {factura}
                                            index = {index}
                                            parseFloat  = {parseFloat}
                                            />
                                          </Grid>
                                        </Grid>
                                        {/* Campo de valor nominal */}
                                        <Grid item xs={12} md={3}>
                                          <ValorNominalSelector
                                            factura={factura}
                                            index={index}
                                            setFieldValue={setFieldValue}
                                            values={values}
                                            errors={errors}
                                            touched={touched}
                                            formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                                            calcularPorcentajeDescuento={calcularPorcentajeDescuento}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={1.5}>
                                          <TasaInversionistaSelector
                                            values={values}
                                            setFieldValue = {setFieldValue}
                                            setFieldError = {setFieldError}
                                            errors  = {errors}
                                            factura  = {factura}
                                            index = {index}
                                            parseFloat  = {parseFloat}
                                            />
                                          
                                        </Grid>
                                     <Grid item xs={12} md={2}>
                                       <EndDateSelector
                                       
                                       setFieldValue={setFieldValue}
                                       values={values}
                                        factura={factura}
                                        errors={errors}
                                        touched={touched}
                                        index={index}
                                        parseFloat={parseFloat}

                                       
                                       />
                                     </Grid>
                                      
                                          
                                        <Grid item xs={12} md={2}>
                                          <TextField
                                            id="operationDays" // Para CSS/JS si es necesario
                                            data-testid="campo-DIas operacion"
                                            label="Días Operación"
                                            fullWidth
                                            type="number"
                                            value={factura.operationDays || 0} // Si es undefined o null, se muestra vacío
                                            onChange={(e) => {
                                              const nuevosDiasOperacion = parseFloat(e.target.value); // Convertir a número
                                              setFieldValue(`facturas[${index}].operationDays`, nuevosDiasOperacion); // Actualizar el valor

                                              const presentValueInvestor = nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                ? Math.round(PV(values.investorTax / 100, nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                : factura.valorFuturo;

                                              const presentValueSF = nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                ? Math.round(PV(values.discountTax / 100, nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                : factura.currentBalance;

                                              setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                              setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF); // Actualizar el valor
                                            }}
                                            InputLabelProps={{ shrink: true }} // Asegura que el label no se superponga al valor
                                            disabled
                                          />
                                        </Grid>
                                        {/* Campo Utilidad Inversión*/}
                                        <Grid item xs={12} md={3.4}>
                                          <TextField
                                            id="InvestorProfitname" // Para CSS/JS si es necesario
                                            data-testid="campo-InvestorProfit"
                                            label="Utilidad Inversión"
                                            fullWidth
                                            value={formatCurrency(factura.investorProfit) || 0} // Formato moneda
                                            disabled // Bloquear edición
                                            InputProps={{
                                              inputComponent: "input", // Asegura que se muestre correctamente
                                            }}
                                             error={touched.facturas?.[index]?.investorProfit && 
                                                      Boolean(errors.facturas?.[index]?.investorProfit)}
                                          />
                                        </Grid>
                                        {/* Valor Presente Inversión*/}
                                        <Grid item xs={12} md={4}>
                                          <TextField
                                            id="presentValueInvestorname" // Para CSS/JS si es necesario
                                            data-testid="campo-presentValueInvestor"
                                            label="Valor Presente Inversión"
                                            fullWidth
                                            value={formatCurrency(factura.presentValueInvestor) || 0} // Formato moneda
                                            disabled // Bloquear edición
                                            InputProps={{
                                              inputComponent: "input", // Asegura que se muestre correctamente
                                            }}
                                          />
                                        </Grid>
                                        {/* Valor Presente SF*/}
                                        <Grid item xs={12} md={4}>
                                          <TextField
                                            id="presentValueSFname" // Para CSS/JS si es necesario
                                            data-testid="campo-presentValueSF"
                                            label="Valor Presente Mesa"
                                            fullWidth
                                            value={formatCurrency(factura.presentValueSF) || 0} // Formato moneda
                                            disabled // Bloquear edición
                                            InputProps={{
                                              inputComponent: "input", // Asegura que se muestre correctamente
                                            }}
                                          />
                                        </Grid>
                                        {/* Comisión SF*/}
                                        <Grid item xs={12} md={3.9}>
                                          <TextField
                                            id="comisionSFname" // Para CSS/JS si es necesario
                                            data-testid="campo-comisionSF"
                                            label="Comisión Mesa"
                                            fullWidth
                                            value={formatCurrency(factura.comisionSF) || 0} // Formato moneda
                                            disabled // Bloquear edición
                                            name="comisionSF"
                                            InputProps={{
                                              inputComponent: "input", // Asegura que se muestre correctamente
                                            }}
                                          />
                                        </Grid>

                                    
                                        {/*Selector de Corredor Inversionista */}
                                        <Grid item xs={12} md={6}>
                                          <TextField
                                            id="investorBrokername" // Para CSS/JS si es necesario
                                            data-testid="campo-investorBroker"
                                            label="Corredor Inversionista *"
                                            fullWidth
                                            value={factura.investorBrokerName || ''} // Mostrar el corredor asignado
                                            disabled // Bloquear edición
                                            name="investorBrokerName"
                                            InputProps={{
                                              inputComponent: "input", // Asegura que se muestre correctamente
                                            }}
                                            InputLabelProps={{ shrink: true, min: 0, max: 100 }}
                                            helperText={touched.facturas?.[index]?.investorBrokerName && errors.facturas?.[index]?.investorBrokerName} // Ayuda para mostrar errores
                                            error={touched.facturas?.[index]?.investorBrokerName && Boolean(errors.facturas?.[index]?.investorBrokerName)}
                                          />
                                        </Grid>
                                        {/* Gasto de Mantenimiento */}
                                          <Grid item xs={12} md={6}>
                                          <GastoMantenimiento
                                            factura={factura}
                                            setFieldValue={setFieldValue}
                                            formatCurrency={formatCurrency}
                                            parseFloat={parseFloat}
                                            index={index}
                                            values={values}
                                          />
                                        </Grid>
                                      <Grid item xs={12} md={6}>
                                 
                                    {orchestDisabled.find(item => item.indice === index)?.status && (
                                      <>
                                        <Box display="flex" alignItems="center" gap={2}>
                                          <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                          >
                                            Seleccionar archivo
                                            <VisuallyHiddenInput
                                              type="file"
                                              onChange={(e) => handleFileChange(e, setFieldValue, index)}
                                              accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                          </Button>

                                          {(files[index] || fileUrls[index]) && (
                                            <Button
                                              variant="outlined"
                                              startIcon={<PreviewIcon />}
                                              onClick={() => handleOpenPreview(index)}
                                            >
                                              Previsualizar
                                            </Button>
                                          )}
                                        </Box>
                                        
                                        {(files[index] || fileUrls[index]) && (
                                          <Typography variant="body2" mt={1}>
                                            Archivo seleccionado: {files[index]?.name || fileUrls[index]?.split('/').pop()}
                                          </Typography>
                                        )}

                                        {errors.facturas?.[index]?.file && (
                                          <Typography
                                            variant="body2"
                                            mt={1}
                                            sx={{ color: 'error.main' }}
                                          >
                                            {'El archivo es obligatorio'}
                                          </Typography>
                                        )}
                                      </>
                                    )}

                                      </Grid>
                                         


                                  

                                        
                                        
                                     
                                      </Grid>
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                              </Grid>

                            </Grid>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                             disabled={ isFinished? true: false}
                            sx={{ marginLeft: 'auto' }}
                            onClick={() => {
                              // Calcular el nuevo índice basado en los existentes
                              const nuevosIndices = orchestDisabled.map(item => item.indice);
                              const nuevoIndice = nuevosIndices.length > 0 ? Math.max(...nuevosIndices) + 1 : 0;

                              // Agregar el nuevo elemento a orchestDisabled
                              setOrchestDisabled(prev => [
                                ...prev,
                                { indice: nuevoIndice, status: false }
                              ]);
                              // Agregar la nueva factura
                              push({
                                is_creada: false,
                                opDate: values.opDate,
                                applyGm: false,
                                amount: 0,
                                payedAmount: 0,
                                nombreInversionista: '',
                                investorProfit: 0,
                                cuentaInversionista: '',
                                factura: '',
                                fraccion: 1,
                                discountTax:values.discountTax,
                                valorFuturo: '',
                                valorFuturoManual: false,
                                fechaEmision: null,
                                valorNominal: 0,
                                porcentajeDescuento: 0,
                                probableDate:  `${new Date()}`,
                                investorTax: 0,
                                nombrePagador: '',
                                fechaFin:  `${addDays(new Date(),1)}`,
                                saldoDisponible: 0,
                                saldoDisponibleInfo: 0,
                                diasOperaciones: 1,
                                operationDays: 1,
                                comisionSF: 0,
                                gastoMantenimiento: 0,
                                fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
                                fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
                                opExpiration: `${new Date().toISOString().substring(0, 10)}`,
                                presentValueInvestor: 0,
                                presentValueSF: 0,
                                montoDisponibleInfo: 0,
                              });
                            }}
                          >
                            Agregar Factura
                          </Button>
                        </Grid>
                      </>
                    )}
                  </FieldArray>
                  <Grid item xs={12}>
                    <Button 
                    disabled={ isFinished? true: false}
                    type="submit" variant="contained" color="primary">
                      Registrar Operación
                    </Button>
                  </Grid>
                </Grid>
                {/* Modal de Confirmación usando Dialog */}
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
                {/* Debug */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ marginTop: 20 }}>
                    <h4>Errores:</h4>
                    <pre>{JSON.stringify(errors, null, 2)}</pre>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                  </div>
                )}
              </Form>

            );
          }}
        </Formik>
<Dialog
  open={openPreview}
  onClose={() => setOpenPreview(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      height: '80vh'
    }
  }}
>
  <DialogTitle>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Previsualización del Documento</Typography>
      <IconButton onClick={() => setOpenPreview(false)}>
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent dividers>
    {renderPreviewContent()} {/* Aquí se usa la función */}
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => setOpenPreview(false)} 
      variant="contained" 
      color="primary"
    >
      Cerrar
    </Button>
  </DialogActions>
</Dialog>
 <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Box>
    </LocalizationProvider>
  );
};
export default ManageOperationC;   