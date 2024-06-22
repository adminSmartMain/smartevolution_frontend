import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import CitiesSelect from "@components/selects/CitiesSelect";
import CountriesSelect from "@components/selects/CountriesSelect";
import DepartmentSelect from "@components/selects/DepartmentsSelect";
import DocumentTypesSelect from "@components/selects/DocumentTypesSelect";

import emailSchema from "@schemas/emailSchema";
import numberSchema from "@schemas/numberSchema";
import phoneNumberSchema from "@schemas/phoneNumberSchema";
import selectObjectSchema from "@schemas/selectObjectSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";
import DatePicker from "@styles/fields/DatePicker";

import { FormContext } from "@views/self-management/Context";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  ...stringSchema("firstName"),
  ...stringSchema("lastName"),
  ...selectObjectSchema("typeDocument"),
  ...numberSchema("documentNumber"),
  ...stringSchema("dateOfExpedition"),
  ...stringSchema("birthDate"),
  ...selectObjectSchema("country"),
  ...selectObjectSchema("department"),
  ...selectObjectSchema("city"),
  ...stringSchema("address"),
  ...phoneNumberSchema("phone"),
  ...emailSchema("mainEmail"),
  homePhone: Yup.string()
    .nullable()
    .min(0, "El número no puede ser negativo")
    .max(14, "El número no puede tener más de 14 dígitos")
    .matches(/^[0-9]*$/, "El número solo puede contener dígitos"),
});

const BasicInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: data.body.value?.firstName || "",
      lastName: data.body.value?.lastName || "",
      typeDocument: data.body.value?.typeDocument || null,
      documentNumber: data.body.value?.documentNumber || "",
      dateOfExpedition: data.body.value?.dateOfExpedition || null,
      birthDate: data.body.value?.birthDate || null,
      country: data.body.value?.country || null,
      department: data.body.value?.department || null,
      city: data.body.value?.city || null,
      address: data.body.value?.address || "",
      mainEmail: data.body.value?.mainEmail || "",
      phone: data.body.value?.phone || "",
      homePhone: data.body.value?.homePhone || "",
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  useEffect(() => {
    pagination.controls.setControls({
      nextStep: formik.handleSubmit,
      prevStep: () => {
        pagination.controls.changeStep(pagination.step - 1);
      },
    });
  }, []);

  return (
    <Box sx={defaultStepContainerSx}>
      <Box sx={{ pb: 2 }}>
        <Typography sx={{ ...questionParagraphSx, mb: 4.5 }}>
          Sección 1 -<br />
          Información Básica de la Persona
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>NOMBRES</Typography>

            <BaseField
              fullWidth
              id="firstName"
              name="firstName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.firstName)}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              helperText={formik.errors.firstName}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>APELLIDOS</Typography>

            <BaseField
              fullWidth
              id="lastName"
              name="lastName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.lastName)}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              helperText={formik.errors.lastName}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={4} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              TIPO DE DOCUMENTO DE IDENTIDAD
            </Typography>

            <DocumentTypesSelect
              fullWidth
              id="typeDocument"
              name="typeDocument"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.typeDocument)}
              value={formik.values.typeDocument}
              onChange={(evt, value) => {
                formik.setFieldValue("typeDocument", value);
              }}
              helperText={formik.errors.typeDocument}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              NÚMERO DE DOCUMENTO
            </Typography>

            <BaseField
              fullWidth
              id="documentNumber"
              name="documentNumber"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.documentNumber)}
              value={formik.values.documentNumber}
              onChangeMasked={(values) => {
                formik.setFieldValue("documentNumber", values.floatValue);
              }}
              helperText={formik.errors.documentNumber}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              FECHA DE EXPEDICIÓN
            </Typography>

            <DatePicker
              value={formik.values.dateOfExpedition}
              onChange={(date) => {
                formik.setFieldValue(
                  "dateOfExpedition",
                  date?.format("YYYY-MM-DD")
                );
              }}
              error={Boolean(formik.errors.dateOfExpedition)}
              helperText={formik.errors.dateOfExpedition}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              FECHA DE NACIMIENTO
            </Typography>

            <DatePicker
              value={formik.values.birthDate}
              onChange={(date) => {
                formik.setFieldValue("birthDate", date?.format("YYYY-MM-DD"));
              }}
              error={Boolean(formik.errors.birthDate)}
              helperText={formik.errors.birthDate}
              fullWidth
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>NACIONALIDAD</Typography>

            <CountriesSelect
              fullWidth
              id="country"
              name="country"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.country)}
              value={formik.values.country}
              onChange={(evt, value) => {
                formik.setFieldValue("country", value);
              }}
              helperText={formik.errors.country}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={7} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>DEPARTAMENTO</Typography>

            <DepartmentSelect
              fullWidth
              id="department"
              name="department"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.department)}
              value={formik.values.department}
              onChange={(evt, value) => {
                formik.setFieldValue("department", value);
              }}
              helperText={formik.errors.department}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>CIUDAD</Typography>

            <CitiesSelect
              fullWidth
              id="city"
              name="city"
              placeholder="Escriba su respuesta aquí"
              departmentdId={formik.values.department?.value}
              error={Boolean(formik.errors.city)}
              value={formik.values.city}
              onChange={(evt, value) => {
                formik.setFieldValue("city", value);
              }}
              helperText={formik.errors.city}
            />
          </Grid>

          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              DIRECCIÓN PRINCIPAL
            </Typography>

            <BaseField
              fullWidth
              id="address"
              name="address"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.address)}
              value={formik.values.address}
              onChange={formik.handleChange}
              helperText={formik.errors.address}
            />
          </Grid>
          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CORREO ELECTRÓNICO PRINCIPAL
            </Typography>

            <BaseField
              fullWidth
              id="mainEmail"
              name="mainEmail"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.mainEmail)}
              value={formik.values.mainEmail}
              onChange={formik.handleChange}
              helperText={formik.errors.mainEmail}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>TELÉFONO CELULAR</Typography>

            <BaseField
              fullWidth
              id="phone"
              name="phone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.phone)}
              value={formik.values.phone}
              onChangeMasked={(values) => {
                formik.setFieldValue("phone", values.floatValue);
              }}
              helperText={formik.errors.phone}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              TELÉFONO DOMICILIO
            </Typography>

            <BaseField
              fullWidth
              id="homePhone"
              name="homePhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.homePhone)}
              value={formik.values.homePhone}
              onChangeMasked={(values) => {
                formik.setFieldValue("homePhone", values.floatValue);
              }}
              helperText={formik.errors.homePhone}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BasicInformationStep;
