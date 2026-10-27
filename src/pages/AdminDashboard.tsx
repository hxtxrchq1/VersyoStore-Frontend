import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminService, type AdminStats } from '../services/admin.service';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.rol !== 'admin') {
      navigate('/account');
      return;
    }
    
    setUser(parsedUser);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary"></div>
      </div>
    );
  }

  const statsData = [
    { 
      label: 'Total Productos', 
      value: stats?.total_productos?.toString() || '0', 
      icon: Package, 
      color: 'bg-versyo-primary' 
    },
    { 
      label: 'Pedidos Pendientes', 
      value: stats?.pedidos_pendientes?.toString() || '0', 
      icon: ShoppingBag, 
      color: 'bg-versyo-mint' 
    },
    { 
      label: 'Total Clientes', 
      value: stats?.total_usuarios?.toString() || '0', 
      icon: Users, 
      color: 'bg-versyo-dark' 
    },
    { 
      label: 'Ventas Totales', 
      value: `S/${stats?.total_ventas?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}`, 
      icon: TrendingUp, 
      color: 'bg-versyo-primary' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-versyo-cream to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-versyo-black mb-2">
                Panel de Administración
              </h1>
              <p className="text-lg text-neutral-600">
                Bienvenido, <span className="font-semibold text-versyo-primary">{user.username || user.email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-versyo-dark text-white rounded-lg hover:bg-versyo-deep transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-card p-6 border border-neutral-100 hover:shadow-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-versyo-black mb-1">{stat.value}</h3>
              <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Gestionar Catálogo */}
          <button
            onClick={() => navigate('/admin/products')}
            className="group relative bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-versyo-primary"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-versyo-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-versyo-primary to-versyo-dark rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-versyo-black mb-2 group-hover:text-versyo-primary transition-colors">
                Gestionar Catálogo
              </h2>
              <p className="text-sm text-neutral-600 mb-3">
                Administra productos, inventario y precios
              </p>
              <div className="flex items-center justify-center gap-2 text-versyo-primary font-semibold group-hover:gap-4 transition-all">
                <span>Acceder</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>

          {/* Gestionar Pedidos */}
          <button
            onClick={() => navigate('/admin/orders')}
            className="group relative bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-versyo-mint"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-versyo-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-versyo-mint to-versyo-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-versyo-black mb-2 group-hover:text-versyo-primary transition-colors">
                Gestionar Pedidos
              </h2>
              <p className="text-sm text-neutral-600 mb-3">
                Administra órdenes y estados de envío
              </p>
              <div className="flex items-center justify-center gap-2 text-versyo-primary font-semibold group-hover:gap-4 transition-all">
                <span>Acceder</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>

          {/* Gestionar Clientes */}
          <button
            onClick={() => navigate('/admin/customers')}
            className="group relative bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-versyo-dark"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-versyo-dark/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-versyo-dark to-versyo-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-versyo-black mb-2 group-hover:text-versyo-primary transition-colors">
                Gestionar Clientes
              </h2>
              <p className="text-sm text-neutral-600 mb-3">
                Administra la base de datos de clientes
              </p>
              <div className="flex items-center justify-center gap-2 text-versyo-primary font-semibold group-hover:gap-4 transition-all">
                <span>Acceder</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-xl shadow-card p-8 border border-neutral-100"
        >
          <h3 className="text-2xl font-bold text-versyo-black mb-6">Accesos Rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-3 px-6 py-4 bg-versyo-cream hover:bg-versyo-light rounded-lg transition-colors text-left group"
            >
              <Package className="w-5 h-5 text-versyo-primary" />
              <span className="font-medium text-versyo-black group-hover:text-versyo-primary transition-colors">
                Agregar Producto
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-3 px-6 py-4 bg-versyo-cream hover:bg-versyo-light rounded-lg transition-colors text-left group"
            >
              <ShoppingBag className="w-5 h-5 text-versyo-primary" />
              <span className="font-medium text-versyo-black group-hover:text-versyo-primary transition-colors">
                Ver Pedidos Pendientes
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/customers')}
              className="flex items-center gap-3 px-6 py-4 bg-versyo-cream hover:bg-versyo-light rounded-lg transition-colors text-left group"
            >
              <Users className="w-5 h-5 text-versyo-primary" />
              <span className="font-medium text-versyo-black group-hover:text-versyo-primary transition-colors">
                Gestionar Clientes
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
