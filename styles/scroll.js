const scrollSx = {
  scrollBehavior: "smooth",
  overflowY: "auto",
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    width: "9px",
    height: "9px",
    webkitAppearance: "none",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFDDDD",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5EA3A3",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 2px",
    borderRadius: "10px",
  },
};

export default scrollSx;
