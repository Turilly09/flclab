import React, { useState } from 'react';
import { BitacoraEntry, Project, ProjectPhase, RoleId } from '../types/flc';
import { ROLES, PHASES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import {
  BookOpen,
  PlusCircle,
  Lightbulb,
  Flame,
  Calendar,
  Tag,
  Search,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface BitacoraTimelineProps {
  entries: BitacoraEntry[];
  projects: Project[];
  activeProjectId?: string; // If filtered to a specific project
  onOpenNewEntry: (projectId?: string) => void;
  onApplaudEntry: (entryId: string) => void;
  onOpenProjectDetail?: (project: Project) => void;
  isCompact?: boolean;
}

export const BitacoraTimeline: React.FC<BitacoraTimelineProps> = ({
  entries,
  projects,
  activeProjectId,
  onOpenNewEntry,
  onApplaudEntry,
  onOpenProjectDetail,
  isCompact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | 'all'>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(
    activeProjectId || 'all'
  );

  const filteredEntries = entries.filter((entry) => {
    // Project filter
    const matchesProject =
      selectedProjectFilter === 'all' || entry.projectId === selectedProjectFilter;
    if (!matchesProject) return false;

    // Phase filter
    if (selectedPhase !== 'all' && entry.phase !== selectedPhase) {
      return false;
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = entry.title.toLowerCase().includes(q);
      const matchesContent = entry.content.toLowerCase().includes(q);
      const matchesAuthor = entry.authorName.toLowerCase().includes(q);
      const matchesTags = entry.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en el cuaderno de bitácora..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Project Filter (if not locked to active project) */}
          {!activeProjectId && (
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">Todos los proyectos ({entries.length})</option>
              {projects.map((p) => {
                const count = entries.filter((e) => e.projectId === p.id).length;
                return (
                  <option key={p.id} value={p.id}>
                    {p.title} ({count})
                  </option>
                );
              })}
            </select>
          )}

          {/* Phase Filter */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value === 'all' ? 'all' : (Number(e.target.value) as ProjectPhase))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Todas las fases</option>
            {PHASES.map((ph) => (
              <option key={ph.step} value={ph.step}>
                Fase {ph.step}: {ph.name}
              </option>
            ))}
          </select>
        </div>

        {/* New entry button */}
        <button
          onClick={() => onOpenNewEntry(activeProjectId || (selectedProjectFilter !== 'all' ? selectedProjectFilter : undefined))}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Avance</span>
        </button>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No hay anotaciones registradas aún</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No se encontraron resultados con los filtros actuales.'
              : 'El cuaderno de bitácora está listo. Registra la primera prueba, fallo o hito conseguido por el equipo en el taller.'}
          </p>
          <button
            onClick={() => onOpenNewEntry(activeProjectId)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Crear primera entrada</span>
          </button>
        </div>
      ) : (
        <div className="relative pl-4 sm:pl-6 space-y-6 before:absolute before:left-[11px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filteredEntries.map((entry) => {
            const roleObj = ROLES.find((r) => r.id === entry.authorRole) || ROLES[0];
            const phaseObj = PHASES.find((p) => p.step === entry.phase) || PHASES[0];
            const projectObj = projects.find((p) => p.id === entry.projectId);

            return (
              <div key={entry.id} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className="absolute -left-[19px] sm:-left-[27px] top-4 w-4 h-4 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center text-[8px] font-black"
                  style={{ backgroundColor: phaseObj.color }}
                  title={`Fase ${entry.phase}: ${phaseObj.name}`}
                />

                {/* Entry Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* Author & Project context */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow"
                        style={{ backgroundColor: entry.authorAvatarColor || roleObj.color }}
                      >
                        {entry.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{entry.authorName}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1"
                            style={{
                              backgroundColor: `${roleObj.color}15`,
                              color: roleObj.color,
                              borderColor: `${roleObj.color}40`,
                            }}
                          >
                            <DynamicIcon name={roleObj.iconName} className="w-3 h-3" />
                            <span>{roleObj.name}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {entry.date}
                          </span>
                          {projectObj && (
                            <>
                              <span>·</span>
                              <button
                                onClick={() => onOpenProjectDetail && onOpenProjectDetail(projectObj)}
                                className="text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>{projectObj.title}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase Badge */}
                    <span
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5"
                      style={{
                        backgroundColor: `${phaseObj.color}15`,
                        color: phaseObj.color,
                        borderColor: `${phaseObj.color}40`,
                      }}
                    >
                      <Layers className="w-3 h-3" />
                      <span>
                        Fase {entry.phase}: {phaseObj.name}
                      </span>
                    </span>
                  </div>

                  {/* Title & Content */}
                  <div className="space-y-2">
                    <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                      {entry.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {entry.content}
                    </p>
                  </div>

                  {/* Maker Learning Callout (Key Pedagogical Highlight) */}
                  {entry.learning && (
                    <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-3">
                      <div className="p-1 rounded-md bg-amber-400 text-slate-950 shrink-0 mt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                          Aprendizaje Maker & Solución Técnica
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed italic">
                          «{entry.learning}»
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image attachment if provided */}
                  {entry.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-72">
                      <img
                        src={entry.imageUrl}
                        alt={entry.title}
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Footer Bar: Tags & Peer Applause */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Applause / Reaction */}
                    <button
                      onClick={() => onApplaudEntry(entry.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        entry.hasApplauded
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-400/20'
                          : 'bg-slate-950 hover:bg-slate-800 text-amber-400 border-slate-800 hover:border-amber-400/40'
                      }`}
                      title="Reconocer el trabajo del equipo (¡Gran avance!)"
                    >
                      <Flame className={`w-3.5 h-3.5 ${entry.hasApplauded ? 'fill-slate-950' : 'fill-amber-400'}`} />
                      <span>¡Gran avance!</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-900/60 text-[10px] tabular-nums font-mono">
                        {entry.applauseCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
