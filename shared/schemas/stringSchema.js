import * as Yup from "yup";

const stringSchema = (key) => ({
  [key]: Yup.string().required("Campo obligatorio").nullable(),
});

export default stringSchema;
