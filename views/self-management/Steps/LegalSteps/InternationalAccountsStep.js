import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";
import CountriesSelect from "@components/selects/CountriesSelect";

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
  foreignAccount: Yup.bool().required("Selecciona una opción").nullable(),

  typeForeignAccount: Yup.string()
    .nullable()
    .when("foreignAccount", {
      is: true,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),

  foreignAccountNumber: Yup.number().when("foreignAccount", {
    is: true,
    then: Yup.number().required("Campo obligatorio"),
  }),

  foreignAccountInstitution: Yup.string()
    .nullable()
    .when("foreignAccount", {
      is: true,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),

  foreignAccountCountry: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .defined()
    .when("foreignAccount", {
      is: true,
      then: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      })
        .defined()
        .required("Campo obligatorio"),
    }),

  foreignAccountCurrency: Yup.string()
    .nullable()
    .when("foreignAccount", {
      is: true,
      then: Yup.string().nullable().required("Campo obligatorio"),
    }),
});

const InternationalAccountsStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({
      ...data.body.value,
      ...{
        ...values,
        ...(!values.foreignAccount && {
          typeForeignAccount: null,
          foreignAccountNumber: null,
          foreignAccountInstitution: null,
          foreignAccountCountry: null,
          foreignAccountCurrency: null,
        }),
      },
    });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      foreignAccount: data.body.value?.foreignAccount ?? null,
      typeForeignAccount: data.body.value?.typeForeignAccount || "",
      foreignAccountNumber: data.body.value?.foreignAccountNumber || "",
      foreignAccountInstitution:
        data.body.value?.foreignAccountInstitution || "",
      foreignAccountCountry: data.body.value?.foreignAccountCountry || null,
      foreignAccountCurrency: data.body.value?.foreignAccountCurrency || "",
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const hasForeginAccount = formik?.values?.foreignAccount;

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
          Sección 6 -<br /> Información de Cuentas en Moneda Extranjera
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POSEE CUENTAS EN MONEDA EXTRANJERA?
            </Typography>

            <RadioGroup
              value={formik.values.foreignAccount}
              error={Boolean(formik.errors.foreignAccount)}
              helperText={formik.errors.foreignAccount}
              handleChange={(evt, value) => {
                formik.setFieldValue("foreignAccount", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {hasForeginAccount && (
            <>
              {!isXs && <Grid item sm={1} md={6} />}

              <Grid item xs={12} sm={11} md={5}>
                <Typography sx={{ ...questionTextSx }}>
                  TIPO DE CUENTA
                </Typography>

                <RadioGroup
                  value={formik.values.typeForeignAccount}
                  error={Boolean(formik.errors.typeForeignAccount)}
                  helperText={formik.errors.typeForeignAccount}
                  handleChange={(evt, value) => {
                    formik.setFieldValue("typeForeignAccount", value);
                  }}
                >
                  <Element label="Ahorro" value={"Ahorro"} />
                  <Element label="Corriente" value={"Corriente"} />
                  <Element label="Otra" value={"Otra"} />
                </RadioGroup>
              </Grid>

              {!isXs && <Grid item sm={1} md={7} />}

              <Grid item xs={12} sm={11} md={5}>
                <Typography sx={{ ...questionTextSx }}>
                  NÚMERO DE CUENTA
                </Typography>

                <BaseField
                  fullWidth
                  id="foreignAccountNumber"
                  name="foreignAccountNumber"
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.foreignAccountNumber)}
                  value={formik.values.foreignAccountNumber}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      "foreignAccountNumber",
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.foreignAccountNumber}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={7} />}

              <Grid item xs={12} sm={11} md={5}>
                <Typography sx={{ ...questionTextSx }}>
                  NOMBRE DE LA INSTITUCIÓN FINANCIERA
                </Typography>

                <BaseField
                  fullWidth
                  id="foreignAccountInstitution"
                  name="foreignAccountInstitution"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.foreignAccountInstitution)}
                  value={formik.values.foreignAccountInstitution}
                  onChange={formik.handleChange}
                  helperText={formik.errors.foreignAccountInstitution}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={7} />}

              <Grid item xs={12} sm={11} md={5}>
                <Typography sx={{ ...questionTextSx }}>PAÍS</Typography>

                <CountriesSelect
                  fullWidth
                  id="foreignAccountCountry"
                  name="foreignAccountCountry"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.foreignAccountCountry)}
                  value={formik.values.foreignAccountCountry}
                  onChange={(evt, value) => {
                    formik.setFieldValue("foreignAccountCountry", value);
                  }}
                  helperText={formik.errors.foreignAccountCountry}
                />
              </Grid>

              {!isXs && <Grid item sm={1} md={7} />}

              <Grid item xs={12} sm={11} md={5}>
                <Typography sx={{ ...questionTextSx }}>MONEDA</Typography>

                <BaseField
                  fullWidth
                  id="foreignAccountCurrency"
                  name="foreignAccountCurrency"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.foreignAccountCurrency)}
                  value={formik.values.foreignAccountCurrency}
                  onChange={formik.handleChange}
                  helperText={formik.errors.foreignAccountCurrency}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default InternationalAccountsStep;
