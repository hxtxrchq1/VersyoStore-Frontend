import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, MapPin, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Pedido } from '../types';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const pedido = location.state?.pedido as Pedido;

  if (!pedido) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no disponible';
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-block p-4 bg-versyo-primary/10 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-versyo-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-versyo-dark mb-4">
              ¡Pedido en Revisión!
            </h1>
            <p className="text-xl text-versyo-deep mb-3">
              Gracias por tu compra. Hemos recibido tu comprobante de pago.
            </p>
            <div className="bg-versyo-light/30 border-2 border-versyo-primary/30 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-versyo-dark mb-3">
                ⏱️ Tu pedido será confirmado en máximo 5 minutos
              </p>
              <p className="text-versyo-deep mb-4">
                Estamos verificando tu pago. Una vez confirmado, recibirás un correo de confirmación y comenzaremos a preparar tu pedido.
              </p>
              <div className="bg-white/50 border border-versyo-primary/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-versyo-dark mb-2">
                  <strong>📧 Mantente atento a tu correo electrónico</strong>
                </p>
                <ul className="text-sm text-versyo-deep space-y-1 list-disc list-inside">
                  <li>Recibirás una confirmación cuando validemos tu pago</li>
                  <li>Te notificaremos cuando tu pedido sea enviado con el código de seguimiento</li>
                  <li>También puedes revisar el estado en el <Link to="/account" className="text-versyo-primary font-semibold hover:underline">panel de tu cuenta</Link></li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-8 shadow-md border border-versyo-primary/20 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-versyo-primary/20">
              <div>
                <p className="text-sm text-vintage-light-gray mb-1">Número de Pedido</p>
                <p className="text-2xl font-display font-bold text-versyo-dark">#{pedido.id}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-vintage-light-gray mb-1">Fecha</p>
                <p className="text-lg font-semibold text-versyo-dark">
                  {formatDate(pedido.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-vintage-light-gray mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getEstadoBadgeColor(pedido.estado)}`}>
                  {pedido.estado.toUpperCase()}
                </span>
              </div>
              {pedido.numero_seguimiento && (
                <div>
                  <p className="text-sm text-vintage-light-gray mb-1">Número de Seguimiento</p>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-versyo-primary" />
                    <p className="text-lg font-mono font-semibold text-versyo-dark">
                      {pedido.numero_seguimiento}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-versyo-dark" />
                  <h3 className="font-display font-semibold text-lg text-versyo-dark">
                    Artículos del Pedido
                  </h3>
                </div>
                <div className="space-y-3">
                  {pedido.items?.map((item, index) => (
                    <div key={`item-${item.id}-${index}`} className="flex gap-4 p-3 bg-versyo-light/20 rounded-lg">
                      <img
                        src={item.producto?.imagenes?.[0] || '/placeholder-product.png'}
                        alt={item.producto?.nombre || item.nombre_producto}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'; }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-versyo-dark">{item.producto?.nombre || item.nombre_producto}</p>
                        <p className="text-sm text-vintage-light-gray">
                          Cantidad: {item.cantidad}
                          {item.color && ` • Color: ${item.color}`}
                          {item.talla && ` • Talla: ${item.talla}`}
                        </p>
                        <p className="text-lg font-bold text-versyo-dark mt-1">
                          S/ {((item.precioUnitario || item.precio_unitario || 0) * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-versyo-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-versyo-dark" />
                  <h3 className="font-display font-semibold text-lg text-versyo-dark">
                    Dirección de Envío
                  </h3>
                </div>
                <div className="p-4 bg-versyo-light/20 rounded-lg">
                  <p className="font-semibold text-versyo-dark">{pedido.usuario?.nombre || pedido.nombre_completo} {pedido.usuario?.apellido || ''}</p>
                  <p className="text-versyo-deep mt-1">{pedido.direccionEnvio || pedido.direccion}</p>
                  <p className="text-versyo-deep">{pedido.telefono}</p>
                </div>
              </div>

              {pedido.metodoPago && (
                <div className="pt-6 border-t border-versyo-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-versyo-dark" />
                    <h3 className="font-display font-semibold text-lg text-versyo-dark">
                      Método de Pago
                    </h3>
                  </div>
                  <div className="p-4 bg-versyo-light/20 rounded-lg">
                    <p className="text-versyo-dark capitalize">{pedido.metodoPago}</p>
                  </div>
                </div>
              )}

              {pedido.notas && (
                <div className="pt-6 border-t border-versyo-primary/20">
                  <h3 className="font-display font-semibold text-lg text-versyo-dark mb-2">
                    Notas del Pedido
                  </h3>
                  <p className="text-versyo-deep italic">{pedido.notas}</p>
                </div>
              )}

              <div className="pt-6 border-t border-versyo-primary/20">
                {(() => {
                  const ciudadNormalizada = pedido.ciudad?.toLowerCase().trim();
                  const costoEnvio = ciudadNormalizada === 'trujillo' ? 7 : 20;
                  const subtotal = pedido.items?.reduce((sum, item) => sum + (Number(item.precio_unitario || item.precioUnitario || 0) * item.cantidad), 0) || 0;
                  return (
                    <>
                      <div className="flex justify-between text-lg mb-2">
                        <span className="text-versyo-deep">Subtotal</span>
                        <span className="text-versyo-dark">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg mb-4">
                        <span className="text-versyo-deep">Envío {pedido.ciudad && `(${pedido.ciudad.toUpperCase()})`}</span>
                        <span className={costoEnvio === 7 ? 'text-versyo-primary font-semibold' : 'text-versyo-dark'}>
                          S/ {costoEnvio.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-2xl font-display font-bold text-versyo-dark pt-4 border-t border-versyo-primary/20">
                        <span>Total</span>
                        <span>S/ {Number(pedido.total).toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-2 border-versyo-primary/30 rounded-lg p-6 mb-8"
          >
            <div className="flex gap-3">
              <Mail className="w-6 h-6 text-versyo-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display font-semibold text-lg text-versyo-dark mb-2">
                  Resumen de tu Compra
                </h3>
                <p className="text-versyo-deep">
                  Hemos enviado una copia de este comprobante de pedido a <strong>{pedido.usuario?.email || pedido.email}</strong>.
                </p>
                <p className="text-versyo-deep mt-2">
                  Puedes revisar el estado de tu pedido en cualquier momento desde tu <Link to="/account" className="text-versyo-primary font-semibold hover:underline">cuenta</Link>.
                </p>
                <p className="text-sm text-versyo-deep/70 mt-3 italic">
                  * Si realizaste el pago correctamente, tu pedido será confirmado automáticamente en los próximos 5 minutos.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Link
              to="/"
              className="px-12 py-4 bg-versyo-primary text-white rounded-lg font-display font-bold text-lg hover:bg-versyo-dark transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Volver al Inicio
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
