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
import Axios from "axios";

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
  getOperationsVersionTwo,
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
  const [isFinished,setIsFinished] =useState(null)
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

  const {
    fetch: getOperationsFetch,
    loading: loadingGetOperations,
    error: errorGetOperations,
    data: dataGetOperations,
  } = useFetch({
    service: () => getOperationsVersionTwo({ ...filters, page }),
    init: true,
  });

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


const [client, setClient] = useState([]);
const [payer, setPayer] = useState([]);
const [typeOp, setTypeOp] = useState([]);


//GET TYPE OPERATION

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


const transformData = (data) => {
  const usedBillCodes = {};
  const processedBillIds = {}; // Para rastrear billIds ya procesados

  return data.facturas.map((factura) => {
    console.log(factura.isReBuy)
    const baseStructure = {
      billId: factura.billId,
      is_creada: factura.is_creada || false,
      dataSent: {
        amount: factura.valorFuturo,
        applyGm: factura.gastoMantenimiento > 0,
        bill: factura.factura,
        billFraction: factura.fraccion,
        client: factura.nombreInversionista,
        clientAccount: factura.idCuentaInversionista|| '',
        commissionSF: factura.comisionSF,
        DateBill: factura.fechaEmision || new Date().toISOString().substring(0, 10),
        DateExpiration: new Date(factura.expirationDate).toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10),
        discountTax: data.discountTax,
        emitter: data.emitter.value,
        emitterBroker: data.emitterBroker,
        GM: factura.gastoMantenimiento || 0,
        billCode:"",
        investor: factura.nombreInversionista,
        investorBroker: factura.investorBroker,
        investorProfit: factura.investorProfit,
        investorTax: factura.investorTax,
        opDate: new Date(data.opDate).toISOString().substring(0, 10),
        operationDays: factura.operationDays,
        opExpiration: new Date(factura.fechaFin).toISOString().substring(0, 10) || new Date().toISOString().substring(0, 10),
        opId: data.opId,
        opType: data.opType,
        payedAmount: factura.payedAmount,
        payedPercent: factura.porcentajeDescuento,
        payer: data.nombrePagador,
        presentValueInvestor: factura.presentValueInvestor,
        presentValueSF: factura.presentValueSF,
        probableDate: new Date(factura.probableDate).toISOString().substring(0, 10),
        status: 0,
        isRebuy: factura.isReBuy,
        massive: false,
        saldoInicialFactura: factura.saldoDisponibleInfo, 
        file:factura.file,
      }
    };

    if (factura.is_creada) {
      if (!processedBillIds[factura.billId]) {
        // Primera factura con este billId
        processedBillIds[factura.billId] = true;
        
        if (factura.billCode && !usedBillCodes[factura.billCode]) {
          usedBillCodes[factura.billCode] = true;
          return {
            ...baseStructure,
            dataSent: {
              ...baseStructure.dataSent,
              billCode: factura.billCode,
              currentBalance: factura.saldoDisponible,
            },
            isFirstOccurrence: true // Marcamos como primera ocurrencia
          };
        }
      }
      
      // Facturas subsiguientes con el mismo billId
      return {
        ...baseStructure,
        needsGeneratedBillId: true, // Marcar que necesita obtener el ID generado
        isFirstOccurrence: false
      };
    }
    
    return baseStructure;
  });
};
// Efecto para manejar la alerta de saldo insuficiente
useEffect(() => {
  if (dataCreateOperation?.data?.insufficientAccountBalance) {
    Toast(
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
    console.log('🚀 INICIANDO onSubmit con valores:', values);
    
    await validationSchema.validate(values, { abortEarly: false });
    
    const facturasTransformadas = transformData(values);
    console.log('📋 Facturas transformadas:', facturasTransformadas);
    
    // Validación adicional para facturas creadas
    const facturasCreadas = facturasTransformadas.filter(f => f.is_creada);
    const billCodesUnicos = [...new Set(
      facturasCreadas
        .map(f => f.dataSent.billCode)
        .filter(code => code) // Filtramos códigos nulos/undefined
    )];
    
    console.log('📊 Facturas creadas:', facturasCreadas.length);
    console.log('📊 Bill codes únicos:', billCodesUnicos);
    
    if (facturasCreadas.length > billCodesUnicos.length) {
      console.warn("⚠️ Advertencia: Algunas facturas creadas no tienen billCode o están duplicados");
    }

    const billIds = [...new Set(facturasTransformadas.map(op => op.billId))];
    console.log('📋 Bill IDs únicos a verificar:', billIds);
    
    const saldoValido = await verificarSaldosFacturas(billIds, facturasTransformadas);
    console.log('✅ Resultado verificación saldos:', saldoValido);
    
    if (!saldoValido.todasValidas) {
      console.error('❌ Error de validación de saldos:', saldoValido.mensajeError);
      throw new Error(saldoValido.mensajeError || "Una o más facturas no cumplen con las reglas de saldo");
    }
    
    // Ejecución de operaciones
    console.log('🚀 Ejecutando operaciones atómicas...');
    const { success, successfulOperations, failedOperations } = await executeAtomicOperations(facturasTransformadas);
    
    console.log('📊 Resultado operaciones:', { success, successful: successfulOperations?.length, failed: failedOperations?.length });
    
    if (failedOperations?.length > 0) {
      console.error('❌ Operaciones fallidas:', failedOperations);
      throw new Error(
        `${failedOperations.length} operaciones fallaron: ${
          failedOperations.map(op => op.error?.message || op.error).join('; ')
        }`
      );
    }

    setSuccess(true);
    console.log('✅ Todas las operaciones exitosas');
    
    Toast(
      <div>
        <strong>¡Operaciones procesadas!</strong>
        <p>Se procesaron {facturasTransformadas.length} facturas correctamente</p>
        {facturasCreadas.length > 0 && (
          <p>Incluyendo {facturasCreadas.length} facturas creadas</p>
        )}
      </div>,'success'
    );
 
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsModalOpen(false);

    setTimeout(() => {
      console.log('🔄 Cerrando ventana...');
      window.close();
    }, 1500);
    
  } catch (error) {
    // Manejo de errores
    setSuccess(false);
    console.error("❌ Error detallado en onSubmit:", error);
    
    const errorMessage = error.name === 'ValidationError' 
      ? `Errores de validación: ${error.errors.join(', ')}`
      : error.message;
    
    Toast(
      <div>
        <strong>¡Operación cancelada!</strong>
        <p>{errorMessage}</p>
      </div>,
      'error'
    );
    
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 100, 200]);
    }
  } finally {
    setLoading(false);
    setSubmitting(false);
    console.log('🏁 Finalizando onSubmit');
  }
};
const verificarSaldosFacturas = async (billIds, facturasTransformadas) => {
  try {
    console.log('🔍 INICIANDO verificarSaldosFacturas');
    console.log('📋 billIds recibidos:', billIds);
    console.log('📋 facturasTransformadas:', facturasTransformadas);

    if (!Array.isArray(billIds) || billIds.length === 0) {
      throw new Error("No se proporcionaron IDs de facturas válidos");
    }

    // 1. Primero verificamos si hay billIds duplicados
    const billIdsConEstado = billIds.map((billId, index) => ({
      billId,
      emitterId: facturasTransformadas[index]?.dataSent?.emitter, // Obtener emitterId
      is_creada: facturasTransformadas[index]?.is_creada || false
    }));
    
    console.log('📊 billIdsConEstado:', billIdsConEstado);
    
    // Filtrar para obtener solo los únicos, manteniendo el estado is_creada
     const billIdsUnicos = Array.from(new Map(
      billIdsConEstado.map(item => [`${item.billId}_${item.emitterId}`, item])
    ).values());

    console.log('🔍 billIdsUnicos:', billIdsUnicos);

    // 2. Obtenemos los datos de todas las facturas únicas
    const resultadosUnicos = await Promise.all(
      billIdsUnicos.map(async (billIdInfo) => {
         const billIdStr = String(billIdInfo.billId).trim();
        const emitterId = billIdInfo.emitterId;
        const is_creada = billIdInfo.is_creada;
        
         console.log(`📡 Consultando API para billId: ${billIdStr}, emitterId: ${emitterId}, is_creada: ${is_creada}`);
        
        try {

            let url = `${process.env.NEXT_PUBLIC_API_URL}/bill/?bill_operation=${billIdStr}`;
          if (emitterId) {
            url += `&emitter=${emitterId}`;
          }
          const response = await Axios.get(
            url,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
              timeout: 10000,
            }
          );

          console.log(`✅ Respuesta API para ${billIdStr}:`, response.data);

          if (!response.data) {
            throw new Error("Respuesta vacía del servidor");
          }

          let factura;

          // CORRECCIÓN: La factura está en response.data.data
          if (response.data.data) {
            if (response.data.data.id || response.data.data.billId) {
              factura = response.data.data;
              console.log(`📋 Factura obtenida para ${billIdStr}:`, factura);
            } else {
              console.error('❌ Formato de data no reconocido:', response.data.data);
              throw new Error("Formato de data no reconocido");
            }
          } else if (response.data.id || response.data.billId) {
            // Backup por si alguna vez devuelve directamente
            factura = response.data;
            console.log(`📋 Factura obtenida directamente de response.data:`, factura);
          } else {
            console.error('❌ Formato de respuesta no reconocido:', response.data);
            throw new Error("Formato de respuesta no reconocido");
          }

          console.log(`📋 Factura obtenida para ${billIdStr}:`, factura);

          // Si la factura fue creada en el sistema (is_creada = true), no hacemos validaciones estrictas
           if (is_creada) {
            console.log(`🟢 Factura ${billIdStr} es creada - validación relajada`);
            return {
              billId: billIdStr,
              emitterId: emitterId,
              currentBalance: factura.currentBalance || factura.billValue || 0,
              billData: factura,
              status: "success",
              is_creada: true
            };
          }

          // Validaciones solo para facturas NO creadas en el sistema
          console.log(`🔵 Factura ${billIdStr} NO es creada - validación estricta`);
          
          if (factura.state !== true && factura.state !== undefined) {
            console.error(`❌ Factura ${billIdStr} no está activa:`, factura.state);
            throw new Error("Factura no está activa");
          }

          if (typeof factura.currentBalance !== 'number') {
            console.error(`❌ Saldo inválido para ${billIdStr}:`, factura.currentBalance);
            throw new Error("Valor de saldo inválido");
          }

          return {
            billId: billIdStr,
            emitterId: emitterId,
            currentBalance: factura.currentBalance,
            billData: factura,
            status: "success",
            is_creada: false
          };

        } catch (error) {
            console.error(`❌ Error en factura ${billIdStr}:`, error);
            
            // Log más detallado del error de la API
            if (error.response) {
              console.error('❌ Error response status:', error.response.status);
              console.error('❌ Error response data:', error.response.data);
            }
            
            // Si la factura fue creada en el sistema, permitimos que continúe
            if (is_creada) {
              console.log(`🟡 Factura ${billIdStr} es creada pero tuvo error, continuando...`);
              
              // Buscar el amount en las facturas transformadas
              const facturaCorrespondiente = facturasTransformadas.find(f => 
                String(f.billId).trim() === billIdStr
              );
              
              const amount = facturaCorrespondiente?.dataSent?.amount || 0;
              
              console.log(`🟡 Monto encontrado para factura creada ${billIdStr}:`, amount);
              
              return {
                billId: billIdStr,
                currentBalance: amount,
                status: "success",
                is_creada: true,
                error: "Factura creada en el sistema - validación relajada"
              };
            }
            
            let errorMessage = `Error en factura ${billIdStr}: `;
            
            if (error.response) {
              errorMessage += error.response.data?.message || error.response.statusText || error.response.status;
            } else {
              errorMessage += error.message;
            }

            return {
              billId: billIdStr,
              emitterId: emitterId,
              currentBalance: 0,
              status: "error",
              error: errorMessage,
              tipoError: "ERROR_VERIFICACION",
              is_creada: false
            };
          }
      })
    );

    console.log('📊 resultadosUnicos:', resultadosUnicos);

    // 3. Mapeamos los resultados a todas las facturas (incluyendo duplicados)
    const resultados = billIds.map((billId, index) => {
      const billIdStr = String(billId).trim();
      const resultadoUnico = resultadosUnicos.find(r => r.billId === billIdStr);
      const is_creada = facturasTransformadas[index]?.is_creada || false;
      
      console.log(`📋 Mapeando resultado para ${billIdStr}, is_creada: ${is_creada}`, resultadoUnico);
      
      if (!resultadoUnico || (resultadoUnico.status !== "success" && !is_creada)) {
        const errorResult = {
          billId: billIdStr,
          currentBalance: 0,
          valida: false,
          error: resultadoUnico?.error || "Factura no verificada",
          status: "error",
          tipoError: "ERROR_VERIFICACION",
          is_creada: is_creada
        };
        console.log(`❌ Resultado inválido para ${billIdStr}:`, errorResult);
        return errorResult;
      }

      const result = {
        ...resultadoUnico,
        valida: true, // Lo validaremos después
        is_creada: is_creada
      };
      
      console.log(`✅ Resultado válido para ${billIdStr}:`, result);
      return result;
    });

    console.log('📊 Resultados después del mapeo:', resultados);

    // 4. Ahora validamos las reglas para cada factura
    const resultadosFinales = billIds.map((billId, index) => {
      const billIdStr = String(billId).trim();
      const resultado = resultados[index];
      const is_creada = resultado.is_creada;
      
      console.log(`🔍 Validando reglas para ${billIdStr}, is_creada: ${is_creada}`, resultado);

      // Si ya hay un error y NO es una factura creada, lo mantenemos
      if (resultado.status !== "success" && !is_creada) {
        console.log(`❌ Manteniendo error previo para ${billIdStr}`);
        return resultado;
      }

      // Obtenemos todas las facturas con este billId
      const facturasConMismoId = facturasTransformadas.filter(f => String(f.billId).trim() === billIdStr);
      const facturaOperacion = facturasTransformadas[index];
      
      console.log(`📋 Facturas con mismo ID ${billIdStr}:`, facturasConMismoId);
      console.log(`📋 Factura operación:`, facturaOperacion);

      if (!facturaOperacion) {
        const errorResult = {
          ...resultado,
          valida: false,
          error: `No se encontró la factura en la operación`,
          status: "error",
          tipoError: "ERROR_OPERACION",
          is_creada: is_creada
        };
        console.log(`❌ No se encontró factura en operación:`, errorResult);
        return errorResult;
      }

      // Para facturas creadas en el sistema, validaciones relajadas
      if (is_creada) {
        console.log(`🟢 Validación relajada para factura creada ${billIdStr}`);
        
        // Solo verificamos que el amount sea positivo
        if (facturaOperacion.dataSent.amount <= 0) {
          const errorResult = {
            ...resultado,
            valida: false,
            error: `El monto debe ser mayor a 0`,
            status: "error",
            tipoError: "MONTO_INVALIDO",
            is_creada: true
          };
          console.log(`❌ Monto inválido para factura creada:`, errorResult);
          return errorResult;
        }
        
        const successResult = {
          ...resultado,
          valida: true,
          status: "success",
          is_creada: true
        };
        console.log(`✅ Factura creada válida:`, successResult);
        return successResult;
      }

      // REGLA 1: Si currentBalance es 0 (solo para facturas no creadas)
      if (resultado.currentBalance === 0) {
        const errorResult = {
          ...resultado,
          valida: false,
          error: `Factura ${billIdStr} tiene saldo 0`,
          status: "error",
          tipoError: "SALDO_CERO",
          is_creada: false
        };
        console.log(`❌ Saldo cero para factura no creada:`, errorResult);
        return errorResult;
      }

      // REGLA 2: Para facturas duplicadas, suma de amounts vs currentBalance
      if (facturasConMismoId.length > 1) {
        const totalAmount = facturasConMismoId.reduce((sum, f) => sum + f.dataSent.amount, 0);
        
        console.log(`📊 Factura duplicada ${billIdStr}: totalAmount=${totalAmount}, currentBalance=${resultado.currentBalance}`);
        
        if (totalAmount > resultado.currentBalance) {
          const errorResult = {
            ...resultado,
            valida: false,
            error: `La suma de montos (${totalAmount}) para factura ${billIdStr} excede el saldo (${resultado.currentBalance})`,
            status: "error",
            tipoError: "MONTO_EXCEDIDO",
            is_creada: false
          };
          console.log(`❌ Monto excedido en factura duplicada:`, errorResult);
          return errorResult;
        }
      } 
      // REGLA 3: Para facturas únicas, amount vs currentBalance
      else if (facturaOperacion.dataSent.amount > resultado.currentBalance) {
        console.log(`📊 Factura única ${billIdStr}: amount=${facturaOperacion.dataSent.amount}, currentBalance=${resultado.currentBalance}`);
        
        const errorResult = {
          ...resultado,
          valida: false,
          error: `El monto a pagar (${facturaOperacion.dataSent.amount}) excede el saldo (${resultado.currentBalance})`,
          status: "error",
          tipoError: "MONTO_EXCEDIDO",
          is_creada: false
        };
        console.log(`❌ Monto excedido en factura única:`, errorResult);
        return errorResult;
      }

      // Si pasa todas las validaciones
      const successResult = {
        ...resultado,
        valida: true,
        status: "success",
        is_creada: false
      };
      console.log(`✅ Factura válida después de todas las validaciones:`, successResult);
      return successResult;
    });

    console.log('📊 Resultados finales:', resultadosFinales);

    // 5. Clasificación de resultados finales
    const facturasValidas = resultadosFinales.filter(r => r.valida);
    const facturasConSaldoCero = resultadosFinales.filter(r => r.tipoError === "SALDO_CERO");
    const facturasConMontoExcedido = resultadosFinales.filter(r => r.tipoError === "MONTO_EXCEDIDO");
    const otrosErrores = resultadosFinales.filter(r => !r.valida && r.tipoError !== "SALDO_CERO" && r.tipoError !== "MONTO_EXCEDIDO");

    console.log('📊 Clasificación:');
    console.log('✅ Facturas válidas:', facturasValidas.length);
    console.log('❌ Facturas con saldo cero:', facturasConSaldoCero.length);
    console.log('❌ Facturas con monto excedido:', facturasConMontoExcedido.length);
    console.log('❌ Otros errores:', otrosErrores.length);

    // 6. Preparar mensaje de error compuesto
    let mensajeError = "";
    if (facturasConSaldoCero.length > 0) {
      mensajeError += `Facturas con saldo 0: ${facturasConSaldoCero.map(f => f.billId).join(', ')}. `;
    }
    if (facturasConMontoExcedido.length > 0) {
      mensajeError += `Facturas con monto excedido: ${facturasConMontoExcedido.map(f => `${f.billId} (${f.error})`).join(', ')}. `;
    }
    if (otrosErrores.length > 0) {
      mensajeError += `Errores de verificación: ${otrosErrores.map(f => f.billId).join(', ')}.`;
    }

    const resultadoFinal = {
      exitoso: facturasValidas.length === billIds.length,
      facturasValidas,
      facturasConSaldoCero,
      facturasConMontoExcedido,
      otrosErrores,
      todasValidas: facturasValidas.length === billIds.length,
      facturaInvalida: resultadosFinales.find(r => !r.valida) || null,
      detalles: resultadosFinales,
      mensajeError: mensajeError.trim()
    };

    console.log('🎯 Resultado final de verificación:', resultadoFinal);
    return resultadoFinal;

  } catch (error) {
    console.error("❌ Error crítico en verificarSaldosFacturas:", error);
    throw new Error(`Error al verificar saldos: ${error.message}`);
  }
};



const executeAtomicOperations = async (operations) => {
  const progressToast =Toast(`Procesando ${operations.length} operaciones...`);

  try {
    // Preparar payload marcando primeras ocurrencias
    const payload = operations.map((op, index) => ({
      ...op.dataSent,
      _isFirstOccurrence: operations.findIndex(
        o => o.billId === op.billId
      ) === index
    }));

    const response = await createOperationFetch(payload, payload[0]?.opId);

    // Procesar resultados
    const failed = response?.data.failed || [];
    const successful = response?.data.successful || [];

    Toast(progressToast);
    
 
    return {
      success: failed.length === 0, // true solo si no hay fallos
      successfulOperations: successful,
      failedOperations: failed,
      totalOperations: operations.length
    };

  } catch (error) {
    Toast(progressToast,'error');
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      totalOperations: operations?.length
    };
  }
};

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actions,  setActions] = useState('');
  const handleConfirm = async (values,actions) => {

    setShowConfirmationModal(true);
    setActions(actions)

    // Verifica en React DevTools si el estado realmente cambió
  };
  
  // En tu componente principal
 
  
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
              setIsCreatingBill={setIsCreatingBill}
              isCreatingBill={isCreatingBill}
              setShowConfirmationModal={setShowConfirmationModal}
              actionsFormik={actions}
              operations={operations}
              isFinished={isFinished}
               />}

  </>
);

};
