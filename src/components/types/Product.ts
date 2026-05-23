export interface Product {
  id: string;

  productBrand: string;
  productColor: string;
  productDescription: string;
  productDiscount: number;
  productFabricType: string;

  productImages: string[];

  productMrp: number;

  productName: string;

  productOccasion: string[];

  productSaleReason: string;

  productSellingPrice: number;

  productSku: string;

  productStock: number;

  productCategory: string;

  productBadges: string[];

  productColorCode: string;
  productSubType: string;
  productType: string;
  updatedAt: Date;
  createdAt: Date;
}
