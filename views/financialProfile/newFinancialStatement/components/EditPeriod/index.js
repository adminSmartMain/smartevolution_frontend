import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import InputTitles from "@styles/inputTitles";

import { UpdatePeriod, getPeriodsType } from "../../queries";
import { financialStatementActions } from "../../store/slice";

import dayjs from "dayjs";

export default (props) => {
  const { clientId, formik, indexColumn, setReloadTable } = props;
  const [typePeriodSelectId, setTypePeriodSelect] = useState(
    formik.values.typePeriod
  );
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
        const selected = res.data.find(
          (typePeriod) => typePeriod.id === formik.values.typePeriod
        );

        setSelecteObject(selected);
      }
    });
  }, []);
  const actualDate = dayjs(`${formik.values.period}-01-01`);
  const dispatch = useDispatch();
  const [valueYear, setValueYear] = useState(actualDate);

  const handleTypePeriodChange = (event) => {
    setTypePeriodSelect(event.target.value);
    const selected = typePeriods.find(
      (typePeriod) => typePeriod.id === event.target.value
    );
    setSelecteObject(selected);
  };
  const [periodRange, setPeriodRange] = useState(formik.values.periodRange);
  const handlePeriodRangeChange = (event) => {
    setPeriodRange(event.target.value);
  };

  const [currentYear, setCurrentYear] = useState(actualDate.year());
  const [startDate, setStartDate] = useState(
    dayjs(formik.values.periodStartDate)
  );
  const [endDate, setEndDate] = useState(dayjs(formik.values.periodEndDate));
  const handleChangeDate = (newValue, setActualDate) => {
    setActualDate(newValue);
  };

  useEffect(() => {
    setCurrentYear(valueYear.year());
  }, [valueYear]);

  const {
    fetch: fetchUpdatePeriod,
    loading: loadingUpdatePeriod,
    error: errorUpdatePeriod,
    data: dataUpdatePeriod,
  } = useFetch({ service: UpdatePeriod, init: false });

  const handleUpdatePeriod = async (data) => {
    const dateFormat = new Date(valueYear);
    const year = dateFormat.getFullYear();
    let periodDays = null;
    if (startDate && endDate) {
      periodDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
    }

    const new_data = {
      period: year,
      typePeriod: typePeriodSelectId,
      client: clientId,
      periodRange: periodRange,
      isNewPeriod: false,
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
    };

    fetchUpdatePeriod(formik.values.id, new_data).then((res) => {
      if (res.status >= 200 && res.status <= 210) {
        formik.setFieldValue("period", res.data.data.period);
        formik.setFieldValue("typePeriod", res.data.data.typePeriod);
        formik.setFieldValue("periodRange", res.data.data.periodRange);
        formik.setFieldValue("periodStartDate", res.data.data.periodStartDate);
        formik.setFieldValue("periodEndDate", res.data.data.periodEndDate);
        formik.setFieldValue("periodDays", res.data.data.periodDays);
        formik.setFieldValue("dateRanges", res.data.data.dateRanges);

        //create a json with the data added to formik

        const responseData = {
          period: res.data.data.period,
          typePeriod: res.data.data.typePeriod,
          periodRange: res.data.data.periodRange,
          periodStartDate: res.data.data.periodStartDate,
          periodEndDate: res.data.data.periodEndDate,
          periodDays: res.data.data.periodDays,
          dateRanges: res.data.data.dateRanges,
        };

        dispatch(
          financialStatementActions.updatePeriod({
            indexPeriod: indexColumn,
            formik: formik,
            data: {
              ...formik.values,
              ...responseData,
            },
          })
        );
        formik.setFieldValue("isEdited", false);
        Toast("Periodo actualizado correctamente", "success");
      } else {
        Toast("No se ha podido actualizar el periodo", "error");
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Box
          display="flex"
          mt="50px"
          flexDirection="column"
          width="100%"
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
          <InputTitles sx={{ fontSize: "0.7vw" }}>Rango de muestra</InputTitles>
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
                    paddingLeft: "8px",
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
              {selecteObject?.periodRange && (
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
                      maxDate={new Date(`${currentYear + 1}-01-1`)}
                      label="Fecha de Inicio"
                      inputFormat="DD/MM/YYYY"
                      value={
                        startDate ? startDate : new Date(`${currentYear}-01-02`)
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
                      maxDate={new Date(`${currentYear + 1}-01-1`)}
                      label="Fecha de Fin"
                      inputFormat="DD/MM/YYYY"
                      value={
                        endDate ? endDate : new Date(`${currentYear}-01-02`)
                      }
                      onChange={(newValue) => {
                        if (startDate > newValue) {
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
              {selecteObject?.subPeriods && !selecteObject?.periodRange && (
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
                      paddingLeft: "8px",
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
            disabled={loadingUpdatePeriod}
            variant="standard"
            color="primary"
            size="large"
            onClick={handleUpdatePeriod}
            sx={{
              height: "2.6rem",
              backgroundColor: "#488B8F",
              border: "1.4px solid #63595C",
              borderRadius: "4px",
              ml: "2%",
              mt: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loadingUpdatePeriod ? (
              <CircularProgress
                disableShrink={true}
                size={15}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <>
                <Typography
                  letterSpacing={0}
                  fontSize="0.6vw"
                  fontWeight="bold"
                  color="#FFFFFF"
                >
                  Editar periodo
                </Typography>
                <i
                  style={{
                    color: "#FFFFFF",
                    marginLeft: "0.7rem",
                  }}
                  class="fa-light fa-pen-to-square"
                ></i>
              </>
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
