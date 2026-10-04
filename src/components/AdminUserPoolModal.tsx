import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Edit2, Trash2, Shield, User, GraduationCap, Building, Users, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { UserProfile, CollaboratorGroup, RoleId } from '../types/flc';

interface AdminUserPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onUpdateUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: UserProfile | null;
}

export const AdminUserPoolModal: React.FC<AdminUserPoolModalProps> = ({
  isOpen,
  onClose,
  users,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CollaboratorGroup | 'todos'>('todos');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Edit fields state
  const [editName, setEditName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGroup, setEditGroup] = useState<CollaboratorGroup>('alumnado');
  const [editGrade, setEditGrade] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editTeacherStatus, setEditTeacherStatus] = useState<'pendiente' | 'aprobado' | 'rechazado'>('aprobado');

  if (!isOpen) return null;

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      if (!u) return false;
      const name = u.name || '';
      const handle = u.handle || '';
      const email = u.email || '';
      const group = u.group || 'alumnado';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup = selectedGroup === 'todos' || group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [users, searchQuery, selectedGroup]);

  const handleStartEdit = (user: UserProfile) => {
    if (!user) return;
    setEditingUser(user);
    setEditName(user.name || '');
    setEditHandle(user.handle || '');
    setEditEmail(user.email || '');
    setEditGroup(user.group || 'alumnado');
    setEditGrade(user.gradeOrDept || '');
    setEditIsAdmin(!!user.isAdmin);
    setEditTeacherStatus(user.teacherStatus || 'aprobado');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: UserProfile = {
      ...editingUser,
      name: editName.trim(),
      handle: editHandle.trim(),
      email: editEmail.trim(),
      group: editGroup,
      gradeOrDept: editGrade.trim(),
      isAdmin: editIsAdmin,
      roleType: editIsAdmin ? 'admin' : 'creador',
      teacherStatus: editGroup === 'profesorado' ? editTeacherStatus : undefined,
    };

    onUpdateUser(updated);
    setEditingUser(null);
  };

  const handleDeleteConfirm = (userId: string, name: string) => {
    if (!userId) return;
    if (userId === currentUser?.id) {
      alert('No puedes eliminar tu propia cuenta de administrador en sesión.');
      return;
    }
    const confirm = window.confirm(`¿Estás completamente seguro de que deseas eliminar a ${name || 'este usuario'} de la pool de usuarios? Esta acción no se puede deshacer.`);
    if (confirm) {
      onDeleteUser(userId);
    }
  };

  const getGroupIcon = (group: CollaboratorGroup) => {
    const safeGroup = group || 'alumnado';
    switch (safeGroup) {
      case 'alumnado':
        return <Users className="w-4 h-4 text-cyan-400" />;
      case 'profesorado':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'familias':
        return <Building className="w-4 h-4 text-amber-400" />;
      case 'entidades_externas':
        return <Building className="w-4 h-4 text-purple-400" />;
      default:
        return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const getGroupLabel = (group: CollaboratorGroup) => {
    const safeGroup = group || 'alumnado';
    switch (safeGroup) {
      case 'alumnado':
        return 'Alumno / Creador';
      case 'profesorado':
        return 'Docente / Mentor';
      case 'familias':
        return 'Familia / Tutor';
      case 'entidades_externas':
        return 'Colaborador Externo';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Pool de Usuarios FLC LAB</h3>
              <p className="text-xs text-slate-400">
                Administra todas las cuentas de Alumnos, Docentes, Familias y Colaboradores registrados.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editing Overlay Panel / Modal section within modal */}
        {editingUser ? (
          <form onSubmit={handleSaveEdit} className="bg-slate-950 p-5 rounded-2xl border border-amber-400/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-black uppercase text-amber-400">
                Editar Cuenta de: {editingUser.name}
              </span>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cancelar Edición
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Apodo / Handle</label>
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Curso, Departamento u Organización</label>
                <input
                  type="text"
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Grupo de Colaborador</label>
                <select
                  value={editGroup}
                  onChange={(e) => setEditGroup(e.target.value as CollaboratorGroup)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="alumnado">Alumnado (Creadores)</option>
                  <option value="profesorado">Profesorado (Docentes)</option>
                  <option value="familias">Familias (Tutores)</option>
                  <option value="entidades_externas">Entidades / Empresas / Mentores</option>
                </select>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={editIsAdmin}
                    onChange={(e) => setEditIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-200">¿Asignar Rol de Administrador FLC LAB?</span>
                </label>
                <p className="text-[10px] text-slate-500 ml-6">
                  Permite añadir sesiones, resetear datos y gestionar este panel de usuarios.
                </p>
              </div>
            </div>

            {editGroup === 'profesorado' && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-400">Estado de Admisión Docente</label>
                <div className="flex gap-4">
                  {(['pendiente', 'aprobado', 'rechazado'] as const).map((status) => (
                    <label key={status} className="flex items-center gap-1.5 cursor-pointer text-xs uppercase font-black">
                      <input
                        type="radio"
                        name="editTeacherStatus"
                        value={status}
                        checked={editTeacherStatus === status}
                        onChange={() => setEditTeacherStatus(status)}
                        className="text-amber-400 focus:ring-amber-400"
                      />
                      <span className={
                        status === 'aprobado' ? 'text-emerald-400' :
                        status === 'pendiente' ? 'text-amber-400 animate-pulse' : 'text-rose-400'
                      }>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        ) : null}

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, apodo, email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] sm:text-xs">
            <button
              onClick={() => setSelectedGroup('todos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGroup === 'todos'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({users.length})
            </button>
            <button
              onClick={() => setSelectedGroup('alumnado')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGroup === 'alumnado'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3 text-cyan-400" />
              <span>Alumnado</span>
            </button>
            <button
              onClick={() => setSelectedGroup('profesorado')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGroup === 'profesorado'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3 h-3 text-emerald-400" />
              <span>Profesorado</span>
            </button>
            <button
              onClick={() => setSelectedGroup('familias')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGroup === 'familias'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3 text-amber-400" />
              <span>Familias</span>
            </button>
            <button
              onClick={() => setSelectedGroup('entidades_externas')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGroup === 'entidades_externas'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building className="w-3 h-3 text-purple-400" />
              <span>Colaboradores</span>
            </button>
          </div>
        </div>

        {/* User List Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center space-y-1">
              <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No se encontraron usuarios</p>
              <p className="text-xs text-slate-500">Prueba con otra búsqueda o filtro de grupo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-4">Usuario</th>
                    <th className="p-3.5">Grupo</th>
                    <th className="p-3.5">Curso / Dept</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Permisos</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const isUserAdmin = !!u.isAdmin;

                    return (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 pl-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-950 uppercase shadow-sm"
                              style={{ backgroundColor: u.avatarColor || '#e2e8f0' }}
                            >
                              {(u.name || 'U').charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1">
                                <span>{u.name || 'Sin nombre'}</span>
                                {isSelf && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/25 text-emerald-400 border border-emerald-500/30">
                                    Tú
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{u.handle || '@usuario'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            {getGroupIcon(u.group)}
                            <span className="text-slate-300 font-semibold">{getGroupLabel(u.group)}</span>
                          </div>
                          {u.group === 'profesorado' && (
                            <span className={`inline-block text-[9px] px-1.5 py-0.2 font-black rounded mt-0.5 uppercase ${
                              u.teacherStatus === 'aprobado' ? 'bg-emerald-500/25 text-emerald-400' :
                              u.teacherStatus === 'pendiente' ? 'bg-amber-500/25 text-amber-400 animate-pulse' : 'bg-rose-500/25 text-rose-400'
                            }`}>
                              {u.teacherStatus || 'pendiente'}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-300">{u.gradeOrDept || '-'}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="text-slate-400 font-mono">{u.email || '-'}</span>
                        </td>

                        <td className="p-3.5">
                          {isUserAdmin ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black uppercase text-[9px]">
                              <Shield className="w-2.5 h-2.5" />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase text-[9px]">
                              <User className="w-2.5 h-2.5" />
                              <span>Creador</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(u)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Editar datos de usuario"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteConfirm(u.id, u.name)}
                              className={`p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ${
                                isSelf ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                              disabled={isSelf}
                              title={isSelf ? 'No puedes borrarte a ti mismo' : 'Eliminar usuario'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Consejo administrativo:</strong> Cualquier usuario eliminado aquí perderá inmediatamente su derecho de acceso y sus propuestas de proyectos o colaboraciones quedarán desvinculadas de su perfil personal, aunque se mantendrán para no romper el historial de la base de datos.
          </span>
        </div>
      </div>
    </div>
  );
};
