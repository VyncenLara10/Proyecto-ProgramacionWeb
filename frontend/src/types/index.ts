// ============================================
// TIPOS GLOBALES DE TIKALINVEST
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  referral_code: string;
  avatar?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  change_percent: number;
  sector: string;
  market_cap: number;
  volume: number;
  available_quantity: number;
  is_active: boolean;
  description?: string;
  logo?: string;
}