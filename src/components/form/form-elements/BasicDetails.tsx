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
    { value: "women", label: "Women Collections" },
    { value: "man", label: "Man Collections" },
    { value: "kids-girls", label: "Kids Girls" },
    { value: "kids-boys", label: "Kids Boys" },
    { value: "accessories", label: "Accessories" },
  ];
  const productTypeWomenOptions = [
    { value: "sarees", label: "Sarees" },
    { value: "sale-sarees", label: "Sale Sarees" },
    { value: "lehenga-cholli", label: "Lehenga Cholli" },
    { value: "lehenga", label: "Lehenga" },
    { value: "Chuddidhar", label: "Chuddidhar Collections" },
    { value: "blouse-collections", label: "Blouse Collections" },
    { value: "daily-wear-kurtas", label: "Daily Wear Kurtas" },
    { value: "traditional-kurtas", label: "Traditional Kurtas" },
    {
      value: "daily-wear-dresses",
      label: "Daily Wear Dresses - Nighty, Inners",
    },
    { value: "half-sarees", label: "Half Sarees" },
    { value: "saree-skirts", label: "Saree Skirts" },
  ];
  const productTypeManOptions = [
    { value: "sherwani-collections", label: "Sherwani Collections" },
    { value: "shirt-collections", label: "Shirt Collections" },
    { value: "kurtha-collections", label: "Kurtha Collections" },
    { value: "national", label: "National" },
    { value: "dhoti-collections", label: "Dhoti Collections" },
    { value: "dhoti-shirt", label: "Dhoti Shirt" },
    { value: "pant", label: "Pant" },
    { value: "vest", label: "Vest" },
    { value: "vest-coat", label: "Vest Coat" },
    { value: "thalapakai", label: "Thalapakai" },
    { value: "schesh", label: "Schesh" },
  ];
  const productTypeKidsGirlsOptions = [
    { value: "kids-lehanga-cholli", label: "Lehanga Cholli" },
    { value: "kids-chudidhar", label: "Chuddidhar" },
    { value: "kids-pattu-pavadai", label: "Pattu Pavadai" },
    { value: "kids-party-frock", label: "Party Frock" },
    { value: "kids-nighty", label: "Nighty" },
    { value: "kids-sandals", label: "Sandals" },
  ];
  const productTypeKidsBoysOptions = [
    { value: "kids-sherwani-collections", label: "Sherwani Collections" },
    { value: "kids-shirt-collections", label: "Shirt Collections" },
    { value: "kids-kurtha-collections", label: "Kurtha Collections" },
    { value: "kids-national", label: "National" },
    { value: "kids-dhoti-collections", label: "Dhoti Collections" },
    { value: "kids-dhoti-shirt", label: "Dhoti Shirt" },
    { value: "kids-pant", label: "Pant" },
    { value: "kids-coat-suit", label: "Coat Suit" },
    { value: "kids-thalapakai", label: "Thalapakai" },
    { value: "kids-schesh", label: "Schesh" },
  ];

  const optionsforPage = [
    { value: "Summer Collection", label: "Summer Collection" },
    { value: "Winter Collection", label: "Winter Collection" },
    { value: "Festive Collection", label: "Festive Collection" },
    { value: "Designer Collection", label: "Designer Collection" },
  ];
  const productTypeAccessoriesOptions = [
    { value: "jwellery", label: "Jwellery" },
    { value: "gift-items", label: "Gift Items" },
    { value: "dress-materials", label: "Dress Materials" },
  ];

  const productTypeSubOptions: Record<
    string,
    { value: string; label: string }[]
  > = {
    women: productTypeWomenOptions,
    man: productTypeManOptions,
    "kids-girls": productTypeKidsGirlsOptions,
    "kids-boys": productTypeKidsBoysOptions,
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
        {(selectedProductSubType === "sarees" ||
          selectedProductSubType === "sale-sarees" ||
          selectedProductSubType === "half-sarees") && (
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
