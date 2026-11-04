import { differenceInDays, startOfDay } from "date-fns";
import { PV } from "@formulajs/formulajs";

export const toNumber = (value) => {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const roundCurrency = (value) => Math.round(toNumber(value));

const toLocalDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const calculateOperationDays = (opDate, endDate, fallback = 0) => {
  const operationDate = toLocalDate(opDate);
  const expirationDate = toLocalDate(endDate);

  if (!operationDate || !expirationDate) return Math.max(0, toNumber(fallback));
  return Math.max(0, differenceInDays(startOfDay(expirationDate), startOfDay(operationDate)));
};

/**
 * Computes all derived monetary fields of a single invoice. The amount shown as
 * "porcentajeDescuento" is kept as the existing business contract: percentage
 * of future value paid to the investor (not a percentage to subtract).
 */
export const calculateInvoice = (invoice, operation) => {
  const operationDays = calculateOperationDays(
    operation.opDate,
    invoice.fechaFin,
    invoice.operationDays
  );
  const valorNominal = toNumber(invoice.valorNominal);
  const valorFuturo = toNumber(invoice.valorFuturo);
  const investorTax = toNumber(invoice.investorTax);
  const discountTax = toNumber(operation.discountTax);

  const hasDiscountPeriod = operationDays > 0 && valorNominal > 0;
  const presentValueInvestor = hasDiscountPeriod
    ? roundCurrency(PV(investorTax / 100, operationDays / 365, 0, -valorNominal, 0))
    : valorFuturo;
  const presentValueSF = hasDiscountPeriod
    ? roundCurrency(PV(discountTax / 100, operationDays / 365, 0, -valorNominal, 0))
    : valorFuturo;
  const gastoMantenimiento = invoice.applyGm
    ? roundCurrency(presentValueInvestor * 0.002)
    : 0;

  return {
    ...invoice,
    opDate: operation.opDate,
    operationDays,
    presentValueInvestor,
    presentValueSF,
    comisionSF: roundCurrency(presentValueInvestor - presentValueSF),
    investorProfit: roundCurrency(valorNominal - presentValueInvestor),
    gastoMantenimiento,
  };
};

/**
 * Recalculates every invoice and then derives the account availability once per
 * account. All monetary fields remain numbers; formatting belongs to the UI.
 */
export const calculateOperation = (invoices = [], operation = {}) => {
  const calculatedInvoices = invoices.map((invoice) => calculateInvoice(invoice, operation));
  const totalsByAccount = calculatedInvoices.reduce((totals, invoice) => {
    if (!invoice.idCuentaInversionista) return totals;
    const accountId = invoice.idCuentaInversionista;
    totals[accountId] = (totals[accountId] || 0)
      + toNumber(invoice.presentValueInvestor)
      + toNumber(invoice.gastoMantenimiento);
    return totals;
  }, {});

  return calculatedInvoices.map((invoice) => {
    if (!invoice.idCuentaInversionista) return invoice;
    return {
      ...invoice,
      montoDisponibleCuenta: roundCurrency(
        toNumber(invoice.montoDisponibleInfo) - totalsByAccount[invoice.idCuentaInversionista]
      ),
    };
  });
};

export const applyFutureValue = (invoice, futureValue) => {
  const valorFuturo = Math.max(0, toNumber(futureValue));
  const porcentaje = Math.max(0, Math.min(100, toNumber(invoice.porcentajeDescuento)));
  const valorNominal = roundCurrency(valorFuturo * porcentaje / 100);

  return {
    ...invoice,
    valorFuturo,
    valorFuturoManual: true,
    valorNominal,
    payedAmount: valorNominal,
  };
};

export const applyNominalValue = (invoice, nominalValue) => {
  const valorFuturo = toNumber(invoice.valorFuturo);
  const valorNominal = Math.min(Math.max(0, toNumber(nominalValue)), valorFuturo);
  const porcentajeDescuento = valorFuturo ? roundCurrency(valorNominal / valorFuturo * 100) : 0;

  return {
    ...invoice,
    valorNominal,
    payedAmount: valorNominal,
    valorNominalManual: true,
    porcentajeDescuento,
  };
};

export const applyPaidPercentage = (invoice, percentage) => {
  const porcentajeDescuento = Math.max(0, Math.min(100, toNumber(percentage)));
  const valorNominal = roundCurrency(toNumber(invoice.valorFuturo) * porcentajeDescuento / 100);

  return {
    ...invoice,
    porcentajeDescuento,
    valorNominal,
    payedAmount: valorNominal,
    valorNominalManual: false,
  };
};
