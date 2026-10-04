import React, { useState } from 'react';
import { RoleId } from '../types/flc';
import { ROLES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import { X, Sparkles, ArrowRight, RotateCcw, Crown } from 'lucide-react';

interface RoleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleFilter: (roleId: RoleId) => void;
}

interface Question {
  text: string;
  options: {
    text: string;
    role: RoleId;
  }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    text: '1. Cuando estás con amigos o en clase y tienes tiempo libre, ¿qué te apetece más hacer?',
    options: [
      { text: 'Imaginar historias, reglas de juegos, acertijos o mecánicas locas', role: 'diseno' },
      { text: 'Trastear con el ordenador, código, scripts, mods o componentes electrónicos', role: 'tecnologia' },
      { text: 'Dibujar en libreta o tablet, crear personajes, logotipos o modelar', role: 'arte' },
      { text: 'Tocar música, mezclar canciones, probar micrófonos o efectos sonoros', role: 'audio' },
      { text: 'Montar cosas con las manos, imprimir en 3D, cortar madera o maquetar', role: 'produccion' },
      { text: 'Organizar planes, coordinar quién trae qué y fijar los horarios', role: 'project_lead' },
    ],
  },
  {
    text: '2. En un proyecto en grupo, ¿cuál suele ser tu mayor superpoder?',
    options: [
      { text: 'Descubrir fallos, errores raros y proponer cómo hacer la experiencia más justa', role: 'qa' },
      { text: 'Explicar las cosas en público, diseñar la presentación o grabar un vídeo', role: 'comunicacion' },
      { text: 'Desbloquear a los compañeros y conseguir que todos remen en la misma dirección', role: 'project_lead' },
      { text: 'Construir la solución técnica que hace que las cosas realmente funcionen', role: 'tecnologia' },
      { text: 'Hacer que todo se vea visualmente impresionante e inspirador', role: 'arte' },
      { text: 'Crear la atmósfera y el ambiente sonoro perfecto para la emoción', role: 'audio' },
    ],
  },
  {
    text: '3. Si el proyecto fuera un videojuego o un robot, ¿qué momento te daría mayor satisfacción?',
    options: [
      { text: 'Ver cómo los jugadores entienden la jugabilidad y se divierten sin atascarse', role: 'diseno' },
      { text: 'Ver que el robot o el motor de código compila a la perfección sin un solo bug', role: 'tecnologia' },
      { text: 'Tener la pieza física recién salida de la impresora 3D montada en las manos', role: 'produccion' },
      { text: 'Ver la portada, la cinemática o el cartel expuesto en el pasillo del centro', role: 'comunicacion' },
      { text: 'Saber que detectamos a tiempo un error crítico antes de la feria final', role: 'qa' },
      { text: 'Subir al escenario con todo el equipo unido a celebrar el resultado', role: 'project_lead' },
    ],
  },
];

export const RoleQuizModal: React.FC<RoleQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectRoleFilter,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<RoleId[]>([]);
  const [resultRole, setResultRole] = useState<RoleId | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (role: RoleId) => {
    const nextAnswers = [...answers, role];
    setAnswers(nextAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate top role
      const counts: Partial<Record<RoleId, number>> = {};
      nextAnswers.forEach((r) => {
        counts[r] = (counts[r] || 0) + 1;
      });

      let topRole = nextAnswers[nextAnswers.length - 1];
      let maxCount = 0;
      Object.entries(counts).forEach(([r, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topRole = r as RoleId;
        }
      });

      setResultRole(topRole);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultRole(null);
  };

  const roleData = resultRole ? ROLES.find((r) => r.id === resultRole) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Test Rápido: Tu Rol en FLC LAB</h2>
              <p className="text-xs text-slate-400">Descubre dónde brilla tu talento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!resultRole ? (
          <div className="space-y-6">
            {/* Step progress */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pregunta {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
              <span>Paso {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">
              {QUIZ_QUESTIONS[currentStep].text}
            </h3>

            <div className="space-y-2.5">
              {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.role)}
                  className="w-full p-3.5 rounded-xl text-left bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/80 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-lg"
              style={{
                backgroundColor: `${roleData?.color || '#FACC15'}25`,
                color: roleData?.color || '#FACC15',
              }}
            >
              <DynamicIcon name={roleData?.iconName || 'Crown'} className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Tu Rol Recomendado es:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {roleData?.name}
              </h3>
              <p className="text-sm font-semibold text-slate-300 mt-1">
                {roleData?.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-left">
              {roleData?.idealFor}
            </p>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Tus tareas típicas en el Lab:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roleData?.tasks.map((task, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200"
                  >
                    ✓ {task}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir Test</span>
              </button>

              <button
                onClick={() => {
                  onSelectRoleFilter(resultRole);
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-transform active:scale-95 shadow-md shadow-amber-400/20"
              >
                <span>Ver Proyectos que buscan {roleData?.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
