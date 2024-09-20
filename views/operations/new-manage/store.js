import { create } from "zustand";


export const useFormStore = create((set, get) => ({
  formData: {
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
    integrationCode: "",
  },
  
  // fields methods 

  // applyGm
  setApplyGm: (applyGm) => set((state) => ({ formData: { ...state.formData, applyGm } })),

  // print the form data
  printFormData: () => console.log(get().formData),

}));