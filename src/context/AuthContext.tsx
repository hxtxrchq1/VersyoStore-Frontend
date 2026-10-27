import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        console.log('🔄 Cargando usuario desde localStorage...');
        console.log('   Token existe:', !!token);
        console.log('   Usuario guardado:', savedUser);

        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('   Usuario parseado:', parsedUser);
            console.log('   Rol del usuario:', parsedUser.rol);
            console.log('   Es admin (parseado)?:', parsedUser.rol === 'admin');
            
            // Intentar obtener el perfil actualizado del backend
            try {
              console.log('   Obteniendo perfil actualizado del backend...');
              const profile = await userService.getProfile();
              console.log('   Perfil obtenido del backend:', profile);
              console.log('   Rol del perfil:', profile.rol);
              console.log('   Es admin (perfil)?:', profile.rol === 'admin');
              setUser(profile);
              localStorage.setItem('user', JSON.stringify(profile));
            } catch (error) {
              console.log('   ⚠️ Error al obtener perfil del backend, usando usuario guardado');
              console.error('   Error details:', error);
              // Si falla, usar el usuario guardado
              setUser(parsedUser);
            }
          } catch (parseError) {
            console.error('   ❌ Error al parsear usuario del localStorage:', parseError);
            // Si hay error al parsear, limpiar todo
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        // Limpiar si hay error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.login(credentials);
      
      // Guardar tokens y usuario
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Construir objeto usuario completo con el campo usuario del response
      const userData = response.usuario || response.user;
      if (!userData) {
        throw new Error('No se recibió información del usuario');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado inmediatamente
      setUser(userData);
      setIsLoading(false);
      
      return userData;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.register(data);
      
      // Guardar tokens y usuario
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Construir objeto usuario completo
      const userData = response.usuario || response.user;
      if (!userData) {
        throw new Error('No se recibió información del usuario');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado inmediatamente
      setUser(userData);
      setIsLoading(false);
      
      return userData;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear user-specific cart before logout
    if (user?.id) {
      const userCartKey = `versyo-cart-${user.id}`;
      localStorage.removeItem(userCartKey);
    }
    
    authService.logout();
    setUser(null);
    
    // Dispatch storage event to notify CartContext
    window.dispatchEvent(new Event('storage'));
  };

  const refreshUser = async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const isAuthenticated = !!user;
  // Comparación simple y directa del rol
  const isAdmin = user?.rol === 'admin';

  // Debug logs
  React.useEffect(() => {
    console.log('🔍 AuthContext - Estado actualizado:', {
      isAuthenticated,
      isAdmin,
      userRol: user?.rol,
      userId: user?.id,
      userName: user?.nombre,
      comparison: user?.rol === 'admin'
    });
  }, [user, isAuthenticated, isAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
