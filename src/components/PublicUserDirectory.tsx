import React, { useState, useMemo } from 'react';
import { Search, User, GraduationCap, Building, Users, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile, CollaboratorGroup } from '../types/flc';
import { ROLES } from '../data/flcInitialData';

interface PublicUserDirectoryProps {
  users: UserProfile[];
  onOpenUserProfile: (user: UserProfile) => void;
}

export const PublicUserDirectory: React.FC<PublicUserDirectoryProps> = ({
  users = [],
  onOpenUserProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CollaboratorGroup | 'todos'>('todos');

  // Filtered users list with NoSQL defense
  const filteredUsers = useMemo(() => {
    const rawUsers = Array.isArray(users) ? users : [];
    return rawUsers.filter((u) => {
      if (!u) return false;

      const name = typeof u.name === 'string' ? u.name : '';
      const handle = typeof u.handle === 'string' ? u.handle : '';
      const group = typeof u.group === 'string' ? u.group : 'alumnado';
      const grade = typeof u.gradeOrDept === 'string' ? u.gradeOrDept : '';
      const primaryRole = typeof u.primaryRole === 'string' ? u.primaryRole : '';

      const roleObj = ROLES.find((r) => r.id === primaryRole);
      const roleName = roleObj ? roleObj.name : '';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup = selectedGroup === 'todos' || group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [users, searchQuery, selectedGroup]);

  const getGroupIcon = (group: any) => {
    const safeGroup = typeof group === 'string' ? group : 'alumnado';
    switch (safeGroup) {
      case 'alumnado':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'profesorado':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'familias':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      case 'entidades_externas':
        return <Building className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getGroupLabel = (group: any) => {
    const safeGroup = typeof group === 'string' ? group : 'alumnado';
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
        return String(safeGroup);
    }
  };

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#080D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Red del Taller Maker
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              COMUNIDAD DE CREADORES
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Explora las fichas y competencias de los alumnos, docentes, familias y socios externos. Haz clic en cualquiera para consultar su perfil completo (modo consulta).
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, rol, curso..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Group Selector Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 max-w-max">
          <button
            onClick={() => setSelectedGroup('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === 'todos'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({(users || []).length})
          </button>
          <button
            onClick={() => setSelectedGroup('alumnado')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === 'alumnado'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/20 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Alumnado</span>
          </button>
          <button
            onClick={() => setSelectedGroup('profesorado')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === 'profesorado'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Profesorado</span>
          </button>
          <button
            onClick={() => setSelectedGroup('familias')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === 'familias'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/20 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Familias</span>
          </button>
          <button
            onClick={() => setSelectedGroup('entidades_externas')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === 'entidades_externas'
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/20 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-purple-400" />
            <span>Colaboradores</span>
          </button>
        </div>

        {/* Users Card Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
            <p className="text-sm font-bold text-slate-400">No se encontraron miembros</p>
            <p className="text-xs text-slate-500 mt-1">Prueba con otro término de búsqueda o filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => {
              const safeAvatarColor = typeof user.avatarColor === 'string' ? user.avatarColor : '#10B981';
              const safeName = typeof user.name === 'string' ? user.name : 'Miembro';
              const safeHandle = typeof user.handle === 'string' ? user.handle : '@miembro';
              const safeGrade = typeof user.gradeOrDept === 'string' ? user.gradeOrDept : '-';
              const safeGroup = typeof user.group === 'string' ? user.group : 'alumnado';
              const safeBio = typeof user.bio === 'string' ? user.bio : '';

              const roleObj = ROLES.find((r) => r.id === user.primaryRole);
              const roleName = roleObj ? roleObj.name : 'Creador';
              const roleColor = roleObj ? roleObj.color : '#F59E0B';

              return (
                <div
                  key={user.id}
                  onClick={() => onOpenUserProfile(user)}
                  className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="space-y-3.5">
                    {/* Header: Avatar, Name & Handle */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-slate-950 uppercase shrink-0 shadow-md text-sm"
                        style={{ backgroundColor: safeAvatarColor }}
                      >
                        {safeName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-white text-sm sm:text-base group-hover:text-amber-400 transition-colors truncate">
                          {safeName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{safeHandle}</p>
                      </div>
                    </div>

                    {/* Role Badge & Group */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: roleColor }}
                        />
                        <span className="text-xs font-bold text-slate-200">
                          {roleName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        {getGroupIcon(safeGroup)}
                        <span className="truncate">{getGroupLabel(safeGroup)}</span>
                      </div>
                    </div>

                    {/* Grade or Department */}
                    <div className="text-[11px] text-slate-400 font-medium">
                      {safeGrade}
                    </div>

                    {/* Bio (clamped) */}
                    {safeBio && (
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {safeBio}
                      </p>
                    )}
                  </div>

                  {/* Actions / CTA */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Ver Ficha</span>
                    <button
                      type="button"
                      className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-bold"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200">Consultar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
