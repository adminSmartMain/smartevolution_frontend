import { ManageOperationC } from './components';
// Formik
import { useFormik } from "formik";
// Zustand
import { useFormStore } from './store'

export const ManageOperationV = () => {

    const { formData } = useFormStore();

    // Formik
    const formik = useFormik({
        initialValues: formData,
        onSubmit: (values) => {
            console.log(values)
        }
    });

    return (
        <div>
            <ManageOperationC
            formik={formik} />
        </div>
    )

}