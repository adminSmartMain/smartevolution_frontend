// Hooks
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
// Alerts
import { ToastContainer } from "react-toastify";

import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

// Components
import { ManageOperationC } from "./components";
// Queries
import {
  CreateOperation,
  DeleteOperation,
  GetBillFraction,
  GetLastOperationId,
  GetOperationById,
  GetRiskProfile,
  UpdateOperation,
} from "./queries";

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

  const handleMultipleOperations = () => {
    setOperations([...operations, { ...formik.values }]);
    formik.setValues({
      ...formik.values,
      opId: opId,
      payer: "",
      investor: "",
      bill: "",
      client: "",
      clientAccount: "",
      billFraction: 0,
      DateBill: `${new Date().toISOString().substring(0, 10)}`,
      DateOperation: `${new Date().toISOString().substring(0, 10)}`,
      probableDate: `${new Date().toISOString().substring(0, 10)}`,
      DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
      opExpiration: `${new Date().toISOString().substring(0, 10)}`,
      amount: 0,
      discountTax: 0,
      investorTax: 0,
      payedAmount: 0,
      payedPercent: 0,
      emitterBroker: "",
      investorBroker: "",
      operationDays: 0,
      investorProfit: 0,
      presentValueInvestor: 0,
      presentValueSF: 0,
      GM: 0,
      applyGm: false,
      opPendingAmount: 0,
      commissionSF: 0,
      billCode: "",
      massive:false
    });
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
  };

  const formik = useFormik({
    initialValues: initialValues,

    onSubmit: (values) => {
      const data = [...operations, { ...formik.values }];
      updateOperationFetch(data);
      setUpdated(1);
      router.push("/operations");
    },
  });

  // Detect when the user refresh the page
  useBeforeunload((event) => {
    if (updated === 0 && isEditing === false) {
      deleteOperationFetch(formik.values.opId);
    }
  });

  // Effects

  // Detect when the user selects an investor
  useEffect(() => {
    formik.setFieldValue("client", formik.values.investor);
    riskProfileFetch(formik.values.investor);
  }, [formik.values.investor]);

  // Detect when the user is editing an operation
  useEffect(() => {
    if (router && router.query) {
      setId(Object.values(router.query)[0]);
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
      createOperationFetch(formik.values, opId);
      setCreated(1);
    } else if (id !== undefined && id !== null) {
    }
  }, [formik.values.opId, id]);

  // Detect when the user change the page
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isEditing === false && updated === 0) {
        if (dataCreateOperation)
          deleteOperationFetch(dataCreateOperation.data.opId);
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [updated, router.events, dataCreateOperation]);

  // detect when a bill is selected
  useEffect(() => {
    if (formik.values.bill !== "") {
      if (!id) {
        getBillFractionFetch(formik.values.bill);
      } else if (dataGetOperationById?.data?.bill !== formik.values.bill) {
        getBillFractionFetch(formik.values.bill);
      }
    }
  }, [formik.values.bill, dataGetOperationById]);

  // Get the id of the new operation
  useEffect(() => {
    if (dataCreateOperation) {
      formik.setFieldValue("id", dataCreateOperation.data.id);
      formik.setFieldValue("DateBill", "");
      formik.setFieldValue("probableDate", "");
    }
  }, [dataCreateOperation]);

  // Get the bill data
  useEffect(() => {
    if (dataGetOperationById) {
      formik.setValues(dataGetOperationById.data);
      formik.setFieldValue(
        "billFraction",
        dataGetOperationById.data.billFraction
      );
      formik.setFieldValue("bill", dataGetOperationById.data.bill.id);
      formik.setFieldValue(
        "DateExpiration",
        dataGetOperationById.data.DateExpiration
      );
      formik.setFieldValue(
        "investorBroker",
        dataGetOperationById.data.investorBroker.id
      );
    }
  }, [dataGetOperationById, loadingGetOperationById, errorGetOperationById]);

  // Set the values of the bill
  useEffect(() => {
    if (dataGetBillFraction) {
      const date = new Date(`${dataGetBillFraction.data.expirationDate}`);
      const addDay = addDays(date, 1);
      const substractDay = differenceInDays(addDay, new Date());
      formik.setFieldValue("billFraction", dataGetBillFraction.data.fraction);
      formik.setFieldValue("amount", dataGetBillFraction.data.billValue);
      formik.setFieldValue("DateBill", dataGetBillFraction.data.dateBill);
      formik.setFieldValue("opDate", dataGetBillFraction.data.opDate);
      formik.setFieldValue(
        "DateExpiration",
        dataGetBillFraction.data.expirationDate
      );
      formik.setFieldValue(
        "operationDays",
        substractDay > 0 ? substractDay + 1 : substractDay * -1 + 1
      );
    }
  }, [dataGetBillFraction]);

  // update the operation values when the user is editing the values
  useEffect(() => {
    if (dataRiskProfile) {
      formik.setFieldValue("discountTax", dataRiskProfile.data.discount_rate);
      formik.setFieldValue("applyGm", dataRiskProfile.data.gmf);
    }
  }, [dataRiskProfile]);

  useEffect(() => {
    // 58% of the discount rate
    formik.setFieldValue(
      "investorTax",
      (formik.values.discountTax * 0.58).toFixed(2)
    );
  }, [formik.values.discountTax]);

  useEffect(() => {
    if (formik.values.payedAmount > formik.values.amount) {
      alert("El monto pagado no puede ser mayor al monto de la operación");
      formik.setFieldValue("payedAmount", 0);
      formik.setFieldValue("payedPercent", 0);
    }

    if (dataGetBillFraction?.data?.billValue) {
      if (formik.values.amount > dataGetBillFraction?.data?.billValue) {
        alert(
          "El valor futuro no puede ser mayor al valor disponible de la factura"
        );
        formik.setFieldValue("amount", dataGetBillFraction?.data?.billValue);
      }
    }

    if (formik.values.payedAmount !== 0) {
      formik.setFieldValue(
        "payedPercent",
        ((formik.values.payedAmount / formik.values.amount) * 100).toFixed(2)
      );
    }
  }, [formik.values.payedAmount, formik.values.amount]);

  // calc the amounts of the operation
  useEffect(() => {
    if (formik.values.operationDays > 0 && formik.values.payedAmount > 0) {
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
    }
  }, [
    formik.values.operationDays,
    formik.values.amount,
    formik.values.payedAmount,
    formik.values.discountTax,
    formik.values.investorTax,
  ]);

  useEffect(() => {
    formik.setFieldValue(
      "investorProfit",
      formik.values.presentValueInvestor * -1 + formik.values.payedAmount
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
    }
  }, [formik.values.presentValueInvestor]);

  // detect when a new bill is added
  useEffect(() => {
    if (operations.length) {
      createOperationFetch(formik.values, opId);
      formik.setFieldValue("opId", opId);
      setIsCreatingBill(false);
    }
  }, [operations]);

  useEffect(() => {
    if (dataCreateOperation) {
      if (operations.length > 1) {
        Toast("operaciones creadas", "success");
      } else {
        Toast("operación creada", "success");
      }
    }
    if (loadingCreateOperation) {
      Toast("creando operaciones", "info");
    }

    if (errorCreateOperation) {
      Toast(errorCreateOperation.message, "error");
    }
  }, [dataUpdateOperation, dataUpdateOperation, loadingUpdateOperation]);

  useEffect(() => {
    if (isCreatingBill) {
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

  return (
    <>
      <ManageOperationC
        formik={formik}
        updated={updated}
        ToastContainer={ToastContainer}
        isEditing={isEditing}
        isCreatingBill={isCreatingBill}
        setIsCreatingBill={setIsCreatingBill}
        handleMultipleOperations={handleMultipleOperations}
      />
    </>
  );
};
