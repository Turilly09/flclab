import React, { useState } from 'react';
import { CollaborationRequest, CollaboratorGroup, RoleId, DisciplineId, UserProfile } from '../types/flc';
import { ROLES, DISCIPLINES } from '../data/flcInitialData';
import { X, HeartHandshake, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CollabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCollab: (request: CollaborationRequest) => void;
  onRequireConstructionNotice: (actionTitle: string) => void;
  preselectedRoleId?: RoleId | null;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const CollabModal: React.FC<CollabModalProps> = ({
  isOpen,
  onClose,
  onSubmitCollab,
  onRequireConstructionNotice,
  preselectedRoleId = null,
  currentUser = null,
  onOpenAuthModal,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [group, setGroup] = useState<CollaboratorGroup>(currentUser?.group || 'alumnado');
  const [gradeOrEntity, setGradeOrEntity] = useState(currentUser?.gradeOrDept || currentUser?.organization || '');
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>(
    preselectedRoleId ? [preselectedRoleId] : ['diseno']
  );
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineId[]>(['videojuegos']);
  const [motivation, setMotivation] = useState('');
  const [projectProposal, setProjectProposal] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Guest users are strictly prevented from proposing collaborations or projects
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400/40 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Identificación Requerida</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Para garantizar la autenticidad y trazabilidad de las iniciativas, los usuarios invitados no pueden enviar propuestas de colaboración ni proyectos. Debes iniciar sesión o darte de alta en FLC LAB.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-amber-400/20"
            >
              Iniciar Sesión / Alta
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRoleToggle = (roleId: RoleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleDisciplineToggle = (discId: DisciplineId) => {
    if (selectedDisciplines.includes(discId)) {
      setSelectedDisciplines(selectedDisciplines.filter((d) => d !== discId));
    } else {
      setSelectedDisciplines([...selectedDisciplines, discId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica tu nombre o el de tu entidad.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor introduce un correo de contacto válido.');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Por favor selecciona al menos un rol de tu interés.');
      return;
    }
    if (!motivation.trim()) {
      setError('Cuéntanos brevemente qué te gustaría aportar o aprender.');
      return;
    }

    const newCollab: CollaborationRequest = {
      id: `collab-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      group,
      gradeOrEntity: gradeOrEntity.trim() || 'Comunidad FLC',
      rolesInterest: selectedRoles,
      disciplinesInterest: selectedDisciplines,
      motivation: motivation.trim(),
      projectProposal: projectProposal.trim() || undefined,
      status: 'pendiente',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmitCollab(newCollab);
    onClose();
    onRequireConstructionNotice('inscribirse y darse de alta en el laboratorio');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400/60 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Unirse / Colaborar en FLC LAB</h2>
              <p className="text-xs text-slate-400">IES Fernando Lázaro Carreter · Utrillas</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Nombre y Apellidos / Entidad *
              </label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="ejemplo@iesutrillas.es / correo@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Colectivo
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as CollaboratorGroup)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="alumnado">Alumnado (1º ESO a FP)</option>
                <option value="profesorado">Profesorado (cualquier departamento)</option>
                <option value="familias">Familias / Tutores</option>
                <option value="entidades_externas">Entidad externa / Empresa / Exalumno</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">
                Curso / Departamento / Empresa
              </label>
              <input
                type="text"
                placeholder="Ej: 3º ESO B, Dpto. Lengua, Taller mecánico..."
                value={gradeOrEntity}
                onChange={(e) => setGradeOrEntity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Roles Selector */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              ¿En qué roles te gustaría colaborar o formarte? *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role.id);
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

          {/* Disciplines Selector */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Disciplinas de Interés
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DISCIPLINES.map((disc) => {
                const isSelected = selectedDisciplines.includes(disc.id);
                return (
                  <button
                    key={disc.id}
                    type="button"
                    onClick={() => handleDisciplineToggle(disc.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {disc.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">
              ¿Por qué te gustaría participar? / ¿Qué conocimientos o ganas aportas? *
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Me gustaría aprender a modelar en 3D y ayudar a pintar miniaturas para los juegos..."
              value={motivation}
              onChange={(e) => {
                setMotivation(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">
              ¿Tienes alguna propuesta o idea de proyecto? (Opcional)
            </label>
            <input
              type="text"
              placeholder="Idea de juego, robot, podcast, etc."
              value={projectProposal}
              onChange={(e) => setProjectProposal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

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
              Enviar Solicitud al FLC LAB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
