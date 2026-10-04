import React from 'react';
import {
  Sparkles,
  Crown,
  Gamepad2,
  Cpu,
  Palette,
  Music,
  Users,
  Printer,
  ArrowRight,
  Flame,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Zap,
  Coffee
} from 'lucide-react';
import { FounderRecruit } from '../types/flc';

interface StudentRecruitSectionProps {
  totalRecruitsCount: number;
  maxRecruits: number;
  recruits: FounderRecruit[];
  onOpenRecruitModal: () => void;
  onOpenPrintPoster: () => void;
  discordInviteUrl: string;
}

export const StudentRecruitSection: React.FC<StudentRecruitSectionProps> = ({
  totalRecruitsCount,
  maxRecruits,
  recruits,
  onOpenRecruitModal,
  onOpenPrintPoster,
  discordInviteUrl,
}) => {
  const percentage = Math.min(100, Math.round((totalRecruitsCount / maxRecruits) * 100));
  const remainingSlots = Math.max(0, maxRecruits - totalRecruitsCount);

  return (
    <section className="py-12 sm:py-16 border-b border-slate-800/90 bg-gradient-to-b from-[#090D17] via-[#0E1526] to-[#0A0E1A] relative overflow-hidden">
      {/* Background glow and sparks */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Main Box Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-amber-400/50 shadow-2xl backdrop-blur-md space-y-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-black text-xs uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Convocatoria de Inicio · Temporada 0</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                BUSCAMOS A LOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400">{maxRecruits} PIONEROS</span> DEL LAB
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                El <strong className="text-white">FLC LAB</strong> es el espacio donde los alumnos del IES Fernando Lázaro Carreter aprendemos a crear videojuegos, imprimir en 3D y fabricar robots. Coordinamos los proyectos a través de nuestro <strong className="text-amber-300">Discord privado</strong>.
              </p>
            </div>

            {/* Slots Counter Card */}
            <div className="lg:w-80 p-5 rounded-2xl bg-slate-950 border border-amber-400/30 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Plazas de Fundador
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-black text-xs">
                  {totalRecruitsCount} / {maxRecruits}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 shadow-sm shadow-amber-400/50"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">{percentage}% asignado</span>
                <span className="font-bold text-emerald-400">
                  {remainingSlots > 0 ? `¡Solo quedan ${remainingSlots} vacantes!` : '¡Plazas completadas!'}
                </span>
              </div>

              {/* Quick Avatars Preview */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {['⚡', '🎮', '🎨', '🤖', '🎵'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="truncate max-w-[170px] text-right font-medium">
                  {recruits.length > 0 ? `Último: ${recruits[0].nickname}` : 'Primeras incorporaciones'}
                </span>
              </div>
            </div>
          </div>

          {/* The 4 Sacred Maker Rules Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              ¿Por qué entrar al FLC LAB? (Las 4 Reglas Sagradas)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Rule 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-black">
                  ❌
                </div>
                <h4 className="text-sm font-bold text-white">Cero Exámenes y Notas</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aquí no se viene a memorizar ni a hacer deberes. Si algo no funciona a la primera, lo llamamos <em>prototipo</em> y seguimos.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-black">
                  🎮
                </div>
                <h4 className="text-sm font-bold text-white">Proyectos que Tú Eliges</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ¿Quieres crear un videojuego de terror en Godot, una figura 3D o un robot? Tú decides qué quieres construir.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
                  🖨️
                </div>
                <h4 className="text-sm font-bold text-white">Hardware Real Gratis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Impresoras 3D, ordenadores con buenas gráficas, placas Arduino, sensores y cortadoras para materializar tus ideas.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#5865F2]/15 text-[#5865F2] flex items-center justify-center font-black">
                  🍕
                </div>
                <h4 className="text-sm font-bold text-white">Discord + Buen Rollo</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Canales por rol (`#game-dev`, `#3d`, `#sonido`) para compartir memes, dudas, avances y merendar juntos en el taller.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs Strip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenRecruitModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-transform active:scale-95 shadow-xl shadow-amber-400/25 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>¡Fichar por el Escuadrón Fundador! (45 seg)</span>
              </button>

              <button
                onClick={onOpenPrintPoster}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                title="Ver e imprimir cartel para colgar en los pasillos del centro"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cartel con QR para el Instituto</span>
              </button>
            </div>

            {/* Direct Discord Link */}
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#5865F2] transition-colors"
            >
              <span>¿Ya tienes tu pase? Abrir servidor de Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
