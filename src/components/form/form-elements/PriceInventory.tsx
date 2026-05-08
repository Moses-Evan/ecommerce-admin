import { useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

import { useFormContext, Controller } from "react-hook-form";
import Select from "../Select";

export default function PriceInventory() {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const saleReasonOptions = [
    { value: "festival", label: "Festival Sale" },
    { value: "clearance", label: "Clearance Sale" },
    { value: "seasonal", label: "Seasonal Offer" },
    { value: "launch", label: "Launch Offer" },
    { value: "limited", label: "Limited Time Offer" },
  ];

  // Watch prices
  const mrp = Number(watch("productMrp")) || 0;
  const sellingPrice = Number(watch("productSellingPrice")) || 0;

  // Auto calculate discount
  useEffect(() => {
    if (mrp > 0 && sellingPrice >= 0 && sellingPrice <= mrp) {
      const discount = (((mrp - sellingPrice) / mrp) * 100).toFixed(0);

      setValue("productDiscount", discount);
    } else {
      setValue("productDiscount", 0);
    }
  }, [mrp, sellingPrice, setValue]);

  return (
    <ComponentCard title="Pricing & Inventory">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productMrp">MRP</Label>

          <Input
            type="number"
            id="productMrp"
            inputMode="numeric"
            min="0"
            {...register("productMrp", {
              required: "MRP is required",
              min: {
                value: 1,
                message: "MRP should be greater than 0",
              },
            })}
            error={!!errors.productMrp}
            hint={errors.productMrp?.message as string}
          />
        </div>

        {/* Selling Price */}
        <div>
          <Label htmlFor="productSellingPrice">Selling Price</Label>

          <Input
            type="number"
            id="productSellingPrice"
            inputMode="numeric"
            min="0"
            {...register("productSellingPrice", {
              required: "Selling price is required",

              validate: (value) => {
                if (Number(value) > mrp) {
                  return "Selling price cannot exceed MRP";
                }

                return true;
              },
            })}
            error={!!errors.productSellingPrice}
            hint={errors.productSellingPrice?.message as string}
          />
        </div>

        {/* Discount */}
        <div>
          <Label htmlFor="productDiscount">Discount</Label>

          <div className="relative">
            <Input
              type="number"
              id="productDiscount"
              disabled
              {...register("productDiscount")}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              %
            </span>
          </div>
        </div>

        {/* Sale Reason */}
        <div>
          <Label>Sale Reason</Label>

          <Controller
            name="productSaleReason"
            control={control}
            rules={{
              required: "Please select a sale reason",
            }}
            render={({ field }) => (
              <Select
                options={saleReasonOptions}
                placeholder="Select sale reason"
                value={field.value || ""}
                onChange={field.onChange}
                className="dark:bg-dark-900"
              />
            )}
          />

          {errors.saleReason && (
            <p className="text-red-500 text-sm mt-1">
              {errors.saleReason.message as string}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <Label htmlFor="productStock">Stock</Label>

          <Input
            type="number"
            id="productStock"
            placeholder="0 - No Stock"
            inputMode="numeric"
            min="0"
            {...register("productStock", {
              required: "Stock is required",
            })}
            error={!!errors.productStock}
            hint={errors.productStock?.message as string}
          />
        </div>
      </div>

      {/* <div>
          <Label>Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div> */}

      {/* <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>

        <div>
          <Label htmlFor="tm">Time Picker Input</Label>
          <div className="relative">
            <Input
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon className="size-6" />
            </span>
          </div>
        </div> */}
      {/* <div>
          <Label htmlFor="tm">Input with Payment</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Card number"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                <path
                  d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                  fill="#FC6020"
                />
              </svg>
            </span>
          </div>
        </div> */}
    </ComponentCard>
  );
}
