import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicDetails from "../../components/form/form-elements/BasicDetails";
import Spec from "../../components/form/form-elements/Spec";
import PriceInventory from "../../components/form/form-elements/PriceInventory";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import PageMeta from "../../components/common/PageMeta";
import { useForm, FormProvider } from "react-hook-form";

export default function FormElements() {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log("FINAL DATA:", data);
    // call backend API here
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PageMeta
            title="Add Products | Niorra Admin Dashboard"
            description="Page to add new products to the Niorra e-commerce platform. Fill in product details, specifications, pricing, inventory, and upload images to create a new product listing."
          />
          <PageBreadcrumb pageTitle="Add a Product" />
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
            </div>
          </div>
          {/* 🔥 Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 text-white rounded-lg"
            >
              Submit Product
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
