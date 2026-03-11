import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, ShoppingBag, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  payment_method: string;
  items: { product_name: string; quantity: number; price: number; total: number }[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', icon: Package, color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
};

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (!ordersData) { setLoading(false); return; }

      // Batch fetch all order items in one query
      const orderIds = ordersData.map((o: any) => o.id);
      const { data: allItems } = await supabase
        .from('order_items')
        .select('order_id, product_name, quantity, price, total')
        .in('order_id', orderIds);

      const itemsByOrder = new Map<string, any[]>();
      (allItems || []).forEach((item: any) => {
        const list = itemsByOrder.get(item.order_id) || [];
        list.push(item);
        itemsByOrder.set(item.order_id, list);
      });

      const ordersWithItems: Order[] = ordersData.map((order: any) => ({
        ...order,
        items: itemsByOrder.get(order.id) || [],
      }));

      setOrders(ordersWithItems);
      setLoading(false);
    };
    fetchOrders();
  }, [user, page]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Please Log In</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in to view your orders.</p>
          <Link to="/login?redirect=/my-orders"><Button size="lg">Log In</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">Start shopping to see your orders here!</p>
          <Link to="/products"><Button size="lg">Browse Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">{orders.length} order(s)</p>

        <div className="space-y-6">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={`${status.color} gap-1 w-fit`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.product_name} × {item.quantity}</span>
                        <span className="text-foreground">₹{item.total}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{order.payment_method}</span>
                    <span className="font-bold text-lg">₹{order.total_amount}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
