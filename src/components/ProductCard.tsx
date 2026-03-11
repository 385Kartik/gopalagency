import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercentage > 0 && (
            <Badge className="discount-tag shadow-md">{discountPercentage}% OFF</Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="text-xs font-semibold shadow-md">Out of Stock</Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            disabled={!product.inStock}
            size="sm"
            className="w-full font-semibold gap-2 backdrop-blur-sm"
            style={product.inStock ? { background: 'var(--gradient-gold)', color: 'hsl(var(--foreground))' } : {}}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground mb-2 hover:text-secondary transition-colors line-clamp-2 text-[15px] leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-secondary fill-current' : 'text-border'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="price-tag text-base">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
