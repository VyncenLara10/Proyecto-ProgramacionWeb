// ============================================
// CONSTANTES GLOBALES DE TIKALINVEST
// ============================================

export const APP_NAME = 'TikalInvest';
export const APP_DESCRIPTION = 'Plataforma moderna de trading e inversión';

// ============================================
// SECTORES DE ACCIONES
// ============================================

export const STOCK_SECTORS = [
  'Tecnología',
  'Finanzas',
  'Salud',
  'Energía',
  'Consumo',
  'Industrial',
  'Telecomunicaciones',
  'Servicios Públicos',
  'Materiales',
  'Inmobiliario'
] as const;

export type StockSector = typeof STOCK_SECTORS[number];

// ============================================
// PERÍODOS DE TIEMPO PARA GRÁFICOS
// ============================================

export const TIME_PERIODS = {
  '1D': '1 Día',
  '1W': '1 Semana',
  '1M': '1 Mes',
  '3M': '3 Meses',
  '1Y': '1 Año',
  'ALL': 'Todo'
} as const;

export type TimePeriod = keyof typeof TIME_PERIODS;

// ============================================
// ESTADOS DE TRANSACCIONES
// ============================================

export const TRANSACTION_STATUS = {
  completed: 'Completada',
  pending: 'Pendiente',
  failed: 'Fallida'
} as const;

export const TRANSACTION_STATUS_COLORS = {
  completed: 'text-green-400',
  pending: 'text-yellow-400',
  failed: 'text-red-400'
} as const;

// ============================================
// TIPOS DE TRANSACCIONES
// ============================================

export const TRANSACTION_TYPES = {
  buy: 'Compra',
  sell: 'Venta',
  deposit: 'Depósito',
  withdrawal: 'Retiro'
} as const;

export const TRANSACTION_TYPE_COLORS = {
  buy: 'text-green-400',
  sell: 'text-red-400',
  deposit: 'text-cyan-400',
  withdrawal: 'text-purple-400'
} as const;

// ============================================
// ROLES DE USUARIO
// ============================================

export const USER_ROLES = {
  user: 'Usuario',
  admin: 'Administrador'
} as const;

// ============================================
// LÍMITES Y RESTRICCIONES
// ============================================

export const LIMITS = {
  MIN_DEPOSIT: 10,
  MAX_DEPOSIT: 100000,
  MIN_WITHDRAWAL: 10,
  MAX_WITHDRAWAL: 100000,
  MIN_TRADE_QUANTITY: 1,
  MAX_TRADE_QUANTITY: 10000,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50
} as const;

// ============================================
// COMISIONES
// ============================================

export const FEES = {
  BASIC_COMMISSION: 0.02, // 2%
  PRO_COMMISSION: 0.01, // 1%
  WITHDRAWAL_FEE: 0.005, // 0.5%
  DEPOSIT_FEE: 0 // Sin comisión
} as const;

// ============================================
// MENSAJES DE ERROR
// ============================================

export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Saldo insuficiente',
  INVALID_QUANTITY: 'Cantidad inválida',
  STOCK_NOT_AVAILABLE: 'Acción no disponible',
  UNAUTHORIZED: 'No autorizado',
  SESSION_EXPIRED: 'Sesión expirada',
  NETWORK_ERROR: 'Error de conexión',
  UNKNOWN_ERROR: 'Error desconocido'
} as const;

// ============================================
// RUTAS
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MARKET: '/market',
  PORTFOLIO: '/portfolio',
  TRADE: '/trade',
  WALLET: '/wallet',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
  WATCHLIST: '/watchlist',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_STOCKS: '/admin/stocks',
  ADMIN_TRANSACTIONS: '/admin/transactions'
} as const;