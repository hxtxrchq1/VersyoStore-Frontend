import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un correo valido'),
  contrasena: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  telefono: z.string().optional(),
}).refine((data) => data.contrasena === data.confirmPassword, {
  message: "Las contrasenas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const userData = await registerUser(registerData);
      
      toast.success('¡Registro exitoso! Por favor verifica tu correo electrónico.');
      
      // Esperar un momento para que el estado se actualice
      setTimeout(() => {
        // Redirigir según el rol
        if (userData.rol === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 100);
    } catch (error: any) {
      // Extraer el mensaje de error del backend
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Error al registrar usuario. Por favor, intenta de nuevo.';
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-versyo-dark mb-4">
              Crear Cuenta
            </h1>
            <p className="text-versyo-deep">
              Unete a nuestra comunidad
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-8 border border-zinc-200"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="text"
                    id="nombre"
                    {...register('nombre')}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="Juan Perez"
                  />
                </div>
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                  Correo Electronico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="tu.correo@ejemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-zinc-700 mb-2">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="telefono"
                    {...register('telefono')}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="+51 999 999 999"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-zinc-700 mb-2">
                  Contrasena
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contrasena"
                    {...register('contrasena')}
                    className="w-full pl-10 pr-12 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.contrasena && (
                  <p className="mt-1 text-sm text-red-600">{errors.contrasena.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
                  Confirmar Contrasena
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className="w-full pl-10 pr-12 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder=""
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 border-zinc-300 rounded text-versyo-primary focus:ring-versyo-primary"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-zinc-600">
                  Acepto los{' '}
                  <a href="#" className="text-versyo-primary hover:text-versyo-dark transition-colors">
                    Terminos de Servicio
                  </a>
                  {' '}y{' '}
                  <a href="#" className="text-versyo-primary hover:text-versyo-dark transition-colors">
                    Politica de Privacidad
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-versyo-dark text-white py-3 px-4 rounded-lg hover:bg-versyo-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-zinc-600">
                Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-versyo-primary hover:text-versyo-dark font-medium transition-colors">
                  Iniciar sesion
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
