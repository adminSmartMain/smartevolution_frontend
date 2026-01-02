import { useEffect, useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Button, Fade, IconButton, Typography,CircularProgress, } from "@mui/material";
import { Box } from "@mui/system";

import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";
import {
  Home as HomeIcon,

} from "@mui/icons-material";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import { DeleteRefund, GetRefund, GetRefundReceiptPDF } from "./queries";
import Skeleton from '@mui/material/Skeleton';
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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

export const RefundListC = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const columns = [
    {
      field: "date",
      headerName: "FECHA",
      width: 120,
      renderCell: (params) => (
        <CustomTooltip
          title={params.value}
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
          <InputTitles>{<DateFormat date={params.value} />}</InputTitles>
        </CustomTooltip>
      ),
    },
    {
      field: "rId",
      headerName: "ID",
      width: 50,
      renderCell: (params) => <InputTitles>{params.value}</InputTitles>,
    },
    {
      field: "client",
      headerName: "INVERSIONISTA",
      width: 155,
      renderCell: (params) => (
        <CustomTooltip
          title={params.value}
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
      ),
    },
    {
      field: "amount",
      headerName: "MONTO",
      width: 120,
      renderCell: (params) => (
        <CustomTooltip
          title={params.value}
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
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        </CustomTooltip>
      ),
    },
    {
      field: "Imprimir resumen",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Imprimir resumen"
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
          >
            <IconButton onClick={() => handleEgressClick(params.row.id)}>
              <i
                className="fa-regular fa-print"
                style={{
                  fontSize: "1.1rem",
                  color: "#999999",
                  borderRadius: "5px",

                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                }}
              ></i>
            </IconButton>
          </CustomTooltip>
        );
      },
    },

    {
      field: "Ver reintegro",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/administration/refund?preview&id=${params.row.id}`}>
            <CustomTooltip
              title="Ver reintegro"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -15],
                    },
                  },
                ],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                  cursor: "pointer",
                }}
              >
                &#xe922;
              </Typography>
            </CustomTooltip>
          </Link>
        );
      },
    },

    {
      field: "Editar reintegro",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/administration/refund?modify&id=${params.row.id}`}>
            <CustomTooltip
              title="Editar reintegro"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -15],
                    },
                  },
                ],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                  cursor: "pointer",
                }}
              >
                &#xe900;
              </Typography>
            </CustomTooltip>
          </Link>
        );
      },
    },

    {
      field: "Eliminar",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -15],
                    },
                  },
                ],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                  cursor: "pointer",
                }}
                //Delete customer by id

                onClick={() => handleOpenDelete(params.row.id)}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>
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
                  ¿Estás seguro que deseas eliminar
                </Typography>

                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  mt={2}
                >
                  este reintegro?
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
        );
      },
    },
  ];

  // Queries
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (args) => GetRefund({ page, ...args }),
    init: true,
  });

  const {
    fetch: fetchRefundReceipt,
    loading: loadingRefundReceipt,
    error: errorRefundReceipt,
    data: dataRefundReceipt,
  } = useFetch({
    service: GetRefundReceiptPDF,
    init: false,
  });

  const {
    fetch: DeleteRefundById,
    loading: loadingDelete,
    error: errorDelete,
    data: dataDelete,
  } = useFetch({
    service: DeleteRefund,
    init: false,
  });

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [refund, setRefund] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openDelete, setOpenDelete] = useState([false, null]);
  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);
  const handleDelete = (id) => {
    DeleteRefundById(id);
    setOpenDelete([false, null]);
    setTimeout(() => {
      setRefund(refund.filter((refund) => refund.id !== id));
    }, 1000);
  };

  useEffect(() => {
    const refund =
      data?.results?.map((item) => {
        return {
          ...item,
          account: item?.account?.account_number,
          accountType: item?.accountType?.description,
          bank: item?.bank?.description,
          client: item?.client?.social_reason
            ? item?.client?.social_reason
            : `${item?.client?.first_name} ${item.client.last_name}`,
        };
      }) || [];
    setRefund(refund);
  }, [data]);

  const handleEgressClick = (id) => {
    fetchRefundReceipt(id);
    handleOpen();
  };

  console.log(dataRefundReceipt)

  return (
    <>

     
      <Box
        container
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
            <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ ml: 1, mb: 0 }}
      >
          <Link href="/dashboard" underline="none">
                      <a>
                         <HomeIcon
                                                fontSize="large" 
                                                sx={{ 
                                                  color: '#488b8f',
                                                  opacity: 0.8, // Ajusta la transparencia (0.8 = 80% visible)
                                                  strokeWidth: 1, // Grosor del contorno
                                                }} 
                                              />
        
                      </a>
        
                    </Link>
        <Link
          underline="hover"
          color="#5EA3A3"
          href="/administration"
          sx={{ fontSize: "1.3rem" }}
        >
     <Typography component="h1" className="view-title">

Administración
             
          </Typography>
         
        </Link>

     <Typography
                   component="h1" className="view-title">
  Consulta de Reintegros
        </Typography>
      </Breadcrumbs>

        </Typography>
        <Link href="/administration/refund?register" underline="none">
          <Button
            variant="standard"
            color="primary"
            size="large"
            className="button-header-preop-title"
            sx={{
              height: "2.6rem",
              backgroundColor: "transparent",
              border: "1.4px solid #63595C",
              borderRadius: "4px",
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="60%"
              fontWeight="bold"
              color="#63595C"
            >
              Registrar nuevo Reintegro
            </Typography>

            <Typography
              fontFamily="icomoon"
              fontSize="1.2rem"
              color="#63595C"
              marginLeft="0.1rem"
            >
              &#xe927;
            </Typography>
          </Button>
        </Link>
      </Box>
      <Box container display="flex" flexDirection="column" mt={3}>
     
        <Box
          container
          display="flex"
          flexDirection="row"
          mt={2}
          alignItems="center"
        >
          <Button
            variant="standard"
            size="medium"
            className="button-header-preop-title"
            onClick={() => {
              setFilter(filter === "client" ? "" : "client");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "client" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Inversionista
            </Typography>
          </Button>
          <Button
            variant="standard"
            size="medium"
            className="button-header-preop-title"
            onClick={() => {
              setFilter(filter === "id" ? "" : "id");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "id" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Nº ID
            </Typography>
          </Button>

          <Button
            variant="standard"
            size="medium"
            className="button-header-preop-title"
            onClick={() => {
              setFilter(filter === "date" ? "" : "date");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "date" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Fecha
            </Typography>
          </Button>

          <BaseField
            placeholder="Escriba su respuesta aquí"
            value={query}
            onChange={(evt) => {
              setQuery(evt.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                fetch({
                  page: 1,
                  ...(Boolean(filter) && {
                    [filter]: query,
                  }),
                });
                setPage(1);
              }
            }}
            InputProps={{
              endAdornment: <SearchOutlined sx={{ color: "#5EA3A3" }} />,
            }}
          />
        </Box>
      </Box>

         {loading ? (
  <TableSkeleton rows={8} columns={columns.length} />
) : (
      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <CustomDataGrid
          rows={refund}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
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

            NoRowsOverlay: () => (
              <Typography
                fontSize="0.9rem"
                fontWeight="600"
                color="#488B8F"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                No hay reintegros
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
                    marginRight="0.3rem"
                    marginLeft="0.5rem"
                    sx={{
                      cursor: "pointer",

                      color: "#63595C",
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
          componentsProps={{
            pagination: {
              color: "#5EA3A3",
            },
          }}
          loading={loading}
        />
      </Box>
      )}   
      <TitleModal
        open={open}
        handleClose={handleClose}
        containerSx={{
          width: "70%",
          height: "60%",
        }}
        title={"Comprobante de egreso"}
      >
        <Box
          display="flex"
          flexDirection="column"
          mt={5}
          sx={{ ...scrollSx }}
          height="50vh"
          alignItems="center"
        >
          {loadingRefundReceipt&& (
                        <CircularProgress style={{ color: "#488B8F" }} />
                      )}
          {dataRefundReceipt && dataRefundReceipt?.pdf && (
            <iframe
              src={`data:application/pdf;base64,${dataRefundReceipt?.pdf}`}
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </TitleModal>
    </>
  );
};
