import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const location = window.location.pathname;

  // Debug logs
  React.useEffect(() => {
    console.log('🛡️ AdminRoute verificando:', {
      isAuthenticated,
      isAdmin,
      isLoading,
      userRole: user?.rol,
      location
    });
  }, [isAuthenticated, isAdmin, isLoading, user, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary mx-auto"></div>
          <p className="mt-4 text-versyo-dark">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login');
    // Guardar la URL para redirigir después del login
    sessionStorage.setItem('redirectAfterLogin', location);
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('❌ No es admin, redirigiendo a home. Rol actual:', user?.rol);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
