import React, { useState, useRef, useEffect } from 'react';
import {
  Crown,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  PlusCircle,
  UserPlus,
  ShieldCheck,
  LogIn,
  LogOut,
  Compass,
  Layers,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  Users,
  Building2
} from 'lucide-react';
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
  onOpenAuthModal,
  onLogout,
  onOpenUserProfile,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'inicio':
        return 'Manifiesto & Roles';
      case 'proyectos':
        return 'Proyectos & Fases';
      case 'calendario':
        return 'Calendario & Hitos';
      case 'colaboraciones':
        return 'Comunidad';
      case 'alianzas':
        return 'Empresas & Ayuntamiento';
      default:
        return 'Manifiesto & Roles';
    }
  };

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
          <span
            className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
              user.teacherStatus === 'aprobado'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
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

  const pendingTeachersCount = (allUsers || []).filter(
    (u) => u.group === 'profesorado' && !u.isAdmin && (u.teacherStatus || 'pendiente') === 'pendiente'
  ).length;

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo + Navigation Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                FLC <span className="text-amber-400">LAB</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight hidden sm:inline">
                IES Fernando Lázaro Carreter
              </span>
            </div>
          </a>

          {/* Clean Navigation & Tools Dropdown */}
          <div className="relative" ref={navRef}>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-amber-400/50 shadow-sm transition-all cursor-pointer"
              title="Explorar secciones del laboratorio, test de rol y permisos"
              aria-expanded={isNavOpen}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              <span className="text-slate-400 font-normal hidden md:inline">Sección:</span>
              <span className="font-bold text-white tracking-tight">{getTabLabel(activeTab)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${
                  isNavOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Floating Panel */}
            {isNavOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/98 border border-slate-700 backdrop-blur-xl shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                {/* Section Header */}
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Secciones del Laboratorio
                </div>

                {/* 1. Manifiesto & Roles */}
                <button
                  onClick={() => {
                    setActiveTab('inicio');
                    setIsNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'inicio'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-tight">Manifiesto & Roles</div>
                      <div className={`text-[10px] ${activeTab === 'inicio' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        Filosofía y los 8 roles maker
                      </div>
                    </div>
                  </div>
                  {activeTab === 'inicio' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                {/* 2. Proyectos */}
                <button
                  onClick={() => {
                    setActiveTab('proyectos');
                    setIsNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'proyectos'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-tight">Proyectos & Fases</div>
                      <div className={`text-[10px] ${activeTab === 'proyectos' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        Metodología de 6 fases y catálogo
                      </div>
                    </div>
                  </div>
                  {activeTab === 'proyectos' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                {/* 3. Calendario */}
                <button
                  onClick={() => {
                    setActiveTab('calendario');
                    setIsNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'calendario'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-tight">Calendario & Hitos</div>
                      <div className={`text-[10px] ${activeTab === 'calendario' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        12 hitos, talleres y sesiones
                      </div>
                    </div>
                  </div>
                  {activeTab === 'calendario' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                {/* 4. Comunidad */}
                <button
                  onClick={() => {
                    setActiveTab('colaboraciones');
                    setIsNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'colaboraciones'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HeartHandshake className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-tight">Comunidad & Colaboraciones</div>
                      <div className={`text-[10px] ${activeTab === 'colaboraciones' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        Red de familias, empresas y vacantes
                      </div>
                    </div>
                  </div>
                  {activeTab === 'colaboraciones' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                {/* 5. Alianzas Externas */}
                <button
                  onClick={() => {
                    setActiveTab('alianzas');
                    setIsNavOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'alianzas'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-tight">Empresas & Ayuntamiento</div>
                      <div className={`text-[10px] ${activeTab === 'alianzas' ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        Alianzas, retos y patrocinio local
                      </div>
                    </div>
                  </div>
                  {activeTab === 'alianzas' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                {/* Divider: Herramientas & Roles */}
                <div className="pt-2 border-t border-slate-800/90 my-1">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Herramientas & Roles
                  </div>
                </div>

                {/* Test de Rol */}
                <button
                  onClick={() => {
                    setIsNavOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight">¿Cuál es tu Rol? (Test)</div>
                    <div className="text-[10px] text-slate-400">Cuestionario vocacional de 3 preguntas</div>
                  </div>
                </button>

                {/* Permisos & Roles */}
                <button
                  onClick={() => {
                    setIsNavOpen(false);
                    onOpenPermissionsModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight">Permisos & Roles del Centro</div>
                    <div className="text-[10px] text-slate-400">Matriz de capacidades por colectivo</div>
                  </div>
                </button>

                {/* Admin Exclusive: Pending Teachers Admission */}
                {currentUser?.isAdmin && onOpenTeacherAdmissionModal && pendingTeachersCount > 0 && (
                  <button
                    onClick={() => {
                      setIsNavOpen(false);
                      onOpenTeacherAdmissionModal();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Validar Profesores</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      {pendingTeachersCount}
                    </span>
                  </button>
                )}

                {/* Admin Exclusive: Toggle Manage Mode */}
                {currentUser?.isAdmin && (
                  <button
                    onClick={() => {
                      setIsManageMode(!isManageMode);
                      setIsNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isManageMode
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{isManageMode ? 'Panel de Gestión Activo' : 'Activar Panel de Gestión'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">ADMIN</span>
                  </button>
                )}

                {/* Quick Action: Proponer o Crear Proyecto */}
                <div className="pt-2 border-t border-slate-800/90 my-1">
                  <button
                    onClick={() => {
                      setIsNavOpen(false);
                      onOpenNewProject();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                    <span>+ Proponer / Crear Nuevo Proyecto</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Strictly Fixed Authentication Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            /* Authenticated User Session Pill & Logout */
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 pr-1.5 shadow-sm">
              <button
                onClick={onOpenUserProfile}
                className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer text-left"
                title="Abrir mi ficha de creador"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-sm"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {getGroupBadge(currentUser)}
                  </div>
                  <span className="text-[10px] text-amber-400/90 group-hover:underline leading-none">
                    Mi Ficha
                  </span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Guest Fixed Buttons: Iniciar Sesión & Darse de Alta */
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm"
                title="Iniciar sesión en FLC LAB"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-transform active:scale-95 cursor-pointer shadow-md shadow-amber-400/25 whitespace-nowrap"
                title="Darse de alta como alumno, docente, familia o empresa"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                <span>Darse de Alta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
