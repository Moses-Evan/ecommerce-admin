import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Product } from "../components/types/Product";
import { getAllProducts } from "../services/productService";

type StatusFilter = "all" | "live" | "draft";
type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
type PageItem = number | "start-ellipsis" | "end-ellipsis";

const getProductCategory = (product: Product) =>
  product.productCategory || product.productSubType || "Uncategorized";

const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = start + 4;
  const pages: PageItem[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("start-ellipsis");
  }

  for (let page = start; page <= end; page += 1) pages.push(page);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("end-ellipsis");
    pages.push(totalPages);
  }

  return pages;
};

const isProductLive = (product: Product) =>
  ["publish", "published"].includes(product.action?.toLowerCase());

const formatPrice = (price?: number) =>
  typeof price === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
      }).format(price)
    : "—";

const ProductStatus = ({ product }: { product: Product }) => {
  const live = isProductLive(product);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        live
          ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {live ? "Live" : "Draft"}
    </span>
  );
};

const StockCount = ({ stock }: { stock?: number }) => {
  const quantity = stock ?? 0;
  const stockClass =
    quantity <= 0
      ? "text-error-600 dark:text-error-400"
      : quantity <= 5
        ? "text-warning-600 dark:text-warning-400"
        : "text-gray-700 dark:text-gray-300";

  return (
    <span className={`font-medium ${stockClass}`}>
      {quantity <= 0 ? "Out of stock" : `${quantity} available`}
    </span>
  );
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await getAllProducts());
    } catch {
      setError("Products could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, stockFilter, categoryFilter, pageSize]);

  const categories = useMemo(
    () =>
      [...new Set(products.map(getProductCategory))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [product.productName, product.productSku, product.productBrand]
          .some((value) => value?.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" ? isProductLive(product) : !isProductLive(product));
      const stock = product.productStock ?? 0;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && stock > 0) ||
        (stockFilter === "low-stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "out-of-stock" && stock <= 0);
      const matchesCategory =
        !categoryFilter || getProductCategory(product) === categoryFilter;
      return matchesSearch && matchesStatus && matchesStock && matchesCategory;
    });
  }, [products, search, statusFilter, stockFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = getPageItems(currentPage, totalPages);
  const pageProducts = visibleProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const firstProduct = visibleProducts.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastProduct = Math.min(currentPage * pageSize, visibleProducts.length);
  const hasActiveFilters =
    search || statusFilter !== "all" || stockFilter !== "all" || categoryFilter;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStockFilter("all");
    setCategoryFilter("");
  };

  return (
    <>
      <PageMeta
        title="Products | Niorra Admin"
        description="Browse product availability, pricing, and publication status."
      />
      <PageBreadcrumb pageTitle="All Products" />
      <div className="space-y-6">
        <ComponentCard
          title={`Products${loading ? "" : ` (${visibleProducts.length})`}`}
          desc="Review stock, pricing, and listing status. Select a product to edit its details and images."
        >
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, SKU, or brand"
              className="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
            />
            <label className="sr-only" htmlFor="product-status">
              Filter by status
            </label>
            <select
              id="product-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition duration-200 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">All statuses</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
            </select>
            <label className="sr-only" htmlFor="product-stock">
              Filter by stock
            </label>
            <select
              id="product-stock"
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value as StockFilter)
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition duration-200 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">All stock</option>
              <option value="in-stock">In stock</option>
              <option value="low-stock">Low stock (1–5)</option>
              <option value="out-of-stock">Out of stock</option>
            </select>
            <label className="sr-only" htmlFor="product-category">
              Filter by category
            </label>
            <select
              id="product-category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition duration-200 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Link
              to="/add-product"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md active:translate-y-0"
            >
              Add product
            </Link>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-lg px-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-700 sm:flex-row sm:items-center sm:justify-between dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void fetchProducts()}
                className="self-start font-medium underline sm:self-auto"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Loading products…
            </p>
          ) : error ? null : visibleProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                {products.length === 0
                  ? "No products found."
                  : "No products match these filters."}
              </p>
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm font-medium text-brand-600 underline dark:text-brand-400"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {pageProducts.map((product, index) => (
                  <article
                    key={product.id}
                    style={{ animationDelay: `${Math.min(index, 6) * 35}ms` }}
                    className="product-list-item rounded-xl border border-gray-200 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500/40"
                  >
                    <div className="flex gap-3">
                      <img
                        src={product.productImages?.[0] || "/images/product/product-01.jpg"}
                        alt=""
                        className="h-20 w-16 shrink-0 rounded-lg bg-gray-100 object-cover dark:bg-gray-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                              {product.productName || "Untitled product"}
                            </h3>
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {product.productBrand || "No brand"} · SKU{" "}
                              {product.productSku || "—"}
                            </p>
                          </div>
                          <ProductStatus product={product} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {formatPrice(product.productSellingPrice)}
                            {product.productMrp > product.productSellingPrice && (
                              <span className="ml-2 text-xs font-normal text-gray-400 line-through">
                                {formatPrice(product.productMrp)}
                              </span>
                            )}
                          </span>
                          <StockCount stock={product.productStock} />
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/edit-product/${product.id}`}
                      className="mt-3 flex min-h-10 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
                    >
                      Edit product
                    </Link>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <Table className="text-left text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800">
                      {["Product", "SKU / Category", "Price", "Stock", "Status", ""].map(
                        (heading) => (
                          <TableCell
                            key={heading || "actions"}
                            isHeader
                            className="whitespace-nowrap px-4 py-3 font-medium text-gray-500"
                          >
                            {heading}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="product-list-item border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                      >
                        <TableCell className="min-w-64 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.productImages?.[0] || "/images/product/product-01.jpg"}
                              alt=""
                              className="h-12 w-10 rounded-md bg-gray-100 object-cover dark:bg-gray-800"
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {product.productName || "Untitled product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.productBrand || "No brand"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                          <p>{product.productSku || "—"}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {product.productCategory || product.productSubType || "Uncategorized"}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {formatPrice(product.productSellingPrice)}
                          </p>
                          {product.productMrp > product.productSellingPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(product.productMrp)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-3">
                          <StockCount stock={product.productStock} />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <ProductStatus product={product} />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <Link
                            to={`/edit-product/${product.id}`}
                            className="inline-block font-medium text-brand-600 transition duration-200 hover:translate-x-0.5 hover:text-brand-700 dark:text-brand-400"
                          >
                            Edit
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <p aria-live="polite">
                    Showing {firstProduct}–{lastProduct} of {visibleProducts.length}
                  </p>
                  <label htmlFor="product-page-size">Rows</label>
                  <select
                    id="product-page-size"
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>per page</span>
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Product list pages"
                    className="flex items-center gap-1"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={currentPage === 1}
                      className="min-h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Previous
                    </button>
                    {pageItems.map((pageItem) =>
                      typeof pageItem === "number" ? (
                        <button
                          key={pageItem}
                          type="button"
                          aria-label={`Page ${pageItem}`}
                          aria-current={
                            currentPage === pageItem ? "page" : undefined
                          }
                          onClick={() => setPage(pageItem)}
                          className={`min-h-9 min-w-9 rounded-lg px-2 text-sm transition ${
                            currentPage === pageItem
                              ? "bg-brand-500 font-medium text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageItem}
                        </button>
                      ) : (
                        <span
                          key={pageItem}
                          aria-hidden="true"
                          className="px-1 text-gray-400"
                        >
                          …
                        </span>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="min-h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </div>
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
