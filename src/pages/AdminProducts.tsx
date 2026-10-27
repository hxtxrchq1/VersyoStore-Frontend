import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productService } from '../services/product.service';
import type { Producto } from '../types';

const AdminProducts: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const limite = 20;

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(
        pagina,
        limite,
        categoria || undefined,
        busqueda || undefined
      );
      setProductos(data.data || data.productos || []);
      setTotal(data.total);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagina(1);
    fetchProductos();
  };

  const handleCategoryChange = (value: string) => {
    setCategoria(value);
    setPagina(1);
    fetchProductos();
  };

  const handlePageChange = (newPage: number) => {
    setPagina(newPage);
    setTimeout(() => fetchProductos(), 0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Producto eliminado');
      fetchProductos();
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    try {
      await productService.updateEstado(id, !activo);
      toast.success(`Producto ${!activo ? 'activado' : 'desactivado'}`);
      fetchProductos();
    } catch (error: any) {
      console.error('Error al actualizar estado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el estado');
    }
  };

  const handleToggleDestacado = async (id: number, recomendado: boolean) => {
    try {
      await productService.updateDestacado(id, !recomendado);
      toast.success(`Producto ${!recomendado ? 'marcado como recomendado' : 'desmarcado como recomendado'}`);
      fetchProductos();
    } catch (error: any) {
      console.error('Error al actualizar recomendado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar producto recomendado');
    }
  };

  const totalPages = Math.ceil(total / limite);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600 mt-1">Administra el catálogo de productos</p>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-versyo-primary text-white px-6 py-3 rounded-lg hover:bg-versyo-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar productos
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nombre, SKU, descripción..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destacado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto) => {
                      const totalStock = producto.variaciones?.reduce((sum, v) => sum + v.stock, 0) || 0;
                      return (
                        <tr key={producto.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={producto.imagenes[0] || 'https://via.placeholder.com/60'}
                                alt={producto.nombre}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                                <div className="text-sm text-gray-500">{producto.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {producto.categoria?.nombre || 'Sin categoría'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              S/ {Number(producto.precio).toFixed(2)}
                            </div>
                            {producto.precio_oferta && (
                              <div className="text-sm text-green-600">
                                Oferta: S/ {Number(producto.precio_oferta).toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              totalStock === 0 ? 'text-red-600' : totalStock < 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {totalStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleToggleActivo(producto.id, producto.activo)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-versyo-primary focus:ring-offset-2 ${
                                producto.activo ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              title={producto.activo ? 'Desactivar producto' : 'Activar producto'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  producto.activo ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleToggleDestacado(producto.id, producto.recomendado)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-versyo-primary focus:ring-offset-2 ${
                                producto.recomendado ? 'bg-yellow-500' : 'bg-gray-300'
                              }`}
                              title={producto.recomendado ? 'Desmarcar como recomendado' : 'Marcar como recomendado'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  producto.recomendado ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/admin/products/${producto.id}/edit`}
                              className="text-versyo-primary hover:text-versyo-hover mr-4"
                            >
                              <Edit className="w-5 h-5 inline" />
                            </Link>
                            <button
                              onClick={() => handleDelete(producto.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagina - 1))}
                      disabled={pagina === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, pagina + 1))}
                      disabled={pagina === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{(pagina - 1) * limite + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(pagina * limite, total)}</span> de{' '}
                        <span className="font-medium">{total}</span> productos
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, pagina - 1))}
                          disabled={pagina === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Anterior
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagina === i + 1
                                ? 'z-10 bg-versyo-primary border-versyo-primary text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, pagina + 1))}
                          disabled={pagina === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Siguiente
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProducts;