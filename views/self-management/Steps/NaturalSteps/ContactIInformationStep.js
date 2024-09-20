import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import CitiesSelect from "@components/selects/CitiesSelect";
import DepartmentSelect from "@components/selects/DepartmentsSelect";

import phoneNumberSchema from "@schemas/phoneNumberSchema";
import selectObjectSchema from "@schemas/selectObjectSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";

import { FormContext } from "@views/self-management/Context";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  ...stringSchema("referenceFirstName"),
  ...stringSchema("referenceLastName"),
  ...phoneNumberSchema("referencePhone"),
  ...selectObjectSchema("referenceDepartment"),
  ...selectObjectSchema("referenceCity"),
  ...stringSchema("referenceCompany"),
  ...stringSchema("referenceBank"),
  referenceBankPhone: Yup.number().nullable(),
  ...stringSchema("referenceBankProduct"),
  ...selectObjectSchema("referenceBankDepartment"),
  ...selectObjectSchema("referenceBankCity"),
});

const ContactIInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      referenceFirstName: data.body.value?.referenceFirstName || "",
      referenceLastName: data.body.value?.referenceLastName || "",
      referencePhone: data.body.value?.referencePhone || "",
      referenceDepartment: data.body.value?.referenceDepartment || null,
      referenceCity: data.body.value?.referenceCity || null,
      referenceCompany: data.body.value?.referenceCompany || "",
      referenceBank: data.body.value?.referenceBank || null,
      referenceBankPhone: data.body.value?.referenceBankPhone || "",
      referenceBankProduct: data.body.value?.referenceBankProduct || "",
      referenceBankDepartment: data.body.value?.referenceBankDepartment || null,
      referenceBankCity: data.body.value?.referenceBankCity || null,
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
          Sección 4 -<br />
          Referencias
        </Typography>
        <Typography sx={{ ...questionParagraphSx, mb: 4.5 }}>
          Referencias Personales
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>NOMBRE</Typography>

            <BaseField
              fullWidth
              id="referenceFirstName"
              name="referenceFirstName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceFirstName)}
              value={formik.values.referenceFirstName}
              onChange={formik.handleChange}
              helperText={formik.errors.referenceFirstName}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>APELLIDO</Typography>

            <BaseField
              fullWidth
              id="referenceLastName"
              name="referenceLastName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceLastName)}
              value={formik.values.referenceLastName}
              onChange={formik.handleChange}
              helperText={formik.errors.referenceLastName}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={4} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>TELÉFONO</Typography>

            <BaseField
              fullWidth
              id="referencePhone"
              name="referencePhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referencePhone)}
              value={formik.values.referencePhone}
              onChangeMasked={(values) => {
                formik.setFieldValue("referencePhone", values.floatValue);
              }}
              helperText={formik.errors.referencePhone}
            />
          </Grid>

          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>EMPRESA</Typography>

            <BaseField
              fullWidth
              id="referenceCompany"
              name="referenceCompany"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceCompany)}
              value={formik.values.referenceCompany}
              onChange={formik.handleChange}
              helperText={formik.errors.referenceCompany}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>DEPARTAMENTO</Typography>

            <DepartmentSelect
              fullWidth
              id="referenceDepartment"
              name="referenceDepartment"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceDepartment)}
              value={formik.values.referenceDepartment}
              onChange={(evt, value) => {
                formik.setFieldValue("referenceDepartment", value);
              }}
              helperText={formik.errors.referenceDepartment}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>CIUDAD</Typography>

            <CitiesSelect
              fullWidth
              id="referenceCity"
              name="referenceCity"
              placeholder="Escriba su respuesta aquí"
              departmentdId={formik.values.referenceDepartment?.value}
              error={Boolean(formik.errors.referenceCity)}
              value={formik.values.referenceCity}
              onChange={(evt, value) => {
                formik.setFieldValue("referenceCity", value);
              }}
              helperText={formik.errors.referenceCity}
            />
          </Grid>

          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionParagraphSx, mb: 4 }}>
              Referencias Bancarias
            </Typography>
          </Grid>
          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>INSTITUCIÓN</Typography>

            <BaseField
              fullWidth
              id="referenceBank"
              name="referenceBank"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceBank)}
              value={formik.values.referenceBank}
              onChange={formik.handleChange}
              helperText={formik.errors.referenceBank}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>TELÉFONO</Typography>

            <BaseField
              fullWidth
              id="referenceBankPhone"
              name="referenceBankPhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceBankPhone)}
              value={formik.values.referenceBankPhone}
              onChangeMasked={(values) => {
                formik.setFieldValue("referenceBankPhone", values.floatValue);
              }}
              helperText={formik.errors.referenceBankPhone}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>PRODUCTO</Typography>

            <BaseField
              fullWidth
              id="referenceBankProduct"
              name="referenceBankProduct"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceBankProduct)}
              value={formik.values.referenceBankProduct}
              onChange={formik.handleChange}
              helperText={formik.errors.referenceBankProduct}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>DEPARTAMENTO</Typography>

            <DepartmentSelect
              fullWidth
              id="referenceBankDepartment"
              name="referenceBankDepartment"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.referenceBankDepartment)}
              value={formik.values.referenceBankDepartment}
              onChange={(evt, value) => {
                formik.setFieldValue("referenceBankDepartment", value);
              }}
              helperText={formik.errors.referenceBankDepartment}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>CIUDAD</Typography>

            <CitiesSelect
              fullWidth
              id="referenceBankCity"
              name="referenceBankCity"
              placeholder="Escriba su respuesta aquí"
              departmentdId={formik.values.referenceBankDepartment?.value}
              error={Boolean(formik.errors.referenceBankCity)}
              value={formik.values.referenceBankCity}
              onChange={(evt, value) => {
                formik.setFieldValue("referenceBankCity", value);
              }}
              helperText={formik.errors.referenceBankCity}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ContactIInformationStep;
