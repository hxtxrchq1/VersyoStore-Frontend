import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = window.location.pathname;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary mx-auto"></div>
          <p className="mt-4 text-versyo-dark">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la URL a la que quería ir para redirigir después del login
    sessionStorage.setItem('redirectAfterLogin', location);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
