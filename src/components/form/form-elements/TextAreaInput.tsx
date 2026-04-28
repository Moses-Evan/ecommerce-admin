import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";
import { Controller, useFormContext } from "react-hook-form";

export default function TextAreaInput() {
  const { control } = useFormContext();
  return (
    <ComponentCard title="Product Description">
      <div className="space-y-6">
        <div>
          <Label>Description</Label>

          <Controller
            name="productDescription"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field, fieldState }) => (
              <TextArea
                placeholder="Ex: Elegant and breathable, the Kora silk cotton saree blends the soft sheen of silk with the comfort of cotton. Perfect for everyday grace or subtle festive charm."
                value={field.value || ""} // ✅ controlled by RHF
                onChange={field.onChange} // ✅ sync with form
                rows={6}
                error={!!fieldState.error}
                hint={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Disabled TextArea */}
        {/* <div>
          <Label>Description</Label>
          <TextArea rows={6} disabled />
        </div> */}

        {/* Error TextArea */}
        {/* <div>
          <Label>Description</Label>
          <TextArea
            rows={6}
            value={messageTwo}
            error
            onChange={(value) => setMessageTwo(value)}
            hint="Please enter a valid message."
          />
        </div> */}
      </div>
    </ComponentCard>
  );
}
