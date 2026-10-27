import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle, XCircle, Edit, Save, Eye } from 'lucide-react';
import type { Pedido } from '../types';
import { toast } from 'react-toastify';
import { orderService } from '../services/order.service';

interface OrderDetailsPanelProps {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ pedido, isOpen, onClose, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [estado, setEstado] = useState(pedido.estado);
  const [tracking, setTracking] = useState(pedido.codigo_tracking || '');
  const [agencia, setAgencia] = useState(pedido.agencia_envio || '');
  const [loading, setLoading] = useState(false);
  const [voucherExpanded, setVoucherExpanded] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);

      // Actualizar estado si cambió
      if (estado !== pedido.estado) {
        await orderService.updateOrderStatus(pedido.id, estado);
      }

      // Actualizar tracking si cambió
      if (tracking !== pedido.codigo_tracking || agencia !== pedido.agencia_envio) {
        if (tracking && agencia) {
          await orderService.updateOrderTracking(pedido.id, tracking, agencia);
        }
      }

      toast.success('Pedido actualizado correctamente');
      setEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error al actualizar pedido:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'enviado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'entregado':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Package className="w-5 h-5" />;
      case 'confirmado':
        return <CheckCircle className="w-5 h-5" />;
      case 'enviado':
        return <Truck className="w-5 h-5" />;
      case 'entregado':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelado':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="fixed right-0 top-0 h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header del panel */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pedido #{pedido.id}</h2>
            <p className="text-sm text-gray-500 mt-1">{formatDate(pedido.creado_en || pedido.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido del panel */}
        <div className="p-6 space-y-6">
          {/* Estado y acciones */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado del Pedido</h3>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
              {editing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEstado(pedido.estado);
                      setTracking(pedido.codigo_tracking || '');
                      setAgencia(pedido.agencia_envio || '');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {!editing ? (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${getEstadoColor(pedido.estado)}`}>
                {getEstadoIcon(pedido.estado)}
                <span className="font-semibold capitalize">{pedido.estado}</span>
              </div>
            ) : (
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            )}
          </div>

          {/* Información de envío */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Envío</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Código de Tracking</label>
                {!editing ? (
                  <p className="mt-1 text-gray-900">
                    {pedido.codigo_tracking || pedido.numero_seguimiento || 'Sin tracking'}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Ej: TR123456789PE"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Agencia de Envío</label>
                {!editing ? (
                  <p className="mt-1 text-gray-900">{pedido.agencia_envio || 'Sin agencia'}</p>
                ) : (
                  <input
                    type="text"
                    value={agencia}
                    onChange={(e) => setAgencia(e.target.value)}
                    placeholder="Ej: Olva Courier, Shalom, Cruz del Sur"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Nombre</p>
                <p className="mt-1 text-gray-900">{pedido.nombre_completo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="mt-1 text-gray-900">{pedido.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Teléfono</p>
                <p className="mt-1 text-gray-900">{pedido.telefono}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Ciudad</p>
                <p className="mt-1 text-gray-900">{pedido.ciudad}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-700">Dirección</p>
                <p className="mt-1 text-gray-900">{pedido.direccion || pedido.direccionEnvio}</p>
              </div>
              {pedido.notas && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-700">Notas</p>
                  <p className="mt-1 text-gray-900 italic">{pedido.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Voucher de pago */}
          {pedido.voucher_url && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Comprobante de Pago</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                  {pedido.metodo_pago || pedido.metodoPago || 'Pago realizado'}
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setVoucherExpanded(!voucherExpanded)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Eye className="w-5 h-5" />
                  {voucherExpanded ? 'Ocultar' : 'Ver'} comprobante
                </button>
                {voucherExpanded && (
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={pedido.voucher_url}
                      alt="Voucher de pago"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                      }}
                    />
                  </div>
                )}
                <a
                  href={pedido.voucher_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Abrir en nueva pestaña
                </a>
              </div>
            </div>
          )}

          {/* Productos */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos ({pedido.items?.length || 0})</h3>
            <div className="space-y-4">
              {pedido.items?.map((item, index) => {
                const itemAny = item as any;
                const productoImg = itemAny.producto?.imagen_principal || itemAny.producto?.imagenes?.[0];
                
                return (
                <div key={index} className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
                  {productoImg && (
                    <img
                      src={productoImg}
                      alt={item.nombre_producto || 'Producto'}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80?text=Sin+imagen';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.nombre_producto}</h4>
                    {(item.color || item.talla) && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.talla && `Talla: ${item.talla}`}
                        {item.talla && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">Cantidad: {item.cantidad}</span>
                      <span className="text-gray-600">
                        Precio: S/ {(item.precio_unitario || item.precioUnitario)?.toFixed(2)}
                      </span>
                      <span className="font-semibold text-gray-900">
                        Subtotal: S/ {item.subtotal?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          {/* Resumen de pago */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pago</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>S/ {pedido.subtotal?.toFixed(2)}</span>
              </div>
              {pedido.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>- S/ {pedido.descuento?.toFixed(2)}</span>
                </div>
              )}
              {pedido.cupon_usado && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Cupón usado:</span>
                  <span className="font-mono">{pedido.cupon_usado}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Envío:</span>
                <span>S/ {pedido.envio?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                <span>Total:</span>
                <span>S/ {pedido.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPanel;
