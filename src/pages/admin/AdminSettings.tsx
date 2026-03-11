import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/context/AdminContext';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { admin } = useAdmin();
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Shree Gopal Agency',
    email: 'shreegopalagency55@gmail.com',
    phone: '+91 9876543210',
    address: 'MG Road, Bangalore, Karnataka 560001',
    gst: 'GSTIN12345678',
  });
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    stockAlerts: true,
    customerAlerts: false,
    emailReports: true,
  });

  const handleSaveStore = () => {
    toast({ title: 'Settings Saved', description: 'Store settings have been updated' });
  };

  const handleSaveNotifications = () => {
    toast({ title: 'Settings Saved', description: 'Notification preferences updated' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Update your store details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Store Name</Label>
                  <Input value={storeSettings.storeName} onChange={e => setStoreSettings({ ...storeSettings, storeName: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={storeSettings.email} onChange={e => setStoreSettings({ ...storeSettings, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input value={storeSettings.phone} onChange={e => setStoreSettings({ ...storeSettings, phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>GST Number</Label>
                  <Input value={storeSettings.gst} onChange={e => setStoreSettings({ ...storeSettings, gst: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Input value={storeSettings.address} onChange={e => setStoreSettings({ ...storeSettings, address: e.target.value })} />
              </div>
              <Button onClick={handleSaveStore}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure alert settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified for new orders' },
                { key: 'stockAlerts', label: 'Stock Alerts', desc: 'Get notified when stock is low' },
                { key: 'customerAlerts', label: 'Customer Alerts', desc: 'Get notified for new registrations' },
                { key: 'emailReports', label: 'Email Reports', desc: 'Receive daily sales reports' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your admin account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                   <Label>Email</Label>
                   <Input value={admin?.email || ''} disabled />
                 </div>
                 <div className="grid gap-2">
                   <Label>Role</Label>
                   <Input value="Admin" disabled />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Contact super admin to update account details.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
