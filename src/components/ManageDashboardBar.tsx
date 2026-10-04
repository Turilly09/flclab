import React from 'react';
import { Project, LabEvent, CollaborationRequest, UserProfile } from '../types/flc';
import { SlidersHorizontal, PlusCircle, CalendarPlus, UserCheck, Download, RotateCcw, ShieldCheck, GraduationCap, Users } from 'lucide-react';

interface ManageDashboardBarProps {
  projects: Project[];
  events: LabEvent[];
  collaborations: CollaborationRequest[];
  users?: UserProfile[];
  onOpenNewProject: () => void;
  onOpenNewEvent: () => void;
  onOpenTeacherAdmissionModal?: () => void;
  onOpenUserPoolModal?: () => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const ManageDashboardBar: React.FC<ManageDashboardBarProps> = ({
  projects,
  events,
  collaborations,
  users = [],
  onOpenNewProject,
  onOpenNewEvent,
  onOpenTeacherAdmissionModal,
  onOpenUserPoolModal,
  onResetData,
  onExportData,
}) => {
  const pendingCollabs = collaborations.filter((c) => c.status === 'pendiente').length;
  const vacantRoles = projects.reduce((acc, p) => acc + p.openRoles.length, 0);
  const pendingTeachers = users.filter((u) => u.group === 'profesorado' && !u.isAdmin && (u.teacherStatus || 'pendiente') === 'pendiente');

  return (
    <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded bg-emerald-500 text-slate-950 font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-emerald-300">
            Panel de Gestión y Coordinación FLC LAB:
          </span>
          <span className="text-slate-300">
            {projects.length} proyectos · {vacantRoles} roles vacantes · {pendingCollabs} solicitudes · {events.length} eventos
            {pendingTeachers.length > 0 && (
              <span className="ml-2 font-bold text-amber-300 animate-pulse">
                · {pendingTeachers.length} docente{pendingTeachers.length > 1 ? 's' : ''} pendiente{pendingTeachers.length > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTeacherAdmissionModal && (
            <button
              onClick={onOpenTeacherAdmissionModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
                pendingTeachers.length > 0
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>
                {pendingTeachers.length > 0
                  ? `Admitir Docentes (${pendingTeachers.length})`
                  : 'Admisión Docente'}
              </span>
            </button>
          )}

          {onOpenUserPoolModal && (
            <button
              onClick={onOpenUserPoolModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
              title="Administrar pool de alumnos, profesores y familias"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Administrar Usuarios ({users.length})</span>
            </button>
          )}

          <button
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow transition-transform active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Proyecto</span>
          </button>

          <button
            onClick={onOpenNewEvent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Programar Sesión</span>
          </button>

          <button
            onClick={onExportData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Exportar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar Datos</span>
          </button>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
            title="Restablecer datos originales del centro"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
