import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Pendiente' | 'Procesando' | 'En tránsito' | 'Entregado';
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
}

const AdminOrderEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.rol !== 'admin') {
      navigate('/account');
      return;
    }

    // Mock data - en producción vendría de una API
    const mockOrders: Record<string, Order> = {
      'ORD-001': {
        id: 'ORD-001',
        customer: 'María García López',
        email: 'maria.garcia@email.com',
        date: '2025-01-15',
        items: [
          { name: 'Premium Cotton Hoodie', quantity: 2, price: 189.99 },
          { name: 'Slim Fit Chinos', quantity: 1, price: 99.99 }
        ],
        total: 479.97,
        status: 'Pendiente',
        shippingAddress: 'Av. Javier Prado 1234, San Isidro, Lima',
        trackingNumber: '',
        notes: ''
      },
      'ORD-002': {
        id: 'ORD-002',
        customer: 'Carlos Rodríguez Pérez',
        email: 'carlos.rodriguez@email.com',
        date: '2025-01-14',
        items: [
          { name: 'Classic Denim Jacket', quantity: 1, price: 149.99 }
        ],
        total: 149.99,
        status: 'Procesando',
        shippingAddress: 'Calle Mercaderes 456, Cercado, Arequipa',
        trackingNumber: 'TRACK123456',
        notes: 'Cliente solicitó envío urgente'
      },
      'ORD-003': {
        id: 'ORD-003',
        customer: 'Ana Martínez Silva',
        email: 'ana.martinez@email.com',
        date: '2025-01-13',
        items: [
          { name: 'Elegant Summer Dress', quantity: 1, price: 129.99 }
        ],
        total: 129.99,
        status: 'En tránsito',
        shippingAddress: 'Av. Sol 789, Wanchaq, Cusco',
        trackingNumber: 'TRACK789012',
        notes: ''
      },
      'ORD-004': {
        id: 'ORD-004',
        customer: 'Luis Fernández Torres',
        email: 'luis.fernandez@email.com',
        date: '2025-01-12',
        items: [
          { name: 'Silk Blouse', quantity: 2, price: 99.99 }
        ],
        total: 199.98,
        status: 'Entregado',
        shippingAddress: 'Jr. Pizarro 321, Centro Histórico, Trujillo',
        trackingNumber: 'TRACK345678',
        notes: 'Entregado exitosamente'
      },
      'ORD-005': {
        id: 'ORD-005',
        customer: 'Patricia Sánchez Ríos',
        email: 'patricia.sanchez@email.com',
        date: '2025-01-11',
        items: [
          { name: 'Premium Cotton Hoodie', quantity: 1, price: 89.99 },
          { name: 'Classic Denim Jacket', quantity: 1, price: 149.99 }
        ],
        total: 239.98,
        status: 'Entregado',
        shippingAddress: 'Av. La Marina 567, San Miguel, Lima',
        trackingNumber: 'TRACK901234',
        notes: ''
      }
    };

    if (id && mockOrders[id]) {
      setOrder(mockOrders[id]);
    }
    setIsLoading(false);
  }, [navigate, id]);

  const handleInputChange = (field: keyof Order, value: string) => {
    if (!order) return;
    setOrder({
      ...order,
      [field]: value
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
      navigate('/admin/orders');
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Clock className="w-5 h-5" />;
      case 'Procesando':
        return <Package className="w-5 h-5" />;
      case 'En tránsito':
        return <Truck className="w-5 h-5" />;
      case 'Entregado':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-orange-100 text-orange-800';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'En tránsito':
        return 'bg-blue-100 text-blue-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white flex items-center justify-center">
        <div className="text-versyo-primary text-xl">Cargando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-versyo-black mb-4">Pedido no encontrado</h1>
          <button onClick={() => navigate('/admin/orders')} className="btn-primary">
            Volver a Pedidos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const statuses: Array<'Pendiente' | 'Procesando' | 'En tránsito' | 'Entregado'> = ['Pendiente', 'Procesando', 'En tránsito', 'Entregado'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white">
      <Header />
      
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-2 text-versyo-dark hover:text-versyo-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Pedidos</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-versyo-black">
                  Editar Pedido {order.id}
                </h1>
                <p className="text-versyo-black/70 mt-2">
                  Actualiza el estado y detalles del pedido
                </p>
              </div>
              <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-versyo-mint">
              <h3 className="text-xl font-bold text-versyo-black mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Cliente
                  </label>
                  <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                    {order.customer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Email
                  </label>
                  <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                    {order.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Fecha de Pedido
                  </label>
                  <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                    {order.date}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Total
                  </label>
                  <p className="text-versyo-primary font-bold bg-versyo-cream px-4 py-3 rounded-lg">
                    S/ {Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-versyo-mint">
              <h3 className="text-xl font-bold text-versyo-black mb-4">Productos</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-versyo-mint/30 last:border-0">
                    <div>
                      <p className="font-medium text-versyo-black">{item.name}</p>
                      <p className="text-sm text-versyo-black/60">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-versyo-primary">S/ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-versyo-mint">
              <h3 className="text-xl font-bold text-versyo-black mb-4">Detalles del Pedido</h3>
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Estado del Pedido *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleInputChange('status', status)}
                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          order.status === status
                            ? 'bg-versyo-primary text-white border-versyo-primary shadow-md'
                            : 'bg-white text-versyo-black border-versyo-mint hover:border-versyo-primary'
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span className="text-sm">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Dirección de Envío
                  </label>
                  <input
                    type="text"
                    value={order.shippingAddress || ''}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                    className="input-modern w-full"
                    placeholder="Ingresa la dirección de envío"
                  />
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Número de Seguimiento
                  </label>
                  <input
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                    className="input-modern w-full"
                    placeholder="Ej: TRACK123456"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={order.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="input-modern w-full resize-none"
                    placeholder="Agrega notas sobre el pedido..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                onClick={() => navigate('/admin/orders')}
                className="px-6 py-3 border-2 border-versyo-mint text-versyo-dark rounded-lg hover:bg-versyo-light transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminOrderEdit;
