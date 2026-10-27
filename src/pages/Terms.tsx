import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms: React.FC = () => {
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
            <FileText className="w-12 h-12 text-versyo-primary" />
            <h1 className="text-4xl font-bold text-versyo-dark">Términos y Condiciones</h1>
          </div>
          <p className="text-zinc-600 text-lg">
            Última actualización: Diciembre 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Aceptación de términos */}
          <section id="aceptacion">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">1. Aceptación de Términos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Al acceder y utilizar el sitio web de <strong>Versyo Store</strong>, aceptas cumplir con estos términos y condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, te recomendamos no utilizar nuestros servicios.
              </p>
            </div>
          </section>

          {/* Uso del sitio */}
          <section id="uso">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">2. Uso del Sitio Web</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Debes ser mayor de 18 años o tener permiso de un tutor legal para realizar compras.</li>
                <li>La información proporcionada en el registro debe ser veraz y actualizada.</li>
                <li>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
                <li>No está permitido el uso del sitio para actividades ilegales o no autorizadas.</li>
              </ul>
            </div>
          </section>

          {/* Productos y precios */}
          <section id="productos">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">3. Productos y Precios</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Todos los precios están expresados en Soles Peruanos (PEN).</li>
                <li>Nos reservamos el derecho de modificar precios sin previo aviso.</li>
                <li>Las imágenes de productos son referenciales y pueden variar ligeramente del producto real.</li>
                <li>La disponibilidad de productos está sujeta a stock.</li>
              </ul>
            </div>
          </section>

          {/* Compras y pagos */}
          <section id="compras">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">4. Compras y Pagos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                <strong>Métodos de pago aceptados:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Transferencia bancaria BCP</li>
                <li>Yape</li>
                <li>Tarjetas de crédito y débito (Visa, Mastercard)</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mt-4">
                El pedido se procesará una vez confirmado el pago mediante el comprobante enviado.
              </p>
            </div>
          </section>

          {/* Envíos */}
          <section id="envios">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">5. Envíos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li><strong>Envío gratis</strong> en compras mayores a S/ 150</li>
                <li>Trujillo: S/ 7.00</li>
                <li>Resto del Perú: S/ 20.00 (vía Olva Courier)</li>
                <li>Tiempo de entrega: 3-7 días hábiles</li>
              </ul>
            </div>
          </section>

          {/* Devoluciones */}
          <section id="devoluciones">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">6. Devoluciones</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Solo se aceptan devoluciones si el producto presenta <strong>falla de fábrica</strong> (costuras mal acabadas, roturas, manchas visibles).
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
                <li>Plazo: 30 días desde la recepción del producto</li>
                <li>El producto debe estar sin usar y con etiquetas originales</li>
                <li>Los costos de envío por devolución son a cargo del cliente</li>
              </ul>
            </div>
          </section>

          {/* Propiedad intelectual */}
          <section id="propiedad">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">7. Propiedad Intelectual</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Todo el contenido del sitio, incluyendo diseños, logotipos, imágenes y textos, es propiedad de <strong>Versyo Store</strong> 
                y está protegido por las leyes de propiedad intelectual del Perú.
              </p>
            </div>
          </section>

          {/* Limitación de responsabilidad */}
          <section id="responsabilidad">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">8. Limitación de Responsabilidad</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Versyo Store no se hace responsable por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700">
                <li>Retrasos en la entrega causados por el servicio de courier</li>
                <li>Información incorrecta proporcionada por el cliente</li>
                <li>Daños durante el transporte (debes reportarlo al courier inmediatamente)</li>
              </ul>
            </div>
          </section>

          {/* Modificaciones */}
          <section id="modificaciones">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">9. Modificaciones de los Términos</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Las modificaciones entrarán en vigencia al momento de su publicación en el sitio web.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section id="contacto">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">10. Contacto</h2>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
              <p className="text-zinc-700 leading-relaxed">
                Para cualquier consulta sobre estos términos y condiciones, puedes contactarnos:
              </p>
              <ul className="list-none space-y-2 text-zinc-700">
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

export default Terms;
