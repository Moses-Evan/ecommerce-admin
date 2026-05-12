import { useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import { Controller, useFormContext } from "react-hook-form";

export default function BasicDetails() {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext();

  const productTypeOptions = [
    { value: "women", label: "Women" },
    { value: "man", label: "Man" },
    { value: "kids", label: "Kids" },
    { value: "accessories", label: "Accessories" },
  ];
  const productTypeWomenOptions = [
    { value: "saree", label: "Saree" },
    { value: "blouse", label: "Blouse" },
    { value: "kurta", label: "Kurta" },
    { value: "dailyWear", label: "Daily Wear" },
    { value: "halfSaree", label: "Half Saree" },
    { value: "skirts", label: "Skirts" },
  ];
  const productTypeManOptions = [
    { value: "sherwani", label: "Sherwani" },
    { value: "weddingSuit", label: "Wedding Suit" },
  ];
  const productTypeKidsOptions = [
    { value: "pattuPavadai", label: "Pattu Pavadai" },
    { value: "dhotiShirtSet", label: "Dhoti Shirt Set" },
    { value: "kidsFrocks", label: "Kids Frocks" },
  ];
  const productTypeAccessoriesOptions: { value: string; label: string }[] = [];

  const productTypeSubOptions: Record<
    string,
    { value: string; label: string }[]
  > = {
    women: productTypeWomenOptions,
    man: productTypeManOptions,
    kids: productTypeKidsOptions,
    accessories: productTypeAccessoriesOptions,
  };

  const selectedProductType = watch("productType");
  const selectedSubOptions = selectedProductType
    ? (productTypeSubOptions[selectedProductType] ?? [])
    : [];

  useEffect(() => {
    if (selectedProductType) {
      setValue("productSubType", "");
    }
  }, [selectedProductType, setValue]);

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

        {/* Product Type  */}
        <div>
          <Label>Product Type</Label>

          <Controller
            name="productType"
            control={control}
            rules={{
              required: "Please select a product type",
            }}
            render={({ field }) => (
              <Select
                options={productTypeOptions}
                placeholder="Select product type"
                value={field.value || ""}
                onChange={field.onChange}
                className="dark:bg-dark-900"
              />
            )}
          />

          {errors.productType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.productType.message as string}
            </p>
          )}
        </div>

        {selectedSubOptions.length > 0 && (
          <div>
            <Label>Product Sub Type</Label>

            <Controller
              name="productSubType"
              control={control}
              rules={{
                required: "Please select a product sub type",
              }}
              render={({ field }) => (
                <Select
                  options={selectedSubOptions}
                  placeholder={`Select ${selectedProductType} sub type`}
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="dark:bg-dark-900"
                />
              )}
            />

            {errors.productSubType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productSubType.message as string}
              </p>
            )}
          </div>
        )}

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
