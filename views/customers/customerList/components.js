import { useEffect, useState } from "react";
import {
  Home as HomeIcon,

} from "@mui/icons-material";
import Image from "next/image";
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

import { DeleteClientById, GetClientList } from "./queries";

import moment from "moment";



const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};

export const ClientListComponent = () => {
  const [open, setOpen] = useState([false, "", null]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);

  const handleOpen = (customer, id) => setOpen([true, customer, id]);
  const handleClose = () => setOpen([false, "", null]);
  const handleDelete = (id) => {
    DeleteClientById(id);
    setOpen([false, "", null]);
    setTimeout(() => {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }, 1000);
  };

  const columns = [
    {
      field: "DocumentNumber",
      headerName: "NIT/CC",
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
      width: 320,
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
      field: "DateCreated",
      headerName: "FECHA",
      width: 100,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "FinancialProfile",
      headerName: "PERFIL FINANCIERO",
      width: 160,
      renderCell: (params) => {
        return params.value === true ? (
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
              Cargado
            </Typography>
            <Typography fontFamily="icomoon" fontSize="1.5rem" color="#488B8F">
              &#xe906;
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
              Sin cargar
            </Typography>
            <Typography fontFamily="icomoon" fontSize="1.5rem" color="#E66431">
              &#xe907;
            </Typography>
          </>
        );
      },
    },

    {
      field: "RiskProfile",
      headerName: "PERFIL DE RIESGO",
      width: 160,

      renderCell: (params) => {
        return params.value ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            alignItems="center"
            padding="3% 8%"
            width="100%"
            borderRadius="4px"
            backgroundColor="#488B8F"
          >
            <Image
              src="/assets/Icon - Perfil de riesgo - Alto.svg"
              width={30}
              height={30}
            />
            <Typography
              fontSize="80%"
              width="100%"
              fontWeight="bold"
              color="#FFFFFF"
              textTransform="uppercase"
            >
              Cargado
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            alignItems="center"
            padding="3% 8%"
            borderRadius="4px"
            width="100%"
            backgroundColor="#488B8F"
          >
            <Image
              src="/assets/Icon - Perfil de riesgo - Desconocido.svg"
              width={30}
              height={30}
            />
            <Typography
              fontSize="80%"
              width="100%"
              fontWeight="bold"
              color="#FFFFFF"
              textTransform="uppercase"
            >
              Sin Cargar
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "state",
      headerName: "ESTADO",
      width: 160,
      renderCell: (params) => {
        return params.value === true ? (
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
      field: "Perfil Financiero Cliente",
      headerName: "",
      width: 20,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/financialProfile/financialStatement/?id=${params.row.id}`}
          >
            <CustomTooltip
              title="Perfil Financiero Cliente"
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
                color="#488B8F"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                  },
                  cursor: "pointer",
                }}
              >
                &#xe904;
              </Typography>
            </CustomTooltip>
          </Link>
        );
      },
    },
    {
      field: "Perfil de riesgo Cliente",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/riskProfile?id=${params.row.id}`}>
            <CustomTooltip
              title="Perfil de Riesgo Cliente"
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
                color="#488B8F"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                  },
                  cursor: "pointer",
                }}
              >
                &#xe903;
              </Typography>
            </CustomTooltip>
          </Link>
        );
      },
    },

    {
      field: "Ver cliente",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/customers?preview=${params.row.id}`}>
            <CustomTooltip
              title="Ver cliente"
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
      field: "Editar cliente",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/customers?modify=${params.row.id}`}>
            <CustomTooltip
              title="Editar cliente"
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

                onClick={() => {
                  handleOpen(params.row.Customer, params.row.id);
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
                  de los clientes?
                </Typography>
                <Typography
                  letterSpacing={0}
                  fontSize="0.8vw"
                  fontWeight="medium"
                  color="#333333"
                  mt={3.5}
                >
                  Si eliminas a este cliente, no podrás recuperarlo.
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
    service: (args) => GetClientList({ page, ...args }),
    init: true,
  });

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);

  useEffect(() => {
    const customer =
      data?.results?.map((customer) => ({
        id: customer.id,
        DocumentNumber: customer.document_number,
        Customer: `${customer.first_name ?? ""} ${customer.last_name ?? ""} ${
          customer.social_reason ?? ""
        }`,
        state: customer.state,
        EnteredBy: `${customer.entered_by.first_name} ${customer.entered_by.last_name}`,
        DateCreated: customer.created_at,
        FinancialProfile: customer.financial_profile,
        RiskProfile: customer.riskProfile,
      })) || [];

    setCustomers(customer);
  }, [data]);

  return (
    <>
     
      <Box sx={{ ...sectionTitleContainerSx }}>

            <Box className="view-header">
                
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
                      <Typography className="view-title">
                      - Consulta de Clientes
                    </Typography>

                    </Box>
                      <Link href="/customers?register" underline="none">
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
                            Registrar nuevo cliente
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

                      
                      <Link href="/customers/accountList" underline="none">
                        <Button
                          variant="standard"
                          color="primary"
                          size="large"
                          sx={{
                            height: "2.6rem",
                            backgroundColor: "transparent",
                            border: "1.4px solid #63595C",
                            borderRadius: "4px",
                            ml: "0.5rem",
                          }}
                        >
                          <Typography
                            letterSpacing={0}
                            fontSize="80%"
                            fontWeight="bold"
                            color="#63595C"
                          >
                            Consulta y gestión de cuentas
                          </Typography>

                          <Typography
                            fontFamily="icomoon"
                            fontSize="1.6rem"
                            color="#63595C"
                            marginLeft="0.9rem"
                          >
                            &#xe905;
                          </Typography>
                        </Button>
                      </Link>


                   
          
      </Box>
     

      <Box container display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar cliente</InputTitles>
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
              setFilter(filter === "client" ? "" : "client");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "client" && { borderWidth: 3 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Cliente
            </Typography>
          </Button>
          <Button
            variant="standard"
            size="medium"
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "document" && { borderWidth: 3 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
              onClick={() => {
                setFilter(filter === "document" ? "" : "document");
              }}
            >
              Nº ID Cliente
            </Typography>
          </Button>

          <BaseField
            placeholder="Escriba su respuesta aquí"
            value={query}
            onChange={(evt) => {
              setQuery(evt.target.value);
            }}
            onKeyPress={(event) => {
              fetch({
                page: 1,
                ...(Boolean(filter) && { [filter]: query }),
              });
              setPage(1);
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
          rows={customers}
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
