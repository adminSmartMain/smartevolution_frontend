import { useState,useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { Toast } from "@components/toast";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AccountSelect from "@components/selects/accountSelect";
import BillsByOperationSelect from "@components/selects/billByOperationSelect";
import ClientSelect from "@components/selects/customerSelect";
import OperationSelect from "@components/selects/operationBySelect";
import ReceiptStatusSelect from "@components/selects/receiptStatusSelect";
import TypeReceiptSelect from "@components/selects/typeReceiptSelect";
import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseFieldReceipts";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import dayjs from "dayjs";
import InfoIcon from '@mui/icons-material/Info';
import { Dialog,DialogContent, CircularProgress,Grid,TextField,Divider,Tooltip, IconButton} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import ModalConfirmation from "@components/modals/receiptBillModals/modalConfirmation";

import ProcessModal from "@components/modals/receiptBillModals/processModal"
import authContext from "@context/authContext";
export const ReceiptC = ({ formik, 
                            data, 
                            pendingAmount,
                            presentValueInvestor,
                            loading,
                            success,
                            isModalOpen,
                            setIsModalOpen,
                            showConfirmationModal,
                            setShowConfirmationModal }) => {
  
  const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));
  const [valueDate, setValueDate] = useState(dayjs("2014-08-18T21:11:54"));
   const { user, logout } = useContext(authContext);


console.log(data)
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (newValue) => {
    setValueDate(newValue);
  };
  const renderNombreUsuario = (usuario) => (
    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {usuario?.name}
    </Box>
  );

    const handleSubmitWithConfirmation = () => {
    if (formik.values.payedAmount <= 0) {
      Toast("Debe ingresar un valor a pagar", "error");
      return;
    }

    if (formik.values.receiptStatus === "") {
      Toast("Debe seleccionar un tipo de recaudo", "error");
      return;
    }

    setShowConfirmationModal(true);
  };
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <form onSubmit={formik.onSubmit}>

           <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                    paddingBottom: 2,
                    borderBottom: '1px solid #e0e0e0'
                  }}> 
            <Typography
              letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="3%"
              color="#5EA3A3"
              sx={{ mb: 0.5 }} 
            >
              Registrar Recaudo  Op : {data?.opId}
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
         
 
      {/* Primera fila con 4 campos */}<Grid container rowSpacing={2} columnSpacing={4} alignItems="flex-start">
        <Grid item xs={12} md={2}>
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="DD/MM/YYYY"
            value={valueD}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                id="date"
                placeholder="Ingresa la fecha"
                name="date"
                type="date"
              label="Fecha de aplicación"
                fullWidth
                value={formik.values.date}
                
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                sx={formik.touched.date && Boolean(formik.errors.date) ? 
                  { border: "1.4px solid #E6643180" } : null}
              />
            )}
          />
          <HelperText>
            {formik.touched.date && formik.errors.date}
          </HelperText>
        </Grid>

        <Grid item xs={12} md={2}>
          <ReceiptStatusSelect
            formik={formik}
            disabled={false}
          />
        </Grid>

    
    <Grid item xs={12} md={1}>
  <TextField
    id="calculatedDays"
    placeholder="Días Cálculo"
    name="calculatedDays"
    type="number"
    label="Días Cálculo"
    value={formik.values.calculatedDays}
    fullWidth
    InputProps={{
      endAdornment: (
        <Tooltip
          title="Este campo se completa automáticamente con los dias reales calculados, pero puedes modificarlo manualmente"
          placement="top-end"
          arrow
        >
          <IconButton edge="end" size="small" aria-label="Información">
            <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
          </IconButton>
        </Tooltip>
      ),
    }}
    onChange={formik.handleChange}
    error={formik.touched.calculatedDays && Boolean(formik.errors.calculatedDays)}
  />
</Grid>
<Grid item xs={12} md={4}>
  <BaseField
    fullWidth
    InputProps={{
      startAdornment: (
        <i
          style={{
            color: "#5EA3A3",
            marginRight: "0.7vw",
            fontSize: "1.1vw",
          }}
          className="far fa-dollar-sign"
        ></i>
      ),
      endAdornment: (
        <Tooltip
          title="Debe ser el monto registrado en el banco"
          placement="top-end"
          arrow
        >
          <IconButton edge="end" size="small" aria-label="Información">
            <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
          </IconButton>
        </Tooltip>
      ),
    }}
    id="payedAmount"
    name="payedAmount"
    label="Monto Aplicación"
    value={formik.values.payedAmount}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={0}
    allowNegative={false}
    isMasked
    error={formik.touched.payedAmount && Boolean(formik.errors.payedAmount)}
    onChangeMasked={(values) => {
                    formik.setFieldValue("payedAmount", values.floatValue);
                  }}
  />
</Grid>

  


  
 <Grid item xs={12} md={2}>
      <TypeReceiptSelect formik={formik} disabled={true} />
    </Grid>

  <Grid item xs={12} md={1}> {/* Contenedor flex */}
     <TextField
        id="additionalDays"
        placeholder="Días adicionales"
        label="Días adicionales"
        name="additionalDays"
        type="number"
       fullWidth
        value={formik.values.additionalDays}
        disabled={true}
        
        onChange={formik.handleChange}
        error={formik.touched.additionalDays && Boolean(formik.errors.additionalDays)}
        
      />
    </Grid>
      </Grid>



   
  


                    {/* Contenedores de datos operacion y recuados */}
<Grid container spacing={2}>
 <Grid container spacing={2} mt={7} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ mb: 0.5 }}  // Reduje el marginBottom a 0.5 (4px)
    >
      Datos de la Operación

    </Typography>
    
    <Divider 
      sx={{ 
        backgroundColor: '#5EA3A3', 
        height: '1px',
        width: '100%',
        mt: 0.5,  // Margen superior reducido
        mb: 5     // Margen inferior normal
      }} 
    />

    
  </Box>

 
<Grid container spacing={2}>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Nombre inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.investor?.social_reason || `${data?.investor?.first_name || ''} ${data?.investor?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>

  {/* NIT del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">NIT inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.investor?.document_number}
      </Box>
    </Typography>
  </Grid>

  

  {/* Cuenta de inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Cuenta de Inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.clientAccount?.account_number}
      </Box>
    </Typography>
  </Grid>

  {/* Factura asociada */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Factura asociada:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.bill?.billId}
      </Box>
    </Typography>
  </Grid>
</Grid>
</Grid>
                
                
  <Grid container spacing={2} mt={7} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ mb: 0.5 }}  // Reduje el marginBottom a 0.5 (4px)
    >
      Datos de Recaudos
    </Typography>
    
    <Divider 
      sx={{ 
        backgroundColor: '#5EA3A3', 
        height: '1px',
        width: '100%',
        mt: 0.5,  // Margen superior reducido
        mb: 2     // Margen inferior normal
      }} 
    />
  </Box>

  <Grid container spacing={2}>
  {/* Días reales */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Dias reales</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.realDays}
        
      </Box>
    </Typography>
  </Grid>

  {/* Valor futuro Recalculado */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor futuro Recalculado</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.futureValueRecalculation?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>
  <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

    {/* Pendiente por cobrar  */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Pendiente por cobrar  <Tooltip 
        title="Muestra el saldo pendiente después de descontar el monto aplicado y los intereses adicionales al valor nominal de la factura."
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
      </Tooltip></Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {pendingAmount}

        
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales totales  */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales totales </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.additionalInterests?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>
 <Grid item xs={12}>
    <Divider sx={{ borderColor:'#d8d7d7ff' }} />
  </Grid>

    {/* Remanente Emisor    */}
    <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Remanente Emisor   <Tooltip 
        title={<p>Este campo se calcula automáticamente cuando el <strong>monto neto del recaudo</strong> (Monto aplicación -  Intereses adicionales) es mayor que el valor pendiente de pago</p>}
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
      </Tooltip></Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.remaining?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales Inv. */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales Inv. </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.investorInterests?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>

   <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

  {/* Valor presente Inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor presente Inversionista :</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {presentValueInvestor?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales mesa */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales mesa :</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.additionalInterestsSM?.toFixed(0)}
      </Box>
    </Typography>
  </Grid>
</Grid>

 <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

</Grid>
          
   
           
          
           
            
            {formik.values.lastDate && (
              <>

               {/* Fecha Último Recaudo */}
               <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Último Recaudo</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.lastDate}
      </Box>
    </Typography>
  </Grid>

   {/* Monto Recaudos Previos< */}
   <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Monto Recaudos Previos</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.previousPayedAmount}
      </Box>
    </Typography>
  </Grid>
 <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff'}} />
  </Grid>

   {/* Intereses */}
   <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem"> Intereses</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.interest}
      </Box>
    </Typography>
  </Grid>
        <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>
       
              </>
            )}

            {data?.previousOperationBill && (
              <>
              <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem"> Fecha Radicación</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.previousOpDate}
      </Box>
    </Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">  Tasa Descuento</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.previousDiscountTax}
      </Box>
    </Typography>
  </Grid>
   <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">  Nro Operacion</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
       {formik.values.previousOpNumber}
      </Box>
    </Typography>
  </Grid>
          <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>
     
              </>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "calc(34vw + 4rem)",
                justifyContent: "flex-end",
              }}
            ></Box>

          
          

    {/* MODAL DE PROCESO */}
    <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
      <DialogContent>
        {success === null ? (
          <>
            <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
            <Typography variant="h6">Procesando...</Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
            <Typography variant="h5" color="success.main">¡Registro Exitoso!</Typography>
          </>
        ) : (
          <>
            <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
            <Typography variant="h5" color="error.main">Error al Registrar</Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
   

     <Grid item xs={12}>
            <MuiButton
              type="button"
              variant="contained"
              onClick={handleSubmitWithConfirmation}
              disabled={formik.isSubmitting || loading}
              sx={{
                mb: 2,
                mt: 2,
                ml: 2,
                boxShadow: "none",
                borderRadius: "4px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '20rem',
              }}
            >
              <Typography fontWeight="bold" sx={{ textAlign: 'center' }}>
                Registrar
              </Typography>
            </MuiButton>
          </Grid> 

               </Grid>
               


        </form>
       {/* Modal de Confirmación */}
        <ModalConfirmation
            values={formik.values}
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            handleSubmit={formik.handleSubmit}
          />

          <ProcessModal
            open={isModalOpen}
            success={success}
            onClose={() => setIsModalOpen(false)}
          />

      <ToastContainer
        position="top-right"
        autoClose={2000}
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
           
    </>
  );
};