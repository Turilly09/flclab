import React, { useState } from 'react';
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
  Zap,
  Coffee,
  Copy,
  Instagram,
  FileText,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { UserProfile } from '../types/flc';

interface StudentRecruitSectionProps {
  totalRecruitsCount: number;
  maxRecruits: number;
  recruits: UserProfile[];
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

  // States for Instagram Caption Copy
  const [copiedCaption, setCopiedCaption] = useState(false);

  const instagramCaptionText = `👾 ¿ABURRIDO DE SOLO JUGAR A VIDEOJUEGOS? VEN AL FLC LAB Y APRENDE A CREARLOS 👾

¿Tienes una idea en la cabeza? En el IES Fernando Lázaro Carreter lanzamos el FLC LAB, un espacio maker 100% libre para aprender haciendo.

💡 ¿Qué puedes crear?
🎮 Videojuegos (Godot)
🤖 Robótica y Sensores (Arduino)
🧊 Diseño e Impresión 3D (Blender)
🎨 Arte Digital y Tableta Gráfica
🎵 Música y Efectos de Sonido
🎲 Juegos de mesa y prototipado físico

❌ SIN exámenes y SIN notas. Aquí el error es parte de la diversión.
📋 Requisitos: Tener todo aprobado (de 1º ESO a 2º Bach y FP) y muchas ganas de crear.

📅 GRAN CITA DE LANZAMIENTO PRESENCIAL:
👉 Miércoles 7 de Octubre, en el Recreo, en el Salón de Actos del IES FLC.

⚡ ¡Las plazas del Escuadrón Fundador están limitadas a solo 20 pioneros! Entra en el enlace de nuestra bio (${window.location.origin}) para darte de alta como alumno y recibir tu pase al Discord privado.

#FLCLab #Utrillas #IESFLC #MakerLab #GameDev #Arduino #Impresion3D #Teruel`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(instagramCaptionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <section className="py-12 sm:py-16 border-b border-slate-800/80 bg-gradient-to-b from-[#090D17] via-[#0E1526] to-[#0A0E1A] relative overflow-hidden">
      {/* Background glow and sparks */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Main Box Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-amber-400/40 shadow-2xl backdrop-blur-md space-y-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Convocatoria Escuadrón Fundador · Temporada 0</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
                BUSCAMOS A LOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400">{maxRecruits} ALUMNOS PIONEROS</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                El <strong className="text-white">FLC LAB</strong> no es una clase más. Es un laboratorio creativo donde puedes dar vida a tus ideas en videojuegos, robótica o impresión 3D. <strong className="text-amber-300">Darse de alta como alumno</strong> es el primer paso para conseguir tu Pase Fundador y el enlace de invitación al Discord privado.
              </p>
            </div>

            {/* Slots Counter Card (Authentic 0/20 count) */}
            <div className="lg:w-80 p-5 rounded-2xl bg-slate-950 border border-amber-400/30 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Alumnos Registrados
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
                  {remainingSlots > 0 ? `¡Quedan ${remainingSlots} plazas libres!` : '¡Lista de espera activa!'}
                </span>
              </div>

              {/* Quick Avatars Preview */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {['🎮', '🤖', '🧊', '🎨', '🎵'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-slate-900 border border-slate-750 flex items-center justify-center text-[10px]"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="truncate max-w-[170px] text-right font-medium text-amber-300">
                  {recruits.length > 0
                    ? `Último alta: ${recruits[recruits.length - 1].name.split(' ')[0]}`
                    : '¡Sé el primero en apuntarte!'}
                </span>
              </div>
            </div>
          </div>

          {/* Core Meeting Info and Official Requirements Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Left: Launch Event Date Details */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white space-y-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-yellow-300 block">
                  📢 Convocatoria de Lanzamiento
                </span>
                <h3 className="text-lg font-black leading-tight">
                  ¿Quieres saber más? ¡Te esperamos en el centro!
                </h3>
              </div>

              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    📅
                  </div>
                  <div>
                    <div className="text-[10px] text-yellow-200 uppercase font-bold">Fecha Oficial</div>
                    <div className="font-extrabold">Miércoles 7 de Octubre</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    ⏰
                  </div>
                  <div>
                    <div className="text-[10px] text-yellow-200 uppercase font-bold">Horario</div>
                    <div className="font-extrabold">En el Recreo</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    📍
                  </div>
                  <div>
                    <div className="text-[10px] text-yellow-200 uppercase font-bold">Lugar</div>
                    <div className="font-extrabold">Salón de Actos del IES FLC</div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-rose-100 leading-relaxed font-medium">
                Resolveremos todas tus dudas, presentaremos herramientas reales, y sortearemos un obsequio maker entre los asistentes de 1º ESO a FP.
              </p>
            </div>

            {/* Right: Requirements matching Instagram Video */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                ¿Quién puede unirse al escuadrón? (Requisitos del Video)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1. TODO APROBADO</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Es obligatorio tener todas las asignaturas aprobadas para asegurar que tu participación es sana y equilibrada.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>2. TODOS LOS NIVELES</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Abierto a estudiantes del instituto desde 1º de la ESO hasta 2º de Bachillerato y Ciclos Formativos de FP.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>3. GANAS DE TRABAJAR</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Lo único que se requiere es curiosidad, interés y una actitud cooperativa para aprender haciendo en equipo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-400">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>4. SIN CONOCIMIENTO PREVIO</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    «No necesitas saber hacerlo todavía». Aquí vienes a explorar, errar libremente y adquirir las destrezas de cero.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs Strip */}
          <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={onOpenRecruitModal}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-all active:scale-95 shadow-xl shadow-amber-400/25 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Darse de Alta como Alumno (45 seg)</span>
              </button>

              <button
                onClick={onOpenPrintPoster}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                title="Ver e imprimir cartel para colgar en los pasillos del centro"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cartel A4 Oficial para el IES</span>
              </button>
            </div>

            {/* Direct Discord Link */}
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#5865F2] transition-colors"
            >
              <span>¿Ya registrado? Abrir Discord directo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Promo Instagram Video Strategy companion block */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-black">
                <Instagram className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Estrategia de Difusión: Vídeo de Instagram</h4>
                <p className="text-[11px] text-slate-400">
                  Potencia el impacto de tu reel/video integrando esta llamada a la acción en tus redes sociales
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCaption}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                copiedCaption
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCaption ? '¡Copiado!' : 'Copiar Texto para Publicar (Instagram)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-400 leading-relaxed">
            <div className="lg:col-span-4 space-y-2">
              <div className="text-[10px] font-black uppercase text-pink-400">¿Cómo usar tu Vídeo?</div>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Enlace en la Bio:</strong> Coloca la dirección de esta web en el perfil de Instagram del instituto.
                </li>
                <li>
                  <strong>Sticker de Enlace:</strong> Sube el vídeo como Story de Instagram con un sticker directo al formulario de fichaje.
                </li>
                <li>
                  <strong>Tácticas del recreo:</strong> Pon el cartel A4 con el código QR en las puertas del salón de actos y biblioteca.
                </li>
              </ul>
            </div>

            <div className="lg:col-span-8 bg-slate-900/60 p-4 rounded-xl border border-slate-900/80 font-mono text-[10px] overflow-x-auto max-h-32 text-slate-300">
              <pre className="whitespace-pre-wrap">{instagramCaptionText}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
