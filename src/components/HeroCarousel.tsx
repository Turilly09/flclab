import React, { useState, useEffect, useRef } from 'react';
import { HeroCarouselSlide } from '../types/flc';
import { ASSET_IMAGES } from '../data/flcInitialData';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit3,
  X,
  Check,
  RotateCcw,
  Image as ImageIcon,
  ArrowRight,
  Layers,
  Calendar,
  Compass,
  HeartHandshake
} from 'lucide-react';

interface HeroCarouselProps {
  slides: HeroCarouselSlide[];
  onUpdateSlide: (slide: HeroCarouselSlide) => void;
  onResetSlides?: () => void;
  isAdmin?: boolean;
  onNavigateTab: (tab: string) => void;
}

const PRESET_IMAGES = [
  { name: 'Aula Maker & Laboratorio', url: ASSET_IMAGES.hero },
  { name: 'Videojuegos, Arte & Animación', url: ASSET_IMAGES.game },
  { name: 'Robótica, Circuitos & 3D', url: ASSET_IMAGES.robotics },
  { name: 'Juegos de Mesa & Artesanía', url: ASSET_IMAGES.boardgame },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  onUpdateSlide,
  onResetSlides,
  isAdmin = false,
  onNavigateTab,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Slide being edited in modal
  const [editingSlide, setEditingSlide] = useState<HeroCarouselSlide | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  // Auto-advance every 6s unless paused or modal is open
  useEffect(() => {
    if (isPaused || isEditModalOpen || total <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, isEditModalOpen, total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleOpenEdit = () => {
    if (currentSlide) {
      setEditingSlide({ ...currentSlide });
      setCustomUrlInput(currentSlide.imageUrl);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    const updated: HeroCarouselSlide = {
      ...editingSlide,
      imageUrl: customUrlInput.trim() || editingSlide.imageUrl,
    };
    onUpdateSlide(updated);
    setIsEditModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomUrlInput(reader.result);
          if (editingSlide) {
            setEditingSlide({ ...editingSlide, imageUrl: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getSlideIcon = (linkTab?: string) => {
    switch (linkTab) {
      case 'proyectos':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'calendario':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'colaboraciones':
        return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      default:
        return <Compass className="w-4 h-4 text-amber-400" />;
    }
  };

  if (!currentSlide) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-900 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slide Image with Crossfade */}
      <div className="relative w-full h-[400px] sm:h-[460px] overflow-hidden">
        <img
          key={currentSlide.id + currentSlide.imageUrl}
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Dark Gradient Overlays for high readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/30" />

        {/* Top Floating Bar: Category Pill & Slide Counter & Admin Edit Button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg">
            {getSlideIcon(currentSlide.linkTab)}
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {currentSlide.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Slide Index Counter */}
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300">
              {currentIndex + 1} / {total}
            </span>

            {/* Admin Edit Trigger */}
            {isAdmin && (
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Editar imagen y texto de esta diapositiva (Solo Administrador)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar Carrusel</span>
                <span className="sm:hidden">Editar</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Content Card */}
        <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-4 sm:p-5 shadow-2xl transition-all text-center sm:text-left flex flex-col items-center sm:items-start">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug mb-1.5 flex items-center justify-center sm:justify-start gap-2">
              <span>{currentSlide.title}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {currentSlide.description}
            </p>

            {currentSlide.subtext && (
              <div className="mt-2 text-[11px] text-amber-300/90 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{currentSlide.subtext}</span>
              </div>
            )}

            {/* Slide Action Button & Indicators */}
            <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 w-full">
              {currentSlide.linkTab && currentSlide.actionLabel ? (
                <button
                  onClick={() => onNavigateTab(currentSlide.linkTab!)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-bold border border-amber-400/40 transition-colors cursor-pointer group/btn"
                >
                  <span>{currentSlide.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <div />
              )}

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Anterior diapositiva"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Siguiente diapositiva"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-amber-400 shadow-sm shadow-amber-400'
                    : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Ir a diapositiva ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isEditModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Editar Diapositiva del Carrusel</h3>
                  <p className="text-xs text-slate-400">Panel exclusivo de Administración FLC</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Selector tab strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setEditingSlide({ ...s });
                    setCustomUrlInput(s.imageUrl);
                    setCurrentIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
                    editingSlide.id === s.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  #{idx + 1} {s.tag}
                </button>
              ))}
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
              {/* Tag / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Etiqueta / Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.tag}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, tag: e.target.value })
                  }
                  placeholder="Ej: Metodología Maker, Próxima Sesión..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Título de la Diapositiva *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, title: e.target.value })
                  }
                  placeholder="Ej: 6 Fases: De la Idea a la Realidad"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Descripción o Resumen *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.description}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, description: e.target.value })
                  }
                  placeholder="Explica qué se muestra en este resumen..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Texto Complementario / Horario / Contexto (Opcional)
                </label>
                <input
                  type="text"
                  value={editingSlide.subtext || ''}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subtext: e.target.value })
                  }
                  placeholder="Ej: Jueves 16:30 - 18:30 · Aula Maker FLC"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Selection */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-amber-300">
                  🖼️ Imagen de Fondo de la Diapositiva
                </label>

                {/* Presets Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomUrlInput(preset.url);
                        setEditingSlide({ ...editingSlide, imageUrl: preset.url });
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        customUrlInput === preset.url
                          ? 'border-amber-400 bg-amber-400/15 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-8 rounded object-cover shrink-0"
                      />
                      <span className="text-[11px] font-semibold truncate leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom URL or upload file */}
                <div className="pt-2 space-y-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">O pegar URL personalizada:</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Subir archivo local
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => {
                      setCustomUrlInput(e.target.value);
                      setEditingSlide({ ...editingSlide, imageUrl: e.target.value });
                    }}
                    placeholder="https://... o ruta de imagen"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Navigation Action Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Pestaña de Destino al pulsar botón
                  </label>
                  <select
                    value={editingSlide.linkTab || 'proyectos'}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        linkTab: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="proyectos">Proyectos & Fases</option>
                    <option value="calendario">Calendario & Talleres</option>
                    <option value="colaboraciones">Comunidad & Colaboraciones</option>
                    <option value="inicio">Manifiesto & Roles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Texto del Botón de Acción
                  </label>
                  <input
                    type="text"
                    value={editingSlide.actionLabel || ''}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        actionLabel: e.target.value,
                      })
                    }
                    placeholder="Ej: Ver las 6 Fases, Ver Calendario..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {onResetSlides && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Deseas restaurar todas las diapositivas a los valores originales?')) {
                        onResetSlides();
                        setIsEditModalOpen(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Diapositivas</span>
                  </button>
                )}

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-400/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
