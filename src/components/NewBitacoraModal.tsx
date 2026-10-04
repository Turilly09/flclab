import React, { useState } from 'react';
import { Project, RoleId, ProjectPhase, UserProfile, BitacoraEntry } from '../types/flc';
import { ROLES, PHASES, ASSET_IMAGES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import { X, BookOpen, Sparkles, Image as ImageIcon, Tag, Lightbulb, CheckCircle2 } from 'lucide-react';

interface NewBitacoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetProjectId?: string;
  projects: Project[];
  currentUser?: UserProfile | null;
  onSubmit: (entry: Omit<BitacoraEntry, 'id' | 'applauseCount' | 'hasApplauded'>) => void;
}

export const NewBitacoraModal: React.FC<NewBitacoraModalProps> = ({
  isOpen,
  onClose,
  presetProjectId,
  projects,
  currentUser,
  onSubmit,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    presetProjectId || (projects[0]?.id || '')
  );
  const targetProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learning, setLearning] = useState('');
  const [phase, setPhase] = useState<ProjectPhase>(targetProject?.phase || 3);
  const [authorRole, setAuthorRole] = useState<RoleId>(currentUser?.primaryRole || 'tecnologia');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe un título descriptivo para la entrada.');
      return;
    }
    if (!content.trim()) {
      setError('Por favor explica brevemente qué habéis probado o construido en el taller.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const authorName = currentUser?.name || 'Creador FLC';
    const authorHandle = currentUser?.handle || '@creador_flc';
    const authorAvatarColor = currentUser?.avatarColor || '#FACC15';

    onSubmit({
      projectId: selectedProjectId,
      date: new Date().toISOString().split('T')[0],
      authorName,
      authorHandle,
      authorRole,
      authorAvatarColor,
      title: title.trim(),
      content: content.trim(),
      learning: learning.trim() || undefined,
      phase,
      tags: tags.length > 0 ? tags : ['Taller', 'FLC LAB'],
      imageUrl: imageUrl.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Nueva Entrada de Bitácora</h2>
              <p className="text-xs text-slate-400">
                Registra los avances, retos superados y aprendizajes del equipo en el taller
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project selector (if not preset) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Proyecto Asignado
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const p = projects.find((proj) => proj.id === e.target.value);
                if (p) setPhase(p.phase);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (Fase {p.phase})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Título del Avance o Experimento *
            </label>
            <input
              type="text"
              placeholder="Ej: Soldadura del puente H y primeras pruebas de tracción con gravilla"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              required
            />
          </div>

          {/* Phase and Author Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Fase del Proyecto
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(Number(e.target.value) as ProjectPhase)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {PHASES.map((ph) => (
                  <option key={ph.step} value={ph.step}>
                    Fase {ph.step}: {ph.name} ({ph.subtitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Rol del Autor
              </label>
              <select
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value as RoleId)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              ¿Qué habéis construido, probado o diseñado hoy? *
            </label>
            <textarea
              rows={3}
              placeholder="Describe las tareas realizadas en la sesión del taller, las herramientas utilizadas y el resultado obtenido..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Maker Learning / Discovery */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Aprendizaje o Dificultad Superada (Lección Maker)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Para que las orugas no resbalasen en tierra suelta, tuvimos que aumentar el ancho de pulso PWM durante los primeros 150ms."
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-amber-500/30 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Etiquetas (separadas por comas)</span>
            </label>
            <input
              type="text"
              placeholder="Arduino, Soldadura, PLA 3D, Godot, Pruebas de campo..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Image preset / URL */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Imagen o Fotografía del Avance (Opcional)</span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="URL de foto o elige una plantilla abajo..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Fotografías sugeridas del taller:</span>
                <button
                  type="button"
                  onClick={() => setImageUrl(ASSET_IMAGES.robotics)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Robótica / 3D
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl(ASSET_IMAGES.game)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Videojuegos
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl(ASSET_IMAGES.boardgame)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  Juego de Mesa
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publicar en la Bitácora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
