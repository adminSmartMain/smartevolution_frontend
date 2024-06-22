import responsiveFontSize from "@lib/responsiveFontSize";

/* General styles */
export const mainSx = {
  height: "100vh",
};

export const leftContainerSx = {
  backgroundColor: "#76B4A3",
};

export const rightContainerSx = {
  px: 10,

  ["@media (max-width: 900px)"]: {
    px: 5,
  },

  ["@media (max-width: 600px)"]: {
    px: 2,
  },
};

export const headerGridSx = {};

export const headerContainerSx = {
  height: "100%",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

export const imageHeaderContainer = {
  mb: 6,
  ["@media (max-width: 600px)"]: {
    width: 150,
  },
};

export const footFerGridSx = {
  backgroundColor: "blue",
};

export const defaultStepContainerSx = {
  ["@media (max-width: 600px)"]: {
    pr: 1,
  },
};

export const centeredStepContainerSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

/* Text styles */
export const headerTitleSx = {
  color: "#488B8F",
  fontSize: responsiveFontSize(20, 1.1, 4),
  fontWeight: 600,
  mb: 1.5,

  ["@media (max-width: 600px)"]: {
    fontSize: 13,
  },
};

export const titleStartSx = {
  color: "#488B8F",
  fontSize: responsiveFontSize(39, 2, 13),
  fontWeight: 500,
};

export const sectionTitleSx = {
  color: "#5EA3A3",
  fontSize: responsiveFontSize(16, 0.9, 3),
  fontWeight: 700,
};

export const questionParagraphSx = {
  color: "#333333",
  fontSize: responsiveFontSize(25, 1.28, 8),
  fontWeight: 500,

  ["@media (max-width: 600px)"]: {
    fontSize: 16,
  },
};

export const questionDescriptionSx = {
  color: "#333333",
  fontSize: responsiveFontSize(16, 0.9, 3),
  fontWeight: 500,
};

export const questionTextSx = {
  color: "#63595C",
  fontSize: responsiveFontSize(12, 0.71, 2),
  fontWeight: 700,
  mb: 1.25,
};

export const footerTextSx = {
  ...questionTextSx,
  fontSize: responsiveFontSize(14, 0.79, 3),
  mb: 0,
};

export const termsTextSx = {
  color: "#63595C",
  fontWeight: 500,
  fontSize: responsiveFontSize(12, 0.74, 2),
};

export const hintTextSx = {
  color: "#57575780",
  fontWeight: 500,
  fontSize: responsiveFontSize(11, 0.72, 2),
};

export const titleSx = {};
