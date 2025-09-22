import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import { ReceiptC } from "./components";
import { RegisterReceipt, getOperationById,GetReceiptById } from "./queries";
import { FV } from "@formulajs/formulajs";
import { differenceInDays, set } from "date-fns";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { ToastContainer, toast } from "react-toastify";

export default function Receipt() {
  const router = useRouter();
  const [canceled, setCanceled] = useState(false);
  const [state, setState] = useState("");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [presentValueInvestor, setPresentValueInvestor] = useState(0);
  const [counter, setCounter] = useState(0);
   const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const {
    fetch: fetchGetReceiptById,
    loading: loadingGetReceiptById,
    error: errorGetReceiptById,
    data: dataGetReceiptById,
  } = useFetch({
    service: GetReceiptById, // Cambiado el nombre para claridad
    init: false, // No ejecutar inmediatamente
  });

  // Obtener el ID de la URL
  const receiptId = router.query.id;

  useEffect(() => {
    if (receiptId) {
      fetchGetReceiptById({ id: receiptId }); // Llamar con el parámetro correcto
    }
  }, [receiptId]);

  console.log(dataGetReceiptById)

   const getInitialValues = () => {
    if (!dataGetReceiptById?.results?.[0]) {
      // Valores por defecto mientras se cargan los datos
      return {
        date: "",
        typeReceipt: "",
        payedAmount: 0,
        opPendingAmount: 0,
        operation: "",
        additionalDays: 0,
        additionalInterests: 0,
        additionalInterestsSM: 0,
        investorInterests: 0,
        tableInterests: 0,
        futureValueRecalculation: 0,
        tableRemaining: 0,
        realDays: 0,
        client: "",
        account: "",
        remaining: 0,
        calculatedDays: 0,
        receiptStatus: "",
        opPendingAmount:0,
        lastDate: "",
        interest: 0,
        previousPayedAmount: 0,
        previousDiscountTax: 0,
        previousOpNumber: 0,
        previousOpDate: "",
        user_created_at: "",
      };
    }

    const receiptData = dataGetReceiptById.results[0];
    
    return {
      date: receiptData.operation?.opDate || "",
      typeReceipt: receiptData.typeReceipt?.id || "",
      payedAmount: receiptData.payedAmount || 0,
      opPendingAmount: 0,
      operation: receiptData.operation || "",
      additionalDays: receiptData.additionalDays || 0,
      additionalInterests: receiptData.additionalInterests || 0,
      additionalInterestsSM: receiptData.additionalInterestsSM || 0,
      investorInterests: receiptData.investorInterests || 0,
      tableInterests: receiptData.tableInterests || 0,
      futureValueRecalculation: 0,
      tableRemaining: receiptData.tableRemaining || 0,
      realDays: receiptData.realDays || 0,
      client: receiptData.account?.client || "",
      account: receiptData.account?.account_number || "", // Corregido: estaba como account_number directo
      remaining: receiptData.remaining || 0,
      calculatedDays: receiptData.calculatedDays || 0,
      receiptStatus: receiptData.receiptStatus?.id|| "",
      lastDate: "",
      interest: 0,
      opPendingAmount: receiptData.operation?.opPendingAmount || 0,
      previousPayedAmount: 0,
      previousDiscountTax: 0,
      previousOpNumber: 0,
      previousOpDate: "",
      created_at: receiptData.created_at || "",
      user_created_at: receiptData.user_created_at || "",
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true, // ¡CRUCIAL! Permite que el formulario se actualice
    // validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      setShowConfirmationModal(false);
      setLoading(true);
      setIsModalOpen(true);
      setSuccess(null);
      
      try {
        // Tu lógica de envío aquí
      } catch (error) {
        setSuccess(false);
        Toast("Hubo un error al registrar", "error");
      } finally {
        setLoading(false);
        actions.setSubmitting(false);
        setTimeout(() => setIsModalOpen(false), 4000);
      }
    }
  });



 return (
    <ReceiptC
      formik={formik}
      data={dataGetReceiptById?.results}
      pendingAmount={pendingAmount}
      presentValueInvestor={presentValueInvestor}
      loading={loading}
      success={success}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      showConfirmationModal={showConfirmationModal}
      setShowConfirmationModal={setShowConfirmationModal}
    />
  );
}