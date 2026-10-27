import React from 'react';
import { Truck, Package, Shield, CreditCard, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-versyo-dark to-versyo-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Informacion de Envio
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Envios seguros a todo el Peru
            </p>
          </motion.div>
        </div>
      </section>

      {/* Envios Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-10 h-10 text-versyo-primary" />
              <h2 className="text-3xl font-bold text-zinc-800">Envios</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
              <p className="text-zinc-700 leading-relaxed">
                Realizamos envios a todo el Peru a traves de las agencias <strong>Olva Courier</strong> y <strong>Shalom</strong>. 
                El costo de envio puede variar dependiendo del destino y la agencia seleccionada o acordada con el cliente.
              </p>
              <ul className="space-y-2 text-zinc-700">
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span>Los tiempos de entrega estan sujetos a la logistica de la agencia correspondiente.</span>
                </li>
              </ul>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-versyo-primary mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-versyo-primary" />
                  <h3 className="font-semibold text-zinc-800">En Trujillo ofrecemos:</h3>
                </div>
                <ul className="space-y-2 text-zinc-700 ml-7">
                  <li><strong>Delivery local:</strong> S/ 7</li>
                  <li><strong>Contraentrega:</strong> UPAO, California, Golf, La Noria</li>
                </ul>
              </div>

              <p className="text-zinc-700 leading-relaxed mt-4">
                Nos comprometemos a notificarte cuando tu pedido sea enviado y entregarte el comprobante correspondiente 
                para que realices el seguimiento.
              </p>
            </div>
          </motion.div>

          {/* Devoluciones Section */}
          <motion.div
            id="devoluciones"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-10 h-10 text-versyo-primary" />
              <h2 className="text-3xl font-bold text-zinc-800">Devoluciones</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
              <p className="text-zinc-700 leading-relaxed">
                En <strong>Versyo</strong>, cada prenda es elaborada y revisada cuidadosamente. Entendemos que las devoluciones 
                pueden ser sensibles, por lo que tenemos politicas claras:
              </p>
              <ul className="space-y-3 text-zinc-700">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-versyo-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Solo se aceptan devoluciones si el producto presenta una falla de fabrica</strong> (como roturas, costuras mal acabadas o manchas visibles al momento de entrega).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span><strong>No se realizan cambios por tallas.</strong> Te pedimos revisar detalladamente la guia de tallas antes de realizar tu pedido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span><strong>No se realiza devolucion de dinero</strong> por cancelaciones voluntarias, desistimientos o falta de respuesta del cliente una vez confirmado el pedido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span>Para solicitar un cambio por falla, <strong>la solicitud debe realizarse dentro de los 7 dias posteriores a la compra</strong>, adjuntando fotos de la prenda y detalles del problema.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span>Los costos de envio por devoluciones van a cargo del cliente, a menos que se confirme la falla de fabrica tras la revision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-versyo-primary mt-1"></span>
                  <span>El tiempo de envio y entrega depende exclusivamente de la empresa de courier elegida. <strong>Versyo no se responsabiliza por demoras ajenas a nuestro control</strong>. Te recomendamos dar seguimiento a tu paquete con la boleta entregada.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Metodos de Pago Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-10 h-10 text-versyo-primary" />
              <h2 className="text-3xl font-bold text-zinc-800">Metodos de Pago</h2>
            </div>
            <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
              <p className="text-zinc-700 leading-relaxed">
                Aceptamos los siguientes metodos de pago:
              </p>
              <ul className="grid grid-cols-2 gap-3">
                <li className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <span className="text-versyo-primary font-bold text-xl"></span>
                  <span className="font-semibold text-zinc-800">Yape</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <span className="text-versyo-primary font-bold text-xl"></span>
                  <span className="font-semibold text-zinc-800">Plin</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <span className="text-versyo-primary font-bold text-xl"></span>
                  <span className="font-semibold text-zinc-800">Transferencia bancaria</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <span className="text-versyo-primary font-bold text-xl"></span>
                  <span className="font-semibold text-zinc-800">Efectivo (Trujillo)</span>
                </li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mt-4">
                Una vez realizado el pago, deberas enviar el comprobante correspondiente para confirmar tu pedido.
              </p>
            </div>
          </motion.div>

          {/* Politicas y Derechos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-versyo-primary" />
              <h2 className="text-3xl font-bold text-zinc-800">Politicas y Derechos de Autorias</h2>
            </div>
            <div className="bg-gradient-to-br from-versyo-dark to-versyo-deep text-white rounded-lg p-6 space-y-4">
              <p className="leading-relaxed">
                Todo el contenido de <strong>Versyo</strong>, incluyendo pero no limitado a: <strong>logos, disenos, prendas, 
                ilustraciones, nombres, fotografias, tipografias personalizadas, contenido grafico y audiovisual</strong>, 
                constituye <strong>propiedad registrada</strong> de <strong>Katherine Cruz</strong> y <strong>Alonso Paredes</strong>.
              </p>
              <p className="leading-relaxed">
                Queda <strong>prohibida cualquier forma de reproduccion, distribucion, modificacion, venta, o uso no autorizado</strong> del 
                contenido de esta marca sin un permiso explicito y por escrito de los propietarios.
              </p>
              <p className="leading-relaxed">
                Versyo se reserva todos los derechos de propiedad intelectual y legal de sus productos, identidad grafica, 
                y material comercial. Cualquier intento de plagio, uso indebido o apropiacion sera sancionado de acuerdo 
                con la ley de propiedad intelectual vigente en el Peru y tratados internacionales que protegen la creatividad 
                y la autoria.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
