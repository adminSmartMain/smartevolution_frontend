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
  ...radioGroupSchema("managePublicResources", "bool"),
  ...radioGroupSchema("publicRecognition", "bool"),
  ...radioGroupSchema("publicPersonRecognition", "bool"),
  ...stringSchema("publicPersonRecognitionDescription"),
  ...radioGroupSchema("foreignTax", "bool"),
  ...stringSchema("foreignTaxDescription"),
});

const PublicOperationsStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      managePublicResources: data.body.value?.managePublicResources ?? null,
      publicRecognition: data.body.value?.publicRecognition ?? null,
      publicPersonRecognition: data.body.value?.publicPersonRecognition ?? null,
      publicPersonRecognitionDescription:
        data.body.value?.publicPersonRecognitionDescription || "No aplica",
      foreignTax: data.body.value?.foreignTax ?? null,
      foreignTaxDescription:
        data.body.value?.foreignTaxDescription || "No aplica",
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
          Sección 3 -<br /> Información de Operaciones Públicas
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POR SU CARGO O ACTIVIDAD, MANEJA RECURSOS PÚBLICOS?
            </Typography>

            <RadioGroup
              value={formik.values.managePublicResources}
              error={Boolean(formik.errors.managePublicResources)}
              helperText={formik.errors.managePublicResources}
              handleChange={(evt, value) => {
                formik.setFieldValue("managePublicResources", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿POR SU ACTIVIDAD U OFICIO, GOZA USTED DE RECONOCIMIENTO PÚBLICO
              GENERAL?
            </Typography>

            <RadioGroup
              value={formik.values.publicRecognition}
              error={Boolean(formik.errors.publicRecognition)}
              helperText={formik.errors.publicRecognition}
              handleChange={(evt, value) => {
                formik.setFieldValue("publicRecognition", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿EXISTE ALGÚN VÍNCULO ENTRE USTED Y UNA PERSONA CONSIDERADA
              PÚBLICAMENTE?
            </Typography>

            <RadioGroup
              value={formik.values.publicPersonRecognition}
              error={Boolean(formik.errors.publicPersonRecognition)}
              helperText={formik.errors.publicPersonRecognition}
              handleChange={(evt, value) => {
                if (value === "false")
                  formik.setFieldValue(
                    "publicPersonRecognitionDescription",
                    "No aplica"
                  );
                formik.setFieldValue(
                  "publicPersonRecognition",
                  value === "true"
                );
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              DESCRIBA EL VÍNCULO EN DETALLE
            </Typography>

            <BaseField
              fullWidth
              disabled={!formik.values.publicPersonRecognition}
              id="publicPersonRecognitionDescription"
              name="publicPersonRecognitionDescription"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.publicPersonRecognitionDescription)}
              value={formik.values.publicPersonRecognitionDescription}
              onChange={formik.handleChange}
              helperText={formik.errors.publicPersonRecognitionDescription}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.publicPersonRecognitionDescription}>
              Máximo 80 caracteres
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={1} md={7} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿ES USTED SUJETO DE OBLIGACIONES TRIBUTARIAS EN OTROS PAÍSES O
              GRUPOS DE PAÍSES?
            </Typography>

            <RadioGroup
              value={formik.values.foreignTax}
              error={Boolean(formik.errors.foreignTax)}
              helperText={formik.errors.foreignTax}
              handleChange={(evt, value) => {
                if (value === "false")
                  formik.setFieldValue("foreignTaxDescription", "No aplica");
                formik.setFieldValue("foreignTax", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              DESCRIBA EL VÍNCULO EN DETALLE
            </Typography>

            <BaseField
              fullWidth
              disabled={!formik.values.foreignTax}
              id="foreignTaxDescription"
              name="foreignTaxDescription"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.foreignTaxDescription)}
              value={formik.values.foreignTaxDescription}
              onChange={formik.handleChange}
              helperText={formik.errors.foreignTaxDescription}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.foreignTaxDescription}>
              Máximo 80 caracteres
            </Hint>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PublicOperationsStep;
