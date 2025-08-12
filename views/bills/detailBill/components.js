import { useEffect, useState, useContext, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { 
  Box, 
  Button, 
  Typography,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,Tooltip,
} from "@mui/material";
import { useFetch } from "@hooks/useFetch";
import { debounce } from 'lodash';
import { TextField, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form } from 'formik';
import Axios from "axios";
import authContext from "@context/authContext";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import "react-toastify/dist/ReactToastify.css";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import {






  TableFooter,
  TablePagination,

} from '@mui/material';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage
} from '@mui/icons-material';

import "react-toastify/dist/ReactToastify.css";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { Bills, GetBillFraction, GetRiskProfile, BrokerByClient, AccountsFromClient,getTypeBill } from "./queries";
import { parseISO } from "date-fns";
import InfoIcon from '@mui/icons-material/Info';

import EmitterSelector from "@components/selects/billDetailSelects/EmitterSelector";
import PayerSelector from "@components/selects/billDetailSelects/PayerSelector";
import BillManualSelector from "@components/selects/billDetailSelects/BillManualSelector";

import SaldoDisponibleSelector from "@components/selects/billDetailSelects/SaldoDisponibleSelector";
import TypeBillSelector from "@components/selects/billDetailSelects/TypeBillSelector";
import SubTotalSelector from "@components/selects/billDetailSelects/SubTotalSelector";
import TotalSelector from "@components/selects/billDetailSelects/TotalSelector";
import RetFteSelector from "@components/selects/billDetailSelects/RetFteSelector";
import RetIcaSelector from "@components/selects/billDetailSelects/RetIcaSelector";
import RetIvaSelector from "@components/selects/billDetailSelects/RetIvaSelector";
import IvaSelector from "@components/selects/billDetailSelects/IvaSelector";
import OtrasRetSelector from "@components/selects/billDetailSelects/OtrasRetSelector";
import fileToBase64 from "@lib/fileToBase64";
import ModalConfirmation from "@components/modals/createBillModals/modalConfirmation";
import ProcessModal from "@components/modals/createBillModals/processModal";

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
    if (file.type.includes('pdf')) {
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

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: '20px' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
//comentario de prueba
const BillCreationComponent = ({
  opId,
  emitters,
  payers,
onFormSubmit,
  isFinished,
  validationSchema2,
users,
bill,

 

}) => {

  const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
  const [orchestDisabled, setOrchestDisabled] = useState([{ indice: 0, status: false }])
  const emisores = emitters;
  const [openEmitterBrokerModal, setOpenEmitterBrokerModal] = useState(false)
  const [clientPagador, setClientPagador] = useState(null);
  const [isSelectedPayer, setIsSelectedPayer] = useState(false)
    // Estados para el archivo y previsualización
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAllPayers, setShowAllPayers] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const usuarioEncontrado = users?.data?.find(user => user.id ===  bill?.user_created_at);
  const usuarioEncontradoEdit = users?.data?.find(user => user.id === bill?.user_updated_at);
  console.log(users,usuarioEncontrado,usuarioEncontradoEdit)

  const opcionesFormato = {
    dateStyle: 'short',
    timeStyle: 'medium'
  };
const createdAt = new Date(bill?.created_at);
  const updatedAt = bill?.updated_at ? new Date(bill?.updated_at) : null;
  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const createdAtLocal = createdAt.toLocaleString(undefined, opcionesFormato);
  const updatedAtLocal = updatedAt ? updatedAt.toLocaleString(undefined, opcionesFormato) : null;


    const tooltipText = `
🕒 Creado el: ${createdAtLocal} (${zonaHoraria})
🛠️ Última actualización: ${updatedAtLocal ? `${updatedAtLocal} (${zonaHoraria})` : 'No ha sido actualizado'}
`;
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


  const eventos = [
    { codigo: '001', fecha: '2023-01-01T10:30:00', evento: 'Creación de factura' },
    { codigo: '002', fecha: '2023-01-01T10:35:00', evento: 'Asignación de número de factura' },
    { codigo: '003', fecha: '2023-01-01T11:15:00', evento: 'Registro de emisor' },
    { codigo: '004', fecha: '2023-01-01T11:30:00', evento: 'Registro de cliente' },
    { codigo: '005', fecha: '2023-01-01T12:45:00', evento: 'Adición de productos' },
    { codigo: '006', fecha: '2023-01-01T13:20:00', evento: 'Cálculo de subtotal' },
    { codigo: '007', fecha: '2023-01-01T14:00:00', evento: 'Aplicación de IVA' },
    { codigo: '008', fecha: '2023-01-01T14:30:00', evento: 'Cálculo de total' },
    { codigo: '009', fecha: '2023-01-02T09:15:00', evento: 'Corrección de datos del cliente' },
    { codigo: '010', fecha: '2023-01-02T10:00:00', evento: 'Actualización de productos' },
    { codigo: '011', fecha: '2023-01-02T11:30:00', evento: 'Ajuste de descuentos' },
    { codigo: '012', fecha: '2023-01-02T12:45:00', evento: 'Revisión de impuestos' },
    { codigo: '013', fecha: '2023-01-02T14:00:00', evento: 'Aprobación inicial' },
    { codigo: '014', fecha: '2023-01-03T08:30:00', evento: 'Carga de archivo adjunto' },
    { codigo: '015', fecha: '2023-01-03T09:45:00', evento: 'Verificación de datos' },
    { codigo: '016', fecha: '2023-01-03T11:00:00', evento: 'Aprobación final' },
    { codigo: '017', fecha: '2023-01-03T12:30:00', evento: 'Generación de PDF' },
    { codigo: '018', fecha: '2023-01-03T14:15:00', evento: 'Envío al cliente' },
    { codigo: '019', fecha: '2023-01-04T10:00:00', evento: 'Notificación de recepción' },
    { codigo: '020', fecha: '2023-01-05T09:30:00', evento: 'Primer recordatorio de pago' },
    { codigo: '021', fecha: '2023-01-10T10:15:00', evento: 'Segundo recordatorio de pago' },
    { codigo: '022', fecha: '2023-01-15T11:00:00', evento: 'Pago parcial recibido' },
    { codigo: '023', fecha: '2023-01-20T14:30:00', evento: 'Pago completo recibido' },
    { codigo: '024', fecha: '2023-01-20T15:00:00', evento: 'Registro de pago en sistema' },
    { codigo: '025', fecha: '2023-01-20T15:30:00', evento: 'Generación de recibo' },
    { codigo: '026', fecha: '2023-01-20T16:00:00', evento: 'Envío de recibo al cliente' },
    { codigo: '027', fecha: '2023-01-21T09:00:00', evento: 'Cierre de factura' },
    { codigo: '028', fecha: '2023-01-22T10:00:00', evento: 'Archivado digital' },
    { codigo: '029', fecha: '2023-01-23T11:00:00', evento: 'Notificación de cierre al cliente' },
    { codigo: '030', fecha: '2023-01-31T12:00:00', evento: 'Registro en contabilidad general' }
  ];

 const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const {
    fetch: fetchBills,
    loading: loadingBills,
    error: errorBills,
    data: dataBills,
  } = useFetch({ service: Bills, init: false });

  const renderNombreUsuario = (usuario) => (
    
  <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
  {usuario?.social_reason || 
   `${usuario?.first_name || ''} ${usuario?.last_name || ''}`.trim()}
</Box>
  );
    const {
      fetch: fetchTypeBill,
      loading: loadingTypeBill,
      error: errorTypeBill,
      data: dataTypeBill,
    } = useFetch({ service: getTypeBill, init: true });

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




  // Función para formatear el número con separadores de miles
  const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    
    // Convert to string and split into integer and decimal parts
    const [integerPart, decimalPart] = value.toString().split('.');
    
    // Format only the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Combine with decimal part if it exists
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

  console.log(dataTypeBill)

  const [initialPayer, setInitialPayer] = useState(null);

  function handleOnChange(event) {
    const data = new FormData(event.currentTarget)
    const values = Array.from(data.values())
    const changedFields = values.filter(value => value.length);
    console.log("changedFields")
    
  }


  const handleFileChange = (event,setFieldValue) => {
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
      // Extraemos solo la parte base64 (sin el prefijo data:application/pdf;base64,)
 
      
      // Guardamos el archivo original para previsualización
      setFile(selectedFile);
      
      // Actualizamos Formik con el formato que espera el backend
     setFieldValue('file', e.target.result); // Solo el string base64 sin prefijo
      
      // Crear vista previa si es una imagen
      if (selectedFile.type.includes('image')) {
        setFilePreview(e.target.result); // Aquí usamos el resultado completo con prefijo
      } else {
        setFilePreview(null);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      toast.error('Error al procesar el archivo');
    };
    
    reader.readAsDataURL(selectedFile);
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



  const [filteredPayers, setFilteredPayers] = useState([]);
  const [filteredPayersBills, setFilteredPayerBills] = useState([]);
  const [filteredAcountsInvestor, setAcountsInvestor] = useState([]);



  // Combinar el pagador inicial con los filtrados


console.log(fileUrl)

const handleConfirm = async (values, actions) => {
  try {
    await onFormSubmit(values, actions);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    toast.error('Error al enviar el formulario');
    actions.setSubmitting(false);
  }
};
  console.log(bill)



 // Efecto para cargar pagadores filtrados
   useEffect(() => {
   
     // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
     if (bill?.payer) {
       const payerFromDetails = {
         id:  bill.payerId,
         data: {
           document_number: bill.payer.document_number,
           social_reason: bill.payer.social_reason,
           first_name: bill.payer.first_name,
           last_name: bill.payer.last_name
         }
       };
       setInitialPayer(payerFromDetails);
 
     }
     const loadFilteredPayers = async () => {
       const emitterId = bill?.emitterId;
 
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
   }, [ bill?.emitterId, payers]); // Dependencias específicas
 
   // Combinar el pagador inicial con los filtrados
   const allPayers = useMemo(() => {
     if (!initialPayer) return filteredPayers;
     // Evitar duplicados
     const existsInFiltered = filteredPayers.some(p =>
       p.data.document_number === initialPayer.data.document_number
     );
     return existsInFiltered ? filteredPayers : [initialPayer, ...filteredPayers];
   }, [initialPayer, filteredPayers]);
 console.log(allPayers)

const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  // Parseamos la fecha ISO del backend
  const date = parseISO(dateString);
  // Ajustamos por zona horaria
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

console.log( bill?.bill?.currentBalance)
 
  const initialValues2 = {
    emitter:  bill?.emitterName,
    nombrePagador:  bill?.payerName,
    filtroEmitterPagador: { emitter: "", payer: "" },
    currentBalance: bill?.currentBalance,
    filteredPayers: "",
    billId: bill?.billId,
    factura: bill?.billId,
    emitterId:bill?.emitterId,
    payerName:bill?.payerName,
    payerId:bill?.payerId,
    DateBill: parseBackendDate(bill?.dateBill),
    datePayment:parseBackendDate(bill?.datePayment),
    expirationDate:  parseBackendDate(bill?.expirationDate),
    typeBill:bill?.typeBill,
    file:  bill?.file,
    ret_fte:bill?.ret_fte,
    ret_ica:bill?.ret_ica,
    ret_iva:bill?.ret_iva,
    subTotal:bill?.subTotal,
    iva:bill?.iva,
    total:bill?.total,
    other_ret:bill?.other_ret,
    arrayPayers:allPayers,

  };

  console.log(initialValues2)
  console.log(bill)
const handleOpenPreview = () => {
    if (!file && !fileUrl) {
      toast.warning('No hay archivo para previsualizar');
      return;
    }
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  return (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
    {/* Para mostrar los toast */}
    <ToastContainer position="top-right" autoClose={5000} />

    <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
      {/* Sistema de Tabs */}
      <Box sx={{ width: '100%', mb: 3 }}>
         <Tabs 
  value={activeTab} 
  onChange={(event, newValue) => setActiveTab(newValue)}
  sx={{
    '& .MuiTabs-indicator': {
      backgroundColor: '#5EA3A3', // Color del indicador
    },
    '& .MuiTab-root': {
      color: '#5EA3A3', // Color del texto cuando no está seleccionado
    },
    '& .Mui-selected': {
      color: '#5EA3A3 !important', // Color del texto cuando está seleccionado
    },
  }}
>
<Tab 
    label="Detalle de Factura" 
    sx={{
      fontFamily: '"Montserrat", "icomoon", sans-serif', // Ejemplo de fuente

      fontSize: '1.5rem', // Tamaño de fuente
      textTransform: 'none', // Evita mayúsculas
      color: '#5EA3A3',
      '&.Mui-selected': {
        color: '#488B8F',
      }
    }}
  />
  <Tab 
    label="Historial de Eventos" 
    sx={{
      fontFamily: '"Montserrat", "icomoon", sans-serif',

      fontSize: '1.5rem',
      textTransform: 'none',
      color: '#5EA3A3',
      '&.Mui-selected': {
        color: '#488B8F',
      }
    }}
  />
</Tabs>
      </Box>

      {activeTab === 0 ? (
        // Contenido de la primera pestaña (detalle de factura)
        <>
          <Box
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography
              letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="0.7rem"
              color="#5EA3A3"
            >
              Ver Factura
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexWrap: 'wrap',
            }}>
              {/* Badge "Autogestión" */}
              {bill.integrationCode && (
                <Box
                  sx={{
                    backgroundColor: "#488B8F",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    alignSelf: 'center',
                    marginTop: 0,
                  }}
                >
                  Autogestión
                </Box>
              )}

              {/* Información de autoría */}
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

                {/* Tooltip (icono de información) */}
                {(usuarioEncontrado || usuarioEncontradoEdit) && (
                  <Tooltip
                    title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
                    arrow
                    placement="top"
                  >
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          <Formik
            initialValues={initialValues2}
            validationSchema={validationSchema2}
            onSubmit={handleConfirm}
            enableReinitialize={true}
          >
            {({ values, setFieldValue, touched, errors, handleBlur, setTouched, setFieldTouched, setFieldError, isValid, isSubmitting }) => {
              return(
                <Form translate="no" onChange={handleOnChange}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TypeBillSelector 
                        errors={errors}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        values={values}
                        dataTypeBill={dataTypeBill}
                        integrationCode={bill?.integrationCode}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <BillManualSelector
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        orchestDisabled={orchestDisabled}
                        dataBills={dataBills}
                        setFieldTouched={setFieldTouched}
                        setFieldError={setFieldError}
                        integrationCode={bill?.integrationCode}
                        debouncedCheckBill={debouncedCheckBill}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <SaldoDisponibleSelector
                        values={values}
                        setFieldValue={setFieldValue}
                        formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                        parseFloat={parseFloat}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Emisión"
                            maxDate={new Date()}
                            value={values.DateBill ? values.DateBill : null}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('DateBill', formattedDate);
                              } else {
                                setFieldValue('DateBill', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            mask="__/__/____"
                            disabled
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={touched.DateBill && Boolean(errors.DateBill)}
                                helperText={touched.DateBill && errors.DateBill}
                                onKeyDown={(e) => {
                                  if (!/[0-9/]/.test(e.key) && 
                                      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                                      e.preventDefault();
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Vencimiento"
                            value={values.expirationDate ? values.expirationDate : null}
                            min={parseISO(values.DateBill)}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('expirationDate', formattedDate);
                              } else {
                                setFieldValue('expirationDate', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            disabled
                            mask="__/__/____"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={errors.expirationDate && Boolean(errors.expirationDate)}
                                helperText={touched.expirationDate && errors.expirationDate}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Fecha de pago"
                            value={values.datePayment ? values.datePayment : null}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('datePayment', formattedDate);
                              } else {
                                setFieldValue('datePayment', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            mask="__/__/____"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                disabled
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={errors.datePayment && Boolean(errors.datePayment)}
                                helperText={touched.datePayment && errors.datePayment}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                        setClientWithoutBroker={setClientWithoutBroker}
                        setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
                        integrationCode={bill?.integrationCode}
                      />
                    </Grid>

                    {/* Segunda fila */}
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} md={6}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <PayerSelector
                              errors={errors}
                              dataBills={dataBills}
                              showAllPayers={showAllPayers}
                              payers={payers}
                              values={values}
                              setFieldValue={setFieldValue}
                              touched={touched}
                              setClientPagador={setClientPagador}
                              setIsSelectedPayer={setIsSelectedPayer}
                              integrationCode={bill?.integrationCode}
                            />
                          </div>
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
                                color: '#488F88',
                                '&:hover': {
                                  color: '#3a726c',
                                  backgroundColor: 'rgba(72, 143, 136, 0.1)'
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </div>    
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <SubTotalSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <IvaSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TotalSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RetIvaSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <RetIcaSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RetFteSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <OtrasRetSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>

                      <Grid item xs={8} sx={{ 
                        marginTop: '16px', 
                        backgroundColor: 'grey.100', 
                        p: 2, 
                        borderRadius: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Button
                            variant="outlined"
                            startIcon={<PreviewIcon />}
                            onClick={handleOpenPreview}
                            disabled={!file && !fileUrl}
                            sx={{
                              backgroundColor: (file || fileUrl) ? 'background.paper' : 'grey.300',
                              color: (file || fileUrl) ? 'text.primary' : 'text.disabled',
                              flexShrink: 0,
                              '&:hover': {
                                backgroundColor: (file || fileUrl) ? 'action.hover' : 'grey.300'
                              }
                            }}
                          >
                            Previsualizar
                          </Button>

                          {(file || fileUrl) && (
                            <Typography variant="body2" sx={{ ml: 1, flexGrow: 1, wordBreak: 'break-word' }}>
                              Archivo seleccionado: {file?.name || fileUrl?.split('/').pop()}
                              {file?.size && (
                                <span> ({formatFileSize(file.size)})</span>
                              )}
                            </Typography>
                          )}
                        </Box>
                        
                        {errors.file && (
                          <Typography 
                            variant="body2"
                            sx={{ color: 'error.main' }}
                          >
                            {'El archivo es obligatorio'}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

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
        </>
      ) : (
        // Contenido de la segunda pestaña (tabla de eventos)
        <Box sx={{ mt: 2 }}>
<Box
container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            sx={{ ml: 0.5}}>
  
          <Typography
          
            letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="0.7rem"
              color="#000000ff">

            {bill?.billId}
          </Typography>

          </Box>
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de eventos">
        <TableHead>
          <TableRow>
            <TableCell><strong>Código</strong></TableCell>
            <TableCell><strong>Fecha</strong></TableCell>
            <TableCell><strong>Evento</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? eventos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : eventos
          ).map((evento, index) => (
            <TableRow key={index}>
              <TableCell>{evento.codigo}</TableCell>
              <TableCell>
                {new Date(evento.fecha).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>{evento.evento}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[15, 30, { label: 'Todos', value: -1 }]}
              colSpan={3}
              count={eventos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'filas por página' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage="Eventos por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
      )}

      {/* Modales y otros componentes que necesites */}
      <FilePreviewModal 
        open={openPreview} 
        onClose={handleClosePreview} 
        file={file}
        fileUrl={fileUrl}
      />
    </Box>
  </LocalizationProvider>
);
};

export default BillCreationComponent