import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicDetails from "../../components/form/form-elements/BasicDetails";
import Spec from "../../components/form/form-elements/Spec";
import PriceInventory from "../../components/form/form-elements/PriceInventory";
import InputGroup from "../../components/form/form-elements/InputGroup";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import CheckboxComponents from "../../components/form/form-elements/CheckboxComponents";
import RadioButtons from "../../components/form/form-elements/RadioButtons";
import ToggleSwitch from "../../components/form/form-elements/ToggleSwitch";
import FileInputExample from "../../components/form/form-elements/FileInputExample";
import SelectInputs from "../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import InputStates from "../../components/form/form-elements/InputStates";
import PageMeta from "../../components/common/PageMeta";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
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
    </div>
  );
}
