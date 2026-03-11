import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/context/AdminContext";
import { CartProvider } from "@/context/CartContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminDelivery from "@/pages/admin/AdminDelivery";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminContact from "@/pages/admin/AdminContact";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import MyOrders from "./pages/MyOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CartProvider>
          <SiteContentProvider>
          <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/register" element={<CustomerRegister />} />
              <Route path="/my-orders" element={<MyOrders />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="delivery" element={<AdminDelivery />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
          </SiteContentProvider>
        </CartProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
