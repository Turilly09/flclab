import React from 'react';
import { REQUIREMENTS, COMMUNITY_ACTORS } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import { UserCheck, Users, HeartHandshake, ArrowRight, ShieldCheck, Mail, UserPlus } from 'lucide-react';
import { UserProfile } from '../types/flc';

interface CommunitySectionProps {
  onOpenCollabModal: () => void;
  currentUser?: UserProfile | null;
  onOpenRegisterUser?: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  onOpenCollabModal,
  currentUser,
  onOpenRegisterUser,
}) => {
  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Sub-block 1: Slide 6 Requisitos y Criterios */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Criterios de Participación
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              ¿QUIÉN PUEDE PARTICIPAR?
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg">
              Un proyecto abierto, inclusivo y enfocado en el crecimiento personal y creativo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {REQUIREMENTS.map((req, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${req.color}20`,
                      color: req.color,
                    }}
                  >
                    <DynamicIcon name={req.icon} className="w-5 h-5" />
                  </div>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      backgroundColor: `${req.color}15`,
                      color: req.color,
                    }}
                  >
                    {req.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{req.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-block 2: Slide 7 Toda la Comunidad Educativa */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                <HeartHandshake className="w-3.5 h-3.5" />
                Comunidad Educativa en Red
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                UN LABORATORIO PARA TODO EL ENTORNO
              </h3>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
                Alumnos, profesores de cualquier departamento, familias y empresas de las Cuencas Mineras
                colaboran en pie de igualdad.
              </p>
            </div>

            {currentUser ? (
              <button
                onClick={onOpenCollabModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md self-start md:self-auto cursor-pointer"
              >
                <span>Quiero Colaborar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenRegisterUser}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md self-start md:self-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Darse de Alta para Colaborar</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMUNITY_ACTORS.map((actor, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-white">{actor.role}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: actor.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-amber-300/90 block mb-2">
                    {actor.scope}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{actor.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Banner from Slide 9 */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                ¿Preguntas? ¿Ideas? ¿Quieres sumar a tu empresa o asociación?
              </span>
              <h4 className="text-2xl font-black text-white">
                Contacta directamente con la coordinación del FLC LAB
              </h4>
              <p className="text-sm text-slate-300">
                Estamos abiertos a donación de componentes, mentorías profesionales y visitas didácticas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:flclab@iesutrillas.es"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 border border-amber-400/80 hover:border-amber-400 text-amber-300 hover:text-white font-mono font-bold text-sm transition-colors shadow"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>flclab@iesutrillas.es</span>
              </a>
              {currentUser ? (
                <button
                  onClick={onOpenCollabModal}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow cursor-pointer"
                >
                  <span>Enviar Solicitud</span>
                </button>
              ) : (
                <button
                  onClick={onOpenRegisterUser}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow cursor-pointer"
                >
                  <span>Darse de Alta para Sumarte</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
