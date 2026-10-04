import React from 'react';
import { ASSET_IMAGES } from '../data/flcInitialData';
import { Crown, Sparkles, ArrowRight, Lightbulb, Compass, Users2, Mail, Download, PlusCircle } from 'lucide-react';
import { UserProfile } from '../types/flc';

interface HeroSectionProps {
  currentUser?: UserProfile | null;
  onExploreProjects: () => void;
  onExploreCalendar: () => void;
  onExploreRoles: () => void;
  onOpenQuiz: () => void;
  onDownloadPdf: () => void;
  onProposeProject?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onExploreProjects,
  onExploreCalendar,
  onExploreRoles,
  onOpenQuiz,
  onDownloadPdf,
  onProposeProject,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Comic-style Bold Presentation Typography */}
          <div className="lg:col-span-7 space-y-6">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">IES Fernando Lázaro Carreter</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-medium">Utrillas (Teruel)</span>
            </div>

            {/* Main Title & Slogans directly from slides 1 & 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
                <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-amber-400">
                  Laboratorio de Creación
                </span>
              </div>

              {/* Title & Powerful Button side-by-side */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  IDEAS DE HOY.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 block sm:inline">
                    MUNDOS DE MAÑANA.
                  </span>
                </h1>

                <button
                  onClick={onDownloadPdf}
                  className="self-start xl:self-center inline-flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black tracking-tight transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-amber-400/40 border-2 border-yellow-200 group cursor-pointer shrink-0"
                  title="Descargar dossier oficial del proyecto FLC LAB: ¿Qué queremos ser? (PDF)"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-slate-950" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                      ¿Qué queremos ser?
                    </span>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-slate-900/80 leading-none">
                      Descargar Dossier Oficial (PDF)
                    </span>
                  </div>
                  <Download className="w-5 h-5 text-slate-950 group-hover:translate-y-0.5 transition-transform ml-1" />
                </button>
              </div>

              <p className="text-xl sm:text-2xl font-bold text-amber-300/90 tracking-tight">
                No es una clase. Es un laboratorio.
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Un espacio creativo multidisciplinar donde estudiantes, profesores, familias y entidades
              diseñan, programan, ilustran y fabrican proyectos reales: videojuegos, robots, cortometrajes y
              juegos de mesa desde la idea inicial hasta la feria final.
            </p>

            {/* Key Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-transform active:scale-95 shadow-lg shadow-amber-400/25 cursor-pointer"
              >
                <span>Explorar Proyectos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onProposeProject && (
                <button
                  onClick={onProposeProject}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm border border-amber-400/50 transition-transform active:scale-95 shadow-md shadow-amber-400/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {currentUser?.isAdmin
                      ? '+ Nuevo Proyecto'
                      : currentUser?.group === 'alumnado'
                      ? '+ Proponer Proyecto'
                      : currentUser?.group === 'familias'
                      ? '+ Proponer Iniciativa'
                      : currentUser?.group === 'entidades_externas'
                      ? '+ Proponer Reto'
                      : '+ Proponer Idea'}
                  </span>
                </button>
              )}

              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Cuál es tu Rol?</span>
              </button>
              <button
                onClick={onExploreCalendar}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Calendario del Taller</span>
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

          {/* Right Column: Hero Visual from slide 1 & 2 */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-900 group">
              <img
                src={ASSET_IMAGES.hero}
                alt="Laboratorio creativo FLC LAB en IES Fernando Lázaro Carreter"
                className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Visual overlay tag */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  FLC LAB · Utrillas
                </span>
              </div>

              {/* Bottom Quote Banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  Metodología de Trabajo
                </p>
                <p className="text-sm font-medium text-slate-200">
                  «Del concepto al producto final: diseñar, prototipar, probar y presentar en comunidad.»
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    flclab@iesutrillas.es
                  </span>
                  <span className="text-amber-400 font-bold">1º ESO a FP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
