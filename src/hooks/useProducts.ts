import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  brand: string;
  stock: number;
}

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

const mapDbProduct = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.original_price ?? undefined,
  image: p.image_url || '/placeholder.svg',
  rating: Number(p.rating),
  reviews: p.reviews,
  inStock: p.in_stock,
  category: p.category,
  brand: p.brand,
  stock: p.stock,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown as DbProduct[]).map(mapDbProduct);
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return mapDbProduct(data as unknown as DbProduct);
    },
    enabled: !!id,
  });
};

export const categories = [
  "All", "Notebooks", "Pens", "Pencils", "Erasers", "Rulers", "Markers", "Files"
];

export const brands = [
  "All", "ClassMate", "Reynolds", "Apsara", "Navneet", "Flair", "Pilot", "Parker", "Camlin"
];
