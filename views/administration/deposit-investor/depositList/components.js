import { useEffect, useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, IconButton, Typography } from "@mui/material";

import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import { DeleteDepositById, GetDepositList, GetRefundReceipt } from "./queries";

import moment from "moment";

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
      field: "dId",
      headerName: "NRO DE GIRO",
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
          <InputTitles>{params.value}</InputTitles>
        </CustomTooltip>
      ),
    },
    {
      field: "broker",
      headerName: "INVERSIONISTA",
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
      field: "Imprimir recibo",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Imprimir recibo"
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
            <IconButton onClick={() => handleRefundReceiptClick(params.row.id)}>
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
      field: "Ver giro",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/administration/deposit-investor?preview=${params.row.id}`}
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
            href={`/administration/deposit-investor/?modify=${params.row.id}`}
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
      data?.results?.map((deposit) => ({
        id: deposit.id,
        dId: deposit.dId,
        broker: deposit.client.first_name
          ? deposit.client.first_name + " " + deposit.client.last_name
          : deposit.client.social_reason,
        amount: deposit.amount,
        date: deposit.date,
        Status: deposit.state,
      })) || [];
    setDeposit(deposit);
  }, [data]);

  const [openPDF, setOpenPDF] = useState(false);
  const handleOpenPDF = () => {
    setOpenPDF(true);
  };
  const handleClosePDF = () => {
    setOpenPDF(false);
  };

  const {
    fetch: fetchRefundReceipt,
    loading: loadingRefundReceipt,
    error: errorRefundReceipt,
    data: dataRefundReceipt,
  } = useFetch({ service: GetRefundReceipt, init: false });

  const handleRefundReceiptClick = (id) => {
    fetchRefundReceipt(id);
    handleOpenPDF();
  };

  return (
    <>
      <BackButton path="/administration" />
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
          Consulta de giro-inversionista
        </Typography>
        <Link href="/administration/deposit-investor?register" underline="none">
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
              Registrar nuevo giro-inversionista
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
              setFilter(filter === "investor" ? "" : "investor");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "investor" && { borderWidth: 2 }),
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
                No hay giros de inversionistas registrados
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
      <TitleModal
        open={openPDF}
        handleClose={handleClosePDF}
        containerSx={{
          width: "70%",
          height: "60%",
        }}
        title={"Recibo de caja (PDF)"}
      >
        <Box
          display="flex"
          flexDirection="column"
          mt={5}
          sx={{ ...scrollSx }}
          height="50vh"
          alignItems="center"
        >
          {dataRefundReceipt && dataRefundReceipt?.data?.pdf && (
            <iframe
              src={`data:application/pdf;base64,${dataRefundReceipt?.data?.pdf}`}
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </TitleModal>
    </>
  );
};
