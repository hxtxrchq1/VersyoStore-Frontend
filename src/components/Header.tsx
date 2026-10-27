import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Debug: Log cuando cambie el estado
  React.useEffect(() => {
    console.log('🔧 Header - Estado actual:', { isAuthenticated, isAdmin, userRol: user?.rol });
  }, [isAuthenticated, isAdmin, user]);

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/', { replace: true });
  };

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-versyo-light sticky top-0 z-50 backdrop-blur-sm bg-opacity-98">
      {/* Banner superior */}
      <div className="bg-versyo-dark text-white text-center py-2 text-sm">
        <p className="font-medium">✨ Envío gratis en compras mayores a S/150 ✨</p>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 justify-between">
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-14 flex-1 justify-center">
            <Link to="/mens" className="text-versyo-black hover:text-versyo-primary transition-colors font-medium relative group">
              Hombres
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-versyo-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/womens" className="text-versyo-black hover:text-versyo-primary transition-colors font-medium relative group">
              Mujeres
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-versyo-primary transition-all group-hover:w-full"></span>
            </Link>

            {/* Logo */}
            <Link to="/" className="flex items-center group mx-6">
              <img 
                src="/Versyo logo sin fondo.png" 
                alt="Versyo Logo" 
                className="h-16 w-auto transform transition-transform group-hover:scale-105"
              />
            </Link>

            <Link to="/about" className="text-versyo-black hover:text-versyo-primary transition-colors font-medium relative group">
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-versyo-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-versyo-black hover:text-versyo-primary transition-colors font-medium relative group">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-versyo-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions - Far Right */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/cart" className="relative p-2 text-versyo-black hover:text-versyo-primary transition-colors group">
              <ShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-versyo-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 relative user-menu-container">
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center space-x-2 p-2 text-versyo-black hover:text-versyo-primary transition-colors group"
                  title={`Hola, ${user?.nombre || 'Usuario'}`}
                >
                  <User className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline font-medium">{user?.nombre || 'Mi Cuenta'}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-semibold text-versyo-dark">{user?.nombre}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-versyo-black transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mi Cuenta
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/Admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-versyo-primary transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Panel Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                        title="Cerrar Sesión"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-versyo-black hover:text-versyo-primary transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-versyo-black hover:text-versyo-primary transition-colors absolute right-4"
            aria-label="Menú"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Logo móvil centrado */}
          <Link to="/" className="lg:hidden flex items-center justify-center w-full">
            <img 
              src="/Versyo logo sin fondo.png" 
              alt="Versyo Logo" 
              className="h-14 w-auto"
            />
          </Link>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-versyo-light py-6 bg-versyo-cream"
            >
              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  className="text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/mens"
                  className="text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hombres
                </Link>
                <Link
                  to="/womens"
                  className="text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mujeres
                </Link>
                <Link
                  to="/about"
                  className="text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contact"
                  className="text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
                
                <div className="pt-4 mt-4 border-t border-versyo-light space-y-3">
                  <Link
                    to="/cart"
                    className="flex items-center justify-between text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Carrito</span>
                    </div>
                    {getTotalItems() > 0 && (
                      <span className="bg-versyo-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                  
                  {user ? (
                    <>
                      <Link
                        to="/account"
                        className="flex items-center space-x-2 text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Mi Cuenta</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 text-versyo-black hover:bg-versyo-light hover:text-versyo-primary transition-colors px-4 py-3 rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
