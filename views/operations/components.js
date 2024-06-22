import { useState } from "react";

import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import ValueFormat from "@formats/ValueFormat";

import responsiveFontSize from "@lib/responsiveFontSize";

import BackButton from "@styles/buttons/BackButton";
import CustomTooltip from "@styles/customTooltip";
import MuiTextField from "@styles/fields";
import { StandardTextField } from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import moment from "moment";

const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const filtersContainerSx = {
  display: "flex",
  gap: 1,
};

const entriesGrid = {
  backgroundColor: "#488B8F",
  borderRadius: "4px",

  mt: 1,

  pb: 1.5,
  pr: 1.5,
};

const entryContainerSx = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  position: "relative",
};

const titleSx = {
  letterSpacing: 0,
  fontSize: 10,
  fontWeight: "bold",
  color: "#488B8F",
  textTransform: "uppercase",
  textAlign: "right",

  position: "absolute",
  left: 8,
  top: 3,
};

const valueSx = {
  letterSpacing: 0,
  color: "#488B8F",
  fontSize: 14,
  fontWeight: 600,
  textAlign: "right",

  border: "1px solid #C7C7C780",
  borderRadius: "4px",

  backgroundColor: "#ebfaf6",
  width: "100%",
  padding: "0.35rem",
  pt: "0.7rem",
  pb: "0.1rem",
};

const tableWrapperSx = {
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};

const TextFieldSearch = (props) => {
  const { ...rest } = props;

  return (
    <MuiTextField
      type="text"
      variant="standard"
      margin="normal"
      InputProps={{
        disableUnderline: true,
        sx: {
          marginTop: "-5px",
        },
        endAdornment: <SearchOutlined sx={{ color: "#5EA3A3" }} />,
      }}
      sx={{ m: 0, my: 1 }}
      {...rest}
    />
  );
};

const Entry = (props) => {
  const { title, children, sx, ...rest } = props;

  return (
    <Box sx={{ ...entryContainerSx, ...sx }}>
      <Typography sx={{ ...titleSx }}>{title}</Typography>
      <Typography sx={{ ...valueSx }}>{children}</Typography>
    </Box>
  );
};

const SortIcon = () => (
  <Typography fontFamily="icomoon" fontSize="0.7rem">
    &#xe908;
  </Typography>
);

const EntryField = styled(StandardTextField)(({ theme }) => ({
  "& label": {
    color: "#488B8F",
    fontWeight: 600,
    top: 10,
    left: -5,
  },

  "& .Mui-focused": {
    color: "#488B8F",
    fontWeight: 600,
  },

  "& fieldset": {
    display: "none",
  },

  "& .MuiInputBase-root": {
    height: 35.78,
    backgroundColor: "#ebfaf6",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#5EA3A380 !important",
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f !important",
  },

  "& .MuiOutlinedInput-input": {
    textAlign: "right",
    color: "#488B8F",
    fontWeight: 600,
    fontSize: 14,
  },

  "& .MuiInputAdornment-root": {
    color: "#5EA3A3",
  },
}));

const EditableEntry = (props) => {
  const { title, value, onChangeMasked, ...rest } = props;

  return (
    <EntryField
      notched={true}
      label={title}
      InputLabelProps={{ shrink: true }}
      isMasked
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      allowNegative={false}
      value={value}
      onChangeMasked={onChangeMasked}
    />
  );
};

const NotificationsButton = (props) => {
  const { ...rest } = props;

  return (
    <Link href="/operations/notifications" underline="none">
      <Button
        variant="standard"
        color="primary"
        size="large"
        sx={{
          height: "2.6rem",
          backgroundColor: "transparent",
          border: "1.4px solid #63595C",
          borderRadius: "4px",
          ml: 1,
        }}
      >
        <Typography
          letterSpacing={0}
          fontSize="80%"
          fontWeight="bold"
          color="#63595C"
        >
          Estado de firma
        </Typography>

        <Typography
          fontFamily="icomoon"
          fontSize="1.5rem"
          color="#63595C"
          marginLeft="0.9rem"
        >
          &#xe900;
        </Typography>
      </Button>
    </Link>
  );
};

export const OperationsComponents = ({
  rows,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
  calcs
}) => {
  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });

  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);

  const columns = [
    {
      field: "opId",
      headerName: "NRO Operacion",
      width: 120,
      valueGetter: (params) => {
        return params.row?.opId;
      },
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      valueGetter: (params) => {
        switch (params.row.status) {
          case 0:
            return "Por Aprobar";
            break;
          case 1:
            return params.row.isPartiallyPayed ? "Pendiente" : "Vigente";
            break;
          case 2:
            return "Rechazada";
            break;
          case 3:
            return params.row.isPartiallyPayed ? "Pendiente" : "Vigente";
            break;
          case 4:
            return "Cancelada";
            break;
          case 5:
            return "Vencida";
            break;
          default:
            return "Por Aprobar";
            break;
        }
      },
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
              {params.value}
            </Typography>
          </>
        );
      },
    },
    {
      field: "opType",
      headerName: "Tipo de Operacion",
      width: 130,
      valueGetter: (params) => {
        return "COMPRA TITULO";
      },
      renderCell: (params) => {
        return <InputTitles>{params.value ? params.value : ""}</InputTitles>;
      },
    },
    {
      field: "opDate",
      headerName: "Fecha de Radicado",
      width: 150,
      valueGetter: (params) => {
        return params.row.opDate;
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
      field: "bill",
      headerName: "Nro Factura",
      width: 150,
      valueGetter: (params) => {
        return params.row?.billData;
      },
      renderCell: (params) => {
        return <InputTitles>{params.value ? params.value : ""}</InputTitles>;
      },
    },
    {
      field: "emitter",
      headerName: "Emisor",
      width: 150,
      valueGetter: (params) => {
        return params.row?.emitterName;
      },
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
      headerName: "Pagador",
      width: 170,
      valueGetter: (params) => {
        return params.row?.payerName;
      },
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
      field: "investor",
      headerName: "Inversionista",
      width: 170,
      valueGetter: (params) => {
        return params.row?.investorName;
      },
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
      field: "discountTax",
      headerName: "Tasa Descuento",
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
            <InputTitles>{`${(Number(params.value).toFixed(2))}%`}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "investorTax",
      headerName: "Tasa Inversionista",
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
            <InputTitles>{`${(Number(params.value).toFixed(2))}%`}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "payedAmount",
      headerName: "Valor Nominal",
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
      field: "presentValueInvestor",
      headerName: "Valor Inversionistas",
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
      field: "probableDate",
      headerName: "Fecha Probable",
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
      field: "opExpiration",
      headerName: "Fecha Fin",
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
      field: "Registrar recaudo",
      headerName: "",
      width: 20,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={
              params.row.status === 4
                ? "#"
                : `/administration/new-receipt?id=${params.row.id}`
            }
          >
            <CustomTooltip
              title="Registrar recaudo"
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
      field: "Detalles operación",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link href={`/operations/manage?preview&id=${params.row.id}`}>
            <CustomTooltip
              title="Ver operación"
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
  ];

  const handleTextFieldChange = async (evt, field) => {
    setTempFilters({ ...tempFilters, [field]: evt.target.value });
  };

  const updateFilters = (value, field) => {
    filtersHandlers.set({ ...tempFilters, [field]: value });
  };

  return (
    <>
      <BackButton path="/dashboard" />
      <Box sx={{ ...sectionTitleContainerSx }}>
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          Consulta de Operaciones
        </Typography>
      </Box>

      <Box sx={{ ...filtersContainerSx }}>
        <Box display="flex" flexDirection="column">
          <InputTitles sx>Buscar N° Operación</InputTitles>
          <TextFieldSearch
            id="searchOperation"
            placeholder="N° Operación"
            value={tempFilters.opId}
            onChange={(evt) => handleTextFieldChange(evt, "opId")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "opId");
              }
              handleTextFieldChange(event, "opId");
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column">
          <InputTitles>Buscar N° Factura</InputTitles>
          <TextFieldSearch
            id="searchBill"
            placeholder="N° Factura"
            value={tempFilters.billId}
            onChange={(evt) => handleTextFieldChange(evt, "billId")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "billId");
              }
              handleTextFieldChange(event, "billId");
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column">
          <InputTitles>Buscar nombres</InputTitles>
          <TextFieldSearch
            id="searchName"
            placeholder="Nombre"
            value={tempFilters.investor}
            onChange={(evt) => handleTextFieldChange(evt, "investor")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "investor");
              }
              handleTextFieldChange(event, "investor");
            }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignSelf="flex-end"
          ml="auto"
          mb={1}
        >
          <NotificationsButton />
        </Box>
      </Box>

      <Grid container spacing={1.5} sx={{ ...entriesGrid }}>
        <Grid item xs={2}>
          <Entry title="Comisión">
            <ValueFormat value={Math.round(calcs?.commission) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <EditableEntry
            title="Otros"
            onChangeMasked={(values) => {
              setOther(values.floatValue);
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <Entry title="IVA">
            <ValueFormat value={Math.round(calcs?.iva) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="Valor inversor">
            <ValueFormat value={Math.round(calcs?.investorValue) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEFUENTE">
            <ValueFormat value={Math.round(calcs?.rteFte) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="FACTURAR NETO">
            <ValueFormat value={Math.round(calcs?.netFact) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEICA">
            <ValueFormat value={Math.round(calcs?.retIca) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="VALOR FUTURO">
            <ValueFormat value={Math.round(calcs?.futureValue) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEIVA">
            <ValueFormat value={Math.round(calcs?.retIva) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="VALOR A GIRAR">
            <ValueFormat value={Math.round(calcs?.depositValue - other) || 0} />
          </Entry>
        </Grid>
      </Grid>

      <Box sx={{ ...tableWrapperSx }}>
        <CustomDataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          components={{
            ColumnSortedAscendingIcon: SortIcon,
            ColumnSortedDescendingIcon: SortIcon,
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
                No hay operaciones registradas
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
                        getOperationsFetch({
                          page: page - 1,
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
                        getOperationsFetch({
                          page: page + 1,
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
        />
      </Box>
    </>
  );
};
