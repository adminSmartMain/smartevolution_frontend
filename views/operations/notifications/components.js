import { useEffect } from "react";
import { useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Button, Fade, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";

import TitleModal from "@components/modals/titleModal";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import { GetBuyOrderPDF, getNotifications } from "./queries";

import { format } from "date-fns";
import moment from "moment";

export const NotificationListC = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: dataOperations,
  } = useFetch({
    service: (args) => getNotifications({ page, ...args }),
    init: true,
  });

  const {
    fetch: fetchBuyOrderPDF,
    loading: loadingBuyOrderPDF,
    error: errorBuyOrderPDF,
    data: dataBuyOrderPDF,
  } = useFetch({ service: GetBuyOrderPDF, init: false });

  const UTCtoLocal = (date) => {
    if (date === null) {
      return null;
    } else {
      let d = new Date(0);
      d.setUTCSeconds(date);
      return d;
    }
  };

  useEffect(() => {
    const operations =
      dataOperations?.results?.map((operation) => ({
        id: operation.id,
        NoOP: operation.opId,
        DateBill: operation.DateBill,
        Investor: operation.investor?.social_reason
          ? operation.investor?.social_reason
          : operation.investor?.first_name +
            " " +
            operation.investor?.last_name,
        Emitter: operation.emitter?.social_reason
          ? operation.emitter?.social_reason
          : operation.emitter?.first_name + " " + operation.emitter?.last_name,
        billCount: operation.billCount,
        investorTax: operation.investorTax,
        presentValueInvestor: operation.presentValueInvestor,
        payedAmount: operation.payedAmount,
        isSellOrderSent: operation.isSellOrderSent,
        BuyOrderSent: operation.BuyOrderSent,
        buyOrderSentDate: operation.buyOrderSentDate,
        isSignatureSent: operation.isSignatureSent,
        signStatusDate: operation.signStatusDate,
        investorId: operation.investor?.id,
      })) || [];

    setData(operations);
  }, [dataOperations]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleBuyOrderClick = (NoOP, investor) => {
    fetchBuyOrderPDF(NoOP, investor);
    handleOpen();
  };

  const dataCount = dataOperations?.count || 0;

  const columns = [
    {
      field: "NoOP",
      headerName: "NO OPERACION",
      width: 120,
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
      field: "DateBill",
      headerName: "FECHA",
      width: 150,
      valueGetter: (params) => {
        return params.row.DateBill;
      },
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "Investor",
      headerName: "INVERSIONISTA",
      width: 170,
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
      width: 170,
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
      field: "billCount",
      headerName: "CANTIDAD DE FACTURAS",
      width: 200,
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },
    {
      field: "investorTax",
      headerName: "TASA INVERSIONISTA",
      width: 200,
      renderCell: (params) => {
        return <InputTitles>{params.value} %</InputTitles>;
      },
    },
    {
      field: "presentValueInvestor",
      headerName: "VALOR PRESENTE INVERSIONISTA",
      width: 250,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },
    {
      field: "payedAmount",
      headerName: "VALOR NOMINAL",
      width: 200,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },

    {
      field: "buyOrderSentDate",
      headerName: "FECHA DEL ENVIO (FIRMA)",
      width: 220,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? <DateFormat date={params.value} /> : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "isSignatureSent",
      headerName: "ESTATUS DE FIRMA",
      width: 150,
      renderCell: (params) => {
        return (
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
              {params.value ? "Enviada" : "Pendiente"}
            </Typography>
          </>
        );
      },
    },
    {
      field: "signStatusDate",
      headerName: "FECHA DE LA FIRMA",
      width: 200,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? <DateFormat date={params.value} /> : ""}
          </InputTitles>
        );
      },
    },
    //{
    //  field: "Enviar a Whatsapp",
    //  headerName: "",
    //  width: 50,
    //  sortable: false,
    //  filterable: false,
    //  renderCell: (params) => {
    //    return (
    //      <Link
    //        href={
    //          params.row.isSignatureSent
    //            ? "#"
    //            : `/operations/detail?id=${params.row.NoOP}&investor=${params.row.investorId}`
    //        }
    //      >
    //        <CustomTooltip
    //          title={
    //            params.row.isSignatureSent
    //              ? "Firma electrónica ya enviada"
    //              : "Enviar a Whatsapp"
    //          }
    //          arrow
    //          placement="bottom-start"
    //          TransitionComponent={Fade}
    //          PopperProps={{
    //            modifiers: [
    //              {
    //                name: "offset",
    //                options: {
    //                  offset: [0, -15],
    //                },
    //              },
    //            ],
    //          }}
    //        >
    //          <i
    //            className="fa-brands fa-whatsapp"
    //            style={{
    //              fontSize: "1.3rem",
    //              color: params.row.isSignatureSent ? "#999999" : "#488B8F",
    //              padding: "0.5rem",
    //              borderRadius: "5px",
    //              cursor: params.row.isSignatureSent ? "default" : "pointer",
    //              "&:hover": params.row.isSignatureSent
    //                ? {
    //                    backgroundColor: "#B5D1C980",
    //                    color: "#488B8F",
    //                  }
    //                : null,
    //            }}
    //          ></i>
    //        </CustomTooltip>
    //      </Link>
    //    );
    //  },
    //},
    {
      field: "Orden de compra",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Orden de compra (PDF)"
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
            <IconButton
              onClick={() =>
                handleBuyOrderClick(params.row.NoOP, params.row.investorId)
              }
            >
              <i
                className="fa-regular fa-print"
                style={{
                  fontSize: "1.3rem",
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
  ];

  return (
    <>
      <BackButton path="/operations" />
      <Box
        container={"true"}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          Consulta de Firmas y Orden de Venta Pendientes
        </Typography>
      </Box>
      <Box container={"true"} display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar Operación</InputTitles>
      </Box>
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
            setFilter(filter === "nOpId" ? "" : "nOpId");
          }}
          sx={{
            height: "2rem",
            backgroundColor: "transparent",
            border: "1.4px solid #5EA3A3",
            borderRadius: "4px",
            marginRight: "0.3rem",
            ...(filter === "nOpId" && { borderWidth: 3 }),
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
              fetch({
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
      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <CustomDataGrid
          rows={data}
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
      <TitleModal
        open={open}
        handleClose={handleClose}
        containerSx={{
          width: "50%",
          height: "max-content",
        }}
        title={"Orden de compra"}
      >
        <Box
          display="flex"
          flexDirection="column"
          mt={5}
          sx={{ ...scrollSx }}
          height="50vh"
          alignItems="center"
        >
          {dataBuyOrderPDF && dataBuyOrderPDF?.data?.pdf && (
            <iframe
              src={`data:application/pdf;base64,${dataBuyOrderPDF?.data?.pdf}`}
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </TitleModal>
    </>
  );
};
