import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-versyo-primary" />
            <h1 className="text-4xl font-bold text-versyo-dark">Política de Privacidad</h1>
          </div>
          <p className="text-zinc-600 text-lg">
            Tu privacidad es importante para nosotros. Última actualización: Diciembre 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Introducción */}
          <section id="introduccion">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">1. Introducción</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                En <strong>Versyo Store</strong> respetamos tu privacidad y nos comprometemos a proteger tus datos personales. 
                Esta política describe cómo recopilamos, usamos y protegemos tu información de acuerdo con la 
                <strong> Ley de Protección de Datos Personales del Perú (Ley N° 29733)</strong>.
              </p>
            </div>
          </section>

          {/* Información que recopilamos */}
          <section id="recopilacion">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-versyo-primary" />
              <h2 className="text-2xl font-bold text-zinc-800">2. Información que Recopilamos</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-800 mb-2">Información de Registro:</h3>
                <ul className="list-disc list-inside space-y-1 text-zinc-700">
                  <li>Nombre y apellidos</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>DNI (para facturación si aplica)</li>
                  <li>Contraseña encriptada</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-800 mb-2">Información de Envío:</h3>
                <ul className="list-disc list-inside space-y-1 text-zinc-700">
                  <li>Dirección completa (departamento, provincia, distrito, dirección exacta)</li>
                  <li>Referencias de ubicación</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-800 mb-2">Información de Compra:</h3>
                <ul className="list-disc list-inside space-y-1 text-zinc-700">
                  <li>Historial de pedidos</li>
                  <li>Productos en carrito y wishlist</li>
                  <li>Comprobantes de pago (vouchers de Yape, transferencias)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-800 mb-2">Información Técnica:</h3>
                <ul className="list-disc list-inside space-y-1 text-zinc-700">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cómo usamos tu información */}
          <section id="uso">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-versyo-primary" />
              <h2 className="text-2xl font-bold text-zinc-800">3. Cómo Usamos tu Información</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Utilizamos tus datos personales para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Procesar y gestionar tus pedidos</li>
                <li>Enviar confirmaciones de compra y actualizaciones de envío</li>
                <li>Mejorar tu experiencia de compra (recomendaciones personalizadas)</li>
                <li>Gestionar tu membresía Versyo (si aplica)</li>
                <li>Enviar promociones y descuentos exclusivos (con tu consentimiento)</li>
                <li>Atender consultas y brindar soporte al cliente</li>
                <li>Cumplir con obligaciones legales (facturación, SUNAT)</li>
              </ul>
            </div>
          </section>

          {/* Compartir información */}
          <section id="compartir">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">4. Compartir Información con Terceros</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                No vendemos ni alquilamos tus datos personales. Solo compartimos información con:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li><strong>Servicios de envío:</strong> Olva Courier (solo dirección y contacto para entrega)</li>
                <li><strong>Pasarelas de pago:</strong> Para procesar transacciones con tarjeta</li>
                <li><strong>Proveedores de servicios:</strong> Cloudinary (almacenamiento de imágenes), Supabase (base de datos)</li>
                <li><strong>Autoridades legales:</strong> Si es requerido por ley</li>
              </ul>
            </div>
          </section>

          {/* Seguridad */}
          <section id="seguridad">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-versyo-primary" />
              <h2 className="text-2xl font-bold text-zinc-800">5. Seguridad de tus Datos</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Implementamos medidas de seguridad para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Contraseñas encriptadas con bcrypt</li>
                <li>Conexión HTTPS segura (SSL/TLS)</li>
                <li>Base de datos con cifrado en reposo</li>
                <li>Acceso restringido a datos personales (solo personal autorizado)</li>
                <li>Tokens JWT para autenticación segura</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">6. Uso de Cookies</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Mantener tu sesión activa (tokens de autenticación)</li>
                <li>Recordar productos en tu carrito</li>
                <li>Mejorar la experiencia de navegación</li>
                <li>Analizar tráfico del sitio</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mt-3">
                Puedes desactivar las cookies en tu navegador, pero esto puede afectar la funcionalidad del sitio.
              </p>
            </div>
          </section>

          {/* Tus derechos */}
          <section id="derechos">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">7. Tus Derechos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                De acuerdo con la Ley de Protección de Datos Personales del Perú, tienes derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Oposición:</strong> Negarte al tratamiento de tus datos para fines específicos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mt-4">
                Para ejercer estos derechos, contáctanos en: <strong>versyostore@gmail.com</strong>
              </p>
            </div>
          </section>

          {/* Retención de datos */}
          <section id="retencion">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">8. Retención de Datos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Datos de cuenta: Mientras tu cuenta esté activa</li>
                <li>Historial de pedidos: 5 años (obligación tributaria SUNAT)</li>
                <li>Datos de marketing: Hasta que retires tu consentimiento</li>
                <li>Datos técnicos (logs): 6 meses</li>
              </ul>
            </div>
          </section>

          {/* Menores de edad */}
          <section id="menores">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">9. Menores de Edad</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Nuestro sitio no está dirigido a menores de 18 años. Si eres menor, necesitas permiso de un tutor legal para realizar compras. 
                No recopilamos intencionalmente datos de menores sin consentimiento.
              </p>
            </div>
          </section>

          {/* Cambios en la política */}
          <section id="cambios">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">10. Cambios en esta Política</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Podemos actualizar esta política de privacidad ocasionalmente. Los cambios se publicarán en esta página con la fecha de actualización. 
                Te recomendamos revisarla periódicamente.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section id="contacto">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">11. Contacto</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos:
              </p>
              <ul className="list-none space-y-2 text-zinc-700 mt-3">
                <li>📧 Email: versyostore@gmail.com</li>
                <li>📱 WhatsApp: +51 914754513</li>
                <li>📷 Instagram: @versyo.store</li>
              </ul>
            </div>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
