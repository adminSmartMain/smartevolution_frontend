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
    
    // Validación adicional para facturas creadas
    const facturasCreadas = facturasTransformadas.filter(f => f.is_creada);
    const billCodesUnicos = [...new Set(
      facturasCreadas
        .map(f => f.dataSent.billCode)
        .filter(code => code) // Filtramos códigos nulos/undefined
    )];
    
    if (facturasCreadas.length > billCodesUnicos.length) {
      console.warn("Advertencia: Algunas facturas creadas no tienen billCode o están duplicados");
    }
    // Resto de tu lógica de validación...
    const billIds = [...new Set(facturasTransformadas.map(op => op.billId))];
    const saldoValido = await verificarSaldosFacturas(billIds, facturasTransformadas);
    
    if (!saldoValido.todasValidas) {
      throw new Error(saldoValido.mensajeError || "Una o más facturas no cumplen con las reglas de saldo");
    }
    
    // Ejecución de operaciones
    const { success, successfulOperations, failedOperations } = await executeAtomicOperations(facturasTransformadas);
    
    
    if (failedOperations?.length > 0) {
      throw new Error(
        `${failedOperations.length} operaciones fallaron: ${
          failedOperations.map(op => op.error?.message || op.error).join('; ')
        }`
      );
    }

    setSuccess(true);
    toast.info(
      <div>
        <strong>¡Operacioes procesadas!</strong>
        <p>Se procesaron {facturasTransformadas.length} facturas correctamente</p>
        {facturasCreadas.length > 0 && (
          <p>Incluyendo {facturasCreadas.length} facturas creadas</p>
        )}
      </div>,
      { autoClose: 2000 }
    );
 
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsModalOpen(false);


 
    
  } catch (error) {
    // Manejo de errores permanece igual
    setSuccess(false);
    console.error("Error detallado:", error);
    
    const errorMessage = error.name === 'ValidationError' 
      ? `Errores de validación: ${error.errors.join(', ')}`
      : error.message;
    
    toast.error(
      <div>
        <strong>¡Operación cancelada!</strong>
        <p>{errorMessage}</p>
      </div>,
      { autoClose: 10000 }
    );
    
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 100, 200]);
    }
  } finally {
    setLoading(false);
    setSubmitting(false);
   
  }
};

const verificarSaldosFacturas = async (billIds, facturasTransformadas) => {
  try {
    if (!Array.isArray(billIds) || billIds.length === 0) {
      throw new Error("No se proporcionaron IDs de facturas válidos");
    }

    
    // 1. Primero verificamos si hay billIds duplicados
    const billIdsConEstado = billIds.map((billId, index) => ({
      billId,
      is_creada: facturasTransformadas[index]?.is_creada| false
    }));
    
    // Filtrar para obtener solo los únicos, manteniendo el estado is_creada
    const billIdsUnicos = Array.from(new Map(
      billIdsConEstado.map(item => [item.billId, item])
    ).values());
 

    // 2. Obtenemos los datos de todas las facturas únicas
    const resultadosUnicos = await Promise.all(
      billIdsUnicos.map(async (billId) => {
        const billIdStr = String(billId.billId).trim();
        const is_creada_billId= facturasTransformadas.filter(f => f.billId==billIdStr)
     
        try {
          const response = await Axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/bill/${billIdStr}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
              timeout: 10000,
            }
          );

          if (!response.data) {
            throw new Error("Respuesta vacía del servidor");
          }

          let factura;
        
          if (response.data.results && Array.isArray(response.data.results)) {
            if (response.data.results.length === 0 && billIdStr.is_creada==0 ) {
              throw new Error("Factura no encontrada");
            }
            factura = response.data.results[0] || is_creada_billId[0];
          } else if (response.data.id || response.data.uuid && billIdStr.is_creada==0 ) {
            factura = response.data;
          } else {
            throw new Error("Formato de respuesta no reconocido");
          }

          // Validaciones básicas
          if ( factura.is_creada==0 && factura.state !== true ) {
            throw new Error("Factura no está activa");
          }

          if (typeof factura.currentBalance !== 'number' && billIdStr.is_creada==0) {
            throw new Error("Valor de saldo inválido");
          }

          return {
            billId: billIdStr,
            currentBalance: factura.currentBalance,
            billData: factura,
            status: "success"
          };

        } catch (error) {
          let errorMessage = `Error en factura ${billIdStr}: `;
          
          if (error.response) {
            errorMessage += error.response.data?.message || error.response.statusText;
          } else {
            errorMessage += error.message;
          }

          return {
            billId: billIdStr,
            currentBalance: 0,
            status: "error",
            error: errorMessage,
            tipoError: "ERROR_VERIFICACION"
          };
        }
      })
    );

    // 3. Mapeamos los resultados a todas las facturas (incluyendo duplicados)
    const resultados = billIds.map(billId => {
      const billIdStr = String(billId).trim();
      const resultadoUnico = resultadosUnicos.find(r => r.billId === billIdStr);
      
      if (!resultadoUnico || resultadoUnico.status !== "success") {
        return {
          billId: billIdStr,
          currentBalance: 0,
          valida: false,
          error: resultadoUnico?.error || "Factura no verificada",
          status: "error",
          tipoError: resultadoUnico?.tipoError || "ERROR_VERIFICACION"
        };
      }

      return {
        ...resultadoUnico,
        valida: true // Lo validaremos después
      };
    });

    // 4. Ahora validamos las reglas para cada factura
    const resultadosFinales = billIds.map((billId, index) => {
      const billIdStr = String(billId).trim();
      const resultado = resultados[index];
      
      // Si ya hay un error, lo mantenemos
      if (resultado.status !== "success") {
        return resultado;
      }

      // Obtenemos todas las facturas con este billId
      const facturasConMismoId = facturasTransformadas.filter(f => String(f.billId).trim() === billIdStr);
      const facturaOperacion = facturasTransformadas[index];
      
      if (!facturaOperacion) {
        return {
          ...resultado,
          valida: false,
          error: `No se encontró la factura en la operación`,
          status: "error",
          tipoError: "ERROR_OPERACION"
        };
      }

      // REGLA 1: Si currentBalance es 0
      if (resultado.currentBalance === 0) {
        return {
          ...resultado,
          valida: false,
          error: `Factura ${billIdStr} tiene saldo 0`,
          status: "error",
          tipoError: "SALDO_CERO"
        };
      }

      // REGLA 2: Para facturas duplicadas, suma de amounts vs currentBalance
      if (facturasConMismoId.length > 1) {
        const totalAmount = facturasConMismoId.reduce((sum, f) => sum + f.dataSent.amount, 0);
        
        if (totalAmount > resultado.currentBalance) {
          return {
            ...resultado,
            valida: false,
            error: `La suma de montos (${totalAmount}) para factura ${billIdStr} excede el saldo (${resultado.currentBalance})`,
            status: "error",
            tipoError: "MONTO_EXCEDIDO"
          };
        }
      } 
      // REGLA 3: Para facturas únicas, amount vs currentBalance
      else if (facturaOperacion.dataSent.amount > resultado.currentBalance) {
        return {
          ...resultado,
          valida: false,
          error: `El monto a pagar (${facturaOperacion.dataSent.amount}) excede el saldo (${resultado.currentBalance})`,
          status: "error",
          tipoError: "MONTO_EXCEDIDO"
        };
      }

      // Si pasa todas las validaciones
      return {
        ...resultado,
        valida: true,
        status: "success"
      };
    });

    // 5. Clasificación de resultados finales
    const facturasValidas = resultadosFinales.filter(r => r.valida);
    const facturasConSaldoCero = resultadosFinales.filter(r => r.tipoError === "SALDO_CERO");
    const facturasConMontoExcedido = resultadosFinales.filter(r => r.tipoError === "MONTO_EXCEDIDO");
    const otrosErrores = resultadosFinales.filter(r => !r.valida && r.tipoError !== "SALDO_CERO" && r.tipoError !== "MONTO_EXCEDIDO");

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

    return {
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

  } catch (error) {
    console.error("Error crítico en verificarSaldosFacturas:", error);
    throw new Error(`Error al verificar saldos: ${error.message}`);
  }
};





const executeAtomicOperations = async (operations) => {
  const progressToast = toast.info(`Procesando ${operations.length} operaciones...`, { autoClose: false });

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

    toast.dismiss(progressToast);
    
 
    return {
      success: failed.length === 0, // true solo si no hay fallos
      successfulOperations: successful,
      failedOperations: failed,
      totalOperations: operations.length
    };

  } catch (error) {
    toast.dismiss(progressToast);
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
