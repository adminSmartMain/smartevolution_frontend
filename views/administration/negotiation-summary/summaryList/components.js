import { useState } from "react";
import { useEffect } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";

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

import { GetNegotiationSummaryPDF, GetSummaryList } from "./queries";

import moment from "moment";

export const SummaryListComponent = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const columns = [
    {
      field: "NoOP",
      headerName: "NO. OP",
      width: 100,
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },
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
      field: "emitter",
      headerName: "NOMBRE EMISOR",
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
      field: "payer",
      headerName: "NOMBRE PAGADOR",
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
      field: "total",
      headerName: "DESEMBOLSOS",
      width: 170,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },
    {
      field: "totalDeposits",
      headerName: "TOTAL CONSIGNACIONES",
      width: 170,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },
    {
      field: "pendingToDeposit",
      headerName: "PENDIENTE DESEMBOLSO",
      width: 190,
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
      field: "Editar resumen",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/administration/negotiation-summary?modify&id=${params.row.NoOP}&opId=${params.row.id}`}
          >
            <CustomTooltip
              title="Editar resumen"
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
            <IconButton
              onClick={() => handleNegotiationSummaryClick(params.row.NoOP)}
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
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: GetSummaryList,
    init: true,
  });

  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);

  const summary =
    data?.results?.map((summary) => ({
      id: summary.id,
      NoOP: summary.opId,
      date: summary.date,
      date: summary.date,
      emitter: summary.emitter,
      payer: summary.payer,
      total: summary.total,
      totalDeposits: summary.totalDeposits,
      pendingToDeposit: summary.pendingToDeposit,
    })) || [];

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const {
    fetch: fetchNegotiationSummmary,
    loading: loadingNegotiationSummary,
    error: errorNegotiationSummary,
    data: dataNegotiationSummary,
  } = useFetch({ service: GetNegotiationSummaryPDF, init: false });

  const handleNegotiationSummaryClick = (id) => {
    fetchNegotiationSummmary(id);
    handleOpen();
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
          Consulta de resumen de negociación
        </Typography>
        <Link
          href="/administration/negotiation-summary?register"
          underline="none"
        >
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
              Registrar nuevo resumen de negociación
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

      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <CustomDataGrid
          rows={summary}
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
                No hay resumenes de negociación registrados
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
        <TitleModal
          open={open}
          handleClose={handleClose}
          containerSx={{
            width: "70%",
            height: "60%",
          }}
          title={"Resumen de negociación (PDF)"}
        >
          <Box
            display="flex"
            flexDirection="column"
            mt={5}
            sx={{ ...scrollSx }}
            height="50vh"
            alignItems="center"
          >
            {loadingNegotiationSummary && (
              <CircularProgress style={{ color: "#488B8F" }} />
            )}
            {dataNegotiationSummary && dataNegotiationSummary?.pdf && (
              <iframe
                src={`data:application/pdf;base64,${dataNegotiationSummary?.pdf}`}
                width="100%"
                height="100%"
              />
            )}
          </Box>
        </TitleModal>
      </Box>
    </>
  );
};
