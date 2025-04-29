import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

import scrollSx from "@styles/scroll";

const CustomDataGrid = styled(DataGrid)({
  border: "none",
  
  '& .MuiDataGrid-detailPanel': {
    overflow: 'visible !important',
    zIndex: 1,
  },
  
  '& .MuiDataGrid-detailPanelToggle': {
    height: '100% !important',
  },

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
    fontWeight: "normal",
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
  
  // HEADER STYLES
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F5F5F5",
    borderBottom: "none",
    minHeight: '36px !important',
    maxHeight: '36px !important',
  },
  
  "& .MuiDataGrid-columnHeader": {
    padding: '0px',
    minHeight: '36px !important',
    maxHeight: '36px !important',
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },

  // ESTO ES LO QUE CENTRA EL TEXTO DEL HEADER
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    justifyContent: "center !important", // Centrado horizontal
    padding: '0px',
    width: '100%',
  },
  
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: "#808080",
    letterSpacing: "0px",
    lineHeight: '1.3',
    textAlign: 'center', // Centrado horizontal del texto
    width: '100%',
    
  },

  // Footer y otros estilos
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
  },
  
  "& .MuiDataGrid-columnHeaderCheckbox": {
    justifyContent: "center",
  },
  
  "& .MuiDataGrid-columnHeaderSeparator, & .MuiDataGrid-columnSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-sortIcon": {
    color: "#8C7E82",
    fontSize: '16px',
    marginLeft: '4px',
  },

  "& .MuiDataGrid-menuIcon": {
    display: "none",
  },
});

export default CustomDataGrid;