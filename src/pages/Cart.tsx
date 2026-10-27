import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-display font-bold text-versyo-dark mb-4">
              Carrito de Compras
            </h1>
            <p className="text-vintage-light-gray">
              {items.length === 0 ? 'Tu carrito está vacío' : `${items.length} ${items.length === 1 ? 'artículo' : 'artículos'} en tu carrito`}
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag className="w-24 h-24 mx-auto text-vintage-light-gray mb-6" />
              <h2 className="text-2xl font-display font-semibold text-versyo-dark mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-vintage-light-gray mb-8">
                Explora nuestra colección y encuentra tus piezas favoritas
              </p>
              <Link
                to="/"
                className="inline-block bg-versyo-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-versyo-primary transition-colors"
              >
                Continuar Comprando
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-display font-semibold text-lg text-versyo-dark">
                              {item.nombre}
                            </h3>
                            {item.variacion?.talla && (
                              <p className="text-sm text-vintage-light-gray">
                                Talla: {item.variacion.talla}
                              </p>
                            )}
                            {item.variacion?.color && (
                              <p className="text-sm text-vintage-light-gray">
                                Color: {item.variacion.color}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-vintage-light-gray hover:text-versyo-dark transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                              className="p-1 rounded-md border border-versyo-primary/30 hover:bg-white transition-colors"
                            >
                              <Minus className="w-4 h-4 text-versyo-dark" />
                            </button>
                            <span className="text-versyo-dark font-semibold w-8 text-center">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                              className="p-1 rounded-md border border-versyo-primary/30 hover:bg-white transition-colors"
                            >
                              <Plus className="w-4 h-4 text-versyo-dark" />
                            </button>
                          </div>
                          
                          <p className="text-xl font-display font-bold text-versyo-dark">
                            S/ {(item.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20 sticky top-24">
                  <h2 className="text-2xl font-display font-bold text-versyo-dark mb-6">
                    Resumen del Pedido
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-versyo-deep">
                      <span>Subtotal</span>
                      <span>S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-versyo-deep">
                      <span>Envío</span>
                      {getTotalPrice() >= 150 ? (
                        <span className="text-green-600 font-semibold">¡GRATIS!</span>
                      ) : (
                        <span className="text-versyo-primary font-semibold">Pendiente</span>
                      )}
                    </div>
                    {getTotalPrice() < 150 && (
                      <div className="text-xs text-versyo-deep/70 text-right">
                        ¡Compra S/ {(150 - getTotalPrice()).toFixed(2)} más y obtén envío gratis!
                      </div>
                    )}
                    <div className="border-t border-versyo-primary/20 pt-3 flex justify-between text-lg font-bold text-versyo-dark">
                      <span>Total</span>
                      <span className="font-display">S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-versyo-dark text-white py-3 rounded-lg font-semibold hover:bg-versyo-primary transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    Proceder al Pago
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <Link
                    to="/"
                    className="block text-center text-versyo-dark hover:text-versyo-primary transition-colors"
                  >
                    Continuar Comprando
                  </Link>

                  <div className="mt-6 pt-6 border-t border-versyo-primary/20 space-y-3 text-sm text-vintage-light-gray">
                    <div className="flex items-start gap-2">
                      <span className="text-versyo-primary">✓</span>
                      <span>Envío gratis en compras mayores a S/ 150</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-versyo-primary">✓</span>
                      <span>Devoluciones gratis en 30 días</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-versyo-primary">✓</span>
                      <span>Pago 100% seguro</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
