import React, { useState } from 'react';
import { Project, DisciplineId, ProjectPhase, RoleId } from '../types/flc';
import { DISCIPLINES, ROLES, ASSET_IMAGES } from '../data/flcInitialData';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
  onRequireConstructionNotice: (actionTitle: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  onRequireConstructionNotice,
}) => {
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<DisciplineId>('videojuegos');
  const [phase, setPhase] = useState<ProjectPhase>(1);
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [summary, setSummary] = useState('');
  const [objectivesInput, setObjectivesInput] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadGroup, setLeadGroup] = useState<'Alumnado' | 'Profesorado' | 'Familia' | 'Mentor Externo'>('Alumnado');
  const [leadGradeOrDept, setLeadGradeOrDept] = useState('');
  const [leadRole, setLeadRole] = useState<RoleId>('project_lead');
  const [selectedOpenRoles, setSelectedOpenRoles] = useState<RoleId[]>(['arte', 'audio', 'tecnologia']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleToggle = (roleId: RoleId) => {
    if (selectedOpenRoles.includes(roleId)) {
      setSelectedOpenRoles(selectedOpenRoles.filter((r) => r !== roleId));
    } else {
      setSelectedOpenRoles([...selectedOpenRoles, roleId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor introduce el nombre del proyecto.');
      return;
    }
    if (!summary.trim()) {
      setError('Por favor redacta un breve resumen de la idea.');
      return;
    }
    if (!leadName.trim()) {
      setError('Por favor indica quién coordina o propone la idea.');
      return;
    }

    // Pick appropriate fallback asset
    let thumbnail = ASSET_IMAGES.hero;
    if (discipline === 'videojuegos') thumbnail = ASSET_IMAGES.game;
    else if (discipline === 'robotica' || discipline === 'impresion_3d') thumbnail = ASSET_IMAGES.robotics;
    else if (discipline === 'juegos_mesa') thumbnail = ASSET_IMAGES.boardgame;

    const objectivesList = objectivesInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      discipline,
      phase,
      trimester,
      summary: summary.trim(),
      objectives: objectivesList.length > 0 ? objectivesList : ['Definir el alcance y primeras pruebas técnicas'],
      team: [
        {
          name: leadName.trim(),
          role: leadRole,
          group: leadGroup,
          gradeOrDept: leadGradeOrDept.trim() || undefined,
        },
      ],
      openRoles: selectedOpenRoles,
      thumbnail,
      deliverablesCompleted: ['Ficha de propuesta presentada'],
      deliverablesPending: [
        'Documento de diseño inicial',
        'Primera sesión de prototipado',
        'Playtesting preliminar',
      ],
      nextMilestone: 'Reunión de arranque en el laboratorio',
      lastUpdate: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProject);
    onClose();
    onRequireConstructionNotice('dar de alta y proponer proyectos');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400/60 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Proponer Nuevo Proyecto</h2>
              <p className="text-xs text-slate-400">FLC LAB · IES Fernando Lázaro Carreter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Título del Proyecto *
            </label>
            <input
              type="text"
              placeholder="Ej: Aventura Minera en Realidad Virtual, Rover Solar..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Discipline and Trimester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Disciplina Creativa *
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as DisciplineId)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Trimestre de Presentación *
              </label>
              <select
                value={trimester}
                onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1}>1T (Oct - Dic) · Idea y Planificación</option>
                <option value={2}>2T (Ene - Mar) · Prototipado y Desarrollo</option>
                <option value={3}>3T (Abr - Jun) · Feria y Demo Pública</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Descripción y Enfoque del Proyecto *
            </label>
            <textarea
              rows={3}
              placeholder="¿De qué trata? ¿Qué problema o experiencia crea? ¿Cómo se jugará o funcionará?"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Objectives */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Objetivos Clave (un objetivo por línea)
            </label>
            <textarea
              rows={2}
              placeholder="Construir el primer prototipo funcional&#10;Grabar banda sonora de 3 pistas&#10;Testear con 10 alumnos del centro"
              value={objectivesInput}
              onChange={(e) => setObjectivesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Team Lead Info */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
              Coordinador / Persona que Propone
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre y apellidos"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Colectivo
                </label>
                <select
                  value={leadGroup}
                  onChange={(e) => setLeadGroup(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Alumnado">Alumnado</option>
                  <option value="Profesorado">Profesorado</option>
                  <option value="Familia">Familia</option>
                  <option value="Mentor Externo">Mentor Externo / Entidad</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Curso o Departamento
                </label>
                <input
                  type="text"
                  placeholder="Ej: 3º ESO A / Dpto. Tecnología / Padre"
                  value={leadGradeOrDept}
                  onChange={(e) => setLeadGradeOrDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tu Rol Principal
                </label>
                <select
                  value={leadRole}
                  onChange={(e) => setLeadRole(e.target.value as RoleId)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Open Roles selection */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5">
              ¿Qué roles necesitas incorporar al equipo?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map((role) => {
                const isSelected = selectedOpenRoles.includes(role.id);
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleToggle(role.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {role.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md shadow-amber-400/20"
            >
              Publicar Proyecto en el Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
