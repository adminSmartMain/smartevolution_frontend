import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, Typography } from "@mui/material";

import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";

import DateFormat from "@formats/DateFormat";

import { useFetch } from "@hooks/useFetch";

import downloadFile from "@lib/downloadFile";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import LoadingCircle from "@styles/loading";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import {
  DeleteBillById,
  GetBillEvents,
  GetBillList,
  GetBillListByQuery,
} from "./queries";

import FileSaver, { saveAs } from "file-saver";
import moment from "moment";

//comentario de prueba
export const BillsComponents = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
 const [openWindow, setOpenWindow] = useState(null); 
 const handleOpenRegisterOperation = () => {
  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco (la trae al frente)
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos y guardamos la referencia
    const newWindow = window.open("/bills/createBill", "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};



  const handleDownload = (url, fileName) => {
    // Download XML from url
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        FileSaver.saveAs(blob, fileName);
      });
  };

  const addLineBreaks = (text, lineLength) => {
    const regex = new RegExp(`.{1,${lineLength}}`, "g");
    if (text) {
      return text.match(regex).join("\n");
    }
  };

  const columns = [
    {
      field: "billId",
      headerName: "Nro Factura",
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
      field: "Emitter",
      headerName: "EMISOR",
      width: 180,
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
      field: "Payer",
      headerName: "PAGADOR",
      width: 180,
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
      field: "Subtotal",
      headerName: "SUBTOTAL",
      width: 130,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "Total",
      headerName: "TOTAL",
      width: 130,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "payedBalance",
      headerName: "VALOR NEGOCIADO",
      width: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "currentBalance",
      headerName: "VALOR DISPONIBLE",
      width: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "associatedOperation",
      headerName: "OPERACION ASOCIADA",
      width: 150,
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
            {params.value !== null ? (
              <InputTitles>{params.value}</InputTitles>
            ) : (
              <InputTitles>NO ASOCIADA</InputTitles>
            )}
          </CustomTooltip>
        );
      },
    },
    {
      field: "typeBill",
      headerName: "TIPO DE FACTURA",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography
            fontSize="80%"
            width="100%"
            fontWeight="bold"
            color="white"
            backgroundColor="#488B8F"
            textTransform="uppercase"
            textAlign="center"
            padding="5.5% 8%"
            border="1.4px solid #B5D1C9"
            borderRadius="4px"
          >
            {params.value}
          </Typography>
        );
      },
      valueGetter: (params) => {
        switch (params.value) {
          case "a7c70741-8c1a-4485-8ed4-5297e54a978a":
            return "FV-TV";
          case "29113618-6ab8-4633-aa8e-b3d6f242e8a4":
            return "ENDOSADO";
          default:
            return "FV";
        }
      },
    },
    {
      field: "DateBill",
      headerName: "FECHA CREACIÓN",
      width: 160,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "DatePayment",
      headerName: "FECHA EXPIRACIÓN",
      width: 160,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },

    //Iconos de acciones
    {
      field: "Ver factura",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CustomTooltip
              title="Ver factura"
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
                onClick={() => handleOpenEvents(params.row.id)}
              >
                &#xe922;
              </Typography>
            </CustomTooltip>
            <TitleModal
              open={openEvents[0]}
              handleClose={handleCloseEvents}
              containerSx={{
                width: "50%",
                height: "60%",
              }}
              title={"Datos y eventos de la factura"}
            >
              {!loadingGetBillEvents ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  mt={5}
                  sx={{ ...scrollSx }}
                  height="50vh"
                  alignItems="center"
                >
                  <Typography
                    letterSpacing={0}
                    fontSize="1rem"
                    fontWeight="medium"
                    color="#63595C"
                    width={"100%"}
                    pb={2}
                    borderBottom="1px solid #B5D1C9"
                  >
                    <b>ID de la factura:</b> {dataGetBillEvents?.data?.billId}{" "}
                    <br />
                    <b>Nombre del emisor:</b>{" "}
                    {dataGetBillEvents?.data?.emitterName} <br />
                    <b>ID del emisor:</b> {dataGetBillEvents?.data?.emitterId}{" "}
                    <br />
                    <b>Nombre del pagador:</b>{" "}
                    {dataGetBillEvents?.data?.payerName} <br />
                    <b>ID del pagador:</b> {dataGetBillEvents?.data?.payerId}{" "}
                    <br />
                    <b>Nombre del legítimo tenedor:</b>{" "}
                    {dataGetBillEvents?.data?.currentOwnerName} <br />
                    <b>Fecha de creación:</b>{" "}
                    {dataGetBillEvents?.data?.dateBill} <br />
                    <b>Fecha de expiración:</b>{" "}
                    {dataGetBillEvents?.data?.datePayment} <br />
                    <b>Valor:</b>{" "}
                    {numberFormat.format(dataGetBillEvents?.data?.billValue)}{" "}
                    <br />
                    <b>CUFE:</b>{" "}
                    {addLineBreaks(dataGetBillEvents?.data?.cufe, 50) ?? ""}{" "}
                    <br />
                    <br />
                  </Typography>
                  {dataGetBillEvents?.data?.events
                    ?.sort((a, b) => a.code - b.code)
                    .map((item, index) => {
                      return (
                        <Box
                          key={index}
                          display="flex"
                          flexDirection="column"
                          width="100%"
                          alignItems="center"
                          pt={2}
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            width="100%"
                            alignItems="center"
                            mb={3}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              width="100%"
                              alignItems="center"
                              mb={3}
                            >
                              <Typography
                                color="#488B8F"
                                fontWeight="bold"
                                fontSize="1.2rem"
                              >
                                Código: {item.code}
                              </Typography>
                              <Typography
                                color="#488B8F"
                                fontWeight="600"
                                fontSize="1.2rem"
                              >
                                Fecha: {item.date}
                              </Typography>
                            </Box>
                            <Box
                              display="flex"
                              flexDirection="column"
                              width="100%"
                              alignItems="center"
                              mb={3}
                            >
                              <Typography
                                color="#3"
                                fontWeight="500"
                                fontSize="1.2rem"
                              >
                                Evento: {item.event}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" mt={5}>
                  <LoadingCircle />
                </Box>
              )}
            </TitleModal>
          </>
        );
      },
    },
    {
      field: "file",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CustomTooltip
              title="Descargar factura"
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
                onClick={() => handleDownload(params.value, params.row.billId)}
              >
                &#xe902;
              </Typography>
            </CustomTooltip>
          </>
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
                //Delete bill by id
                onClick={() => {
                  if (params.row.associatedOperation !== null) {
                    Toast(
                      "No se puede eliminar una factura asociada a una operación",
                      "error"
                    );
                  } else {
                    handleOpenDelete(params.row.id);
                  }
                }}
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
                  esta factura?
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
                    onClick={() => {
                      handleDelete(openDelete[1]);
                    }}
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
    fetch: fetchBillList,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (args) => GetBillList({ page, ...args }),
    init: true,
  });

  const {
    fetch: fetchDeleteBillById,
    loading: loadingDeleteBillById,
    error: errorDeleteBillById,
    data: dataDeleteBillById,
  } = useFetch({ service: DeleteBillById, init: false });

  const {
    fetch: fetchGetBillEvents,
    loading: loadingGetBillEvents,
    error: errorGetBillEvents,
    data: dataGetBillEvents,
  } = useFetch({ service: GetBillEvents, init: false });

  useEffect(() => {
    if (dataDeleteBillById) {
      Toast("Factura eliminada", "success");
      fetchBillList();
    }

    if (errorDeleteBillById) {
      Toast("Error al eliminar factura", "error");
    }
  }, [dataDeleteBillById, loadingDeleteBillById, errorDeleteBillById]);

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);
  const [bill, setBill] = useState([]);

  useEffect(() => {
    const bill =
      data?.results?.map((bill) => ({
        id: bill.id,
        Cufe: bill.cufe,
        billId: bill.billId,
        Emitter: bill.emitterName,
        Payer: bill.payerName,
        Subtotal: bill.subTotal,
        Total: bill.total,
        typeBill: bill.typeBill,
        DateBill: bill.dateBill,
        DatePayment: bill.datePayment,
        currentBalance: bill.currentBalance,
        payedBalance: bill.associatedOperation?.payedAmount
          ? Number(bill.associatedOperation?.payedAmount)
          : 0,
        associatedOperation: bill.associatedOperation?.opId
          ? bill.associatedOperation?.opId
          : null,
        file: bill.file,
      })) || [];
    setBill(bill);
  }, [data]);

  const [openDelete, setOpenDelete] = useState([false, null]);
  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);
  const handleDelete = (id) => {
    fetchDeleteBillById(id);
    setOpenDelete([false, null]);
    setTimeout(() => {
      setBill(bill.filter((bill) => bill.id !== id));
    }, 1000);
  };
  console.log(dataGetBillEvents)
  const [openEvents, setOpenEvents] = useState([false, null]);
  const handleOpenEvents = (id) => handleEvents(id);
  const handleCloseEvents = () => setOpenEvents([false, null]);
  const handleEvents = (id) => {
    fetchGetBillEvents(id);
    setOpenEvents([true, id]);
  };

  return (
    <>
      <BackButton path="/dashboard" />
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
          Consulta de Facturas
        </Typography>
        
        <Box display="flex" gap="1rem">
<Link href="/bills?=register" underline="none">
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
              Extraer nueva factura
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
            onClick={handleOpenRegisterOperation}
          >
            <Typography
              letterSpacing={0}
              fontSize="80%"
              fontWeight="bold"
              color="#63595C"
            >
              Registrar Factura Manual
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
       
        </Box>
        
      </Box>
      <Box container display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar factura</InputTitles>
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
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "emitter" && { borderWidth: 3 }),
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
              setFilter(filter === "payer" ? "" : "payer");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "payer" && { borderWidth: 3 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Pagador
            </Typography>
          </Button>

          <Button
            variant="standard"
            size="medium"
            onClick={() => {
              setFilter(filter === "bill" ? "" : "bill");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "bill" && { borderWidth: 3 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Nro Factura
            </Typography>
          </Button>

          <Button
            variant="standard"
            size="medium"
            onClick={() => {
              setFilter(filter === "operation" ? "" : "operation");
            }}
            sx={{
              height: "2rem",
              backgroundColor: "transparent",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              marginRight: "0.3rem",
              ...(filter === "operation" && { borderWidth: 3 }),
            }}
          >
            <Typography
              letterSpacing={0}
              fontSize="85%"
              fontWeight="600"
              color="#5EA3A3"
              textTransform="none"
            >
              Operacion
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
                fetchBillList({
                  page: 1,
                  ...(Boolean(filter) && { [filter]: query }),
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
          rows={bill}
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
                        fetchBillList({
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
                        fetchBillList({
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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
