export const mockNotifications = [
  {
    id: 101,
    eventType: "BILL_EXPIRED",
    title: "Factura vencida",
    message:
      "La factura FVME267 alcanzó su fecha de vencimiento.",
    read: false,
    createdAt: "2026-09-09T14:20:00-05:00",

    entity: {
      type: "bill",
      id: "abe73598-fca2-4e20-b03e-15967155db0b",
      label: "FVME267",
    },

    metadata: {
      expirationDate: "2026-08-06",
    },
  },

  {
  id: 102,
  eventType: "PREOPERATION_PENDING_APPROVAL",
  title: "Operación pendiente de aprobación",
  message:
    "La operación OP-2250 requiere revisión antes de ser aprobada.",
  read: false,
  createdAt: "2026-09-09T14:10:00-05:00",

  entity: {
    type: "preoperation",
    id: "1c2b730b-46cf-4d31-9e27-094a59df87d2",
    opId: 2250,
    investorId: "7317dbc5-8f74-42a8-9068-4f969f079c51",
    label: "OP-2250",
  },

  metadata: {
    requiresAction: true,
  },
},

  {
    id: 103,
    eventType: "ELECTRONIC_SIGNATURE_PENDING",
    title: "Firma electrónica pendiente",
    message:
      "La operación OP-2250 requiere gestionar su firma electrónica.",
    read: false,
    createdAt: "2026-09-09T12:30:00-05:00",

    entity: {
      type: "electronic_signature",
      id: "1c2b730b-46cf-4d31-9e27-094a59df87d2",
      opId: 2250,
      investorId:
        "7317dbc5-8f74-42a8-9068-4f969f079c51",
      label: "OP-2250",
    },

    metadata: {
      requiresAction: true,
    },
  },

  {
    id: 104,
    eventType: "OPERATION_EXPIRING",
    title: "Operación próxima a vencer",
    message:
      "La operación OP-2250 tiene vencimiento próximo.",
    read: true,
    createdAt: "2026-09-08T10:00:00-05:00",

    entity: {
      type: "operation",
      id: "1c2b730b-46cf-4d31-9e27-094a59df87d2",
      label: "OP-2250",
    },

    metadata: {
      expirationDate: "2026-10-22",
    },
  },
];