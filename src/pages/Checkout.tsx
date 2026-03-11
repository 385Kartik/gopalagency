import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Truck, Package, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'review'>('address');
  const [isPlacing, setIsPlacing] = useState(false);

  const [address, setAddress] = useState<AddressForm>({
    fullName: '', phone: '', email: '',
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });

  // Auto-fill from user profile
  useEffect(() => {
    if (user && profile) {
      setAddress(prev => ({
        ...prev,
        fullName: prev.fullName || profile.full_name || '',
        email: prev.email || profile.email || user.email || '',
        phone: prev.phone || profile.phone || '',
      }));
    }
  }, [user, profile]);

  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

  const shipping = subtotal >= 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddressForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof AddressForm, string>> = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) newErrors.email = 'Enter a valid email';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state) newErrors.state = 'State is required';
    if (!address.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToReview = () => {
    if (validateAddress()) setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You need to be logged in to place an order.', variant: 'destructive' });
      navigate('/login?redirect=/checkout');
      return;
    }

    setIsPlacing(true);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const deliveryAddr = `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`;

    try {
      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderId,
          user_id: user.id,
          customer_name: address.fullName,
          customer_email: address.email,
          customer_phone: address.phone,
          delivery_address: deliveryAddr,
          subtotal,
          shipping,
          tax,
          total_amount: total,
          payment_method: 'Cash on Delivery',
          status: 'pending',
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(({ product, quantity }) => ({
        order_id: (orderData as any).id,
        product_name: product.name,
        product_id: product.id,
        quantity,
        price: product.price,
        total: product.price * quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any);

      if (itemsError) throw itemsError;

      // Decrement stock for each item
      for (const item of items) {
        const { error: stockError } = await supabase.rpc('decrement_stock', {
          p_product_id: item.product.id,
          p_quantity: item.quantity,
        } as any);
        if (stockError) console.error('Stock decrement error:', stockError);
      }

      // Save to localStorage for confirmation page
      localStorage.setItem('last_order', JSON.stringify({
        orderId,
        items: items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
        address,
        subtotal, shipping, tax, total,
        date: new Date().toISOString(),
        paymentMethod: 'Cash on Delivery',
      }));

      clearCart();
      navigate(`/order-confirmation?id=${orderId}`);
    } catch (err: any) {
      console.error('Order error:', err);
      toast({ title: 'Order Failed', description: err.message || 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">No Items to Checkout</h1>
          <p className="text-muted-foreground mb-8">Add some products to your cart first.</p>
          <Link to="/products"><Button size="lg"><ArrowLeft className="h-4 w-4 mr-2" /> Browse Products</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { key: 'address', label: 'Shipping Address', num: 1 },
            { key: 'review', label: 'Review & Pay', num: 2 },
          ].map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && <div className={`hidden sm:block w-20 h-0.5 ${step === 'review' ? 'bg-primary' : 'bg-border'}`} />}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s.key ? 'bg-primary text-primary-foreground' :
                  (step === 'review' && s.key === 'address') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {(step === 'review' && s.key === 'address') ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={`hidden sm:inline text-sm font-medium ${step === s.key ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form/Review */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 block">Full Name *</Label>
                      <Input name="fullName" value={address.fullName} onChange={handleChange} placeholder="Enter full name" />
                      {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Phone Number *</Label>
                      <Input name="phone" value={address.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} />
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Email Address *</Label>
                    <Input name="email" type="email" value={address.email} onChange={handleChange} placeholder="your@email.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Address Line 1 *</Label>
                    <Input name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="House/Flat No., Building, Street" />
                    {errors.addressLine1 && <p className="text-xs text-destructive mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Address Line 2</Label>
                    <Input name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Landmark, Area (Optional)" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-1.5 block">City *</Label>
                      <Input name="city" value={address.city} onChange={handleChange} placeholder="City" />
                      {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">State *</Label>
                      <Select value={address.state} onValueChange={(val) => { setAddress(prev => ({ ...prev, state: val })); setErrors(prev => ({ ...prev, state: undefined })); }}>
                        <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                        <SelectContent>
                          {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label className="mb-1.5 block">PIN Code *</Label>
                      <Input name="pincode" value={address.pincode} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} />
                      {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Link to="/cart"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart</Button></Link>
                    <Button onClick={handleContinueToReview} size="lg">Continue to Review</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Delivery Address</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setStep('address')}>Edit</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="text-sm text-muted-foreground">{address.addressLine2}</p>}
                    <p className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-sm text-muted-foreground mt-1">Phone: {address.phone} • Email: {address.email}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Order Items ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {quantity} × ₹{product.price}</p>
                        </div>
                        <p className="font-semibold">₹{product.price * quantity}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="cod">
                      <div className="flex items-center space-x-3 border border-primary rounded-lg p-4 bg-primary/5">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <span className="font-medium">Cash on Delivery (COD)</span>
                          <p className="text-sm text-muted-foreground">Pay when your order is delivered</p>
                        </Label>
                        <Badge variant="secondary">Selected</Badge>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('address')}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                  <Button onClick={handlePlaceOrder} size="lg" disabled={isPlacing} className="gap-2 min-w-[200px]">
                    {isPlacing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>Place Order — ₹{total}</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{product.name} × {quantity}</span>
                      <span>₹{product.price * quantity}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <Badge className="bg-success text-success-foreground text-xs">FREE</Badge> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {[
                    { icon: ShieldCheck, text: 'Secure Checkout' },
                    { icon: Truck, text: shipping === 0 ? 'Free Delivery' : 'Delivery: ₹40' },
                    { icon: CreditCard, text: 'Cash on Delivery' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
