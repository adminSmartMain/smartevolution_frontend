import Link from "next/link";

import { Box } from "@mui/material";

import NavbarButton from "@styles/buttons/button_2";

const containerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "",

  boxSizing: "border-box",
  border: "2px solid #B5D1C9",
  borderRadius: "4px",

  height: "100%",
};

const primaryPathsContainerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 2.25,

  flex: 1,

  borderBottom: "2px solid #B5D1C9",

  overflowY: "auto",
};

const secondaryPathsContainerSx = {
  display: "flex",
  backgroundColor: "#FAFAFA",
  justifyContent: "center",
  alignItems: "center",
  gap: 2.25,

  height: 280,

  overflowY: "auto",

  "@media only screen and (max-width: 1600px)": {
    height: 180,
  },
};

const buttonSx = {
  width: "70%",
  height: "clamp(36px, 10%, 48px)",
};

const secondaryButtonSx = {
  width: "70%",
  height: 48,

  backgroundColor: "#FFFFFF",
};

const primaryPaths = [
  {
    href: "/brochures",
    text: "Prospecto",
  },
  {
    href: "/customers/customerList",
    text: "Clientes",
  },
  {
    href: "/bills/billList",
    text: "Facturas",
  },
  {
    href: "/operations",
    text: "Operaciones",
  },
  {
    href: "/pre-operations",
    text: "Pre-operaciones",
  },
  {
    href: "/brokers/brokerList",
    text: "Corredores",
  },
];

const secondaryPaths = [
  {
    href: "/administration",
    text: "administración",
  },
];

export default function Navbar(props) {
  const { onClick, ...rest } = props;

  return (
    <Box sx={containerSx}>
      <Box sx={primaryPathsContainerSx}>
        {primaryPaths.map((path, i) => (
          <Link key={`button-nav-${i}`} href={path.href} passHref>
            <NavbarButton sx={buttonSx} onClick={onClick ?? null}>
              {path.text}
            </NavbarButton>
          </Link>
        ))}
      </Box>

      <Box sx={secondaryPathsContainerSx}>
        {secondaryPaths.map((path, i) => (
          <Link key={`sec-button-nav-${i}`} href={path.href} passHref>
            <NavbarButton sx={secondaryButtonSx} onClick={onClick ?? null}>
              {path.text}
            </NavbarButton>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
