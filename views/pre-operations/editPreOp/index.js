// Hooks
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
// Alerts
import { ToastContainer } from "react-toastify";
import {  startOfDay,isSameDay } from "date-fns";
import { useRouter } from "next/router";
import { isValid, isAfter } from 'date-fns'; // Asegúrate de importar estas funciones
import { Toast } from "@components/toast";
import * as Yup from 'yup';
import { useFetch } from "@hooks/useFetch";
import { toast } from "react-toastify";

// Components
import { ManageOperationC } from "./components";
// Queries
import {
  CreateOperation,
  DeleteOperation,
  GetBillFraction,
  TypeOperation,
  GetLastOperationId,
  GetOperationById,
  GetRiskProfile,
  UpdateOperation,
  Clients,GetAllUsers
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
  const [operation, setOperation] = useState([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [payer, setPayer] = useState([]);
  const [client, setClient] = useState([]);
  const [users, setUsers] = useState([]);
  const [investor,setInvestor]=useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccessA] = useState(null);
  const [typeOp, setTypeOp] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actions,  setActions] = useState('');
  const [loading2, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
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


  useEffect(() => {
    if (data) {
      var Clients = [];
      data.data.map((client) => {
        Clients.push({
          label: client.first_name
            ? client.first_name +
              " " +
              client.last_name +
              " - " +
              client.document_number
            : client.social_reason + " - " + client.document_number,
          value: client.id,
          data:client,
        });
      });
      setClient(Clients);
    }
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
        });
      });
      setPayer(Payers);
    }
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
        });
      });
      setInvestor(Payers);
    }
  }, [data, loading, error]);


  const validationSchema2 = Yup.object({
    opId: Yup.number()
      .required('ID de operación es obligatorio')
      .typeError('Debe ser un número válido'),
    opDate: Yup.date()
      .required('Fecha de operación es obligatoria')
      .typeError('Fecha inválida'),
    opType: Yup.string().required('Tipo de operación es obligatorio'),
    emitter: Yup.string().required('Emisor es obligatorio'),
    emitterBroker: Yup.string().required('Corredor emisor es obligatorio'),
    investorTax: Yup.number().required('Este campo es obligatorio').test(
            'is-after-discountTax',
            'La tasa de inversionsita debe ser menor o igual a la tasa de descuento',
            function(value) {
    
              const discountTax = this.parent?.discountTax; // Accede al valor raíz
              if (!discountTax || !value) return true;
              return value <= discountTax;
            }
          ),
    investor: Yup.string().required('Inversionista es obligatorio'),
    investorBroker: Yup.string().required('Corredor inversionista es obligatorio'),
    clientAccount: Yup.string().required('Cuenta de cliente es obligatoria'),
    bill: Yup.string().when('massive', {
      is: false,
      then: Yup.string().required('Factura es obligatoria')
    }),
    billFraction: Yup.number()
      .required('Fracción es obligatoria')
      .min(0, 'No puede ser negativo'),
    DateBill: Yup.date().required('Fecha de factura es obligatoria'),
    DateExpiration: Yup.date().required('Fecha de vencimiento es obligatoria'),
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
    operationDays:Yup.number().required('Este campo es obligatorio'),
   
   
  
    investorProfit: Yup.number()
      .required('Rentabilidad inversionista es obligatoria')
      .min(0, 'No puede ser negativo'),
    payedAmount: Yup.number()
      .required('Monto a pagar es obligatorio')
      .min(0, 'No puede ser negativo'),
    payedPercent:Yup.number()
            .required('Este campo es obligatorio')
            .min(0, 'El descuento no puede ser menor a 0%')
            .max(100, 'El descuento no puede ser mayor a 100%'),
    status: Yup.number()
      .required('Estado es obligatorio')
      .oneOf([0, 1], 'Estado inválido'),
    isReBuy: Yup.boolean(),
    massive: Yup.boolean(),
    probableDate: Yup.date()
            .required('Este campo es obligatorio')
            .test(
            'is-same-or-after-opdate',
            'La fecha probable debe ser igual o posterior a la fecha de operación',
            function(value) {
              console.log(value)
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
  opExpiration: Yup.date()
  .required('Este campo es obligatorio').test(
    'is-after-probable',
    'La fecha fin debe ser posterior o igual a la fecha probable',
    function(value) {

      console.log(value)
      
      const probableDate = this.parent.probableDate
       if (!probableDate || !value) return true;
      const endDate = value;
      const valueDate = new Date(endDate);
      valueDate.setHours(0, 0, 0, 0);

      const probableDateObj = new Date(probableDate);
      probableDateObj.setHours(0, 0, 0, 0);

 



      return valueDate >= probableDateObj;
    }
  ),
    operationDays:Yup.number().required('Este campo es obligatorio'),
    commissionSF: Yup.number().required('Este campo es obligatorio'),
    GM: Yup.number().required('Este campo es obligatorio'),
    investorBrokerName:Yup.string().required('Este campo es obligatorio'),
    integrationCode: Yup.string().when('massive', {
      is: true,
      then: Yup.string().required('Código de integración es obligatorio para operaciones masivas')
    }),
    filtroEmitterPagador: Yup.object().shape({
      emitter: Yup.string().required('Filtro emisor es obligatorio'),
      payer: Yup.string().required('Filtro pagador es obligatorio')
    })
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

  const operationData = {
    id: values.id,
    DateBill: values.DateBill || new Date().toISOString().substring(0, 10),
    DateExpiration: values.DateExpiration || new Date().toISOString().substring(0, 10),
    amount: Number(values.amount) || 0,
    payedAmount:values.payedAmount,
    bill: values.billBack,
    billCode:  "",
    billFraction: Number(values.billFraction) || 0,
    client: values.clientId,
    clientAccount: values.clientAccount,
    commissionSF: Number(values.commissionSF) || 0,
    discountTax: Number(values.discountTax) || 0,
    emitter: values.emitter,
    emitterBroker: values.emitterBroker,
    GM: Number(values.GM) || 0,
    investor: values.investor,
    investorBroker: values.investorBroker,
    investorProfit: Number(values.investorProfit) || 0,
    investorTax: Number(values.investorTax) || 0,
    isPartiallyPayed: Boolean(values.isPartiallyPayed),
    isRebuy: Boolean(values.isReBuy),
   opDate: values.opDate ? new Date(values.opDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
opExpiration: values.opExpiration ? new Date(values.opExpiration).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
    opId: values.opId,
    opPendingAmount: Number(values.opPendingAmount) || 0,
    opType: values.opType,
    operationDays: Number(values.operationDays) || 0,
    payedPercent: Number(values.payedPercent) || 0,
    payer: values.payer,
    presentValueInvestor: Number(values.presentValueInvestor) || 0,
    presentValueSF: Number(values.presentValueSF) || 0,
    state: true,
    status: 0,
    integrationCode: values.integrationCode || ""
  };

 
  try {
    await validationSchema2.validate(values, { abortEarly: false });
    const data = [...operations, { ...operationData }];
   
    const response = await updateOperationFetch(data,operation,'');

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





return (
  <>
    {opId && <ManageOperationC 
              opId={opId}
              emitters={client}
              investors={client}
              dataDetails={operation}
              validationSchema2={validationSchema2}
              typeOperation={dataTypeIdSelect}
              loading={loading}
              success={success}
              isModalOpen={isModalOpen}
              onFormSubmit={onSubmit}
              payers={payer}
              showConfirmationModal={showConfirmationModal}
              handleConfirm={handleConfirm}
              setShowConfirmationModal={setShowConfirmationModal}
              actionsFormik={actions}
              users={users}
               />}

  </>
);

};
