import { useContext, useEffect } from "react";

import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";

import RadioGroup, { Element } from "@components/RadioGroup";
import { ClientType } from "@components/selects/queries";

import { useFetch } from "@hooks/useFetch";

import emailSchema from "@schemas/emailSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";

import { FormContext } from "../Context";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "../styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  ...emailSchema(),
  ...stringSchema("typeVinculation"),
  ...stringSchema("typeClient"),
});

const InitialStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const {
    loading: loading,
    data: requestData,
    error,
  } = useFetch({
    service: ClientType,
    init: true,
  });
  const clientTypes = requestData?.data || [];

  const handleNextStep = (values) => {
    const typeChanged = data.body.value?.typeClient !== values.typeClient;

    data.body.set({
      ...(!typeChanged && data.body.value),
      ...values,
    });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: data.body.value?.email || "",
      typeVinculation: data.body.value?.typeVinculation ?? null,
      typeClient: data.body.value?.typeClient ?? null,
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
          Sección Inicial -<br />
          Cuéntanos quién eres
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...questionTextSx }}>
              ESCRIBA SU CORREO ELECTRÓNICO
            </Typography>

            <BaseField
              fullWidth
              id="email"
              name="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-envelope" />
                  </InputAdornment>
                ),
              }}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.email)}
              value={formik.values.email}
              onChange={formik.handleChange}
              helperText={formik.errors.email}
            />
          </Grid>

          {!isXs && <Grid item sm={6} />}

          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...questionTextSx }}>
              ESCOJA SU TIPO DE VINCULACIÓN
            </Typography>

            <RadioGroup
              value={formik.values.typeVinculation}
              error={Boolean(formik.errors.typeVinculation)}
              helperText={formik.errors.typeVinculation}
              handleChange={(evt, value) => {
                formik.setFieldValue("typeVinculation", value);
              }}
            >
              <Element label="Emisor" value={0} />
              <Element label="Comprador" value={1} />
              <Element label="Pagador" value={2} />
            </RadioGroup>
          </Grid>

          {!isXs && <Grid item sm={6} />}

          <Grid item xs={12} sm={6}>
            <Typography sx={{ ...questionTextSx }}>
              ESCOJA SU TIPO DE CLIENTE
            </Typography>

            <RadioGroup
              value={formik.values.typeClient}
              error={Boolean(formik.errors.typeClient)}
              helperText={formik.errors.typeClient}
              handleChange={(evt, value) => {
                formik.setFieldValue("typeClient", value);
                data.body.set({
                  ...formik.values,
                  typeClient: value,
                });
              }}
            >
              {loading
                ? "Cargando..."
                : clientTypes.map((type, i) =>
                    type.description !== "Gobierno" ? (
                      <Element
                        key={`type-${type.id}`}
                        label={type.description}
                        value={type.id}
                      />
                    ) : null
                  )}
            </RadioGroup>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InitialStep;
