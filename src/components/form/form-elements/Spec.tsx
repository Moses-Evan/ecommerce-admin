import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import MultiSelect from "../MultiSelect";
import { Controller, useFormContext } from "react-hook-form";

export default function Spec() {
  const [color, setColor] = useState<string>("#4169E1");

  const options = [
    { value: "silk", label: "Silk" },
    { value: "cotton", label: "Cotton" },
  ];

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "wedding", text: "Wedding", selected: false },
    { value: "festive", text: "Festive", selected: false },
    { value: "ceremonies", text: "Ceremonies", selected: false },
    { value: "traditional", text: "Traditional", selected: false },
    { value: "casual", text: "Casual", selected: false },
  ];

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <ComponentCard title="Specifications">
      <div className="space-y-6">
        <div>
          <Label>Select Fabric Type</Label>

          <Controller
            name="productFabricType"
            control={control}
            rules={{ required: "Fabric type is required" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  options={options}
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
        <div>
          <Label htmlFor="productColor">Color</Label>
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              id="productColor"
              placeholder="Ex: Royal Blue, Pink"
              {...register("productColor", {
                required: "Product color is required",
              })}
              error={!!errors.productColor}
              hint={errors.productColor?.message as string}
            />
            <Input
              type="text"
              id="productColorCode"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <div className="relative inline-block">
              <input
                type="color"
                id="productColorCode"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute opacity-0 w-12 h-12 cursor-pointer"
                placeholder="Select Color"
              />

              <label
                htmlFor="productColorCode"
                className="h-12 w-12 rounded-full border cursor-pointer block"
                style={{ backgroundColor: color }}
              ></label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Controller
              name="productOccasion"
              control={control}
              rules={{
                validate: (value) =>
                  (value && value.length > 0) || "Select at least one occasion",
              }}
              render={({ field, fieldState }) => (
                <>
                  <MultiSelect
                    label="Occasion"
                    options={multiOptions}
                    value={field.value || []} // ✅ controlled by RHF
                    onChange={field.onChange} // ✅ sync with form
                  />

                  {/* Error */}
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
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
      </div>
    </ComponentCard>
  );
}
