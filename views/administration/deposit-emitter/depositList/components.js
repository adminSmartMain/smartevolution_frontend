import { useEffect, useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, Typography } from "@mui/material";

/* Modal imports*/
import Modal from "@components/modals/modal";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import CustomDataGrid from "@styles/tables";

import { DeleteDepositById, GetDepositList, GetRefundReceipt } from "./queries";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import moment from "moment";

import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Skeleton from '@mui/material/Skeleton';
import {
  Home as HomeIcon,

} from "@mui/icons-material";
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
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};

export const DepositListComponent = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState([false, "", null]);
  const handleOpen = (deposit, id) => setOpen([true, deposit, id]);
  const handleClose = () => setOpen([false, "", null]);
  const handleDelete = (id) => {
    DeleteDepositById(id);
    setOpen([false, "", null]);
    setTimeout(() => {
      setDeposit(deposit.filter((deposit) => deposit.id !== id));
    }, 1000);
  };

  const columns = [
    {
      field: "date",
      headerName: "FECHA",
      width: 150,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "edId",
      headerName: "ID",
      width: 100,
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
      field: "client",
      headerName: "EMISOR",
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
      field: "amount",
      headerName: "MONTO",
      width: 150,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },

    //Iconos de acciones

    {
      field: "Ver giro",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/administration/deposit-emitter?preview=${params.row.id}`}
          >
            <CustomTooltip
              title="Ver giro"
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
      field: "Editar giro",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/administration/deposit-emitter?modify=${params.row.id}`}
          >
            <CustomTooltip
              title="Editar giro"
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
                //Delete deposit by id

                onClick={() => {
                  handleOpen(params.row.id, params.row.id);
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>
            <Modal open={open[0]} handleClose={handleClose}>
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
                  ¿Estás seguro que deseas este giro
                </Typography>

                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  mt={2}
                >
                  de los giros-emisor?
                </Typography>

                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  mt={4}
                >
                  <GreenButtonModal onClick={handleClose}>
                    Volver
                  </GreenButtonModal>
                  <RedButtonModal
                    sx={{
                      ml: 2,
                    }}
                    onClick={() => handleDelete(open[2])}
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
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (args) => GetDepositList({ page, ...args }),
    init: true,
  });

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);
  const [deposit, setDeposit] = useState([]);

  useEffect(() => {
    const deposit =
      data?.results?.map((deposit) => {
        const clientName = deposit.client.first_name
          ? `${deposit.client.first_name} ${deposit.client.last_name}`
          : deposit.client.social_reason;

        return {
          id: deposit.id,
          edId: deposit.edId,
          beneficiary: deposit.beneficiary,
          amount: deposit.amount,
          client: clientName,
          date: deposit.date,
          Status: deposit.state,
        };
      }) || [];
    setDeposit(deposit);
  }, [data]);

  return (
    <>
<Box sx={{ ...sectionTitleContainerSx }}>

   <Box className="view-header">
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
                    sx={{ ml: 1, mt: 1 }}
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
             Consulta de giro-emisor
                    </Typography>
                  </Breadcrumbs>
            
                    </Typography>
   

      
   </Box>
    <Link href="/administration/deposit-emitter?register" underline="none">
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
              Registrar nuevo giro-emisor
            </Typography>

            <Typography
              fontFamily="icomoon"
              fontSize="0.9rem"
              color="#63595C"
              marginLeft="0.1rem"
            >
              &#xe927;
            </Typography>
          </Button>
        </Link>

</Box>

      
 
      <Box container display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar por</InputTitles>
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
            onClick={() => {
              setFilter(filter === "emitter" ? "" : "emitter");
            }}
            className="button-header-preop-title"
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "emitter" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Emisor
            </Typography>
          </Button>
          <Button
            variant="standard"
            size="medium"
            onClick={() => {
              setFilter(filter === "id" ? "" : "id");
            }}
            className="button-header-preop-title"
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
            fetch
            className="button-header-preop-title"
            onClick={() => {
              setFilter(filter === "date" ? "" : "date");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "1rem",
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
  <TableSkeleton rows={8} columns={15} />
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
          rows={deposit}
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
                No hay giros de emisores registrados
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
    </>
  );
};
