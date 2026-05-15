import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import Index from "./pages/Index";
import VendorPage from "./pages/VendorPage";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ChatList from "./pages/ChatList";
import ChatThread from "./pages/ChatThread";
import Notifications from "./pages/Notifications";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorOrderDetail from "./pages/vendor/VendorOrderDetail";
import VendorDishes from "./pages/vendor/VendorDishes";
import VendorDishForm from "./pages/vendor/VendorDishForm";
import VendorVerification from "./pages/vendor/VendorVerification";
import VendorProfile from "./pages/vendor/VendorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vendor/:id" element={<VendorPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/chat" element={<ChatList />} />
                <Route path="/chat/:id" element={<ChatThread />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/signup" element={<Auth mode="signup" />} />
                <Route path="/vendor-portal" element={<VendorDashboard />} />
                <Route path="/vendor-portal/orders" element={<VendorOrders />} />
                <Route path="/vendor-portal/orders/:id" element={<VendorOrderDetail />} />
                <Route path="/vendor-portal/dishes" element={<VendorDishes />} />
                <Route path="/vendor-portal/dishes/new" element={<VendorDishForm />} />
                <Route path="/vendor-portal/dishes/:id" element={<VendorDishForm />} />
                <Route path="/vendor-portal/verification" element={<VendorVerification />} />
                <Route path="/vendor-portal/profile" element={<VendorProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
