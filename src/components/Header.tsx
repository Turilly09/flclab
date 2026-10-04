import React from 'react';
import { Crown, Sparkles, SlidersHorizontal, PlusCircle, UserPlus, User, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { UserProfile } from '../types/flc';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isManageMode: boolean;
  setIsManageMode: (val: boolean) => void;
  onOpenNewProject: () => void;
  onOpenCollabProposal: () => void;
  onOpenQuiz: () => void;
  onOpenPermissionsModal: () => void;
  onOpenTeacherAdmissionModal?: () => void;
  currentUser?: UserProfile | null;
  allUsers?: UserProfile[];
  onSwitchUser?: (user: UserProfile) => void;
  onOpenAuthModal: (tab: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isManageMode,
  setIsManageMode,
  onOpenNewProject,
  onOpenCollabProposal,
  onOpenQuiz,
  onOpenPermissionsModal,
  onOpenTeacherAdmissionModal,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenAuthModal,
  onLogout,
  onOpenUserProfile,
}) => {
  const getGroupBadge = (user: UserProfile) => {
    if (user.isAdmin) {
      return (
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
          Admin
        </span>
      );
    }
    switch (user.group) {
      case 'alumnado':
        return (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Alumno
          </span>
        );
      case 'profesorado':
        return (
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
            user.teacherStatus === 'aprobado'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {user.teacherStatus === 'aprobado' ? 'Docente' : 'Docente (Pendiente)'}
          </span>
        );
      case 'familias':
        return (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Familia
          </span>
        );
      case 'entidades_externas':
        return (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Empresa
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            Creador
          </span>
        );
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                FLC <span className="text-amber-400">LAB</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                IES Fernando Lázaro Carreter
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => {
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'inicio'
                ? 'text-amber-400 bg-slate-800/80'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Manifiesto & Roles
          </button>
          <button
            onClick={() => {
              setActiveTab('proyectos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'proyectos'
                ? 'text-amber-400 bg-slate-800/80'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Proyectos
          </button>
          <button
            onClick={() => {
              setActiveTab('calendario');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'calendario'
                ? 'text-amber-400 bg-slate-800/80'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Calendario & Hitos
          </button>
          <button
            onClick={() => {
              setActiveTab('colaboraciones');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'colaboraciones'
                ? 'text-amber-400 bg-slate-800/80'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Comunidad & Colaboraciones
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Authenticated user session vs Guest buttons */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 pr-1.5">
              <button
                onClick={onOpenUserProfile}
                className="inline-flex items-center gap-2 px-1.5 py-0.5 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer text-left"
                title="Abrir mi ficha personal de creador"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-sm"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-white group-hover:text-amber-300 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {getGroupBadge(currentUser)}
                  </div>
                  <span className="text-[9px] text-amber-400/90 group-hover:underline leading-none">
                    Mi Ficha
                  </span>
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar sesión (Modo visitante)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Iniciar sesión en FLC LAB"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-400/20"
                title="Darse de alta como alumno, docente, familia o empresa"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Darse de Alta</span>
                <span className="sm:hidden">Alta</span>
              </button>
            </div>
          )}

          <button
            onClick={onOpenPermissionsModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Consultar la matriz de permisos y capacidades por colectivo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Permisos & Roles</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Descubre tu rol ideal en el laboratorio"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Test de Rol</span>
          </button>

          {/* Admin Exclusive: Pending Teachers Admission Badge */}
          {currentUser?.isAdmin && onOpenTeacherAdmissionModal && (
            (() => {
              const pendingCount = (allUsers || []).filter(
                (u) => u.group === 'profesorado' && !u.isAdmin && (u.teacherStatus || 'pendiente') === 'pendiente'
              ).length;
              if (pendingCount === 0) return null;
              return (
                <button
                  onClick={onOpenTeacherAdmissionModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-black rounded-lg bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25 animate-pulse cursor-pointer transition-transform active:scale-95"
                  title="Docentes pendientes de admisión por el Administrador"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden md:inline">Admitir Docentes</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black">
                    {pendingCount}
                  </span>
                </button>
              );
            })()
          )}

          {/* Admin Exclusive: Panel de Gestión toggle */}
          {currentUser?.isAdmin && (
            <button
              onClick={() => setIsManageMode(!isManageMode)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                isManageMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title="Panel de gestión y administración (Solo administradores)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{isManageMode ? 'Panel Admin Activo' : 'Panel Admin'}</span>
            </button>
          )}

          {/* Project Action: Create for Admin, Propose for Alumnado/Familias/Empresas/Guest */}
          {currentUser?.isAdmin ? (
            <button
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              title="Crear nuevo proyecto oficial en el laboratorio (Solo administradores)"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Nuevo Proyecto</span>
              <span className="md:hidden">+ Proyecto</span>
            </button>
          ) : currentUser?.group === 'alumnado' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              title="Proponer nueva iniciativa de proyecto del alumnado"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Proponer Proyecto</span>
              <span className="md:hidden">+ Proponer</span>
            </button>
          ) : currentUser?.group === 'familias' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-purple-400 hover:bg-purple-300 rounded-lg transition-transform active:scale-95 shadow-md shadow-purple-400/20 whitespace-nowrap cursor-pointer"
              title="Proponer iniciativa o taller familiar"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Proponer Iniciativa</span>
              <span className="md:hidden">+ Proponer</span>
            </button>
          ) : currentUser?.group === 'entidades_externas' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-pink-400 hover:bg-pink-300 rounded-lg transition-transform active:scale-95 shadow-md shadow-pink-400/20 whitespace-nowrap cursor-pointer"
              title="Proponer reto tecnológico de empresa para el alumnado"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Proponer Reto</span>
              <span className="md:hidden">+ Reto</span>
            </button>
          ) : currentUser ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
              title="Proponer una iniciativa o reto para el Lab"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Proponer Proyecto</span>
              <span className="md:hidden">+ Proponer</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800 bg-[#070b14] px-2 py-2 overflow-x-auto text-[11px] font-semibold text-slate-300">
        <button
          onClick={() => {
            setActiveTab('inicio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-2.5 py-1 rounded ${activeTab === 'inicio' ? 'bg-amber-400/10 text-amber-400 font-bold' : ''}`}
        >
          Manifiesto
        </button>
        <button
          onClick={() => {
            setActiveTab('proyectos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-2.5 py-1 rounded ${activeTab === 'proyectos' ? 'bg-amber-400/10 text-amber-400 font-bold' : ''}`}
        >
          Proyectos
        </button>
        <button
          onClick={() => {
            setActiveTab('calendario');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-2.5 py-1 rounded ${activeTab === 'calendario' ? 'bg-amber-400/10 text-amber-400 font-bold' : ''}`}
        >
          Calendario
        </button>
        <button
          onClick={() => {
            setActiveTab('colaboraciones');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-2.5 py-1 rounded ${activeTab === 'colaboraciones' ? 'bg-amber-400/10 text-amber-400 font-bold' : ''}`}
        >
          Comunidad
        </button>
      </div>
    </header>
  );
};
