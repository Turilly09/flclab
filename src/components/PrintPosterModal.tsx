import React, { useEffect, useState } from 'react';
import { X, Printer, Crown, QrCode, Sparkles, CheckCircle2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface PrintPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  discordInviteUrl: string;
}

export const PrintPosterModal: React.FC<PrintPosterModalProps> = ({
  isOpen,
  onClose,
  discordInviteUrl,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://flclab.es';

  useEffect(() => {
    if (!isOpen) return;
    // Generate high resolution crisp QR Code for the poster pointing to the website landing
    QRCode.toDataURL(appUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR Code', err));
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-6 space-y-4 my-auto">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cartel Oficial para el Instituto (A4)</h3>
              <p className="text-[11px] text-slate-400">
                Diseño oficial de la convocatoria para pasillos, aulas y tablón del IES
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-amber-400/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Cartel A4</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Sheet (Matches the exact reel graphics from user's video) */}
        <div
          id="printable-poster"
          className="bg-[#0B0F19] text-white p-6 sm:p-7 rounded-2xl shadow-2xl border-4 border-amber-400 max-w-lg mx-auto space-y-4 print:border-none print:shadow-none print:m-0 print:p-4 print:bg-white print:text-slate-950"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-amber-400/40 print:border-slate-950 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center font-black text-xl shadow-md">
                ⚡
              </div>
              <div>
                <div className="font-black text-xl tracking-tight text-white print:text-slate-950 leading-none">
                  FLC <span className="text-amber-400 print:text-amber-600">LAB</span>
                </div>
                <div className="text-[10px] font-extrabold text-amber-300 print:text-slate-700 uppercase tracking-widest">
                  Laboratorio de Creación
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-800 print:bg-slate-100 border border-slate-700 print:border-slate-900 rounded text-slate-300 print:text-slate-900">
                IES F. Lázaro Carreter · Utrillas
              </span>
            </div>
          </div>

          {/* Main Comic Title from Reel */}
          <div className="text-center space-y-1 py-1">
            <div className="inline-block bg-amber-400 text-slate-950 px-3 py-0.5 text-xs font-black uppercase tracking-wider rounded-md shadow-sm">
              ¿TIENES UNA IDEA?
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white print:text-slate-950 leading-tight">
              ¿QUÉ PUEDES CREAR?
            </h1>
          </div>

          {/* Disciplines Colorful Tags matching video */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-black text-slate-950">
            <div className="bg-[#EF4444] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🎮</span>
              <span className="text-white text-[11px]">VIDEOJUEGOS</span>
            </div>
            <div className="bg-[#F59E0B] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🤖</span>
              <span className="text-slate-950 text-[11px]">ROBÓTICA</span>
            </div>
            <div className="bg-[#06B6D4] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🧊</span>
              <span className="text-slate-950 text-[11px]">DISEÑO 3D</span>
            </div>
            <div className="bg-[#A855F7] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🎨</span>
              <span className="text-white text-[11px]">ARTE DIGITAL</span>
            </div>
            <div className="bg-[#10B981] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🎵</span>
              <span className="text-white text-[11px]">MÚSICA & SFX</span>
            </div>
            <div className="bg-[#F97316] p-1.5 rounded-lg flex items-center gap-1.5 justify-center shadow-sm">
              <span>🎲</span>
              <span className="text-white text-[11px]">JUEGOS DE MESA</span>
            </div>
          </div>

          {/* Reel Quote: No necesitas saber hacerlo todavía */}
          <div className="p-2.5 rounded-xl bg-amber-400/15 print:bg-slate-100 border border-amber-400/40 print:border-slate-400 text-center space-y-0.5">
            <div className="text-xs font-black text-amber-300 print:text-slate-950 uppercase tracking-tight">
              «NO NECESITAS SABER HACERLO TODAVÍA»
            </div>
            <p className="text-[11px] text-slate-300 print:text-slate-700 font-medium">
              Aquí aprenderás pensando, probando y trabajando en equipo. <strong>Cero exámenes y cero notas.</strong>
            </p>
          </div>

          {/* 3 Conditions Box directly from video */}
          <div className="p-3 rounded-xl bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1.5 text-xs">
            <div className="text-[10px] font-black uppercase text-amber-400 print:text-amber-700 tracking-wider">
              ¿Quién puede participar?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✅</span>
                <span className="text-slate-200 print:text-slate-800 leading-tight">
                  <strong>Todo Aprobado:</strong> Obligatorio tener todas aprobadas.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold shrink-0">👥</span>
                <span className="text-slate-200 print:text-slate-800 leading-tight">
                  <strong>Todos los Niveles:</strong> 1º ESO a 2º Bach y Ciclos FP.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">💡</span>
                <span className="text-slate-200 print:text-slate-800 leading-tight">
                  <strong>Ganas de Crear:</strong> Curiosidad, interés y motivación.
                </span>
              </div>
            </div>
          </div>

          {/* Meeting Invitation Box (Miércoles 7 Octubre) */}
          <div className="p-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 print:from-slate-900 print:to-slate-900 text-white rounded-xl text-center space-y-1 shadow-md">
            <div className="text-[10px] font-black tracking-widest uppercase text-yellow-300">
              ¿QUIERES SABER MÁS? ¡TE ESPERAMOS!
            </div>
            <div className="flex items-center justify-around gap-2 text-xs font-black pt-0.5">
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>MIÉRCOLES 7 OCTUBRE</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⏰</span>
                <span>RECREO</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>SALÓN DE ACTOS</span>
              </div>
            </div>
          </div>

          {/* QR Scan Section */}
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-400 rounded-xl">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase text-amber-400 print:text-slate-950">
                O ESCANEA EL QR Y FICHÁ YA (DISCORD)
              </div>
              <p className="text-[10px] text-slate-300 print:text-slate-700 leading-tight">
                Solo <strong>20 plazas disponibles</strong> para el Escuadrón Fundador. Reserva tu puesto desde el móvil.
              </p>
              <div className="text-[9px] font-mono text-slate-400 print:text-slate-800 font-bold">
                {appUrl}
              </div>
            </div>

            <div className="shrink-0 bg-white p-1.5 border-2 border-amber-400 print:border-slate-950 rounded-lg shadow-md">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR FLC LAB" className="w-20 h-20 sm:w-22 sm:h-22 object-contain" />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center text-[10px] text-slate-950">QR...</div>
              )}
            </div>
          </div>

          {/* Cutout Pull-Tabs for Hallway Notice Boards */}
          <div className="pt-2 border-t-2 border-dashed border-slate-700 print:border-slate-400">
            <div className="text-[8px] uppercase tracking-wider text-center text-slate-400 print:text-slate-600 font-bold mb-1">
              ✂️ Tiras recortables para arrancar del corcho del instituto ✂️
            </div>
            <div className="grid grid-cols-6 gap-1 text-[7px] font-mono text-center font-bold text-slate-300 print:text-slate-900">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="p-1 border border-dashed border-slate-600 print:border-slate-400 rounded flex flex-col items-center justify-center">
                  <span>⚡ FLC LAB</span>
                  <span className="text-[6px] text-amber-400 print:text-amber-800">7 Oct Recreo</span>
                  <span className="text-[6px]">20 Plazas</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
