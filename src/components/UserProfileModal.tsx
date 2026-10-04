import React from 'react';
import { UserProfile, Project, LabEvent } from '../types/flc';
import { ROLES, DISCIPLINES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import {
  X,
  User,
  Crown,
  Sparkles,
  Calendar,
  Layers,
  Award,
  School,
  ChevronRight,
  FolderKanban
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  profileUser?: UserProfile | null;
  onSwitchToUser?: (user: UserProfile) => void;
  projects: Project[];
  events: LabEvent[];
  onOpenProjectDetail: (project: Project) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profileUser,
  onSwitchToUser,
  projects,
  events,
  onOpenProjectDetail,
}) => {
  if (!isOpen) return null;

  const activeProfile = profileUser || currentUser;
  const isViewingSelf = activeProfile.id === currentUser.id;

  const primaryRoleObj = ROLES.find((r) => r.id === activeProfile.primaryRole) || ROLES[0];

  const userProjects = projects.filter((p) =>
    activeProfile.projectIds.includes(p.id) ||
    p.team.some((m) => m.name.toLowerCase().includes(activeProfile.name.toLowerCase().split(' ')[0]))
  );

  const userEvents = events.filter((e) =>
    activeProfile.registeredEventIds.includes(e.id) || e.isRegistered
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              <User className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isViewingSelf ? 'Mi Ficha Personal · Usuario Activo' : `Ficha de Creador · ${activeProfile.name}`}
              </span>
              <span className="text-[11px] text-slate-400">
                {isViewingSelf
                  ? 'Estás en sesión con este usuario. Comprueba tus competencias, proyectos y eventos.'
                  : 'Ficha de muestra. Puedes activar su vista para ver cómo se transforma la plataforma.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isViewingSelf && onSwitchToUser && (
              <button
                onClick={() => {
                  onSwitchToUser(activeProfile);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                title={`Cambiar sesión activa a ${activeProfile.name}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ver interfaz como {activeProfile.name.split(' ')[0]}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl"
              style={{ backgroundColor: activeProfile.avatarColor }}
            >
              {activeProfile.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-950 border border-amber-400 text-amber-400">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-2xl font-black text-white">{activeProfile.name}</h3>
                <p className="text-xs font-mono text-amber-400 font-bold">{activeProfile.handle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="self-center sm:self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  {activeProfile.group === 'alumnado'
                    ? '🎒 Alumnado'
                    : activeProfile.group === 'profesorado'
                    ? '🎓 Profesorado'
                    : activeProfile.group === 'familias'
                    ? '🏡 Familias (AMPA)'
                    : '🏢 Empresa / Entidad'}
                </span>

                {activeProfile.isAdmin && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    🛡️ Admin
                  </span>
                )}
              </div>
            </div>

            {/* Department / Grade / Organization */}
            <div className="space-y-1 text-xs text-slate-300">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <School className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeProfile.gradeOrDept}</span>
              </p>
              {activeProfile.organization && (
                <p className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                  <span className="font-semibold text-slate-300">Entidad / Colectivo:</span>
                  <span>{activeProfile.organization}</span>
                </p>
              )}
            </div>

            {/* Switch user banner on mobile if not viewing self */}
            {!isViewingSelf && onSwitchToUser && (
              <div className="pt-2 sm:hidden">
                <button
                  onClick={() => {
                    onSwitchToUser(activeProfile);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ver la interfaz como {activeProfile.name.split(' ')[0]}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sobre el Creador / Perfil
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
            {activeProfile.bio}
          </p>
        </div>

        {/* Roles & Competencies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Rol Principal en el Lab</span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
                style={{ backgroundColor: `${primaryRoleObj.color}25`, color: primaryRoleObj.color }}
              >
                <DynamicIcon name={primaryRoleObj.iconName} className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{primaryRoleObj.name}</p>
                <p className="text-xs text-slate-400">{primaryRoleObj.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span>Disciplinas Maker Favoritas</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeProfile.favoriteDisciplines.map((discId) => {
                const discObj = DISCIPLINES.find((d) => d.id === discId);
                if (!discObj) return null;
                return (
                  <span
                    key={discId}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-950"
                    style={{ backgroundColor: discObj.color }}
                  >
                    {discObj.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills & Tools */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Habilidades Técnicas, Herramientas & Materiales</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeProfile.skillsAndTools.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Insignias de Reconocimiento Maker ({activeProfile.badgeTitles.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeProfile.badgeTitles.map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1.5"
              >
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Projects Tracker */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-amber-400" />
              <span>Proyectos Vinculados ({userProjects.length})</span>
            </span>
          </h4>

          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userProjects.map((p) => {
                const discObj = DISCIPLINES.find((d) => d.id === p.discipline);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onOpenProjectDetail(p);
                    }}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: discObj?.color || '#FACC15' }}
                        />
                        <p className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                          {p.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Fase {p.phase} · Trimestre {p.trimester}T
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-950 border border-slate-800">
              Aún no participa en ningún proyecto activo.
            </p>
          )}
        </div>

        {/* Events Registered */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Sesiones y Talleres con Inscripción ({userEvents.length})</span>
            </span>
          </h4>

          {userEvents.length > 0 ? (
            <div className="space-y-2">
              {userEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{e.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {e.date} · {e.time} · {e.location}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Inscrito
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-950 border border-slate-800">
              No tiene inscripciones activas a eventos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
