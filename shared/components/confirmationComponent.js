import ConfirmationModal from "@styles/confirmationPopups";

const ConfirmationComponent = (props) => {
  return (
    <ConfirmationModal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      a
    </ConfirmationModal>
  );
};

export default ConfirmationComponent;
