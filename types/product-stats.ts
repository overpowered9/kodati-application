import { Product } from "@/database/models";

export interface ProductWithStats extends Product {
  orders: number;
  cost: string | null;
}

export interface Stats {
  items: ProductWithStats[];
  totalItems: number;
  totalPages: number;
}