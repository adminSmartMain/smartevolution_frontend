import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authHeaders = () => ({
  authorization:
    "Bearer " +
    localStorage.getItem("access-token"),
});

export const normalizeNotification = (notification) => {
  if (!notification) return notification;

  const metadata = notification.metadata || {};
  const entity = notification.entity || {};

  return {
    ...notification,
    eventType:
      notification.eventType ??
      notification.event_type,
    read:
      notification.read ??
      notification.is_read ??
      false,
    createdAt:
      notification.createdAt ??
      notification.created_at,
    entity: {
      ...entity,
      opId:
        entity.opId ??
        metadata.op_id ??
        metadata.opId,
      investorId:
        entity.investorId ??
        metadata.investor_id ??
        metadata.investorId,
    },
    metadata: {
      ...metadata,
      expirationDate:
        metadata.expirationDate ??
        metadata.expiration_date,
    },
  };
};

export const getNotifications = async ({
  isRead,
  page = 1,
  pageSize = 100,
} = {}) => {
  const params = {
    page,
    page_size: pageSize,
  };

  if (typeof isRead === "boolean") {
    params.is_read = isRead;
  }

  const res = await Axios.get(
    `${API_URL}/notifications/`,
    {
      headers: authHeaders(),
      params,
    }
  );

  return {
    ...res.data,
    results: (res.data?.results || []).map(
      normalizeNotification
    ),
  };
};

export const markNotificationRead = async (id) => {
  const res = await Axios.patch(
    `${API_URL}/notifications/${id}/read/`,
    {},
    {
      headers: authHeaders(),
    }
  );

  return normalizeNotification(res.data);
};

export const markAllNotificationsRead = async () => {
  const res = await Axios.post(
    `${API_URL}/notifications/mark-all-read/`,
    {},
    {
      headers: authHeaders(),
    }
  );

  return res.data;
};

const getNotificationsWebSocketUrl = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("access-token");
  if (!token || !API_URL) {
    return null;
  }

  const url = new URL(API_URL, window.location.origin);

  const protocol =
    url.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${url.host}/ws/notifications/?token=${encodeURIComponent(
    token
  )}`;
};

export const createNotificationsSocket = ({
  onNotification,
  onReconnect,
  onOpen,
  onClose,
} = {}) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  let socket = null;
  let reconnectTimer = null;
  let stopped = false;
  let hasConnected = false;

  const connect = () => {
    if (stopped) return;

    const wsUrl = getNotificationsWebSocketUrl();
    if (!wsUrl) return;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      const reconnecting = hasConnected;
      hasConnected = true;

      if (reconnecting && onReconnect) {
        onReconnect();
      }

      if (onOpen) {
        onOpen();
      }
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (
          payload?.type === "notification.created" &&
          payload?.data
        ) {
          onNotification?.(
            normalizeNotification(payload.data)
          );
        }
      } catch (error) {
        console.error(
          "No fue posible procesar la notificación realtime",
          error
        );
      }
    };

    socket.onclose = (event) => {
      onClose?.(event);

      if (!stopped) {
        reconnectTimer = setTimeout(
          connect,
          2000
        );
      }
    };

    socket.onerror = () => {
      socket?.close();
    };
  };

  connect();

  return () => {
    stopped = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    if (
      socket &&
      socket.readyState !== WebSocket.CLOSED
    ) {
      socket.close(1000);
    }
  };
};

export const notifyNotificationsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("notifications:changed")
    );
  }
};

export const getOperationPreviewById = async (id) => {
  const res = await Axios.get(
    `${API_URL}/preOperation/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return res.data;
};

export const getElectronicSignaturePreview = async ({
  opId,
  investorId,
}) => {
  const res = await Axios.get(
    `${API_URL}/preOperation`,
    {
      headers: authHeaders(),
      params: {
        opId: "undefined",
        opIdV: opId,
        investor: investorId,
      },
    }
  );

  return res.data;
};
