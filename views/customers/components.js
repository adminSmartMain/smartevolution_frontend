import { Fragment, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Button, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import CIIUSelect from "@components/selects/CIIUSelect";
import BrokerSelect from "@components/selects/brokerSelect";
import CitizenshipSelect from "@components/selects/citizenshipSelect";
import CitizenshipSelect2 from "@components/selects/citizenshipSelect2";
import CitySelect from "@components/selects/citySelect";
import CitySelect2 from "@components/selects/citySelect2";
import ClientTypeSelect from "@components/selects/clientTypeSelect";
import DepartmentSelect from "@components/selects/departmentSelect";
import DepartmentSelect2 from "@components/selects/departmentSelect2";
import TypeIDSelect from "@components/selects/typeIdentitySelect";
import TypeIDSelect2 from "@components/selects/typeIdentitySelect2";
import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import LoadingCircle from "@styles/loading";
import scrollSx from "@styles/scroll";

import { ModifyClientQuery } from "./queries";
import { Dialog,DialogContent, CircularProgress } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import dayjs from "dayjs";

export const SignUpClient = ({
  formik,
  option,
  ToastContainer,
  loading,
  enteredBy,
  updatedAt,

  success,
  isModalOpen
}) => {
  const [steps, setSteps] = useState(["Primer paso", "Segundo paso"]);
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [valueD, setValue] = useState(dayjs());
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [valueDate, setValueDate] = useState(dayjs());
  const handleChangeDate = (newValue) => {
    setValueDate(newValue);
  };

  const addContact = () => {
    formik.setFieldValue(
      formik.values.contacts.push({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
      })
    );

  };

  const handleRemoveContact = (index) => {
    formik.values.contacts.splice(index, 1);
    formik.setFieldValue(formik.values.contacts);
  };

  useEffect(() => {
    
    if (
      formik.values.type_client &&
      formik.values.type_client === "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" &&
      steps.length === 2
    ) {
      steps.push("Tercer paso", "Cuarto paso");
      setSteps(steps);
    } else if (
      formik.values.type_client &&
      formik.values.type_client !== "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" &&
      steps.length === 4
    ) {
      steps.pop();
      steps.pop();
      setSteps(steps);
    }
  }, [formik.values.type_client]);
  console.log(formik.values)
  useEffect(() => {
    if (
      formik.errors &&
      Object.keys(formik.errors).length !== 0 &&
      formik.isSubmitting
      
    ) {
      Toast("Faltan campos", "error");
    }
  }, [formik.errors, formik.isSubmitting]);

  return (
    <>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <Fragment>
          <form onSubmit={formik.handleSubmit}>
            {activeStep === 0 &&
              (!loading ? (
                <Box display="flex" flexDirection="column" alignItems="left">
                  <BackButton path="/customers/customerList" />
                  <Typography
                    letterSpacing={0}
                    fontSize="2rem"
                    fontWeight="regular"
                    mb={4}
                    color="#5EA3A3"
                  >
                    {option === "register" && "Registro de nuevo cliente"}
                    {option === "modify" && "Modificacion de cliente"}
                    {option === "preview" && "Visualización de cliente"}
                  </Typography>
                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <Box
                      position="relative"
                      display={option === "preview" ? "flex" : "none"}
                    >
                      <Box width="17vw">
                        <InputTitles>Ingresado Por</InputTitles>
                        <MuiTextField
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option !== "register"}
                          value={enteredBy}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.document_number &&
                            Boolean(formik.errors.document_number)
                          }
                          sx={
                            formik.touched.document_number &&
                            Boolean(formik.errors.document_number)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.document_number &&
                            formik.errors.document_number}
                        </HelperText>
                      </Box>
                      <Box width="17vw" ml={"3rem"}>
                        <InputTitles>Fecha de modificación</InputTitles>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={valueDate}
                            onChange={handleChangeDate}
                            renderInput={(params) => (
                              <MuiTextField
                                id="updatedAt"
                                placeholder="Selecciona la fecha"
                                name="updatedAt"
                                type="date"
                                variant="standard"
                                margin="normal"
                                fullWidth
                                disabled={option === "preview"}
                                value={formik.values.updatedAt}
                                InputProps={{
                                  disableUnderline: true,
                                  sx: {
                                    marginTop: "-5px",
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <TypeIDSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                    <Box ml="3rem" position="relative">
                      <Box width="17vw">
                        <InputTitles>Número de identificación</InputTitles>
                        <MuiTextField
                          id="document_number"
                          placeholder="Ingresa tu identificación"
                          name="document_number"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option !== "register"}
                          value={formik.values.document_number}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.document_number &&
                            Boolean(formik.errors.document_number)
                          }
                          sx={
                            formik.touched.document_number &&
                            Boolean(formik.errors.document_number)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.document_number &&
                            formik.errors.document_number}
                        </HelperText>
                      </Box>
                    </Box>
                  </Box>

                  <Box display="flex" flexDirection="row">
                    <ClientTypeSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                  </Box>

                  {formik.values.type_client ===
                    "26c885fc-2a53-4199-a6c1-7e4e92032696" && (
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <Box width="17vw">
                        <InputTitles>Nombres</InputTitles>
                        <MuiTextField
                          id="first_name"
                          placeholder="Ingresa tu nombre"
                          name="first_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.first_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.first_name &&
                            Boolean(formik.errors.first_name)
                          }
                          sx={
                            formik.touched.first_name &&
                            Boolean(formik.errors.first_name)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.first_name &&
                            formik.errors.first_name}
                        </HelperText>
                      </Box>
                      <Box ml="3rem" width="17vw">
                        <InputTitles>Apellidos</InputTitles>
                        <MuiTextField
                          id="last_name"
                          placeholder="Ingresa tu apellido"
                          name="last_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.last_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.last_name &&
                            Boolean(formik.errors.last_name)
                          }
                          sx={
                            formik.touched.last_name &&
                            Boolean(formik.errors.last_name)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />

                        <HelperText>
                          {formik.touched.last_name && formik.errors.last_name}
                        </HelperText>
                      </Box>
                    </Box>
                  )}
                  {formik.values.type_client ===
                    "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" && (
                    <Box display="flex" flexDirection="row">
                      <Box mb={4} width="calc(34vw + 3rem)">
                        <InputTitles>Razón social</InputTitles>
                        <MuiTextField
                          id="social_reason"
                          placeholder="Ingresa tu razón social"
                          name="social_reason"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.social_reason}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.social_reason &&
                            Boolean(formik.errors.social_reason)
                          }
                          sx={
                            formik.touched.social_reason &&
                            Boolean(formik.errors.social_reason)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.social_reason &&
                            formik.errors.social_reason}
                        </HelperText>
                      </Box>
                    </Box>
                  )}
                  {formik.values.type_client ===
                    "21cf32d9-522c-43ac-b41c-4dfdf832a7b8" && (
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <CIIUSelect
                        formik={formik}
                        disabled={option === "preview"}
                      />
                    </Box>
                  )}

                  <Box display="flex" flexDirection="row" position="relative">
                    <Box width="17vw">
                      <InputTitles>
                        {formik.values.type_client ===
                        "21cf32d9-522c-43ac-b41c-4dfdf832a7b8"
                          ? "Fecha de constitución"
                          : "Fecha de nacimiento"}
                      </InputTitles>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Date desktop"
                          inputFormat="MM/DD/YYYY"
                          value={valueDate}
                          onChange={handleChangeDate}
                          renderInput={(params) => (
                            <MuiTextField
                              id="birth_date"
                              placeholder="Selecciona la fecha"
                              name="birth_date"
                              type="date"
                              variant="standard"
                              margin="normal"
                              fullWidth
                              disabled={option === "preview"}
                              value={formik.values.birth_date}
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  marginTop: "-5px",
                                },
                              }}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.birth_date &&
                                Boolean(formik.errors.birth_date)
                              }
                              sx={
                                formik.touched.birth_date &&
                                Boolean(formik.errors.birth_date)
                                  ? { border: "1.4px solid #E6643180" }
                                  : null
                              }
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <HelperText>
                        {formik.touched.birth_date && formik.errors.birth_date}
                      </HelperText>
                    </Box>

                    <CitizenshipSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                  </Box>
                </Box>
              ) : (
                <LoadingCircle />
              ))}
            {activeStep === 1 && (
              <>
                <Box display="flex" flexDirection="column" alignItems="left">
                  <BackButton path="/customers/customerList" />
                  <Typography
                    letterSpacing={0}
                    fontSize="2rem"
                    fontWeight="regular"
                    mb={4}
                    color="#5EA3A3"
                  >
                    {option === "register" && "Registro de nuevo cliente"}
                    {option === "modify" && "Modificacion de cliente"}
                    {option === "preview" && "Visualización de cliente"}
                  </Typography>

                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <DepartmentSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                    <CitySelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                  </Box>
                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <Box width="calc(34vw + 3rem)">
                      <InputTitles>Dirección</InputTitles>
                      <MuiTextField
                        id="address"
                        placeholder="Ingresa tu dirección"
                        name="address"
                        type="text"
                        variant="standard"
                        margin="normal"
                        fullWidth
                        disabled={option === "preview"}
                        value={formik.values.address}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            marginTop: "-5px",
                          },
                        }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        sx={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                            ? { border: "1.4px solid #E6643180" }
                            : null
                        }
                      />
                      <HelperText>
                        {formik.touched.address && formik.errors.address}
                      </HelperText>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <Box width="17vw">
                      <InputTitles marginBottom={2}>Teléfono</InputTitles>
                      <BaseField
                        fullWidth
                        id="phone_number"
                        name="phone_number"
                        isPatterned
                        format="## ###########"
                        mask="_"
                        disabled={option === "preview"}
                        placeholder="Ingresa tu número de teléfono"
                        error={
                          Boolean(formik.errors.phone_number) &&
                          formik.touched.phone_number
                        }
                        value={formik.values.phone_number}
                        onChangeMasked={(values) => {
                          formik.setFieldValue(
                            "phone_number",
                            values.floatValue
                          );
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="fa-regular fa-plus"></i>
                            </InputAdornment>
                          ),
                        }}
                        helperText={
                          Boolean(formik.errors.phone_number) &&
                          formik.touched.phone_number
                            ? formik.errors.phone_number
                            : null
                        }
                      />
                    </Box>
                    <Box ml="3rem" width="17vw">
                      <InputTitles>Correo electrónico</InputTitles>
                      <MuiTextField
                        id="email"
                        placeholder="Ingresa tu correo electrónico"
                        name="email"
                        type="email"
                        variant="standard"
                        margin="normal"
                        fullWidth
                        disabled={option === "preview"}
                        value={formik.values.email}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            marginTop: "-5px",
                          },
                        }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        sx={
                          formik.touched.email && Boolean(formik.errors.email)
                            ? { border: "1.4px solid #E6643180" }
                            : null
                        }
                      />
                      <HelperText>
                        {formik.touched.email && formik.errors.email}
                      </HelperText>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    mb={4}
                    flexDirection="row"
                    position="relative"
                  >
                    <BrokerSelect
                      formik={formik}
                      disabled={option === "preview"}
                    />
                  </Box>
                </Box>
              </>
            )}
            {activeStep === 2 &&
              (!loading ? (
                <Box display="flex" flexDirection="column" alignItems="left">
                  <BackButton path="/customers/customerList" />

                  <Typography
                    letterSpacing={0}
                    fontSize="2rem"
                    fontWeight="regular"
                    mb={2}
                    color="#5EA3A3"
                  >
                    {option === "register" && "Registro de nuevo cliente"}
                    {option === "modify" && "Modificacion de cliente"}
                    {option === "preview" && "Visualización de cliente"}
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.3rem"
                    fontWeight="500"
                    mb={4}
                    color="#333333"
                  >
                    Datos del representante legal
                  </Typography>
                  <Box display="flex" flexDirection="column">
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <TypeIDSelect2
                        formik={formik}
                        disabled={option === "preview"}
                      />
                      <Box ml="3rem" width="17vw">
                        <InputTitles>Número de identificación</InputTitles>
                        <MuiTextField
                          id="legal_representative.document_number"
                          placeholder="Ingresa su identificación"
                          name="legal_representative.document_number"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={
                            formik.values.legal_representative?.document_number
                          }
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative
                              ?.document_number &&
                            Boolean(
                              formik.errors.legal_representative
                                ?.document_number
                            )
                          }
                          sx={
                            formik.touched.legal_representative
                              ?.document_number &&
                            Boolean(
                              formik.errors.legal_representative
                                ?.document_number
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative
                            ?.document_number &&
                            formik.errors.legal_representative?.document_number}
                        </HelperText>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <Box width="17vw">
                        <InputTitles>Nombres</InputTitles>
                        <MuiTextField
                          id="legal_representative.first_name"
                          placeholder="Ingresa su nombre"
                          name="legal_representative.first_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.legal_representative?.first_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative?.first_name &&
                            Boolean(
                              formik.errors.legal_representative?.first_name
                            )
                          }
                          sx={
                            formik.touched.legal_representative?.first_name &&
                            Boolean(
                              formik.errors.legal_representative?.first_name
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative?.first_name &&
                            formik.errors.legal_representative?.first_name}
                        </HelperText>
                      </Box>
                      <Box ml="3rem" width="17vw">
                        <InputTitles>Apellidos</InputTitles>
                        <MuiTextField
                          id="legal_representative.last_name"
                          placeholder="Ingresa su apellido"
                          name="legal_representative.last_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.legal_representative?.last_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative?.last_name &&
                            Boolean(
                              formik.errors.legal_representative?.last_name
                            )
                          }
                          sx={
                            formik.touched.legal_representative?.last_name &&
                            Boolean(
                              formik.errors.legal_representative?.last_name
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative?.last_name &&
                            formik.errors.legal_representative?.last_name}
                        </HelperText>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <Box width="17vw">
                        <InputTitles>Fecha de nacimiento</InputTitles>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={valueD}
                            onChange={handleChange}
                            renderInput={(params) => (
                              <MuiTextField
                                id="legal_representative.birth_date"
                                placeholder="Ingresa la fecha"
                                name="legal_representative.birth_date"
                                type="date"
                                variant="standard"
                                margin="normal"
                                fullWidth
                                disabled={option === "preview"}
                                value={
                                  formik.values.legal_representative?.birth_date
                                }
                                InputProps={{
                                  disableUnderline: true,
                                  sx: {
                                    marginTop: "-5px",
                                  },
                                }}
                                onChange={formik.handleChange}
                                error={
                                  formik.touched.legal_representative
                                    ?.birth_date &&
                                  Boolean(
                                    formik.errors.legal_representative
                                      ?.birth_date
                                  )
                                }
                                sx={
                                  formik.touched.legal_representative
                                    ?.birth_date &&
                                  Boolean(
                                    formik.errors.legal_representative
                                      ?.birth_date
                                  )
                                    ? { border: "1.4px solid #E6643180" }
                                    : null
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>

                        <HelperText>
                          {formik.touched.legal_representative?.birth_date &&
                            formik.errors.legal_representative?.birth_date}
                        </HelperText>
                      </Box>
                      <Box ml="3rem" width="17vw">
                        <InputTitles>Dirección</InputTitles>
                        <MuiTextField
                          id="legal_representative.address"
                          placeholder="Ingresa su dirección"
                          name="legal_representative.address"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.legal_representative?.address}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative?.address &&
                            Boolean(formik.errors.legal_representative?.address)
                          }
                          sx={
                            formik.touched.legal_representative?.address &&
                            Boolean(formik.errors.legal_representative?.address)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative?.address &&
                            formik.errors.legal_representative?.address}
                        </HelperText>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <Box width="17vw">
                        <InputTitles marginBottom={2}>Teléfono</InputTitles>
                        <BaseField
                          fullWidth
                          id="legal_representative.phone_number"
                          name="legal_representative.phone_number"
                          isPatterned
                          format="## ###########"
                          mask="_"
                          disabled={option === "preview"}
                          placeholder="Ingresa tu número de teléfono"
                          error={
                            Boolean(
                              formik.errors.legal_representative?.phone_number
                            ) &&
                            formik.touched.legal_representative?.phone_number
                          }
                          value={
                            formik.values.legal_representative?.phone_number
                          }
                          onChangeMasked={(values) => {
                            formik.setFieldValue(
                              "legal_representative.phone_number",
                              values.floatValue
                            );
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <i className="fa-regular fa-plus"></i>
                              </InputAdornment>
                            ),
                          }}
                          helperText={
                            Boolean(
                              formik.errors.legal_representative?.phone_number
                            ) &&
                            formik.touched.legal_representative?.phone_number
                              ? formik.errors.legal_representative?.phone_number
                              : null
                          }
                        />
                      </Box>
                      <Box ml="3rem" width="17vw">
                        <InputTitles>Correo electrónico</InputTitles>
                        <MuiTextField
                          id="legal_representative.email"
                          placeholder="Ingresa su correo electrónico"
                          name="legal_representative.email"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.legal_representative?.email}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative?.email &&
                            Boolean(formik.errors.legal_representative?.email)
                          }
                          sx={
                            formik.touched.legal_representative?.email &&
                            Boolean(formik.errors.legal_representative?.email)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative?.email &&
                            formik.errors.legal_representative?.email}
                        </HelperText>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <DepartmentSelect2
                        formik={formik}
                        disabled={option === "preview"}
                      />
                      <CitySelect2
                        formik={formik}
                        disabled={option === "preview"}
                      />
                    </Box>
                    <Box
                      display="flex"
                      mb={4}
                      flexDirection="row"
                      position="relative"
                    >
                      <Box width="17vw">
                        <InputTitles>Cargo</InputTitles>
                        <MuiTextField
                          id="legal_representative.position"
                          placeholder="Ingresa su cargo"
                          name="legal_representative.position"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik.values.legal_representative?.position}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.legal_representative?.position &&
                            Boolean(
                              formik.errors.legal_representative?.position
                            )
                          }
                          sx={
                            formik.touched.legal_representative?.position &&
                            Boolean(
                              formik.errors.legal_representative?.position
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik.touched.legal_representative?.position &&
                            formik.errors.legal_representative?.position}
                        </HelperText>
                      </Box>
                      <CitizenshipSelect2
                        formik={formik}
                        disabled={option === "preview"}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <LoadingCircle />
              ))}
            {activeStep === 3 &&
              (!loading ? (
                <Box display="flex" flexDirection="column" alignItems="left">
                  <BackButton path="/customers/customerList" />

                  <Typography
                    letterSpacing={0}
                    fontSize="2rem"
                    fontWeight="regular"
                    mb={2}
                    color="#5EA3A3"
                  >
                    {option === "register" && "Registro de nuevo cliente"}
                    {option === "modify" && "Modificacion de cliente"}
                    {option === "preview" && "Visualización de cliente"}
                  </Typography>
                  <Typography
                    letterSpacing={0}
                    fontSize="1.3rem"
                    fontWeight="500"
                    mb={4}
                    color="#333333"
                  >
                    Datos de contacto
                  </Typography>
                  {formik.values.contacts?.map((contact, index) => (
                    <Box
                      display="flex"
                      flexDirection="column"
                      mb={4}
                      key={index}
                    >
                      <Box display="flex" flexDirection="row" mb={4}>
                        <Typography
                          letterSpacing={0}
                          fontSize="1.3rem"
                          fontWeight="600"
                          color="#5EA3A3"
                        >
                          Contacto {index + 1}
                        </Typography>
                        <Button
                          sx={{ ml: "1rem" }}
                          onClick={() => handleRemoveContact(index)}
                          disabled={
                            option === "preview" ||
                            formik.values.contacts.length === 1
                          }
                        >
                          <i
                            className="fa-regular fa-trash"
                            style={{
                              color:
                                option === "preview" ||
                                formik.values.contacts.length === 1
                                  ? ""
                                  : "#5EA3A3",
                              fontSize: "1rem",
                            }}
                          ></i>
                        </Button>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        position="relative"
                        mb={4}
                      >
                        <Box width="17vw">
                          <InputTitles>Nombres</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.first_name`}
                            placeholder="Ingresa su nombre"
                            name={`contacts.${index}.first_name`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.first_name}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.contacts?.[index]?.first_name &&
                              Boolean(
                                formik.errors.contacts?.[index]?.first_name
                              )
                            }
                            sx={
                              formik.touched.contacts?.[index]?.first_name &&
                              Boolean(
                                formik.errors.contacts?.[index]?.first_name
                              )
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik.touched.contacts?.[index]?.first_name &&
                              formik.errors.contacts?.[index]?.first_name}
                          </HelperText>
                        </Box>
                        <Box width="17vw" ml="3%">
                          <InputTitles>Apellidos</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.last_name`}
                            placeholder="Ingresa su apellido"
                            name={`contacts.${index}.last_name`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.last_name}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.contacts?.[index]?.last_name &&
                              Boolean(
                                formik.errors.contacts?.[index]?.last_name
                              )
                            }
                            sx={
                              formik.touched.contacts?.[index]?.last_name &&
                              Boolean(
                                formik.errors.contacts?.[index]?.last_name
                              )
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik.touched.contacts?.[index]?.last_name &&
                              formik.errors.contacts?.[index]?.last_name}
                          </HelperText>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        position="relative"
                        mb={4}
                      >
                        <Box width="17vw">
                          <InputTitles>Teléfono</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.phone_number`}
                            placeholder="Ingresa su teléfono"
                            name={`contacts.${index}.phone_number`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.phone_number}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.contacts?.[index]?.phone_number &&
                              Boolean(
                                formik.errors.contacts?.[index]?.phone_number
                              )
                            }
                            sx={
                              formik.touched.contacts?.[index]?.phone_number &&
                              Boolean(
                                formik.errors.contacts?.[index]?.phone_number
                              )
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik.touched.contacts?.[index]?.phone_number &&
                              formik.errors.contacts?.[index]?.phone_number}
                          </HelperText>
                        </Box>
                        <Box width="17vw" ml="3%">
                          <InputTitles>Correo electrónico</InputTitles>
                          <MuiTextField
                            id={`contacts.${index}.email`}
                            placeholder="Ingresa su correo electrónico"
                            name={`contacts.${index}.email`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.email}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.contacts?.[index]?.email &&
                              Boolean(formik.errors.contacts?.[index]?.email)
                            }
                            sx={
                              formik.touched.contacts?.[index]?.email &&
                              Boolean(formik.errors.contacts?.[index]?.email)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik.touched.contacts?.[index]?.email &&
                              formik.errors.contacts?.[index]?.email}
                          </HelperText>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        position="relative"
                      >
                        <Box width="calc(34vw + 3%)">
                          <InputTitles>Cargo</InputTitles>

                          <MuiTextField
                            id={`contacts.${index}.position`}
                            placeholder="Ingresa su teléfono"
                            name={`contacts.${index}.position`}
                            type="text"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            disabled={option === "preview"}
                            value={contact.position}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                marginTop: "-5px",
                              },
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.contacts?.[index]?.position &&
                              Boolean(formik.errors.contacts?.[index]?.position)
                            }
                            sx={
                              formik.touched.contacts?.[index]?.position &&
                              Boolean(formik.errors.contacts?.[index]?.position)
                                ? { border: "1.4px solid #E6643180" }
                                : null
                            }
                          />
                          <HelperText>
                            {formik.touched.contacts?.[index]?.position &&
                              formik.errors.contacts?.[index]?.position}
                          </HelperText>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  <Button
                    onClick={addContact}
                    variant="standard"
                    startIcon={<i className="far fa-circle-plus" />}
                    sx={{
                      color: "#5EA3A3",
                      backgroundColor: "#5EA3A31A",
                      borderRadius: "4px",
                      width: "calc(34vw + 4rem)",
                      boxShadow: "none",
                      textTransform: "none",
                      fontWeight: "600",
                      "& .MuiButton-startIcon i": {
                        fontSize: "16px",
                      },
                    }}
                    disabled={option === "preview"}
                  >
                    Agregar contacto
                  </Button>
                </Box>
              ) : (
                <LoadingCircle />
              ))}
          </form>
          {loading ? (
            <></>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "calc(34vw + 4rem)",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <MuiButton
                  variant="standard"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    borderRadius: "4px",
                    "&:disabled": {
                      color: "#999999",
                      backgroundColor: "#CECECE",
                    },
                  }}
                >
                  <Typography
                    fontFamily="icomoon"
                    sx={{
                      color: "#fff",
                      mr: 2,
                      fontSize: "medium",
                      transform: "rotate(180deg)",
                    }}
                  >
                    &#xe91f;
                  </Typography>
                  <Typography fontSize="90%" fontWeight="bold">
                    Atrás
                  </Typography>
                </MuiButton>
              </Box>
              <Box flexGrow={1} />
              <Box>
                {activeStep === steps.length - 1 ? (
                  option === "register" || option === "modify" ? (
                    <MuiButton
                      type="submit"
                      onClick={formik.handleSubmit}
                      sx={{
                        mb: 2,
                        boxShadow: "none",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography fontSize="90%" fontWeight="bold">
                        {option === "register" && "Registrar"}
                        {option === "modify" && "Modificar"}
                      </Typography>
                      <Typography
                        fontFamily="icomoon"
                        sx={{
                          color: "#fff",
                          ml: 2,
                          fontSize: "medium",
                        }}
                      >
                        &#xe91f;
                      </Typography>
                    </MuiButton>
                  ) : (
                    <MuiButton
                      onClick={() => console.log('')}
                      sx={{
                        mb: 2,
                        boxShadow: "none",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography fontSize="90%" fontWeight="bold">
                        Volver a clientes
                      </Typography>
                      <Typography
                        fontFamily="icomoon"
                        sx={{
                          color: "#fff",
                          ml: 2,
                          fontSize: "medium",
                        }}
                      >
                        &#xe91f;
                      </Typography>
                    </MuiButton>
                  )
                ) : (
                  <MuiButton
                    onClick={handleNext}
                    sx={{
                      mb: 2,
                      boxShadow: "none",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography fontSize="90%" fontWeight="bold" color="#fff">
                      Siguiente
                    </Typography>

                    <Typography
                      fontFamily="icomoon"
                      sx={{
                        color: "#fff",
                        ml: 2,
                        fontSize: "medium",
                      }}
                    >
                      &#xe91f;
                    </Typography>
                  </MuiButton>
                )}
              </Box>
            </Box>
          )}
        </Fragment>

         {/* MODAL DE PROCESO */}
            <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
              <DialogContent>
                {success === null ? (
                  <>
                    <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
                    <Typography variant="h6">Procesando...</Typography>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
                    <Typography variant="h5" color="success.main">
                      {option === "register" && "¡Registro Exitoso!"}
                      {option === "modify" && "¡El cliente se ha modificado con éxito!"}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
                    <Typography variant="h5" color="error.main">
                      {option === "register" && "Error al Registrar"}
                      {option === "modify" && "Error al Modificar"}
                    </Typography>
                  </>
                )}
              </DialogContent>
            </Dialog>
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
