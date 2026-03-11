import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Package, ImagePlus, X } from 'lucide-react';
import { categories, brands } from '@/hooks/useProducts';
import { toast } from '@/hooks/use-toast';
import PaginationControls from '@/components/PaginationControls';
import { usePagination } from '@/hooks/usePagination';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface DbProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number;
  reviews: number;
  in_stock: boolean;
  category: string;
  brand: string;
  stock: number;
  is_active: boolean;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice: number | '';
  discount: number | '';
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: number;
  imageFile: File | null;
  imagePreview: string;
}

const emptyForm: ProductForm = {
  name: '', description: '', price: 0, originalPrice: '', discount: '',
  category: '', brand: '', stock: 0, rating: 0, reviews: 0,
  imageFile: null, imagePreview: ''
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: productList = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as DbProduct[];
    },
  });

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, paginatedItems, goToPage, totalItems, pageSize } = usePagination(filtered, { pageSize: 15 });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: DbProduct) => {
    setEditingProduct(product);
    const discount = product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : '';
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price || '',
      discount,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      rating: Number(product.rating),
      reviews: product.reviews,
      imageFile: null,
      imagePreview: product.image_url || '',
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Max image size is 5MB', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageFile: file, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.category || form.price <= 0) {
      toast({ title: 'Validation Error', description: 'Name, category, and price are required', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = editingProduct?.image_url || null;

      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        original_price: form.originalPrice ? Number(form.originalPrice) : null,
        category: form.category,
        brand: form.brand,
        stock: form.stock,
        rating: form.rating,
        reviews: form.reviews,
        in_stock: form.stock > 0,
        image_url: imageUrl,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData as any)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast({ title: 'Product Updated', description: `${form.name} has been updated` });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData as any);
        if (error) throw error;
        toast({ title: 'Product Added', description: `${form.name} has been added` });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_active: false } as any)
          .eq('id', deletingId);
        if (error) throw error;
        toast({ title: 'Product Deleted', description: 'Product has been removed' });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold">{productList.length}</p></div><Package className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">In Stock</p><p className="text-2xl font-bold">{productList.filter(p => p.stock > 0).length}</p></div><Badge className="bg-success text-success-foreground">Active</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Out of Stock</p><p className="text-2xl font-bold">{productList.filter(p => p.stock === 0).length}</p></div><Badge variant="destructive">Alert</Badge></div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell className="text-muted-foreground">{product.original_price ? `₹${product.original_price}` : '—'}</TableCell>
                  <TableCell>
                    {product.original_price && product.original_price > product.price ? (
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </Badge>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-destructive font-semibold' : ''}>{product.stock}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeletingId(product.id); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={goToPage} />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label>Product Image</Label>
              <div className="flex items-start gap-4">
                {form.imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => setForm(prev => ({ ...prev, imagePreview: '', imageFile: null }))}><X className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <ImagePlus className="h-8 w-8" /><span className="text-xs">Upload Image</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {form.imagePreview && <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change Image</Button>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Premium Spiral Notebook A4" />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Original Price / MRP (₹)</Label>
                <Input type="number" min={0} value={form.originalPrice} onChange={e => {
                  const mrp = e.target.value ? Number(e.target.value) : '';
                  if (mrp && form.discount) {
                    const selling = Math.round(Number(mrp) * (1 - Number(form.discount) / 100));
                    setForm({ ...form, originalPrice: mrp, price: selling });
                  } else {
                    setForm({ ...form, originalPrice: mrp });
                  }
                }} placeholder="Enter MRP" />
              </div>
              <div className="grid gap-2">
                <Label>Discount (%)</Label>
                <Input type="number" min={0} max={100} value={form.discount} onChange={e => {
                  const disc = e.target.value ? Number(e.target.value) : '';
                  if (disc && form.originalPrice) {
                    const selling = Math.round(Number(form.originalPrice) * (1 - Number(disc) / 100));
                    setForm({ ...form, discount: disc, price: selling });
                  } else {
                    setForm({ ...form, discount: disc });
                  }
                }} placeholder="e.g. 25" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Selling Price (₹) *</Label>
                <Input type="number" min={0} value={form.price} onChange={e => {
                  const selling = Number(e.target.value);
                  if (form.originalPrice && Number(form.originalPrice) > 0) {
                    const disc = Math.round(((Number(form.originalPrice) - selling) / Number(form.originalPrice)) * 100);
                    setForm({ ...form, price: selling, discount: disc > 0 ? disc : '' });
                  } else {
                    setForm({ ...form, price: selling });
                  }
                }} />
                {form.originalPrice && form.discount ? <p className="text-xs text-primary font-medium">{form.discount}% off on MRP ₹{form.originalPrice}</p> : null}
              </div>
              <div className="grid gap-2">
                <Label>Stock Quantity *</Label>
                <Input type="number" min={0} value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Select value={form.brand} onValueChange={v => setForm({ ...form, brand: v })}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands.filter(b => b !== 'All').map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Rating (0-5)</Label>
                <Input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Reviews Count</Label>
                <Input type="number" min={0} value={form.reviews} onChange={e => setForm({ ...form, reviews: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
