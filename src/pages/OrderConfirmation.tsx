import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Package, Truck, MapPin, CreditCard, Home, ShoppingBag } from 'lucide-react';

interface OrderData {
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  address: {
    fullName: string; phone: string; email: string;
    addressLine1: string; addressLine2: string;
    city: string; state: string; pincode: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  paymentMethod: string;
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('last_order');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">No Order Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find any recent orders.</p>
          <Link to="/products"><Button size="lg"><ShoppingBag className="h-4 w-4 mr-2" /> Browse Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <Badge variant="outline" className="mt-3 text-base px-4 py-1">{order.orderId}</Badge>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Estimated Delivery</h3>
                  </div>
                  <p className="text-foreground font-medium">
                    {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Standard delivery (3-5 business days)</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Shipping To</h3>
                  </div>
                  <p className="text-foreground font-medium">{order.address.fullName}</p>
                  <p className="text-sm text-muted-foreground">{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p className="text-sm text-muted-foreground">{order.address.addressLine2}</p>}
                  <p className="text-sm text-muted-foreground">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Order Items</h3>
              </div>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name} × {item.qty}</span>
                    <span className="font-medium">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (18% GST)</span><span>₹{order.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span><span>₹{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Payment</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{order.paymentMethod}</Badge>
                <span className="text-sm text-muted-foreground">— Pay ₹{order.total} at the time of delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Home className="h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <ShoppingBag className="h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
