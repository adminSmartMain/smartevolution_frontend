import { useEffect, useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, Typography } from "@mui/material";

import Modal from "@components/modals/modal";

import DateFormat from "@formats/DateFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import CustomDataGrid from "@styles/tables";

import {
  DeleteBrokerById,
  GetBrokerList,
  GetBrokerListByQuery,
} from "./queries";
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Skeleton from '@mui/material/Skeleton';
import {
  Home as HomeIcon,

} from "@mui/icons-material";
let dataCount;

export const BrokerListComponent = () => {
  const [open, setOpen] = useState([false, "", null]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const handleOpen = (broker, id) => setOpen([true, broker, id]);
  const handleClose = () => setOpen([false, "", null]);
  const handleDelete = (id) => {
    DeleteBrokerById(id);
    setOpen([false, "", null]);
    setTimeout(() => {
      setBroker(broker.filter((broker) => broker.id !== id));
    }, 1000);
  };

  const columns = [
    {
      field: "DocumentNumber",
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
      field: "Broker",
      headerName: "CORREDOR",
      width: 160,
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
      width: 160,
      renderCell: (params) => {
        return params.value ? (
          <>
            <Typography
              fontSize="80%"
              width="80%"
              fontWeight="bold"
              color="#63595C"
              textAlign="center"
              border="1.4px solid #63595C"
              backgroundColor="transparent"
              textTransform="uppercase"
              padding="3% 8%"
              borderRadius="4px"
            >
              Activo
            </Typography>
          </>
        ) : (
          <>
            <Typography
              fontSize="80%"
              width="80%"
              fontWeight="bold"
              color="#E66431"
              textAlign="center"
              border="1.4px solid #E66431"
              backgroundColor="#E6643133"
              textTransform="uppercase"
              padding="3% 8%"
              borderRadius="4px"
            >
              Inactivo
            </Typography>
          </>
        );
      },
    },
    {
      field: "DateCreated",
      headerName: "FECHA",
      width: 100,
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },

    //Iconos de acciones
    {
      field: "Ver corredor",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/brokers?preview=${params.row.id}`}>
            <CustomTooltip
              title="Ver corredor"
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
      field: "Editar corredor",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/brokers?modify=${params.row.id}`}>
            <CustomTooltip
              title="Editar corredor"
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
                //Delete broker by id
                onClick={() => handleOpen(params.row.Broker, params.row.id)}
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
                  ¿Estás seguro que deseas eliminar a
                </Typography>
                <InputTitles mt={2} sx={{ fontSize: "1.1vw" }}>
                  {open[1]}
                </InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  mt={2}
                >
                  de los corredores?
                </Typography>
                <Typography
                  letterSpacing={0}
                  fontSize="0.8vw"
                  fontWeight="medium"
                  color="#333333"
                  mt={3.5}
                >
                  Si eliminas a este corredor, no podrás recuperarlo.
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
    service: (args) => GetBrokerList({ page, ...args }),
    init: true,
  });

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);
  const [broker, setBroker] = useState([]);

  useEffect(() => {
    const broker =
      data?.results?.map((broker) => ({
        id: broker.id,
        DocumentNumber: broker.document_number,
        Broker: `${broker.first_name ?? ""} ${broker.last_name ?? ""} ${
          broker.social_reason ?? ""
        }`,
        Status: broker.state,
        DateCreated: <DateFormat date={broker.created_at} />,
      })) || [];
    setBroker(broker);
  }, [data]);

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
                    
                      Consulta de Corredores
                                 
                              </Typography>
                             
                            </Link>
                    
                       
                          </Breadcrumbs>
                    
                            </Typography>
    
        <Link href="/brokers?register" underline="none">
          <Button
            variant="standard"
            color="primary"
            size="large"
            sx={{
              height: "2.6rem",
              backgroundColor: "transparent",
              border: "1.4px solid #63595C",
              borderRadius: "4px",
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="80%"
              fontWeight="bold"
              color="#63595C"
            >
              Registrar nuevo corredor
            </Typography>

            <Typography
              fontFamily="icomoon"
              fontSize="1.2rem"
              color="#63595C"
              marginLeft="0.9rem"
            >
              &#xe927;
            </Typography>
          </Button>
        </Link>
      </Box>
      <Box container display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar corredor</InputTitles>
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
              setFilter(filter === "broker" ? "" : "broker");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "broker" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Corredor
            </Typography>
          </Button>
          <Button
            variant="standard"
            size="medium"
            onClick={() => {
              setFilter(filter === "document" ? "" : "document");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "document" && { borderWidth: 2 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Nº ID Corredor
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
                fetch({ page: 1, ...(Boolean(filter) && { [filter]: query }) });
                setPage(1);
              }
            }}
            InputProps={{
              endAdornment: <SearchOutlined sx={{ color: "#5EA3A3" }} />,
            }}
          />
        </Box>
      </Box>
      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <CustomDataGrid
          rows={broker}
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
    </>
  );
};
