const exactPermissions = {
  "/dashboard": "__authenticated__",
  "/brochures": "prospects.view",
  "/requests": "prospects.view",
  "/customers": "clients.create",
  "/customers/customerList": "clients.view",
  "/customers/account": "client_accounts.update",
  "/customers/accountList": "client_accounts.view",
  "/customers/financialAnalysisInformation": "financial_profiles.view",
  "/bills": "bills.create",
  "/bills/billList": "bills.view",
  "/bills/createBill": "bills.create",
  "/bills/editBill": "bills.update",
  "/bills/detailBill": "bills.view",
  "/brokers": "brokers.create",
  "/brokers/brokerList": "brokers.view",
  "/riskProfile": "risk_profiles.view",
  "/financialProfile": "financial_profiles.view",
  "/financialProfile/financialStatement": "financial_profiles.update",
  "/financialProfile/indicators": "financial_profiles.view",
  "/pre-operations": "preoperations.view",
  "/pre-operations/manage": "preoperations.create",
  "/pre-operations/editPreOp": "preoperations.update",
  "/pre-operations/detailPreOp": "preoperations.view",
  "/pre-operations/detail": "preoperations.view",
  "/pre-operations/approval": "preoperations.approve",
  "/pre-operations/registerMassiveOperation": "preoperations.import",
  "/operations": "operations.view",
  "/operations/manage": "operations.create",
  "/operations/detail": "operations.view",
  "/operations/byOp": "operations.view",
  "/operations/approval": "operations.approve",
  "/operations/electronicSignature": "operations.view",
  "/operations/notifications": "operations.view",
  "/administration": "administration.access",
  "/administration/deposit-emitter": "deposits.create",
  "/administration/deposit-emitter/depositList": "deposits.view",
  "/administration/deposit-investor": "deposits.create",
  "/administration/deposit-investor/depositList": "deposits.view",
  "/administration/refund": "refunds.create",
  "/administration/refund/refundList": "refunds.view",
  "/administration/negotiation-summary": "negotiations.update",
  "/administration/negotiation-summary/summaryList": "negotiations.view",
  "/administration/new-receipt": "receipts.create",
  "/administration/new-receipt/receiptList": "receipts.view",
  "/administration/new-receipt/receiptHistory": "receipts.history",
  "/administration/new-receipt/registerMassiveReceipt": "receipts.import",
  "/administration/new-receipt/receipt-visualization": "receipts.view",
  "/administration/receipt": "receipts.create",
  "/administration/users": "users.view",
  "/administration/access-control": "users.view",
  "/administration/security": "security.access",
};

const publicPaths = new Set(["/", "/403", "/auth/login", "/auth/forgotPassword", "/auth/resetPassword", "/auth/clientPortalUnavailable", "/self-management"]);

export const permissionForRoute = (pathname) => {
  if (publicPaths.has(pathname)) return null;
  if (exactPermissions[pathname]) return exactPermissions[pathname];
  if (pathname.startsWith("/pre-operationsold")) return "preoperations.view";
  return "__authenticated__";
};

export const isPublicRoute = (pathname) => publicPaths.has(pathname);

export const landingRouteForPermissions = () => "/dashboard";
