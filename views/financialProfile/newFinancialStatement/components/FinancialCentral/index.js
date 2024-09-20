import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import scrollSx from "@styles/scroll";

import { GetFinancialProfileById, UpdateFinancialCentral } from "../../queries";
import FinancialCentralRow from "../FinancialCentralRow";

export default (props) => {
  const { clientId, onClose } = props;

  const [tableData, setTableData] = useState([]);
  const [financialAnalisis, setFinancialAnalisis] = useState("");
  const [cualitativeAnalisis, setCualitativeAnalisis] = useState("");
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetFinancialProfileById, init: false });

  const {
    fetch: fetchFinancialCentral,
    loading: loadFinancialCentrals,
    error: errorFinancialCentrals,
    data: dataFinancialCentrals,
  } = useFetch({ service: UpdateFinancialCentral, init: false });

  useEffect(() => {
    if (clientId) {
      fetch(clientId).then((res) => {
        if (res?.data && res?.data !== []) {
          const newTableData = res.data.financialCentrals.map((item) => {
            return {
              id: item.id,
              centralBalances: item.centralBalances,
              rating: item.rating,
              bank: {
                value: item.bank.id,
                label: item.bank.description,
              },
              isChecked: false,
            };
          });
          setTableData(newTableData);
          setFinancialAnalisis(res?.data?.overview?.financialAnalisis ?? "");
          setCualitativeAnalisis(
            res?.data?.overview?.qualitativeOverview ?? ""
          );
        }
      });
    }
  }, [clientId]);

  const checkIfIsSelected = () => {
    let state = false;
    tableData.forEach((element) => {
      if (element.isChecked) {
        state = true;
      }
    });
    return state;
  };

  const handleSave = async () => {
    const verify = tableData.filter((item) => {
      return (
        item.bank === null || item.centralBalances === "" || item.rating === ""
      );
    });

    if (verify.length > 0) {
      Toast("Algunos campos dentro de la tabla están vacíos.", "error");
    } else {
      const data = tableData.map((item) => {
        const amount = String(item.centralBalances).replaceAll(",", "");

        return {
          client: clientId,
          bank: item.bank.value,
          rating: item.rating,
          centralBalances: amount === "" ? 0 : Number(amount),
        };
      });
      const overviewRes = await fetchFinancialCentral(
        clientId,
        cualitativeAnalisis,
        financialAnalisis,
        data
      );
      if (overviewRes === 200) {
        onClose();
        Toast("Centrales financieras actualizadas correctamente", "success");
      } else {
        Toast("No se ha podido actualizar las centrales financieras", "error");
      }
    }
  };

  return (
    <>
      <Box mt="25px" width="100%" height="85%">
        <Box
          sx={{
            height: "95%",
            ...scrollSx,
          }}
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Box
              sx={{
                borderRadius: "4px",
                opacity: 1,
                width: "100%",
                minHeight: "95%",
                marginBottom: "25px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "25px",
                }}
              >
                <Box width="100%" display="flex" justifyContent="flex-end">
                  <Button
                    width="50%"
                    variant="standard"
                    color="primary"
                    size="large"
                    disabled={!checkIfIsSelected()}
                    sx={{
                      height: "2rem",
                      backgroundColor: "transparent",
                      border: "1.4px solid #63595C",
                      borderRadius: "4px",
                      mr: "10px",
                      opacity: checkIfIsSelected() ? 1 : 0.2,
                    }}
                    onClick={() => {
                      const newData = tableData.filter(
                        (item) => !item.isChecked
                      );
                      setTableData(newData);
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="80%"
                      fontWeight="bold"
                      color="#63595C"
                      mr="10px"
                    >
                      Eliminar
                    </Typography>
                    <i class="fa-regular fa-trash"></i>
                  </Button>
                  <Button
                    width="50%"
                    variant="standard"
                    color="primary"
                    size="large"
                    sx={{
                      height: "2rem",
                      backgroundColor: "#488B8F",
                      color: "#FFFFFF",
                      textTransform: "none",
                      borderRadius: "4px",
                      mr: "10px",
                      "&:hover": { backgroundColor: "#5EA3A3" },
                    }}
                    onClick={() => {
                      if (tableData.length < 5) {
                        setTableData([
                          ...tableData,
                          {
                            isChecked: false,
                            bank: "",
                            centralBalances: "",
                            rating: "",
                          },
                        ]);
                      } else {
                        /* A JavaScript alert that will be displayed when the user tries to add more than 5 rows. */
                        Toast("No puede ingresar mas de 5 filas.", "error");
                      }
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="80%"
                      fontWeight="bold"
                      color={"#FFFFFF"}
                      textTransform="uppercase"
                      mr="10%"
                    >
                      Agregar
                    </Typography>
                    <i class="fa-regular fa-plus"></i>
                  </Button>
                </Box>
                <Box
                  sx={{
                    border: "1.4px solid #B5D1C9",
                    borderRadius: "4px",
                    width: "98%",
                    //height: "448px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    mb: "25px",
                  }}
                >
                  <Table width="100%" sx={{}}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Checkbox
                            checked={
                              tableData.length > 0
                                ? tableData.every((item) => item.isChecked)
                                : false
                            }
                            onChange={(e) => {
                              const newTableData = tableData.map((item) => {
                                return {
                                  ...item,
                                  isChecked: e.target.checked,
                                };
                              });
                              setTableData(newTableData);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </TableCell>
                        <TableCell width="50%" align="center">
                          <Typography
                            sx={{
                              textAlign: "left",
                              font: "normal normal bold 12px/15px Montserrat",
                              letterSpacing: "0px",
                              color: "#63595C",
                              textTransform: "uppercase",
                              opacity: 1,
                            }}
                          >
                            Entidad Financiera
                          </Typography>
                        </TableCell>
                        <TableCell width="25%" align="center">
                          <Typography
                            sx={{
                              textAlign: "left",
                              font: "normal normal bold 12px/15px Montserrat",
                              letterSpacing: "0px",
                              color: "#63595C",
                              textTransform: "uppercase",
                              opacity: 1,
                            }}
                          >
                            Saldo Centrales
                          </Typography>
                        </TableCell>
                        <TableCell width="25%" align="center">
                          <Typography
                            sx={{
                              textAlign: "left",
                              font: "normal normal bold 12px/15px Montserrat",
                              letterSpacing: "0px",
                              color: "#63595C",
                              textTransform: "uppercase",
                              opacity: 1,
                            }}
                          >
                            Calificación
                          </Typography>
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((item, index) => {
                        return (
                          <FinancialCentralRow
                            isChecked={item.isChecked}
                            bank={item.bank}
                            centralBalances={item.centralBalances}
                            rating={item.rating}
                            index={index}
                            setTableData={setTableData}
                            tableData={tableData}
                            onDelete={() => {
                              const newTableData = tableData.filter(
                                (subItem) => subItem !== item
                              );
                              setTableData(newTableData);
                            }}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              width="98%"
              display="flex"
              justifyContent="center"
              alignContent="center"
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    textAlign: "left",
                    font: "normal normal bold 12px/15px Montserrat",
                    letterSpacing: "0px",
                    color: "#63595C",
                    textTransform: "uppercase",
                    opacity: 1,
                  }}
                >
                  Análisis Cualitativo
                </Box>

                <TextField
                  value={cualitativeAnalisis}
                  onChange={(e) => {
                    setCualitativeAnalisis(e.target.value);
                  }}
                  helperText={`${cualitativeAnalisis.length ?? 0}/2000`}
                  placeholder=""
                  multiline
                  rows={8}
                  inputProps={{
                    maxlength: "2000",
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    textAlign: "justify",
                    background: "#FAFAFA 0% 0% no-repeat padding-box",
                    border: "1px solid #5EA3A380",
                    borderRadius: "4px",
                    opacity: 1,
                    ":focus": {
                      outline: "none",
                    },
                    font: "1.2vh/1.6vh Montserrat",
                    letterSpacing: "0.28px",
                    color: "#57575780",
                    opacity: 1,
                  }}
                />
              </Box>
            </Box>

            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignContent="center"
            >
              <Box
                sx={{
                  width: "98%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  mt="4%"
                  sx={{
                    textAlign: "left",
                    font: "normal normal bold 12px/15px Montserrat",
                    letterSpacing: "0px",
                    color: "#63595C",
                    textTransform: "uppercase",
                    opacity: 1,
                  }}
                >
                  Análisis Financiero
                </Box>

                <TextField
                  value={financialAnalisis}
                  onChange={(e) => {
                    setFinancialAnalisis(e.target.value);
                  }}
                  placeholder=""
                  multiline
                  rows={8}
                  inputProps={{
                    maxlength: "2000",
                  }}
                  helperText={`${financialAnalisis.length ?? 0}/2000`}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    textAlign: "justify",
                    background: "#FAFAFA 0% 0% no-repeat padding-box",
                    border: "1px solid #5EA3A380",
                    borderRadius: "4px",
                    opacity: 1,
                    ":focus": {
                      outline: "none",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "5%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: "25px",
          }}
        >
          <Button
            variant="standard"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={loadFinancialCentrals}
            sx={{
              width: "100px",
              height: "2.6rem",
              backgroundColor: "#488B8F",
              border: "1.4px solid #5EA3A3",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#5EA3A3",
              },
              color: "#FFFFFF",
            }}
          >
            {loadFinancialCentrals ? (
              <CircularProgress
                disableShrink={true}
                size={20}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <>
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#FFFFFF"
                  mr="10px"
                >
                  Guardar
                </Typography>

                <i class="fa-solid fa-floppy-disk"></i>
              </>
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
};
