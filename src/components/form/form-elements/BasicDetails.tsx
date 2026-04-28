import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import { useFormContext } from "react-hook-form";

export default function BasicDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <ComponentCard title="Basic Details">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            type="text"
            id="productName"
            {...register("productName", {
              required: "Product name is required",
            })}
            error={!!errors.productName}
            hint={errors.productName?.message as string}
          />
        </div>

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            type="text"
            id="productSku"
            {...register("productSku", {
              required: "SKU is required",
            })}
            error={!!errors.productSku}
            hint={errors.productSku?.message as string}
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            type="text"
            id="productBrand"
            {...register("productBrand", {
              required: "Brand is required",
            })}
            error={!!errors.productBrand}
            hint={errors.productBrand?.message as string}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
