import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-versyo-dark text-white">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4 group">
              <img 
                src="/logo_sin_fondo.png" 
                alt="Versyo Logo" 
                className="h-12 w-auto transform transition-transform group-hover:scale-105 brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              Consigue prendas exclusivas, buena calidad, pues no solo ofrecemos ropa, sino un estilo único para ti.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/versyo.store/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-versyo-primary rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
             <a
                href="mailto:contact@Versyo.com"
                className="w-10 h-10 bg-white/10 hover:bg-versyo-primary rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Tienda</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/mens" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Moda Masculina
                </Link>
              </li>
              <li>
                <Link to="/womens" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Moda Femenina
                </Link>
              </li>
              {/*<li>
                <Link to="/drops" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  DROP 
                </Link>
              </li>*/}
              <li>
                <Link to="/cart" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Información</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/shipping#devoluciones" className="text-white/70 hover:text-versyo-primary transition-colors flex items-center group">
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Atención al Cliente</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-white/70">
                <strong className="text-white block mb-1">Horario</strong>
                Lunes - Viernes: 9am - 6pm<br />
                Sábados: 9am - 3pm
              </li>
              <li className="text-white/70">
                <strong className="text-white block mb-1">Contáctanos</strong>
                versyostore@gmail.com<br />
                +51 914754513
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Métodos de Pago</h4>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded text-xs font-bold">VISA</div>
                <div className="px-3 py-2 rounded text-xs font-bold">MASTERCARD</div>
                <div className="px-3 py-2 rounded text-xs font-bold">YAPE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 Versyo Store. Todos los derechos reservados. • Desarrollado por <a rel="nofollow" target="_blank" href="https://chiqo.site" className="text-versyo-primary hover:text-white transition-colors">Chiqo</a>
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Términos</Link>
              <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
