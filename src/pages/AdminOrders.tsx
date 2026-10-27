import React, { useState, useEffect } from 'react';
import { Eye, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderDetailsPanel from '../components/OrderDetailsPanel';
import { orderService } from '../services/order.service';
import type { Pedido } from '../types';

const AdminOrders: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const limite = 20;

  useEffect(() => {
    fetchPedidos();
  }, [pagina, estadoFiltro]);

  const handleViewDetail = async (pedidoId: number) => {
    try {
      setLoadingDetail(true);
      const pedidoCompleto = await orderService.getOrderByIdAdmin(pedidoId);
      setSelectedPedido(pedidoCompleto);
    } catch (error) {
      console.error('Error al cargar detalle del pedido:', error);
      toast.error('Error al cargar el detalle del pedido');
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(estadoFiltro || undefined, pagina, limite);
      const pedidosData = data.data || data.pedidos || [];
      setPedidos(pedidosData);
      setTotal(data.total);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar los pedidos');
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

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no disponible';
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(total / limite);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">Administra todos los pedidos de la tienda</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar pedidos
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="ID, email, tracking..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                />
                <button
                  onClick={() => setPagina(1)}
                  className="px-6 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={estadoFiltro}
                onChange={(e) => {
                  setEstadoFiltro(e.target.value);
                  setPagina(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de pedidos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No se encontraron pedidos</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID / Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{pedido.id}</div>
                          <div className="text-sm text-gray-500">{pedido.usuario?.email || pedido.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate((pedido as any).creado_en)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          S/ {Number(pedido.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetail(pedido.id)}
                            disabled={loadingDetail}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Eye className="w-4 h-4" />
                            {loadingDetail ? 'Cargando...' : 'Ver Detalle'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación (igual que AdminProducts) */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{(pagina - 1) * limite + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(pagina * limite, total)}</span> de{' '}
                        <span className="font-medium">{total}</span> pedidos
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPagina(Math.max(1, pagina - 1))}
                          disabled={pagina === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Anterior
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPagina(i + 1)}
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
                          onClick={() => setPagina(Math.min(totalPages, pagina + 1))}
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

      {/* Panel de detalles del pedido */}
      {selectedPedido && (
        <OrderDetailsPanel
          pedido={selectedPedido}
          isOpen={!!selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onUpdate={() => {
            fetchPedidos();
            setSelectedPedido(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;