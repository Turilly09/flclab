import React from 'react';
import { Sparkles, Mail, Hammer, X, Clock, CheckCircle } from 'lucide-react';

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle?: string;
}

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
  isOpen,
  onClose,
  actionTitle = 'esta función',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-5 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Badge */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black shadow-lg mb-3">
            <Hammer className="w-8 h-8 animate-pulse text-amber-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            En Fase de Preparación
          </div>
        </div>

        {/* Title & Headline */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ¡Estamos en Construcción!
          </h3>
          <p className="text-sm font-bold text-amber-300/90 mt-1">
            IES Fernando Lázaro Carreter · FLC LAB
          </p>
        </div>

        {/* Explanatory text requested by user */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-xl border border-slate-800 text-left space-y-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Estamos ultimando el acondicionamiento del laboratorio, los materiales y la plataforma para {actionTitle}.
          </p>
          <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-200">
              <strong className="text-white">En unas semanas</strong> abriremos oficialmente el plazo para que alumnado, profesorado, familias y entidades podáis daros de alta, registrar equipos e inscribiros en las sesiones.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Si tienes una propuesta urgente o deseas más información antes del arranque, escríbenos directamente a la coordinación:
          </p>
          <a
            href="mailto:flclab@iesutrillas.es?subject=Inter%C3%A9s%20en%20FLC%20LAB%20-%20IES%20Fernando%20L%C3%A1zaro%20Carreter"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>flclab@iesutrillas.es</span>
          </a>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-transform active:scale-95 shadow-lg shadow-amber-400/25"
          >
            Entendido, ¡estaré atento a la apertura!
          </button>
        </div>
      </div>
    </div>
  );
};
