import { Box, Typography } from "@mui/material";
import CustomDataGrid from "@styles/tables";

export const ClientTableDesktop = ({
  rows,
  columns,
  loading,
  dataCount,
  page,
  setPage,
  fetch,
  filter,
  query,
}) => {
  return (
    <Box
      marginTop={4}
      width="100%"
      sx={{
        minHeight: 500,      // ✅ le da espacio real
      }}
    >
      <CustomDataGrid
        autoHeight                  // ✅ CLAVE
        getRowId={(row) => row.id}  // ✅ asegura detección del id
        rows={rows}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15]}
        disableSelectionOnClick
        disableColumnMenu
        loading={loading}
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
          Pagination: () => (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
                {page * 15 - 14} - {page * 15} de {dataCount}
              </Typography>

              <Box display="flex" flexDirection="row">
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.2rem"
                  sx={{
                    cursor: "pointer",
                    transform: "rotate(180deg)",
                    color: "#63595C",
                  }}
                  onClick={() => {
                    if (page > 1) {
                      fetch({
                        page: page - 1,
                        ...(Boolean(filter) && { [filter]: query }),
                      });
                      setPage(page - 1);
                    }
                  }}
                >
                  &#xe91f;
                </Typography>

                <Typography
                  fontFamily="icomoon"
                  fontSize="1.2rem"
                  sx={{
                    cursor: "pointer",
                    color: "#63595C",
                    ml: 1,
                  }}
                  onClick={() => {
                    if (page < dataCount / 15) {
                      fetch({
                        page: page + 1,
                        ...(Boolean(filter) && { [filter]: query }),
                      });
                      setPage(page + 1);
                    }
                  }}
                >
                  &#xe91f;
                </Typography>
              </Box>
            </Box>
          ),
        }}
      />
    </Box>
  );
};
