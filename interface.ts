export interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    totalPrice: number;
    status: string;
    createdAt: string;
  }
  
  export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  }