import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

import scrollSx from "@styles/scroll";

const CustomDataGrid = styled(DataGrid)({
  border: "none",

  "& .MuiDataGrid-virtualScroller": {
    ...scrollSx,
    overflowX: "auto",
  },

  "& .MuiDataGrid-cellCheckbox": {
    "& .MuiCheckbox-root": {
      color: "#488B8F",
    },
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "transparent",
    color: "#000000",
    fontSize: "0.8rem",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },

  "& .MuiDataGrid-cell": {
    border: "0px solid transparent",
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },

    "&.MuiDataGrid-cell--editing": {
      backgroundColor: "transparent",
      "&:focus": {
        outline: "none",
      },
      "&:focus-within": {
        outline: "none",
      },
      "& .css-1b74o31-MuiInputBase-root-MuiDataGrid-editInputCell": {
        width: "100%",
        color: "#488B8F",
        border: "1px solid #488B8F",
        padding: "7px 0px",
        borderRadius: "4px",
        backgroundColor: "#488B8F1A",

        fontSize: "0.9rem",
        fontWeight: "600",
        textAlign: "right",
      },
    },
  },
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: "#F5F5F5",
    color: "#000000",

    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnsContainerSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    fontSize: "0.7rem",
    color: "#8C7E82",
    letterSpacing: "0px",
  },

  "& .MuiDataGrid-columnHeaders": {
    borderBottom: "none",
  },

  "& .MuiDataGrid-columnHeader ": {
    "&:focus": {
      outline: "none",
    },

    "&:focus-within": {
      outline: "none",
    },
  },

  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
  },

  "& .MuiDataGrid-columnHeaderTitleContainer": {
    justifyContent: "left",
    hover: "none",
    "& .MuiCheckbox-root": {
      color: "#488B8F",
    },
  },
  "& .MuiDataGrid-columnHeaderCheckbox": {
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaderSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-sortIcon": {
    color: "#8C7E82",
    display: "static",
  },

  "& .MuiDataGrid-menuIcon": {
    display: "none",
  },
});

export default CustomDataGrid;
