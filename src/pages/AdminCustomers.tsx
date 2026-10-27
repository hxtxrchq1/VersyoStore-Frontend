import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { userService } from '../services/user.service';
import type { User } from '../types';

const AdminCustomers: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; userId: number | null; userName: string }>({ show: false, userId: null, userName: '' });
  const [editModal, setEditModal] = useState<{ show: boolean; user: User | null }>({ show: false, user: null });
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Función para toggle de estado (no implementada aún)
  // const handleToggleActive = async (id: number, activo: boolean) => {
  //   try {
  //     await userService.toggleUserActive(id, !activo);
  //     toast.success('Estado del usuario actualizado');
  //     fetchUsuarios();
  //   } catch (error: any) {
  //     console.error('Error al actualizar usuario:', error);
  //     toast.error(error.response?.data?.message || 'Error al actualizar el usuario');
  //   }
  // };

  const handleChangeRole = async (id: number, rol: 'admin' | 'cliente') => {
    try {
      await userService.changeUserRole(id, rol);
      toast.success('Rol actualizado correctamente');
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error al cambiar rol:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar el rol');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;
    try {
      await userService.deleteUser(deleteModal.userId);
      toast.success('Usuario eliminado correctamente');
      setDeleteModal({ show: false, userId: null, userName: '' });
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const openDeleteModal = (id: number, nombre: string, apellido?: string) => {
    setDeleteModal({ show: true, userId: id, userName: `${nombre} ${apellido || ''}`.trim() });
  };

  const openEditModal = (user: User) => {
    setEditModal({ show: true, user });
    setEditForm({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      dni: user.dni,
      direccion: user.direccion,
      tiene_membresia: user.tiene_membresia || false,
    });
  };

  const handleSaveEdit = async () => {
    if (!editModal.user) return;
    try {
      const api = (await import('../services/api')).default;
      await api.patch(`/usuario/admin/${editModal.user.id}`, editForm);
      toast.success('Usuario actualizado correctamente');
      setEditModal({ show: false, user: null });
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(user =>
    user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios de la plataforma</p>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar usuarios
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre o email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-versyo-primary focus:border-transparent"
            />
            <button className="px-6 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-versyo-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membresía VIP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosFiltrados.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-versyo-primary rounded-full flex items-center justify-center text-white font-bold">
                            {user.nombre ? user.nombre[0].toUpperCase() : user.email[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Sin nombre'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.telefono || 'No proporcionado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.rol}
                          onChange={(e) => handleChangeRole(user.id, e.target.value as 'admin' | 'cliente')}
                          className="text-sm border border-gray-300 rounded px-2 py-1 capitalize"
                        >
                          <option value="cliente">Cliente</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.tiene_membresia ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.tiene_membresia ? 'VIP' : 'Estándar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt || user.creado_en || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar usuario"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user.id, user.nombre || user.email, user.apellido)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Edit User Modal */}
      {editModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Editar Usuario</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editForm.nombre || ''}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={editForm.apellido || ''}
                  onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={editForm.telefono || ''}
                  onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input
                  type="text"
                  value={editForm.dni || ''}
                  onChange={(e) => setEditForm({ ...editForm, dni: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.direccion || ''}
                  onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.tiene_membresia || false}
                    onChange={(e) => setEditForm({ ...editForm, tiene_membresia: e.target.checked })}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Membresía VIP</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditModal({ show: false, user: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{deleteModal.userName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, userId: null, userName: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;