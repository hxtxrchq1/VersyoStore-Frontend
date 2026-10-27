import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, MapPin, User, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { orderService } from '../services/order.service';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const checkoutSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  telefono: z.string().min(9, 'Ingresa un teléfono válido'),
  direccion: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  ciudad: z.string().min(3, 'Ingresa una ciudad válida'),
  region: z.string().min(3, 'Ingresa una región válida'),
  pais: z.string().min(1, 'País es requerido'),
  metodoPago: z.enum(['yape', 'bcp']),
  notas: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<'yape' | 'bcp'>('yape');
  const [shippingCost, setShippingCost] = useState(0);
  const [ciudad, setCiudad] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      ciudad: user?.ciudad || '',
      region: user?.pais || '',
      pais: 'Perú',
      metodoPago: 'yape',
    },
  });

  // Load user data when available
  useEffect(() => {
    if (user) {
      setValue('nombre', user.nombre || '');
      setValue('apellido', user.apellido || '');
      setValue('email', user.email || '');
      setValue('telefono', user.telefono || '');
      setValue('direccion', user.direccion || '');
      const userCiudad = user.ciudad || '';
      setValue('ciudad', userCiudad);
      setCiudad(userCiudad);
      setValue('region', user.pais || ''); // Using pais as region
      setValue('pais', 'Perú');
    }
  }, [user, setValue]);

  // Calculate shipping cost based on city and cart total
  useEffect(() => {
    const subtotal = getTotalPrice();
    
    // Envío gratis si el subtotal supera 150 soles
    if (subtotal >= 150) {
      setShippingCost(0);
      return;
    }

    const normalizedCiudad = ciudad.toLowerCase().trim();
    if (normalizedCiudad === 'trujillo') {
      setShippingCost(7);
    } else if (normalizedCiudad === '') {
      setShippingCost(0);
    } else {
      setShippingCost(20);
    }
  }, [ciudad, getTotalPrice]);

  const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCiudad(value);
    setValue('ciudad', value);
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo no debe superar 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes');
        return;
      }
      setVoucherFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoucherPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!voucherFile) {
      toast.error('Debes subir el comprobante de pago para continuar');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Upload voucher using backend endpoint
      const formData = new FormData();
      formData.append('file', voucherFile);
      
      const uploadRes = await api.post('/upload/voucher', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const voucherUrl = uploadRes.data.url;

      const orderData = {
        items: items.map(item => ({
          productoId: item.id,
          variacionId: item.variacion?.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          color: item.variacion?.color,
          talla: item.variacion?.talla,
        })),
        nombre_receptor: `${data.nombre} ${data.apellido}`,
        direccion_envio: data.direccion,
        ciudad: data.ciudad,
        region: data.region,
        pais: 'Perú',
        telefono_contacto: data.telefono,
        metodo_pago: data.metodoPago,
        voucher_url: voucherUrl,
        notas: data.notas || '',
        costo_envio: shippingCost,
      };

      const pedido = await orderService.createOrder(orderData);
      
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      navigate('/order-confirmation', { state: { pedido } });
    } catch (error: any) {
      console.error('Error al crear el pedido:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error al procesar el pedido';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

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
              Finalizar Compra
            </h1>
            <div className="flex items-center gap-2 text-vintage-light-gray">
              <Lock className="w-5 h-5" />
              <span>Pago 100% seguro y encriptado</span>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información Personal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-versyo-dark" />
                    <h2 className="text-2xl font-display font-bold text-versyo-dark">
                      Información Personal
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        {...register('nombre')}
                        className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                        placeholder="Juan"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        {...register('apellido')}
                        className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                        placeholder="Pérez"
                      />
                      {errors.apellido && (
                        <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Correo Electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vintage-light-gray w-5 h-5" />
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full pl-10 pr-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                          placeholder="tu@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vintage-light-gray w-5 h-5" />
                        <input
                          type="tel"
                          {...register('telefono')}
                          className="w-full pl-10 pr-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                          placeholder="999 999 999"
                        />
                      </div>
                      {errors.telefono && (
                        <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Dirección de Envío */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-versyo-dark" />
                    <h2 className="text-2xl font-display font-bold text-versyo-dark">
                      Dirección de Envío
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        {...register('direccion')}
                        className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                        placeholder="Av. Principal 123, Dpto 456"
                      />
                      {errors.direccion && (
                        <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-versyo-deep mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          {...register('ciudad')}
                          onChange={handleCiudadChange}
                          className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                          placeholder="Trujillo"
                        />
                        {errors.ciudad && (
                          <p className="mt-1 text-sm text-red-600">{errors.ciudad.message}</p>
                        )}
                        {ciudad && (
                          <p className="mt-1 text-xs text-versyo-deep">
                            {ciudad.toLowerCase().trim() === 'trujillo' 
                              ? '🚚 Envío local: S/ 7.00' 
                              : '📦 Envío vía Olva Courier: S/ 20.00'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-versyo-deep mb-2">
                          Región *
                        </label>
                        <input
                          type="text"
                          {...register('region')}
                          className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
                          placeholder="Lima"
                        />
                        {errors.region && (
                          <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-versyo-deep mb-2">
                          País *
                        </label>
                        <input
                          type="text"
                          {...register('pais')}
                          value="Perú"
                          disabled
                          className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Método de Pago */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-versyo-dark" />
                    <h2 className="text-2xl font-display font-bold text-versyo-dark">
                      Método de Pago
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-3">
                        Selecciona el método de pago *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPayment === 'yape'
                              ? 'border-versyo-primary bg-versyo-light/30'
                              : 'border-versyo-primary/30 hover:border-versyo-primary/60'
                          }`}
                        >
                          <input
                            type="radio"
                            {...register('metodoPago')}
                            value="yape"
                            onChange={(e) => setSelectedPayment(e.target.value as 'yape' | 'bcp')}
                            className="absolute opacity-0"
                          />
                          <div className="text-4xl mb-2">📱</div>
                          <span className="font-semibold text-versyo-dark">Yape</span>
                        </label>
                        
                        <label
                          className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPayment === 'bcp'
                              ? 'border-versyo-primary bg-versyo-light/30'
                              : 'border-versyo-primary/30 hover:border-versyo-primary/60'
                          }`}
                        >
                          <input
                            type="radio"
                            {...register('metodoPago')}
                            value="bcp"
                            onChange={(e) => setSelectedPayment(e.target.value as 'yape' | 'bcp')}
                            className="absolute opacity-0"
                          />
                          <div className="text-4xl mb-2">🏦</div>
                          <span className="font-semibold text-versyo-dark">Transferencia BCP</span>
                        </label>
                      </div>
                      {errors.metodoPago && (
                        <p className="mt-2 text-sm text-red-600">{errors.metodoPago.message}</p>
                      )}
                    </div>

                    {/* Payment Details */}
                    <div className="bg-versyo-light/20 p-6 rounded-lg border border-versyo-primary/30">
                      {selectedPayment === 'yape' ? (
                        <div className="text-center">
                          <h3 className="font-semibold text-versyo-dark mb-3">Escanea el código QR con Yape</h3>
                          <div className="bg-white p-4 rounded-lg inline-block mb-3">
                            <img
                              src="/QR.png"
                              alt="QR Yape"
                              className="w-64 h-64 mx-auto object-contain"
                              onError={(e) => {
                                console.error('Error cargando QR');
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" alignment-baseline="middle" fill="%23999"%3EQR no disponible%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          <p className="text-sm text-versyo-deep mb-2">
                            <strong className="text-versyo-dark">o al número 914754513</strong>
                          </p>
                          <div className="my-2">
                            <strong className="text-versyo-dark">――――――――</strong>
                          </div>
                          <p className="text-sm text-versyo-deep">
                            <strong className="text-versyo-dark">Total a pagar:</strong> S/ {getTotalPrice().toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold text-versyo-dark mb-3">Datos para transferencia BCP</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-white rounded">
                              <span className="text-versyo-deep">Número de cuenta:</span>
                              <span className="font-semibold text-versyo-dark">57078585974024</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded">
                              <span className="text-versyo-deep">CCI:</span>
                              <span className="font-semibold text-versyo-dark">00257017858597402408</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded">
                              <span className="text-versyo-deep">Titular:</span>
                              <span className="font-semibold text-versyo-dark">Versyo Store</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded">
                              <span className="text-versyo-deep">Moneda:</span>
                              <span className="font-semibold text-versyo-dark">Soles (PEN)</span>
                            </div>
                            <div className="flex justify-between p-2 bg-versyo-primary/10 rounded mt-3">
                              <span className="text-versyo-deep font-semibold">Total a transferir:</span>
                              <span className="font-bold text-versyo-dark text-lg">S/ {getTotalPrice().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Voucher Upload */}
                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Comprobante de Pago * <span className="text-red-600">(Obligatorio)</span>
                      </label>
                      <div className="border-2 border-dashed border-versyo-primary/30 rounded-lg p-6 text-center">
                        {voucherPreview ? (
                          <div className="space-y-3">
                            <img
                              src={voucherPreview}
                              alt="Comprobante"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setVoucherFile(null);
                                setVoucherPreview('');
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Eliminar imagen
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="text-5xl mb-2">📸</div>
                            <p className="text-versyo-dark font-medium mb-1">
                              Sube tu comprobante de pago
                            </p>
                            <p className="text-xs text-versyo-deep mb-3">
                              Captura o sube la imagen de tu {selectedPayment === 'yape' ? 'Yape' : 'transferencia'}
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleVoucherChange}
                              className="hidden"
                            />
                            <span className="inline-block px-4 py-2 bg-versyo-primary text-white rounded-lg text-sm font-medium hover:bg-versyo-dark transition-colors">
                              Seleccionar archivo
                            </span>
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-versyo-deep mt-2">
                        Formatos: JPG, PNG. Máximo 5MB
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-versyo-deep mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        {...register('notas')}
                        rows={4}
                        className="w-full px-4 py-3 border border-versyo-primary/30 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent resize-none"
                        placeholder="Instrucciones especiales de entrega, referencias, etc."
                      />
                    </div>

                    <div className="bg-versyo-light/30 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-versyo-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-versyo-dark">Compra Segura</p>
                          <p className="text-xs text-versyo-black/70 mt-1">
                            Tus datos están protegidos. El pago se procesará de forma segura.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Resumen del Pedido */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg p-6 shadow-md border border-versyo-primary/20 sticky top-24">
                  <h2 className="text-2xl font-display font-bold text-versyo-dark mb-6">
                    Resumen del Pedido
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-versyo-dark text-sm">{item.nombre}</p>
                          <p className="text-xs text-vintage-light-gray">
                            Cantidad: {item.cantidad}
                          </p>
                          <p className="text-sm font-bold text-versyo-dark">
                            S/ {(item.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 border-t border-versyo-primary/20 pt-4">
                    <div className="flex justify-between text-versyo-deep">
                      <span>Subtotal</span>
                      <span>S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-versyo-deep">
                      <span>Envío</span>
                      {getTotalPrice() >= 150 ? (
                        <span className="text-green-600 font-semibold">¡GRATIS!</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-gray-400 text-sm">Ingresa ciudad</span>
                      ) : (
                        <span className={shippingCost === 7 ? 'text-versyo-primary font-semibold' : 'text-versyo-deep'}>
                          S/ {shippingCost.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {getTotalPrice() < 150 && getTotalPrice() > 0 && (
                      <div className="text-xs text-green-600 text-right bg-green-50 px-3 py-2 rounded-lg">
                        💚 ¡Compra S/ {(150 - getTotalPrice()).toFixed(2)} más y obtén envío gratis!
                      </div>
                    )}
                    <div className="border-t border-versyo-primary/20 pt-3 flex justify-between text-lg font-bold text-versyo-dark">
                      <span>Total</span>
                      <span className="font-display">S/ {(getTotalPrice() + shippingCost).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-versyo-dark text-white py-3 rounded-lg font-semibold hover:bg-versyo-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Realizar Pedido
                      </>
                    )}
                  </button>

                  <p className="text-xs text-vintage-light-gray text-center mt-4">
                    Al realizar el pedido, aceptas nuestros términos y condiciones
                  </p>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
