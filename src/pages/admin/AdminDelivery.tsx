import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Users, Package, Plus, Pencil, Eye } from 'lucide-react';
import { mockDeliveryStaff, DeliveryStaff, mockOrders } from '@/data/admin';
import { toast } from '@/hooks/use-toast';

const AdminDelivery = () => {
  const [staff, setStaff] = useState<DeliveryStaff[]>(mockDeliveryStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<DeliveryStaff | null>(null);
  const [form, setForm] = useState<{ name: string; phone: string; email: string; status: 'active' | 'inactive' }>({ name: '', phone: '', email: '', status: 'active' });
  const [viewStaff, setViewStaff] = useState<DeliveryStaff | null>(null);

  const openAdd = () => {
    setEditingStaff(null);
    setForm({ name: '', phone: '', email: '', status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (s: DeliveryStaff) => {
    setEditingStaff(s);
    setForm({ name: s.name, phone: s.phone, email: s.email, status: s.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast({ title: 'Error', description: 'Name and phone are required', variant: 'destructive' });
      return;
    }
    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...form } : s));
      toast({ title: 'Staff Updated', description: `${form.name} has been updated` });
    } else {
      setStaff(prev => [...prev, { ...form, id: Date.now(), assignedOrders: [] }]);
      toast({ title: 'Staff Added', description: `${form.name} has been added` });
    }
    setDialogOpen(false);
  };

  const getAssignedOrders = (orderIds: number[]) =>
    mockOrders.filter(o => orderIds.includes(o.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Staff</h1>
          <p className="text-muted-foreground">Manage delivery personnel and assignments</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{staff.filter(s => s.status === 'active').length}</p>
            </div>
            <Truck className="h-8 w-8 text-success" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold">{staff.reduce((sum, s) => sum + s.assignedOrders.length, 0)}</p>
            </div>
            <Package className="h-8 w-8 text-warning" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.assignedOrders.length}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewStaff(s)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Assigned Orders */}
      <Dialog open={!!viewStaff} onOpenChange={() => setViewStaff(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewStaff?.name} - Assigned Orders</DialogTitle>
          </DialogHeader>
          {viewStaff && (
            <div className="space-y-3">
              {getAssignedOrders(viewStaff.assignedOrders).length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders assigned</p>
              ) : (
                getAssignedOrders(viewStaff.assignedOrders).map(order => (
                  <div key={order.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName} • {order.deliveryAddress}</p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}
                      className={order.status === 'delivered' ? 'bg-success text-success-foreground' : ''}>
                      {order.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Delivery Staff'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingStaff ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDelivery;
