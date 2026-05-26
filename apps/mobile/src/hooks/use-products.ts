import { useCallback, useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency_code: string | null;
  brand: string | null;
  frame_color: string | null;
  frame_material: string | null;
  frame_type: string | null;
  thumbnail_url: string | null;
  ar_enabled: boolean | null;
  avg_rating: number | string | null;
  stock_quantity: number | null;
  categories?: { name: string | null } | { name: string | null }[] | null;
};

const PRODUCT_COLUMNS =
  'id,name,description,price_cents,currency_code,brand,frame_color,frame_material,frame_type,thumbnail_url,ar_enabled,avg_rating,stock_quantity,categories:category_id(name)';

function categoryName(categories: ProductRow['categories']) {
  if (Array.isArray(categories)) return categories[0]?.name ?? '';
  return categories?.name ?? '';
}

function productImageUrl(value: string | null) {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;

  const path = value.replace(/^\/+/, '');
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price_cents,
    currency: row.currency_code ?? 'USD',
    brand: row.brand ?? '',
    model_number: '',
    frame_color: row.frame_color ?? '',
    lens_color: '',
    frame_material: row.frame_material ?? '',
    style: row.frame_type ?? categoryName(row.categories),
    gender: '',
    face_shape: '',
    images: productImageUrl(row.thumbnail_url) ? [productImageUrl(row.thumbnail_url)!] : [],
    is_virtual_try_on_enabled: Boolean(row.ar_enabled),
    rating: Number(row.avg_rating ?? 0),
    review_count: 0,
    category: categoryName(row.categories),
    stock_quantity: row.stock_quantity ?? 0,
  };
}

async function fetchProducts(limit?: number) {
  let query = supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(toProduct);
}

export function useProducts(limit?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      setProducts(await fetchProducts(limit));
      setError(null);
    } catch (e) {
      setProducts([]);
      setError(e instanceof Error ? e.message : 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProducts]);

  return { products, isLoading, error, refetch: loadProducts };
}

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (!productId) {
      timer = setTimeout(() => {
        if (!isMounted) return;
        setProduct(null);
        setIsLoading(false);
        setError('Missing product id.');
      }, 0);

      return () => {
        isMounted = false;
        if (timer) clearTimeout(timer);
      };
    }

    async function loadProduct() {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(PRODUCT_COLUMNS)
          .eq('id', productId)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (isMounted) {
          setProduct(data ? toProduct(data as unknown as ProductRow) : null);
          setError(data ? null : 'Product not found.');
        }
      } catch (e) {
        if (isMounted) {
          setProduct(null);
          setError(e instanceof Error ? e.message : 'Unable to load product.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    timer = setTimeout(() => {
      void loadProduct();
    }, 0);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [productId]);

  return { product, isLoading, error };
}
