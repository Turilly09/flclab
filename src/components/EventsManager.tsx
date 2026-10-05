import React, { useState } from 'react';
import { LabEvent, EventType, UserProfile, ItemComment } from '../types/flc';
import { CALENDAR_TRIMESTERS } from '../data/flcInitialData';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  Check,
  Download,
  Flame,
  Sparkles,
  Award,
  ChevronRight,
  GraduationCap,
  Home,
  Building2,
  CheckCircle2,
  Pencil,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EditEventModal } from './EditEventModal';
import { ItemCommentsSection } from './ItemCommentsSection';

interface EventsManagerProps {
  events: LabEvent[];
  currentUser?: UserProfile | null;
  onToggleRegister: (eventId: string) => void;
  onOpenNewEventModal: () => void;
  onUpdateEvent?: (updatedEvent: LabEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  onApproveEvent?: (eventId: string) => void;
  isManageMode: boolean;
  isAdmin?: boolean;
}

export const EventsManager: React.FC<EventsManagerProps> = ({
  events,
  currentUser,
  onToggleRegister,
  onOpenNewEventModal,
  onUpdateEvent,
  onDeleteEvent,
  onApproveEvent,
  isManageMode,
  isAdmin = false,
}) => {
  const [activeTrimesterTab, setActiveTrimesterTab] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [editingEvent, setEditingEvent] = useState<LabEvent | null>(null);
  const [openCommentsEventId, setOpenCommentsEventId] = useState<string | null>(null);

  const selectedTrimesterData =
    CALENDAR_TRIMESTERS.find((t) => t.trimester === activeTrimesterTab) ||
    CALENDAR_TRIMESTERS[0];

  const filteredEvents = events.filter((evt) => {
    if (evt.trimester !== activeTrimesterTab && activeTrimesterTab !== 0) {
      return false;
    }
    if (filterType !== 'all' && evt.type !== filterType) {
      return false;
    }
    return true;
  });

  const getEventTypeBadge = (type: EventType) => {
    switch (type) {
      case 'taller':
        return { label: 'Taller de Trabajo', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'masterclass':
        return { label: 'Masterclass Técnica', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'hito':
        return { label: 'Hito de Entrega', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'feria':
        return { label: 'Gran Feria Final', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      default:
        return { label: 'Reunión FLC', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    }
  };

  const handleExportCalendar = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FLC LAB//IES Fernando Lazaro Carreter//ES',
      ...events.map((e) =>
        [
          'BEGIN:VEVENT',
          `SUMMARY:FLC LAB - ${e.title}`,
          `DESCRIPTION:${e.description.replace(/\n/g, ' ')}`,
          `LOCATION:${e.location}`,
          'END:VEVENT',
        ].join('\n')
      ),
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendario_flc_lab.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="calendario" className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#080D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header from slide 8 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left items-center md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 mx-auto md:mx-0">
              <CalendarIcon className="w-3.5 h-3.5" />
              Hoja de Ruta del Curso
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              CALENDARIO DEL TALLER
            </h2>
            <p className="mt-2 text-slate-300 text-base max-w-2xl mx-auto md:mx-0">
              12 hitos organizados en 3 trimestres: de la lluvia de ideas inicial hasta la gran
              demostración pública ante las familias y el pueblo de Utrillas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto self-center md:self-auto">
            <button
              onClick={handleExportCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Descargar eventos en formato iCal (.ics)"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Sincronizar Calendario (.ics)</span>
            </button>

            {isAdmin ? (
              <button
                onClick={onOpenNewEventModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
                title="Programar una sesión oficial en el calendario del centro (Admin)"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ Programar Sesión (Admin)</span>
              </button>
            ) : currentUser?.group === 'alumnado' ? (
              <button
                onClick={onOpenNewEventModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
                title="Proponer un taller o sesión maker de alumnos para el calendario"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                <span>+ Proponer Taller Maker</span>
              </button>
            ) : currentUser?.group === 'familias' ? (
              <button
                onClick={onOpenNewEventModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-purple-400/20 whitespace-nowrap cursor-pointer"
                title="Proponer un taller o encuentro de familias para el calendario"
              >
                <Home className="w-4 h-4 text-slate-950" />
                <span>+ Proponer Taller Familiar</span>
              </button>
            ) : currentUser?.group === 'entidades_externas' ? (
              <button
                onClick={onOpenNewEventModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-pink-400/20 whitespace-nowrap cursor-pointer"
                title="Proponer una masterclass o charla técnica de empresa"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>+ Proponer Masterclass</span>
              </button>
            ) : (
              <button
                onClick={onOpenNewEventModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer"
                title="Proponer una sesión o taller para el calendario del Lab"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>+ Proponer Sesión o Taller</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Trimesters Selector Tabs (Direct representation of Slide 8) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CALENDAR_TRIMESTERS.map((t) => {
            const isSelected = activeTrimesterTab === t.trimester;
            return (
              <button
                key={t.trimester}
                onClick={() => setActiveTrimesterTab(t.trimester)}
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800/90 shadow-xl scale-101'
                    : 'bg-slate-900/60 hover:bg-slate-800/40 border-slate-800'
                }`}
                style={{
                  borderColor: isSelected ? t.color : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                    style={{
                      backgroundColor: `${t.color}25`,
                      color: t.color,
                    }}
                  >
                    {t.trimester}T
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.focus}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{t.title}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Hitos {t.milestones[0].num} al {t.milestones[t.milestones.length - 1].num} del taller
                </p>

                {isSelected && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: t.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 4 Milestones of Active Trimester (Faithful to Slide 8) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Hitos Oficiales del Trimestre {selectedTrimesterData.trimester}T
              </span>
              <h4 className="text-xl font-black text-white mt-0.5">
                {selectedTrimesterData.focus} ({selectedTrimesterData.title})
              </h4>
            </div>

            {/* Target Output Banner from Slide 8 */}
            {selectedTrimesterData.trimester === 3 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Producto Real + Presentación Pública + Feria</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedTrimesterData.milestones.map((m) => (
              <div
                key={m.num}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-slate-950"
                      style={{ backgroundColor: selectedTrimesterData.color }}
                    >
                      {m.num}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Hito #{m.num}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{m.title}</h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event Sessions Feed */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Sesiones y Citas del Trimestre</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {filteredEvents.length} eventos
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Talleres de aula, masterclasses técnicas y días de demostración.
              </p>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'all'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Todos los tipos
              </button>
              <button
                onClick={() => setFilterType('taller')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'taller'
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Talleres
              </button>
              <button
                onClick={() => setFilterType('masterclass')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'masterclass'
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Masterclasses
              </button>
              <button
                onClick={() => setFilterType('hito')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'hito'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Demo Days
              </button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-3 max-w-lg mx-auto my-6">
              <CalendarIcon className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">No hay citas programadas todavía</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                El calendario de actividades maker y talleres del centro está listo para inaugurar el curso.
              </p>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={onOpenNewEventModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Programar Primera Sesión Oficial</span>
                </button>
              ) : currentUser ? (
                <button
                  type="button"
                  onClick={onOpenNewEventModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Proponer Taller o Sesión</span>
                </button>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Para proponer sesiones o talleres, inicia sesión o date de alta en la plataforma.
                </p>
              )}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              No hay actividades con este filtro en este trimestre.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((evt) => {
              const badge = getEventTypeBadge(evt.type);
              const isFull = evt.maxCapacity ? evt.attendeesCount >= evt.maxCapacity : false;

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
                >
                  {evt.thumbnail && (
                    <div className="relative h-40 bg-slate-950 overflow-hidden shrink-0">
                      <img
                        src={evt.thumbnail}
                        alt={evt.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {evt.isProposal && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            🏷️ Propuesta de {evt.proposedBy || 'Comunidad'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {evt.date}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{evt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                    {evt.speakerOrHost && (
                      <p className="text-xs text-amber-300/90 font-medium">
                        <span className="text-slate-400">Conduce / Ponente: </span>
                        {evt.speakerOrHost}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{evt.time}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{evt.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Footer with RSVP action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {evt.attendeesCount}{' '}
                          {evt.maxCapacity ? `/ ${evt.maxCapacity}` : ''} asistentes
                        </span>
                      </div>

                      {isAdmin && evt.isProposal && onApproveEvent && (
                        <button
                          onClick={() => onApproveEvent(evt.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-sm"
                          title="Aprobar esta propuesta y convertirla en sesión oficial"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobar Oficial</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Comments Toggle Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCommentsEventId(openCommentsEventId === evt.id ? null : evt.id)
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          openCommentsEventId === evt.id
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title="Ver o participar en los comentarios de esta cita"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{evt.comments?.length || 0} comentarios</span>
                        {openCommentsEventId === evt.id ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {/* Edit Button: ONLY Admin has permission */}
                      {isAdmin && onUpdateEvent && (
                        <button
                          type="button"
                          onClick={() => setEditingEvent(evt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                          title="Editar sesión o cita (Permiso exclusivo de Administrador)"
                        >
                          <Pencil className="w-3 h-3 text-amber-400" />
                          <span>Editar (Admin)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onToggleRegister(evt.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          evt.isRegistered
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 border border-emerald-500/40 group/reg'
                            : isFull
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                        }`}
                        disabled={isFull && !evt.isRegistered}
                        title={evt.isRegistered ? 'Pulsar para desapuntarte de esta cita' : 'Inscribirme a esta cita'}
                      >
                        {evt.isRegistered ? (
                          <>
                            <Check className="w-3.5 h-3.5 group-hover/reg:hidden" />
                            <span className="group-hover/reg:hidden">Inscrito</span>
                            <span className="hidden group-hover/reg:inline text-rose-300">Desapuntarme</span>
                          </>
                        ) : isFull ? (
                          <span>Aforo Completo</span>
                        ) : (
                          <span>Apuntarme</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible comments section for this event/cita */}
                  {openCommentsEventId === evt.id && (
                    <div className="pt-4 border-t border-slate-800 animate-in fade-in duration-150">
                      <ItemCommentsSection
                        title={`Debate y Dudas de la Sesión`}
                        comments={evt.comments || []}
                        currentUser={currentUser}
                        isEnrolled={Boolean(
                          currentUser &&
                          (currentUser.isAdmin ||
                           evt.registeredUserIds?.includes(currentUser.id) ||
                           evt.isRegistered)
                        )}
                        enrollButtonText="Inscribirme a la Cita para Comentar"
                        notEnrolledMessage="Solo los usuarios apuntados a esta cita pueden escribir comentarios."
                        enrolledBadgeLabel={currentUser?.isAdmin ? "Admin" : "Inscrito a la Cita"}
                        onEnroll={() => {
                          onToggleRegister(evt.id);
                        }}
                        onAddComment={(text) => {
                          if (!currentUser || !onUpdateEvent) return;
                          const newComment: ItemComment = {
                            id: `comm-evt-${Date.now()}`,
                            authorId: currentUser.id,
                            authorName: currentUser.name,
                            authorHandle: currentUser.handle,
                            authorGroup: currentUser.group,
                            authorAvatarColor: currentUser.avatarColor,
                            text,
                            createdAt: 'Hoy, hace un momento',
                          };
                          onUpdateEvent({
                            ...evt,
                            comments: [...(evt.comments || []), newComment],
                          });
                        }}
                        onDeleteComment={(commentId) => {
                          if (!onUpdateEvent) return;
                          onUpdateEvent({
                            ...evt,
                            comments: (evt.comments || []).filter((c) => c.id !== commentId),
                          });
                        }}
                      />
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      {/* Modal for editing events and sessions */}
      <EditEventModal
        isOpen={!!editingEvent}
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
        onSave={(updated) => {
          if (onUpdateEvent) onUpdateEvent(updated);
          setEditingEvent(null);
        }}
        onDelete={
          onDeleteEvent
            ? (id) => {
                onDeleteEvent(id);
                setEditingEvent(null);
              }
            : undefined
        }
        isAdmin={isAdmin}
      />
    </section>
  );
};
