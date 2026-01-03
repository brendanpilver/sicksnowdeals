// src/components/ProductDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabaseServer } from '@/lib/supabase/server';

interface ProductDetailsProps {
  productId: string;
  isOpen: boolean;
}

export function ProductDetails({ productId, isOpen }: ProductDetailsProps) {
  const [details, setDetails] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || details !== null) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = await supabaseServer();
        const { data, error: fetchError } = await supabase
          .from('product_attributes')
          .select('attrs')
          .eq('product_id', productId)
          .single();

        if (fetchError) throw fetchError;
        setDetails(data?.attrs || {});
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [productId, isOpen, details]);

  if (!isOpen) return null;
  if (isLoading) return <div style={{ padding: '10px', color: '#666' }}>Loading details...</div>;
  if (error) return <div style={{ padding: '10px', color: 'red' }}>{error}</div>;
  if (!details) return <div style={{ padding: '10px', color: '#666' }}>No details available</div>;

  return (
    <div style={{
      marginTop: '10px',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9',
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      {Object.entries(details).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '8px' }}>
          <strong style={{ textTransform: 'capitalize' }}>
            {key.replace(/_/g, ' ')}:
          </strong>{' '}
          {value === null || value === undefined ? 'N/A' : String(value)}
        </div>
      ))}
    </div>
  );
}