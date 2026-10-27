import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import type { Producto } from '../types';

interface ProductCardProps {
  product: Producto;
  isAdmin?: boolean;
  onEdit?: (product: Producto) => void;
  onDelete?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [hoveredImageIndex, setHoveredImageIndex] = React.useState(0);
  const totalStock = product.variaciones?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const { addToCart } = useCart();
  
  const firstVariation = product.variaciones?.[0];
  const selectedSize = firstVariation?.talla || '';
  const selectedColor = firstVariation?.color || '';

  const handleAddToCart = () => {
    if (!firstVariation || isOutOfStock) {
      toast.error('Producto sin stock disponible');
      return;
    }

    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio_oferta || product.precio,
      imagen: product.imagenes[0] || 'https://via.placeholder.com/400',
      variacion: {
        id: firstVariation.id,
        color: selectedColor,
        talla: selectedSize,
        stock: firstVariation.stock
      }
    }, 1);
    toast.success('Producto agregado al carrito');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="product-card group relative"
    >
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center rounded-xl">
          <div className="bg-versyo-primary text-white px-6 py-3 rounded-lg transform -rotate-12 shadow-xl">
            <span className="font-bold text-lg">AGOTADO</span>
          </div>
        </div>
      )}

      {/* Stock Badge */}
      {totalStock < 5 && totalStock > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ¡Solo {totalStock} disponibles!
          </div>
        </div>
      )}

      {/* New Badge */}
      {product.nuevo && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-versyo-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            NUEVO
          </div>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={() => onEdit && onEdit(product)}
            className="bg-versyo-secondary text-white p-2 rounded-lg hover:bg-opacity-90 transition-all shadow-lg transform hover:scale-110"
            title="Editar producto"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(product.id)}
            className="bg-versyo-primary text-white p-2 rounded-lg hover:bg-versyo-hover transition-all shadow-lg transform hover:scale-110"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="block">
        <div 
          className="aspect-w-1 aspect-h-1 w-full overflow-hidden relative"
          onMouseEnter={() => setHoveredImageIndex(1)}
          onMouseLeave={() => setHoveredImageIndex(0)}
        >
          <img
            src={product.imagenes[hoveredImageIndex] || product.imagenes[0] || 'https://via.placeholder.com/400'}
            alt={product.nombre}
            className="w-full h-72 object-cover group-hover:scale-110 transition-all duration-500"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        {/* Product Name */}
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-xl font-bold text-versyo-dark group-hover:text-versyo-primary transition-colors duration-300 line-clamp-2">
            {product.nombre}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-extrabold text-versyo-primary">
            S/ {Number(product.precio_oferta || product.precio).toFixed(2)}
          </p>
          {product.precio_oferta && (
            <p className="text-sm text-neutral-400 line-through">
              S/ {Number(product.precio).toFixed(2)}
            </p>
          )}
        </div>

        {/* Color Variants */}
        {product.variaciones && product.variaciones.length > 0 && (() => {
          const uniqueColors = [...new Set(product.variaciones.map(v => v.color).filter(Boolean))];
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">
                {uniqueColors.length} {uniqueColors.length === 1 ? 'color' : 'colores'} disponible{uniqueColors.length === 1 ? '' : 's'}
              </span>
            </div>
          );
        })()}

        {/* Stock & Add to Cart */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${totalStock > 10 ? 'bg-green-500' : totalStock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-neutral-600 font-medium">
              {totalStock > 10 ? 'Disponible' : totalStock > 0 ? `Solo ${totalStock}` : 'Agotado'}
            </span>
          </div>
          
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold group-hover:shadow-hover"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
