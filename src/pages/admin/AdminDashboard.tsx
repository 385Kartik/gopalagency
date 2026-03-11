import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp,
  Eye,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';


interface DashboardOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Use aggregate count for stats instead of fetching all rows
      const [ordersRes, profilesRes, pendingRes, revenueOrders, productsRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('id, order_number, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(50),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      setTotalOrderCount(ordersRes.count || 0);
      setPendingCount(pendingRes.count || 0);
      setCustomerCount(profilesRes.count || 0);
      const recentData = (revenueOrders.data || []) as any[];
      setOrders(recentData.slice(0, 5));
      setTotalRevenue(recentData.reduce((sum: number, o: any) => sum + o.total_amount, 0));
      setProductCount(productsRes.count || 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  const recentOrders = orders;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      shipped: { variant: "default", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge 
        variant={config.variant}
        className={config.variant === 'success' ? 'bg-success text-success-foreground' : ''}
      >
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at Shree Gopal Agency.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrderCount}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              From {totalOrderCount} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>₹{order.total_amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Package className="h-5 w-5" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>View Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
