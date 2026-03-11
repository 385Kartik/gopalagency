import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Users, UserCheck, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PaginationControls from '@/components/PaginationControls';
import { usePagination } from '@/hooks/usePagination';

interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch order stats per user
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, total_amount');

      const orderStats = new Map<string, { count: number; total: number }>();
      if (orders) {
        for (const o of orders as any[]) {
          const existing = orderStats.get(o.user_id) || { count: 0, total: 0 };
          orderStats.set(o.user_id, { count: existing.count + 1, total: existing.total + o.total_amount });
        }
      }

      if (profiles) {
        const enriched: CustomerProfile[] = (profiles as any[]).map(p => {
          const stats = orderStats.get(p.user_id) || { count: 0, total: 0 };
          return {
            ...p,
            order_count: stats.count,
            total_spent: stats.total,
          };
        });
        setCustomers(enriched);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, paginatedItems, goToPage, totalItems, pageSize } = usePagination(filtered, { pageSize: 20 });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Registered customers from the store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">With Orders</p>
              <p className="text-2xl font-bold">{customers.filter(c => c.order_count > 0).length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-success" />
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No customers found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.full_name || '—'}</TableCell>
                    <TableCell>{customer.email || '—'}</TableCell>
                    <TableCell>{customer.phone || '—'}</TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                    <TableCell>{customer.order_count}</TableCell>
                    <TableCell>₹{customer.total_spent}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setViewCustomer(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Name:</span> <strong>{viewCustomer.full_name || '—'}</strong></div>
                <div><span className="text-muted-foreground">Email:</span> <strong>{viewCustomer.email || '—'}</strong></div>
                <div><span className="text-muted-foreground">Phone:</span> <strong>{viewCustomer.phone || '—'}</strong></div>
                <div><span className="text-muted-foreground">Joined:</span> <strong>{formatDate(viewCustomer.created_at)}</strong></div>
                <div><span className="text-muted-foreground">Total Orders:</span> <strong>{viewCustomer.order_count}</strong></div>
                <div><span className="text-muted-foreground">Total Spent:</span> <strong>₹{viewCustomer.total_spent}</strong></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
