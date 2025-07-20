import Head from "next/head";


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isValid, isAfter } from 'date-fns'; // Asegúrate de importar estas funciones
import { Toast } from "@components/toast";
import * as Yup from 'yup';
import { useFetch } from "@hooks/useFetch";
import { toast } from "react-toastify";
import {
  CreateOperation,
  DeleteOperation,
  GetBillFraction,
  TypeOperation,
  GetLastOperationId,
  GetOperationById,
  GetRiskProfile,
  UpdateOperation,
  Clients,GetAllUsers,
 CreateBillManually,
  
} from "./queries";
import BillCreationComponent from "./components";
import { Bills, billById, payerByBill } from "./queries";
export default function BillCreation() {
// States

  const [opId, setOpId] = useState(null);
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [operation, setOperation] = useState([]);

  const [payer, setPayer] = useState([]);
  const [client, setClient] = useState([]);
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccessA] = useState(null);
  const [typeOp, setTypeOp] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actions,  setActions] = useState('');
  const [loading2, setLoading] = useState(false);

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
      fetch: fetchAllUsers,
      loading: loadingAllUsers,
      error: errorAllUsers,
      data: dataAllUsers,
    } = useFetch({ service: GetAllUsers, init: true });


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

  const {
    fetch: createBillManuallyFetch,
    loading: loadingcreateBillManually,
    error: errorcreateBillManually,
    data: datacreateBillManually,
  } = useFetch({ service: CreateBillManually, init: false });

  // Hooks
      const {
        fetch: fetchTypeIdSelect,
        loading: loadingTypeIdSelect,
        error: errorTypeIdSelect,
        data: dataTypeIdSelect,
      } =  useFetch({ service: TypeOperation, init: true });

    // Detect when the user is editing an operation
    useEffect(() => {
      if (router && router.query) {
        
        if (router.query.id) {
      
          setId(router.query.id);
        }
  
        if (router.query.previousDeleted) {
          
        }
      }
    }, [router.query]);

  
    useEffect(() => {
      if (id) {
        getOperationByIdFetch(id); // Hace la consulta
        setIsEditing(true);
      }
    }, [id]);
    
    useEffect(() => {
      if (dataGetOperationById) {
        setOperation(dataGetOperationById);
      }
    }, [dataGetOperationById]); // Espera a que los datos lleguen


    useEffect(() => {
      if (dataAllUsers) {
        setUsers(dataAllUsers);
      }
    }, [dataAllUsers]); // Espera a que los datos lleguen

 // Get the last operation id
  useEffect(() => {
    if (dataGetLastId) {
      setOpId(dataGetLastId.data);
      
    }
  }, [loadingGetLastId, errorGetLastId, dataGetLastId]);



useEffect(() => {
  if (dataTypeIdSelect) {
  
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

  useEffect(() => {
    if (data) {
      var Payers = [];
      data.data.map((client) => {
       Payers.push({
          label: client.first_name
            ? client.first_name +
              " " +
              client.last_name +
              " - " +
              client.document_number
            : client.social_reason + " - " + client.document_number,
          value: client.first_name
          ? client.first_name +
            " " +
            client.last_name 
          : client.social_reason,
          data:client,
          id:client.id,
          sortKey: client.social_reason || `${client.first_name} ${client.last_name}`}
        )}).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      setPayer(Payers);
    }
  }, [data, loading, error]);








  
const validationSchema2 = Yup.object({
  emitter: Yup.string().required('Emisor es obligatorio'),
  nombrePagador: Yup.string().required('Emisor es obligatorio'),

  billId: Yup.string().when('massive', {
    is: false,
    then: Yup.string().required('Factura es obligatoria')
  }),
  DateBill: Yup.date()
  .required('La fecha de emisión es obligatoria')
  .max(new Date(), 'La fecha de emisión no puede ser futura'),

datePayment: Yup.date()
  .required('La fecha de pago es obligatoria')
  .min(
    Yup.ref('DateBill'), 
    'La fecha de pago no puede ser anterior a la fecha de emisión'
  ),

expirationDate: Yup.date()
  .required('La fecha de vencimiento es obligatoria')
  .min(
    Yup.ref('DateBill'), 
    'La fecha de vencimiento no puede ser anterior a la fecha de emisión'
  ),
    
   
    typeBill: Yup.string().required('tipo de factura es obligatorio'),
  currentBalance: Yup.number()
    .required('Monto a pagar es obligatorio')
    .min(0, 'No puede ser negativo'),
  subTotal: Yup.number()
  .required('Monto a pagar es obligatorio')
  .min(0, 'No puede ser negativo')
  .moreThan(0, 'El monto no puede ser cero'), // Asegura que sea mayor que 0
    
  arrayPayers: Yup.array()
    .min(1, 'Debe seleccionar al menos un pagador')
    .required('Debe seleccionar al menos un pagador'),
    file: Yup.string().required('Emisor es obligatorio'),
});

// Efecto para manejar la alerta de saldo insuficiente
useEffect(() => {
  if (dataUpdateOperation?.data?.insufficientAccountBalance) {
    toast(
      "El monto de la operación es mayor al saldo disponible en la cuenta del cliente",
      "warning"
    );
  }
}, [dataUpdateOperation]); // Se ejecutará cada vez que dataCreateOperation cambie


const onSubmit = async (values, { setSubmitting }) => {
  setIsModalOpen(true);
  setLoading(true);
  setSubmitting(true);
  setSuccessA(null); // Estado inicial
  console.log(values.payer)
  const operationData = {
  
    dateBill: values.fechaEmision || new Date().toISOString().substring(0, 10),
    expirationDate: values.DateExpiration || new Date().toISOString().substring(0, 10),
    currentBalance: Number(values.currentBalance) || 0,
    billId: values.factura,
    bill: values.factura,
    typeBill:values.typeBill,
    datePayment:values.datePayment,
    billValue:values.subTotal,
    subTotal:values.total,
    total:values.currentBalance,
    emitterId: values.emitter,
    payerName:values.payerName,
    payerId: values.filtroEmitterPagador.payer,
    emitterName:values.emitterName,
    file:values.file,
    ret_fte: values.ret_fte || 0,
    ret_ica: values.ret_ica || 0,
    ret_iva: values.ret_iva || 0,
    iva: values.iva || 0,
    other_ret: values.other_ret || 0,

  };

 
  try {
    await validationSchema2.validate(values, { abortEarly: false });
    const data = operationData ;
   
    const response = await createBillManuallyFetch(data);

    // 4. Verificar respuesta
    if (response?.error) {
      throw new Error(response.error.message || "Error en el servidor");
    }


     
    
      Toast("Todas las operaciones se completaron con éxito", "success");
      
      setTimeout(() => {
        setIsModalOpen(false);
        
      }, 5000);
   
    // 5. Manejar éxito
    setSuccessA(true); // ✅ Actualizar estado de éxito
    Toast("Operación completada con éxito", "success");
    setTimeout(() => console.log('ya'), 5000);

  } catch (error) {
    
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


const handleConfirm = async (values,actions) => {

  setShowConfirmationModal(true);
  setActions(actions)

  // Verifica en React DevTools si el estado realmente cambió
};
  const [isFinished,setIsFinished] =useState(null)
  
  return (
    <>
      <Head>
        <title>Consulta de facturas</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <BillCreationComponent
      payers={payer}
      emitters={client}
      onFormSubmit={onSubmit}
    handleConfirm={handleConfirm}
      validationSchema2={validationSchema2}
      actionsFormik={actions}
       isFinished={isFinished}
      />
    </>
  );
}
