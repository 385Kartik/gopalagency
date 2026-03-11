import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft,
  Truck, ShieldCheck, RotateCcw, Package, ThumbsUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { getReviewsForProduct } from '@/data/reviews';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/"><Button><ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = [product.image, product.image, product.image];
  const reviews = getReviewsForProduct(product.id);
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toFixed(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({ title: 'Added to Cart', description: `${quantity}× ${product.name} added to your cart.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <div className="relative rounded-xl overflow-hidden bg-muted mb-4 aspect-square">
              <img src={images[selectedImageIdx]} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && <Badge className="absolute top-4 left-4 text-sm px-3 py-1 bg-destructive text-destructive-foreground">{discount}% OFF</Badge>}
              {images.length > 1 && (
                <>
                  <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card" onClick={() => setSelectedImageIdx(i => (i - 1 + images.length) % images.length)}><ChevronLeft className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card" onClick={() => setSelectedImageIdx(i => (i + 1) % images.length)}><ChevronRight className="h-5 w-5" /></Button>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImageIdx(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImageIdx ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">Brand: <strong className="text-foreground">{product.brand}</strong></p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}</div>
              <span className="font-semibold">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length || product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <Badge className="bg-success text-success-foreground">Save ₹{product.originalPrice - product.price}</Badge>
                </>
              )}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <><div className="w-2 h-2 rounded-full bg-success" /><span className="text-sm text-success font-medium">In Stock</span><span className="text-sm text-muted-foreground">({product.stock} available)</span></>
              ) : (
                <><div className="w-2 h-2 rounded-full bg-destructive" /><span className="text-sm text-destructive font-medium">Out of Stock</span></>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</Button>
              <Button variant="outline" size="icon" className="h-11 w-11"><Heart className="h-5 w-5" /></Button>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹500' },
                { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center"><Icon className="h-6 w-6 text-primary mx-auto mb-1" /><p className="text-xs font-semibold">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              ))}
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold">{avgRating}</p>
                  <div className="flex justify-center my-2">{[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(avgRating)) ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}</div>
                  <p className="text-sm text-muted-foreground">{reviews.length || product.reviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingCounts.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{star}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="w-6 text-muted-foreground text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-2 space-y-4">
              {reviews.length > 0 ? reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary font-semibold text-sm">{review.userName.charAt(0)}</span></div>
                        <div><p className="font-medium text-sm">{review.userName}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                      </div>
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}</div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground"><ThumbsUp className="h-3 w-3 mr-1" /> Helpful ({review.helpful})</Button>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-12 text-muted-foreground"><p>No reviews yet. Be the first to review this product!</p></div>
              )}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={(prod) => { addToCart(prod); toast({ title: 'Added to Cart', description: `${prod.name} added to your cart.` }); }} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
