import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { toast } from "react-toastify";
import ModalIntegrationCode from "@components/modals/modalIntegrationCode";
import { calculateOperation, toNumber } from "@lib/preOperationCalculations";

const hasIntegrationCode = (invoice) => Boolean(invoice?.integrationCode?.trim())
  && invoice.integrationCode !== "no-code";

const buildBillOptions = (bills) => (Array.isArray(bills) ? bills : [])
  .filter((bill) => toNumber(bill.currentBalance) > 0)
  .map((bill) => ({
    label: `${String(bill.billId)}${bill.integrationCode ? `-${String(bill.integrationCode)}` : ""}`,
    value: String(bill.billId),
    id: String(bill.id),
    integrationCode: bill.integrationCode || "",
  }));

const recalculateBillAvailability = (invoices, billId, originalBalance) => {
  if (!billId) return invoices;
  const used = invoices
    .filter((invoice) => String(invoice.billId) === String(billId))
    .reduce((total, invoice) => total + toNumber(invoice.valorFuturo), 0);
  const available = Math.max(0, toNumber(originalBalance) - used);

  return invoices.map((invoice) => (
    String(invoice.billId) === String(billId)
      ? { ...invoice, saldoDisponible: available, saldoDisponibleInfo: toNumber(originalBalance) }
      : invoice
  ));
};

export default function BillSelector({
  values,
  setFieldValue,
  errors,
  touched,
  index,
  factura,
  dataBills,
  setFieldTouched,
  setFieldError,
  cargarFraccionFactura,
  hasShownModal,
  setHasShownModal,
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedFacturaWithCode, setSelectedFacturaWithCode] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);

  const billOptions = buildBillOptions(values?.takedBills);
  const selectedBillOption = billOptions.find(
    (option) => option.value === String(factura.billId || "")
  ) || null;

  const validateIntegrationCode = (selectedBill) => {
    const otherInvoices = (values.facturas || []).filter(
      (current, currentIndex) => currentIndex !== index && current.billId
    );
    const selectedHasCode = hasIntegrationCode(selectedBill);
    const invoicesWithCode = otherInvoices.filter(hasIntegrationCode);
    const invoicesWithoutCode = otherInvoices.filter((invoice) => !hasIntegrationCode(invoice));

    if (selectedHasCode && invoicesWithoutCode.length) {
      return "No se puede agregar factura con código cuando hay facturas sin código";
    }
    if (!selectedHasCode && invoicesWithCode.length) {
      return "No se permiten facturas sin código cuando otras lo tienen";
    }
    if (selectedHasCode && invoicesWithCode.some(
      (invoice) => invoice.integrationCode !== selectedBill.integrationCode
    )) {
      return `El código debe coincidir con "${invoicesWithCode[0].integrationCode}"`;
    }
    return null;
  };

  const validateInvestorForBill = (billId) => {
    if (!factura.nombreInversionista) return false;
    return (values.facturas || []).some((current, currentIndex) => (
      currentIndex !== index
      && String(current.billId || "") === String(billId)
      && current.nombreInversionista === factura.nombreInversionista
    ));
  };

  const updateInvoices = (invoices) => {
    setFieldValue("facturas", calculateOperation(invoices, values));
  };

  const processBillSelection = async (option) => {
    const selectedBill = (dataBills?.data || []).find(
      (bill) => String(bill.billId) === String(option.value)
    );
    if (!selectedBill) return;

    const integrationError = validateIntegrationCode(selectedBill);
    if (integrationError) {
      toast.error(integrationError);
      return;
    }
    if (validateInvestorForBill(selectedBill.billId)) {
      const message = "No puede asignar el mismo inversionista a facturas agrupadas";
      setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
      setFieldError(`facturas[${index}].nombreInversionista`, message);
      toast.error(message);
      return;
    }

    let fraction = 1;
    try {
      const response = await cargarFraccionFactura(selectedBill.id);
      fraction = toNumber(response?.data?.fraction) || 1;
    } catch (error) {
      console.error("No se pudo consultar la fracción de la factura", error);
    }

    const sameBillBeforeCurrent = (values.facturas || []).filter((current, currentIndex) => (
      currentIndex !== index && String(current.billId || "") === String(selectedBill.billId)
    ));
    const usedBalance = sameBillBeforeCurrent.reduce(
      (total, current) => total + toNumber(current.valorFuturo),
      0
    );
    const remainingBalance = Math.max(0, toNumber(selectedBill.currentBalance) - usedBalance);
    const initialFutureValue = sameBillBeforeCurrent.length ? 0 : remainingBalance;
    const nextFraction = sameBillBeforeCurrent.length
      ? Math.max(...sameBillBeforeCurrent.map((current) => toNumber(current.fraccion) || 1)) + 1
      : fraction;

    const replacement = {
      ...factura,
      billId: selectedBill.billId,
      factura: String(selectedBill.id),
      fechaEmision: selectedBill.dateBill || null,
      expirationDate: selectedBill.expirationDate || "",
      amount: toNumber(selectedBill.currentBalance),
      payedAmount: initialFutureValue,
      fraccion: nextFraction,
      saldoDisponibleInfo: toNumber(selectedBill.currentBalance),
      saldoDisponible: remainingBalance,
      valorFuturo: initialFutureValue,
      valorNominal: initialFutureValue,
      porcentajeDescuento: initialFutureValue ? 100 : 0,
      presentValueInvestor: initialFutureValue,
      presentValueSF: initialFutureValue,
      integrationCode: selectedBill.integrationCode || "",
      isReBuy: selectedBill.reBuyAvailable ?? 0,
      is_creada: false,
    };
    let nextInvoices = (values.facturas || []).map((current, currentIndex) => (
      currentIndex === index ? replacement : current
    ));
    nextInvoices = recalculateBillAvailability(
      nextInvoices,
      selectedBill.billId,
      selectedBill.currentBalance
    );
    updateInvoices(nextInvoices);
  };

  const clearBill = () => {
    if (factura.is_creada) return;
    const previousBillId = factura.billId;
    const previousBill = (dataBills?.data || []).find(
      (bill) => String(bill.billId) === String(previousBillId)
    );
    const clearedInvoice = {
      ...factura,
      billId: "",
      factura: "",
      fechaEmision: "",
      expirationDate: "",
      amount: 0,
      payedAmount: 0,
      fraccion: 1,
      valorNominal: 0,
      valorFuturo: 0,
      porcentajeDescuento: 0,
      saldoDisponible: 0,
      saldoDisponibleInfo: 0,
      presentValueInvestor: 0,
      presentValueSF: 0,
      investorProfit: 0,
      comisionSF: 0,
      gastoMantenimiento: 0,
      integrationCode: "",
      isReBuy: 0,
      is_creada: false,
    };
    let nextInvoices = (values.facturas || []).map((current, currentIndex) => (
      currentIndex === index ? clearedInvoice : current
    ));
    nextInvoices = recalculateBillAvailability(
      nextInvoices,
      previousBillId,
      previousBill?.currentBalance
    );
    updateInvoices(nextInvoices);

    if (!nextInvoices.some(hasIntegrationCode) && Array.isArray(values.takedBillsBeforeFilterIntegration)) {
      setFieldValue("takedBills", values.takedBillsBeforeFilterIntegration);
    }
  };

  const handleConfirmIntegrationCode = async () => {
    setShowConfirmationModal(false);
    setHasShownModal(true);
    const matchingBills = (values.takedBills || []).filter(
      (bill) => bill.integrationCode === selectedFacturaWithCode?.integrationCode
    );
    if (matchingBills.length) {
      setFieldValue("takedBillsBeforeFilterIntegration", values.takedBills);
      setFieldValue("takedBills", matchingBills);
    }
    if (pendingSelection) await processBillSelection(pendingSelection);
    setPendingSelection(null);
  };

  const handleCancelIntegrationCode = () => {
    setShowConfirmationModal(false);
    setPendingSelection(null);
    setSelectedFacturaWithCode(null);
  };

  const handleChange = async (_event, option) => {
    if (!option) {
      clearBill();
      return;
    }
    const selectedBill = (dataBills?.data || []).find(
      (bill) => String(bill.billId) === String(option.value)
    );
    if (hasIntegrationCode(selectedBill) && !hasShownModal) {
      setSelectedFacturaWithCode(selectedBill);
      setPendingSelection(option);
      setShowConfirmationModal(true);
      return;
    }
    await processBillSelection(option);
  };

  return (
    <>
      <Autocomplete
        id="bill-name"
        data-testid="campo-factura"
        options={billOptions}
        value={selectedBillOption}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Número de Factura *"
            fullWidth
            name="billId"
            error={touched.facturas?.[index]?.billId && Boolean(errors?.facturas?.[index]?.billId)}
            helperText={` ${factura.isReBuy ? "Disponible Recompra" : "No disponible Recompra"}`}
          />
        )}
      />
      <ModalIntegrationCode
        values={values}
        showConfirmationModal={showConfirmationModal}
        setIsIntegrationCode={setShowConfirmationModal}
        integrationCode={selectedFacturaWithCode?.integrationCode}
        setIsFilterIntegrationActive={() => {}}
        selectedFactura={selectedFacturaWithCode}
        onConfirm={handleConfirmIntegrationCode}
        onCancel={handleCancelIntegrationCode}
      />
    </>
  );
}
