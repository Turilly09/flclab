import React from 'react';
import { Crown, Mail, School, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCollab: () => void;
  onOpenQuiz: () => void;
  onDownloadPdf: () => void;
  onUploadPdf?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCollab, onOpenQuiz, onDownloadPdf, onUploadPdf }) => {
  return (
    <footer className="bg-[#070A12] border-t border-slate-800 text-slate-400 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between text-center md:text-left">
          {/* Brand & Slogan from Slide 9 */}
          <div className="md:col-span-6 space-y-3 flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Crown className="w-4 h-4 fill-slate-950" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                FLC <span className="text-amber-400">LAB</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">· Laboratorio de Creación</span>
            </div>

            <p className="text-sm text-slate-300 font-medium max-w-md mx-auto md:mx-0">
              «Ideas de hoy, mundos de mañana. No es una clase: es un laboratorio para construir,
              diseñar y compartir en comunidad.»
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 pt-1">
              <School className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>IES Fernando Lázaro Carreter · Utrillas (Teruel, Aragón)</span>
            </div>
          </div>

          {/* Contact Box from Slide 9 */}
          <div className="md:col-span-6 flex flex-col items-center md:items-end space-y-3 text-center md:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Canal de Comunicación Directo
            </span>
            <a
              href="mailto:flclab@iesutrillas.es"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-slate-800 hover:border-amber-400 transition-all font-mono font-bold text-sm shadow-md"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>flclab@iesutrillas.es</span>
            </a>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-slate-400">
              <button
                onClick={onDownloadPdf}
                className="hover:text-amber-300 text-amber-400/90 font-semibold transition-colors cursor-pointer"
              >
                Descargar Dossier (PDF)
              </button>
              <span>·</span>
              <button onClick={onOpenQuiz} className="hover:text-amber-300 transition-colors cursor-pointer">
                Test de Roles
              </button>
              <span>·</span>
              <button onClick={onOpenCollab} className="hover:text-amber-300 transition-colors cursor-pointer">
                Formulario de Colaboración
              </button>
              {onUploadPdf && (
                <>
                  <span>·</span>
                  <button
                    onClick={onUploadPdf}
                    className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                    title="Vincular el archivo PDF original de tu ordenador"
                  >
                    Vincular PDF original
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} FLC LAB · IES Fernando Lázaro Carreter. Proyecto Educativo Maker.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Aprender · Iterar · Seguir Mejorando</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};
