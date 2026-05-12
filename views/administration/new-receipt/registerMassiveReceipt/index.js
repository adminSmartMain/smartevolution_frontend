//REACT HOOKS
import { useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "@hooks/useFetch";
import * as Yup from 'yup';
import { addDays, differenceInDays, format, subDays } from "date-fns";
import { RegisterMassiveReceiptComponent  } from "./components"
import { useFormik } from "formik";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  CreateOperation,
  DeleteOperation,
  TypeOperation,
  GetBillFraction,
  GetLastOperationId,
  GetOperationById,
  GetRiskProfile,
  UpdateOperation,
  Clients,
  getOperationsVersionTwo,
} from "./queries";



export const RegisterMassiveReceiptIndex = () => {
  const [opId, setOpId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actions,  setActions] = useState('');
  const [client, setClient] = useState([]);
  const [payer, setPayer] = useState([]);
  const [typeOp, setTypeOp] = useState([]);


  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: Clients, init: true });
  const {
    fetch: getLastId,
    loading: loadingGetLastId,
    error: errorGetLastId,
    data: dataGetLastId,
  } = useFetch({ service: GetLastOperationId, init: true });
   
  const {
    fetch: fetchTypeIdSelect,
    loading: loadingTypeIdSelect,
    error: errorTypeIdSelect,
    data: dataTypeIdSelect,
  } =  useFetch({ service: TypeOperation, init: true });
          
  const handleConfirm = async (values,actions) => {

    setShowConfirmationModal(true);
    setActions(actions)

    // Verifica en React DevTools si el estado realmente cambió
  };






  

//GET TYPE OPERATION




// GET CLIENTS (EMITTERS)
useEffect(() => {
  if (!data) return;

  const processClients = (clients) => {
    return clients
      .map(client => ({
        label: client.first_name
          ? `${client.first_name} ${client.last_name} - ${client.document_number}`
          : `${client.social_reason} - ${client.document_number}`,
        value: client.id,
        data: client,
        sortKey: client.social_reason || `${client.first_name} ${client.last_name}`
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  };

  setClient(processClients(data.data));
}, [data, loading, error]);

// GET PAYERS
useEffect(() => {
  if (!data) return;

  const processPayers = (payers) => {
    return payers
      .map(client => ({
        label: client.first_name
          ? `${client.first_name} ${client.last_name} - ${client.document_number}`
          : `${client.social_reason} - ${client.document_number}`,
        value: client.first_name
          ? `${client.first_name} ${client.last_name}`
          : client.social_reason,
        data: client,
        id: client.id,
        sortKey: client.social_reason || `${client.first_name} ${client.last_name}`
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  };

  setPayer(processPayers(data.data));
}, [data, loading, error]);


    const validationSchema = Yup.object({
      opId: Yup.number()
        .required('Este campo es obligatorio')
        .typeError('Debe ser un número válido'), // Validación para campo numérico
      opDate: Yup.date().required('Este campo es obligatorio'),
      opType: Yup.string().required('Este campo es obligatorio'),
      emitter: Yup.string().required('Este campo es obligatorio'),
      corredorEmisor: Yup.string().required('El corredor emisor es requerido'),
      investorTax: Yup.number().required('Este campo es obligatorio'),
     discountTax: Yup.number()
      .required('Este campo es obligatorio')
      .test(
        'is-after-investorTax',
        'La tasa de descuento debe ser mayor o igual a la tasa de inversionista',
        function(value) {
    
          const investorTax = this.parent?.investorTax; // Accede al valor raíz
          
          // Solo saltar validación si investorTax no está definido
          if (investorTax === undefined || investorTax === null) return true;
          
          // Ahora 0 será comparado correctamente con investorTax
          return value >= investorTax;
        }
      ),
      
      facturas: Yup.array().of(
        Yup.object({
          billId: Yup.string().required('Este campo es obligatorio'),
         numbercuentaInversionista:Yup.string().required('Este campo es obligatorio'),
          investorProfit: Yup.number().required('Este campo es obligatorio').typeError('Debe ser un número válido'),
          nombreInversionista: Yup.string().required('Este campo es obligatorio'),
          //cuentaInversionista: Yup.string().required('Este campo es obligatorio'),
          factura: Yup.string().required('Este campo es obligatorio'),
          fraccion: Yup.number().required('Este campo es obligatorio'),
          investorTax: Yup.number().required('Este campo es obligatorio').test(
            'is-after-discountTax',
            'La tasa de inversionsita debe ser menor o igual a la tasa de descuento',
            function(value) {
    
              const discountTax = this.parent?.discountTax; // Accede al valor raíz
              if (!discountTax || !value) return true;
              return value <= discountTax;
            }
          ),
          valorFuturo: Yup.number()
            .required('Este campo es obligatorio')
            .typeError('Debe ser un número válido'),
          porcentajeDescuento: Yup.number()
            .required('Este campo es obligatorio')
            .min(0, 'El descuento no puede ser menor a 0%')
            .max(100, 'El descuento no puede ser mayor a 100%'),
          fechaEmision: Yup.date().required('Este campo es obligatorio'),
          valorNominal: Yup.number().required('Este campo es obligatorio').typeError('Debe ser un número válido'),
         probableDate: Yup.date()
            .required('Este campo es obligatorio')
            .test(
            'is-same-or-after-opdate',
            'La fecha probable debe ser igual o posterior a la fecha de operación',
            function(value) {
    
              const opDate = this.parent.opDate// Accede al valor raíz
              
              if (!opDate || !value) return true;
          
          // Normalizar fechas para comparación (ignorar husos horarios)
          const valueDate = new Date(value);
          valueDate.setHours(0, 0, 0, 0);
          
          const opDateObj = new Date(opDate);
          opDateObj.setHours(0, 0, 0, 0);
          
          return valueDate >= opDateObj;
            }
          ),
         fechaFin: Yup.date()
          .required('Este campo es obligatorio')
          .test(
            'is-after-probable',
            'La fecha fin debe ser posterior a la fecha probable',
            function(value) {
              
    
              const probableDate = this.parent.probableDate;
              if (!probableDate || !value) return true;
              return new Date(value) >= new Date(probableDate);
            }
          ),
          operationDays:Yup.number().required('Este campo es obligatorio'),
          comisionSF: Yup.number().required('Este campo es obligatorio'),
          gastoMantenimiento: Yup.number().required('Este campo es obligatorio'),
          investorBrokerName:Yup.string().required('Este campo es obligatorio'),
        })
      ),
    });



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
   takedBills: [],
filteredPayers: [],
billsToNegotiate: [],
payerId: "",
emitterId: "",
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


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (option === "register") {
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
      setSuccess(null); 
      setIsModalOpen(true); // Abrir el modal
      console.log(values)
      fetch(values);

      } else if (option === "modify") {
        setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
        setSuccess(null); 
        setIsModalOpen(true); // Abrir el modal
        fetch3(values);
      }
    },
  });

  const isInitialLoading =
  loading ||
  loadingGetLastId ||
  loadingTypeIdSelect ||
 
  !data ||
  !dataTypeIdSelect ||
  client.length === 0 ||
  payer.length === 0;
return (
  <>
    {isInitialLoading ? (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          color: "#488B8F",
        }}
      >
        <CircularProgress sx={{ color: "#488B8F" }} />

        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "#488B8F",
          }}
        >
          Cargando registro masivo...
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#777",
          }}
        >
          Preparando clientes, pagadores y datos de operación
        </Typography>
      </Box>
    ) : (
      <RegisterMassiveReceiptComponent 
        formik={formik}
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleConfirm={handleConfirm}
        opId={opId}
        emitters={client}
        investors={client}
        payers={payer}
        typeOperation={dataTypeIdSelect}
      />
    )}
  </>
);
}