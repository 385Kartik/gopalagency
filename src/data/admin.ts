import { Product } from './products';

// Mock order data
export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
  assignedTo?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
}

export interface DeliveryStaff {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  assignedOrders: number[];
}

// Mock data
export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    customerName: 'Raj Kumar',
    customerEmail: 'raj@gmail.com',
    customerPhone: '+91 9876543210',
    items: [
      { productId: 1, productName: 'Premium Spiral Notebook A4', quantity: 2, price: 150, total: 300 },
      { productId: 2, productName: 'Blue Ballpoint Pen Set', quantity: 1, price: 80, total: 80 }
    ],
    totalAmount: 380,
    status: 'pending',
    deliveryAddress: '123 MG Road, Bangalore, Karnataka 560001',
    orderDate: '2024-01-15',
    assignedTo: 'Ravi Singh'
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@gmail.com',
    customerPhone: '+91 9876543211',
    items: [
      { productId: 7, productName: 'Executive Leather Bound Notebook', quantity: 1, price: 450, total: 450 }
    ],
    totalAmount: 450,
    status: 'shipped',
    deliveryAddress: '456 Brigade Road, Bangalore, Karnataka 560025',
    orderDate: '2024-01-14',
    deliveryDate: '2024-01-17',
    assignedTo: 'Amit Kumar'
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    customerName: 'Arjun Patel',
    customerEmail: 'arjun@gmail.com',
    customerPhone: '+91 9876543212',
    items: [
      { productId: 3, productName: 'HB Pencils with Eraser', quantity: 3, price: 60, total: 180 },
      { productId: 5, productName: 'Gel Pen Set Multi-Color', quantity: 2, price: 120, total: 240 }
    ],
    totalAmount: 420,
    status: 'delivered',
    deliveryAddress: '789 Commercial Street, Bangalore, Karnataka 560001',
    orderDate: '2024-01-12',
    deliveryDate: '2024-01-15',
    assignedTo: 'Ravi Singh'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Raj Kumar',
    email: 'raj@gmail.com',
    phone: '+91 9876543210',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    registrationDate: '2024-01-10',
    totalOrders: 3,
    totalSpent: 1250,
    status: 'active'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    phone: '+91 9876543211',
    address: '456 Brigade Road, Bangalore, Karnataka 560025',
    registrationDate: '2024-01-08',
    totalOrders: 2,
    totalSpent: 890,
    status: 'active'
  },
  {
    id: 3,
    name: 'Arjun Patel',
    email: 'arjun@gmail.com',
    phone: '+91 9876543212',
    address: '789 Commercial Street, Bangalore, Karnataka 560001',
    registrationDate: '2024-01-05',
    totalOrders: 1,
    totalSpent: 420,
    status: 'active'
  }
];

export const mockDeliveryStaff: DeliveryStaff[] = [
  {
    id: 1,
    name: 'Ravi Singh',
    phone: '+91 9876543220',
    email: 'ravi@shreegopal.com',
    status: 'active',
    assignedOrders: [1, 3]
  },
  {
    id: 2,
    name: 'Amit Kumar',
    phone: '+91 9876543221',
    email: 'amit@shreegopal.com',
    status: 'active',
    assignedOrders: [2]
  }
];

// Dashboard stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  recentOrders: Order[];
  topProducts: { name: string; sales: number }[];
  monthlySales: { month: string; revenue: number }[];
}

export const getDashboardStats = (): DashboardStats => {
  return {
    totalOrders: mockOrders.length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalCustomers: mockCustomers.length,
    totalProducts: 8, // From products data
    pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
    shippedOrders: mockOrders.filter(o => o.status === 'shipped').length,
    deliveredOrders: mockOrders.filter(o => o.status === 'delivered').length,
    recentOrders: mockOrders.slice(0, 5),
    topProducts: [
      { name: 'Premium Spiral Notebook A4', sales: 25 },
      { name: 'Blue Ballpoint Pen Set', sales: 18 },
      { name: 'Gel Pen Set Multi-Color', sales: 12 }
    ],
    monthlySales: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 19000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 28000 }
    ]
  };
};