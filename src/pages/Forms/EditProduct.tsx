import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicDetails from "../../components/form/form-elements/BasicDetails";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import PriceInventory from "../../components/form/form-elements/PriceInventory";
import Properties from "../../components/form/form-elements/Properties";
import Spec from "../../components/form/form-elements/Spec";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import { Product } from "../../components/types/Product";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";

type ProductFormValues = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const methods = useForm<ProductFormValues>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;

    if (!id) {
      setLoadError("A product ID is required.");
      return () => {
        active = false;
      };
    }

    getProductById(id)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        methods.reset(data);
      })
      .catch(() => {
        if (active) setLoadError("Product details could not be loaded.");
      });

    return () => {
      active = false;
    };
  }, [id, methods]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data, event) => {
    if (!id) return;
    setSaveError("");

    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | null;

    try {
      await updateProduct(id, {
        ...data,
        action: submitter?.value || data.action || "draft",
      });
      navigate("/products");
    } catch (error) {
      const message =
        axios.isAxiosError<{ message?: string }>(error) &&
        error.response?.data?.message;
      setSaveError(
        message || "Changes could not be saved. Please try again.",
      );
    }
  };

  return (
    <>
      <PageMeta
        title="Edit Product | Niorra Admin"
        description="Update product details, pricing, inventory, and images."
      />
      <PageBreadcrumb
        pageTitle={product ? `Edit ${product.productName}` : "Edit Product"}
      />

      {!product && !loadError && (
        <p className="py-12 text-center text-sm text-gray-500">
          Loading product…
        </p>
      )}

      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-error-200 bg-error-50 p-5 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
        >
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-3 font-medium underline"
          >
            Back to products
          </button>
        </div>
      )}

      {product && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <BasicDetails />
                <TextAreaInput />
                <Spec />
              </div>
              <div className="space-y-6">
                <PriceInventory />
                <DropzoneComponent
                  key={product.id}
                  initialImages={product.productImages ?? []}
                />
                <Properties />
              </div>
            </div>

            {saveError && (
              <p
                role="alert"
                className="rounded-lg bg-error-50 p-3 text-sm text-error-700 dark:bg-error-500/10 dark:text-error-400"
              >
                {saveError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                name="action"
                value="draft"
                disabled={methods.formState.isSubmitting}
                className="min-h-11 rounded-lg bg-gray-800 px-5 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-700"
              >
                Save as draft
              </button>
              <button
                type="submit"
                name="action"
                value="publish"
                disabled={methods.formState.isSubmitting}
                className="min-h-11 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {methods.formState.isSubmitting ? "Saving…" : "Save and publish"}
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  );
}
