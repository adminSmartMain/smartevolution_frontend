import { styled } from "@mui/material/styles";


export const Container = styled("div")({
  margin: "0",
  padding: "10px",
  backgroundColor: "#F7F7F7",
  height: "100%",
  width: "100%",
  border: "1px solid #EBEBEB",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
});

export const MenuContainer = styled("div")({
    width: "100%",
    height: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});

export const ContentContainer = styled("div")({
    width: "90%",
    height: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    padding: "0 1rem",
});
