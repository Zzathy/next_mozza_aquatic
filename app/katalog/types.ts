export interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  description: string | null;
  stock: number;
  isService: boolean;
  imageUrl?: string | null;
}

export type StockFilter = "all" | "ready" | "low" | "out";

export type SortOption = "default" | "stock-desc" | "stock-asc" | "name-asc" | "name-desc";
