import api from "./api";

// ✅ Create Product
export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);

  return response.data;
};

// ✅ Get All Products
export const getAllProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

// ✅ Get Product By ID
export const getProductById = async (id: string | number) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// ✅ Update Product
export const updateProduct = async (id: string | number, data: any) => {
  const response = await api.put(`/products/${id}`, data);

  return response.data;
};

// ✅ Delete Product
export const deleteProduct = async (id: string | number) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};
