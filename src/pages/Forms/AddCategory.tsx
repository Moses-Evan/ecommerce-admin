import { FormProvider, useForm } from "react-hook-form";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { createCategory } from "../../services/productService";

export default function AddCategory() {
  const methods = useForm();

  const categories = [
    {
      id: 1,
      name: "Men's Wear",
      slug: "mens-wear",
      products: 124,
      enabled: true,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400",
    },
    {
      id: 2,
      name: "Women's Fashion",
      slug: "womens-fashion",
      products: 89,
      enabled: true,
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400",
    },
    {
      id: 3,
      name: "Footwear",
      slug: "footwear",
      products: 43,
      enabled: false,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400",
    },
  ];

  const onSubmit = async (data: any) => {
    try {
      console.log("FINAL ADD CATEGORY FORM DATA:", data);

      const result = await createCategory(data);

      console.log("SUCCESS:", result);

      alert(result);

      methods.reset();
    } catch (error: any) {
      console.error("ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Something went wrong while adding the category.",
      );
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PageMeta
            title="Add Categories | Niorra Admin Dashboard"
            description="Page to add new categories to the Niorra e-commerce platform. Fill in category details and upload images to create a new category listing."
          />
          {/* <PageBreadcrumb pageTitle="Category Management" /> */}
          <div className="min-h-screen bg-zinc-50 p-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Category Management
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Manage categories, visibility, and product grouping.
                </p>
              </div>

              <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02]">
                + Add New Category
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* ADD CATEGORY */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Add Category</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Create and organize product categories.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="Men's Wear"
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Category description..."
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Upload Image
                    </label>

                    <div className="flex h-36 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 transition hover:border-black">
                      Click to upload image
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Status
                    </label>

                    <select className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-black">
                      <option>Active</option>
                      <option>Disabled</option>
                    </select>
                  </div>

                  <button className="w-full rounded-2xl bg-black py-3 font-medium text-white transition hover:opacity-90">
                    Save Category
                  </button>
                </div>
              </div>

              {/* CATEGORY LIST */}
              <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Existing Categories
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Displaying categories from backend.
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Search category..."
                    className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col gap-5 rounded-3xl border border-zinc-200 p-4 transition hover:shadow-md md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />

                        <div>
                          <h3 className="text-lg font-semibold">
                            {category.name}
                          </h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            /{category.slug}
                          </p>

                          <p className="mt-2 text-sm font-medium text-zinc-700">
                            {category.products} products
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-medium ${
                            category.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {category.enabled ? "Active" : "Disabled"}
                        </span>

                        <button className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100">
                          Edit
                        </button>

                        <button
                          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            category.enabled
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {category.enabled ? "Disable" : "Enable"}
                        </button>

                        <button className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
