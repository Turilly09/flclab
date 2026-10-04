import React, { useState } from 'react';
import {
  Lightbulb,
  Users2,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Cpu,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface StudentJourneySectionProps {
  onOpenQuiz: () => void;
  onExploreProjects: () => void;
  onProposeProject?: () => void;
  onExploreCalendar?: () => void;
  onScrollToPartners?: () => void;
}

export const StudentJourneySection: React.FC<StudentJourneySectionProps> = ({
  onOpenQuiz,
  onExploreProjects,
  onProposeProject,
  onExploreCalendar,
  onScrollToPartners,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      tag: 'El Origen',
      title: 'Tú Traes la Idea',
      subtitle: 'Tú eres el creador, no un espectador',
      icon: Lightbulb,
      color: '#F59E0B', // amber-500
      glowColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-amber-400/50',
      tagBg: 'bg-amber-400/20 text-amber-300',
      description:
        '¿Tienes un videojuego en mente, una historia de cómic, un invento con sensores o un juego de mesa? En el FLC LAB no hay deberes ni temarios rígidos. Vienes a proponer lo que a ti te ilusiona crear.',
      features: [
        'Libertad creativa total para elegir tu temática',
        'Desde prototipos rápidos de papel hasta proyectos digitales',
        'Validación de ideas con retroalimentación constructiva',
      ],
      ctaText: 'Ver proyectos o proponer idea',
      action: onProposeProject || onExploreProjects,
      actionIcon: Sparkles,
    },
    {
      step: 2,
      tag: 'La Comunidad',
      title: 'Encuentras tu Equipo',
      subtitle: 'Nadie tiene que hacerlo todo solo',
      icon: Users2,
      color: '#06B6D4', // cyan-500
      glowColor: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'border-cyan-400/50',
      tagBg: 'bg-cyan-400/20 text-cyan-300',
      description:
        '¿Se te da bien ilustrar pero no sabes programar? ¿Escribes historias pero necesitas modelado 3D? Aquí te agrupamos con otros alumnos del instituto que se complementan contigo para formar un escuadrón real.',
      features: [
        '8 roles especializados: programación, arte, guión, diseño...',
        'Conexión entre cursos (1º ESO a 2º Bach y FP)',
        'Canales privados de Discord para organizar vuestro trabajo',
      ],
      ctaText: 'Descubre tu Rol Ideal (Test)',
      action: onOpenQuiz,
      actionIcon: ArrowRight,
    },
    {
      step: 3,
      tag: 'La Fábrica',
      title: 'Tienes las Herramientas',
      subtitle: 'Tecnología profesional sin coste para ti',
      icon: Wrench,
      color: '#10B981', // emerald-500
      glowColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'border-emerald-400/50',
      tagBg: 'bg-emerald-400/20 text-emerald-300',
      description:
        'El laboratorio cuenta con un espacio físico dotado de ordenadores de desarrollo, software profesional (Godot, Unity, Blender), impresoras 3D, componentes de electrónica y materiales de prototipado físico.',
      features: [
        'Impresión 3D y corte de piezas mecánicas',
        'PCs para modelado 3D, arte digital y desarrollo de código',
        'Talleres presenciales en recreos y tardes guiadas',
      ],
      ctaText: 'Consultar Calendario de Talleres',
      action: onExploreCalendar || onExploreProjects,
      actionIcon: Layers,
    },
    {
      step: 4,
      tag: 'La Red',
      title: 'Una Red te Respalda',
      subtitle: 'Acompañamiento cercano sin exámenes ni notas',
      icon: ShieldCheck,
      color: '#A855F7', // purple-500
      glowColor: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'border-purple-400/50',
      tagBg: 'bg-purple-400/20 text-purple-300',
      description:
        'No estás solo ante la pantalla. Profesores mentores te ayudan a desatascar problemas, las familias respaldan la iniciativa y profesionales de empresas colaboradoras vienen a dar charlas, mentorías y feedback real.',
      features: [
        'Docentes mentores que resuelven dudas técnicas',
        'Familias y AMPA volcadas en la logística y apoyo',
        'Visitas y retos de empresas de tecnología y videojuegos',
      ],
      ctaText: 'Conocer a la Red de Apoyo',
      action: onScrollToPartners || onExploreProjects,
      actionIcon: HeartHandshake,
    },
  ];

  const current = steps.find((s) => s.step === activeStep) || steps[0];

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#0A0E1A] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] blur-[140px] pointer-events-none rounded-full transition-colors duration-500"
        style={{ backgroundColor: current.glowColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cómo Funciona FLC LAB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            DE TU IDEA A LA REALIDAD{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400">
              EN 4 PASOS
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Sin rollos académicos ni exámenes: así es como pasamos de una idea en tu cabeza a un
            proyecto terminado que puedes tocar, jugar y enseñar a todos.
          </p>
        </div>

        {/* 4 Steps Interactive Navigation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s) => {
            const isSelected = activeStep === s.step;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `bg-slate-900 ${s.borderColor} shadow-xl scale-[1.02] ring-1 ring-white/10`
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 transition-transform"
                  style={{
                    backgroundColor: `${s.color}25`,
                    color: s.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-0.5">
                    <span>Paso {s.step}</span>
                    <span aria-hidden="true">·</span>
                    <span style={{ color: s.color }}>{s.tag}</span>
                  </div>
                  <div className="font-black text-sm text-white truncate">{s.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{s.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Highlight Card for Selected Step */}
        <div className="relative rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Subtle top indicator bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
            style={{ backgroundColor: current.color }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2.5">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: `${current.color}25`,
                    color: current.color,
                  }}
                >
                  Paso 0{current.step} · {current.tag}
                </span>
                <span className="text-xs text-slate-400">{current.subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {current.description}
              </p>

              {/* Bullet Features */}
              <div className="space-y-2.5 pt-1">
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: current.color }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={current.action}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: current.color,
                    color: '#0B0F19',
                  }}
                >
                  <current.actionIcon className="w-4 h-4" />
                  <span>{current.ctaText}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual / Graphic Column */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Lo que tú aportas vs Lo que recibes
                  </div>
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: current.color }} />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-amber-300 mb-1">Tu compromiso:</div>
                    <div className="text-slate-300">
                      Ganas de aprender, curiosidad y compromiso de equipo. Cero notas, solo pasión maker.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-emerald-400 mb-1">Lo que el LAB te da:</div>
                    <div className="text-slate-300">
                      Taller equipado, materiales financiados, compañeros afines y mentores con experiencia.
                    </div>
                  </div>
                </div>

                {/* Step indicator footer */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 font-mono">
                  <span>FLC LAB · Utrillas</span>
                  <span>Fase {current.step} de 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
