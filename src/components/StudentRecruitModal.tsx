import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gamepad2,
  Cpu,
  Palette,
  Music,
  Scroll,
  Dices,
  CheckCircle2,
  ExternalLink,
  Crown,
  Share2,
  Copy,
  Printer
} from 'lucide-react';
import { FounderRecruit } from '../types/flc';

interface StudentRecruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecruit: (recruit: Omit<FounderRecruit, 'id' | 'badgeNumber' | 'createdAt'>) => FounderRecruit;
  totalRecruitsCount: number;
  maxRecruits: number;
  discordInviteUrl: string;
  onOpenPrintPoster?: () => void;
}

const INTEREST_OPTIONS = [
  { id: 'videojuegos', label: 'Programar Videojuegos', icon: Gamepad2, desc: 'Godot, Unity o Python' },
  { id: 'modelado_3d', label: '3D e Impresión 3D', icon: Palette, desc: 'Blender y laminado' },
  { id: 'robotica', label: 'Robótica y Sensores', icon: Cpu, desc: 'Arduino, motores y circuitos' },
  { id: 'musica_sonido', label: 'Música y Efectos SFX', icon: Music, desc: 'Sintetizadores y audio' },
  { id: 'guion_historias', label: 'Guion y Lore', icon: Scroll, desc: 'Tramas, diálogos y mundos' },
  { id: 'juegos_mesa', label: 'Juegos de Mesa', icon: Dices, desc: 'Cartas, miniaturas y tableros' },
];

const GRADE_OPTIONS = [
  '1º ESO',
  '2º ESO',
  '3º ESO',
  '4º ESO',
  '1º Bachillerato',
  '2º Bachillerato',
  'FP Básica',
  'FP Grado Medio',
  'FP Grado Superior',
];

export const StudentRecruitModal: React.FC<StudentRecruitModalProps> = ({
  isOpen,
  onClose,
  onAddRecruit,
  totalRecruitsCount,
  maxRecruits,
  discordInviteUrl,
  onOpenPrintPoster,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [grade, setGrade] = useState('3º ESO');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['videojuegos', 'modelado_3d']);
  const [discordHandle, setDiscordHandle] = useState('');
  const [error, setError] = useState('');
  const [completedRecruit, setCompletedRecruit] = useState<FounderRecruit | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica tu nombre o cómo te conocen en el instituto.');
      return;
    }

    const recruit = onAddRecruit({
      name: name.trim(),
      nickname: nickname.trim() || name.trim().split(' ')[0],
      grade,
      interests: selectedInterests,
      discordHandle: discordHandle.trim() || undefined,
    });

    setCompletedRecruit(recruit);
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(discordInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const remainingSlots = Math.max(0, maxRecruits - totalRecruitsCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedRecruit ? (
          /* Recruitment Step */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Escuadrón Fundador · Temporada 0</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ¡Ficha por el FLC LAB!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rellena esto en 45 segundos para reservar tu puesto entre los{' '}
                <strong className="text-amber-400">{maxRecruits} primeros pioneros</strong> y recibir tu invitación al Discord oficial del laboratorio.
              </p>
            </div>

            {/* Micro Badge Counter */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-300">
                Puestos cubiertos:{' '}
                <strong className="text-amber-400 font-mono font-bold">
                  {totalRecruitsCount} / {maxRecruits}
                </strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                {remainingSlots > 0 ? `¡Quedan ${remainingSlots} plazas!` : 'Lista de espera activa'}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tu Nombre o Apellidos <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Marcos García"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Apodo o Nick Maker (Opcional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej: Marc_3D, PixelGuy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Curso en el IES FLC
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Usuario de Discord (Opcional)
                </label>
                <input
                  type="text"
                  value={discordHandle}
                  onChange={(e) => setDiscordHandle(e.target.value)}
                  placeholder="Ej: marcos_flc o nick#0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Interest Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                ¿Qué te molaría crear o aprender? (Elige al menos 1)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="text-xs font-bold leading-tight">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-transform active:scale-95 shadow-xl shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>¡Reclamar mi Pase de Pionero y Obtener Discord!</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen: Digital Maker Badge + Direct Discord Access */
          <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center font-black shadow-lg shadow-amber-400/30">
              <Crown className="w-8 h-8 fill-slate-950" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                ¡Fichaje Confirmado con Éxito!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¡Bienvenido al Escuadrón, {completedRecruit.nickname}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Ya eres oficialmente uno de los fundadores del FLC LAB en el IES Fernando Lázaro Carreter.
              </p>
            </div>

            {/* Digital Founder Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/50 shadow-2xl max-w-sm mx-auto text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-black text-white leading-none">FLC LAB</div>
                    <div className="text-[9px] text-slate-400">Pase Maker Fundador</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-amber-400 font-black">
                    #{String(completedRecruit.badgeNumber).padStart(3, '0')} / 020
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-lg font-black text-white">{completedRecruit.name}</div>
                <div className="text-xs text-amber-300 font-semibold">
                  «{completedRecruit.nickname}» · {completedRecruit.grade}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>IES F. Lázaro Carreter</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Temporada 0 · Activo
                </span>
              </div>
            </div>

            {/* Giant Discord CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-[#5865F2]/30 flex items-center justify-center gap-3 cursor-pointer group"
              >
                {/* Discord SVG icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Entrar al Servidor de Discord del FLC LAB</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyDiscord}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace de invitación'}</span>
                </button>

                {onOpenPrintPoster && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrintPoster();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver cartel del instituto</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cerrar y seguir explorando la web
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
