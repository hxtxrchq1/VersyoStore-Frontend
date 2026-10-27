import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contactService } from '../services/contact.service';

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un correo válido'),
  asunto: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactService.sendContactMessage(data);
      toast.success('Mensaje enviado correctamente. Te responderemos pronto.');
      reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar mensaje';
      toast.error(errorMessage);
      console.error('Contact form error:', error);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Correo',
      details: 'versyostore@gmailcom',
      link: 'mailto:versyostore@gmailcom'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefono',
      details: '+51 914754513',
      link: 'tel:+51 914754513'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Ubicación',
      details: 'Trujillo',
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Hora de Atención',
      details: 'LUN-VIE: 9AM-6PM',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-versyo-dark to-versyo-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactanos
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md text-center"
              >
                <div className="text-versyo-dark mb-4 flex justify-center">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-zinc-600 hover:text-versyo-dark transition-colors"
                  >
                    {info.details}
                  </a>
                ) : (
                  <p className="text-zinc-600">{info.details}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">
              Mandanos un mensaje
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    {...register('nombre')}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                    placeholder="tu.correo@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-zinc-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="asunto"
                  {...register('asunto')}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors"
                  placeholder="¿De qué se trata esto?"
                />
                {errors.asunto && (
                  <p className="mt-1 text-sm text-red-600">{errors.asunto.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-zinc-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  rows={6}
                  {...register('mensaje')}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent transition-colors resize-vertical"
                  placeholder="Hablanos..."
                />
                {errors.mensaje && (
                  <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-versyo-dark to-versyo-primary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

    <Footer />
    </div>
  );
};

export default Contact;

