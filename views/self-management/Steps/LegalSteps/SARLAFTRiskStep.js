import { useContext, useEffect } from "react";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";

import radioGroupSchema from "@schemas/radioGroupSchema";

import { FormContext } from "@views/self-management/Context";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  ...radioGroupSchema("occupationalRiskPolicy", "bool"),
  ...radioGroupSchema("assetLaunderingPolicy", "bool"),
  ...radioGroupSchema("laftRiskPolicy", "bool"),
  ...radioGroupSchema("laftAnualDictamen", "bool"),
  ...radioGroupSchema("laftInternalAuditor", "bool"),
});

const SARLAFTRiskStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      occupationalRiskPolicy: data.body.value?.occupationalRiskPolicy ?? null,
      assetLaunderingPolicy: data.body.value?.assetLaunderingPolicy ?? null,
      laftRiskPolicy: data.body.value?.laftRiskPolicy ?? null,
      laftAnualDictamen: data.body.value?.laftAnualDictamen ?? null,
      laftInternalAuditor: data.body.value?.laftInternalAuditor ?? null,
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
          Sección 9 -<br /> Información sobre el sistema de Información
          <br />
          De riesgo SARLAFT
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿CUENTA LA EMPRESA CON POLÍTICAS Y PROCEDIMIENTOS DE PREVENCIÓN DE
              RIESGOS?
            </Typography>

            <RadioGroup
              value={formik.values.occupationalRiskPolicy}
              error={Boolean(formik.errors.occupationalRiskPolicy)}
              helperText={formik.errors.occupationalRiskPolicy}
              handleChange={(evt, value) => {
                formik.setFieldValue(
                  "occupationalRiskPolicy",
                  value === "true"
                );
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿CUENTA LA EMPRESA CON RESPONSABLES DEL CUMPLIMIENTO DE LAS
              POLÍTICAS Y PROCEDIMIENTOS PARA LA PREVENCIÓN DE RIESGOS ASOCIADOS
              AL LAVADO DE ACTIVOS Y FINANCIAMIENTO AL TERRORISMO (LA/FT)?
            </Typography>

            <RadioGroup
              value={formik.values.assetLaunderingPolicy}
              error={Boolean(formik.errors.assetLaunderingPolicy)}
              helperText={formik.errors.assetLaunderingPolicy}
              handleChange={(evt, value) => {
                formik.setFieldValue("assetLaunderingPolicy", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿CUENTA LA EMPRESA CON UN ÁREA PARA LA GESTIÓN DE RIESGOS LA/FT?
            </Typography>

            <RadioGroup
              value={formik.values.laftRiskPolicy}
              error={Boolean(formik.errors.laftRiskPolicy)}
              helperText={formik.errors.laftRiskPolicy}
              handleChange={(evt, value) => {
                formik.setFieldValue("laftRiskPolicy", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿LA REVISORÍA FISCAL EN SUS DICTÁMENES ANUALES INCLUYE
              RECOMENDACIONES Y CONCLUSIONES SOBRE EL RIESGO DE LA LA/FT?
            </Typography>

            <RadioGroup
              value={formik.values.laftAnualDictamen}
              error={Boolean(formik.errors.laftAnualDictamen)}
              helperText={formik.errors.laftAnualDictamen}
              handleChange={(evt, value) => {
                formik.setFieldValue("laftAnualDictamen", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={5} />}

          <Grid item xs={12} sm={11} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ¿LA EMPRESA CUENTA CON UN AUDITOR INTERNO QUE EFECTÚA REVISIONES
              PERIÓDICAS AL SISTEMA DE PREVENCIÓN DEL RIESGO DE LA LA/FT E
              INFORMA SOBRE EL FUNCIONAMIENTO A LOS ESTAMENTOS DIRECTIVOS Y/O
              ADMINISTRATIVOS?
            </Typography>

            <RadioGroup
              value={formik.values.laftInternalAuditor}
              error={Boolean(formik.errors.laftInternalAuditor)}
              helperText={formik.errors.laftInternalAuditor}
              handleChange={(evt, value) => {
                formik.setFieldValue("laftInternalAuditor", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SARLAFTRiskStep;
