export enum TransactionType {
  SALE = 'PENJUALAN',
  PURCHASE = 'PEMBELIAN',
  EXPENSE = 'PENGELUARAN_OP',
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  buyPrice: number; // HPP (Harga Pokok Penjualan) per unit
  sellPrice: number;
  sku: string;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtTransaction: number;
  costAtTransaction: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  items?: TransactionItem[];
  totalAmount: number;
  description: string;
  // For expenses
  category?: string; 
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  refId: string;
}

// AI Analysis Types
export interface FinancialSummary {
  totalRevenue: number;
  totalCOGS: number;
  totalExpenses: number;
  netProfit: number;
  lowStockCount: number;
  inventoryValue: number;
}