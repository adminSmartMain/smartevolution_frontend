import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";

import radioGroupSchema from "@schemas/radioGroupSchema";
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
  ...radioGroupSchema("publicResources", "bool"),
  ...radioGroupSchema("publicPower", "bool"),
  ...radioGroupSchema("publicAcknowledgment", "bool"),
  ...radioGroupSchema("publicPersonLink", "bool"),
  ...stringSchema("publicPersonLinkDescription"),
  ...radioGroupSchema("foreignCountryTax", "bool"),
  ...stringSchema("foreignCountryTaxDescription"),
});

const PolitictsInvolvementStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      publicResources: data.body.value?.publicResources ?? null,
      publicPower: data.body.value?.publicPower ?? null,
      publicAcknowledgment: data.body.value?.publicAcknowledgment ?? null,
      publicPersonLink: data.body.value?.publicPersonLink ?? null,
      publicPersonLinkDescription:
        data.body.value?.publicPersonLinkDescription || "No aplica",
      foreignCountryTax: data.body.value?.foreignCountryTax ?? null,
      foreignCountryTaxDescription:
        data.body.value?.foreignCountryTaxDescription || "No aplica",
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
          Sección 8 -<br />
          Participación Política
          <br />
          (Representante Legal, Socios o Accionistas)
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POR SU CARGO O ACTIVIDAD, MANEJA RECURSOS PÚBLICOS?
            </Typography>

            <RadioGroup
              value={formik.values.publicResources}
              error={Boolean(formik.errors.publicResources)}
              helperText={formik.errors.publicResources}
              handleChange={(evt, value) => {
                formik.setFieldValue("publicResources", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POR SU CARGO O ACTIVIDAD, EJERCE ALGÚN GRADO DE PODER PÚBLICO?
            </Typography>

            <RadioGroup
              value={formik.values.publicPower}
              error={Boolean(formik.errors.publicPower)}
              helperText={formik.errors.publicPower}
              handleChange={(evt, value) => {
                formik.setFieldValue("publicPower", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POR SU ACTIVIDAD U OFICIO, GOZA USTED DE RECONOCIMIENTO PÚBLICO
              GENERAL?
            </Typography>

            <RadioGroup
              value={formik.values.publicAcknowledgment}
              error={Boolean(formik.errors.publicAcknowledgment)}
              helperText={formik.errors.publicAcknowledgment}
              handleChange={(evt, value) => {
                formik.setFieldValue("publicAcknowledgment", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿EXISTE ALGÚN VÍNCULO ENTRE USTED Y UNA PERSONA CONSIDERADA
              PÚBLICAMENTE?
            </Typography>

            <RadioGroup
              value={formik.values.publicPersonLink}
              error={Boolean(formik.errors.publicPersonLink)}
              helperText={formik.errors.publicPersonLink}
              handleChange={(evt, value) => {
                if (value === "false")
                  formik.setFieldValue(
                    "publicPersonLinkDescription",
                    "No aplica"
                  );
                formik.setFieldValue("publicPersonLink", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              DESCRIBA EL VÍNCULO EN DETALLE
            </Typography>

            <BaseField
              fullWidth
              disabled={!formik.values.publicPersonLink}
              id="publicPersonLinkDescription"
              name="publicPersonLinkDescription"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.publicPersonLinkDescription)}
              value={formik.values.publicPersonLinkDescription}
              onChange={formik.handleChange}
              helperText={formik.errors.publicPersonLinkDescription}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.publicPersonLinkDescription}>
              Máximo 80 caracteres
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={1} md={7} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿ES USTED SUJETO DE OBLIGACIONES TRIBUTARIAS EN OTROS PAÍSES O
              GRUPOS DE PAÍSES?
            </Typography>

            <RadioGroup
              value={formik.values.foreignCountryTax}
              error={Boolean(formik.errors.foreignCountryTax)}
              helperText={formik.errors.foreignCountryTax}
              handleChange={(evt, value) => {
                if (value === "false")
                  formik.setFieldValue(
                    "foreignCountryTaxDescription",
                    "No aplica"
                  );
                formik.setFieldValue("foreignCountryTax", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              DESCRIBA EN DETALLE LA OBLIGACIÓN TRIBUTARIA
            </Typography>

            <BaseField
              fullWidth
              disabled={!formik.values.foreignCountryTax}
              id="foreignCountryTaxDescription"
              name="foreignCountryTaxDescription"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.foreignCountryTaxDescription)}
              value={formik.values.foreignCountryTaxDescription}
              onChange={formik.handleChange}
              helperText={formik.errors.foreignCountryTaxDescription}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.foreignCountryTaxDescription}>
              Máximo 80 caracteres
            </Hint>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PolitictsInvolvementStep;
