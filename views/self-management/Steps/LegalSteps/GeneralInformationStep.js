import { useContext, useEffect } from "react";

import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";

import BanksSelect from "@components/selects/BanksSelect";

import numberSchema from "@schemas/numberSchema";
import phoneNumberSchema from "@schemas/phoneNumberSchema";
import selectObjectSchema from "@schemas/selectObjectSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";
import HelperText from "@styles/helperText";

import { FormContext } from "@views/self-management/Context";
import Hint from "@views/self-management/Hint";
import SelfManagementAddMoreButton from "@views/self-management/SelfManagementAddMoreButton";
import SelfManagementDynamicContainer from "@views/self-management/SelfManagementDynamicContainer";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
  sectionTitleSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  principalProducts: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("percentage"),
    })
  ),
  principalClients: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("deadline"),
      ...numberSchema("salePercentage"),
      ...stringSchema("contactName"),
      ...phoneNumberSchema("phone"),
    })
  ),
  principalProviders: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("deadline"),
      ...numberSchema("salePercentage"),
      ...stringSchema("contactName"),
      ...phoneNumberSchema("phone"),
    })
  ),
  principalCompetitors: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("percentage"),
    })
  ),
  ...stringSchema("businessSeasonality"),
  ...stringSchema("installedCapacityVsUsedCapacity"),
  ...stringSchema("futureProjects"),
  financialRelations: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("amount"),
      ...numberSchema("deadline"),
      ...numberSchema("tax"),
    })
  ),
  ...selectObjectSchema("payrollBank"),
  ...selectObjectSchema("acquisitionsBank"),
});

const GeneralInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      principalProducts: data.body.value?.principalProducts || [
        { name: null, percentage: 0 },
      ],
      principalClients: data.body.value?.principalClients || [
        {
          name: null,
          deadline: 0,
          salePercentage: 0,
          contactName: null,
          phone: null,
        },
      ],
      principalProviders: data.body.value?.principalProviders || [
        {
          name: null,
          deadline: 0,
          salePercentage: 0,
          contactName: null,
          phone: null,
        },
      ],
      principalCompetitors: data.body.value?.principalCompetitors || [
        { name: null, percentage: 0 },
      ],
      businessSeasonality: data.body.value?.businessSeasonality || "",
      installedCapacityVsUsedCapacity:
        data.body.value?.installedCapacityVsUsedCapacity || "",
      futureProjects: data.body.value?.futureProjects || "",
      financialRelations: data.body.value?.financialRelations || [
        {
          name: null,
          amount: 0,
          deadline: 0,
          tax: 0,
        },
      ],
      payrollBank: data.body.value?.payrollBank || null,
      acquisitionsBank: data.body.value?.acquisitionsBank || null,
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const addPrincipalProduct = () => {
    formik.setFieldValue("principalProducts", [
      ...formik.values.principalProducts,
      { name: null, percentage: 0 },
    ]);
  };

  const removePrincipalProduct = (index) => {
    formik.setFieldValue(
      "principalProducts",
      formik.values.principalProducts.filter((p, i) => index !== i)
    );
  };

  const addPrincipalClients = () => {
    formik.setFieldValue("principalClients", [
      ...formik.values.principalClients,
      {
        name: null,
        deadline: 0,
        salePercentage: 0,
        contactName: null,
        phone: null,
      },
    ]);
  };

  const removePrincipalClients = (index) => {
    formik.setFieldValue(
      "principalClients",
      formik.values.principalClients.filter((p, i) => index !== i)
    );
  };

  const addPrincipalProviders = () => {
    formik.setFieldValue("principalProviders", [
      ...formik.values.principalProviders,
      {
        name: null,
        deadline: 0,
        salePercentage: 0,
        contactName: null,
        phone: null,
      },
    ]);
  };

  const removePrincipalProviders = (index) => {
    formik.setFieldValue(
      "principalProviders",
      formik.values.principalProviders.filter((p, i) => index !== i)
    );
  };

  const addPrincipalCompetitor = () => {
    formik.setFieldValue("principalCompetitors", [
      ...formik.values.principalCompetitors,
      { name: null, percentage: 0 },
    ]);
  };

  const removePrincipalCompetitor = (index) => {
    formik.setFieldValue(
      "principalCompetitors",
      formik.values.principalCompetitors.filter((p, i) => index !== i)
    );
  };

  const addFinancialRelation = () => {
    formik.setFieldValue("financialRelations", [
      ...formik.values.financialRelations,
      {
        name: null,
        amount: 0,
        deadline: 0,
        tax: 0,
      },
    ]);
  };

  const removeFinancialRelation = (index) => {
    formik.setFieldValue(
      "financialRelations",
      formik.values.financialRelations.filter((p, i) => index !== i)
    );
  };
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
        <Typography sx={{ ...questionParagraphSx, mb: 3.75 }}>
          Sección 7 -<br /> Información General
        </Typography>

        <Typography sx={{ ...sectionTitleSx, mb: 2.5 }}>
          PRINCIPALES PRODUCTOS Y/O SERVICIOS
        </Typography>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...questionTextSx }}>
                PRODUCTO O SERVICIO
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>% SOBRE VENTAS</Typography>
            </Grid>
          </Grid>

          {formik.values.principalProducts.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.principalProducts.length <= 1}
              onDelete={() => removePrincipalProduct(i)}
            >
              <Grid item xs={12} md={6}>
                <BaseField
                  fullWidth
                  id={`principalProducts[${i}].name`}
                  name={`principalProducts[${i}].name`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-box-open-full" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalProducts?.[i]?.name)}
                  value={formik.values.principalProducts?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.principalProducts?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`principalProducts[${i}].percentage`}
                  name={`principalProducts[${i}].percentage`}
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
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalProducts?.[i]?.percentage
                  )}
                  value={formik.values.principalProducts?.[i]?.percentage || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalProducts[${i}].percentage`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.principalProducts?.[i]?.percentage}
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25 }}
            onClick={addPrincipalProduct}
          >
            Agregar nuevo producto o servicio
          </SelfManagementAddMoreButton>
        </Grid>

        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography sx={{ ...sectionTitleSx, my: 2.5 }}>
            PRINCIPALES CLIENTES
          </Typography>
          <HelperText
            sx={{
              ...questionTextSx,
              mb: 5,
            }}
          >
            Indique los clientes con los que desea realizar operaciones de
            Factoring
          </HelperText>
        </Box>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ ...questionTextSx }}>CLIENTE</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>PLAZO OTORGADO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>% VENTAS</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>
                NOMBRE DE CONTACTO
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>TELÉFONO</Typography>
            </Grid>
          </Grid>

          {formik.values.principalClients.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.principalClients.length <= 1}
              onDelete={() => removePrincipalClients(i)}
            >
              <Grid item xs={12} md={4}>
                <BaseField
                  fullWidth
                  id={`principalClients[${i}].name`}
                  name={`principalClients[${i}].name`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-user-tie" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalClients?.[i]?.name)}
                  value={formik.values.principalClients?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.principalClients?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalClients[${i}].deadline`}
                  name={`principalClients[${i}].deadline`}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalClients?.[i]?.deadline)}
                  value={formik.values.principalClients?.[i]?.deadline || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalClients[${i}].deadline`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.principalClients?.[i]?.deadline}
                />
                <Hint show={!formik.errors.principalClients?.[i]?.deadline}>
                  Plazo en días
                </Hint>
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalClients[${i}].salePercentage`}
                  name={`principalClients[${i}].salePercentage`}
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
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalClients?.[i]?.salePercentage
                  )}
                  value={
                    formik.values.principalClients?.[i]?.salePercentage || ""
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalClients[${i}].salePercentage`,
                      values.floatValue
                    );
                  }}
                  helperText={
                    formik.errors.principalClients?.[i]?.salePercentage
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalClients[${i}].contactName`}
                  name={`principalClients[${i}].contactName`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalClients?.[i]?.contactName
                  )}
                  value={formik.values.principalClients?.[i]?.contactName || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.principalClients?.[i]?.contactName}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalClients[${i}].phone`}
                  name={`principalClients[${i}].phone`}
                  isPatterned
                  format="## ###########"
                  mask="X"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalClients?.[i]?.phone)}
                  value={formik.values.principalClients?.[i]?.phone || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalClients[${i}].phone`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.principalClients?.[i]?.phone}
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25 }}
            onClick={addPrincipalClients}
          >
            Agregar nuevo cliente
          </SelfManagementAddMoreButton>
        </Grid>

        <Typography sx={{ ...sectionTitleSx, my: 2.5 }}>
          PRINCIPALES PROVEEDORES
        </Typography>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ ...questionTextSx }}>PROVEEDOR</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>PLAZO OTORGADO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>% COMPRAS</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>
                NOMBRE DE CONTACTO
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>TELÉFONO</Typography>
            </Grid>
          </Grid>

          {formik.values.principalProviders.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.principalProviders.length <= 1}
              onDelete={() => removePrincipalProviders(i)}
            >
              <Grid item xs={12} md={4}>
                <BaseField
                  fullWidth
                  id={`principalProviders[${i}].name`}
                  name={`principalProviders[${i}].name`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-user-tie" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalProviders?.[i]?.name)}
                  value={formik.values.principalProviders?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.principalProviders?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalProviders[${i}].deadline`}
                  name={`principalProviders[${i}].deadline`}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalProviders?.[i]?.deadline
                  )}
                  value={formik.values.principalProviders?.[i]?.deadline || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalProviders[${i}].deadline`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.principalProviders?.[i]?.deadline}
                />
                <Hint show={!formik.errors.principalProviders?.[i]?.deadline}>
                  Si es de contado, indique 0
                </Hint>
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalProviders[${i}].salePercentage`}
                  name={`principalProviders[${i}].salePercentage`}
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
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalProviders?.[i]?.salePercentage
                  )}
                  value={
                    formik.values.principalProviders?.[i]?.salePercentage || ""
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalProviders[${i}].salePercentage`,
                      values.floatValue
                    );
                  }}
                  helperText={
                    formik.errors.principalProviders?.[i]?.salePercentage
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalProviders[${i}].contactName`}
                  name={`principalProviders[${i}].contactName`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalProviders?.[i]?.contactName
                  )}
                  value={
                    formik.values.principalProviders?.[i]?.contactName || ""
                  }
                  onChange={formik.handleChange}
                  helperText={
                    formik.errors.principalProviders?.[i]?.contactName
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`principalProviders[${i}].phone`}
                  name={`principalProviders[${i}].phone`}
                  isPatterned
                  format="## ###########"
                  mask="X"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalProviders?.[i]?.phone)}
                  value={formik.values.principalProviders?.[i]?.phone || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalProviders[${i}].phone`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.principalProviders?.[i]?.phone}
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25 }}
            onClick={addPrincipalProviders}
          >
            Agregar nuevo proveedor
          </SelfManagementAddMoreButton>
        </Grid>

        <Typography sx={{ ...sectionTitleSx, my: 2.5 }}>
          PRINCIPALES COMPETIDORES
        </Typography>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...questionTextSx }}>
                NOMBRE DE COMPETIDOR
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>
                CUOTA DE MERCADO
              </Typography>
            </Grid>
          </Grid>

          {formik.values.principalCompetitors.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.principalCompetitors.length <= 1}
              onDelete={() => removePrincipalCompetitor(i)}
            >
              <Grid item xs={12} md={6}>
                <BaseField
                  fullWidth
                  id={`principalCompetitors[${i}].name`}
                  name={`principalCompetitors[${i}].name`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.principalCompetitors?.[i]?.name)}
                  value={formik.values.principalCompetitors?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.principalCompetitors?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`principalCompetitors[${i}].percentage`}
                  name={`principalCompetitors[${i}].percentage`}
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
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.principalCompetitors?.[i]?.percentage
                  )}
                  value={
                    formik.values.principalCompetitors?.[i]?.percentage || ""
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `principalCompetitors[${i}].percentage`,
                      values.floatValue
                    );
                  }}
                  helperText={
                    formik.errors.principalCompetitors?.[i]?.percentage
                  }
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25, mb: 2.5 }}
            onClick={addPrincipalCompetitor}
          >
            Agregar nuevo competidor
          </SelfManagementAddMoreButton>
        </Grid>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              ESTACIONALIDAD DEL NEGOCIO
            </Typography>

            <BaseField
              fullWidth
              id="businessSeasonality"
              name="businessSeasonality"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.businessSeasonality)}
              value={formik.values.businessSeasonality}
              onChange={formik.handleChange}
              helperText={formik.errors.businessSeasonality}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.businessSeasonality}>
              Máximo 80 caracteres
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CAPACIDAD INSTALADA VS. CAPACIDAD UTILIZADA
            </Typography>

            <BaseField
              fullWidth
              id="installedCapacityVsUsedCapacity"
              name="installedCapacityVsUsedCapacity"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.installedCapacityVsUsedCapacity)}
              value={formik.values.installedCapacityVsUsedCapacity}
              onChange={formik.handleChange}
              helperText={formik.errors.installedCapacityVsUsedCapacity}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.installedCapacityVsUsedCapacity}>
              Máximo 80 caracteres
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              PROYECTOS FUTUROS Y PROYECCIONES
            </Typography>

            <BaseField
              fullWidth
              id="futureProjects"
              name="futureProjects"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.futureProjects)}
              value={formik.values.futureProjects}
              onChange={formik.handleChange}
              helperText={formik.errors.futureProjects}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.futureProjects}>
              Máximo 80 caracteres
            </Hint>
          </Grid>
        </Grid>

        <Typography sx={{ ...sectionTitleSx, my: 2.5 }}>
          RELACIONES CON EL SISTEMA FINANCIERO
        </Typography>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ ...questionTextSx }}>ENTIDAD</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>MONTO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>PLAZO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>TASA</Typography>
            </Grid>
          </Grid>

          {formik.values.financialRelations.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.financialRelations.length <= 1}
              onDelete={() => removeFinancialRelation(i)}
            >
              <Grid item xs={12} md={4}>
                <BaseField
                  fullWidth
                  id={`financialRelations[${i}].name`}
                  name={`financialRelations[${i}].name`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-building-columns" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.financialRelations?.[i]?.name)}
                  value={formik.values.financialRelations?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.financialRelations?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`financialRelations[${i}].amount`}
                  name={`financialRelations[${i}].amount`}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.financialRelations?.[i]?.amount)}
                  value={formik.values.financialRelations?.[i]?.amount || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `financialRelations[${i}].amount`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.financialRelations?.[i]?.amount}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`financialRelations[${i}].deadline`}
                  name={`financialRelations[${i}].deadline`}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.financialRelations?.[i]?.deadline
                  )}
                  value={formik.values.financialRelations?.[i]?.deadline || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `financialRelations[${i}].deadline`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.financialRelations?.[i]?.deadline}
                />
                <Hint show={!formik.errors.financialRelations?.[i]?.deadline}>
                  Indicar plazo en días
                </Hint>
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`financialRelations[${i}].tax`}
                  name={`financialRelations[${i}].tax`}
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
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.financialRelations?.[i]?.tax)}
                  value={formik.values.financialRelations?.[i]?.tax || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `financialRelations[${i}].tax`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.financialRelations?.[i]?.tax}
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}
        </Grid>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              BANCO DE DISPERSIÓN DE NÓMINA
            </Typography>

            <BanksSelect
              fullWidth
              id="payrollBank"
              name="payrollBank"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.payrollBank)}
              value={formik.values.payrollBank}
              onChange={(evt, value) => {
                formik.setFieldValue("payrollBank", value);
              }}
              helperText={formik.errors.payrollBank}
            />
          </Grid>

          {!isXs && <Grid item sm={1} md={6} />}

          <Grid item xs={12} sm={11} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              BANCO DE MANEJO DE ADQUIRENCIAS
            </Typography>

            <BanksSelect
              fullWidth
              id="acquisitionsBank"
              name="acquisitionsBank"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.acquisitionsBank)}
              value={formik.values.acquisitionsBank}
              onChange={(evt, value) => {
                formik.setFieldValue("acquisitionsBank", value);
              }}
              helperText={formik.errors.acquisitionsBank}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default GeneralInformationStep;
