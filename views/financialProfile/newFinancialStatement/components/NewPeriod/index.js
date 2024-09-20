import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import { getEmptyPeriod } from "../../libs/groups";
import { getPeriodsType } from "../../queries";
import Column from "../Column";

import dayjs from "dayjs";

export default (props) => {
  const [typePeriodSelectId, setTypePeriodSelect] = useState("");
  const [selecteObject, setSelecteObject] = useState({});
  const [typePeriods, setTypePeriods] = useState([]);
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: getPeriodsType, init: false });

  useEffect(() => {
    fetch().then((res) => {
      if (res?.data && res?.data !== []) {
        setTypePeriods(res.data);
      }
    });
  }, []);

  const periodList = useSelector((state) =>
    state.financialStatement.data.map((period) => period.period)
  );
  const { clientId, setReloadTable } = props;
  const dispatch = useDispatch();
  const [valueYear, setValueYear] = useState(dayjs());

  const handleTypePeriodChange = (event) => {
    setTypePeriodSelect(event.target.value);
    const selected = typePeriods.find(
      (typePeriod) => typePeriod.id === event.target.value
    );

    setSelecteObject(selected);
  };
  const [periodRange, setPeriodRange] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const handlePeriodRangeChange = (event) => {
    setPeriodRange(event.target.value);
  };
  const [newPeriodMenuOpened, setNewPeriodMenuOpnened] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState({});
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleChangeDate = (newValue, setActualDate) => {
    setActualDate(newValue);
  };

  useEffect(() => {
    setCurrentYear(valueYear.year());
  }, [valueYear]);

  return (
    <>
      <TitleModal
        open={open}
        handleClose={handleClose}
        containerSx={{
          width: "max-content",
          height: "90%",
        }}
        title={"Nuevo Periodo"}
      >
        <Box
          sx={{
            height: "90%",
            ...scrollSx,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Column
            sx={{
              width: "300px",
              height: "fit-content",
              overflowX: "hidden",
            }}
            period={{}}
            isLabelColumn={true}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            clientId={clientId}
            isFullView={false}
            isNewPeriod={true}
          />
          <Column
            isFullView={false}
            key={"column-" + "newPeriod"}
            period={period}
            title={"Nuevo Periodo"}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            clientId={clientId}
            isNewPeriod={true}
            setReloadTable={setReloadTable}
            closeNewPeriodModal={handleClose}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></Box>
      </TitleModal>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "50px",
          height: "100%",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          width="90%"
          ml="3%"
          borderBottom="2px solid #488B8F"
          marginBottom="70px"
          sx={{
            width: "416px",
            marginRight: "50px",
          }}
        >
          <Typography
            letterSpacing={0}
            fontSize="1.7vw"
            fontWeight="500"
            color="#488B8F"
          >
            Nuevo registro
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          ml="3%"
          justifyContent="flex-start"
          alignItems="center"
          position="relative"
          height="100%"
          width="100%"
        >
          {newPeriodMenuOpened ? (
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              position="absolute"
              bgcolor="#EBEBEB"
              zIndex={1}
              sx={{
                width: "416px",
              }}
            >
              <InputTitles sx={{ fontSize: "0.7vw", mb: "3%" }}>
                Año de balance
              </InputTitles>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  value={valueYear}
                  onChange={(newValue) => {
                    setValueYear(newValue);
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{
                          width: "50%",
                          backgroundColor: "white",
                          border: "1.4px solid #ACCFCF",
                          borderRadius: "5px",
                          padding: "10px",
                          height: "1rem",
                          mb: "7%",
                          "& .MuiInputBase-input": {
                            padding: "2px",
                            "&::placeholder": {
                              color: "#57575780",
                              fontSize: "0.9rem",
                            },
                          },
                          "&:hover": {
                            border: "1.4px solid #ACCFCF",
                            backgroundColor: "#EBFAF6",
                          },
                          "& .MuiInputBase-root": {
                            fontSize: "1vw",
                            color: "#4A4546",
                          },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                          sx: {
                            mt: "-6px",
                          },
                        }}
                        helperText={null}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
              <InputTitles sx={{ fontSize: "0.7vw" }}>
                Rango de muestra
              </InputTitles>
              <Box display="flex" flexDirection="row" width="100%">
                <Box width="45%">
                  <FormControl fullWidth>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={typePeriodSelectId}
                      onChange={handleTypePeriodChange}
                      sx={{
                        bgcolor: "white",
                        padding: "1%",
                        border: "1.4px solid #ACCFCF",
                        borderRadius: "4px",
                      }}
                    >
                      {typePeriods.map((typePeriod) => {
                        return (
                          <FormControlLabel
                            value={typePeriod.id}
                            control={
                              <Radio
                                size="small"
                                sx={{
                                  "&, &.Mui-checked": {
                                    color: "#5EA3A3",
                                  },
                                }}
                              />
                            }
                            label={
                              typePeriod.description.charAt(0).toUpperCase() +
                              typePeriod.description.slice(1)
                            }
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box width="50%" ml="5%">
                  {selecteObject.periodRange && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        bgcolor: "white",
                        padding: "1%",
                        border: "1.4px solid #ACCFCF",
                        borderRadius: "4px",
                        height: "100%",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={["month", "day"]}
                          minDate={new Date(`${currentYear}-01-01`)}
                          maxDate={new Date(`${currentYear}-12-31`)}
                          label="Fecha de Inicio"
                          inputFormat="DD/MM/YYYY"
                          value={
                            startDate
                              ? startDate
                              : new Date(`${currentYear}-01-02`)
                          }
                          onChange={(newValue) => {
                            setStartDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={["month", "day"]}
                          minDate={new Date(`${currentYear}-01-01`)}
                          maxDate={new Date(`${currentYear}-12-31`)}
                          label="Fecha de Fin"
                          inputFormat="DD/MM/YYYY"
                          value={
                            endDate ? endDate : new Date(`${currentYear}-01-02`)
                          }
                          onChange={(newValue) => {
                            if (
                              /* *|MARCADOR_CURSOR|* */
                              startDate > newValue
                            ) {
                              Toast(
                                "La fecha de fin debe ser mayor a la fecha de inicio",
                                "error"
                              );
                              return;
                            }
                            setEndDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Box>
                  )}
                  {selecteObject?.subPeriods && !selecteObject.periodRange && (
                    <FormControl fullWidth>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={periodRange}
                        onChange={handlePeriodRangeChange}
                        sx={{
                          bgcolor: "white",
                          padding: "1%",
                          border: "1.4px solid #ACCFCF",
                          borderRadius: "4px",
                        }}
                      >
                        {selecteObject?.subPeriods.map((subPeriod) => {
                          return (
                            <FormControlLabel
                              value={subPeriod.id}
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    "&, &.Mui-checked": {
                                      color: "#5EA3A3",
                                    },
                                  }}
                                />
                              }
                              label={
                                subPeriod.description.charAt(0).toUpperCase() +
                                subPeriod.description.slice(1)
                              }
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              </Box>
              <Button
                variant="standard"
                color="primary"
                size="large"
                onClick={() => {
                  const dateFormat = new Date(valueYear);
                  const year = dateFormat.getFullYear();
                  if (!periodList.includes(year)) {
                    let periodDays = null;
                    if (startDate && endDate) {
                      periodDays = Math.ceil(
                        (endDate - startDate) / (1000 * 3600 * 24)
                      );
                    }

                    setPeriod({
                      ...getEmptyPeriod(),
                      period: year,
                      typePeriod: typePeriodSelectId,
                      client: clientId,
                      periodRange: periodRange,
                      isNewPeriod: true,
                      periodStartDate: startDate
                        ? `${startDate["$d"].getFullYear()}-${
                            startDate["$d"].getMonth() + 1
                          }-${startDate["$d"].getDate()}`
                        : null,
                      periodEndDate: endDate
                        ? `${endDate["$d"].getFullYear()}-${
                            endDate["$d"].getMonth() + 1
                          }-${endDate["$d"].getDate()}`
                        : null,
                      periodDays: periodDays,
                    });
                    setOpen(true);
                  } else {
                    Toast(
                      "No puede agregar un periodo que ya se encuentra registrado",
                      "error"
                    );
                  }
                }}
                sx={{
                  height: "2.6rem",
                  backgroundColor: "#488B8F",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                  ml: "2%",
                  mt: "50px",
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="0.6vw"
                  fontWeight="bold"
                  color="#FFFFFF"
                >
                  Crear nuevo periodo
                </Typography>
                <i
                  style={{
                    color: "#FFFFFF",
                    marginLeft: "0.7rem",
                  }}
                  className="fa-regular fa-plus"
                ></i>
              </Button>
            </Box>
          ) : null}
          {!newPeriodMenuOpened && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center"
              position="relative"
              width="100%"
            >
              <Typography
                letterSpacing={0}
                fontSize="1.2vw"
                fontWeight="500"
                color="#333333"
              >
                Crear periodo
              </Typography>
              <Button
                variant="standard"
                color="primary"
                size="large"
                onClick={() => {
                  setNewPeriodMenuOpnened(true);
                }}
                sx={{
                  height: "2.6rem",
                  backgroundColor: "transparent",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                  ml: "2%",
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="0.6vw"
                  fontWeight="bold"
                  color="#63595C"
                >
                  Crear nuevo periodo
                </Typography>
                <i
                  style={{
                    color: "#63595C",
                    marginLeft: "0.7rem",
                  }}
                  className="fa-regular fa-plus"
                ></i>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
