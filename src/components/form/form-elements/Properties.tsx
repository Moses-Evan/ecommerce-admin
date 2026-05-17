import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";

import Select from "../Select";
import MultiSelect from "../MultiSelect";
import { Controller, useFormContext } from "react-hook-form";

export default function Properties() {
  const optionsforPage = [
    { value: "Summer Collection", label: "Summer Collection" },
    { value: "Just Arrived", label: "Just Arrived" },
    { value: "Winter Collection", label: "Winter Collection" },
  ];

  const multiOptionsForBadges = [
    { value: "New", text: "New", selected: false },
    { value: "Bestseller", text: "Bestseller", selected: false },
  ];

  const { control } = useFormContext();

  return (
    <ComponentCard title="Properties">
      <div className="space-y-6">
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

        <div className="space-y-6">
          <div>
            <Controller
              name="productBadges"
              control={control}
              rules={{
                validate: (value) =>
                  (value && value.length > 0) || "Select at least one Badge",
              }}
              render={({ field, fieldState }) => (
                <>
                  <MultiSelect
                    label="Badges"
                    options={multiOptionsForBadges}
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
