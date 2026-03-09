import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import EventsListPage from "./pages/admin/EventsListPage";
import OrdersListPage from "./pages/admin/OrdersListPage";
import VenuesListPage from "./pages/admin/VenuesListPage";
import CitiesListPage from "./pages/admin/CitiesListPage";
import ArticlesListPage from "./pages/admin/ArticlesListPage";
import CollectionsListPage from "./pages/admin/CollectionsListPage";
import SuppliersListPage from "./pages/admin/SuppliersListPage";
import TagsListPage from "./pages/admin/TagsListPage";
import ReviewsListPage from "./pages/admin/ReviewsListPage";
import ReconciliationPage from "./pages/admin/ReconciliationPage";
import SeoAuditPage from "./pages/admin/SeoAuditPage";
import SettingsPage from "./pages/admin/SettingsPage";
import SupportListPage from "./pages/admin/SupportListPage";
import ModerationPage from "./pages/admin/ModerationPage";
import { PromoBlocksPage, UsersPage } from "./pages/admin/CrudPages";

// Supplier
import SupplierLayout from "./layouts/SupplierLayout";
import SupplierLoginPage, { SupplierRegisterPage } from "./pages/supplier/LoginPage";
import SupplierDashboardPage from "./pages/supplier/DashboardPage";
import SupplierEventsListPage from "./pages/supplier/EventsListPage";
import SupplierReportsPage from "./pages/supplier/ReportsPage";
import SupplierSettingsPage from "./pages/supplier/SettingsPage";
import SupplierNotificationsPage from "./pages/supplier/NotificationsPage";

// Public
import HomePage from "./pages/public/HomePage";
import CatalogPage from "./pages/public/CatalogPage";
import EventPage from "./pages/public/EventPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<CatalogPage />} />
          <Route path="/events/:slug" element={<EventPage />} />

          {/* Supplier Auth */}
          <Route path="/supplier/login" element={<SupplierLoginPage />} />
          <Route path="/supplier/register" element={<SupplierRegisterPage />} />

          {/* Supplier Portal */}
          <Route path="/supplier" element={<SupplierLayout />}>
            <Route index element={<SupplierDashboardPage />} />
            <Route path="events" element={<SupplierEventsListPage />} />
            <Route path="events/:id" element={<SupplierEventsListPage />} />
            <Route path="reports" element={<SupplierReportsPage />} />
            <Route path="settings" element={<SupplierSettingsPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsListPage />} />
            <Route path="moderation" element={<ModerationPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="venues" element={<VenuesListPage />} />
            <Route path="cities" element={<CitiesListPage />} />
            <Route path="suppliers" element={<SuppliersListPage />} />
            <Route path="tags" element={<TagsListPage />} />
            <Route path="articles" element={<ArticlesListPage />} />
            <Route path="collections" element={<CollectionsListPage />} />
            <Route path="promo" element={<PromoBlocksPage />} />
            <Route path="reviews" element={<ReviewsListPage />} />
            <Route path="reconciliation" element={<ReconciliationPage />} />
            <Route path="support" element={<SupportListPage />} />
            <Route path="seo" element={<SeoAuditPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
