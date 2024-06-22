import { Box, Fade, Typography } from "@mui/material";

import CustomTooltip from "@styles/customTooltip";
import InputTitles from "@styles/inputTitles";

import Table from "./styled";

const testColumns = [
  {
    field: "id",
    headerName: "# ID",
    width: 110,
    renderCell: (params) => {
      return (
        <CustomTooltip
          title={params.value}
          arrow
          placement="bottom-start"
          TransitionComponent={Fade}
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 0],
                },
              },
            ],
          }}
        >
          <InputTitles>{params.value}</InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "Customer",
    headerName: "CLIENTE",
    width: 200,
    renderCell: (params) => {
      return (
        <CustomTooltip
          title={params.value}
          arrow
          placement="bottom-start"
          TransitionComponent={Fade}
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 0],
                },
              },
            ],
          }}
        >
          <InputTitles>{params.value}</InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "Status",
    headerName: "ESTADO",
    width: 130,
    renderCell: (params) => {
      return (
        <>
          {params.value === 1 ? (
            <i
              style={{ color: "#488B8F" }}
              className="fa-light fa-badge-check"
            ></i>
          ) : params.value === 0 ? (
            <i style={{ color: "#E66431" }} className="fa-light fa-badge"></i>
          ) : (
            <i
              style={{ color: "#C16060" }}
              className="fa-light fa-hexagon-xmark"
            ></i>
          )}
          <Typography
            fontSize="12px"
            width="100%"
            fontWeight="bold"
            color={
              params.value === 1
                ? "#488B8F"
                : params.value === 0
                ? "#E66431"
                : "#C16060"
            }
            textTransform="uppercase"
            textAlign="center"
            padding="5.5% 8%"
          >
            {params.value === 0
              ? "Sin verificar"
              : params.value === 1
              ? "Verificado"
              : "Rechazado"}
          </Typography>
        </>
      );
    },
  },
];

const testRows = [
  { id: 1, Customer: "cliente", Status: 1 },
  { id: 1, Customer: "cliente", Status: 1 },
  { id: 1, Customer: "cliente", Status: 1 },
  { id: 1, Customer: "cliente", Status: 1 },
  { id: 1, Customer: "cliente", Status: 1 },
];

export const CustomTable = ({ columns, rows, onRowClick }) => {
  return (
    <Box
      sx={{
        padding: "1rem",
        marginTop: "1rem",
        height: "calc(100vh - 200px)",
        width: "100%",
      }}
    >
      <Table
        rows={testRows}
        columns={testColumns}
        pageSize={15}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        disableColumnMenu
        rowHeight={'40px'}
        components={{
          ColumnSortedAscendingIcon: () => (
            <Typography fontFamily="icomoon" fontSize="0.7rem">
              &#xe908;
            </Typography>
          ),

          ColumnSortedDescendingIcon: () => (
            <Typography fontFamily="icomoon" fontSize="0.7rem">
              &#xe908;
            </Typography>
          ),
        }}
        componentsProps={{
          pagination: {
            color: "#5EA3A3",
          },
        }}
      />
    </Box>
  );
};
