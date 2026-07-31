const SECTION_LINKS = {
  Administración: "/administration",
  Clientes: "/customers/customerList",
  Facturas: "/bills/billList",
  Operaciones: "/pre-operations",
  Corredores: "/brokers/brokerList",
};

const PAGE_HEADERS = {
  "/dashboard": ["Panel principal", "Consulta el estado general y los indicadores de la plataforma.", "Inicio"],
  "/brochures": ["Prospectos", "Gestiona los prospectos y su información comercial.", "Prospectos"],
  "/customers/customerList": ["Clientes", "Consulta y administra los clientes registrados.", "Clientes"],
  "/customers/accountList": ["Gestión de cuentas", "Consulta y administra las cuentas asociadas a clientes.", "Clientes"],
  "/customers/account": ["Cuenta de cliente", "Gestiona la información de la cuenta seleccionada.", "Clientes"],
  "/customers/financialAnalysisInformation": ["Análisis financiero", "Consulta la información financiera del cliente.", "Clientes"],
  "/financialProfile": ["Perfil financiero", "Consulta y administra la información financiera.", "Clientes"],
  "/financialProfile/financialStatement": ["Estados financieros", "Consulta y administra los estados financieros del cliente.", "Clientes"],
  "/financialProfile/indicators": ["Indicadores financieros", "Consulta los indicadores financieros calculados.", "Clientes"],
  "/riskProfile": ["Perfil de riesgo", "Consulta la evaluación y el perfil de riesgo.", "Clientes"],
  "/bills": ["Extraer factura", "Carga un XML para extraer y validar la información de la factura.", "Facturas"],
  "/bills/billList": ["Consulta de facturas", "Busca, filtra y administra las facturas registradas.", "Facturas"],
  "/bills/createBill": ["Registrar factura", "Registra manualmente una nueva factura o documento.", "Facturas"],
  "/bills/detailBill": ["Detalle de factura", "Consulta toda la información de la factura seleccionada.", "Facturas"],
  "/bills/editBill": ["Editar factura", "Actualiza la información de la factura seleccionada.", "Facturas"],
  "/pre-operations": ["Operaciones por aprobar", "Consulta y gestiona las operaciones pendientes de aprobación.", "Operaciones"],
  "/pre-operations/approval": ["Aprobar operación", "Revisa la información antes de aprobar la operación.", "Operaciones"],
  "/pre-operations/detail": ["Detalle de operación", "Consulta toda la información de la operación seleccionada.", "Operaciones"],
  "/pre-operations/manage": ["Registrar operación", "Configura y registra una nueva operación.", "Operaciones"],
  "/pre-operations/detailPreOp": ["Ver operación", "Consulta toda la información de la operación seleccionada.", "Operaciones"],
  "/pre-operations/editPreOp": ["Editar operación", "Actualiza la información de la operación seleccionada.", "Operaciones"],
  "/pre-operations/registerMassiveOperation": ["Registrar operaciones masivas", "Carga y valida múltiples operaciones en un solo proceso.", "Operaciones"],
  "/operations": ["Operaciones aprobadas", "Consulta y administra las operaciones aprobadas.", "Operaciones"],
  "/operations/approval": ["Aprobación de operación", "Revisa y confirma la operación seleccionada.", "Operaciones"],
  "/operations/byOp": ["Detalle por operación", "Consulta los documentos y movimientos de la operación.", "Operaciones"],
  "/operations/detail": ["Detalle de operación", "Consulta toda la información de la operación seleccionada.", "Operaciones"],
  "/operations/electronicSignature": ["Notificaciones de compra", "Consulta y gestiona las notificaciones de firma electrónica.", "Operaciones"],
  "/operations/manage": ["Gestionar operación", "Administra la información de la operación seleccionada.", "Operaciones"],
  "/operations/notifications": ["Notificaciones", "Consulta las novedades relacionadas con las operaciones.", "Operaciones"],
  "/brokers": ["Registrar corredor", "Crea y configura un nuevo corredor.", "Corredores"],
  "/brokers/brokerList": ["Corredores", "Consulta y administra los corredores registrados.", "Corredores"],
  "/administration": ["Administración", "Selecciona una sección disponible para tu rol.", "Administración"],
  "/administration/users": ["Usuarios y cuentas de clientes", "Administra identidades, accesos y cuentas asociadas.", "Administración"],
  "/administration/security": ["Seguridad y accesos", "Administra roles, permisos y trazabilidad.", "Administración"],
  "/administration/deposit-emitter": ["Registrar giro de emisor", "Registra un nuevo giro asociado a un emisor.", "Administración"],
  "/administration/deposit-emitter/depositList": ["Giros de emisores", "Consulta y administra los giros registrados.", "Administración"],
  "/administration/deposit-investor": ["Registrar giro de inversionista", "Registra un nuevo giro asociado a un inversionista.", "Administración"],
  "/administration/deposit-investor/depositList": ["Giros de inversionistas", "Consulta y administra los giros registrados.", "Administración"],
  "/administration/negotiation-summary": ["Resumen de negociación", "Consulta el detalle de la negociación seleccionada.", "Administración"],
  "/administration/negotiation-summary/summaryList": ["Negociaciones", "Consulta y administra los resúmenes de negociación.", "Administración"],
  "/administration/new-receipt/receiptList": ["Consulta de recaudos", "Busca, filtra y administra los recaudos registrados.", "Administración"],
  "/administration/new-receipt/receiptHistory": ["Historial de recaudos", "Consulta los cambios y la trazabilidad de los recaudos.", "Administración"],
  "/administration/new-receipt": ["Registrar recaudo", "Registra un nuevo recaudo para una operación.", "Administración"],
  "/administration/new-receipt/receipt-visualization": ["Visualizar recaudo", "Revisa la información del recaudo antes de continuar.", "Administración"],
  "/administration/new-receipt/registerMassiveReceipt": ["Registrar recaudos masivos", "Carga y valida múltiples recaudos en un solo proceso.", "Administración"],
  "/administration/receipt": ["Recaudos", "Consulta y administra la información de recaudos.", "Administración"],
  "/administration/refund": ["Registrar reintegro", "Registra un nuevo reintegro para una operación.", "Administración"],
  "/administration/refund/refundList": ["Reintegros", "Consulta y administra los reintegros registrados.", "Administración"],
  "/profile": ["Mi perfil", "Consulta y actualiza tu información personal.", "Mi perfil"],
  "/requests": ["Solicitudes", "Consulta y gestiona las solicitudes registradas.", "Solicitudes"],
  "/customers": ["Registrar cliente", "Crea o actualiza la información general del cliente.", "Clientes"],
};

const labelFromSegment = (segment) => segment
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/-/g, " ")
  .replace(/^./, (letter) => letter.toUpperCase());

export function getPageHeader(pathname) {
  const configured = PAGE_HEADERS[pathname];
  if (configured) {
    const [title, subtitle, section] = configured;
    const breadcrumbs = section === "Inicio"
      ? [{ label: title }]
      : [
          { label: section, href: SECTION_LINKS[section] },
          ...(section === title ? [] : [{ label: title }]),
        ];
    return { title, subtitle, breadcrumbs };
  }

  const segments = pathname.split("/").filter(Boolean);
  const title = labelFromSegment(segments[segments.length - 1] || "Inicio");
  const section = labelFromSegment(segments[0] || "Inicio");
  return {
    title,
    subtitle: "Consulta y administra la información de esta sección.",
    breadcrumbs: section === title ? [{ label: title }] : [{ label: section }, { label: title }],
  };
}

export const ROUTES_WITH_LOCAL_PAGE_HEADER = new Set(["/administration/users"]);
