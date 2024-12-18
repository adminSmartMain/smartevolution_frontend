import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import { Button, Fade, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { Toast } from "@components/toast";

import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import CustomDataGrid from "@styles/tables";

import { getNotifications, getOperationById, sendBuyOrder } from "./queries";

import moment from "moment";

export const SignatureListC = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [id, setId] = useState("");

  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: dataOrders,
  } = useFetch({
    service: (args) => getNotifications({ page, ...args }),
    init: true,
  });

  const {
    fetch: getOperationByIdFetch,
    loading: loadingGetOperationById,
    error: errorGetOperationById,
    data: dataGetOperationById,
  } = useFetch({ service: getOperationById, init: false });

  const {
    fetch: sendBuyOrderFetch,
    loading: loadingBuyOrderFetch,
    error: errorBuyOrderFetch,
    data: dataBuyOrderFetch,
  } = useFetch({ service: sendBuyOrder, init: false });

  useEffect(() => {
    if (dataGetOperationById) {
      console.log(dataGetOperationById)
      const data = {
        investorId: dataGetOperationById?.data?.investor?.investorId,
        investor: dataGetOperationById?.data?.investor?.investor,
        balance: dataGetOperationById?.data?.investor?.investorAccountBalance,
        emitter: dataGetOperationById?.data?.emitter?.name,
        payers: dataGetOperationById?.data?.payers?.map((payer) => {
          return {
            name: payer.name,
          };
        }),
        bills: dataGetOperationById?.data?.bills?.bills,
        averageTerm: `${dataGetOperationById?.data?.bills?.averageTerm} días`,
        amount: dataGetOperationById?.data?.bills?.total,
        opId: id,
        phone: dataGetOperationById?.data?.investor?.investorPhoneNumber,
      };
      sendBuyOrderFetch(data);
    }
  }, [dataGetOperationById]);

  useEffect(() => {
    if (errorBuyOrderFetch) {
      if (
        errorBuyOrderFetch.message === "Overview matching query does not exist."
      ) {
        Toast("Emisor o Pagador sin Perfil Financiero Cargado", "error");
      } else {
        Toast(errorBuyOrderFetch.message, "error");
      }
    }

    if (dataBuyOrderFetch) {
      Toast("Orden de compra enviada exitosamente", "success");
    }

    if (loadingBuyOrderFetch) {
      Toast("Enviando Orden de compra", "info");
    }
  }, [dataBuyOrderFetch, errorBuyOrderFetch, loadingBuyOrderFetch]);


    //La logic de acá no está conectada con la de las operaciones, solamente con los inversores. las operaciones son unicas por lo que solo busca unos solo en cambio en inversores pueden ser
    // varias por lo que seria una lista.
  useEffect(() => {
    console.log(dataOrders)

    if (dataOrders?.results){
      console.log(dataOrders)
      const orders =
      dataOrders?.results?.map((order) => ({
        id: order.id,
        NoOP: order.opId,
        DateBill: order.opDate,
        Investor: order.investor?.social_reason
          ? order.investor?.social_reason
          : order.investor?.first_name + " " + order.investor?.last_name,
        Emitter: order.emitter?.social_reason
          ? order.emitter?.social_reason
          : order.emitter?.first_name + " " + order.emitter?.last_name,
        billCount: order.billCount,
        promDays: order.promDays,
        investorTax: order.investorTax,
        presentValueInvestor: order.presentValueInvestor,
        payedAmount: order.payedAmount,
        isSellOrderSent: order.isSellOrderSent,
        BuyOrderSent: order.BuyOrderSent,
        buyOrderSentDate: order.buyOrderSentDate,
        isSignatureSent: order.isSignatureSent,
        signStatusDate: order.signStatusDate,
        investorId: order.investor?.id,
      })) || [];
    console.log(orders)
    setData(orders);

    } else{
      
      console.log(dataOrders)
      const orders = dataOrders?.data?.map((order) => ({
        id: order.id,
        NoOP: order.opId,
        DateBill: order.opDate,
        Investor: order.investor?.social_reason
          ? order.investor?.social_reason
          : order.investor?.first_name + " " + order.investor?.last_name,
        Emitter: order.emitter?.social_reason
          ? order.emitter?.social_reason
          : order.emitter?.first_name + " " + order.emitter?.last_name,
        billCount: order.billCount,
        promDays: order.promDays,
        investorTax: order.investorTax,
        presentValueInvestor: order.presentValueInvestor,
        payedAmount: order.payedAmount,
        isSellOrderSent: order.isSellOrderSent,
        BuyOrderSent: order.BuyOrderSent,
        buyOrderSentDate: order.buyOrderSentDate,
        isSignatureSent: order.isSignatureSent,
        signStatusDate: order.signStatusDate,
        investorId: order.investor?.id,
      })) || [];
      console.log( orders,"aqui data de operacion")
      setData( orders);
    }
      
    




    
  }, [dataOrders]);

  const dataCount = dataOrders?.count || 0;



  //aca se definen las columnas
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
      field: "promDays",
      headerName: "DIAS PROM",
      width: 150,
      renderCell: (params) => {
        return (
          <InputTitles>
            {Math.round(params.value * 100 + Number.EPSILON) / 100}
          </InputTitles>
        );
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
      headerName: "VALOR NOMINAL OP",
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
      field: "Orden de compra",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={
              params.row.isSignatureSent
                ? "#"
                : `/operations/approval?id=${params.row.NoOP}&investor=${params.row.investorId}`
            }
          >
            <CustomTooltip
              title={
                params.row.isSignatureSent
                  ? "Firma electrónica ya enviada"
                  : "Enviar a Whatsapp"
              }
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
              <i
                className="fa-brands fa-whatsapp"
                style={{
                  fontSize: "1.3rem",
                  color: params.row.isSignatureSent ? "#EBEBEB" : "#488B8F",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  "&:hover": params.row.isSignatureSent
                    ? {
                        backgroundColor: "#B5D1C980",
                        color: "#488B8F",
                      }
                    : null,
                }}
              ></i>
            </CustomTooltip>
          </Link>
        );
      },
    },
  ];


  //aca se empieza el front


  return (
    <>
      <BackButton path="/pre-operations" />
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
          Consulta de Aprobaciones
        </Typography>
      </Box>
      <Box container={"true"} display="flex" flexDirection="column" mt={3}>
        <InputTitles>Buscar operación</InputTitles>
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
            setFilter(filter === "opId" ? "" : "opId");
          }}
          sx={{
            height: "2rem",
            backgroundColor: "transparent",
            border: "1.4px solid #5EA3A3",
            borderRadius: "4px",
            marginRight: "0.3rem",
            ...(filter === "opId" && { borderWidth: 3 }),
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
                      console.log({ [filter]: query })
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
      <ToastContainer
        position="top-right"
        autoClose={50000}
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
