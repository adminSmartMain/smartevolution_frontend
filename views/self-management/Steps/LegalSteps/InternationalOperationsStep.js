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
  ...radioGroupSchema("internationalOperations", "bool"),
  ...stringSchema("internationalOperationsDescription"),
});

const InternationalOperationsStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      internationalOperations: data.body.value?.internationalOperations ?? null,
      internationalOperationsDescription:
        data.body.value?.internationalOperationsDescription || "",
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
          Sección 5 -<br /> Actividades en Operaciones Internacionales
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿REALIZA OPERACIONES INTERNACIONALES?
            </Typography>

            <RadioGroup
              value={formik.values.internationalOperations}
              error={Boolean(formik.errors.internationalOperations)}
              helperText={formik.errors.internationalOperations}
              handleChange={(evt, value) => {
                if (value === "false")
                  formik.setFieldValue(
                    "internationalOperationsDescription",
                    "No aplica"
                  );
                formik.setFieldValue(
                  "internationalOperations",
                  value === "true"
                );
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              DESCRIBA BREVEMENTE EL TIPO DE OPERACIONES QUE REALIZA EN MONEDA
              EXTRANJERA
            </Typography>

            <BaseField
              fullWidth
              id="internationalOperationsDescription"
              name="internationalOperationsDescription"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.internationalOperationsDescription)}
              disabled={!formik.values.internationalOperations}
              value={formik.values.internationalOperationsDescription}
              onChange={formik.handleChange}
              helperText={formik.errors.internationalOperationsDescription}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.internationalOperationsDescription}>
              Máximo 80 caracteres
            </Hint>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InternationalOperationsStep;
