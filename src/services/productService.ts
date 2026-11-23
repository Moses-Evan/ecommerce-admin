import api from "./api";
import { Product } from "../components/types/Product";

export const createCategory = async (data: Record<string, unknown>) => {
  const response = await api.post("/categories", data);

  return response.data;
};

// ✅ Create Product
export const createProduct = async (data: Partial<Product>) => {
  const response = await api.post("/products/create", data);

  return response.data;
};

// ✅ Get All Products
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  console.log("getAllProducts response:", response.data);
  return response.data;
};

// ✅ Get Product By ID
export const getProductById = async (id: string | number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// ✅ Update Product
export const updateProduct = async (
  id: string | number,
  data: Partial<Product>,
) => {
  const response = await api.put(`/products/${id}`, data);

  return response.data;
};

// ✅ Delete Product
export const deleteProduct = async (id: string | number) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post<string[]>("/products/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
