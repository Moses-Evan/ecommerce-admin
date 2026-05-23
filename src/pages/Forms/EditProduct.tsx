import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicDetails from "../../components/form/form-elements/BasicDetails";
import Spec from "../../components/form/form-elements/Spec";
import PriceInventory from "../../components/form/form-elements/PriceInventory";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import PageMeta from "../../components/common/PageMeta";
import { useForm, FormProvider } from "react-hook-form";
import { createProduct, getAllProducts } from "../../services/productService";
import Properties from "../../components/form/form-elements/Properties";
import { Product } from "../../components/types/Product";
import { useState, useEffect } from "react";

export default function EditProduct() {
  const methods = useForm();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      console.log("Fetch products attempt completed");
    }
  };

  const onSubmit = async (data: any, event?: any) => {
    try {
      const action = (event?.nativeEvent as SubmitEvent)
        ?.submitter as HTMLButtonElement;

      data.action = action?.value;

      console.log("FINAL ADD PRODUCT FORM DATA:", data);

      const result = await createProduct(data);

      console.log("SUCCESS:", result);

      alert(result);

      methods.reset();
    } catch (error: any) {
      console.error("ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Something went wrong while adding the product.",
      );
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PageMeta
            title="Edit Products | Niorra Admin Dashboard"
            description="Page to edit existing products on the Niorra e-commerce platform. Update product details, specifications, pricing, inventory, and upload images to modify an existing product listing."
          />
          <PageBreadcrumb pageTitle="Edit a Product" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <BasicDetails />
              <TextAreaInput />
              <Spec />
              {/* <SelectInputs /> */}
              {/* <InputStates /> */}
            </div>
            <div className="space-y-6">
              <PriceInventory />
              {/* <InputGroup /> */}
              {/* <FileInputExample /> */}
              {/* <CheckboxComponents /> */}
              {/* <RadioButtons /> */}
              {/* <ToggleSwitch /> */}
              <DropzoneComponent />
              <Properties />
            </div>
          </div>

          <div
            className="mt-6
           flex justify-end"
          >
            <button
              type="submit"
              className="px-6 py-3 bg-brand-900 text-white rounded-lg
              transition-all duration-200 ease-in-out
              hover:bg-brand-800 hover:shadow-lg hover:-translate-y-0.5
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed mr-4"
              name="action"
              value="draft"
              disabled={methods.formState.isSubmitting}
            >
              Draft Product
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-700 text-white rounded-lg
              transition-all duration-200 ease-in-out
              hover:bg-brand-600 hover:shadow-lg hover:-translate-y-0.5
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed"
              name="action"
              value="publish"
              disabled={methods.formState.isSubmitting}
            >
              Save Changes
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
