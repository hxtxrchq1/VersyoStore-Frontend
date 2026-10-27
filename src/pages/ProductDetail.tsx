import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productService } from '../services/product.service';
import type { Producto } from '../types';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Producto | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(slug);
        console.log('📦 Producto cargado:', data);
        console.log('🎨 Variaciones:', data.variaciones);
        setProduct(data);
        if (data.variaciones && data.variaciones.length > 0) {
          const firstVariation = data.variaciones[0];
          if (firstVariation.color) setSelectedColor(firstVariation.color);
          if (firstVariation.talla) setSelectedSize(firstVariation.talla);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        toast.error('No se pudo cargar el producto');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-gray-200 h-96 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return null; // Already redirected
  }

  const handleAddToCart = () => {
    if (!product) return;

    const selectedVariation = product.variaciones?.find(
      v => v.color === selectedColor && v.talla === selectedSize
    );

    if (!selectedVariation || selectedVariation.stock < quantity) {
      toast.error('Variación no disponible o sin stock suficiente');
      return;
    }

    // Usar la imagen de la variación si está disponible, si no, usar la primera imagen del producto
    const imagenVariacion = selectedVariation.imagen_url || product.imagenes[0] || 'https://via.placeholder.com/400';

    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio_oferta || product.precio,
      imagen: imagenVariacion,
      variacion: {
        id: selectedVariation.id,
        color: selectedColor,
        talla: selectedSize,
        stock: selectedVariation.stock
      }
    }, quantity);

    toast.success(`${product.nombre} añadido al carrito`);
  };

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableSizes = [...new Set(product.variaciones?.map(v => v.talla).filter(Boolean))]
    .sort((a, b) => {
      const indexA = sizeOrder.indexOf(a || '');
      const indexB = sizeOrder.indexOf(b || '');
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  const availableColors = [...new Set(product.variaciones?.map(v => v.color).filter(Boolean))];
  const maxStock = product.variaciones?.find(
    v => v.color === selectedColor && v.talla === selectedSize
  )?.stock || 0;

  // Imágenes principales del producto
  const mainImages = product.imagenes && product.imagenes.length > 0 ? product.imagenes : ['https://via.placeholder.com/800'];
  
  // Imágenes de las variaciones del color seleccionado (eliminar duplicados)
  const colorVariationImages = selectedColor 
    ? [...new Set(
        product.variaciones
          ?.filter(v => v.color === selectedColor && v.imagen_url)
          .map(v => v.imagen_url)
          .filter(url => url) as string[]
      )]
    : [];
  
  console.log('🖼️ Imágenes principales:', mainImages);
  console.log('🎨 Color seleccionado:', selectedColor);
  console.log('📸 Imágenes del color:', colorVariationImages);
  
  // Si hay un color seleccionado y tiene imágenes de variación, mostrar SOLO esas
  // Si no, mostrar las imágenes principales
  const images = selectedColor && colorVariationImages.length > 0
    ? colorVariationImages
    : mainImages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white">
      <Header />
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-versyo-dark hover:text-versyo-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-card border border-versyo-mint">
                <img
                  src={images[selectedImage]}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-versyo-primary shadow-md'
                          : 'border-versyo-mint hover:border-versyo-primary/50'
                      }`}
                    >
                      <img src={img} alt={`${product.nombre} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category */}
              <span className="inline-block px-4 py-1 bg-versyo-mint/30 text-versyo-dark rounded-full text-sm font-medium">
                {product.categoria?.nombre || 'Sin categoría'}
              </span>

              {/* Title */}
              <h1 className="text-4xl font-bold text-versyo-black">
                {product.nombre}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold text-versyo-primary">
                  S/ {Number(product.precio_oferta || product.precio).toFixed(2)}
                </div>
                {product.precio_oferta && (
                  <div className="text-2xl font-semibold text-gray-400 line-through">
                    S/ {Number(product.precio).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-versyo-black/80 leading-relaxed">
                {product.descripcion || 'Sin descripción disponible'}
              </p>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-versyo-black mb-3">
                    Color: <span className="font-normal text-versyo-primary">{selectedColor || 'Selecciona un color'}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {availableColors.map((color, index) => {
                      const colorCode = product.variaciones?.find(v => v.color === color)?.codigo_color || '#000000';
                      console.log(`🎨 Color: ${color}, Código: ${colorCode}`);
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            console.log('🖱️ Color seleccionado:', color);
                            setSelectedColor(color || '');
                            setSelectedImage(0);
                          }}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? 'border-versyo-primary shadow-md scale-110'
                              : 'border-gray-300 hover:border-versyo-primary'
                          }`}
                          style={{ backgroundColor: colorCode }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-versyo-black mb-3">
                    Talla: <span className="font-normal text-versyo-primary">{selectedSize || 'Selecciona una talla'}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size || '')}
                        className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-versyo-primary text-white border-versyo-primary shadow-md'
                            : 'bg-white text-versyo-black border-versyo-mint hover:border-versyo-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-versyo-black mb-3">
                  Cantidad {maxStock > 0 && <span className="text-sm font-normal text-gray-500">(Stock: {maxStock})</span>}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-versyo-light rounded-lg hover:bg-versyo-mint transition-colors flex items-center justify-center font-bold text-versyo-black"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-versyo-black min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={quantity >= maxStock}
                    className="w-10 h-10 bg-versyo-light rounded-lg hover:bg-versyo-mint transition-colors flex items-center justify-center font-bold text-versyo-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <span className="text-sm text-versyo-black/60">
                    ({product.stock_total || 0} disponibles)
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock_total || product.stock_total === 0}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{!product.stock_total || product.stock_total === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                </button>
              </div>

              {/* Features */}
              <div className="bg-versyo-light rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-versyo-primary" />
                  <div>
                    <p className="font-semibold text-versyo-black">Envío Gratis</p>
                    <p className="text-sm text-versyo-black/70">En pedidos mayores a S/ 150</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-versyo-primary" />
                  <div>
                    <p className="font-semibold text-versyo-black">Garantía de Calidad</p>
                    <p className="text-sm text-versyo-black/70">30 días de devolución</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Information Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-white rounded-2xl shadow-card p-8 border border-versyo-mint"
          >
            <div className="space-y-8">
              {/* Descripción del producto */}
              {product.descripcion && (
                <div>
                  <h3 className="text-2xl font-bold text-versyo-black mb-4">Descripción</h3>
                  <p className="text-versyo-black/80 whitespace-pre-line">{product.descripcion}</p>
                </div>
              )}

              {/* Información de categoría */}
              {product.categoria && (
                <div>
                  <h3 className="text-2xl font-bold text-versyo-black mb-4">Categoría</h3>
                  <p className="text-versyo-black/80">{product.categoria.nombre}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
