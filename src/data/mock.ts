import type {
  Event, Order, City, Venue, Supplier, Article, Collection, Tag,
  Review, SupportTicket, ReconciliationItem, SeoIssue, DashboardStats, Category, EventSession
} from '@/types';

const sessions = (count: number, basePrice: number): EventSession[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `s${i}`,
    date: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
    time: `${10 + (i % 4) * 3}:00`,
    availableSeats: Math.floor(Math.random() * 50) + 1,
    totalSeats: 60,
    price: basePrice + i * 100,
  }));

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Экскурсии', slug: 'excursions', eventsCount: 24 },
  { id: 'cat2', name: 'Теплоходы', slug: 'boats', eventsCount: 18 },
  { id: 'cat3', name: 'Музеи', slug: 'museums', eventsCount: 15 },
  { id: 'cat4', name: 'Театры', slug: 'theaters', eventsCount: 9 },
  { id: 'cat5', name: 'Мастер-классы', slug: 'workshops', eventsCount: 7 },
];

export const mockCities: City[] = [
  { id: 'c1', name: 'Санкт-Петербург', slug: 'spb', eventsCount: 42, venuesCount: 18, isFeatured: true, shortDescription: 'Культурная столица России', image: '' },
  { id: 'c2', name: 'Москва', slug: 'msk', eventsCount: 35, venuesCount: 22, isFeatured: true, shortDescription: 'Столица России', image: '' },
  { id: 'c3', name: 'Казань', slug: 'kazan', eventsCount: 12, venuesCount: 6, isFeatured: true, shortDescription: 'Третья столица', image: '' },
  { id: 'c4', name: 'Нижний Новгород', slug: 'nn', eventsCount: 8, venuesCount: 4, isFeatured: false, shortDescription: 'Город на Волге', image: '' },
  { id: 'c5', name: 'Сочи', slug: 'sochi', eventsCount: 6, venuesCount: 3, isFeatured: false, shortDescription: 'Курортный город', image: '' },
];

export const mockEvents: Event[] = [
  {
    id: 'e1', title: 'Ночная прогулка по рекам и каналам', slug: 'night-boat-tour', description: 'Незабываемая ночная прогулка по Неве и каналам Петербурга. Вы увидите развод мостов с воды.', shortDescription: 'Ночная прогулка с разводом мостов',
    image: '', categoryId: 'cat2', categoryName: 'Теплоходы', cityId: 'c1', cityName: 'Санкт-Петербург', venueId: 'v1', venueName: 'Причал Дворцовая',
    status: 'active', saleState: 'on_sale', priceFrom: 800, priceTo: 2500, sessions: sessions(5, 800),
    isMultiCity: false, rating: 4.8, reviewsCount: 124, supplierId: 'sup1', supplierName: 'НеваТрип',
    hasImage: true, hasSchedule: true, conversionRate: 12.5, tags: ['ночной', 'романтика'], createdAt: '2026-01-15', updatedAt: '2026-03-01',
  },
  {
    id: 'e2', title: 'Эрмитаж: входной билет без очереди', slug: 'hermitage-skip-line', description: 'Электронный билет в Эрмитаж. Проход без очереди через отдельный вход.',
    image: '', categoryId: 'cat3', categoryName: 'Музеи', cityId: 'c1', cityName: 'Санкт-Петербург', venueId: 'v2', venueName: 'Эрмитаж',
    status: 'active', saleState: 'on_sale', priceFrom: 500, priceTo: 500, sessions: sessions(7, 500),
    rating: 4.9, reviewsCount: 312, hasImage: true, hasSchedule: true, conversionRate: 18.2, tags: ['музей', 'культура'], createdAt: '2026-01-10', updatedAt: '2026-03-05',
  },
  {
    id: 'e3', title: 'Обзорная экскурсия по Москве', slug: 'moscow-city-tour', description: 'Классическая обзорная экскурсия по главным достопримечательностям столицы.',
    image: '', categoryId: 'cat1', categoryName: 'Экскурсии', cityId: 'c2', cityName: 'Москва',
    status: 'active', saleState: 'on_sale', priceFrom: 1200, priceTo: 3500, sessions: sessions(4, 1200),
    isMultiCity: true, cities: ['Москва', 'Санкт-Петербург', 'Казань'], citiesCount: 3, datesCount: 12,
    rating: 4.6, reviewsCount: 87, hasImage: true, hasSchedule: true, conversionRate: 9.8, tags: ['обзорная'], createdAt: '2026-02-01', updatedAt: '2026-03-07',
  },
  {
    id: 'e4', title: 'Мастер-класс по гончарному делу', slug: 'pottery-workshop', description: 'Создайте свою первую керамическую вещь под руководством мастера.',
    image: '', categoryId: 'cat5', categoryName: 'Мастер-классы', cityId: 'c2', cityName: 'Москва',
    status: 'active', saleState: 'on_sale', priceFrom: 2000, sessions: sessions(3, 2000),
    rating: 4.7, reviewsCount: 45, hasImage: false, hasSchedule: true, conversionRate: 15.1, tags: ['творчество'], createdAt: '2026-02-10', updatedAt: '2026-03-06',
  },
  {
    id: 'e5', title: 'Казанский Кремль: экскурсия', slug: 'kazan-kremlin', description: 'Экскурсия по территории Казанского Кремля.',
    categoryId: 'cat1', categoryName: 'Экскурсии', cityId: 'c3', cityName: 'Казань',
    status: 'paused', saleState: 'paused', priceFrom: 600, sessions: [],
    hasImage: true, hasSchedule: false, tags: ['история'], createdAt: '2026-01-20', updatedAt: '2026-03-02',
  },
  {
    id: 'e6', title: 'Театр «Современник»: Чайка', slug: 'sovremennik-chaika', description: 'Спектакль «Чайка» в постановке Виктора Рыжакова.',
    categoryId: 'cat4', categoryName: 'Театры', cityId: 'c2', cityName: 'Москва',
    status: 'active', saleState: 'partner_only', priceFrom: 3000, sessions: sessions(2, 3000),
    hasImage: true, hasSchedule: true, conversionRate: 5.2, createdAt: '2026-02-15', updatedAt: '2026-03-08',
  },
  {
    id: 'e7', title: 'Прогулка по крышам Петербурга', slug: 'rooftop-tour-spb', description: 'Увидьте город с высоты птичьего полёта.',
    categoryId: 'cat1', categoryName: 'Экскурсии', cityId: 'c1', cityName: 'Санкт-Петербург',
    status: 'active', saleState: 'on_sale', priceFrom: 1500, sessions: sessions(3, 1500),
    rating: 4.5, reviewsCount: 67, hasImage: true, hasSchedule: true, conversionRate: 11.0, tags: ['крыши', 'экстрим'], createdAt: '2026-01-25', updatedAt: '2026-03-04',
  },
  {
    id: 'e8', title: 'Дневной круиз по Неве', slug: 'day-cruise-neva', description: 'Дневная прогулка на теплоходе по Неве.',
    categoryId: 'cat2', categoryName: 'Теплоходы', cityId: 'c1', cityName: 'Санкт-Петербург',
    status: 'draft', saleState: 'no_dates', sessions: [],
    hasImage: false, hasSchedule: false, createdAt: '2026-03-01', updatedAt: '2026-03-01',
  },
];

export const mockOrders: Order[] = [
  { id: 'o1', number: 'DAI-2026-0001', eventId: 'e1', eventTitle: 'Ночная прогулка по рекам и каналам', sessionDate: '2026-03-10', sessionTime: '22:00', status: 'paid', totalAmount: 2400, customerName: 'Иван Петров', customerEmail: 'ivan@mail.ru', source: 'website', createdAt: '2026-03-08T10:00:00', paidAt: '2026-03-08T10:05:00', ticketSentAt: '2026-03-08T10:06:00', quantity: 3 },
  { id: 'o2', number: 'DAI-2026-0002', eventId: 'e2', eventTitle: 'Эрмитаж: входной билет без очереди', sessionDate: '2026-03-11', sessionTime: '10:00', status: 'paid', totalAmount: 1000, customerName: 'Мария Сидорова', customerEmail: 'maria@gmail.com', source: 'website', createdAt: '2026-03-08T12:00:00', paidAt: '2026-03-08T12:02:00', quantity: 2 },
  { id: 'o3', number: 'DAI-2026-0003', eventId: 'e3', eventTitle: 'Обзорная экскурсия по Москве', sessionDate: '2026-03-12', sessionTime: '09:00', status: 'pending', totalAmount: 3500, customerName: 'Алексей Козлов', customerEmail: 'alex@yandex.ru', source: 'partner', createdAt: '2026-03-09T08:00:00', quantity: 1 },
  { id: 'o4', number: 'DAI-2026-0004', eventId: 'e1', eventTitle: 'Ночная прогулка по рекам и каналам', sessionDate: '2026-03-10', sessionTime: '22:00', status: 'canceled', totalAmount: 1600, customerName: 'Ольга Новикова', customerEmail: 'olga@mail.ru', source: 'website', createdAt: '2026-03-07T15:00:00', canceledAt: '2026-03-08T09:00:00', quantity: 2 },
  { id: 'o5', number: 'DAI-2026-0005', eventId: 'e7', eventTitle: 'Прогулка по крышам Петербурга', sessionDate: '2026-03-13', sessionTime: '16:00', status: 'refunded', totalAmount: 3000, customerName: 'Дмитрий Волков', customerEmail: 'dima@gmail.com', source: 'teplohod', createdAt: '2026-03-06T11:00:00', quantity: 2 },
  { id: 'o6', number: 'DAI-2026-0006', eventId: 'e4', eventTitle: 'Мастер-класс по гончарному делу', sessionDate: '2026-03-14', sessionTime: '12:00', status: 'paid', totalAmount: 4000, customerName: 'Елена Кузнецова', customerEmail: 'elena@mail.ru', source: 'website', createdAt: '2026-03-09T07:00:00', paidAt: '2026-03-09T07:03:00', quantity: 2 },
];

export const mockVenues: Venue[] = [
  { id: 'v1', name: 'Причал Дворцовая', cityId: 'c1', cityName: 'Санкт-Петербург', type: 'boat', address: 'Дворцовая набережная, 18', activeEventsCount: 5, rating: 4.7, lat: 59.9409, lng: 30.3149 },
  { id: 'v2', name: 'Эрмитаж', cityId: 'c1', cityName: 'Санкт-Петербург', type: 'museum', address: 'Дворцовая площадь, 2', activeEventsCount: 3, rating: 4.9, lat: 59.9398, lng: 30.3146 },
  { id: 'v3', name: 'Третьяковская галерея', cityId: 'c2', cityName: 'Москва', type: 'museum', address: 'Лаврушинский пер., 10', activeEventsCount: 2, rating: 4.8, lat: 55.7415, lng: 37.6208 },
  { id: 'v4', name: 'Гранд Макет Россия', cityId: 'c1', cityName: 'Санкт-Петербург', type: 'museum', address: 'Цветочная ул., 16', activeEventsCount: 1, rating: 4.6 },
  { id: 'v5', name: 'Ресторан «Палкинъ»', cityId: 'c1', cityName: 'Санкт-Петербург', type: 'restaurant', address: 'Невский пр., 47', activeEventsCount: 0, rating: 4.3 },
];

export const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'НеваТрип', cities: ['Санкт-Петербург'], activeEventsCount: 8, integration: 'tc', syncStatus: 'ok', lastSyncAt: '2026-03-09T06:00:00', commission: 15 },
  { id: 'sup2', name: 'МосТур', cities: ['Москва', 'Казань'], activeEventsCount: 12, integration: 'teplohod', syncStatus: 'error', lastSyncAt: '2026-03-08T23:00:00', commission: 12 },
  { id: 'sup3', name: 'КультурА', cities: ['Санкт-Петербург', 'Москва'], activeEventsCount: 5, integration: 'manual', syncStatus: 'ok', commission: 10 },
];

export const mockArticles: Article[] = [
  { id: 'a1', title: 'Топ-10 мест Петербурга', slug: 'top-10-spb', status: 'published', cityId: 'c1', cityName: 'Санкт-Петербург', tags: ['гид', 'топ'], createdAt: '2026-02-01', updatedAt: '2026-03-01', publishedAt: '2026-02-15' },
  { id: 'a2', title: 'Куда пойти в Москве весной', slug: 'moscow-spring', status: 'draft', cityId: 'c2', cityName: 'Москва', tags: ['сезон'], createdAt: '2026-03-05', updatedAt: '2026-03-08' },
  { id: 'a3', title: 'Речные прогулки: гид', slug: 'river-cruises-guide', status: 'published', tags: ['теплоходы'], createdAt: '2026-01-20', updatedAt: '2026-02-28', publishedAt: '2026-01-25' },
];

export const mockCollections: Collection[] = [
  { id: 'col1', name: 'Лучшие прогулки на теплоходе', slug: 'best-boat-tours', isActive: true, eventsCount: 6, usedOnPages: ['/', '/spb'], filterCategories: ['Теплоходы'] },
  { id: 'col2', name: 'Топ музеев', slug: 'top-museums', isActive: true, eventsCount: 4, usedOnPages: ['/'], filterCategories: ['Музеи'] },
  { id: 'col3', name: 'Для детей', slug: 'for-kids', isActive: false, eventsCount: 0, usedOnPages: [] },
];

export const mockTags: Tag[] = [
  { id: 't1', name: 'Ночной', slug: 'night', category: 'theme', eventsCount: 3, usedInPromo: true },
  { id: 't2', name: 'Романтика', slug: 'romance', category: 'theme', eventsCount: 5, usedInPromo: true },
  { id: 't3', name: 'Для детей', slug: 'kids', category: 'audience', eventsCount: 8, usedInPromo: false },
  { id: 't4', name: 'Мастер-класс', slug: 'workshop', category: 'format', eventsCount: 7, usedInPromo: false },
  { id: 't5', name: 'История', slug: 'history', category: 'theme', eventsCount: 12, usedInPromo: true },
];

export const mockReviews: Review[] = [
  { id: 'r1', eventId: 'e1', eventTitle: 'Ночная прогулка по рекам и каналам', authorName: 'Иван П.', rating: 5, text: 'Потрясающая прогулка! Развод мостов с воды — незабываемо.', hasPhoto: true, hasComplaint: false, status: 'new', createdAt: '2026-03-08' },
  { id: 'r2', eventId: 'e2', eventTitle: 'Эрмитаж: входной билет без очереди', authorName: 'Мария С.', rating: 4, text: 'Удобно, но пришлось немного подождать.', hasPhoto: false, hasComplaint: false, status: 'approved', createdAt: '2026-03-07' },
  { id: 'r3', eventId: 'e3', eventTitle: 'Обзорная экскурсия по Москве', authorName: 'Спамер123', rating: 1, text: 'Купите наш товар...', hasPhoto: false, hasComplaint: true, status: 'new', createdAt: '2026-03-09' },
];

export const mockSupportTickets: SupportTicket[] = [
  { id: 'st1', subject: 'Не пришёл билет на email', status: 'open', priority: 'high', orderId: 'o1', eventId: 'e1', customerEmail: 'ivan@mail.ru', createdAt: '2026-03-08T14:00:00', updatedAt: '2026-03-08T14:00:00', messagesCount: 1 },
  { id: 'st2', subject: 'Хочу перенести на другую дату', status: 'in_progress', priority: 'medium', orderId: 'o2', customerEmail: 'maria@gmail.com', createdAt: '2026-03-07T10:00:00', updatedAt: '2026-03-08T16:00:00', assignedTo: 'Оператор Анна', messagesCount: 3 },
];

export const mockReconciliation: ReconciliationItem[] = [
  { id: 'rec1', orderId: 'o3', orderNumber: 'DAI-2026-0003', discrepancyType: 'missing_in_report', expectedAmount: 3500, status: 'new', provider: 'TC', createdAt: '2026-03-09' },
  { id: 'rec2', orderId: 'o5', orderNumber: 'DAI-2026-0005', discrepancyType: 'wrong_amount', expectedAmount: 3000, actualAmount: 2800, status: 'in_progress', provider: 'Teplohod', comment: 'Ждём ответ от провайдера', createdAt: '2026-03-08' },
];

export const mockSeoIssues: SeoIssue[] = [
  { id: 'seo1', entityType: 'event', entityId: 'e4', entityTitle: 'Мастер-класс по гончарному делу', issueType: 'missing_image', severity: 'critical' },
  { id: 'seo2', entityType: 'event', entityId: 'e8', entityTitle: 'Дневной круиз по Неве', issueType: 'no_title', severity: 'critical' },
  { id: 'seo3', entityType: 'event', entityId: 'e5', entityTitle: 'Казанский Кремль: экскурсия', issueType: 'short_text', severity: 'warning' },
  { id: 'seo4', entityType: 'venue', entityId: 'v5', entityTitle: 'Ресторан «Палкинъ»', issueType: 'no_meta', severity: 'info' },
];

export const mockDashboardStats: DashboardStats = {
  todayOrders: 14, todayRevenue: 42800,
  weekOrders: 89, weekRevenue: 267500,
  monthOrders: 342, monthRevenue: 1024000,
  activeEvents: 6, eventsWithoutPhoto: 2, eventsWithoutSchedule: 2, eventsLowConversion: 1,
  pendingReviews: 2, openTickets: 1, unresolvedReconciliations: 2,
  promoCTR: 3.2,
  popularCategories: [
    { name: 'Экскурсии', count: 24 },
    { name: 'Теплоходы', count: 18 },
    { name: 'Музеи', count: 15 },
  ],
};
