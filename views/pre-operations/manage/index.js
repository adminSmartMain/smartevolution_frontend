// Hooks
import { useEffect, useState } from "react";
// Alerts
import * as Yup from 'yup';
import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import Axios from "axios";

// Components
import { ManageOperationC } from "./components";
// Queries
import { CreateOperation, TypeOperation, GetLastOperationId, Clients } from "./queries";
// Utils



export const ManageOperationV = () => {
  // States
  const [opId, setOpId] = useState(null);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isSubmittingOperation, setIsSubmittingOperation] = useState(false);
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
    fetch: getLastId,
    loading: loadingGetLastId,
    error: errorGetLastId,
    data: dataGetLastId,
  } = useFetch({ service: GetLastOperationId, init: true });

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
  emitter: Yup.object().nullable().required('Este campo es obligatorio'),
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
  ).test(
    'unique-investor-per-bill',
    'Una factura no puede asignarse dos veces al mismo inversionista',
    (facturas = []) => {
      const assignments = new Set();
      return facturas.every((factura) => {
        if (!factura?.billId || !factura?.nombreInversionista) return true;
        const assignment = `${String(factura.billId)}:${String(factura.nombreInversionista)}`;
        if (assignments.has(assignment)) return false;
        assignments.add(assignment);
        return true;
      });
    }
  ),
});


const toIsoDate = (value, fallback = new Date()) => {
  const date = value ? new Date(value) : fallback;
  if (Number.isNaN(date.getTime())) {
    return fallback.toISOString().substring(0, 10);
  }
  return date.toISOString().substring(0, 10);
};

const transformData = (data) => {
  const usedBillCodes = {};
  const processedBillIds = {}; // Para rastrear billIds ya procesados
   console.log(data)
  return data.facturas.map((factura) => {
  
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
        DateBill: toIsoDate(factura.fechaEmision),
        DateExpiration: toIsoDate(factura.expirationDate),
        discountTax: data.discountTax,
        emitter: data.emitter.value,
        emitterDocument: data.emitter.data.document_number,
        emitterBroker: data.emitterBroker,
        GM: factura.gastoMantenimiento || 0,
        billCode:"",
        investor: factura.nombreInversionista,
        investorBroker: factura.investorBroker,
        investorProfit: factura.investorProfit,
        investorTax: factura.investorTax,
        opDate: toIsoDate(data.opDate),
        operationDays: factura.operationDays,
        opExpiration: toIsoDate(factura.fechaFin),
        opId: data.opId,
        opType: data.opType,
        payedAmount: factura.payedAmount,
        payedPercent: factura.porcentajeDescuento,
        payer: data.nombrePagador,
        presentValueInvestor: factura.presentValueInvestor,
        presentValueSF: factura.presentValueSF,
        probableDate: toIsoDate(factura.probableDate),
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
const onSubmit = async (values, { setSubmitting }) => {
  setIsModalOpen(true);
  setSuccess(null);
  setIsSubmittingOperation(true);
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
      console.warn("⚠️ Advertencia: Algunas facturas creadas no tienen billCode o están duplicados");
    }

    // El servidor bloquea la factura, valida el saldo y persiste el lote en una
    // única transacción. Evitamos una ronda N+1 de consultas que no podía dar
    // garantías frente a operaciones concurrentes.

    const { success, successfulOperations, failedOperations } = await executeAtomicOperations(facturasTransformadas);
    
   
    
    if (failedOperations?.length > 0) {
      console.error('❌ Operaciones fallidas:', failedOperations);
      throw new Error(
        `${failedOperations.length} operaciones fallaron: ${
          failedOperations.map(op => op.error?.message || op.error).join('; ')
        }`
      );
    }

    setSuccess(true);

    
    Toast(
      <div>
        <strong>¡Operaciones procesadas!</strong>
        <p>Se procesaron {facturasTransformadas.length} facturas correctamente</p>
        {facturasCreadas.length > 0 && (
          <p>Incluyendo {facturasCreadas.length} facturas creadas</p>
        )}
      </div>,'success'
    );
 
    router.push('/pre-operations');
    
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
    setIsSubmittingOperation(false);
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
      emitterId: facturasTransformadas[index]?.dataSent?.emitter, // Obtener emitterId
      emitterDocument: facturasTransformadas[index]?.dataSent?.emitterDocument, // Obtener emitterDocument
      is_creada: facturasTransformadas[index]?.is_creada || false
    }));
    
   
    
    // Filtrar para obtener solo los únicos, manteniendo el estado is_creada
     const billIdsUnicos = Array.from(new Map(
      billIdsConEstado.map(item => [`${item.billId}_${item.emitterId}`, item])
    ).values());


    // 2. Obtenemos los datos de todas las facturas únicas
    const resultadosUnicos = await Promise.all(
      billIdsUnicos.map(async (billIdInfo) => {
         const billIdStr = String(billIdInfo.billId).trim();
        const emitterId = billIdInfo.emitterId;
        const is_creada = billIdInfo.is_creada;
        const emitterDocument = billIdInfo.emitterDocument;
        console.log(emitterDocument)
        
         
        try {

            let url = `${process.env.NEXT_PUBLIC_API_URL}/bill/?bill_operation=${billIdStr}`;
          if (emitterDocument) {
            url += `&emitter=${emitterDocument}`;
          }
          const response = await Axios.get(
            url,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
              //timeout: 10000,
            }
          );



          if (!response.data) {
            throw new Error("Respuesta vacía del servidor");
          }

          let factura;

          // CORRECCIÓN: La factura está en response.data.data
          if (response.data.data) {
            if (response.data.data.id || response.data.data.billId) {
              factura = response.data.data;
  
            } else {
              console.error('❌ Formato de data no reconocido:', response.data.data);
              throw new Error("Formato de data no reconocido");
            }
          } else if (response.data.id || response.data.billId) {
            // Backup por si alguna vez devuelve directamente
            factura = response.data;
    
          } else {
            console.error('❌ Formato de respuesta no reconocido:', response.data);
            throw new Error("Formato de respuesta no reconocido");
          }



          // Si la factura fue creada en el sistema (is_creada = true), no hacemos validaciones estrictas
           if (is_creada) {
 
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
  
              
              // Buscar el amount en las facturas transformadas
              const facturaCorrespondiente = facturasTransformadas.find(f => 
                String(f.billId).trim() === billIdStr
              );
              
              const amount = facturaCorrespondiente?.dataSent?.amount || 0;
              
              
              
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



    // 3. Mapeamos los resultados a todas las facturas (incluyendo duplicados)
    const resultados = billIds.map((billId, index) => {
      const billIdStr = String(billId).trim();
      const resultadoUnico = resultadosUnicos.find(r => r.billId === billIdStr);
      const is_creada = facturasTransformadas[index]?.is_creada || false;
      
   
      
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
        
        return errorResult;
      }

      const result = {
        ...resultadoUnico,
        valida: true, // Lo validaremos después
        is_creada: is_creada
      };
      

      return result;
    });



    // 4. Ahora validamos las reglas para cada factura
    const resultadosFinales = billIds.map((billId, index) => {
      const billIdStr = String(billId).trim();
      const resultado = resultados[index];
      const is_creada = resultado.is_creada;
      
  

      // Si ya hay un error y NO es una factura creada, lo mantenemos
      if (resultado.status !== "success" && !is_creada) {
  
        return resultado;
      }

      // Obtenemos todas las facturas con este billId
      const facturasConMismoId = facturasTransformadas.filter(f => String(f.billId).trim() === billIdStr);
      const facturaOperacion = facturasTransformadas[index];
      

      if (!facturaOperacion) {
        const errorResult = {
          ...resultado,
          valida: false,
          error: `No se encontró la factura en la operación`,
          status: "error",
          tipoError: "ERROR_OPERACION",
          is_creada: is_creada
        };

        return errorResult;
      }

      // Para facturas creadas en el sistema, validaciones relajadas
      if (is_creada) {
   
        
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
          
          return errorResult;
        }
        
        const successResult = {
          ...resultado,
          valida: true,
          status: "success",
          is_creada: true
        };

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

        return errorResult;
      }

      // REGLA 2: Para facturas duplicadas, suma de amounts vs currentBalance
      if (facturasConMismoId.length > 1) {
        const totalAmount = facturasConMismoId.reduce((sum, f) => sum + f.dataSent.amount, 0);
        
       
        
        if (totalAmount > resultado.currentBalance) {
          const errorResult = {
            ...resultado,
            valida: false,
            error: `La suma de montos (${totalAmount}) para factura ${billIdStr} excede el saldo (${resultado.currentBalance})`,
            status: "error",
            tipoError: "MONTO_EXCEDIDO",
            is_creada: false
          };
 
          return errorResult;
        }
      } 
      // REGLA 3: Para facturas únicas, amount vs currentBalance
      else if (facturaOperacion.dataSent.amount > resultado.currentBalance) {
        
        
        const errorResult = {
          ...resultado,
          valida: false,
          error: `El monto a pagar (${facturaOperacion.dataSent.amount}) excede el saldo (${resultado.currentBalance})`,
          status: "error",
          tipoError: "MONTO_EXCEDIDO",
          is_creada: false
        };
        
        return errorResult;
      }

      // Si pasa todas las validaciones
      const successResult = {
        ...resultado,
        valida: true,
        status: "success",
        is_creada: false
      };
  
      return successResult;
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

    return resultadoFinal;

  } catch (error) {
    console.error("❌ Error crítico en verificarSaldosFacturas:", error);
    throw new Error(`Error al verificar saldos: ${error.message}`);
  }
};



const executeAtomicOperations = async (operations) => {
  Toast(`Procesando ${operations.length} operaciones...`, "info");

  try {
    const payload = operations.map((op, index) => ({
      ...op.dataSent,
      _isFirstOccurrence:
        operations.findIndex(o => o.billId === op.billId) === index
    }));

    const response = await CreateOperation(payload, payload[0]?.opId);
    const failed = response?.failed || response?.details || [];
    const successful = response?.successful || (response?.data ? [response.data] : []);

    return {
      success: failed.length === 0,
      successfulOperations: successful,
      failedOperations: failed,
      totalOperations: operations.length
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error procesando operaciones',
      totalOperations: operations.length
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
              loading={isSubmittingOperation}
              success={success}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              validationSchema={validationSchema}
              showConfirmationModal={showConfirmationModal}
              handleConfirm={handleConfirm}
              setIsCreatingBill={setIsCreatingBill}
              isCreatingBill={isCreatingBill}
              setShowConfirmationModal={setShowConfirmationModal}
              actionsFormik={actions}
              isFinished={isSubmittingOperation}
               />}

  </>
);

};
