import * as Yup from "yup";

const radioGroupSchema = (key, schemaType = "number") => {
  const type =
    (schemaType === "number" && Yup.number) ||
    (schemaType === "string" && Yup.string) ||
    (schemaType === "bool" && Yup.bool);

  return {
    [key]: type().required("Selecciona una opción").nullable(),
  };
};

export default radioGroupSchema;
