import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, Grid, List } from 'lucide-react';
import { useProducts, categories, brands, Product } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!products.length) return;
    const searchQuery = searchParams.get('search') || '';
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedBrand !== 'All') filtered = filtered.filter(p => p.brand === selectedBrand);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  }, [products, searchParams, selectedCategory, selectedBrand, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
  };

  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {!searchQuery && <HeroSection />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          {searchQuery ? (
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Search Results for "{searchQuery}"</h1>
              <p className="text-muted-foreground">Found {filteredProducts.length} product(s)</p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Our Products</h1>
              <p className="text-muted-foreground">Discover our wide range of quality stationery products</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
            <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('All')}>{selectedCategory} ✕</Badge>
                )}
                {selectedBrand !== 'All' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedBrand('All')}>{selectedBrand} ✕</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none"><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none"><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-52 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); window.history.pushState({}, '', '/'); }}>Clear Filters</Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
