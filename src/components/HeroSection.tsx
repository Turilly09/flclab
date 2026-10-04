import React from 'react';
import { Crown, Sparkles, ArrowRight, Compass, Download, Flame, Printer } from 'lucide-react';
import { UserProfile, HeroCarouselSlide } from '../types/flc';
import { HeroCarousel } from './HeroCarousel';

interface HeroSectionProps {
  currentUser?: UserProfile | null;
  onExploreProjects: () => void;
  onExploreCalendar: () => void;
  onExploreRoles: () => void;
  onOpenQuiz: () => void;
  onDownloadPdf: () => void;
  onProposeProject?: () => void;
  carouselSlides: HeroCarouselSlide[];
  onUpdateCarouselSlide: (slide: HeroCarouselSlide) => void;
  onResetCarouselSlides?: () => void;
  onNavigateTab: (tab: string) => void;
  totalRecruitsCount?: number;
  maxRecruits?: number;
  onOpenRecruitModal?: () => void;
  onOpenPrintPoster?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onExploreProjects,
  onExploreCalendar,
  onExploreRoles,
  onOpenQuiz,
  onDownloadPdf,
  onProposeProject,
  carouselSlides,
  onUpdateCarouselSlide,
  onResetCarouselSlides,
  onNavigateTab,
  totalRecruitsCount = 14,
  maxRecruits = 20,
  onOpenRecruitModal,
  onOpenPrintPoster,
}) => {
  const remainingSlots = Math.max(0, maxRecruits - totalRecruitsCount);

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Comic-style Bold Presentation Typography */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Founder Squad Banner */}
            {onOpenRecruitModal && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-amber-400/20 via-orange-500/15 to-purple-600/20 border border-amber-400/40 shadow-lg shadow-amber-400/10">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  <div className="text-xs text-white">
                    <span className="font-black text-amber-300 uppercase tracking-wider">Escuadrón Fundador:</span>{' '}
                    <span className="font-bold">{totalRecruitsCount}/{maxRecruits} plazas</span> ·{' '}
                    <span className="text-slate-300 hidden sm:inline">¡Quedan {remainingSlots} puestos libres!</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenRecruitModal}
                    className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    ⚡ Fichar & Discord
                  </button>
                  {onOpenPrintPoster && (
                    <button
                      onClick={onOpenPrintPoster}
                      className="p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold cursor-pointer hidden md:inline-flex items-center gap-1"
                      title="Imprimir cartel A4 con QR"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cartel</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">IES Fernando Lázaro Carreter</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-medium">Utrillas (Teruel)</span>
            </div>

            {/* Main Title & Slogans directly from slides 1 & 2 */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <Crown className="w-7 h-7 text-amber-400 fill-amber-400" />
                <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-amber-400">
                  Laboratorio de Creación
                </span>
              </div>

              {/* Bold Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
                IDEAS DE HOY.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 block sm:inline">
                  MUNDOS DE MAÑANA.
                </span>
              </h1>

              {/* Seamless, integrated presentation with "¿Qué queremos ser?" */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <p className="text-xl sm:text-2xl font-bold text-amber-300/90 tracking-tight">
                  No es una clase. Es un laboratorio.
                </p>

                <button
                  onClick={onDownloadPdf}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-400/40 hover:border-amber-400 transition-all text-xs font-semibold cursor-pointer group shadow-sm shadow-amber-400/10"
                  title="Descargar dossier oficial del proyecto FLC LAB: ¿Qué queremos ser? (PDF)"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                  <span className="font-bold">¿Qué queremos ser?</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold uppercase">
                    Dossier PDF
                  </span>
                </button>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Un espacio creativo multidisciplinar donde estudiantes, profesores, familias y entidades
              diseñan, programan, ilustran y fabrican proyectos reales: videojuegos, robots, cortometrajes y
              juegos de mesa desde la idea inicial hasta la feria final.
            </p>

            {/* 4 Key Action Buttons strictly in the same line */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 pt-2">
              <button
                onClick={onExploreProjects}
                className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer text-center"
                title="Ver catálogo de proyectos y prototipos"
              >
                <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                <span>Explorar</span>
              </button>

              {onProposeProject ? (
                <button
                  onClick={onProposeProject}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-bold text-xs sm:text-sm border border-amber-400/40 hover:border-amber-400 transition-transform active:scale-95 shadow-sm whitespace-nowrap cursor-pointer text-center"
                  title="Dar de alta o proponer una iniciativa maker"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
                  <span>{currentUser?.isAdmin ? 'Crear' : 'Proponer'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={onOpenQuiz}
                className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-500 transition-colors whitespace-nowrap cursor-pointer text-center shadow-sm"
                title="Descubrir tu rol ideal en el laboratorio con un test rápido"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
                <span>Test Rol</span>
              </button>

              <button
                onClick={onExploreCalendar}
                className="w-full inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-500 transition-colors whitespace-nowrap cursor-pointer text-center shadow-sm"
                title="Consultar calendario de talleres y sesiones"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
                <span>Calendario</span>
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
              <div>
                <div className="text-2xl font-black text-white tabular-nums">7</div>
                <div className="text-xs text-slate-400">Disciplinas Creativas</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tabular-nums">8</div>
                <div className="text-xs text-slate-400">Roles de Equipo</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tabular-nums">6</div>
                <div className="text-xs text-slate-400">Fases de Producto</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 tabular-nums">3T</div>
                <div className="text-xs text-slate-400">Hacia la Feria Pública</div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Carousel */}
          <div className="lg:col-span-5 relative">
            <HeroCarousel
              slides={carouselSlides}
              onUpdateSlide={onUpdateCarouselSlide}
              onResetSlides={onResetCarouselSlides}
              isAdmin={!!currentUser?.isAdmin}
              onNavigateTab={onNavigateTab}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
