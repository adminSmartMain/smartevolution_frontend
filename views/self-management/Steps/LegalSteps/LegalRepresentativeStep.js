import { useContext, useEffect } from "react";

import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";

import CitiesSelect from "@components/selects/CitiesSelect";
import CountriesSelect from "@components/selects/CountriesSelect";
import DepartmentSelect from "@components/selects/DepartmentsSelect";
import DocumentTypesSelect from "@components/selects/DocumentTypesSelect";
import SalarySelect from "@components/selects/SalarySelect";

import emailSchema from "@schemas/emailSchema";
import numberSchema from "@schemas/numberSchema";
import phoneNumberSchema from "@schemas/phoneNumberSchema";
import selectObjectSchema from "@schemas/selectObjectSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";
import DatePicker from "@styles/fields/DatePicker";

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
  ...stringSchema("legalRepresentativeName"),
  ...stringSchema("legalRepresentativeLastName"),
  ...stringSchema("legalRepresentativeTypeDocument"),
  ...numberSchema("legalRepresentativeDocumentNumber"),
  ...selectObjectSchema("legalRepresentativeCountry"),
  ...stringSchema("legalRepresentativeBirthDate"),
  ...stringSchema("legalRepresentativeAddress"),
  ...selectObjectSchema("legalRepresentativeDepartment"),
  ...selectObjectSchema("legalRepresentativeCity"),
  ...phoneNumberSchema("legalRepresentativePhone"),
  ...phoneNumberSchema("legalRepresentativePersonalPhone"),
  ...emailSchema("legalRepresentativeEmail"),
  ...stringSchema("legalRepresentativePosition"),
  ...selectObjectSchema("attributionsAndLimitations"),
});

const LegalRepresentativeStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      legalRepresentativeName: data.body.value?.legalRepresentativeName || "",
      legalRepresentativeLastName:
        data.body.value?.legalRepresentativeLastName || "",
      legalRepresentativeTypeDocument:
        data.body.value?.legalRepresentativeTypeDocument || null,
      legalRepresentativeDocumentNumber:
        data.body.value?.legalRepresentativeDocumentNumber || "",
      legalRepresentativeCountry:
        data.body.value?.legalRepresentativeCountry || null,
      legalRepresentativeBirthDate:
        data.body.value?.legalRepresentativeBirthDate || null,
      legalRepresentativeAddress:
        data.body.value?.legalRepresentativeAddress || "",
      legalRepresentativeDepartment:
        data.body.value?.legalRepresentativeDepartment || null,
      legalRepresentativeCity: data.body.value?.legalRepresentativeCity || null,
      legalRepresentativePhone: data.body.value?.legalRepresentativePhone || "",
      legalRepresentativePersonalPhone:
        data.body.value?.legalRepresentativePersonalPhone || "",
      legalRepresentativeEmail: data.body.value?.legalRepresentativeEmail || "",
      legalRepresentativePosition:
        data.body.value?.legalRepresentativePosition || "",
      attributionsAndLimitations:
        data.body.value?.attributionsAndLimitations || null,
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
          Sección 4 -<br /> Datos del Representante Legal
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              NOMBRE DEL REPRESENTANTE
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativeName"
              name="legalRepresentativeName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeName)}
              value={formik.values.legalRepresentativeName}
              onChange={formik.handleChange}
              helperText={formik.errors.legalRepresentativeName}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              APELLIDOS DEL REPRESENTANTE
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativeLastName"
              name="legalRepresentativeLastName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeLastName)}
              value={formik.values.legalRepresentativeLastName}
              onChange={formik.handleChange}
              helperText={formik.errors.legalRepresentativeLastName}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              TIPO DE DOCUMENTO DE IDENTIDAD
            </Typography>

            <DocumentTypesSelect
              fullWidth
              id="legalRepresentativeTypeDocument"
              name="legalRepresentativeTypeDocument"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeTypeDocument)}
              value={formik.values.legalRepresentativeTypeDocument}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeTypeDocument", value);
              }}
              helperText={formik.errors.legalRepresentativeTypeDocument}
            />
            <Hint show={!formik.errors.legalRepresentativeTypeDocument}>
              Seleccione el tipo de documento del representante legal
            </Hint>
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              NÚMERO DE DOCUMENTO
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativeDocumentNumber"
              name="legalRepresentativeDocumentNumber"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowNegative={false}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeDocumentNumber)}
              value={formik.values.legalRepresentativeDocumentNumber}
              onChangeMasked={(values) => {
                formik.setFieldValue(
                  "legalRepresentativeDocumentNumber",
                  values.floatValue
                );
              }}
              helperText={formik.errors.legalRepresentativeDocumentNumber}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>NACIONALIDAD</Typography>

            <CountriesSelect
              fullWidth
              id="legalRepresentativeCountry"
              name="legalRepresentativeCountry"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeCountry)}
              value={formik.values.legalRepresentativeCountry}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeCountry", value);
              }}
              helperText={formik.errors.legalRepresentativeCountry}
            />
          </Grid>

          {!isXs && <Grid item md={7} />}

          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              FECHA DE NACIMIENTO
            </Typography>

            <DatePicker
              value={formik.values.legalRepresentativeBirthDate}
              onChange={(date) => {
                formik.setFieldValue(
                  "legalRepresentativeBirthDate",
                  date?.format("YYYY-MM-DD")
                );
              }}
              error={Boolean(formik.errors.legalRepresentativeBirthDate)}
              helperText={formik.errors.legalRepresentativeBirthDate}
              fullWidth
            />
          </Grid>

          {!isXs && <Grid item md={9} />}

          <Grid item xs={12} sm={11} md={8}>
            <Typography sx={{ ...questionTextSx }}>
              DIRECCIÓN PRINCIPAL
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativeAddress"
              name="legalRepresentativeAddress"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeAddress)}
              value={formik.values.legalRepresentativeAddress}
              onChange={formik.handleChange}
              helperText={formik.errors.legalRepresentativeAddress}
            />
          </Grid>

          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>DEPARTAMENTO</Typography>

            <DepartmentSelect
              fullWidth
              id="legalRepresentativeDepartment"
              name="legalRepresentativeDepartment"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeDepartment)}
              value={formik.values.legalRepresentativeDepartment}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeDepartment", value);
              }}
              helperText={formik.errors.legalRepresentativeDepartment}
            />
          </Grid>

          <Grid item xs={12} sm={11} md={4}>
            <Typography sx={{ ...questionTextSx }}>CIUDAD</Typography>

            <CitiesSelect
              fullWidth
              id="legalRepresentativeCity"
              name="legalRepresentativeCity"
              placeholder="Escriba su respuesta aquí"
              departmentdId={formik.values.legalRepresentativeDepartment?.value}
              error={Boolean(formik.errors.legalRepresentativeCity)}
              value={formik.values.legalRepresentativeCity}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeCity", value);
              }}
              helperText={formik.errors.legalRepresentativeCity}
            />
          </Grid>

          {!isXs && <Grid item md={4} />}

          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              TELÉFONO DE OFICINA
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativePhone"
              name="legalRepresentativePhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativePhone)}
              value={formik.values.legalRepresentativePhone}
              onChangeMasked={(values) => {
                formik.setFieldValue(
                  "legalRepresentativePhone",
                  values.floatValue
                );
              }}
              helperText={formik.errors.legalRepresentativePhone}
            />
          </Grid>

          {!isXs && <Grid item md={9} />}

          <Grid item xs={12} sm={11} md={3}>
            <Typography sx={{ ...questionTextSx }}>CELULAR PERSONAL</Typography>

            <BaseField
              fullWidth
              id="legalRepresentativePersonalPhone"
              name="legalRepresentativePersonalPhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativePersonalPhone)}
              value={formik.values.legalRepresentativePersonalPhone}
              onChangeMasked={(values) => {
                formik.setFieldValue(
                  "legalRepresentativePersonalPhone",
                  values.floatValue
                );
              }}
              helperText={formik.errors.legalRepresentativePersonalPhone}
            />
          </Grid>

          {!isXs && <Grid item md={9} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CORREO ELECTRÓNICO CORPORATIVO
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativeEmail"
              name="legalRepresentativeEmail"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-envelope" />
                  </InputAdornment>
                ),
              }}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativeEmail)}
              value={formik.values.legalRepresentativeEmail}
              onChange={formik.handleChange}
              helperText={formik.errors.legalRepresentativeEmail}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CARGO QUE OCUPA EN LA EMPRESA
            </Typography>

            <BaseField
              fullWidth
              id="legalRepresentativePosition"
              name="legalRepresentativePosition"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.legalRepresentativePosition)}
              value={formik.values.legalRepresentativePosition}
              onChange={formik.handleChange}
              helperText={formik.errors.legalRepresentativePosition}
            />
          </Grid>

          {!isXs && <Grid item md={6} />}

          <Grid item xs={12} sm={11} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              ATRIBUCIONES Y LIMITACIONES
            </Typography>

            <SalarySelect
              fullWidth
              id="attributionsAndLimitations"
              name="attributionsAndLimitations"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.attributionsAndLimitations)}
              value={formik.values.attributionsAndLimitations}
              onChange={(evt, value) => {
                formik.setFieldValue("attributionsAndLimitations", value);
              }}
              helperText={formik.errors.attributionsAndLimitations}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LegalRepresentativeStep;
