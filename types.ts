export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'debt' | 'payment'; // 'debt' means they bought on credit, 'payment' means they paid back
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  currentDebt: number; // Positive number means they owe money
  history: Transaction[];
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  items: SaleItem[];
  paymentMethod: 'cash' | 'credit';
  customerId?: string; // If credit/fiado
}

export type ViewState = 'dashboard' | 'pos' | 'inventory' | 'credits' | 'advisor';

export interface DashboardStats {
  totalSalesToday: number;
  totalPendingDebt: number;
  lowStockCount: number;
}