// Hooks
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
// Alerts
import { ToastContainer } from "react-toastify";
import * as Yup from 'yup';
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";
import { toast } from "react-toastify";
// Components
import { ManageOperationC } from "./components";
// Queries
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
} from "./queries";
import { Bills, billById, payerByBill } from "./queries";
// Utils
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, format, subDays } from "date-fns";
import { useFormik } from "formik";

export const ManageOperationV = () => {
  // States
  const [created, setCreated] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [opId, setOpId] = useState(null);
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [operations, setOperations] = useState([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading2, setLoading] = useState(false);
  
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  // Router
  const router = useRouter();

  // Queries

    const {
      fetch: fetch,
      loading: loading,
      error: error,
      data: data,
    } = useFetch({ service: Clients, init: true });

  const {
      fetch: fetchBills,
      loading: loadingBills,
      error: errorBills,
      data: dataBills,
    } = useFetch({ service: Bills, init: false });

  // get the payer of the bill
  const {
    fetch: fetchPayer,
    loading: loadingPayer,
    error: errorPayer,
    data: dataPayer,
  } = useFetch({ service: payerByBill, init: false });

  // get the bill info
  const {
    fetch: fetchBill,
    loading: loadingBill,
    error: errorBill,
    data: dataBill,
  } = useFetch({ service: billById, init: false });
   

  const {
    fetch: getLastId,
    loading: loadingGetLastId,
    error: errorGetLastId,
    data: dataGetLastId,
  } = useFetch({ service: GetLastOperationId, init: true });

  const {
    fetch: getOperationByIdFetch,
    loading: loadingGetOperationById,
    error: errorGetOperationById,
    data: dataGetOperationById,
  } = useFetch({ service: GetOperationById, init: false });

  const {
    fetch: createOperationFetch,
    loading: loadingCreateOperation,
    error: errorCreateOperation,
    data: dataCreateOperation,
  } = useFetch({ service: CreateOperation, init: false });

  const {
    fetch: getBillFractionFetch,
    loading: loadingGetBillFraction,
    error: errorGetBillFraction,
    data: dataGetBillFraction,
  } = useFetch({ service: GetBillFraction, init: false });

  const {
    fetch: deleteOperationFetch,
    loading: loadingDeleteOperation,
    error: errorDeleteOperation,
    data: dataDeleteOperation,
  } = useFetch({ service: DeleteOperation, init: false });

  const {
    fetch: riskProfileFetch,
    loading: loadingRiskProfile,
    error: errorRiskProfile,
    data: dataRiskProfile,
  } = useFetch({ service: GetRiskProfile, init: false });

  const {
    fetch: updateOperationFetch,
    loading: loadingUpdateOperation,
    error: errorUpdateOperation,
    data: dataUpdateOperation,
  } = useFetch({ service: UpdateOperation, init: false });



    // Hooks
    const {
      fetch: fetchTypeIdSelect,
      loading: loadingTypeIdSelect,
      error: errorTypeIdSelect,
      data: dataTypeIdSelect,
    } =  useFetch({ service: TypeOperation, init: true });
        
 // Get the last operation id
  useEffect(() => {
    if (dataGetLastId) {
      setOpId(dataGetLastId.data);
      
    }
  }, [loadingGetLastId, errorGetLastId, dataGetLastId]);
console.log(opId)

const [client, setClient] = useState([]);
const [payer, setPayer] = useState([]);
const [typeOp, setTypeOp] = useState([]);


//GET TYPE OPERATION

useEffect(() => {
  if (dataTypeIdSelect) {
    console.log(dataTypeIdSelect)
    var typesID = [];
    dataTypeIdSelect.data.map((typeID) => {
      typesID.push({ label: typeID.description, value: typeID.id });
    });

    setTypeOp(typesID);
  }
}, [dataTypeIdSelect, loadingTypeIdSelect, errorTypeIdSelect]);


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
  facturas: Yup.array().of(
    Yup.object({
      billId: Yup.string().required('Este campo es obligatorio'),
     
      
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
      valorNominal: Yup.number().required('Este campo es obligatorio').typeError('Debe ser un número válido'),
      
      fechaFin: Yup.date().required('Este campo es obligatorio'),
      operationDays:Yup.number().required('Este campo es obligatorio'),
      comisionSF: Yup.number().required('Este campo es obligatorio'),
      gastoMantenimiento: Yup.number().required('Este campo es obligatorio'),
      investorBrokerName:Yup.string().required('Este campo es obligatorio'),
    })
  ),
});


 // Función para transformar cada factura en la estructura esperada por el backend
 const transformData = (data) => {
  
  return data.facturas.map((factura) => ({
    amount: factura.valorFuturo,
    applyGm: factura.gastoMantenimiento > 0,
    bill: factura.factura,
    billFraction: factura.fraccion,
    client: factura.nombreInversionista,
    clientAccount: factura.cuentaInversionista[0].id,
    comisionSF: factura.comisionSF,
    DateBill: factura.fechaEmision || new Date().toISOString().substring(0, 10),
    DateExpiration: new Date(factura.fechaFin).toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10),
    discountTax: data.discountTax,
    emitter: data.emitter.value,
    emitterBroker: data.emitterBroker,
    GM: factura.gastoMantenimiento || 0,
    id: "",
    investor: factura.nombreInversionista,
    investorBroker: factura.investorBroker,
    investorProfit: factura.investorProfit,
    investorTax: factura.investorTax,
    opDate: data.opDate.toISOString().substring(0, 10),
    operationDays: factura.operationDays,
    opExpiration: new Date(factura.fechaFin).toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10),
    opId: data.opId,
    opType: data.opType,
    payedAmount: factura.payedAmount,
    payedPercent:factura.porcentajeDescuento,
    payer: data.nombrePagador,
    presentValueInvestor: factura.presentValueInvestor,
    presentValueSF: factura.presentValueSF,
    probableDate: factura.probableDate,
    status: 0,
    billCode: "",
    isReBuy: false,
    massive: false,
    
  }));
};
// Efecto para manejar la alerta de saldo insuficiente
useEffect(() => {
  if (dataCreateOperation?.data?.insufficientAccountBalance) {
    toast(
      "El monto de la operación es mayor al saldo disponible en la cuenta del cliente",
      "warning"
    );
  }
}, [dataCreateOperation]); // Se ejecutará cada vez que dataCreateOperation cambie

  const onSubmit = async (values, { setSubmitting }) => {
    setIsModalOpen(true);
    setLoading(true);
    setSubmitting(true);
  
    try {
      await validationSchema.validate(values, { abortEarly: false });
      const facturasTransformadas = transformData(values);
      
      // 🔥 Versión optimizada con manejo de errores individual
      const results = await Promise.allSettled(
        facturasTransformadas.map(factura => 
          createOperationFetch(factura, factura.opId)
        )
      );
      console.log(results)
  
      // 1. Filtrar operaciones fallidas (las rechazadas)
          const failedOperations = results.filter(r => r.status === 'rejected');

          // 2. Verificar también operaciones "exitosas" con valor undefined
          const problematicOperations = results.filter(r => 
            r.status === 'fulfilled' && r.value === undefined
          );

          if (failedOperations.length > 0 || problematicOperations.length > 0) {
            const totalErrors = failedOperations.length + problematicOperations.length;
            const errorDetails = [
              ...failedOperations.map(op => op.reason?.message || 'Error desconocido'),
              ...problematicOperations.map(_ => 'Operación devolvió undefined')
            ];
            
            throw new Error(
              `${totalErrors} operaciones fallaron: ${errorDetails.join('; ')}`
            );
       
      }else{ setSuccess(true);
        Toast("Todas las operaciones se completaron con éxito", "success");
        
        setTimeout(() => {
          setIsModalOpen(false);
          
        }, 5000);}
     
      
  
    } catch (error) {
      setSuccess(false);
      console.error("Error detallado:", error);
      
      const errorMessage = error.name === 'ValidationError' 
        ? `Errores: ${error.errors.join(', ')}`
        : error.message || "Error en el proceso";
      
      Toast(errorMessage, "error");
    } finally {
      setLoading(false);
      setSubmitting(false);
      setIsModalOpen(false);
      // No necesitas setTimeout aquí si usas el modal para mostrar resultados
    }
  };
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actions,  setActions] = useState('');
  const handleConfirm = async (values,actions) => {
    console.log("1. Entrando a handleConfirm");
    setShowConfirmationModal(true);
    setActions(actions)
    console.log("2. Estado actualizado, showConfirmationModal debería ser true");
    // Verifica en React DevTools si el estado realmente cambió
  };
  
  // En tu componente principal
  console.log("3. Renderizado, showConfirmationModal:", showConfirmationModal);
  
  // 🔥 Elimina el useEffect completamente - Todo se maneja en onSubmit

return (
  <>
    {opId && <ManageOperationC 
              opId={opId}
              emitters={client}
              investors={client}
              payers={payer}
              typeOperation={dataTypeIdSelect}
              onFormSubmit={onSubmit}
              loading={loading}
              success={success}
              isModalOpen={isModalOpen}
              validationSchema={validationSchema}
              showConfirmationModal={showConfirmationModal}
              handleConfirm={handleConfirm}
              setShowConfirmationModal={setShowConfirmationModal}
              actionsFormik={actions}
               />}

  </>
);

};
