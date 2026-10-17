import BillPreview from "./BillPreview";
import OperationPreview from "./OperationPreview";
import ElectronicSignaturePreview from "./ElectronicSignaturePreview";
import PreOperationPreview from "./PreOperationPreview";
import EmptyPreview from "./EmptyPreview";

export default function NotificationPreview({
  notification,
}) {
  if (!notification) {
    return <EmptyPreview />;
  }

  switch (notification.entity?.type) {
    case "bill":
      return (
        <BillPreview
          notification={notification}
        />
      );

    case "operation":
      return (
        <OperationPreview
          notification={notification}
        />
      );

    case "electronic_signature":
      return (
        <ElectronicSignaturePreview
          notification={notification}
        />
      );

    case "preoperation":
      return (
        <PreOperationPreview
          notification={notification}
        />
      );

    default:
      return (
        <EmptyPreview
          notification={notification}
        />
      );
  }
}