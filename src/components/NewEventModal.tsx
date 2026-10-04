import React, { useState } from 'react';
import { LabEvent, EventType, UserProfile } from '../types/flc';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Home,
  Building2,
  Users
} from 'lucide-react';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onCreateEvent: (event: LabEvent) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateEvent,
}) => {
  const isAdmin = currentUser?.isAdmin;
  const isStudent = currentUser?.group === 'alumnado';
  const isFamily = currentUser?.group === 'familias';
  const isCompany = currentUser?.group === 'entidades_externas';

  const defaultSpeaker = currentUser
    ? `${currentUser.name} (${
        isAdmin
          ? 'Coordinador Docente'
          : isStudent
          ? 'Alumno Maker'
          : isFamily
          ? 'Familia / AMPA'
          : 'Empresa Colaboradora'
      })`
    : '';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>(
    isCompany ? 'masterclass' : isFamily ? 'taller' : 'taller'
  );
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('16:30 - 18:30');
  const [location, setLocation] = useState(
    'Aula de Innovación & Maker Lab (IES Fernando Lázaro Carreter)'
  );
  const [description, setDescription] = useState('');
  const [speakerOrHost, setSpeakerOrHost] = useState(defaultSpeaker);
  const [maxCapacity, setMaxCapacity] = useState('35');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Guest users are strictly prevented from proposing sessions or events
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400/40 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Identificación Requerida</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Los usuarios invitados no pueden programar ni proponer sesiones en el calendario de FLC LAB. Debes iniciar sesión o darte de alta en la plataforma.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor indica el título de la sesión o actividad.');
      return;
    }
    if (!date.trim()) {
      setError('Por favor indica la fecha propuesta (ej: 28 Octubre 2026 o Noviembre 1T).');
      return;
    }
    if (!description.trim()) {
      setError('Por favor describe en qué consiste la actividad y qué se aprenderá o creará.');
      return;
    }

    const newEvent: LabEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      type,
      trimester,
      date: date.trim(),
      time: time.trim() || '16:30 - 18:30',
      location: location.trim() || 'Aula de Innovación & Maker Lab',
      description: description.trim(),
      speakerOrHost: speakerOrHost.trim() || defaultSpeaker || 'Comunidad FLC LAB',
      attendeesCount: 1,
      maxCapacity: parseInt(maxCapacity, 10) || undefined,
      isRegistered: true,
      isProposal: !isAdmin,
      proposedBy: currentUser ? currentUser.name : 'Visitante',
      proposedGroup: currentUser?.group,
      status: isAdmin ? 'oficial' : 'propuesta_pendiente',
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-md ${
                isAdmin
                  ? 'bg-amber-400 text-slate-950'
                  : isStudent
                  ? 'bg-amber-400 text-slate-950'
                  : isFamily
                  ? 'bg-purple-400 text-slate-950'
                  : isCompany
                  ? 'bg-pink-400 text-slate-950'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-5 h-5" />
              ) : isStudent ? (
                <GraduationCap className="w-5 h-5" />
              ) : isFamily ? (
                <Home className="w-5 h-5" />
              ) : isCompany ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <CalendarIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  {isAdmin
                    ? 'Programar Sesión Oficial'
                    : isStudent
                    ? 'Proponer Taller de Alumnos'
                    : isFamily
                    ? 'Proponer Taller Familiar / Encuentro'
                    : isCompany
                    ? 'Proponer Masterclass de Empresa'
                    : 'Proponer Sesión para el Calendario'}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Publicación directa en la hoja de ruta oficial del centro'
                  : 'Tu propuesta se integrará en el calendario para su validación en el Lab'}
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
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Nombre de la Sesión o Actividad *
            </label>
            <input
              type="text"
              placeholder={
                isCompany
                  ? 'Ej: Masterclass de Automatización y Telemetría en Minería'
                  : isFamily
                  ? 'Ej: Taller Familiar de Maquetería y Acabados de Madera'
                  : isStudent
                  ? 'Ej: Sesión de Playtesting de Videojuegos y Diseño de Niveles'
                  : 'Ej: Taller Práctico de Robótica y Sensores Arduino'
              }
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Type & Trimester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Tipo de Actividad
              </label>
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
              <label className="block font-bold text-slate-200 mb-1">
                Trimestre de la Agenda
              </label>
              <select
                value={trimester}
                onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1}>1T (Octubre - Diciembre): Ideación & Primeros Prototipos</option>
                <option value={2}>2T (Enero - Marzo): Fabricación Técnica & Validación</option>
                <option value={3}>3T (Abril - Junio): Ensayos, Feria & Demostración</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Fecha Propuesta *</span>
              </label>
              <input
                type="text"
                placeholder="Ej: 24 Octubre 2026 (o 'Mediados de Noviembre')"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horario Previsto</span>
              </label>
              <input
                type="text"
                placeholder="Ej: 16:30 - 18:30"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Espacio o Ubicación</span>
            </label>
            <input
              type="text"
              placeholder="Aula de Innovación & Maker Lab (IES Fernando Lázaro Carreter)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Speaker & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Responsable, Ponente o Conductor
              </label>
              <input
                type="text"
                placeholder="Ej: Prof. Tokita Ohma / Lucas Royo / Experto Invitado"
                value={speakerOrHost}
                onChange={(e) => setSpeakerOrHost(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Aforo Máximo (Plazas)</span>
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Descripción de Contenidos, Objetivos y Materiales Necesarios *
            </label>
            <textarea
              rows={3}
              placeholder="Explica qué se trabajará en la sesión, materiales que se usarán y a quién va dirigida..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md cursor-pointer ${
                isAdmin
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  : isFamily
                  ? 'bg-purple-400 hover:bg-purple-300 text-slate-950 shadow-purple-400/20'
                  : isCompany
                  ? 'bg-pink-400 hover:bg-pink-300 text-slate-950 shadow-pink-400/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {isAdmin
                  ? 'Publicar Sesión Oficial'
                  : isFamily
                  ? 'Enviar Propuesta Familiar'
                  : isCompany
                  ? 'Enviar Propuesta de Masterclass'
                  : 'Enviar Propuesta al Calendario'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
