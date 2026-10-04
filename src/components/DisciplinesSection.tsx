import React, { useState } from 'react';
import { DISCIPLINES } from '../data/flcInitialData';
import { DisciplineId } from '../types/flc';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

interface DisciplinesSectionProps {
  onSelectDiscipline: (id: DisciplineId) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({
  onSelectDiscipline,
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<DisciplineId>('videojuegos');

  const activeDiscipline = DISCIPLINES.find((d) => d.id === selectedDisciplineId) || DISCIPLINES[0];

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#080D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header directly from slide 3 */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            7 Áreas Creativas
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            ¿QUÉ PUEDES HACER TÚ?
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            No necesitas saberlo todo para empezar: elige el área que más te motive o combina varias
            en un proyecto multidisciplinar.
          </p>
        </div>

        {/* 7 Disciplines Grid (matching the vibrant block layout of Slide 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-10">
          {DISCIPLINES.map((item) => {
            const isSelected = item.id === selectedDisciplineId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDisciplineId(item.id)}
                className={`relative flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200 border-2 cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-800/90 shadow-lg scale-102 z-10'
                    : 'bg-slate-900/60 hover:bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
                style={{
                  borderColor: isSelected ? item.color : undefined,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  <DynamicIcon name={item.iconName} className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-black text-white tracking-tight leading-snug">
                  {item.name}
                </span>
                {isSelected && (
                  <span
                    className="absolute -bottom-2 w-2 h-2 rotate-45"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Spotlight of Selected Discipline */}
        <div
          className="rounded-2xl bg-slate-900/90 border-2 p-6 sm:p-8 transition-all duration-300"
          style={{ borderColor: `${activeDiscipline.color}60` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
            <div className="lg:col-span-8 space-y-4 flex flex-col items-center lg:items-start">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-center sm:text-left">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0"
                  style={{
                    backgroundColor: `${activeDiscipline.color}25`,
                    color: activeDiscipline.color,
                  }}
                >
                  <DynamicIcon name={activeDiscipline.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{activeDiscipline.name}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-300">
                    {activeDiscipline.tagline}
                  </p>
                </div>
              </div>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                {activeDiscipline.description}
              </p>

              {/* Ideas de proyectos y herramientas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full text-left">
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    Ejemplos de Creación
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeDiscipline.examples.map((ex, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    Herramientas y Software
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDiscipline.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button for this discipline */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end text-center lg:text-right space-y-4 w-full">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-xs mx-auto lg:mx-0 text-center sm:text-left w-full">
                <p className="text-xs text-slate-400 mb-1">¿Tienes una idea en esta área?</p>
                <p className="text-xs font-semibold text-slate-200">
                  Puedes presentar tu propuesta de proyecto o sumarte a un equipo existente en {activeDiscipline.name}.
                </p>
              </div>

              <button
                onClick={() => onSelectDiscipline(activeDiscipline.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-950 transition-transform active:scale-95 shadow-md cursor-pointer"
                style={{ backgroundColor: activeDiscipline.color }}
              >
                <span>Ver Proyectos de {activeDiscipline.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
