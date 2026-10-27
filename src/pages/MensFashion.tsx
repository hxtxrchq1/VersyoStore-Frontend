import React, { useState, useEffect } from 'react';
import { Grid, List, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import type { Producto } from '../types';

const MensFashion: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const api = (await import('../services/api')).default;
        
        // Cargar categorías, temporadas y productos en paralelo
        const [categoriesRes, seasonsRes, productsRes] = await Promise.all([
          api.get('/categorias'),
          api.get('/temporadas'),
          api.get('/publico/productos?genero=hombre&limite=100')
        ]);
        
        setCategories(categoriesRes.data);
        setSeasons(seasonsRes.data);
        setProducts(productsRes.data.productos || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const filteredProducts = products
    .filter(p => {
      if (filterCategory !== 'all' && p.categoria?.id?.toString() !== filterCategory) return false;
      if (filterSeason !== 'all' && p.temporada?.id?.toString() !== filterSeason) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.precio_oferta || a.precio) - (b.precio_oferta || b.precio);
        case 'price-high':
          return (b.precio_oferta || b.precio) - (a.precio_oferta || a.precio);
        case 'name':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-banner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-versyo-secondary/30 via-versyo-dark/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-versyo-primary/10 text-versyo-primary text-sm font-bold rounded-full mb-6 uppercase tracking-wider">
              Moda Masculina
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-versyo-dark mb-6 leading-tight">
              Colección <span className="text-gradient">Hombres</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Piezas atemporales para el caballero moderno. Descubre la artesanía de calidad que define tu estilo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="sticky top-16 z-10 py-6 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg">
                <Filter className="w-4 h-4 text-versyo-primary" />
                <span className="text-sm font-semibold text-versyo-dark">Filtros</span>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-modern flex-1 md:flex-none"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <select
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
                className="input-modern flex-1 md:flex-none"
              >
                <option value="all">Todas las Temporadas</option>
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.nombre}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern flex-1 md:flex-none"
              >
                <option value="name">Por Nombre</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600 mr-2">Vista:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-versyo-primary text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-versyo-primary text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-medium">
                Mostrando <span className="text-versyo-primary font-bold">{filteredProducts.length}</span> productos
              </p>
            </div>
            {(filterCategory !== 'all' || filterSeason !== 'all') && (
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setFilterSeason('all');
                }}
                className="text-sm text-versyo-primary hover:text-versyo-hover font-semibold underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-xl"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-6">
                <Filter className="w-10 h-10 text-neutral-400" />
              </div>
              <p className="text-neutral-600 text-xl font-semibold mb-2">
                No se encontraron productos
              </p>
              <p className="text-neutral-500 mb-6">
                Intenta ajustar tus filtros o explora otras categorías
              </p>
              <button
                onClick={() => setFilterCategory('all')}
                className="btn-primary px-8 py-3"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MensFashion;

