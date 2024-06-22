import { useContext, useEffect } from "react";

import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";

import numberSchema from "@schemas/numberSchema";
import radioGroupSchema from "@schemas/radioGroupSchema";

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
  ...radioGroupSchema("greatContributor", "bool"),
  ...radioGroupSchema("selfRetainer", "bool"),
  ...numberSchema("retIca"),
  ...numberSchema("retFte"),
});

const TaxInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      greatContributor: data.body.value?.greatContributor ?? null,
      selfRetainer: data.body.value?.selfRetainer ?? null,
      retIca: data.body.value?.retIca === 0 ? 0 : data.body.value?.retIca || "",
      retFte: data.body.value?.retFte === 0 ? 0 : data.body.value?.retFte || "",
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
          Sección 2 -<br />
          Información Tributaria
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿LA EMPRESA ES GRAN CONTRIBUYENTE?
            </Typography>

            <RadioGroup
              value={formik.values.greatContributor}
              error={Boolean(formik.errors.greatContributor)}
              helperText={formik.errors.greatContributor}
              handleChange={(evt, value) => {
                formik.setFieldValue("greatContributor", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={4} />}

          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...questionTextSx }}>
              ¿LA EMPRESA ES AUTORETENEDORA?
            </Typography>

            <RadioGroup
              value={formik.values.selfRetainer}
              error={Boolean(formik.errors.selfRetainer)}
              helperText={formik.errors.selfRetainer}
              handleChange={(evt, value) => {
                formik.setFieldValue("selfRetainer", value === "true");
              }}
            >
              <Element label="Sí" value={true} />
              <Element label="No" value={false} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={6} />}

          <Grid item xs={12} sm={4}>
            <Typography sx={{ ...questionTextSx }}>
              INDIQUE TARIFA ICA
            </Typography>

            <BaseField
              fullWidth
              id="retIca"
              name="retIca"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-percent" />
                  </InputAdornment>
                ),
              }}
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={4}
              allowNegative={false}
              isAllowed={(values, sourceInfo) => {
                const { floatValue } = values;
                return !floatValue || floatValue <= 100;
              }}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.retIca)}
              value={formik.values.retIca}
              onChangeMasked={(values) => {
                formik.setFieldValue("retIca", values.floatValue);
              }}
              helperText={formik.errors.retIca}
            />
            <Hint show={!formik.errors.retIca}>
              En caso de no aplicar, escriba 0
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={8} />}

          <Grid item xs={12} sm={4}>
            <Typography sx={{ ...questionTextSx }}>
              INDIQUE TARIFA RETENCIÓN EN LA FUENTE
            </Typography>

            <BaseField
              fullWidth
              id="retFte"
              name="retFte"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-percent" />
                  </InputAdornment>
                ),
              }}
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={4}
              allowNegative={false}
              isAllowed={(values, sourceInfo) => {
                const { floatValue } = values;
                return !floatValue || floatValue <= 100;
              }}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.retFte)}
              value={formik.values.retFte}
              onChangeMasked={(values) => {
                formik.setFieldValue("retFte", values.floatValue);
              }}
              helperText={formik.errors.retFte}
            />
            <Hint show={!formik.errors.retFte}>
              En caso de no aplicar, escriba 0
            </Hint>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TaxInformationStep;
