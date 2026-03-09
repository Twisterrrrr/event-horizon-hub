// ===== Core domain types for DAIBILET =====

export type EventStatus = 'active' | 'paused' | 'draft' | 'archived';
export type SaleState = 'on_sale' | 'paused' | 'no_dates' | 'partner_only' | 'sold_out';
export type OrderStatus = 'pending' | 'paid' | 'canceled' | 'refunded';
export type ArticleStatus = 'draft' | 'published' | 'unpublished';
export type ReviewStatus = 'new' | 'approved' | 'hidden' | 'spam';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SyncStatus = 'ok' | 'error' | 'no_schedule';
export type ReconciliationStatus = 'new' | 'in_progress' | 'resolved';
export type DiscrepancyType = 'missing_in_report' | 'wrong_amount' | 'duplicate' | 'extra_in_report';
export type UserRole = 'content_editor' | 'operator' | 'marketing' | 'admin';
export type VenueType = 'museum' | 'boat' | 'restaurant' | 'theater' | 'open_air' | 'other';

export interface City {
  id: string;
  name: string;
  slug: string;
  image?: string;
  shortDescription?: string;
  eventsCount: number;
  venuesCount: number;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  eventsCount: number;
}

export interface Venue {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  type: VenueType;
  address?: string;
  lat?: number;
  lng?: number;
  activeEventsCount: number;
  rating?: number;
  priceFrom?: number;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cities: string[];
  activeEventsCount: number;
  integration: 'tc' | 'teplohod' | 'manual';
  syncStatus: SyncStatus;
  lastSyncAt?: string;
  contactEmail?: string;
  contactPhone?: string;
  commission?: number;
}

export interface EventSession {
  id: string;
  date: string;
  time: string;
  availableSeats?: number;
  totalSeats?: number;
  price: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image?: string;
  categoryId: string;
  categoryName: string;
  cityId: string;
  cityName: string;
  venueId?: string;
  venueName?: string;
  status: EventStatus;
  saleState: SaleState;
  priceFrom?: number;
  priceTo?: number;
  sessions: EventSession[];
  isMultiCity?: boolean;
  cities?: string[];
  citiesCount?: number;
  datesCount?: number;
  rating?: number;
  reviewsCount?: number;
  supplierId?: string;
  supplierName?: string;
  hasImage: boolean;
  hasSchedule: boolean;
  conversionRate?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  number: string;
  eventId: string;
  eventTitle: string;
  sessionDate: string;
  sessionTime: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  source: 'website' | 'partner' | 'teplohod';
  createdAt: string;
  paidAt?: string;
  canceledAt?: string;
  ticketSentAt?: string;
  quantity: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  cityId?: string;
  cityName?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  eventsCount: number;
  usedOnPages: string[];
  filterCities?: string[];
  filterCategories?: string[];
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category: 'theme' | 'audience' | 'format';
  eventsCount: number;
  usedInPromo: boolean;
}

export interface Review {
  id: string;
  eventId: string;
  eventTitle: string;
  authorName: string;
  rating: number;
  text: string;
  hasPhoto: boolean;
  hasComplaint: boolean;
  status: ReviewStatus;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderId?: string;
  eventId?: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messagesCount: number;
}

export interface ReconciliationItem {
  id: string;
  orderId: string;
  orderNumber: string;
  discrepancyType: DiscrepancyType;
  expectedAmount: number;
  actualAmount?: number;
  status: ReconciliationStatus;
  provider: string;
  comment?: string;
  createdAt: string;
}

export interface SeoIssue {
  id: string;
  entityType: 'event' | 'venue' | 'article' | 'collection' | 'city';
  entityId: string;
  entityTitle: string;
  issueType: 'no_title' | 'duplicate_description' | 'short_text' | 'no_meta' | 'missing_image';
  severity: 'critical' | 'warning' | 'info';
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  activeEvents: number;
  eventsWithoutPhoto: number;
  eventsWithoutSchedule: number;
  eventsLowConversion: number;
  pendingReviews: number;
  openTickets: number;
  unresolvedReconciliations: number;
  promoCTR: number;
  popularCategories: { name: string; count: number }[];
}
