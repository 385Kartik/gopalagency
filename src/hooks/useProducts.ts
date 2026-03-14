import { useState, useEffect } from 'react';
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

export const categories = ['Notebooks', 'Pens', 'Pencils', 'Bags', 'Accessories', 'All'];
export const brands = ['Classmate', 'Reynolds', 'Parker', 'Cello', 'All'];

export const useProducts = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        if (productsData) {
          const formattedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: p.original_price,
            image: p.image_url || 'https://via.placeholder.com/300',
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            inStock: p.in_stock ?? true,
            category: p.category || 'Uncategorized',
            brand: p.brand || 'Generic',
            stock: p.stock || 0
          }));
          setData(formattedProducts);
        }
      } catch (err) {
        console.error("Products fetch error:", err);
        setData([]); // Taki UI crash na ho
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, isLoading };
};

export const useProduct = (id: number) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (productData) {
          setData({
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.original_price,
            image: productData.image_url || 'https://via.placeholder.com/300',
            rating: productData.rating || 0,
            reviews: productData.reviews || 0,
            inStock: productData.in_stock ?? true,
            category: productData.category || 'Uncategorized',
            brand: productData.brand || 'Generic',
            stock: productData.stock || 0
          });
        }
      } catch (err) {
        console.error('Product fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, isLoading };
};