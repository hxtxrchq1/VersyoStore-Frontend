import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, Sparkles, Star, Gift } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';
import { membershipService } from '../services/membership.service';
import { useAuth } from '../context/AuthContext';
import type { Producto } from '../types';

const Drops: React.FC = () => {
  const navigate = useNavigate();
  const [isLaunched, setIsLaunched] = useState(false); // Cambiado a false para mostrar countdown y formulario VIP
  const { isAuthenticated, user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Verificar si el usuario tiene membresía VIP
  const isVIP = user?.tiene_membresia || false;

  useEffect(() => {
    fetchDropProducts();
  }, []);

  const fetchDropProducts = async () => {
    try {
      setLoading(true);
      // Obtener productos de la primera temporada (ID: 1) o productos nuevos como drops
      // Si tienes temporadas específicas para drops, usa getProductsBySeason(1)
      const data = await productService.getNewProducts(9); // Obtener 9 productos nuevos como drops
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar drops:', error);
      toast.error('Error al cargar los productos exclusivos');
    } finally {
      setLoading(false);
    }
  };

  // Set launch date to 7 days from now for demo purposes
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 7);

  const handleCountdownComplete = () => {
    setIsLaunched(true);
  };

  const handleRequestMembership = async () => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/drops' } });
      return;
    }

    // Si ya tiene membresía, informar
    if (isVIP) {
      toast.info('Ya tienes una membresía VIP activa');
      return;
    }

    try {
      setIsRequesting(true);
      // Enviar solicitud con el email del usuario autenticado
      const response = await membershipService.requestMembership();
      setIsSubscribed(true);
      toast.success(response.message || '¡Solicitud enviada! Revisa tu email para instrucciones de pago.');
    } catch (error: any) {
      console.error('Error al solicitar membresía:', error);
      toast.error(error.response?.data?.message || 'Error al procesar tu solicitud');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <Header />
      
      {!isLaunched ? (
        /* PRE-LANZAMIENTO: Contador y VIP Integrados */
        <div className="min-h-screen relative overflow-hidden bg-versyo-black">
          {/* Background unificado */}
          <div className="absolute inset-0 bg-gradient-to-br from-versyo-black via-versyo-dark to-versyo-primary"></div>
          
          {/* Contenido Bloqueado (blur extremo de fondo) */}
            <div className="absolute inset-0 filter blur-3xl opacity-10">
              <div className="grid grid-cols-3 gap-4 p-8">
                {products.map((_, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg"></div>
                ))}
              </div>
            </div>
          
          {/* Sección Única: Contador + VIP */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-5xl w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {/* Badge DROP 1 */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-versyo-primary to-versyo-accent px-6 py-3 rounded-full mb-8 shadow-2xl"
                >
                  <Crown className="w-5 h-5 text-white" />
                  <span className="text-white font-bold tracking-wider">COLECCIÓN EXCLUSIVA</span>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider text-white drop-shadow-2xl">
                  DROPS
                </h1>
                
                <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto font-light">
                  Colección Exclusiva • Edición Limitada
                </p>

                {/* Contador */}
                <div className="mb-10">
                  <CountdownTimer 
                    targetDate={launchDate} 
                    onComplete={handleCountdownComplete}
                  />
                </div>

                {/* Divisor sutil */}
                <div className="flex items-center justify-center mb-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-versyo-primary to-transparent w-full max-w-md"></div>
                </div>

                {/* Card VIP Integrado */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-versyo-dark/80 to-versyo-black/80 backdrop-blur-xl border-2 border-versyo-primary/50 rounded-3xl p-8 md:p-10 shadow-2xl mx-auto max-w-4xl"
                >
                  {/* Badge VIP */}
                 

                  <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
                    Únete a la Comunidad VIP
                  </h2>
                  
                  <p className="text-base md:text-lg text-white/80 text-center mb-8 max-w-2xl mx-auto">
                    Sé parte de la élite Versyo y obtén acceso exclusivo a todos nuestros drops
                  </p>

                  {/* Beneficios VIP - Compactos */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className="w-10 h-10 bg-versyo-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-versyo-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Acceso Prioritario</h3>
                        <p className="text-white/60 text-xs">Compra antes que nadie</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className="w-10 h-10 bg-versyo-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-versyo-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Descuentos VIP</h3>
                        <p className="text-white/60 text-xs">Precios especiales</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className="w-10 h-10 bg-versyo-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-versyo-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Piezas Limitadas</h3>
                        <p className="text-white/60 text-xs">Colecciones exclusivas</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Solicitud de Membresía */}
                  {!isSubscribed && !isVIP ? (
                    <div className="max-w-2xl mx-auto text-center">
                      <button
                        onClick={handleRequestMembership}
                        disabled={isRequesting}
                        className="px-12 py-4 bg-gradient-to-r from-versyo-primary to-versyo-accent text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-versyo-primary/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                      >
                        <Crown className="w-6 h-6" />
                        <span>{isRequesting ? 'Procesando...' : 'Solicitar Membresía'}</span>
                      </button>
                      <p className="text-white/50 text-xs mt-4">
                        {isAuthenticated 
                          ? 'Se enviará un email con las instrucciones de pago' 
                          : 'Inicia sesión para solicitar tu membresía VIP'}
                      </p>
                    </div>
                  ) : isVIP ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center space-x-3 bg-green-500/20 border-2 border-green-500 px-6 py-3 rounded-xl">
                        <Crown className="w-5 h-5 text-green-400" />
                        <span className="text-white font-bold text-sm">¡Ya tienes Membresía VIP Activa!</span>
                      </div>
                      <p className="text-white/60 text-sm mt-3">
                        Disfruta de acceso exclusivo a todos los drops
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center space-x-3 bg-green-500/20 border-2 border-green-500 px-6 py-3 rounded-xl">
                        <Crown className="w-5 h-5 text-green-400" />
                        <span className="text-white font-bold text-sm">¡Solicitud Enviada!</span>
                      </div>
                      <p className="text-white/60 text-sm mt-3">
                        Revisa tu email para instrucciones de pago
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        /* POST-LANZAMIENTO: Productos Visibles (solo para VIP) */
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-versyo-dark via-versyo-primary to-versyo-accent text-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-wider">
                  DROPS
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
                  Colección Exclusiva • Edición Limitada
                </p>
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-8 py-4 border border-white/30">
                  <span className="text-lg font-semibold tracking-wide">{products.length > 0 ? `${products.length} piezas exclusivas disponibles` : 'Cargando...'}</span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Products Section - Solo para VIP */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {/* Si no es VIP, mostrar overlay de bloqueo */}
                {!isVIP ? (
                  <div className="relative">
                    {/* Productos con blur extremo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 filter blur-2xl pointer-events-none opacity-20">
                      {loading ? (
                        <div className="col-span-3 flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary"></div>
                        </div>
                      ) : (
                        products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Overlay de bloqueo VIP */}
                    <div className="absolute inset-0 flex items-center justify-center py-12">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-versyo-black to-versyo-dark rounded-3xl p-12 shadow-2xl border-2 border-versyo-primary max-w-md text-center"
                      >
                        <div className="w-20 h-20 bg-versyo-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-versyo-primary">
                          <Lock className="w-10 h-10 text-versyo-primary" />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-white mb-4">
                          Solo Miembros VIP
                        </h3>
                        
                        <p className="text-white/80 mb-6 leading-relaxed">
                          Esta colección exclusiva está disponible únicamente para miembros VIP de Versyo
                        </p>

                        <div className="flex items-center justify-center space-x-2 text-versyo-primary mb-8">
                          <Crown className="w-5 h-5" />
                          <span className="font-semibold">Membresía Requerida</span>
                          <Crown className="w-5 h-5" />
                        </div>

                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="px-8 py-4 bg-gradient-to-r from-versyo-primary to-versyo-accent text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-versyo-primary/50 transition-all transform hover:scale-105"
                        >
                          Unirse a VIP
                        </button>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* Productos desbloqueados para VIP */
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-12"
                    >
                      {/* Badge VIP Activo */}
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-full mb-6 shadow-xl">
                        <Crown className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">Acceso VIP Activo</span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-display font-bold text-versyo-dark mb-4">
                        Colección Drops
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Solo 105 piezas en todo el mundo. Una vez agotadas, desaparecen para siempre.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {loading ? (
                        <div className="col-span-3 flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary"></div>
                        </div>
                      ) : products.length === 0 ? (
                        <div className="col-span-3 text-center py-12">
                          <p className="text-gray-600">No hay drops disponibles en este momento</p>
                        </div>
                      ) : (
                        products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mt-12"
                    >
                      <div className="bg-gradient-to-r from-versyo-dark to-versyo-primary text-white rounded-lg p-6 max-w-md mx-auto border border-versyo-accent">
                        <h3 className="text-xl font-bold mb-2 font-display">🔥 Drops Disponible Ahora</h3>
                        <p>Cantidades limitadas - No te pierdas estas piezas exclusivas</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-versyo-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-versyo-dark to-versyo-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-versyo-dark mb-2">
                    Edición Limitada
                  </h3>
                  <p className="text-gray-600">
                    Solo 105 piezas en total. Cada pieza está numerada y autenticada.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-versyo-primary to-versyo-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-versyo-dark mb-2">
                    Materiales Premium
                  </h3>
                  <p className="text-gray-600">
                    Elaborado con los mejores materiales y atención en cada detalle.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-versyo-accent to-versyo-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-versyo-dark mb-2">
                    Diseño Exclusivo
                  </h3>
                  <p className="text-gray-600">
                    Diseños únicos que no se reproducirán. Posee una pieza de la historia Versyo.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
};

export default Drops;

