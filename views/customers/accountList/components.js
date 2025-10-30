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
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import CustomDataGrid from "@styles/tables";

import {
  DeleteAccountById,
  GetAccountList,
  GetAccountListByQuery,
} from "./queries";

let dataCount;
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};

export const AccountListComponent = () => {
  const [open, setOpen] = useState([false, "", null]);
  const [filter, setFilter] = useState("client");
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState([]);
  const [page, setPage] = useState(1);
  const handleOpen = (customer, id) => setOpen([true, customer, id]);
  const handleClose = () => setOpen([false, "", null]);
  const handleDelete = (id) => {
    setCustomer(customer.filter((item) => item.id !== id));
    DeleteAccountById(id);
    setOpen([false, "", null]);
  };

  const columns = [
    {
      field: "DocumentNumber",
      headerName: "NIT/CC",
      width: 140,
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
      width: 300,
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
      field: "AccountType",
      headerName: "TIPO DE CUENTA",
      width: 140,
      renderCell: (params) => {
        return (
          <Typography
            fontSize="80%"
            width="100%"
            fontWeight="bold"
            color="#63595C"
            textAlign="center"
            border="1.4px solid #63595C"
            backgroundColor="transparent"
            textTransform="uppercase"
            padding="3% 8%"
            borderRadius="4px"
          >
            {params.value == true ? "primaria" : "secundaria"}
          </Typography>
        );
      },
    },
    {
      field: "AccountNumber",
      headerName: "# CUENTA",
      width: 130,
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },
    {
      field: "Status",
      headerName: "ESTADO",
      width: 130,
      renderCell: (params) => {
        return params.value === true ? (
          <>
            <Typography
              fontSize="80%"
              width="100%"
              fontWeight="bold"
              color="#488B8F"
              textAlign="center"
              border="1.4px solid #63595C"
              backgroundColor="#B5D1C9"
              textTransform="uppercase"
              padding="3% 8%"
              borderRadius="4px"
            >
              Activa
            </Typography>
          </>
        ) : (
          <>
            <Typography
              fontSize="80%"
              width="100%"
              fontWeight="bold"
              color="#E66431"
              textAlign="center"
              border="1.4px solid #E66431"
              backgroundColor="#E6643133"
              textTransform="uppercase"
              padding="3% 8%"
              borderRadius="4px"
            >
              Inactiva
            </Typography>
          </>
        );
      },
    },

    //Iconos de acciones
    {
      field: "Ver cuenta",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/customers/account?preview=${params.row.id}`}>
            <CustomTooltip
              title="Ver cuenta"
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
          <Link href={`account?modify=${params.row.id}`}>
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
                  ¿Estás seguro que deseas eliminar la cuenta del cliente?
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
                  Con número de cuenta:
                </Typography>
                <Typography
                  letterSpacing={0}
                  fontSize="0.8vw"
                  fontWeight="medium"
                  color="#333333"
                  mt={3.5}
                >
                  {params.row.AccountNumber}
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
    service: (args) => GetAccountList({ page, ...args }),
    init: true,
  });

  useEffect(() => {
    if (data) {
      let Customers = [];
      dataCount = data.count;
      data.results.map((customer) => {
        Customers.push({
          id: customer.id,
          DocumentNumber: customer.client.document,
          Customer: customer.client.name,
          AccountType: customer.primary,
          AccountNumber: customer.account_number,
          Status: customer.state,
        });
      });
      setCustomer(Customers);
    }
  }, [data, loading, error]);

  const {
    fetch: fetch2,
    loading: loading2,
    error: error2,
    data: data2,
  } = useFetch({
    service: GetAccountListByQuery,
    init: false,
  });

  useEffect(() => {
    if (data2) {
      let Customers = [];
      let pageSizeForPagination = data2.count;
      data2.results.map((customer) => {
        Customers.push({
          id: customer.id,
          DocumentNumber: customer.client.document,
          Customer: customer.client.name,
          AccountType: customer.primary,
          AccountNumber: customer.account_number,
          Status: customer.state,
        });
      });
      setCustomer(Customers);
    }
  }, [data2, loading2, error2]);

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

                      <Typography
                          className="view-title"
                            >
                        - Consulta y gestión de cuentas
                      </Typography>

      </Box>

       <Link href="account?register" underline="none">
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
                Registrar nueva cuenta
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
      <Box height="100%">
        <Box container display="flex" flexDirection="column" mt={3}>
          <InputTitles>Buscar por cliente</InputTitles>
          <Box>
            <BaseField
              placeholder="Filtro por nombre"
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
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        <Box
          marginTop={4}
          display="flex"
          flexDirection="row"
          width="100%"
          sx={{
            height: "80%",
            ["@media (max-height:864px)"]: {
              height: "70%",
            },
          }}
        >
          <CustomDataGrid
            rows={customer}
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
                  <Typography
                    fontSize="0.8rem"
                    fontWeight="600"
                    color="#5EA3A3"
                  >
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
      </Box>
    </>
  );
};
