import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const clearAndReload = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const forceAdminRole = () => {
    if (user) {
      const updatedUser = { ...user, rol: 'admin' as const };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">🔍 Debug de Autenticación</h1>
          
          <div className="space-y-6">
            {/* Estado de Autenticación */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold mb-2">Estado de Autenticación</h2>
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-gray-600">isAuthenticated:</span>{' '}
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '✅ true' : '❌ false'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">isAdmin:</span>{' '}
                  <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
                    {isAdmin ? '✅ true' : '❌ false'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">isLoading:</span>{' '}
                  <span className={isLoading ? 'text-yellow-600' : 'text-gray-600'}>
                    {isLoading ? '⏳ true' : 'false'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold mb-2">Objeto User del Context</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            {/* LocalStorage */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h2 className="text-xl font-semibold mb-2">LocalStorage</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 font-semibold">accessToken:</span>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                    {localStorage.getItem('accessToken') || '(vacío)'}
                  </pre>
                </div>
                <div>
                  <span className="text-gray-600 font-semibold">user:</span>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                    {localStorage.getItem('user') || '(vacío)'}
                  </pre>
                </div>
              </div>
            </div>

            {/* Comparación de Roles */}
            {user && (
              <div className="border-l-4 border-red-500 pl-4">
                <h2 className="text-xl font-semibold mb-2">Verificación de Rol</h2>
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-gray-600">user.rol:</span>{' '}
                    <span className="font-bold text-blue-600">{user.rol}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">user.rol === 'admin':</span>{' '}
                    <span className={user.rol === 'admin' ? 'text-green-600' : 'text-red-600'}>
                      {user.rol === 'admin' ? '✅ true' : '❌ false'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">typeof user.rol:</span>{' '}
                    <span className="text-gray-900">{typeof user.rol}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Caracteres del rol:</span>{' '}
                    <span className="text-gray-900">
                      {user.rol ? `[${user.rol.split('').map(c => c.charCodeAt(0)).join(', ')}]` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="border-t pt-6 space-y-3">
              <h2 className="text-xl font-semibold mb-4">Acciones</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Ir al Panel Admin
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Ir a Home
                </button>
                
                <button
                  onClick={forceAdminRole}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={!user}
                >
                  Forzar Rol Admin (LocalStorage)
                </button>
                
                <button
                  onClick={clearAndReload}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Limpiar Todo y Recargar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
