import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './src/context/CartContext.tsx';
import { AuthProvider } from './src/context/AuthContext.tsx';
import { ProtectedRoute } from './src/components/ProtectedRoute.tsx';
import { AdminRoute } from './src/components/AdminRoute.tsx';

import Home from './src/pages/Home.tsx';
import NotFound from './src/pages/NotFound.tsx';
import Login from './src/pages/Login.tsx';
import Register from './src/pages/Register.tsx';
import Account from './src/pages/Account.tsx';
import MensFashion from './src/pages/MensFashion.tsx';
import WomensFashion from './src/pages/WomensFashion.tsx';
import Drops from './src/pages/Drops.tsx';
import Contact from './src/pages/Contact.tsx';
import Shipping from './src/pages/Shipping.tsx';
import Cart from './src/pages/Cart.tsx';
import Checkout from './src/pages/Checkout.tsx';
import OrderConfirmation from './src/pages/OrderConfirmation.tsx';
import About from './src/pages/About.tsx';
import Terms from './src/pages/Terms.tsx';
import Privacy from './src/pages/Privacy.tsx';
import AdminDashboard from './src/pages/AdminDashboard.tsx';
import AdminProducts from './src/pages/AdminProducts.tsx';
import AdminOrders from './src/pages/AdminOrders.tsx';
import AdminOrderEdit from './src/pages/AdminOrderEdit.tsx';
import AdminCustomers from './src/pages/AdminCustomers.tsx';
import AdminProductForm from './src/pages/AdminProductForm.tsx';
import ProductDetail from './src/pages/ProductDetail.tsx';
import DebugAuth from './src/pages/DebugAuth.tsx';
import AdminTest from './src/pages/AdminTest.tsx';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <AuthProvider>
        <CartProvider>
          <Router>
            <main className="min-h-screen font-sans">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/mens" element={<MensFashion />} />
                <Route path="/womens" element={<WomensFashion />} />
                <Route path="/drops" element={<Drops />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/debug-auth" element={<DebugAuth />} />
                <Route path="/admin-test" element={<AdminTest />} />
                
                {/* Rutas protegidas (requieren autenticación) */}
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                
                {/* Rutas de administración (requieren rol admin) */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/orders/edit/:id" element={<AdminRoute><AdminOrderEdit /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </main>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Theme>
  );
}

export default App;