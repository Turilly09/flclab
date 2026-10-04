import React, { useState } from 'react';
import { PHASES } from '../data/flcInitialData';
import { ProjectPhase } from '../types/flc';
import { RefreshCw, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Download } from 'lucide-react';

interface MethodologySectionProps {
  onSelectPhaseFilter: (phase: ProjectPhase) => void;
  projectCountByPhase: Record<number, number>;
  onDownloadPdf: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  onSelectPhaseFilter,
  projectCountByPhase,
  onDownloadPdf,
}) => {
  const [activeStep, setActiveStep] = useState<ProjectPhase>(1);
  const currentPhase = PHASES.find((p) => p.step === activeStep) || PHASES[0];

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#080D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header from slide 5 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <RefreshCw className="w-3.5 h-3.5" />
            Flujo de Trabajo Iterativo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            DEL CONCEPTO AL PRODUCTO FINAL
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            No nos quedamos en la teoría: cada grupo avanza paso a paso por 6 fases claras hasta
            crear algo real y funcional para la comunidad.
          </p>

          {/* Central Loop Motto Banner & Direct PDF Download Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
              <span>APRENDER • ITERAR • SEGUIR MEJORANDO</span>
            </div>

            <button
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white hover:text-amber-300 border border-slate-700 font-bold text-xs sm:text-sm transition-all shadow-md group cursor-pointer"
              title="Descargar el documento PDF oficial ¿Qué queremos ser?"
            >
              <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Descargar Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* 6 Step Progress Bar / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {PHASES.map((phase) => {
            const isSelected = phase.step === activeStep;
            const count = projectCountByPhase[phase.step] || 0;

            return (
              <button
                key={phase.step}
                onClick={() => setActiveStep(phase.step)}
                className={`relative flex flex-col p-3 sm:p-4 rounded-xl text-left border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 shadow-md scale-102 z-10'
                    : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
                    style={{
                      backgroundColor: phase.color,
                      color: '#0B0F19',
                    }}
                  >
                    {phase.step}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-300">
                    {count} {count === 1 ? 'proj' : 'projs'}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-white leading-tight">
                  {phase.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {phase.subtitle}
                </span>

                {isSelected && (
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                    style={{ backgroundColor: phase.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Detail Deck */}
        <div
          className="rounded-2xl bg-slate-900/90 border-2 p-6 sm:p-8"
          style={{ borderColor: `${currentPhase.color}60` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-slate-950"
                  style={{ backgroundColor: currentPhase.color }}
                >
                  {currentPhase.step}
                </span>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    Fase {currentPhase.step}: {currentPhase.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400">
                    {currentPhase.subtitle}
                  </p>
                </div>
              </div>

              {/* Actions List from Slide 5 */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Acciones clave de esta etapa:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPhase.actions.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800"
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: currentPhase.color }}
                      />
                      <span className="text-xs sm:text-sm text-slate-200 leading-snug">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Summary / Project Filter CTA */}
            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Estado actual en el FLC LAB
                </span>
                <p className="text-3xl font-black text-white mt-1 tabular-nums">
                  {projectCountByPhase[currentPhase.step] || 0}{' '}
                  <span className="text-sm font-semibold text-slate-400">
                    proyectos en fase {currentPhase.name}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Al completar las acciones de validación, el equipo promueve el proyecto a la siguiente etapa.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectPhaseFilter(currentPhase.step)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-950 transition-colors shadow"
                  style={{ backgroundColor: currentPhase.color }}
                >
                  <span>Filtrar Proyectos en Fase {currentPhase.step}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated PDF Presentation Banner at the bottom of Methodology */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20 border-2 border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">
                ¿Qué queremos ser? · Dossier Oficial de Presentación FLC LAB
              </h4>
              <p className="text-xs text-slate-300">
                Descarga el documento PDF oficial con la filosofía, roles, metodología y fases del proyecto.
              </p>
            </div>
          </div>

          <button
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Dossier Oficial (PDF)</span>
          </button>
        </div>
      </div>
    </section>
  );
};

