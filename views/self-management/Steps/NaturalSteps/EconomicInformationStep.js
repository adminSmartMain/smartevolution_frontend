import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";
import CIIUsSelect from "@components/selects/CIIUsSelect";
import CitiesSelect from "@components/selects/CitiesSelect";
import DepartmentSelect from "@components/selects/DepartmentsSelect";

import numberSchema from "@schemas/numberSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";

import { FormContext } from "@views/self-management/Context";
import Hint from "@views/self-management/Hint";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  activity: Yup.number().required("Campo obligatorio"),
  profession: Yup.string().nullable().required("Campo obligatorio"),

  companyName: Yup.string()
    .nullable()
    .when("activity", {
      is: 0,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),

  activityType: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .when("activity", {
      is: 0,
      then: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      })
        .defined()
        .required("Campo obligatorio"),
    }),
  position: Yup.string()
    .nullable()
    .when("activity", {
      is: 0,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),
  companyPhone: Yup.number().when("activity", {
    is: 0,
    then: Yup.number()
      .required("Campo obligatorio")
      .test(
        "len",
        "Formato de número inválido",
        (val) => val?.toString()?.length > 0 && val?.toString()?.length < 14
      ),
  }),
  companyDepartment: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .when("activity", {
      is: 0,
      then: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      })
        .defined()
        .required("Campo obligatorio"),
    }),
  companyCity: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .when("activity", {
      is: 0,
      then: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      })
        .defined()
        .required("Campo obligatorio"),
    }),
  companyAddress: Yup.string()
    .nullable()
    .when("activity", {
      is: 0,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),

  ciiu: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .required("Campo obligatorio"),
  secondaryCiiu: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .required("Campo obligatorio"),
  typeProducts: Yup.string()
    .nullable()
    .when("activity", {
      is: 1,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),

  ...numberSchema("mensualIncome"),
  ...numberSchema("mensualExpenses"),
  ...numberSchema("assets"),
  ...numberSchema("passives"),
  ...numberSchema("patrimony"),

  otherIncome: Yup.number().nullable(),
  conceptOtherIncome: Yup.string().nullable(),
});

const EconomicInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({
      ...data.body.value,
      ...{
        ...values,
        ...(values.activity !== 0 && {
          companyName: null,
          activityType: null,
          position: null,
          companyPhone: null,
          companyDepartment: null,
          companyCity: null,
          companyAddress: null,
        }),
        ...(values.activity !== 1 && {
          typeProducts: null,
        }),
      },
    });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      activity: data.body.value?.activity ?? null,
      profession: data.body.value?.profession || "",

      companyName: data.body.value?.companyName || "",
      activityType: data.body.value?.activityType || null,
      position: data.body.value?.position || "",
      companyPhone: data.body.value?.companyPhone || "",
      companyDepartment: data.body.value?.companyDepartment || null,
      companyCity: data.body.value?.companyCity || null,
      companyAddress: data.body.value?.companyAddress || "",

      ciiu: data.body.value?.ciiu || null,
      secondaryCiiu: data.body.value?.secondaryCiiu || null,
      typeProducts: data.body.value?.typeProducts || "",

      mensualIncome: data.body.value?.mensualIncome || "",
      mensualExpenses: data.body.value?.mensualExpenses || "",
      assets: data.body.value?.assets || "",
      passives: data.body.value?.passives || "",
      patrimony: data.body.value?.patrimony || "",
      otherIncome: data.body.value?.otherIncome || "",
      conceptOtherIncome: data.body.value?.conceptOtherIncome || "",
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const isEmployee = formik?.values?.activity === 0;
  const isIndependant = formik?.values?.activity === 1;

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
          Sección 2 -<br /> Información de Económica
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              TIPO DE ACTIVIDAD
            </Typography>

            <RadioGroup
              value={formik.values.activity}
              error={Boolean(formik.errors.activity)}
              helperText={formik.errors.activity}
              handleChange={(evt, value) => {
                formik.setFieldValue("activity", Number(value));
              }}
            >
              <Element label="Empleado" value={0} />
              <Element label="Independiente" value={1} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>PROFESIÓN</Typography>

            <BaseField
              fullWidth
              id="profession"
              name="profession"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.profession)}
              value={formik.values.profession}
              onChange={formik.handleChange}
              helperText={formik.errors.profession}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={8} />}

          {isEmployee && (
            <>
              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>
                  NOMBRE DE LA EMPRESA
                </Typography>

                <BaseField
                  fullWidth
                  id="companyName"
                  name="companyName"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.companyName)}
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  helperText={formik.errors.companyName}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={8} />}

              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>
                  ACTIVIDAD DE LA EMPRESA
                </Typography>

                <CIIUsSelect
                  fullWidth
                  id="activityType"
                  name="activityType"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.activityType)}
                  value={formik.values.activityType}
                  onChange={(evt, value) => {
                    formik.setFieldValue("activityType", value);
                  }}
                  helperText={formik.errors.activityType}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={8} />}

              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>CARGO</Typography>

                <BaseField
                  fullWidth
                  id="position"
                  name="position"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.position)}
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  helperText={formik.errors.position}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={8} />}

              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>
                  TELÉFONO DE EMPRESA
                </Typography>

                <BaseField
                  fullWidth
                  id="companyPhone"
                  name="companyPhone"
                  isPatterned
                  format="## ###########"
                  mask="X"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.companyPhone)}
                  value={formik.values.companyPhone}
                  onChangeMasked={(values) => {
                    formik.setFieldValue("companyPhone", values.floatValue);
                  }}
                  helperText={formik.errors.companyPhone}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={8} />}

              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>
                  DEPARTAMENTO DE EMPRESA
                </Typography>

                <DepartmentSelect
                  fullWidth
                  id="companyDepartment"
                  name="companyDepartment"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.companyDepartment)}
                  value={formik.values.companyDepartment}
                  onChange={(evt, value) => {
                    formik.setFieldValue("companyDepartment", value);
                  }}
                  helperText={formik.errors.companyDepartment}
                />
              </Grid>

              <Grid item xs={12} sm={11} md={4}>
                <Typography sx={{ ...questionTextSx }}>
                  CIUDAD DE EMPRESA
                </Typography>

                <CitiesSelect
                  fullWidth
                  id="companyCity"
                  name="companyCity"
                  placeholder="Escriba su respuesta aquí"
                  departmentdId={formik.values.companyDepartment?.value}
                  error={Boolean(formik.errors.companyCity)}
                  value={formik.values.companyCity}
                  onChange={(evt, value) => {
                    formik.setFieldValue("companyCity", value);
                  }}
                  helperText={formik.errors.companyCity}
                />
              </Grid>

              {!isXs && <Grid item md={4} />}

              <Grid item xs={12} sm={11} md={6}>
                <Typography sx={{ ...questionTextSx }}>
                  DIRECCIÓN DE EMPRESA
                </Typography>

                <BaseField
                  fullWidth
                  id="companyAddress"
                  name="companyAddress"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.companyAddress)}
                  value={formik.values.companyAddress}
                  onChange={formik.handleChange}
                  helperText={formik.errors.companyAddress}
                />
              </Grid>

              {!isXs && <Grid item md={4} />}
            </>
          )}

          <>
            <Grid item xs={12} sm={11} md={4}>
              <Typography sx={{ ...questionTextSx }}>
                ACTIVIDAD ECONÓMICA PRINCIPAL
              </Typography>

              <CIIUsSelect
                fullWidth
                id="ciiu"
                name="ciiu"
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.ciiu)}
                value={formik.values.ciiu}
                onChange={(evt, value) => {
                  formik.setFieldValue("ciiu", value);
                }}
                helperText={formik.errors.ciiu}
              />
            </Grid>

            {!isXs && <Grid item sm={1} md={8} />}

            <Grid item xs={12} sm={11} md={4}>
              <Typography sx={{ ...questionTextSx }}>
                ACTIVIDAD ECONÓMICA SECUNDARIA
              </Typography>

              <CIIUsSelect
                fullWidth
                id="secondaryCiiu"
                name="secondaryCiiu"
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.secondaryCiiu)}
                value={formik.values.secondaryCiiu}
                onChange={(evt, value) => {
                  formik.setFieldValue("secondaryCiiu", value);
                }}
                helperText={formik.errors.secondaryCiiu}
              />
            </Grid>

            {!isXs && <Grid item sm={1} md={8} />}

            <Grid item xs={12} sm={11} md={6}>
              <Typography sx={{ ...questionTextSx }}>
                TIPO DE PRODUCTOS O SERVICIOS QUE COMERCIALIZA
              </Typography>

              <BaseField
                fullWidth
                id="typeProducts"
                name="typeProducts"
                placeholder="Escriba su respuesta aquí"
                error={Boolean(formik.errors.typeProducts)}
                value={formik.values.typeProducts}
                onChange={formik.handleChange}
                helperText={formik.errors.typeProducts}
              />
            </Grid>

            {!isXs && <Grid item sm={1} md={6} />}
          </>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              INGRESOS MENSUALES
            </Typography>

            <BaseField
              fullWidth
              id="mensualIncome"
              name="mensualIncome"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.mensualIncome)}
              value={formik.values.mensualIncome}
              onChangeMasked={(values) => {
                formik.setFieldValue("mensualIncome", values.floatValue);
              }}
              helperText={formik.errors.mensualIncome}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              EGRESOS MENSUALES
            </Typography>

            <BaseField
              fullWidth
              id="mensualExpenses"
              name="mensualExpenses"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.mensualExpenses)}
              value={formik.values.mensualExpenses}
              onChangeMasked={(values) => {
                formik.setFieldValue("mensualExpenses", values.floatValue);
              }}
              helperText={formik.errors.mensualExpenses}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={4} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>ACTIVOS</Typography>

            <BaseField
              fullWidth
              id="assets"
              name="assets"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.assets)}
              value={formik.values.assets}
              onChangeMasked={(values) => {
                formik.setFieldValue("assets", values.floatValue);
              }}
              helperText={formik.errors.assets}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>PASIVOS</Typography>

            <BaseField
              fullWidth
              id="passives"
              name="passives"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.passives)}
              value={formik.values.passives}
              onChangeMasked={(values) => {
                formik.setFieldValue("passives", values.floatValue);
              }}
              helperText={formik.errors.passives}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={4} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>PATRIMONIO</Typography>

            <BaseField
              fullWidth
              id="patrimony"
              name="patrimony"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.patrimony)}
              value={formik.values.patrimony}
              onChangeMasked={(values) => {
                formik.setFieldValue("patrimony", values.floatValue);
              }}
              helperText={formik.errors.patrimony}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>OTROS INGRESOS</Typography>

            <BaseField
              fullWidth
              id="otherIncome"
              name="otherIncome"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.otherIncome)}
              value={formik.values.otherIncome}
              onChangeMasked={(values) => {
                formik.setFieldValue("otherIncome", values.floatValue);
              }}
              helperText={formik.errors.otherIncome}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={4} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CONCEPTO DE OTROS INGRESOS
            </Typography>

            <BaseField
              fullWidth
              id="conceptOtherIncome"
              name="conceptOtherIncome"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.conceptOtherIncome)}
              value={formik.values.conceptOtherIncome}
              onChange={formik.handleChange}
              helperText={formik.errors.conceptOtherIncome}
              inputProps={{ maxLength: 40 }}
            />
            <Hint show={!formik.errors.conceptOtherIncome}>
              Máximo 40 caracteres
            </Hint>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EconomicInformationStep;
