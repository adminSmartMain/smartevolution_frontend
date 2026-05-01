import { Box, Button, Fade, FormControl, Grid, IconButton, InputLabel,Menu, MenuItem, InputAdornment , Select, TextField, Typography } from "@mui/material";
import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import MuiButton from "@styles/buttons/button";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import scrollSx from "@styles/scroll";
import CircularProgress from '@mui/material/CircularProgress';
import CustomDataGrid from "@styles/tables";
import DocumentIcon from '@mui/icons-material/Description';

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Skeleton from '@mui/material/Skeleton';







export const PreOperationsTable = ({

    handleCloseDelete,
    handleDelete,
    openDelete,
    handleUpdateAllClick,
    handleUpdateClick,
    handleOperationState,
    operationState,
    handleClose,
    open,
    setPage,
    page,
    dataCount,
    loading,
    rows,
    haveNegotiationSummary,
    handleOpenNegotiationSummary,
    handleMenuClick,
    menuState,
    handleCloseMenu,
    UpdateStatusOperation,
    DetailPreOperation,
    EditPreOperation,
    DeletePreOperation,
    columns
})=>{

    const tableWrapperSx = {
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};

const selectSx = {
  color: "#333333",
  "&:before": {
    borderBottom: "1px solid #333333",
  },
  "&:after": {
    borderBottom: "2px solid #488B8F",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderBottom: "2px solid #488B8F",
  },
};

const SortIcon = () => (
  <Typography fontFamily="icomoon" fontSize="0.7rem">
    &#xe908;
  </Typography>
);

const TableSkeleton = ({ rows = 15, columns = 9 }) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #e0e0e0',
          px: 2,
          py: 1,
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            height={40}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            px: 2,
            py: 1,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height={55}
              sx={{
                mx: 1,
                borderRadius: '4px',
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};





  
    return (

        

<>
  {loading ? (
  <TableSkeleton rows={8} columns={columns.length} />
) : (

      <Box sx={{ ...tableWrapperSx }}>
      <CustomDataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          
          sx={{
            border: '1px solid #e0e0e0', // Borde exterior
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #f0f0f0', // Bordes verticales entre celdas
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5', // Fondo del encabezado
              borderBottom: '2px solid #e0e0e0', // Borde inferior del encabezado
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0', // Bordes entre columnas
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(even)': {
                backgroundColor: '#fafafa', // Color filas pares
              },
              '&:hover': {
        overflow: 'visible', // Muestra todo el contenido al hacer hover
        zIndex: 1,
        position: 'relative'
      },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0', // Borde superior del footer
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto', // Oculta el scroll horizontal si no es necesario
            },
            filter: loading ? 'blur(2px)' : 'none', // Efecto de desenfoque
          transition: 'filter 0.3s ease-out' // Transición suave
          }}
          components={{
            ColumnSortedAscendingIcon: SortIcon,
            ColumnSortedDescendingIcon: SortIcon,
            NoRowsOverlay: () => (
              <Typography
                fontSize="0.9rem"
                fontWeight="600"
                color="#488B8F"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: '1px dashed #e0e0e0', // Borde para el área vacía
                  margin: '0 16px 16px 16px',
                  borderRadius: '4px',
                  
                }}
              >
                No hay pre-operaciones registradas
              </Typography>
            ),

            Pagination: () => (
              <Box
                container
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
                  {page * 15 - 14} - {page * 15} de {dataCount}{" "}
                </Typography>
                <Box
                  container
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.2rem"
                    marginRight="0.3rem"
                    marginLeft="0.5rem"
                    sx={{
                      cursor: "pointer",
                      transform: "rotate(180deg)",
                      color: "#63595C",
                    }}
                    onClick={() => {
                      if (page > 1) {
                       
                        setPage(page - 1);
                  
                      }
                    }}
                  >
                    &#xe91f;
                  </Typography>
                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.2rem"
                    marginRight="0.3rem"
                    marginLeft="0.5rem"
                    sx={{
                      cursor: "pointer",

                      color: "#63595C",
                    }}
                    onClick={() => {
                      if (page < dataCount / 15) {
                       
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
          componentsProps={{
            pagination: {
              color: "#5EA3A3",
            },
          }}
        />
        
      </Box>

       )}   
      <TitleModal
        open={open[0]}
        handleClose={handleClose}
        container
        Sx={{
          width: "25%",
          height: "30%",
        }}
        title={"Actualizar estado"}
      >
        <Box display="flex" flexDirection="column" mt={3} sx={{ ...scrollSx }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel
              sx={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#488B8F",
                "&.Mui-focused": {
                  color: "#488B8F",
                },
              }}
              id="demo-simple-select-label"
            >
              Estado
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="operationStatus"
              value={operationState}
              label="Estado"
              onChange={handleOperationState}
              sx={{ ...selectSx }}
            >
              <MenuItem value={1}>Aprobada</MenuItem>
              <MenuItem value={2}>Rechazada</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="center">
            <MuiButton
              variant="standard"
              onClick={handleUpdateClick}
              sx={{
                mb: 2,
                boxShadow: "none",
                borderRadius: "4px",
              }}
            >
              <Typography fontSize="80%" fontWeight="bold">
                Actualizar
              </Typography>
              <Typography
                fontFamily="icomoon"
                sx={{
                  color: "#fff",
                  ml: 2,
                  fontSize: "medium",
                }}
              >
                &#xe91f;
              </Typography>
            </MuiButton>
            <MuiButton
              variant="standard"
              onClick={handleUpdateAllClick}
              sx={{
                mb: 2,
                ml: 2,
                boxShadow: "none",
                borderRadius: "4px",
              }}
            >
              <Typography fontSize="80%" fontWeight="bold">
                Actualizar todos
              </Typography>
            </MuiButton>
          </Box>
        </Box>
      </TitleModal>
      <Modal open={openDelete[0]} handleClose={handleCloseDelete}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
          >
            ¿Estás seguro que deseas la operación?
          </Typography>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleCloseDelete}>
              Volver
            </GreenButtonModal>
            <RedButtonModal
              sx={{
                ml: 2,
              }}
              onClick={() => handleDelete(openDelete[1])}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>
</>

    )
}