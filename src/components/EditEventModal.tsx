import React, { useState } from 'react';
import { LabEvent, EventType } from '../types/flc';
import { X, Trash2, Save, Calendar as CalendarIcon, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { ASSET_IMAGES } from '../data/flcInitialData';

interface EditEventModalProps {
  isOpen: boolean;
  event: LabEvent | null;
  onClose: () => void;
  onSave: (updatedEvent: LabEvent) => void;
  onDelete?: (eventId: string) => void;
  isAdmin?: boolean;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onSave,
  onDelete,
  isAdmin = false,
}) => {
  if (!isOpen || !event) return null;

  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState<EventType>(event.type);
  const [trimester, setTrimester] = useState<1 | 2 | 3>(event.trimester);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [speakerOrHost, setSpeakerOrHost] = useState(event.speakerOrHost || '');
  const [maxCapacity, setMaxCapacity] = useState(String(event.maxCapacity || 40));
  const [description, setDescription] = useState(event.description);
  const [isOfficial, setIsOfficial] = useState(!event.isProposal);
  const [thumbnail, setThumbnail] = useState(event.thumbnail || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título de la sesión no puede estar vacío.');
      return;
    }
    if (!date.trim()) {
      setError('Por favor indica una fecha para la sesión.');
      return;
    }
    if (!description.trim()) {
      setError('Por favor incluye una descripción de la actividad.');
      return;
    }

    const updated: LabEvent = {
      ...event,
      title: title.trim(),
      type,
      trimester,
      date: date.trim(),
      time: time.trim() || '16:30 - 18:30',
      location: location.trim() || 'Aula Maker',
      speakerOrHost: speakerOrHost.trim() || undefined,
      maxCapacity: parseInt(maxCapacity, 10) || undefined,
      description: description.trim(),
      isProposal: !isOfficial,
      status: isOfficial ? 'oficial' : 'propuesta_pendiente',
      thumbnail: thumbnail.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la sesión "${event.title}" del calendario?`)) {
      if (onDelete) {
        onDelete(event.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Editar Sesión del Calendario</h3>
              <p className="text-xs text-slate-400">Modifica los horarios, fechas, ponentes o contenidos</p>
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
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Nombre de la Sesión o Evento *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Thumbnail / Image */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Imagen de Portada (URL o Ruta de Asset)</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Ej: https://images.unsplash.com/... o chasis.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(ASSET_IMAGES).map(([name, url]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setThumbnail(url)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer ${
                    thumbnail === url
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Asset: {name === 'hero' ? 'General' : name === 'game' ? 'Videojuegos' : name === 'robotics' ? 'Robótica/3D' : 'Mesa'}
                </button>
              ))}
            </div>
          </div>

          {/* Type & Trimester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Tipo de Actividad</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="taller">🛠️ Taller Práctico Maker</option>
                <option value="masterclass">🎓 Masterclass Técnica / Charla</option>
                <option value="hito">🚩 Hito de Entrega / Demo Day</option>
                <option value="feria">🎪 Gran Feria Pública / Muestra</option>
                <option value="reunion">👥 Reunión de Equipo o Familias</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Trimestre</label>
              <select
                value={trimester}
                onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1}>1T (Octubre - Diciembre)</option>
                <option value={2}>2T (Enero - Marzo)</option>
                <option value={3}>3T (Abril - Junio)</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Fecha *</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horario</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Espacio / Ubicación</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Speaker & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Responsable o Ponente</label>
              <input
                type="text"
                value={speakerOrHost}
                onChange={(e) => setSpeakerOrHost(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Aforo Máximo</span>
              </label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Official status toggle for Admin */}
          {isAdmin && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Estado Oficial del Centro</p>
                <p className="text-[11px] text-slate-400">Marcar como sesión confirmada en la agenda del Lab</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Descripción de la Sesión *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Sesión</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
