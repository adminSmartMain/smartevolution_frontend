import { useContext } from "react";

import BackButton from "@styles/buttons/BackButton";

import { FormContext } from "./Context";

const SelfManagementBackButton = (props) => {
  const {
    text = "Sección anterior",
    onClick,
    wrapperSx,
    buttonSx,
    ...rest
  } = props;

  const { pagination } = useContext(FormContext);

  const onClickMiddleware = () => {
    if (onClick) onClick();
    else pagination?.controls.prevStep();
  };

  return (
    <BackButton
      text={text}
      onClick={onClickMiddleware}
      wrapperSx={wrapperSx}
      buttonSx={{
        width: null,
        textTransform: "none",
        fontWeight: 500,
        px: 0,
      }}
    />
  );
};

export default SelfManagementBackButton;
