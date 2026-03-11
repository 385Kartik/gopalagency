import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, subtotal } = useCart();

  const shipping = subtotal >= 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    toast({ title: 'Removed', description: `${name} removed from cart` });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">{totalItems} item(s) in your cart</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { clearCart(); toast({ title: 'Cart Cleared' }); }}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{product.category} • {product.brand}</p>
                          {product.inStock ? (
                            <Badge variant="outline" className="mt-1 text-success border-success">In Stock</Badge>
                          ) : (
                            <Badge variant="destructive" className="mt-1">Out of Stock</Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(product.id, product.name)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{product.price * quantity}</p>
                          {quantity > 1 && (
                            <p className="text-xs text-muted-foreground">₹{product.price} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Link to="/">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <Badge className="bg-success text-success-foreground">FREE</Badge> : `₹${shipping}`}</span>
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
                {subtotal < 500 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Add ₹{500 - subtotal} more for free shipping!
                  </p>
                )}
                <Link to="/checkout">
                  <Button className="w-full mt-6" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-4 space-y-3">
                {[
                  { icon: ShieldCheck, text: 'Secure Payment' },
                  { icon: Truck, text: 'Fast Delivery' },
                  { icon: RotateCcw, text: '7-Day Returns' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
