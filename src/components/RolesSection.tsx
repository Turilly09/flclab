import React, { useState } from 'react';
import { ROLES } from '../data/flcInitialData';
import { RoleId } from '../types/flc';
import { DynamicIcon } from './DynamicIcon';
import { Crown, Sparkles, Check, ArrowRight } from 'lucide-react';

interface RolesSectionProps {
  onSelectRoleFilter: (roleId: RoleId) => void;
  onOpenQuiz: () => void;
}

export const RolesSection: React.FC<RolesSectionProps> = ({
  onSelectRoleFilter,
  onOpenQuiz,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | null>(null);

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header from slide 4 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <Crown className="w-3.5 h-3.5" />
              Equipos de Trabajo
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              LOS 8 ROLES DEL LABORATORIO
            </h2>
            <p className="mt-2 text-slate-300 text-base max-w-2xl">
              Como en un estudio profesional o en una startup: cada proyecto necesita diferentes habilidades para
              alcanzar la versión final. ¿Cuál es el tuyo?
            </p>
          </div>

          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Test: ¿Cuál es mi rol ideal?</span>
          </button>
        </div>

        {/* 8 Roles Grid (faithful to slide 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ROLES.map((role) => {
            const isSelected = selectedRoleId === role.id;
            const isLead = role.id === 'project_lead';

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(isSelected ? null : role.id)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                  isLead
                    ? 'bg-amber-950/20 border-amber-400/80 shadow-lg shadow-amber-400/10'
                    : isSelected
                    ? 'bg-slate-800/90 border-slate-400 shadow-md'
                    : 'bg-slate-900/70 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Role Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${role.color}20`,
                        color: role.color,
                      }}
                    >
                      <DynamicIcon name={role.iconName} className="w-5 h-5" />
                    </div>
                    {isLead && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-amber-400 text-slate-950">
                        Coordinación
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {role.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mb-4">{role.subtitle}</p>

                  {/* Tasks List from Slide 4 */}
                  <ul className="space-y-1.5 mb-4 text-xs text-slate-300">
                    {role.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: role.color }} />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom descriptor & action */}
                <div className="pt-3 border-t border-slate-800/80 mt-auto">
                  <p className="text-[11px] text-slate-400 italic mb-3 line-clamp-2">
                    {role.idealFor}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoleFilter(role.id);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors"
                  >
                    <span>Ver proyectos con este rol</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lead Quote from slide 4 */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Liderazgo real, en equipo
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                El Product Owner o Project Lead no manda: coordina, desbloquea problemas y cuida el ritmo de trabajo.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectRoleFilter('project_lead')}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 underline whitespace-nowrap"
          >
            Ver proyectos que buscan coordinadores
          </button>
        </div>
      </div>
    </section>
  );
};
