import React, { useState } from 'react';
import { CollaborationRequest, CollaboratorGroup, RoleId, Project, UserProfile } from '../types/flc';
import { ROLES, DISCIPLINES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import {
  Users,
  Users2,
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  Building,
  HeartHandshake,
  Search,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CollaborationsManagerProps {
  collaborations: CollaborationRequest[];
  projects: Project[];
  currentUser?: UserProfile | null;
  onOpenCollabModal: (preselectedRole?: RoleId) => void;
  onOpenRegisterUser?: () => void;
  onOpenUserProfile?: () => void;
  onUpdateCollabStatus?: (id: string, status: 'pendiente' | 'aprobada' | 'incorporado') => void;
  isManageMode: boolean;
  isAdmin?: boolean;
}

export const CollaborationsManager: React.FC<CollaborationsManagerProps> = ({
  collaborations,
  projects,
  currentUser,
  onOpenCollabModal,
  onOpenRegisterUser,
  onOpenUserProfile,
  onUpdateCollabStatus,
  isManageMode,
  isAdmin = false,
}) => {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all open roles from active projects
  const openRolesVacancies = projects.flatMap((p) =>
    p.openRoles.map((roleId) => ({
      projectId: p.id,
      projectTitle: p.title,
      discipline: p.discipline,
      phase: p.phase,
      roleId,
    }))
  );

  const filteredCollabs = collaborations.filter((c) => {
    if (filterGroup !== 'all' && c.group !== filterGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEntity = c.gradeOrEntity.toLowerCase().includes(q);
      const matchMotiv = c.motivation.toLowerCase().includes(q);
      if (!matchName && !matchEntity && !matchMotiv) return false;
    }
    return true;
  });

  const getStatusBadge = (status: CollaborationRequest['status']) => {
    switch (status) {
      case 'incorporado':
        return { label: 'Incorporado a Proyecto', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'aprobada':
        return { label: 'Propuesta Aprobada', class: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      default:
        return { label: 'En Evaluación', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    }
  };

  const getGroupBadge = (group: CollaboratorGroup) => {
    switch (group) {
      case 'alumnado':
        return { label: 'Alumnado', class: 'bg-rose-500/10 text-rose-300 border-rose-500/20' };
      case 'profesorado':
        return { label: 'Profesorado', class: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      case 'familias':
        return { label: 'Familia', class: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'entidades_externas':
        return { label: 'Entidad / Empresa', class: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
    }
  };

  return (
    <section id="colaboraciones" className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header from slides 6, 7 & 9 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <Users2 className="w-3.5 h-3.5" />
              Red de Creadores y Comunidad
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              COLABORACIONES & EQUIPOS
            </h2>
            <p className="mt-2 text-slate-300 text-base max-w-2xl">
              Conectamos talentos: estudiantes que buscan rol, profesores mentores, familias que apoyan
              y empresas locales de las Cuencas Mineras que impulsan el talento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onOpenRegisterUser && (
              <button
                onClick={onOpenRegisterUser}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-white border border-amber-400/40 font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Alta de Usuario</span>
              </button>
            )}

            {currentUser ? (
              <button
                onClick={() => onOpenCollabModal()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>+ Enviar Propuesta de Colaboración</span>
              </button>
            ) : (
              <button
                onClick={onOpenRegisterUser}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Darse de Alta para Colaborar</span>
              </button>
            )}
          </div>
        </div>

        {/* User Account & Creator Profile Spotlight Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Perfil de Creador FLC
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Quieres tener tu propia Ficha de Usuario rastreable?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Al darte de alta como creador, asociamos tu historial de proyectos, tus 8 roles preferidos, tus
              herramientas de software, tus insignias conseguidas y las sesiones a las que te has apuntado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenUserProfile && (
              <button
                onClick={onOpenUserProfile}
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
              >
                Ver Ficha de Creador
              </button>
            )}
            {onOpenRegisterUser && (
              <button
                onClick={onOpenRegisterUser}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md"
              >
                Crear Mi Cuenta
              </button>
            )}
          </div>
        </div>

        {/* Vacantes Abiertas en Proyectos Activos (Bolsa de Talentos) */}
        {openRolesVacancies.length > 0 && (
          <div className="p-6 rounded-2xl bg-amber-950/20 border-2 border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Bolsa de Talentos: Roles Buscados en Proyectos
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-300">
                {openRolesVacancies.length} vacantes activas
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Estos proyectos en marcha necesitan personas para completar su equipo multidisciplinar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {openRolesVacancies.map((vac, i) => {
                const roleObj = ROLES.find((r) => r.id === vac.roleId);
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 group hover:border-amber-400/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${roleObj?.color || '#FACC15'}25`,
                          color: roleObj?.color || '#FACC15',
                        }}
                      >
                        <DynamicIcon name={roleObj?.iconName || 'Users'} className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-black text-white block truncate">
                          {vac.projectTitle}
                        </span>
                        <span className="text-[11px] font-bold text-amber-400">
                          Busca: {roleObj?.name}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCollabModal(vac.roleId)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-400 text-slate-950 hover:bg-amber-300 whitespace-nowrap shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      {currentUser ? 'Postular' : 'Alta para Postular'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Directory Filters */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterGroup === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Toda la Comunidad ({collaborations.length})
            </button>
            <button
              onClick={() => setFilterGroup('alumnado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterGroup === 'alumnado'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Alumnado
            </button>
            <button
              onClick={() => setFilterGroup('profesorado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterGroup === 'profesorado'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Profesorado
            </button>
            <button
              onClick={() => setFilterGroup('familias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterGroup === 'familias'
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Familias
            </button>
            <button
              onClick={() => setFilterGroup('entidades_externas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterGroup === 'entidades_externas'
                  ? 'bg-blue-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Entidades & Empresas
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar colaborador o entidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Directory Cards */}
        {filteredCollabs.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-3 max-w-lg mx-auto my-6">
            <Users className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Red de Colaboradores Lista</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aún no hay propuestas de colaboración registradas en este curso. Los estudiantes, familias y empresas pueden postularse y enviar sus iniciativas.
            </p>
            {currentUser ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenCollabModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+ Enviar Propuesta de Colaboración</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic pt-2">
                Para enviar propuestas de colaboración o postularte a vacantes, inicia sesión o date de alta.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCollabs.map((collab) => {
            const groupBadge = getGroupBadge(collab.group);
            const statusBadge = getStatusBadge(collab.status);

            return (
              <div
                key={collab.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${groupBadge.class}`}>
                      {groupBadge.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{collab.name}</h4>
                    <p className="text-xs text-amber-300/90 font-medium">{collab.gradeOrEntity}</p>
                  </div>

                  {/* Roles of interest badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {collab.rolesInterest.map((roleId) => {
                      const rObj = ROLES.find((r) => r.id === roleId);
                      return (
                        <span
                          key={roleId}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-200 border border-slate-800"
                        >
                          {rObj?.name || roleId}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                    «{collab.motivation}»
                  </p>

                  {collab.projectProposal && (
                    <div className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Propuesta: </span>
                      {collab.projectProposal}
                    </div>
                  )}
                </div>

                {/* Footer and Management Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Registrado: {collab.createdAt}</span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${collab.email}`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title={`Enviar email a ${collab.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>

                    {isManageMode && isAdmin && onUpdateCollabStatus && (
                      <select
                        value={collab.status}
                        onChange={(e) => onUpdateCollabStatus(collab.id, e.target.value as any)}
                        aria-label="Estado de la colaboración"
                        className="px-2 py-1 rounded text-[10px] font-bold bg-slate-950 border border-slate-700 text-amber-400"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="incorporado">Incorporado</option>
                      </select>
                    )}
                  </div>
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
