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
  IconButton, Tooltip,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import { Bills, GetBillFraction, GetRiskProfile, BrokerByClient, AccountsFromClient,getTypeBill } from "./queries";
import { parseISO } from "date-fns";
import { differenceInDays, startOfDay, addDays } from "date-fns";
import EmitterSelector from "@components/selects/billCreateSelects/EmitterSelector";
import PayerSelector from "@components/selects/billCreateSelects/PayerSelector";
import BillManualSelector from "@components/selects/billCreateSelects/BillManualSelector";


import SaldoDisponibleSelector from "@components/selects/billCreateSelects/SaldoDisponibleSelector";
import TypeBillSelector from "@components/selects/billCreateSelects/TypeBillSelector";
import SubTotalSelector from "@components/selects/billCreateSelects/SubTotalSelector";
import TotalSelector from "@components/selects/billCreateSelects/TotalSelector";
import RetFteSelector from "@components/selects/billCreateSelects/RetFteSelector";
import RetIcaSelector from "@components/selects/billCreateSelects/RetIcaSelector";
import RetIvaSelector from "@components/selects/billCreateSelects/RetIvaSelector";
import IvaSelector from "@components/selects/billCreateSelects/IvaSelector";
import OtrasRetSelector from "@components/selects/billCreateSelects/OtrasRetSelector";
import fileToBase64 from "@lib/fileToBase64";
import ModalConfirmation from "@components/modals/createBillModals/modalConfirmation";
import ProcessModal from "@components/modals/createBillModals/processModal";






const FilePreviewModal = ({ open, onClose, file, fileUrl }) => {
  const renderPreviewContent = () => {
    if (!file && !fileUrl) return null;

    const isPDF = (file?.type?.includes('pdf') || (fileUrl && fileUrl.includes('.pdf')));

    if (isPDF) {
      const src = fileUrl || URL.createObjectURL(file);
      return (
        <Box sx={{
          width: '100%',
          height: 'calc(100% - 64px)', // Ajusta según el espacio del header/footer
          display: 'flex',
          flexDirection: 'column'
        }}>
          <iframe 
            src={`${src}#view=fitH`} // Añade parámetro para ajustar al ancho
            width="100%"
            height="100%"
            style={{ 
              border: 'none',
              flexGrow: 1,
              minHeight: '500px'
            }}
            title="Vista previa del PDF"
          />
        </Box>
      );
    }

    // Para imágenes
    const src = fileUrl || URL.createObjectURL(file);
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        maxHeight: '70vh'
      }}>
        <Image
          src={src}
          alt="Vista previa del documento"
          width={800}
          height={600}
          style={{ 
            width: 'auto', 
            height: 'auto', 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain' 
          }}
          onLoad={() => !fileUrl && URL.revokeObjectURL(src)}
        />
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh', // Aumentamos la altura del modal
          maxHeight: 'none'
        }
      }}
    >
      <DialogTitle sx={{ 
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Previsualización del Documento</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{
        p: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {renderPreviewContent()}
      </DialogContent>
      <DialogActions sx={{ 
        py: 1,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button onClick={onClose} variant="contained" color="primary" size="small">
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
});debounce




//comentario de prueba
const BillCreationComponent = ({
  opId,
  emitters,
  payers,
actionsFormik,
  onFormSubmit,
  validationSchema2,
isFinished,
handleConfirm,
  success,
  setShowConfirmationModal,
  showConfirmationModal,
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
  const { user, logout } = useContext(authContext);
const [showAllPayers, setShowAllPayers] = useState(false);


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
  const {
    fetch: fetchBills,
    loading: loadingBills,
    error: errorBills,
    data: dataBills,
  } = useFetch({ service: Bills, init: false });

  const renderNombreUsuario = (usuario) => (
    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {usuario?.name}
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
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };



  const [initialPayer, setInitialPayer] = useState(null);

  function handleOnChange(event) {
    const data = new FormData(event.currentTarget)
    const values = Array.from(data.values())
    const changedFields = values.filter(value => value.length);

    
  }


  const handleFileChange = (event,setFieldValue) => {
  const selectedFile = event.target?.files[0];
  
  
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




const handleSubmit = async (values, actions) => {
    try {
      await onFormSubmit(values, actions); // 🔥 Ejecuta el submit del padre
    } finally {
      actions.setSubmitting(false);
    }
  };

  const initialValues2 = {
    emitter: '',
    emitterName: '',
    nombrePagador: '',
    filtroEmitterPagador: { emitter: "", payer: "" },
    currentBalance: 0,
    filteredPayers: "",
    billId: '',
    factura: '',
    DateBill:  `${new Date()}`,
    emitterId:'',
    payerName:'',
    payerId:'',
    datePayment:  `${addDays(new Date(),1)}`,
    typeBill:'fdb5feb4-24e9-41fc-9689-31aff60b76c9',
   expirationDate:  `${addDays(new Date(),1)}`,
   ret_fte:0,
   ret_ica:0,
   ret_iva:0,
   subTotal:0,
    iva:0,
    total:0,
    other_ret:0,
    file: null,

  };
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
  return (

    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />




      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
            <Grid container justifyContent="space-between" alignItems="center">
      {/* Título - Ocupa toda la fila en móviles, 6/12 en pantallas más grandes */}
      <Grid item xs={12} md={6}>
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          Creación de Facturas
        </Typography>
      </Grid>
      
      {/* Información del usuario - Ocupa toda la fila en móviles, 6/12 en pantallas más grandes */}
      <Grid item xs={12} md={6} sx={{ 
        textAlign: { xs: 'left', md: 'right' },
        marginTop: { xs: '0.2rem', md: 0 },
        marginBottom: { xs: '1rem', md: 0 }
      }}>
        {user ? (
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Creado por: {renderNombreUsuario(user)}
          </Typography>
        ) : (
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Sin información de autoría
          </Typography>
        )}
      </Grid>
    </Grid>
        <Formik
          initialValues={initialValues2}
          validationSchema={validationSchema2}
          onSubmit={handleConfirm}
           >
          {({ values, setFieldValue, touched, errors, handleBlur, setTouched, setFieldTouched, setFieldError,isValid, isSubmitting  }) => {
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
                  dataTypeBill={dataTypeBill} // Tus datos como los muestras
                 
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
                      errors={errors}
                      debouncedCheckBill={debouncedCheckBill}
                    />
                  </Grid>

                    <Grid item xs={12} md={4} >
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
                        maxDate={new Date()} // Esto limita a fechas hasta hoy
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '56px' // Increased height
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
                        min={parseISO(values.DateBill)} // Esto limita a fechas hasta hoy
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
                        mask="__/__/____"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '56px' // Increased height
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
                        value={values.datePayment ?values.datePayment  : null}
                        
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
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '56px' // Increased height
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
                    />
                  </Grid>

                {/* fila typeBill */}
                 <Grid container item xs={12} spacing={2}>
                  <Grid item xs={12} md={6}>
<div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}

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
                    />
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

                  <Grid item xs={12} md={6}>
                    <SubTotalSelector
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors

                      }

                      formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                      parseFloat={parseFloat}

                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <IvaSelector
                      values={values}
                      setFieldValue={setFieldValue}


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


                      formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                      parseFloat={parseFloat}

                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RetFteSelector
                      values={values}
                      setFieldValue={setFieldValue}


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

                <Grid item xs={12} md={8} sx={{ 
  marginTop: '16px', 
  backgroundColor: 'grey.100', 
  p: 2, 
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}}>
  {/* Contenedor principal que cambia de dirección en móviles */}
  <Box 
    display="flex" 
    flexDirection={{ xs: 'column', sm: 'row' }} 
    alignItems={{ xs: 'stretch', sm: 'center' }}
    gap={{ xs: 2, sm: 2 }}
  >
    {/* Botón para seleccionar archivo */}
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      sx={{ 
        flexShrink: 0,
        width: { xs: '100%', sm: 'auto' }
      }}
    >
      Seleccionar archivo
      <VisuallyHiddenInput 
        type="file" 
        onChange={(e) => handleFileChange(e, setFieldValue)}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </Button>
    
    {/* Botón de previsualización */}
    <Button
      variant="outlined"
      startIcon={<PreviewIcon />}
      onClick={handleOpenPreview}
      disabled={!file && !fileUrl}
      sx={{
        backgroundColor: (file || fileUrl) ? 'background.paper' : 'grey.300',
        color: (file || fileUrl) ? 'text.primary' : 'text.disabled',
        flexShrink: 0,
        width: { xs: '100%', sm: 'auto' },
        '&:hover': {
          backgroundColor: (file || fileUrl) ? 'action.hover' : 'grey.300'
        }
      }}
    >
      Previsualizar
    </Button>

    {/* Información del archivo - Ocupa el ancho completo en móviles */}
    {(file || fileUrl) && (
      <Box 
        sx={{ 
          flexGrow: 1, 
          width: { xs: '100%', sm: 'auto' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            wordBreak: 'break-word',
            backgroundColor: 'white',
            p: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          Archivo seleccionado: {file?.name || fileUrl?.split('/').pop()}
          {file?.size && (
            <span> ({formatFileSize(file.size)})</span>
          )}
        </Typography>
      </Box>
    )}
  </Box>
  
  {/* Mensaje de error */}
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
          
                {/* Botón de submit */}
<Grid 
  item 
  xs={12} 
  sm={3} 
  md={2} 
  style={{ 
    marginTop: '16px', 
    display: 'flex', 
    justifyContent: 'center',
    padding: '8px'
  }}
>
  <Button
    type="submit"
    variant="contained"
    color="primary"
    fullWidth
    disabled={isSubmitting || isFinished}
    sx={{
      minWidth: { xs: '100%', sm: '120px' },
      fontSize: { xs: '0.875rem', sm: '0.9rem' },
      py: { xs: 1, sm: 1.2 }
    }}
  >
    {isSubmitting ? 'Procesando...' : isFinished ? 'Registro completado' : 'Registrar'}
  </Button>
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

          <FilePreviewModal 
        open={openPreview} 
        onClose={handleClosePreview} 
        file={file}
        fileUrl={fileUrl}
      />
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

export default BillCreationComponent