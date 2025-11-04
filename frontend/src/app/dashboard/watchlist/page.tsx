'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card2';
import { Button } from '@/components/ui/button2';
import { formatCurrency, getChangeColor } from '@/lib/utils';
import { Star, TrendingUp, TrendingDown, Eye, ShoppingCart, Trash2 } from 'lucide-react';
import {getWatchlist, toggleWatchlist } from '@/lib/api';
import { toast } from 'sonner';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setIsLoading(true);
    try {
      const data = await getWatchlist();
      setWatchlist(data.results || data);
    } catch (error) {
      toast.error('Error al cargar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = async (stockId: string) => {
    try {
      await toggleWatchlist(stockId);
      toast.success('Removido de favoritos');
      loadWatchlist();
    } catch (error) {
      toast.error('Error al remover de favoritos');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

}