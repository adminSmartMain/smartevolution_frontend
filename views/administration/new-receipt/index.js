import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import { ReceiptC } from "./components";
import { RegisterReceipt, getOperationById } from "./queries";
import { FV } from "@formulajs/formulajs";
import { differenceInDays, set } from "date-fns";
import { useFormik } from "formik";


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

  const initialValues = {
    date: `${new Date().toISOString().substring(0, 10)}`,
    typeReceipt: "",
    payedAmount: 0,
    pendingAmount: 0,
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
    lastDate: "",
    interest: 0,
    previousPayedAmount: 0,
    previousDiscountTax: 0,
    previousOpNumber: 0,
    previousOpDate: "",
  };

  const {
    fetch: fetchRegisterReceipt,
    loading: loadingRegisterReceipt,
    error: errorRegisterReceipt,
    data: dataRegisterReceipt,
  } = useFetch({ service: RegisterReceipt, init: false });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setSubmitting(true); // 🔥 Deshabilita el botón antes de cualquier validación
      setSuccess(null); 
      setIsModalOpen(true); // Abrir el modal
      if (values.payedAmount <= 0) {
        Toast("Debe ingresar un valor a pagar", "error");
        setLoading(false);
        setSubmitting(false); // 🔥 Rehabilita el botón si hay error
        return;
      }
  
      if (values.receiptStatus === "") {
        Toast("Debe seleccionar un tipo de recaudo", "error");
        setLoading(false);
        setSubmitting(false); // 🔥 Rehabilita el botón si hay error
        return;
      }
  
      setSuccess(null); // Asegura que el modal de carga se muestre
      try {
        console.log("Enviando datos...");
        await fetchRegisterReceipt({ ...values, presentValueInvestor });
        setSuccess(true);
        
        Toast("Registro exitoso", "success");
  
      
      } catch (error) {
        setSuccess(false);
        setLoading(false);
        setTimeout(() => {
          setIsModalOpen(false)
        }, 4000);
        
        Toast("Hubo un error al registrar", "error");
      }
    },
  });

  useEffect(() => {
    if (errorRegisterReceipt) Toast("Error al registrar recaudo", "error");
  
    if (loadingRegisterReceipt) Toast("Registrando recaudo", "info");
  
    if (dataRegisterReceipt) {
      setSuccess(true);
      Toast("Recaudo registrado", "success");
  
        // Espera 2.5s antes de redirigir
        setTimeout(() => {
          router.push("/operations");
          setLoading(false);
        },6000);
    }
  }, [dataRegisterReceipt, errorRegisterReceipt, loadingRegisterReceipt]);
  

  useEffect(() => {
    if (router.query.id) {
      fetch(router.query.id);
    }
  }, [router.query]);

  const {
    fetch: fetch,
    loading: loadingOpById,
    error: error,
    data: data,
  } = useFetch({ service: getOperationById, init: false });

  useEffect(() => {
    if (data) {
      formik.setFieldValue("client", data?.data?.investor.id);
      formik.setFieldValue("account", data?.data?.clientAccount.id);
      formik.setFieldValue("payedAmount", 0);
      formik.setFieldValue("pendingAmount", 0);
      formik.setFieldValue("interest", data?.receipts?.interest);
      formik.setFieldValue("lastDate", data?.receipts?.lastDate);
      formik.setFieldValue("previousPayedAmount", data?.receipts?.payedAmount);
      formik.setFieldValue("operation", data?.data?.id);

      if (data?.data?.isRebuy) {
        formik.setFieldValue("receiptStatus","ea8518e8-168a-46d7-b56a-1286bf0037cd");
      }

      if (data?.receipts.lastDate) {
        formik.setFieldValue("lastDate", data?.receipts.lastDate);
        formik.setFieldValue("previousPayedAmount", data?.receipts.payedAmount);
        formik.setFieldValue("interest", data?.receipts.interest);
      }

      if (data?.data?.previousOperationData != null) {
        formik.setFieldValue(
          "previousDiscountTax",
          data?.data?.previousOperationData?.discountTax
        );
        formik.setFieldValue(
          "previousOpNumber",
          data?.data?.previousOperationData?.opId
        );
        formik.setFieldValue(
          "previousOpDate",
          data?.data?.previousOperationData?.date
        );
      }
    }
  }, [data, loadingOpById, error]);

  useEffect(() => {
    formik.setFieldValue(
      "realDays",
      differenceInDays(
        new Date(formik.values.date),
        new Date(data?.data?.opDate)
      )
    );
    formik.setFieldValue(
      "calculatedDays",
      differenceInDays(
        new Date(formik.values.date),
        new Date(data?.data?.opDate)
      )
    );
  }, [formik.values.date, data]);

  useEffect(() => {
    if (
      Date.parse(formik.values.date) <
      Date.parse(new Date(data?.data?.opExpiration))
    ) {
      setState("anticipada");
    } else if (
      Date.parse(formik.values.date) >
      Date.parse(new Date(data?.data?.opExpiration))
    ) {
      setState("vencida");
    } else {
      setState("vigente");
    }
  }, [data, formik.values.date]);

  useEffect(() => {
    

    let pendingAmount = data?.data?.amount -(formik.values.payedAmount - formik.values.additionalInterests);
    if (data?.receipts.lastDate) {
      pendingAmount = pendingAmount - (data?.receipts.payedAmount - data?.receipts.interest);
    }
    setPendingAmount(Math.round(pendingAmount));
    

    //if (
    //  formik.values.receiptStatus === "ea8518e8-168a-46d7-b56a-1286bf0037cd" &&
    //  data?.data?.bill.reBuyAvailable == false && state !== "vencida"
    //) {
    //  formik.setFieldValue("additionalInterests", 0);
    //  formik.setFieldValue("investorInterests", 0);
    //  formik.setFieldValue("payedAmount", data?.data?.amount);
    //  setPendingAmount(data?.data?.amount - formik.values.payedAmount);
    //}
  }, [
    formik.values.payedAmount,
    formik.values.additionalInterests,
    data,
    canceled,
  ]);

  useEffect(() => {
    if (canceled) {
      switch (state) {
        case "anticipada":
          formik.setFieldValue(
            "typeReceipt",
            "3d461dea-0545-4a92-a847-31b8327bf033"
          );
          formik.setFieldValue(
            "futureValueRecalculation",
            Math.round(
              FV(
                data?.data?.investorTax / 100,
                formik.values.calculatedDays / 365,
                0,
                data?.data?.presentValueInvestor,
                0
              ) * -1
            )
          );


          if (
            formik.values.receiptStatus !==
            "ea8518e8-168a-46d7-b56a-1286bf0037cd"
          ) {
            console.log(formik.values.futureValueRecalculation,presentValueInvestor,data?.data?.payedAmount);
            formik.setFieldValue(
              "tableRemaining",
              Math.round(
                data?.data?.payedAmount -
                  Math.round(
                    FV(
                      data?.data?.investorTax / 100,
                      formik.values.calculatedDays / 365,
                      0,
                      data?.data?.presentValueInvestor,
                      0
                    ) * -1
                  )
              )
            );
          }

          formik.setFieldValue("additionalInterests", 0);
          formik.setFieldValue("additionalInterestsSM", 0);
          formik.setFieldValue("investorInterests", 0);
          formik.setFieldValue("additionalDays", 0);
          if (data?.data?.payedPercent < 100 && formik.values.receiptStatus !== "ea8518e8-168a-46d7-b56a-1286bf0037cd") {
          formik.setFieldValue(
            "remaining",
            data?.data?.amount - data?.data?.payedAmount
          );
      }
          break;
        case "vencida":
          formik.setFieldValue(
            "typeReceipt",
            "62b0ca1e-f999-4a76-a07f-be1fe4f38cfb"
          );

          if (data?.receipts?.lastDate && data?.receipts?.interest > 0) {
            formik.setFieldValue(
              "additionalDays",
              differenceInDays(
                new Date(formik.values.date),
                new Date(data?.receipts?.lastDate)
              )
            );
          } else {
            formik.setFieldValue(
              "additionalDays",
              differenceInDays(
                new Date(formik.values.date),
                new Date(data?.data?.opExpiration)
              )
            );
          }

          if (formik.values.receiptStatus === "ea8518e8-168a-46d7-b56a-1286bf0037cd") {
            
            if (data?.data?.previousOperationData || data?.data?.previousOperationBill) {
              

            const calcPayedAmount = data?.data?.payedAmount - (data?.receipts?.payedAmount - data?.receipts?.interest);
            formik.setFieldValue("additionalInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationBill?.discountTax, formik.values.additionalDays, false));
            if (data?.receipts?.payedAmount) {
                formik.setFieldValue("additionalInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
            } else {

                  if (data?.data?.previousOperationData) {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                    formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  }

            }
            } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                    formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
          }
            
            formik.setFieldValue("remaining", 0);


          } else {
            if (data?.receipts?.payedAmount) {
              const calcPayedAmount = data?.data?.payedAmount - (data?.receipts?.payedAmount - data?.receipts?.interest);
              // caso con recaudos previos
                  if (data?.data?.previousOperationData) {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(calcPayedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  }
              
            } else {
                              if (data?.data?.previousOperationData) {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  }
            }
          }

          formik.setFieldValue("futureValueRecalculation", 0);
          formik.setFieldValue("tableRemaining", 0);
                if (data?.data?.payedPercent < 100 && formik.values.receiptStatus !== "ea8518e8-168a-46d7-b56a-1286bf0037cd") {
        formik.setFieldValue(
          "remaining",
          data?.data?.amount - data?.data?.payedAmount
        );
      }
          break;
        default:
          formik.setFieldValue(
            "typeReceipt",
            "db1d1fa4-e467-4fde-9aee-bbf4008d688b"
          );
          formik.setFieldValue("futureValueRecalculation", 0);

          formik.setFieldValue("additionalInterests", 0);
          formik.setFieldValue("tableRemaining", 0);
          formik.setFieldValue("investorInterests", 0);
          formik.setFieldValue("additionalInterestsSM", 0);
          formik.setFieldValue("additionalDays", 0);
                if (data?.data?.payedPercent < 100 && formik.values.receiptStatus !== "ea8518e8-168a-46d7-b56a-1286bf0037cd") {
        formik.setFieldValue(
          "remaining",
          data?.data?.amount - data?.data?.payedAmount
        );
      }
      }
    } else {
      switch (state) {
        case "anticipada":
          formik.setFieldValue(
            "typeReceipt",
            "edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0"
          );
          formik.setFieldValue("additionalInterests", 0);
          formik.setFieldValue("additionalInterestsSM", 0);

          formik.setFieldValue("futureValueRecalculation", 0);

          formik.setFieldValue("tableRemaining", 0);

          formik.setFieldValue("investorInterests", 0);
          formik.setFieldValue("additionalDays", 0);
          formik.setFieldValue("remaining", 0);
          break;
        case "vencida":
          formik.setFieldValue("typeReceipt","ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f");
          if (data?.receipts?.lastDate && data?.receipts?.interest > 0) {
            formik.setFieldValue("additionalDays",differenceInDays( new Date(formik.values.date),new Date(data?.receipts?.lastDate)));
          } else {
            formik.setFieldValue("additionalDays",differenceInDays( new Date(formik.values.date), new Date(data?.data?.opExpiration)));
          }

          if (formik.values.receiptStatus === "ea8518e8-168a-46d7-b56a-1286bf0037cd") {


            
            // check if the operation has previous operations
            if (data?.data?.previousOperationData || data?.data?.previousOperationBill) {

            const calcPayedAmount = data?.data?.payedAmount - (data?.receipts?.payedAmount - data?.receipts?.interest);
            formik.setFieldValue("additionalInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationBill?.discountTax, formik.values.additionalDays, false));
            if (data?.receipts?.payedAmount) {
                formik.setFieldValue("additionalInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
            } else {
                formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.previousOperationData?.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
            }
          } else {
                formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
          }
          } else {
            if (data?.receipts?.payedAmount) {
              const calcPayedAmount = data?.data?.payedAmount - (data?.receipts?.payedAmount - data?.receipts?.interest);
              // caso con recaudos previos
              if (data?.data?.previousOperationData) {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(calcPayedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(calcPayedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                    formik.setFieldValue("investorInterests",calcAdditionalInterests(calcPayedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  }
              
            } else {
              // caso base
                if (data?.data?.previousOperationData) {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.previousOperationData.discountTax, formik.values.additionalDays, false));
                    formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  } else {
                    formik.setFieldValue("additionalInterests", calcAdditionalInterests(data?.data?.payedAmount, data?.data?.discountTax, formik.values.additionalDays, false));
                    formik.setFieldValue("investorInterests",calcAdditionalInterests(data?.data?.payedAmount, data?.data?.investorTax, formik.values.additionalDays, false));
                  }
            }
          }


          formik.setFieldValue("futureValueRecalculation", 0);
          formik.setFieldValue("tableRemaining", 0);
          formik.setFieldValue("remaining", 0);
          break;
        default:
          formik.setFieldValue(
            "typeReceipt",
            "d40e91b1-fb6c-4c61-9da8-78d4f258181d"
          );

          formik.setFieldValue("futureValueRecalculation", 0);

          formik.setFieldValue("additionalInterests", 0);
          formik.setFieldValue("additionalInterestsSM", 0);
          formik.setFieldValue("tableRemaining", 0);
          formik.setFieldValue("additionalDays", 0);
          formik.setFieldValue("investorInterests", 0);
          formik.setFieldValue("remaining", 0);
          break;
      }
    }
  }, [
    canceled,
    state,
    formik.values.calculatedDays,
    formik.values.date,
    formik.values.typeReceipt,
    formik.values.receiptStatus,
    formik.values.payedAmount,
  ]);

  useEffect(() => {
    if ( formik.values.investorInterests > 0 && formik.values.additionalInterests > 0 ) {
      console.log(formik.values.additionalInterests, formik.values.investorInterests);
      formik.setFieldValue("additionalInterestsSM", formik.values.additionalInterests - formik.values.investorInterests);
    }
  }, [formik.values.investorInterests, formik.values.additionalInterests]);

  useEffect(() => {
    if (
      formik.values.receiptStatus === "ea8518e8-168a-46d7-b56a-1286bf0037cd"
    ) {
      formik.setFieldValue("tableRemaining", 0);
    }
  }, [formik.values.receiptStatus]);

  useEffect(() => {
    if (canceled) {
      const calcPendingAmount = formik.values.pendingAmount - formik.values.payedAmount;
      switch (state) {
        case "anticipada":
          if (formik.values.previousPayedAmount > 0) {
            if (calcPendingAmount <= 0) {
              setPresentValueInvestor(
                formik.values.futureValueRecalculation -
                  formik.values.previousPayedAmount
              );
            }
          } else {
            setPresentValueInvestor(formik.values.futureValueRecalculation);
          }
          break;
        case "vigente":
          if (formik.values.previousPayedAmount > 0) {
            if (calcPendingAmount <= 0) {
              setPresentValueInvestor(
                formik.values.payedAmount - formik.values.remaining
              );
            }
          } else {
            setPresentValueInvestor(data?.data?.payedAmount);
          }
          break;
        case "vencida":
          if (formik.values.previousPayedAmount > 0) {
            if (calcPendingAmount == 0 || calcPendingAmount < 0) {
              setPresentValueInvestor(
                formik.values.payedAmount -
                  formik.values.additionalInterests -
                  formik.values.remaining
              );
            }
          } else {
            setPresentValueInvestor(data?.data?.payedAmount);
          }
          break;
      }
    } else {
      switch (state) {
        case "anticipada":
          setPresentValueInvestor(formik.values.payedAmount);
          break;
        case "vigente":
          setPresentValueInvestor(formik.values.payedAmount);
          break;
        case "vencida":
          setPresentValueInvestor(
            formik.values.payedAmount - formik.values.additionalInterests
          );
      }
    }
  }, [
    canceled,
    state,
    formik.values.calculatedDaysfutureValueRecalculation,
    formik.values.date,
    formik.values.typeReceipt,
    formik.values.receiptStatus,
    formik.values.payedAmount,
    formik.values.futureValueRecalculation,
  ]);

  useEffect(() => {
    setCounter(counter + 1);
    if (Math.floor(pendingAmount) <= 0) {
      setCanceled(true);
    } else {
      setCanceled(false);
    }
  }, [pendingAmount]);

  useEffect(() => {
    if (counter == 4) {
      formik.setFieldValue("payedAmount", pendingAmount);
    }
  }, [counter]);

  useEffect(() => {
    // wait for the last useEffect to finish
    if (counter >= 5) {
      formik.setFieldValue("payedAmount", 0);
    }
  }, [formik.values.date]);

  useEffect(() => {
    if (
      canceled &&
      state == "anticipada" &&
      formik.values.previousPayedAmount <= 0
    ) {
      setPresentValueInvestor(formik.values.futureValueRecalculation);
    }
  }, [formik.values.futureValueRecalculation]);



function calcAdditionalInterests(payedAmount, discountTax, additionalDays, investor) {
  const growFactor       = Math.pow(1 +(discountTax/100), additionalDays / 365);
  const total            = payedAmount * growFactor;
  const generateInterest = total - payedAmount;
  return Number(generateInterest.toFixed(2));
}

  return (
    <ReceiptC
      formik={formik}
      data={data?.data}
      pendingAmount={pendingAmount}
      presentValueInvestor={presentValueInvestor}
      loading={loadingRegisterReceipt}
      success={success}
      isModalOpen={isModalOpen}
    />
  );
}