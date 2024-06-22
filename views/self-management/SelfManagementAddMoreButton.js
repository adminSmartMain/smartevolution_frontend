import { forwardRef } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import responsiveFontSize from "@lib/responsiveFontSize";

const WrappedComponent = forwardRef((props, ref) => (
  <Button
    ref={ref}
    {...props}
    size="medium"
    startIcon={<i className="far fa-circle-plus" />}
  >
    {props.children}
  </Button>
));
WrappedComponent.displayName = "WrappedComponent - Add more";

// prettier-ignore
const SelfManagementAddMoreButton = styled(WrappedComponent)(({ theme }) => `
  color: #5EA3A3;
  box-shadow: none;
  text-transform: none;
  font-weight: 600;
  font-size: ${responsiveFontSize(14, 0.79, 3)};
  border-radius: ${theme.shape.borderRadius}px;
  background-color: #5EA3A31A;

  & .MuiButton-startIcon i {
    font-size: 16px;
  }
`
);

export default SelfManagementAddMoreButton;
