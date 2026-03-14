import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, Grid, List, Sparkles, PackageX } from 'lucide-react';
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
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
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

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    window.history.pushState({}, '', '/');
  };

  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-500">
      <Navbar />
      
      {!searchQuery && <HeroSection />}
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header Section */}
        <div className="mb-8">
          {searchQuery ? (
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">
                Search Results for <span className="text-primary">"{searchQuery}"</span>
              </h1>
              <p className="text-muted-foreground font-medium">Found {filteredProducts.length} product(s)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Badge variant="secondary" className="mb-4 text-primary bg-primary/10 border-none px-3 py-1 gap-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Explore Collection
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 tracking-tight text-foreground">
                Our Products
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Discover our wide range of premium quality stationery, curated specially for your creative and professional needs.
              </p>
            </div>
          )}
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="bg-card border border-border shadow-sm rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              className="lg:hidden w-full sm:w-auto" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {/* Filters */}
            <div className={`flex flex-col sm:flex-row gap-3 ${showFilters ? 'flex' : 'hidden lg:flex'} flex-1`}>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Active Filter Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => setSelectedCategory('All')}>
                    {selectedCategory} <span className="ml-1 opacity-50">✕</span>
                  </Badge>
                )}
                {selectedBrand !== 'All' && (
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => setSelectedBrand('All')}>
                    {selectedBrand} <span className="ml-1 opacity-50">✕</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-none border-border">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="hidden sm:flex bg-background border border-border rounded-lg p-0.5">
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')} 
                  className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('list')} 
                  className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid / List */}
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4 p-4 border border-border rounded-2xl bg-card">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
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
          /* Empty State */
          <div className="text-center py-20 px-4 bg-card border border-border rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <PackageX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We couldn't find any products matching your current filters or search terms. Try tweaking them to find what you're looking for.
            </p>
            <Button size="lg" onClick={clearFilters} className="font-semibold shadow-md">
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;