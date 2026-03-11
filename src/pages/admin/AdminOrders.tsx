import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PaginationControls from '@/components/PaginationControls';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Eye, ShoppingCart, Clock, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product_name: string;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

const statusConfig: Record<string, { variant: any; icon: any; label: string; className?: string }> = {
  pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
  confirmed: { variant: 'default', icon: CheckCircle, label: 'Confirmed' },
  shipped: { variant: 'default', icon: Truck, label: 'Shipped', className: 'bg-warning text-warning-foreground' },
  delivered: { variant: 'default', icon: CheckCircle, label: 'Delivered', className: 'bg-success text-success-foreground' },
  cancelled: { variant: 'destructive', icon: Clock, label: 'Cancelled' }
};

const PAGE_SIZE = 20;

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    // Get total count first
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    setTotalOrders(count || 0);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    return (data || []) as any as OrderItem[];
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleViewOrder = async (order: Order) => {
    const items = await fetchOrderItems(order.id);
    setViewOrder({ ...order, items });
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async () => {
    if (updatingOrder && newStatus) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus } as any)
        .eq('id', updatingOrder.id);

      if (!error) {
        setOrders(prev => prev.map(o =>
          o.id === updatingOrder.id ? { ...o, status: newStatus } : o
        ));
        toast({ title: 'Order Updated', description: `${updatingOrder.order_number} status changed to ${newStatus}` });
      } else {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
      setUpdateDialogOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: orders.length, icon: ShoppingCart },
          { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, icon: Clock },
          { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, icon: Truck },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.count}</p>
              </div>
              <s.icon className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(order => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>₹{order.total_amount}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className={config.className}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setUpdatingOrder(order);
                            setNewStatus(order.status);
                            setUpdateDialogOpen(true);
                          }}>
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <PaginationControls
            currentPage={page}
            totalPages={Math.ceil(totalOrders / PAGE_SIZE)}
            totalItems={totalOrders}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - {viewOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Customer:</span> <strong>{viewOrder.customer_name}</strong></div>
                <div><span className="text-muted-foreground">Phone:</span> <strong>{viewOrder.customer_phone}</strong></div>
                <div><span className="text-muted-foreground">Email:</span> <strong>{viewOrder.customer_email}</strong></div>
                <div><span className="text-muted-foreground">Date:</span> <strong>{formatDate(viewOrder.created_at)}</strong></div>
                <div><span className="text-muted-foreground">Payment:</span> <strong>{viewOrder.payment_method}</strong></div>
                <div><span className="text-muted-foreground">Status:</span> <strong className="capitalize">{viewOrder.status}</strong></div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Address:</span> <strong>{viewOrder.delivery_address}</strong>
              </div>
              {viewOrder.items && viewOrder.items.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Items:</p>
                  {viewOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>₹{item.total}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{viewOrder.total_amount}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Order: {updatingOrder?.order_number}</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
