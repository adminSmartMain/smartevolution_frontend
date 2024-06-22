export const FinancialStatInput = {
  backgroundColor: "white",
  border: "1.4px solid #5EA3A380",
  borderRadius: "4px",
  padding: "10px",
  textAlign: "right",
  alignContent: "center",

  "input::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& .MuiInputBase-input": {
    padding: "2px",
    color: "#4A4546",
    fontSize: "0.9vw",
    fontWeight: "500",
    textAlign: "left",

    "&::placeholder": {
      color: "#57575780",
      fontSize: "0.9vw",
      fontWeight: "500",
      textAlign: "left",
      opacity: 1,
    },
  },

  "@media all and (display-mode: fullscreen)": {
    pointerEvents: "none",
    //disabled input

    backgroundColor: "#b9bdba40",
  },
};

export const Results = {
  backgroundColor: "none",
  letterSpacing: 0,
  fontSize: "1.1vw",
  fontWeight: "500",
  color: "#488B8F",
  "&:disabled": {
    color: "#488B8F",
  },
};
