import * as Yup from "yup";

const numberSchema = (key) => ({
  [key]: Yup.number().required("Campo obligatorio"),
});

export default numberSchema;
