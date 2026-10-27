import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productService } from '../services/product.service';
import type { Producto } from '../types';

const Home: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productService.getHomeData();
        setProductos(data.destacados || []);
      } catch (error: any) {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: <Truck className="w-10 h-10 text-black" />,
      title: 'Envío Gratis',
      description: 'Envío gratis en pedidos mayores a S/ 150'
    },
    {
      icon: <Shield className="w-10 h-10 text-black" />,
      title: 'Pago Seguro',
      description: 'Procesamiento de pagos 100% seguro'
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-black" />,
      title: 'Devoluciones Fáciles',
      description: 'Política de devolución de maximo 15 días'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-versyo-cream via-white to-versyo-light">
        <div className="absolute inset-0 bg-gradient-to-br from-versyo-mint/10 via-transparent to-versyo-primary/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <span className="inline-block px-4 py-2 bg-versyo-primary/10 text-versyo-primary text-sm font-semibold rounded-full mb-6">
                Nueva Colección 2024
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-versyo-black mb-6 leading-tight">
                Moda que
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-versyo-primary to-versyo-dark">Define tu Estilo</span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-xl leading-relaxed">
                Descubre prendas premium diseñadas para destacar. Calidad excepcional, 
                estilo único y comodidad incomparable en cada pieza.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/mens" className="btn-primary px-8 py-4 text-lg font-bold inline-flex items-center justify-center group">
                  Comprar Hombres 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/womens" className="btn-outline px-8 py-4 text-lg font-bold inline-flex items-center justify-center group">
                  Comprar Mujeres 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <img
                  src="rosebloom.png"
                  alt="Fashion 1"
                  className="rounded-2xl shadow-card hover:shadow-hover transition-shadow duration-300 w-full h-64 object-cover"
                />
                <img
                  src="mockup1.png"
                  alt="Fashion 2"
                  className="rounded-2xl shadow-card hover:shadow-hover transition-shadow duration-300 w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="white.png"
                  alt="Fashion 3"
                  className="rounded-2xl shadow-card hover:shadow-hover transition-shadow duration-300 w-full h-48 object-cover"
                />
                <img
                  src="Black Lado1.JPG"
                  alt="Fashion 4"
                  className="rounded-2xl shadow-card hover:shadow-hover transition-shadow duration-300 w-full h-64 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-versyo-primary/10 text-versyo-primary text-sm font-bold rounded-full mb-4">
              LO MÁS POPULAR
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-versyo-black mb-5">
              Productos Destacados
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Descubre nuestra selección curada de prendas premium que están marcando tendencia esta temporada.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-t-xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.length > 0 ? productos.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="product-card group relative"
              >
                <Link to={`/product/${product.slug}`} className="block relative overflow-hidden rounded-t-xl">
                  <img
                    src={product.imagenes[0] || 'https://via.placeholder.com/400x600'}
                    alt={product.nombre}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-versyo-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {product.nuevo && (
                    <span className="absolute top-3 right-3 bg-versyo-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                      Nuevo
                    </span>
                  )}
                </Link>
                
                <div className="p-5 space-y-3">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="text-lg font-bold text-versyo-dark group-hover:text-versyo-primary transition-colors line-clamp-2">
                      {product.nombre}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    {product.precio_oferta ? (
                      <div className="flex flex-col">
                        <p className="text-2xl font-extrabold text-versyo-primary">
                          S/ {Number(product.precio_oferta).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          S/ {Number(product.precio).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-extrabold text-versyo-primary">
                        S/ {Number(product.precio).toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full py-3 font-semibold">
                    Ver Producto
                  </button>
                </div>
              </motion.div>
              )) : (
                <div className="col-span-4 text-center py-12">
                  <p className="text-gray-500">No hay productos disponibles.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/mens" className="btn-primary px-10 py-4 text-lg font-bold inline-flex items-center group">
              Ver Todos los Productos 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block px-4 py-2 bg-versyo-secondary/10 text-versyo-secondary text-sm font-bold rounded-full mb-6">
                SOBRE NOSOTROS
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-versyo-dark mb-6 leading-tight">
                Creando Moda con <span className="text-gradient">Propósito</span>
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Versyo nace de la pasión por crear prendas excepcionales que fusionan diseño contemporáneo 
                con . Nuestro compromiso con la calidad y la sostenibilidad se refleja en 
                cada detalle, desde la selección de materiales hasta la última puntada.
              </p>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                Creemos que la moda debe ser una expresión auténtica de tu personalidad, combinando estilo, 
                comodidad y responsabilidad ambiental en cada pieza que creamos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about" className="btn-primary px-8 py-3.5 font-bold inline-flex items-center justify-center group">
                  Nuestra Historia
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-outline px-8 py-3.5 font-bold inline-flex items-center justify-center group">
                  Contáctanos
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative">
                <img
                  src="prueba4.jpg"
                  alt="Versyo Brand Story"
                  className="rounded-2xl shadow-elegant w-full h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-versyo-primary/20 via-transparent to-versyo-secondary/20 rounded-2xl"></div>
                
                {/* Floating stat cards */}
               
                
                
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-versyo-primary/10 text-versyo-primary text-sm font-bold rounded-full mb-4">
              BENEFICIOS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-versyo-dark mb-5">
              ¿Por Qué Elegir Versyo?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Compromiso absoluto con tu satisfacción y experiencia de compra excepcional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group text-center p-8 bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 border border-neutral-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-versyo-dark mb-3 group-hover:text-versyo-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     <Footer />
    </div>
  );
};

export default Home;

