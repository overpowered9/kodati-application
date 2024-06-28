import { Transaction, Product, User, Order, Log, Category, Region, Notification } from '@/database/models';

export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

export interface PaginatedTransactions extends PaginatedData<Transaction> {
  currentBalance: number | null;
}
export interface PaginatedProducts extends PaginatedData<Product> { }
export interface PaginatedStores extends PaginatedData<User> { }
export interface PaginatedOrders extends PaginatedData<Order> { }
export interface PaginatedLogs extends PaginatedData<Log> { }
export interface PaginatedCategories extends PaginatedData<Category> { }
export interface PaginatedRegions extends PaginatedData<Region> { }
export interface PaginatedNotifications extends PaginatedData<Notification> {
  page: number;
}

export interface PaginatedStore {
  user: User;
  totalItems: number;
  totalPages: number;
}