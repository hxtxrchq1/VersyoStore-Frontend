import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Settings, LogOut, Edit, Save, X, Eye, Truck, CheckCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import type { Pedido } from '../types';

const Account: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    dni: '',
    direccion: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEditForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      telefono: user.telefono || '',
      dni: user.dni || '',
      direccion: user.direccion || ''
    });
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar el historial de pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing && user) {
      setEditForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        dni: user.dni || '',
        direccion: user.direccion || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Validar que el apellido tenga 2 palabras
      if (editForm.apellido && editForm.apellido.trim()) {
        const apellidos = editForm.apellido.trim().split(/\s+/);
        if (apellidos.length < 2) {
          toast.error('El apellido debe contener al menos 2 apellidos (ejemplo: García López)');
          return;
        }
      }

      setLoading(true);
      await userService.updateProfile(editForm);
      await refreshUser();
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendVerificationCode = async () => {
    try {
      setSendingCode(true);
      await authService.sendVerificationCode();
      toast.success('Código enviado a tu email. Revisa tu bandeja de entrada.');
      setShowVerificationModal(true);
    } catch (error: any) {
      console.error('Error al enviar código:', error);
      toast.error(error.response?.data?.message || 'Error al enviar código de verificación');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Por favor ingresa un código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyCode(verificationCode);
      toast.success('¡Cuenta verificada exitosamente!');
      await refreshUser();
      setShowVerificationModal(false);
      setVerificationCode('');
    } catch (error: any) {
      console.error('Error al verificar código:', error);
      toast.error(error.response?.data?.message || 'Código incorrecto o expirado');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'entregado':
        return 'bg-purple-100 text-purple-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'Pedidos', icon: <Package className="w-5 h-5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-versyo-black mb-2">
              Mi Cuenta
            </h1>
            <p className="text-versyo-black/70">
              Bienvenido, {user.nombre || user.email}!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-versyo-dark to-versyo-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-800">
                      {user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.email}
                    </h3>
                    <p className="text-sm text-zinc-600">{user.rol}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-versyo-dark'
                          : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-versyo-black">Información del Perfil</h2>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveProfile}
                              className="flex items-center space-x-2 bg-versyo-primary text-white px-4 py-2 rounded-lg hover:bg-versyo-hover transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              <span>Guardar</span>
                            </button>
                            <button
                              onClick={handleEditToggle}
                              className="flex items-center space-x-2 border-2 border-versyo-mint text-versyo-dark px-4 py-2 rounded-lg hover:bg-versyo-light transition-colors"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancelar</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleEditToggle}
                            className="flex items-center space-x-2 text-versyo-dark hover:text-versyo-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Nombre
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="nombre"
                            value={editForm.nombre}
                            onChange={handleInputChange}
                            className="input-modern w-full"
                            placeholder="Ingresa tu nombre"
                          />
                        ) : (
                          <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                            {user.nombre || 'No proporcionado'}
                          </p>
                        )}
                      </div>

                      {/* Apellido */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Apellido
                        </label>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              name="apellido"
                              value={editForm.apellido}
                              onChange={handleInputChange}
                              className="input-modern w-full"
                              placeholder="Ej: García López (2 apellidos)"
                            />
                            <p className="text-xs text-gray-500 mt-1">Ingresa tus 2 apellidos completos</p>
                          </>
                        ) : (
                          <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                            {user.apellido || 'No proporcionado'}
                          </p>
                        )}
                      </div>

                      {/* Email (no editable) */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Correo Electrónico
                        </label>
                        <p className="text-versyo-black bg-gray-100 px-4 py-3 rounded-lg">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="telefono"
                            value={editForm.telefono}
                            onChange={handleInputChange}
                            className="input-modern w-full"
                            placeholder="+51 999 999 999"
                          />
                        ) : (
                          <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                            {user.telefono || 'No proporcionado'}
                          </p>
                        )}
                      </div>

                      {/* DNI */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          DNI
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="dni"
                            value={editForm.dni}
                            onChange={handleInputChange}
                            className="input-modern w-full"
                            placeholder="12345678"
                            maxLength={8}
                          />
                        ) : (
                          <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                            {user.dni || 'No proporcionado'}
                          </p>
                        )}
                      </div>

                      {/* Dirección */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Dirección
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="direccion"
                            value={editForm.direccion}
                            onChange={handleInputChange}
                            className="input-modern w-full"
                            placeholder="Av. Example 123, Distrito, Ciudad"
                          />
                        ) : (
                          <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                            {user.direccion || 'No proporcionado'}
                          </p>
                        )}
                      </div>

                      {/* Verificación de Email */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Verificación de Email
                        </label>
                        {user.email_verificado ? (
                          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-3 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Email verificado ✓</span>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-yellow-800">
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">Email no verificado</span>
                              </div>
                              <button
                                onClick={handleSendVerificationCode}
                                disabled={sendingCode}
                                className="bg-versyo-primary text-white px-4 py-2 rounded-lg hover:bg-versyo-hover transition-colors disabled:opacity-50"
                              >
                                {sendingCode ? 'Enviando...' : 'Verificar Email'}
                              </button>
                            </div>
                            <p className="text-sm text-yellow-700 mt-2">
                              Verifica tu email para acceder a todas las funcionalidades
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Fecha de registro */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Cuenta creada desde
                        </label>
                        <p className="text-versyo-black bg-versyo-cream px-4 py-3 rounded-lg">
                          {new Date(user.createdAt || user.creado_en || Date.now()).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-versyo-black mb-6">Historial de Pedidos</h2>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : pedidos.length === 0 ? (
                      <div className="text-center py-12 border border-versyo-mint rounded-lg">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-versyo-black mb-2">No tienes pedidos</h3>
                        <p className="text-versyo-black/70 mb-6">Cuando realices una compra, aparecerá aquí</p>
                        <Link to="/" className="inline-block px-6 py-3 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors">
                          Explorar Productos
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {pedidos.map((pedido) => (
                          <div key={pedido.id} className="border border-versyo-mint rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                              <div>
                                <h3 className="font-semibold text-versyo-black">Pedido #{pedido.id}</h3>
                                <p className="text-sm text-versyo-black/70">Realizado el {formatDate(pedido.createdAt || new Date().toISOString())}</p>
                                {pedido.numero_seguimiento && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Truck className="w-4 h-4 text-versyo-primary" />
                                    <p className="text-sm font-mono text-versyo-primary">{pedido.numero_seguimiento}</p>
                                  </div>
                                )}
                              </div>
                              <div className="text-left md:text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(pedido.estado)}`}>
                                  {pedido.estado.toUpperCase()}
                                </span>
                                <p className="text-lg font-bold text-versyo-primary mt-2">
                                  S/ {Number(pedido.total).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              {pedido.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span className="text-versyo-black/70">
                                    {item.producto?.nombre || item.nombre_producto} × {item.cantidad}
                                    {item.talla && ` (${item.talla})`}
                                  </span>
                                  <span className="text-versyo-black font-medium">
                                    S/ {((item.precioUnitario || item.precio_unitario || 0) * item.cantidad).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {pedido.items.length > 3 && (
                                <p className="text-sm text-versyo-black/70 italic">
                                  +{pedido.items.length - 3} productos más
                                </p>
                              )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-versyo-mint">
                              <Link
                                to={`/order-confirmation`}
                                state={{ pedido }}
                                className="flex items-center gap-2 px-4 py-2 border border-versyo-primary text-versyo-primary rounded-lg hover:bg-versyo-primary hover:text-white transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalles
                              </Link>
                              {pedido.estado === 'pendiente' && (
                                <button
                                  onClick={async () => {
                                    try {
                                      await orderService.cancelOrder(pedido.id);
                                      toast.success('Pedido cancelado');
                                      fetchOrders();
                                    } catch (error) {
                                      toast.error('Error al cancelar el pedido');
                                    }
                                  }}
                                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                >
                                  Cancelar Pedido
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-versyo-black mb-6">Configuración de Cuenta</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-versyo-mint rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-versyo-black mb-4">
                          Preferencias de Correo
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-versyo-mint text-versyo-primary focus:ring-versyo-primary" defaultChecked />
                            <span className="ml-3 text-versyo-black/80">Actualizaciones de pedidos y notificaciones de envío</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-versyo-mint text-versyo-primary focus:ring-versyo-primary" defaultChecked />
                            <span className="ml-3 text-versyo-black/80">Anuncios de nuevos productos</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-versyo-mint text-versyo-primary focus:ring-versyo-primary" />
                            <span className="ml-3 text-versyo-black/80">Ofertas promocionales y descuentos</span>
                          </label>
                        </div>
                      </div>

                      <div className="border border-versyo-mint rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-versyo-black mb-4">
                          Configuración de Privacidad
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-versyo-mint text-versyo-primary focus:ring-versyo-primary" defaultChecked />
                            <span className="ml-3 text-versyo-black/80">Permitir recomendaciones personalizadas</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-versyo-mint text-versyo-primary focus:ring-versyo-primary" />
                            <span className="ml-3 text-versyo-black/80">Compartir datos para análisis</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal de Verificación de Email */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-versyo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-versyo-primary" />
              </div>
              <h2 className="text-2xl font-bold text-versyo-black mb-2">
                Verificar Email
              </h2>
              <p className="text-versyo-black/70">
                Ingresa el código de 6 dígitos que enviamos a tu correo
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-versyo-black mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                }}
                maxLength={6}
                className="input-modern w-full text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                El código expira en 15 minutos
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                }}
                className="flex-1 px-4 py-3 border-2 border-versyo-mint text-versyo-dark rounded-lg hover:bg-versyo-light transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 px-4 py-3 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleSendVerificationCode}
                disabled={sendingCode}
                className="text-sm text-versyo-primary hover:text-versyo-hover disabled:opacity-50"
              >
                {sendingCode ? 'Enviando...' : '¿No recibiste el código? Reenviar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Account;
