import { FormProvider, useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { createCategory } from "../../services/productService";

export default function AddCategory() {
  const methods = useForm();
  const onSubmit = async (data: any) => {
    try {
      console.log("FINAL ADD CATEGORY FORM DATA:", data);

      const result = await createCategory(data);

      console.log("SUCCESS:", result);

      alert(result);

      methods.reset();
    } catch (error: any) {
      console.error("ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Something went wrong while adding the category.",
      );
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PageMeta
            title="Add Categories | Niorra Admin Dashboard"
            description="Page to add new categories to the Niorra e-commerce platform. Fill in category details and upload images to create a new category listing."
          />
          <PageBreadcrumb pageTitle="Add a Category" />
        </form>
      </FormProvider>
    </div>
  );
}
