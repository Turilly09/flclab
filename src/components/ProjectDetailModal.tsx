import React, { useState } from 'react';
import { Project, RoleId, ProjectPhase, BitacoraEntry, UserProfile, ItemComment } from '../types/flc';
import { DISCIPLINES, ROLES, PHASES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import { BitacoraTimeline } from './BitacoraTimeline';
import { EditProjectModal } from './EditProjectModal';
import { ItemCommentsSection } from './ItemCommentsSection';
import {
  X,
  CheckCircle2,
  Circle,
  Users,
  Sparkles,
  ArrowRight,
  Calendar,
  UserPlus,
  BookOpen,
  Layers,
  Flame,
  PlusCircle,
  ShieldCheck,
  Lock,
  Pencil,
  Crown,
  MessageSquare,
  UserMinus
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  currentUser?: UserProfile | null;
  allUsers?: UserProfile[];
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onJoinRole: (projectId: string, roleId: RoleId) => void;
  onUnenrollUser?: (projectId: string, userId: string) => void;
  isManageMode: boolean;
  bitacoraEntries?: BitacoraEntry[];
  onOpenNewBitacora?: (projectId: string) => void;
  onApplaudBitacora?: (entryId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentUser,
  allUsers = [],
  onClose,
  onUpdateProject,
  onDeleteProject,
  onJoinRole,
  onUnenrollUser,
  isManageMode,
  bitacoraEntries = [],
  onOpenNewBitacora,
  onApplaudBitacora,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bitacora' | 'team' | 'comments'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!project) return null;

  const discipline = DISCIPLINES.find((d) => d.id === project.discipline) || DISCIPLINES[0];
  const phaseInfo = PHASES.find((p) => p.step === project.phase) || PHASES[0];

  const projectBitacora = bitacoraEntries.filter((e) => e.projectId === project.id);

  // RBAC permissions checks:
  // Admin can edit/delete anything.
  // The assigned leader (project.leaderId === currentUser.id) is the ONLY other user who can edit this project.
  const isLeader = Boolean(currentUser && project.leaderId === currentUser.id);
  const canEditProject = Boolean(currentUser?.isAdmin || isLeader);

  const isTeamMember = Boolean(
    currentUser &&
    (isLeader ||
     project.team.some(
       (m) =>
         m.name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()) ||
         currentUser.name.toLowerCase().includes(m.name.split(' ')[0].toLowerCase())
     ) ||
     currentUser.projectIds?.includes(project.id) ||
     project.enrolledUserIds?.includes(currentUser.id))
  );

  const isEnrolledInProject = Boolean(
    currentUser && (currentUser.isAdmin || isLeader || isTeamMember || project.enrolledUserIds?.includes(currentUser.id))
  );

  const canManageDeliverables = Boolean(currentUser?.isAdmin || isLeader || isManageMode);
  const canAdvancePhase = Boolean(currentUser?.isAdmin || isLeader || isManageMode);

  const handleToggleDeliverable = (item: string, isCompleted: boolean) => {
    if (!canManageDeliverables) return;
    if (isCompleted) {
      onUpdateProject({
        ...project,
        deliverablesCompleted: project.deliverablesCompleted.filter((d) => d !== item),
        deliverablesPending: [...project.deliverablesPending, item],
      });
    } else {
      onUpdateProject({
        ...project,
        deliverablesPending: project.deliverablesPending.filter((d) => d !== item),
        deliverablesCompleted: [...project.deliverablesCompleted, item],
      });
    }
  };

  const handleAdvancePhase = () => {
    if (!canAdvancePhase) return;
    if (project.phase < 6) {
      const nextPhase = (project.phase + 1) as ProjectPhase;
      onUpdateProject({
        ...project,
        phase: nextPhase,
      });
    }
  };

  const handleEnrollProject = () => {
    if (!currentUser) return;
    const currentEnrolled = project.enrolledUserIds || [];
    if (!currentEnrolled.includes(currentUser.id)) {
      onUpdateProject({
        ...project,
        enrolledUserIds: [...currentEnrolled, currentUser.id],
      });
    }
  };

  const handleUnenrollSelf = () => {
    if (!currentUser) return;
    if (window.confirm(`¿Estás seguro de que deseas desapuntarte del proyecto "${project.title}"?`)) {
      const currentEnrolled = project.enrolledUserIds || [];
      const updatedEnrolled = currentEnrolled.filter((id) => id !== currentUser.id);
      const updatedTeam = project.team.filter((m) => {
        const isSelf =
          m.name.toLowerCase() === currentUser.name.toLowerCase() ||
          currentUser.name.toLowerCase().includes(m.name.toLowerCase()) ||
          m.name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase());
        return !isSelf;
      });

      onUpdateProject({
        ...project,
        enrolledUserIds: updatedEnrolled,
        team: updatedTeam,
      });

      if (onUnenrollUser) {
        onUnenrollUser(project.id, currentUser.id);
      }
    }
  };

  const handleAddProjectComment = (text: string) => {
    if (!currentUser) return;
    const newComment: ItemComment = {
      id: `comm-proj-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorGroup: currentUser.group,
      authorAvatarColor: currentUser.avatarColor,
      text,
      createdAt: 'Hoy, hace un momento',
    };
    onUpdateProject({
      ...project,
      comments: [...(project.comments || []), newComment],
    });
  };

  const handleDeleteProjectComment = (commentId: string) => {
    onUpdateProject({
      ...project,
      comments: (project.comments || []).filter((c) => c.id !== commentId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header bar with Image Backdrop */}
        <div className="relative h-44 sm:h-52 bg-slate-950 overflow-hidden shrink-0">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Action buttons (Edit & Close) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {canEditProject && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 transition-transform active:scale-95 cursor-pointer"
                title={currentUser?.isAdmin ? "Editar como Administrador (Superusuario)" : "Editar como Líder de Proyecto"}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Proyecto</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider text-slate-950"
              style={{ backgroundColor: discipline.color }}
            >
              {discipline.name}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-800/90 text-slate-200 border border-slate-700">
              Trimestre {project.trimester}T
            </span>
            {project.leaderName && (
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Líder: {project.leaderName}</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{projectBitacora.length} bitácoras</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">
                Fase {phaseInfo.step}: {phaseInfo.name}
              </span>
              <span>·</span>
              <span>Última actualización: {project.lastUpdate}</span>
            </div>
          </div>
        </div>

        {/* Modal Tab Navigation Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visión General & Hitos</span>
          </button>
          <button
            onClick={() => setActiveTab('bitacora')}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bitacora'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Diario de Bitácora</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300 font-mono">
              {projectBitacora.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'team'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipo & Vacantes ({project.team.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'comments'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comentarios & Debate</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300 font-mono">
              {project.comments?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: VISIÓN GENERAL */}
          {activeTab === 'overview' && (
            <>
              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Resumen del Proyecto
                </h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {project.summary}
                </p>
              </div>

              {/* Leader Notice */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300">
                    Líder de Proyecto: <strong className="text-white">{project.leaderName || 'Asignado por el Administrador'}</strong>
                  </span>
                </div>
                {isLeader ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Eres el Líder (Permiso de edición)
                  </span>
                ) : currentUser?.isAdmin ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                    Admin (Superusuario)
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">
                    Solo el Líder o el Administrador pueden editar
                  </span>
                )}
              </div>

              {/* Phase Progression Tracker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Progresión por Fases (Metodología FLC LAB)
                  </h4>
                  {canAdvancePhase && project.phase < 6 && (
                    <button
                      onClick={handleAdvancePhase}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Avanzar a Fase {project.phase + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {PHASES.map((p) => {
                    const isPassed = p.step < project.phase;
                    const isCurrent = p.step === project.phase;
                    return (
                      <div
                        key={p.step}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow'
                            : isPassed
                            ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">Fase {p.step}</div>
                        <div className="text-xs font-black truncate">{p.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Objetivos Principales
                </h4>
                <div className="space-y-2">
                  {project.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs sm:text-sm text-slate-300"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Entregables Completados ({project.deliverablesCompleted.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {project.deliverablesCompleted.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleDeliverable(item, true)}
                        className={`flex items-start gap-2 p-2 rounded text-xs transition-colors ${
                          canManageDeliverables ? 'cursor-pointer hover:bg-slate-900' : ''
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 line-through opacity-80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Circle className="w-4 h-4" />
                    <span>Entregables Pendientes ({project.deliverablesPending.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {project.deliverablesPending.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleDeliverable(item, false)}
                        className={`flex items-start gap-2 p-2 rounded text-xs transition-colors ${
                          canManageDeliverables ? 'cursor-pointer hover:bg-slate-900' : ''
                        }`}
                      >
                        <Circle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Section Preview inside Overview */}
              <div className="pt-4 border-t border-slate-800">
                <ItemCommentsSection
                  title="Comentarios y Debate del Proyecto"
                  comments={project.comments || []}
                  currentUser={currentUser}
                  isEnrolled={isEnrolledInProject}
                  enrollButtonText="Apuntarme al Proyecto para Comentar"
                  notEnrolledMessage="Solo los usuarios apuntados o colaboradores de este proyecto pueden publicar comentarios."
                  enrolledBadgeLabel={isLeader ? "Líder de Proyecto" : currentUser?.isAdmin ? "Administrador" : "Miembro Apuntado"}
                  onEnroll={handleEnrollProject}
                  onUnenroll={!isLeader && !currentUser?.isAdmin ? handleUnenrollSelf : undefined}
                  onAddComment={handleAddProjectComment}
                  onDeleteComment={handleDeleteProjectComment}
                />
              </div>
            </>
          )}

          {/* TAB 2: BITÁCORA */}
          {activeTab === 'bitacora' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Registro de Avances y Aprendizajes</h4>
                  <p className="text-xs text-slate-400">
                    Cuaderno abierto del proyecto {project.title}.
                  </p>
                </div>
                {onOpenNewBitacora && (
                  <button
                    onClick={() => onOpenNewBitacora(project.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Añadir Entrada</span>
                  </button>
                )}
              </div>

              <BitacoraTimeline
                entries={projectBitacora}
                projects={[project]}
                activeProjectId={project.id}
                onOpenNewEntry={() => onOpenNewBitacora && onOpenNewBitacora(project.id)}
                onApplaudEntry={(id) => onApplaudBitacora && onApplaudBitacora(id)}
                isCompact
              />
            </div>
          )}

          {/* TAB 3: EQUIPO Y VACANTES */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Leader Callout */}
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Líder Oficial del Proyecto</p>
                    <h4 className="text-base font-black text-white">{project.leaderName || 'Sin asignar (Solo Admin)'}</h4>
                  </div>
                </div>
                {currentUser?.isAdmin && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs cursor-pointer hover:bg-amber-300 transition-colors"
                  >
                    Reasignar Líder (Admin)
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Miembros del Equipo ({project.team.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.team.map((member, i) => {
                    const roleObj = ROLES.find((r) => r.id === member.role);
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black"
                          style={{ backgroundColor: roleObj?.color || '#F59E0B' }}
                        >
                          <DynamicIcon name={roleObj?.iconName || 'Award'} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-xs sm:text-sm truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-amber-400 font-semibold">{roleObj?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {member.group} · {member.gradeOrDept}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Open roles call to action */}
              {project.openRoles.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-black text-amber-300">
                      ¡Este proyecto busca colaboradores!
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Si te interesa alguno de estos roles, puedes postularte para sumarte al equipo del proyecto:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.openRoles.map((roleId) => {
                      const roleObj = ROLES.find((r) => r.id === roleId);
                      if (!roleObj) return null;
                      return (
                        <button
                          key={roleId}
                          onClick={() => onJoinRole(project.id, roleId)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white border border-slate-700 transition-colors cursor-pointer"
                        >
                          <DynamicIcon name={roleObj.iconName} className="w-3.5 h-3.5" />
                          <span>Postularme a {roleObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMENTARIOS Y DEBATE */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Espacio de Trabajo y Consulta del Proyecto</span>
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Zona de debate exclusiva para el equipo y usuarios apuntados. Comparte sugerencias, dudas sobre código o materiales y avances.
                </p>
              </div>

              <ItemCommentsSection
                title="Debate y Aportaciones del Proyecto"
                comments={project.comments || []}
                currentUser={currentUser}
                isEnrolled={isEnrolledInProject}
                enrollButtonText="Apuntarme al Proyecto para Comentar"
                notEnrolledMessage="Solo los usuarios apuntados o colaboradores de este proyecto pueden publicar comentarios."
                enrolledBadgeLabel={isLeader ? "Líder de Proyecto" : currentUser?.isAdmin ? "Administrador" : "Miembro Apuntado"}
                onEnroll={handleEnrollProject}
                onUnenroll={!isLeader && !currentUser?.isAdmin ? handleUnenrollSelf : undefined}
                onAddComment={handleAddProjectComment}
                onDeleteComment={handleDeleteProjectComment}
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Próximo hito: <span className="text-white font-semibold">{project.nextMilestone}</span>
          </div>
          <div className="flex items-center gap-2">
            {isEnrolledInProject && !isLeader && !currentUser?.isAdmin && (
              <button
                type="button"
                onClick={handleUnenrollSelf}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                title="Desapuntarme de este proyecto"
              >
                <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                <span>Desapuntarme</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        project={project}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => {
          onUpdateProject(updated);
        }}
        onDelete={
          currentUser?.isAdmin && onDeleteProject
            ? (id) => {
                onDeleteProject(id);
                onClose();
              }
            : undefined
        }
        allUsers={allUsers}
        isAdmin={currentUser?.isAdmin}
      />
    </div>
  );
};
