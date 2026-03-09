// Mock data specific to supplier portal

export interface SupplierProfile {
  id: string;
  name: string;
  operatorName: string;
  trustLevel: 'basic' | 'verified' | 'premium';
  commission: number;
  integration: 'tc' | 'teplohod' | 'manual';
  cities: string[];
  email: string;
  phone: string;
  webhookUrl?: string;
  apiKey?: string;
}

export interface SupplierEvent {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'pending' | 'paused' | 'draft' | 'rejected';
  cityName: string;
  categoryName: string;
  priceFrom: number;
  priceTo?: number;
  sessionsCount: number;
  totalSold: number;
  revenue: number;
  rating?: number;
  reviewsCount: number;
  hasImage: boolean;
  hasSchedule: boolean;
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSale {
  id: string;
  orderNumber: string;
  eventTitle: string;
  date: string;
  quantity: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'completed' | 'refunded' | 'pending';
}

export interface SupplierStats {
  activeEvents: number;
  pendingEvents: number;
  totalSoldToday: number;
  totalSoldWeek: number;
  totalSoldMonth: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  commissionToday: number;
  commissionWeek: number;
  commissionMonth: number;
  avgRating: number;
  totalReviews: number;
}

export const mockSupplierProfile: SupplierProfile = {
  id: 'sup1',
  name: 'НеваТрип',
  operatorName: 'Алексей Смирнов',
  trustLevel: 'verified',
  commission: 15,
  integration: 'tc',
  cities: ['Санкт-Петербург'],
  email: 'alex@nevatrip.ru',
  phone: '+7 (812) 555-00-00',
  webhookUrl: 'https://api.nevatrip.ru/webhook',
  apiKey: 'nt_live_xxxxxxxxxxxx',
};

export const mockSupplierEvents: SupplierEvent[] = [
  {
    id: 'se1', title: 'Ночная прогулка по рекам и каналам', slug: 'night-boat-tour',
    status: 'active', cityName: 'Санкт-Петербург', categoryName: 'Теплоходы',
    priceFrom: 800, priceTo: 2500, sessionsCount: 12, totalSold: 847, revenue: 1254000,
    rating: 4.8, reviewsCount: 124, hasImage: true, hasSchedule: true,
    createdAt: '2026-01-15', updatedAt: '2026-03-01',
  },
  {
    id: 'se2', title: 'Дневной круиз по Неве', slug: 'day-cruise-neva',
    status: 'pending', cityName: 'Санкт-Петербург', categoryName: 'Теплоходы',
    priceFrom: 600, sessionsCount: 0, totalSold: 0, revenue: 0,
    reviewsCount: 0, hasImage: false, hasSchedule: false,
    moderationNote: 'Добавьте фото и расписание для публикации',
    createdAt: '2026-03-01', updatedAt: '2026-03-01',
  },
  {
    id: 'se3', title: 'Прогулка по крышам Петербурга', slug: 'rooftop-tour-spb',
    status: 'active', cityName: 'Санкт-Петербург', categoryName: 'Экскурсии',
    priceFrom: 1500, sessionsCount: 8, totalSold: 234, revenue: 351000,
    rating: 4.5, reviewsCount: 67, hasImage: true, hasSchedule: true,
    createdAt: '2026-01-25', updatedAt: '2026-03-04',
  },
  {
    id: 'se4', title: 'Развод мостов: VIP-катер', slug: 'vip-bridges',
    status: 'draft', cityName: 'Санкт-Петербург', categoryName: 'Теплоходы',
    priceFrom: 5000, sessionsCount: 0, totalSold: 0, revenue: 0,
    reviewsCount: 0, hasImage: true, hasSchedule: false,
    createdAt: '2026-03-07', updatedAt: '2026-03-07',
  },
  {
    id: 'se5', title: 'Экскурсия «Мосты и дворцы»', slug: 'bridges-palaces',
    status: 'rejected', cityName: 'Санкт-Петербург', categoryName: 'Экскурсии',
    priceFrom: 900, sessionsCount: 0, totalSold: 0, revenue: 0,
    reviewsCount: 0, hasImage: true, hasSchedule: true,
    moderationNote: 'Описание не соответствует требованиям. Уберите рекламные ссылки.',
    createdAt: '2026-02-20', updatedAt: '2026-03-05',
  },
];

export const mockSupplierSales: SupplierSale[] = [
  { id: 'ss1', orderNumber: 'DAI-2026-0001', eventTitle: 'Ночная прогулка по рекам и каналам', date: '2026-03-09', quantity: 3, grossAmount: 2400, commission: 360, netAmount: 2040, status: 'completed' },
  { id: 'ss2', orderNumber: 'DAI-2026-0006', eventTitle: 'Ночная прогулка по рекам и каналам', date: '2026-03-09', quantity: 2, grossAmount: 1600, commission: 240, netAmount: 1360, status: 'completed' },
  { id: 'ss3', orderNumber: 'DAI-2026-0008', eventTitle: 'Прогулка по крышам Петербурга', date: '2026-03-08', quantity: 1, grossAmount: 1500, commission: 225, netAmount: 1275, status: 'completed' },
  { id: 'ss4', orderNumber: 'DAI-2026-0009', eventTitle: 'Ночная прогулка по рекам и каналам', date: '2026-03-08', quantity: 4, grossAmount: 3200, commission: 480, netAmount: 2720, status: 'completed' },
  { id: 'ss5', orderNumber: 'DAI-2026-0005', eventTitle: 'Прогулка по крышам Петербурга', date: '2026-03-07', quantity: 2, grossAmount: 3000, commission: 450, netAmount: 2550, status: 'refunded' },
  { id: 'ss6', orderNumber: 'DAI-2026-0010', eventTitle: 'Ночная прогулка по рекам и каналам', date: '2026-03-07', quantity: 1, grossAmount: 800, commission: 120, netAmount: 680, status: 'pending' },
];

export const mockSupplierStats: SupplierStats = {
  activeEvents: 2,
  pendingEvents: 1,
  totalSoldToday: 5,
  totalSoldWeek: 23,
  totalSoldMonth: 89,
  revenueToday: 4000,
  revenueWeek: 18700,
  revenueMonth: 72400,
  commissionToday: 600,
  commissionWeek: 2805,
  commissionMonth: 10860,
  avgRating: 4.65,
  totalReviews: 191,
};
