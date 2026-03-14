import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { useProducts, categories, brands, Product } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import PaginationControls from '@/components/PaginationControls';
import { usePagination } from '@/hooks/usePagination';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    if (search) setSearchQuery(search);
    if (category) {
      const matched = categories.find(c => c.toLowerCase() === category.toLowerCase());
      if (matched) setSelectedCategory(matched);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!products.length && !isLoading) return;
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
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return b.id - a.id;
        default: return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedBrand, sortBy, searchQuery, priceRange, isLoading]);

  const ProductsPaginated = ({ items, vm, onAdd }: { items: Product[]; vm: 'grid' | 'list'; onAdd: (p: Product) => void }) => {
    const { currentPage, totalPages, paginatedItems, goToPage, totalItems, pageSize } = usePagination(items, { pageSize: 12 });
    return (
      <div>
        <div className={`grid gap-6 ${vm === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {paginatedItems.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAdd} />)}
        </div>
        <div className="mt-6">
          <PaginationControls currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={goToPage} />
        </div>
      </div>
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSortBy('name');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedBrand !== 'All' || searchQuery !== '' || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient text-primary-foreground py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display gold-accent font-bold mb-3">All Products</h1>
          <p className="text-primary-foreground/70 text-lg">Browse our complete collection of premium stationery</p>
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Input
                type="text" placeholder="Search products by name, brand, or category..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 backdrop-blur-sm focus:bg-primary-foreground/15"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/40" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> Filters</h3>
                {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs text-destructive hover:text-destructive">Clear All</Button>}
              </div>
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'}`}>
                      {cat}
                      {cat !== 'All' && <span className="float-right text-xs opacity-60">{products.filter(p => p.category === cat).length}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Brand</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button key={brand} onClick={() => setSelectedBrand(brand)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === brand ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'}`}>
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Price Range</h4>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" value={priceRange[0] || ''} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="text-sm" />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" placeholder="Max" value={priceRange[1] || ''} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="text-sm" />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4 mr-2" /> Filters</Button>
                <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products</p>
                <div className="hidden sm:flex flex-wrap gap-2">
                  {selectedCategory !== 'All' && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('All')}>{selectedCategory} ✕</Badge>}
                  {selectedBrand !== 'All' && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedBrand('All')}>{selectedBrand} ✕</Badge>}
                  {searchQuery && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>"{searchQuery}" ✕</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[170px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-border rounded-lg">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none"><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none"><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="lg:hidden bg-card rounded-xl p-4 mb-6 border border-border space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
                  <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
                {hasActiveFilters && <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">Clear All Filters</Button>}
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3"><Skeleton className="h-52 w-full rounded-xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductsPaginated items={filteredProducts} vm={viewMode} onAdd={handleAddToCart} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center"><Search className="h-8 w-8 text-muted-foreground" /></div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
