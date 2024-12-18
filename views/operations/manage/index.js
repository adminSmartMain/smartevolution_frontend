// Hooks
import { useEffect, useState } from "react";
// Alerts
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
// Components
import { ManageOperationC } from "./components";
// Queries
import { CreateOperation, DeleteOperation, GetBillFraction, GetLastOperationId, GetOperationById, GetRiskProfile, UpdateOperation } from "./queries";
// Utils
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, parseISO, set } from "date-fns";
import { useFormik } from "formik";


export const ManageOperationV = () => {
  // States
  const [created, setCreated] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [status, setStatus] = useState(0);
  const [opId, setOpId] = useState(null);
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [operations, setOperations] = useState([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [operationCreated, setOperationCreated] = useState(false);
  const [option, setOption] = useState("");
  const [emitter, setEmitter] = useState("");
  const [reset, setReset] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [previousDeleted, setPreviousDeleted] = useState('');

  const handleMultipleOperations = () => {
    formik.handleSubmit();
    setReset(true);

  };

// Maneja la lógica de guardar y redirigir
const handleSaveAndRedirect = () => {
  formik.handleSubmit();  // Ejecuta la lógica de guardar los datos
  setReset(true);  // Restablece el estado del formulario

  // Espera 3 segundos para mostrar los toast antes de redirigir
  setTimeout(() => {
    if (operationCreated) {
      router.push("/pre-operations");  // Redirige a la página de pre-operations
    }
  }, 5000);  // 3000 milisegundos = 3 segundos
};




  // Router
  const router = useRouter();

  // Queries
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
    fetch: investorRiskProfileFetch,
    loading: investorLoadingRiskProfile,
    error: investorErrorRiskProfile,
    data: investorDataRiskProfile,
  } = useFetch({ service: GetRiskProfile, init: false });

  const {
    fetch: updateOperationFetch,
    loading: loadingUpdateOperation,
    error: errorUpdateOperation,
    data: dataUpdateOperation,
  } = useFetch({ service: UpdateOperation, init: false });

  // Formik

  const initialValues = {
    amount: 0,
    applyGm: false,
    bill: "",
    billFraction: 0,
    client: "",
    clientAccount: "",
    commissionSF: 0,
    DateBill: `${new Date().toISOString().substring(0, 10)}`,
    DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
    discountTax: 0,
    emitter: "",
    emitterBroker: "",
    GM: 0,
    id: "",
    investor: "",
    investorBroker: "",
    investorProfit: 0,
    investorTax: 0,
    opDate: `${new Date().toISOString().substring(0, 10)}`,
    operationDays: 0,
    opExpiration: `${new Date().toISOString().substring(0, 10)}`,
    opId: null,
    opType: "",
    payedAmount: 0,
    payedPercent: 0,
    payer: "",
    presentValueInvestor: 0,
    presentValueSF: 0,
    probableDate: `${new Date().toISOString().substring(0, 10)}`,
    status: 0,
    billCode: "",
    isReBuy: false,
    massive: false,
    integrationCode:""
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (isEditing) {
        const data = [...operations, { ...formik.values }];
        updateOperationFetch(data, dataGetOperationById, previousDeleted);
        setUpdated(1);
        
      } else {
        const data = [...operations, { ...formik.values }];
        
        createOperationFetch(data, opId);
        
       
        
      }
    },
  });

  // Effects

  // Detect when the user selects an emitter
  useEffect(() => {
    if (formik.values.emitter) {
        riskProfileFetch(formik.values.emitter);
        setEmitter(formik.values.emitter);
    }
  }, [formik.values.emitter]);

  useEffect(() => {
    if (formik.values.investor) {
        formik.setFieldValue("client", formik.values.investor);
        investorRiskProfileFetch(formik.values.investor); 
    }
  }, [formik.values.investor]);

  useEffect(() => {
    if (investorDataRiskProfile) {
      formik.setFieldValue("applyGm", investorDataRiskProfile.data.gmf);
    }
  }, [investorDataRiskProfile]);

  // Detect when the user is editing an operation
  useEffect(() => {
    if (router && router.query) {
      setOption(Object.keys(router.query)[0]);
      if (router.query.id) {
        setId(router.query.id);
      }

      if (router.query.previousDeleted) {
        setPreviousDeleted('true');
      }
    }
  }, [router.query]);

  // detect when the user is editing an operation and get the operation data
  useEffect(() => {
    if (id) {
      getOperationByIdFetch(id);
      setIsEditing(true);
    }
  }, [id]);

  // Get the last operation id
  useEffect(() => {
    if (dataGetLastId) {
      setOpId(dataGetLastId.data);
      formik.setFieldValue("opId", dataGetLastId.data);
    }
  }, [loadingGetLastId, errorGetLastId, dataGetLastId]);

  // Get the operation data if the user is editing an operation else create a new operation
  useEffect(() => {
    if (
      formik.values.opId !== null &&
      created === 0 &&
      id === undefined &&
      isAddingBill === false
    ) {
      setCreated(1);
    }
  }, [formik.values.opId, id]);

  // detect when a bill is selected
  useEffect(() => {
    if (formik.values.bill !== "") {

      if (!id && formik.touched.billFraction === false) {
        // wait 5 seconds to get the bill fraction
        setTimeout(() => {
        getBillFractionFetch(formik.values.bill);
        }
        , 5000);
      } else if (dataGetOperationById?.data?.bill !== formik.values.bill && formik.touched.billFraction === false) {
                setTimeout(() => {
        getBillFractionFetch(formik.values.bill);
        }
        , 5000);
      } else {
        getBillFractionFetch(formik.values.bill);
      } 
    }
  }, [formik.values.bill, dataGetOperationById]);

  // Get the bill data
  useEffect(() => {
    if (dataGetOperationById) {
      formik.setValues(dataGetOperationById.data);
      formik.setFieldValue("opType", dataGetOperationById.data.opType.id);
      formik.setFieldValue("emitter", dataGetOperationById.data.emitter.id);
      formik.setFieldValue("investor", dataGetOperationById.data.investor.id);
      formik.setFieldValue("payer", dataGetOperationById.data.payer.id);
      formik.setFieldValue("billFraction",dataGetOperationById.data.billFraction);
      formik.setFieldValue("bill", dataGetOperationById.data.bill.id);
      formik.setFieldValue("DateExpiration",dataGetOperationById.data.DateExpiration);
      formik.setFieldValue("investorBroker",dataGetOperationById.data.investorBroker.id);
      formik.setFieldValue("emitterBroker",dataGetOperationById.data.emitterBroker.id);
      formik.setFieldValue("clientAccount",dataGetOperationById.data.clientAccount.id);
      formik.setFieldValue("investorTax",dataGetOperationById.data.investorTax);
      formik.setFieldValue("discountTax",dataGetOperationById.data.discountTax);
      formik.setFieldValue("applyGm", dataGetOperationById.data.applyGm);
      formik.setFieldValue("amount", dataGetOperationById.data.amount);
      formik.setFieldValue("payedAmount",dataGetOperationById.data.payedAmount);
      formik.setFieldValue("investorProfit",dataGetOperationById.data.investorProfit);
      if (dataGetOperationById.data.bill.isReBuy) {
        formik.setFieldValue("isReBuy", dataGetOperationById.data.bill.isReBuy);
      }
      setStatus(dataGetOperationById.data.status);
    }
  }, [dataGetOperationById, loadingGetOperationById, errorGetOperationById]);

  // Set the values of the bill
  useEffect(() => {
    if (dataGetBillFraction && !isEditing) {
      formik.setFieldValue("billFraction", dataGetBillFraction.data.fraction);
      const substractDays = differenceInDays(
        parseISO(formik.values.opExpiration),
        parseISO(formik.values.opDate)
      );
      formik.setFieldValue("operationDays", substractDays);
    } else {
      const substractDays = differenceInDays(
        parseISO(formik.values.opExpiration),
        parseISO(formik.values.opDate)
      );
      formik.setFieldValue("operationDays", substractDays);
    }
  }, [
    dataGetBillFraction,
    formik.values.opDate,
    formik.values.opExpiration,
    formik.values.DateExpiration,
  ]);

  // update the operation values when the user is editing the values
  useEffect(() => {
    if (dataRiskProfile) {
      if (!isEditing) {
        formik.setFieldValue("discountTax", dataRiskProfile.data.discount_rate);
      }
    }
  }, [dataRiskProfile]);

  useEffect(() => {
    // 58% of the discount rate
    if (formik.values.isReBuy === false && option != 'preview') {
      formik.setFieldValue("investorTax",(formik.values.discountTax * 0.58).toFixed(2));
    } else {
      formik.setFieldValue(formik.values.discountTax);
    }
  }, [formik.values.discountTax, formik.values.isReBuy]);

  useEffect(() => {
    if (dataGetBillFraction?.data?.billValue && option != 'preview') {
      if (
        formik.values.amount > dataGetBillFraction?.data?.billValue &&
        isCreatingBill === false && !isEditing
      ) {
        formik.setFieldValue("amount", dataGetBillFraction?.data?.billValue);
      }
    }

    if (formik.values.payedAmount !== 0 && option != 'preview') {
      if (!isEditing) {
        formik.setFieldValue(
          "payedPercent",
          ((formik.values.payedAmount / formik.values.amount) * 100).toFixed(2)
        );
      } else if (isEditing && dataLoaded && option != 'preview') {
        formik.setFieldValue(
          "payedPercent",
          ((formik.values.payedAmount / formik.values.amount) * 100).toFixed(2)
        );
      }
    }
  }, [formik.values.payedAmount, formik.values.amount]);

  // calc the amounts of the operation

  useEffect(() => {
    if (formik.values.operationDays > 0 && formik.values.payedAmount > 0 && option != 'preview') {
      formik.setFieldValue(
        "presentValueInvestor",
        Math.round(
          PV(
            formik.values.investorTax / 100,
            formik.values.operationDays / 365,
            0,
            formik.values.payedAmount,
            0
          ) * -1
        )
      );

      formik.setFieldValue(
        "presentValueSF",
        Math.round(
          PV(
            formik.values.discountTax / 100,
            formik.values.operationDays / 365,
            0,
            formik.values.payedAmount,
            0
          ) * -1
        )
      );
    } else if (formik.values.operationDays == 0 && formik.values.payedAmount > 0 && option != 'preview'){
            formik.setFieldValue("presentValueInvestor",formik.values.amount );
            formik.setFieldValue("presentValueSF",formik.values.amount);
    }
  }, [
    formik.values.operationDays,
    formik.values.amount,
    formik.values.payedAmount,
    formik.values.discountTax,
    formik.values.investorTax,
  ]);

  useEffect(() => {
    if (option != 'preview') {
          formik.setFieldValue(
      "investorProfit",
      (formik.values.presentValueInvestor * -1) + formik.values.payedAmount
    );

      formik.setFieldValue(
        "commissionSF",
        formik.values.presentValueInvestor - formik.values.presentValueSF
      );
    /*Cambio en el factor de GM
Por solicitud cambia el factor de GM de 0,004 a 0,002 a partir del 26 de octubre de 2024.
*/
    if (formik.values.applyGm) {
      formik.setFieldValue("GM", formik.values.presentValueInvestor * 0.002);
    } else {
      formik.setFieldValue("GM", 0);
    }
    }

  }, [
    formik.values.presentValueInvestor,
    formik.values.isReBuy,
    formik.values.investorTax,
    formik.values.payedAmount,
    formik.values.applyGm
  ]);

  // detect when a new bill is added
  useEffect(() => {
    if (operations.length) {
      formik.setFieldValue("opId", operations[0].opId);
      setIsCreatingBill(false);
    }
  }, [operations]);


  //aqui es el primer caso, con multiples operaciones. La solución al problema es comentar los campos que quieren que se mantengan

  useEffect(() => {
    if (dataCreateOperation) {
      if (operations.length > 1) {
        Toast("operaciones creadas", "success");
        setUpdated(1);
        setOperationCreated(true);
       
        formik.setValues({
          ...formik.values,
          payer: "",
          //investor: "",
          bill: "",
          //client: "",
          //clientAccount: "",
          billFraction: 0,
          DateBill: `${new Date().toISOString().substring(0, 10)}`,
          //DateOperation: `${new Date().toISOString().substring(0, 10)}`,
          probableDate: `${new Date().toISOString().substring(0, 10)}`,
          DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
          opExpiration: `${new Date().toISOString().substring(0, 10)}`,
          amount: 0,
          payedAmount: 0,
          payedPercent: 0,
          //investorBroker: "",
          operationDays: 0,
          investorProfit: 0,
          presentValueInvestor: 0,
          presentValueSF: 0,
          GM: 0,
          //applyGm: false,
          opPendingAmount: 0,
          commissionSF: 0,
          billCode: "",
          emitter: emitter,
          massive:false
        });
        //for (const field in formik.values) {
        //  if ((formik.values[field] === "" || formik.values[field] === 0) && field !== 'id' && field !== 'operationDays' && field !== 'status'  &&  field !== "billCode" && field !== "isReBuy" && field !== "GM" && field !== "billFraction" && field !== "commissionSF" && field !== "investorProfit" && field !== "presentValueInvestor" && field !== "presentValueSF") {
        //    Toast(`El campo ${field} no puede estar vacío`, "error");
        //    return;
        //  }
        //}
        setReset(false);
        if (dataCreateOperation?.data?.insufficientAccountBalance) {
          toast(
            "El monto de la operación es mayor al saldo disponible en la cuenta del cliente",
            "warning"
          );
        }
      } else {
        //aqui es el caso para una unica operacion
        Toast("operación creada", "success");
        setUpdated(1);
        setOperationCreated(true);
       

        formik.setValues({
          ...formik.values,
           payer: "",
          //investor: "",
          bill: "",
          //client: "",
          //clientAccount: "",
          billFraction: 0,
          DateBill: `${new Date().toISOString().substring(0, 10)}`,
          //DateOperation: `${new Date().toISOString().substring(0, 10)}`,
          probableDate: `${new Date().toISOString().substring(0, 10)}`,
          DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
          opExpiration: `${new Date().toISOString().substring(0, 10)}`,
          amount: 0,
          payedAmount: 0,
          payedPercent: 0,
          //investorBroker: "",
          operationDays: 0,
          investorProfit: 0,
          presentValueInvestor: 0,
          presentValueSF: 0,
          GM: 0,
          //applyGm: false,
          opPendingAmount: 0,
          commissionSF: 0,
          billCode: "",
          emitter: emitter,
          massive:false
        });
        setReset(false);
        if (dataCreateOperation?.data?.insufficientAccountBalance) {
          Toast(
            "El monto de la operación es mayor al saldo disponible en la cuenta del cliente",
            "warning"
          );
        }
      }
    }
    if (loadingCreateOperation) {
      Toast("creando operaciones", "info");
    }

    if (errorCreateOperation) {
      typeof errorCreateOperation.message === "object"
        ? Toast(`Faltan campos por diligenciar`, "error")
        : Toast(`${errorCreateOperation.message}`, "error");
    }
  }, [
    operationCreated,
    loadingCreateOperation,
    errorCreateOperation,
    dataCreateOperation,
  ]);

  // detect when a operation is updated
  useEffect(() => {
    if (dataUpdateOperation) {
      Toast("Operación Actualizada", "success");
      router.push("/pre-operations");
    }

    if (loadingUpdateOperation) {
      Toast("Actualizando Operación", "info");
    }

    if (errorUpdateOperation) {
            typeof errorCreateOperation.message === "object"
              ? Toast(`Faltan campos por diligenciar`, "error")
              : Toast(`${errorCreateOperation.message}`, "error");
    }

  },[dataUpdateOperation, errorUpdateOperation, loadingUpdateOperation])

  useEffect(() => {
    if (isCreatingBill ) {
      const substractDate = differenceInDays(
        new Date(formik.values.DateExpiration),
        new Date()
      );
      formik.setFieldValue(
        "operationDays",
        substractDate > 0 ? substractDate + 1 : substractDate * -1 + 1
      );
    }
  }, [formik.values.DateExpiration]);

  // update payedAmount only when  payedPercent changes
  useEffect(() => {
    if (!isEditing) {
      formik.setFieldValue(
        "payedAmount",
        (formik.values.amount * formik.values.payedPercent) / 100
      );
    } else if (isEditing && dataLoaded) {
      formik.setFieldValue(
        "payedAmount",
        (formik.values.amount * formik.values.payedPercent) / 100
      );
    }
  }, [formik.values.payedPercent, dataLoaded]);

  // update the payedPercent only when payedAmount changes
  useEffect(() => {
    if (!isEditing && option != 'preview') {
      formik.setFieldValue(
        "payedPercent",
        Math.round((formik.values.payedAmount * 100) / formik.values.amount,2)
      );
    } else if (isEditing && dataLoaded) {
      formik.setFieldValue(
        "payedPercent",
        Math.round((formik.values.payedAmount * 100) / formik.values.amount,2)
      );
    }

  }, [formik.values.payedAmount, dataLoaded]);

  useEffect(() => {
    if (formik.values.isReBuy === false || formik.values.isReBuy == undefined) {
    } else {
      formik.setFieldValue("commissionSF", 0);
      formik.setFieldValue("discountTax", formik.values.investorTax);
    }
  }, [
    formik.values.commissionSF,
    formik.values.isReBuy,
    formik.values.investorTax,
  ]);

// Check type of investor profit
  useEffect(() => {
    if (isNaN(formik.values.investorProfit) && option != 'preview') {
     formik.setFieldValue("investorProfit", dataGetOperationById?.data?.investorProfit);
    }
  }, [formik.values.investorProfit])

// check if amount is undefined
useEffect(() => {
  if (formik.values.amount === undefined && isEditing && option != 'preview') {
    formik.setFieldValue("amount", dataGetOperationById?.data?.amount);
    // set the payed percent corresponding to the amount
  }
}, [formik.values.amount, dataLoaded])


// check if payedPercent is NaN
useEffect(() => {
  if (isNaN(formik.values.payedPercent) && isEditing && option != 'preview') {
    formik.setFieldValue("payedPercent", Math.round((dataGetOperationById?.data?.payedAmount * 100) / dataGetOperationById?.data?.amount),2);
  }
}, [formik.values.amount,formik.values.payedPercent, dataLoaded]);

  useEffect(() => {
    // if all of these values is not 0, then set dataLoaded to true only if is editing 
    if (formik.values.operationDays > 0 && formik.values.investorProfit > 0 && formik.values.presentValueInvestor > 0 && formik.values.presentValueSF > 0 && formik.values.commissionSF > 0 && option != 'preview') {
      if (isEditing) {
        setDataLoaded(true);
      }
    }
  }, [formik.values.operationDays, formik.values.investorProfit,
      formik.values.presentValueInvestor, formik.values.presentValueSF,
      formik.values.commissionSF, formik.values.GM])


  return (
    <>
      <ManageOperationC
        formik={formik}
        updated={updated}
        ToastContainer={ToastContainer}
        isEditing={isEditing}
        option={option}
        isCreatingBill={isCreatingBill}
        setIsCreatingBill={setIsCreatingBill}
        handleMultipleOperations={handleMultipleOperations}
        handleSaveAndRedirect={handleSaveAndRedirect}
        status={status}
        reset={reset}
      />
    </>
  );
};