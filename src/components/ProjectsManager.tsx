import React, { useState, useMemo } from 'react';
import { Project, DisciplineId, ProjectPhase, RoleId, BitacoraEntry } from '../types/flc';
import { DISCIPLINES, ROLES, PHASES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import { BitacoraTimeline } from './BitacoraTimeline';
import {
  Search,
  Filter,
  PlusCircle,
  Users,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Home,
  Building2,
  Pencil,
  Crown,
  MessageSquare
} from 'lucide-react';
import { UserProfile } from '../types/flc';

interface ProjectsManagerProps {
  projects: Project[];
  currentUser?: UserProfile | null;
  onOpenProjectDetail: (project: Project) => void;
  onOpenNewProjectModal: () => void;
  isManageMode: boolean;
  isAdmin?: boolean;
  bitacoraEntries?: BitacoraEntry[];
  onOpenNewBitacora?: (projectId?: string) => void;
  onApplaudBitacora?: (entryId: string) => void;
  onDeleteProject?: (id: string) => void;
  onOpenCollabProposal?: () => void;
  initialDisciplineFilter?: DisciplineId | null;
  initialPhaseFilter?: ProjectPhase | null;
  initialRoleFilter?: RoleId | null;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  currentUser,
  onOpenProjectDetail,
  onOpenNewProjectModal,
  isManageMode,
  isAdmin = false,
  bitacoraEntries = [],
  onOpenNewBitacora,
  onApplaudBitacora,
  onDeleteProject,
  onOpenCollabProposal,
  initialDisciplineFilter = null,
  initialPhaseFilter = null,
  initialRoleFilter = null,
}) => {
  const [activeView, setActiveView] = useState<'projects' | 'bitacora'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId | 'all'>(
    initialDisciplineFilter || 'all'
  );
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | 'all'>(
    initialPhaseFilter || 'all'
  );
  const [selectedRole, setSelectedRole] = useState<RoleId | 'all'>(
    initialRoleFilter || 'all'
  );
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSummary = p.summary.toLowerCase().includes(query);
        const matchesTeam = p.team.some((m) => m.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesTeam) return false;
      }

      if (selectedDiscipline !== 'all' && p.discipline !== selectedDiscipline) {
        return false;
      }

      if (selectedPhase !== 'all' && p.phase !== selectedPhase) {
        return false;
      }

      if (selectedRole !== 'all') {
        const hasOpenRole = p.openRoles.includes(selectedRole);
        const hasTeamRole = p.team.some((m) => m.role === selectedRole);
        if (!hasOpenRole && !hasTeamRole) return false;
      }

      if (selectedTrimester !== 'all' && p.trimester !== selectedTrimester) {
        return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedDiscipline, selectedPhase, selectedRole, selectedTrimester]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('all');
    setSelectedPhase('all');
    setSelectedRole('all');
    setSelectedTrimester('all');
  };

  return (
    <section id="proyectos" className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header zone */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5" />
              Gestión de Contenidos & Creaciones
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              PROYECTOS DEL LABORATORIO
            </h2>
            <p className="mt-2 text-slate-300 text-base max-w-2xl">
              Explora, filtra y gestiona los proyectos en marcha. Consulta los avances, objetivos
              técnicos y vacantes abiertas para unirte como creador.
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={onOpenNewProjectModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Nuevo Proyecto Oficial (Admin)</span>
            </button>
          ) : currentUser?.group === 'alumnado' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
              title="Proponer una iniciativa de proyecto del alumnado para el Lab"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>+ Proponer Proyecto Estudiantil</span>
            </button>
          ) : currentUser?.group === 'familias' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-purple-400/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
              title="Proponer iniciativa o taller familiar"
            >
              <Home className="w-4 h-4 text-slate-950" />
              <span>+ Proponer Iniciativa Familiar</span>
            </button>
          ) : currentUser?.group === 'entidades_externas' ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-pink-400/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
              title="Proponer un reto tecnológico de empresa para el alumnado"
            >
              <Building2 className="w-4 h-4 text-slate-950" />
              <span>+ Proponer Reto Empresarial</span>
            </button>
          ) : currentUser ? (
            <button
              onClick={onOpenCollabProposal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
              title="Proponer una idea o nuevo reto mediante solicitud de colaboración"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>+ Proponer Proyecto o Reto</span>
            </button>
          ) : null}
        </div>

        {/* View Switcher: Proyectos vs Muro de Bitácoras */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveView('projects')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeView === 'projects'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Proyectos en Marcha ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveView('bitacora')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeView === 'bitacora'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-current" />
            <span>Muro de Bitácoras del Lab</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-950/60 text-current border border-current/20">
              {bitacoraEntries.length} entradas
            </span>
          </button>
        </div>

        {activeView === 'bitacora' ? (
          <BitacoraTimeline
            entries={bitacoraEntries}
            projects={projects}
            onOpenNewEntry={onOpenNewBitacora || (() => {})}
            onApplaudEntry={onApplaudBitacora || (() => {})}
            onOpenProjectDetail={onOpenProjectDetail}
          />
        ) : (
          <>
            {/* Filter Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, temática o miembro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Discipline Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value as any)}
                aria-label="Filtrar por disciplina"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas las disciplinas (7)</option>
                {DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phase Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedPhase}
                onChange={(e) =>
                  setSelectedPhase(e.target.value === 'all' ? 'all' : (Number(e.target.value) as any))
                }
                aria-label="Filtrar por fase del proyecto"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas las fases (1 a 6)</option>
                {PHASES.map((p) => (
                  <option key={p.step} value={p.step}>
                    Fase {p.step}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                aria-label="Filtrar por rol buscado o asignado"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Cualquier rol</option>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Segmented Buttons & Active Filter Counters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                Mostrando {filteredProjects.length} de {projects.length} proyectos
              </span>
              {(selectedDiscipline !== 'all' ||
                selectedPhase !== 'all' ||
                selectedRole !== 'all' ||
                searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-amber-400 hover:text-amber-300 underline font-medium ml-2"
                >
                  Restablecer filtros
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1 hidden sm:inline">Trimestre:</span>
              <button
                onClick={() => setSelectedTrimester('all')}
                className={`px-2 py-1 rounded text-[11px] font-semibold ${
                  selectedTrimester === 'all'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Todos
              </button>
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTrimester(t)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    selectedTrimester === t
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t}T
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-4 max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/20">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Laboratorio Listo para Crear Proyectos</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Actualmente no hay proyectos registrados en FLC LAB. Como Administrador puedes inaugurar el curso creando el primer proyecto oficial, o cualquier alumno y familia puede proponer una iniciativa.
            </p>
            <div className="pt-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={onOpenNewProjectModal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-transform active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Crear Primer Proyecto Oficial</span>
                </button>
              ) : currentUser ? (
                <button
                  type="button"
                  onClick={onOpenCollabProposal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-transform active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Proponer Nueva Idea de Proyecto</span>
                </button>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Para proponer ideas de proyectos, inicia sesión o date de alta en la plataforma.
                </p>
              )}
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">No se encontraron proyectos</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No hay proyectos que coincidan con los filtros aplicados. Puedes probar otros criterios
              o proponer una nueva idea.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Ver todos los proyectos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const discipline = DISCIPLINES.find((d) => d.id === project.discipline) || DISCIPLINES[0];
              const phaseInfo = PHASES.find((p) => p.step === project.phase) || PHASES[0];

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProjectDetail(project)}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden shrink-0">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                    {/* Discipline Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider text-slate-950 shadow"
                        style={{ backgroundColor: discipline.color }}
                      >
                        {discipline.name}
                      </span>
                    </div>

                    {/* Trimester tag & Manage Indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-0.5 rounded text-[11px] font-bold text-slate-300">
                        {project.trimester}º Trimestre
                      </div>
                      {Boolean(isAdmin || (currentUser && project.leaderId === currentUser.id)) && (
                        <div
                          className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-1 shadow"
                          title={isAdmin ? "Editar (Administrador)" : "Editar (Líder del Proyecto)"}
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">{isAdmin ? "Admin" : "Líder"}</span>
                        </div>
                      )}
                    </div>

                    {/* Phase Meter at Bottom of Thumbnail */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5 drop-shadow">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: phaseInfo.color }}
                        />
                        Fase {phaseInfo.step}: {phaseInfo.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded">
                        Paso {project.phase} / 6
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      {project.leaderName && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
                          <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Líder: <strong>{project.leaderName}</strong></span>
                        </div>
                      )}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    {/* Deliverables summary */}
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Hitos completados</span>
                        <span className="font-bold text-white">
                          {project.deliverablesCompleted.length} /{' '}
                          {project.deliverablesCompleted.length + project.deliverablesPending.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{
                            width: `${
                              (project.deliverablesCompleted.length /
                                (project.deliverablesCompleted.length +
                                  project.deliverablesPending.length || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Team & Open Roles */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Equipo: {project.team.length} personas</span>
                        </span>
                        {project.openRoles.length > 0 ? (
                          <span className="text-amber-400 font-bold">
                            Busca {project.openRoles.length} rol(es)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Equipo completo</span>
                        )}
                      </div>

                      {project.openRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.openRoles.map((roleId) => {
                            const rObj = ROLES.find((r) => r.id === roleId);
                            return (
                              <span
                                key={roleId}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              >
                                + {rObj?.name || roleId}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Bottom action trigger */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20" title="Entradas de bitácora">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>
                            {bitacoraEntries.filter((b) => b.projectId === project.id).length}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700" title="Comentarios y aportaciones">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>{project.comments?.length || 0}</span>
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Ver Ficha</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
</section>
  );
};
