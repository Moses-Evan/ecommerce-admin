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

    { value: "man", label: "Men" },
    { value: "kids", label: "Kids" },
    { value: "accessories", label: "Accessories" },
  ];
  const productTypeWomenOptions = [
    { value: "saree", label: "Saree" },
    { value: "lehenga", label: "Lehenga" },
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

  const optionsforPage = [
    { value: "Summer Collection", label: "Summer Collection" },
    { value: "Just Arrived", label: "Just Arrived" },
    { value: "Winter Collection", label: "Winter Collection" },
    { value: "Wedding Collection", label: "Wedding Collection" },
    { value: "Festive Collection", label: "Festive Collection" },
    { value: "Daily Wear", label: "Daily Wear" },
    { value: "Designer Collection", label: "Designer Collection" },
    { value: "Premium Collection", label: "Premium Collection" },
    { value: "Featured", label: "Featured" },
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
  const selectedProductSubType = watch("productSubType");

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
            helperText={errors.productName?.message}
          />
        </div>

        {/* Product Type */}
        <div>
          <Label>Product Type</Label>
          <Controller
            name="productType"
            control={control}
            rules={{ required: "Product type is required" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  options={productTypeOptions}
                  placeholder="Select a product type"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="dark:bg-dark-900"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Product Sub Type */}
        {selectedSubOptions.length > 0 && (
          <div>
            <Label>Product Sub Type</Label>
            <Controller
              name="productSubType"
              control={control}
              rules={{ required: "Product sub type is required" }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    options={selectedSubOptions}
                    placeholder="Select a product sub type"
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="dark:bg-dark-900"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        )}

        {/* Category - Only show for saree or half saree */}
        {(selectedProductSubType === "saree" ||
          selectedProductSubType === "halfSaree") && (
          <div>
            <Label>Select Category</Label>

            <Controller
              name="productCategory"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    options={optionsforPage}
                    placeholder="Select an option"
                    value={field.value || ""} // ✅ important
                    onChange={field.onChange}
                    className="dark:bg-dark-900"
                  />

                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        )}

        <div>
          <Label htmlFor="productSku">SKU</Label>
          <Input
            type="text"
            id="productSku"
            {...register("productSku", {
              required: "SKU is required",
            })}
            error={!!errors.productSku}
            helperText={errors.productSku?.message}
          />
        </div>

        <div>
          <Label htmlFor="productBrand">Brand</Label>
          <Input
            type="text"
            id="productBrand"
            {...register("productBrand", {
              required: "Brand is required",
            })}
            error={!!errors.productBrand}
            helperText={errors.productBrand?.message}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
