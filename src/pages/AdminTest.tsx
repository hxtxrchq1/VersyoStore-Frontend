import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminTest: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">🔧 Test de Admin</h1>
        
        <div className="space-y-6">
          {/* Estados Booleanos */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold mb-2">Estados</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className={`p-2 rounded ${isLoading ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                isLoading: <strong>{isLoading ? 'true ⏳' : 'false'}</strong>
              </div>
              <div className={`p-2 rounded ${isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
                isAuthenticated: <strong>{isAuthenticated ? 'true ✅' : 'false ❌'}</strong>
              </div>
              <div className={`p-2 rounded ${isAdmin ? 'bg-green-100' : 'bg-red-100'}`}>
                isAdmin: <strong>{isAdmin ? 'true ✅' : 'false ❌'}</strong>
              </div>
            </div>
          </div>

          {/* Objeto User */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-semibold mb-2">Objeto User</h2>
            {user ? (
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded">
                  <strong>ID:</strong> {user.id}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Nombre:</strong> {user.nombre}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className={`p-3 rounded ${user.rol === 'admin' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <strong>Rol:</strong> {user.rol}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Tipo de Rol:</strong> {typeof user.rol}
                </div>
              </div>
            ) : (
              <p className="text-red-600">Usuario es NULL</p>
            )}
          </div>

          {/* Comparaciones */}
          {user && (
            <div className="border-l-4 border-orange-500 pl-4">
              <h2 className="text-xl font-semibold mb-2">Comparaciones</h2>
              <div className="space-y-2 font-mono text-sm">
                <div className={`p-2 rounded ${user.rol === 'admin' ? 'bg-green-100' : 'bg-red-100'}`}>
                  user.rol === 'admin': <strong>{(user.rol === 'admin').toString()}</strong>
                </div>
                <div className={`p-2 rounded ${user.rol === 'cliente' ? 'bg-green-100' : 'bg-red-100'}`}>
                  user.rol === 'cliente': <strong>{(user.rol === 'cliente').toString()}</strong>
                </div>
                <div className="p-2 rounded bg-gray-100">
                  Rol exacto (JSON): <strong>{JSON.stringify(user.rol)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Acciones</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  console.log('🔍 DIAGNÓSTICO COMPLETO:');
                  console.log('isAuthenticated:', isAuthenticated);
                  console.log('isAdmin:', isAdmin);
                  console.log('isLoading:', isLoading);
                  console.log('user:', user);
                  console.log('user?.rol:', user?.rol);
                  console.log('user?.rol === "admin":', user?.rol === 'admin');
                  console.log('localStorage user:', localStorage.getItem('user'));
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                📋 Log Completo en Consola
              </button>
              
              <button
                onClick={() => navigate('/admin')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                🚀 Intentar Ir a /admin
              </button>
              
              <button
                onClick={() => {
                  if (user) {
                    const updatedUser = { ...user, rol: 'admin' as const };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    window.location.reload();
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                disabled={!user}
              >
                🔧 Forzar Rol Admin
              </button>
              
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                🗑️ Limpiar y Logout
              </button>
            </div>
          </div>

          {/* Resultado del Test */}
          <div className={`border-2 p-4 rounded-lg ${isAdmin ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <h2 className="text-2xl font-bold mb-2">
              {isAdmin ? '✅ PUEDE ACCEDER AL PANEL ADMIN' : '❌ NO PUEDE ACCEDER AL PANEL ADMIN'}
            </h2>
            {!isAdmin && user && (
              <div className="mt-4 text-sm">
                <p className="font-semibold">Razón del problema:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {!isAuthenticated && <li>No está autenticado</li>}
                  {isAuthenticated && user.rol !== 'admin' && (
                    <li>El rol es "{user.rol}" en vez de "admin"</li>
                  )}
                  {isAuthenticated && user.rol === 'admin' && (
                    <li className="text-orange-600">
                      ⚠️ El rol ES "admin" pero isAdmin es false - Hay un bug en el AuthContext
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
