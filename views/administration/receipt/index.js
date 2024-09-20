import { useRouter } from "next/router";

import { ReceiptC } from "./components";

import { useFormik } from "formik";

export default function Receipt() {
  const router = useRouter();

  const initialValues = {
    date: `${new Date().toISOString().substring(0, 10)}`,
    typeReceipt: "",
    payedAmount: 0,
    bill: "",
    operation: "",
    additionalDays: 0,
    additionalInterests: 0,
    investorInterests: 0,
    tableInterests: 0,
    futureValueRecalculation: 0,
    tableRemaining: 0,
    gmvValue: 0,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {},
  });

  return <ReceiptC formik={formik} />;
}
