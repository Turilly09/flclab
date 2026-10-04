import React, { useState } from 'react';
import { Project, RoleId, ProjectPhase, DisciplineId, UserProfile } from '../types/flc';
import { DISCIPLINES, ROLES, PHASES } from '../data/flcInitialData';
import { X, Trash2, Save, Layers, CheckCircle2, AlertCircle, Crown, ShieldAlert } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
  onDelete?: (projectId: string) => void;
  allUsers?: UserProfile[];
  isAdmin?: boolean;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
  onDelete,
  allUsers = [],
  isAdmin = false,
}) => {
  if (!isOpen || !project) return null;

  const [title, setTitle] = useState(project.title);
  const [summary, setSummary] = useState(project.summary);
  const [discipline, setDiscipline] = useState<DisciplineId>(project.discipline);
  const [phase, setPhase] = useState<ProjectPhase>(project.phase);
  const [trimester, setTrimester] = useState<1 | 2 | 3>(project.trimester);
  const [nextMilestone, setNextMilestone] = useState(project.nextMilestone || '');
  const [leaderId, setLeaderId] = useState(project.leaderId || '');
  const [objectivesText, setObjectivesText] = useState(project.objectives.join('\n'));
  const [completedText, setCompletedText] = useState(project.deliverablesCompleted.join('\n'));
  const [pendingText, setPendingText] = useState(project.deliverablesPending.join('\n'));
  const [openRoles, setOpenRoles] = useState<RoleId[]>(project.openRoles);
  const [error, setError] = useState('');

  const toggleOpenRole = (roleId: RoleId) => {
    if (openRoles.includes(roleId)) {
      setOpenRoles(openRoles.filter((r) => r !== roleId));
    } else {
      setOpenRoles([...openRoles, roleId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título no puede estar vacío.');
      return;
    }
    if (!summary.trim()) {
      setError('El resumen no puede estar vacío.');
      return;
    }

    const assignedUser = allUsers.find((u) => u.id === leaderId);

    const updated: Project = {
      ...project,
      title: title.trim(),
      summary: summary.trim(),
      discipline,
      phase,
      trimester,
      nextMilestone: nextMilestone.trim() || project.nextMilestone,
      leaderId: isAdmin ? (leaderId || undefined) : project.leaderId,
      leaderName: isAdmin
        ? (assignedUser ? assignedUser.name : (leaderId ? 'Líder Asignado' : undefined))
        : project.leaderName,
      objectives: objectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      deliverablesCompleted: completedText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      deliverablesPending: pendingText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      openRoles,
      lastUpdate: 'Hoy',
    };

    onSave(updated);
    onClose();
  };

  const handleDelete = () => {
    if (!isAdmin) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.title}"? Esta acción solo puede realizarla el Administrador y no se puede deshacer.`)) {
      if (onDelete) {
        onDelete(project.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Editar Proyecto</h3>
                {isAdmin ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    Modo Administrador
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Líder de Proyecto
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Como Administrador tienes control total sobre este proyecto y la asignación del Líder.'
                  : 'Como Líder asignado de este proyecto, puedes actualizar sus datos, hitos y avances.'}
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
          {/* Admin Leader Assignment Panel */}
          {isAdmin ? (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-400/50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Asignar Perfil Líder del Proyecto (Permiso Exclusivo Admin)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  Control de Acceso
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                El perfil que selecciones aquí será el <strong>único usuario habilitado para editar este proyecto</strong> de forma autónoma.
              </p>
              <select
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="">-- Sin líder asignado (Solo el Administrador puede editarlo) --</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} · {u.handle} ({u.group === 'alumnado' ? 'Alumnado' : u.group === 'profesorado' ? 'Docente' : u.group === 'familias' ? 'Familia' : 'Empresa'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Líder oficial asignado al proyecto:</span>
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {project.leaderName || 'Tu perfil (Líder)'}
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Título del Proyecto</label>
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

          {/* Discipline, Phase, Trimester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Disciplina</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as DisciplineId)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Fase Actual</label>
              <select
                value={phase}
                onChange={(e) => setPhase(Number(e.target.value) as ProjectPhase)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                {PHASES.map((p) => (
                  <option key={p.step} value={p.step}>
                    Fase {p.step}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Trimestre</label>
              <select
                value={trimester}
                onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1}>1T (Ideación)</option>
                <option value={2}>2T (Fabricación)</option>
                <option value={3}>3T (Feria Final)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Resumen del Proyecto</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Next milestone */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">Próximo Hito Clave</label>
            <input
              type="text"
              value={nextMilestone}
              onChange={(e) => setNextMilestone(e.target.value)}
              placeholder="Ej: Ensamblado del chasis y testeo de motores"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Deliverables: Completed and Pending */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-emerald-400 mb-1">
                Hitos Completados (uno por línea)
              </label>
              <textarea
                rows={3}
                value={completedText}
                onChange={(e) => setCompletedText(e.target.value)}
                placeholder="Diseño conceptual en papel&#10;Primer modelo 3D en Tinkercad"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-300 mb-1">
                Hitos Pendientes (uno por línea)
              </label>
              <textarea
                rows={3}
                value={pendingText}
                onChange={(e) => setPendingText(e.target.value)}
                placeholder="Montaje del cableado&#10;Calibración de sensores"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <label className="block font-bold text-slate-200 mb-2">
              Roles Vacantes Abiertos para Colaboradores
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map((r) => {
                const isSelected = openRoles.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleOpenRole(r.id)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isAdmin && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                title="Solo el Administrador puede eliminar proyectos"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Proyecto (Admin)</span>
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
