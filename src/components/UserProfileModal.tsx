import React, { useState, useEffect } from 'react';
import { UserProfile, Project, LabEvent, RoleId, DisciplineId } from '../types/flc';
import { ROLES, DISCIPLINES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import {
  X,
  User,
  Crown,
  Sparkles,
  Calendar,
  Layers,
  Award,
  School,
  ChevronRight,
  FolderKanban,
  Edit2,
  Save,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  UserMinus,
  Mail,
  Building,
  KeyRound,
  Shield,
  Palette
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  profileUser?: UserProfile | null;
  onSwitchToUser?: (user: UserProfile) => void;
  projects: Project[];
  events: LabEvent[];
  onOpenProjectDetail: (project: Project) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onUnenrollProject?: (projectId: string) => void;
  onUnenrollEvent?: (eventId: string) => void;
}

const AVATAR_COLORS = [
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#F97316', // Orange
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profileUser,
  onSwitchToUser,
  projects,
  events,
  onOpenProjectDetail,
  onUpdateUser,
  onUnenrollProject,
  onUnenrollEvent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states for editing
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formGradeOrDept, setFormGradeOrDept] = useState('');
  const [formOrganization, setFormOrganization] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPrimaryRole, setFormPrimaryRole] = useState<RoleId>('project_lead');
  const [formSecondaryRoles, setFormSecondaryRoles] = useState<RoleId[]>([]);
  const [formFavoriteDisciplines, setFormFavoriteDisciplines] = useState<DisciplineId[]>([]);
  const [formSkills, setFormSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [formAvatarColor, setFormAvatarColor] = useState('#F59E0B');
  const [editError, setEditError] = useState<string | null>(null);

  const activeProfile = profileUser || currentUser;
  const isViewingSelf = activeProfile.id === currentUser.id;
  const canEdit = Boolean(isViewingSelf || currentUser.isAdmin);

  useEffect(() => {
    if (activeProfile) {
      setFormName(activeProfile.name || '');
      setFormHandle(activeProfile.handle || '');
      setFormEmail(activeProfile.email || '');
      setFormPassword(activeProfile.password || '');
      setFormGradeOrDept(activeProfile.gradeOrDept || '');
      setFormOrganization(activeProfile.organization || '');
      setFormBio(activeProfile.bio || '');
      setFormPrimaryRole(activeProfile.primaryRole || 'project_lead');
      setFormSecondaryRoles(Array.isArray(activeProfile.secondaryRoles) ? activeProfile.secondaryRoles.slice(0, 2) : []);
      setFormFavoriteDisciplines(Array.isArray(activeProfile.favoriteDisciplines) ? activeProfile.favoriteDisciplines : []);
      setFormSkills(Array.isArray(activeProfile.skillsAndTools) ? activeProfile.skillsAndTools : []);
      setFormAvatarColor(activeProfile.avatarColor || '#F59E0B');
      setIsEditing(false);
      setEditError(null);
    }
  }, [activeProfile, isOpen]);

  if (!isOpen) return null;

  const primaryRoleObj = ROLES.find((r) => r.id === activeProfile.primaryRole) || ROLES[0];

  const userProjects = projects.filter((p) =>
    activeProfile.projectIds?.includes(p.id) ||
    p.enrolledUserIds?.includes(activeProfile.id) ||
    p.team.some((m) => m.name.toLowerCase().includes(activeProfile.name.toLowerCase().split(' ')[0]))
  );

  const userEvents = events.filter((e) =>
    activeProfile.registeredEventIds?.includes(e.id) ||
    e.registeredUserIds?.includes(activeProfile.id) ||
    (isViewingSelf && e.isRegistered)
  );

  const handleToggleSecondaryRole = (roleId: RoleId) => {
    if (roleId === formPrimaryRole) return; // Cannot be primary and secondary at same time
    if (formSecondaryRoles.includes(roleId)) {
      setFormSecondaryRoles(formSecondaryRoles.filter((r) => r !== roleId));
    } else {
      if (formSecondaryRoles.length >= 2) {
        setEditError('Puedes asignar un máximo de 2 roles secundarios.');
        return;
      }
      setEditError(null);
      setFormSecondaryRoles([...formSecondaryRoles, roleId]);
    }
  };

  const handleToggleDiscipline = (discId: DisciplineId) => {
    if (formFavoriteDisciplines.includes(discId)) {
      setFormFavoriteDisciplines(formFavoriteDisciplines.filter((d) => d !== discId));
    } else {
      setFormFavoriteDisciplines([...formFavoriteDisciplines, discId]);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!formSkills.includes(trimmed)) {
      setFormSkills([...formSkills, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormSkills(formSkills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setEditError('El nombre no puede estar vacío.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setEditError('Por favor introduce un correo electrónico válido.');
      return;
    }

    // Clean handle
    let formattedHandle = formHandle.trim();
    if (!formattedHandle.startsWith('@')) {
      formattedHandle = `@${formattedHandle}`;
    }

    // Secondary roles cannot contain the primary role
    const cleanedSecondary = formSecondaryRoles.filter((r) => r !== formPrimaryRole).slice(0, 2);

    const updatedUser: UserProfile = {
      ...activeProfile,
      name: formName.trim(),
      handle: formattedHandle,
      email: formEmail.trim(),
      password: formPassword.trim() || activeProfile.password || 'iesutrillas2026',
      gradeOrDept: formGradeOrDept.trim(),
      organization: formOrganization.trim() || undefined,
      bio: formBio.trim(),
      primaryRole: formPrimaryRole,
      secondaryRoles: cleanedSecondary,
      favoriteDisciplines: formFavoriteDisciplines,
      skillsAndTools: formSkills,
      avatarColor: formAvatarColor,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setIsEditing(false);
    setEditError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-5 sm:p-8 my-6 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              <User className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isEditing
                  ? 'Modo Edición · Actualizar mi Ficha'
                  : isViewingSelf
                  ? 'Mi Ficha Personal · Usuario Activo'
                  : `Ficha de Creador · ${activeProfile.name}`}
              </span>
              <span className="text-[11px] text-slate-400">
                {isEditing
                  ? 'Personaliza tus datos, contraseña, rol principal y hasta dos roles secundarios.'
                  : isViewingSelf
                  ? 'Estás en sesión con este usuario. Comprueba y gestiona tus competencias, proyectos y citas.'
                  : 'Ficha de muestra. Puedes activar su vista para ver cómo se transforma la plataforma.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                title="Editar todos los datos de mi ficha"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar mi Ficha</span>
              </button>
            )}

            {!isViewingSelf && onSwitchToUser && !isEditing && (
              <button
                onClick={() => {
                  onSwitchToUser(activeProfile);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-transform active:scale-95 border border-slate-700 cursor-pointer"
                title={`Cambiar sesión activa a ${activeProfile.name}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver como {activeProfile.name.split(' ')[0]}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* -------------------- EDIT MODE FORM -------------------- */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {editError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between">
                <span>{editError}</span>
                <button
                  type="button"
                  onClick={() => setEditError(null)}
                  className="text-rose-400 hover:text-white font-bold ml-2 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* Basic Info: Name, Handle, Email, Password */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Datos Básicos y Seguridad</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Lucas García"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de Usuario (@handle)</label>
                  <input
                    type="text"
                    required
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="Ej. @lucas_3d"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="correo@iesutrillas.es"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contraseña / Clave de Acceso</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Nueva contraseña..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      title={showPassword ? 'Ocultar clave' : 'Ver clave'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span>Curso, Nivel o Departamento</span>
                  </label>
                  <input
                    type="text"
                    value={formGradeOrDept}
                    onChange={(e) => setFormGradeOrDept(e.target.value)}
                    placeholder="Ej. 3º ESO A / Dpto. Tecnología"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Organización / Entidad (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formOrganization}
                    onChange={(e) => setFormOrganization(e.target.value)}
                    placeholder="Ej. AMPA / Empresa Colaboradora"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Color de Identidad / Avatar</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormAvatarColor(c)}
                      className={`w-8 h-8 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        formAvatarColor === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {formAvatarColor === c && <CheckCircle2 className="w-4 h-4 text-slate-950 font-black" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                Sobre el Creador / Perfil Personal
              </label>
              <textarea
                rows={3}
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                placeholder="Cuéntanos tus intereses, qué proyectos te gustaría desarrollar y qué te apasiona..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            {/* Primary Role & Up to 2 Secondary Roles */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Rol Principal en el Laboratorio</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Define tu vocación prioritaria dentro de los equipos de proyecto.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROLES.map((r) => {
                  const isPrimary = formPrimaryRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setFormPrimaryRole(r.id);
                        // Remove from secondary if it was there
                        setFormSecondaryRoles(formSecondaryRoles.filter((sid) => sid !== r.id));
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isPrimary
                          ? 'bg-amber-400/20 border-amber-400 shadow-md shadow-amber-400/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <DynamicIcon name={r.iconName} className="w-4 h-4" style={{ color: r.color }} />
                        {isPrimary && <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">Principal</span>}
                      </div>
                      <div className="text-xs font-bold text-white leading-tight">{r.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Roles (Up to 2) */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Roles Secundarios (Hasta 2)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formSecondaryRoles.length} / 2 seleccionados
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Complementa tu perfil con hasta dos roles secundarios adicionales en los que también aportas valor.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {ROLES.map((r) => {
                    if (r.id === formPrimaryRole) return null; // Cannot be primary and secondary
                    const isSecondary = formSecondaryRoles.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleToggleSecondaryRole(r.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSecondary
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <DynamicIcon name={r.iconName} className="w-3.5 h-3.5 shrink-0" style={{ color: r.color }} />
                        <span className="text-xs font-semibold truncate">{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Maker Disciplines & Skills */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  <span>Disciplinas Maker Favoritas</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {DISCIPLINES.map((d) => {
                    const isFav = formFavoriteDisciplines.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleToggleDiscipline(d.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isFav
                            ? 'bg-slate-800 text-white border-amber-400 shadow-sm'
                            : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isFav ? '✓ ' : ''}{d.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills and Tools List Editor */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-amber-400">
                  Habilidades Técnicas, Herramientas y Materiales
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Ej. Godot, Arduino, Blender, Impresión 3D, Soldadura..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow"
                  >
                    Añadir
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                        title="Eliminar habilidad"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formSkills.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No hay habilidades añadidas todavía.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditError(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-transform active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        ) : (
          /* -------------------- VIEW MODE -------------------- */
          <>
            {/* Profile Card Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center sm:text-left">
              <div className="relative shrink-0">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl text-slate-950 shadow-xl border-2 border-white/20"
                  style={{ backgroundColor: activeProfile.avatarColor }}
                >
                  {activeProfile.name.charAt(0).toUpperCase()}
                </div>
                {activeProfile.isAdmin && (
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-950 border border-amber-400 text-amber-400" title="Administrador FLC LAB">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                )}
              </div>

              {/* Core Info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-white">{activeProfile.name}</h3>
                    <p className="text-xs font-mono text-amber-400 font-bold">{activeProfile.handle}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      {activeProfile.group === 'alumnado'
                        ? '🎒 Alumnado'
                        : activeProfile.group === 'profesorado'
                        ? '🎓 Profesorado'
                        : activeProfile.group === 'familias'
                        ? '🏡 Familias (AMPA)'
                        : '🏢 Empresa / Entidad'}
                    </span>

                    {activeProfile.isAdmin && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        🛡️ Admin
                      </span>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar Ficha</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Department / Grade / Organization */}
                <div className="space-y-1 text-xs text-slate-300">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <School className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{activeProfile.gradeOrDept || 'Miembro del centro'}</span>
                  </p>
                  {activeProfile.organization && (
                    <p className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                      <span className="font-semibold text-slate-300">Entidad / Colectivo:</span>
                      <span>{activeProfile.organization}</span>
                    </p>
                  )}
                  {isViewingSelf && (
                    <>
                      <p className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activeProfile.email}</span>
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-300 font-semibold">Clave de acceso:</span>
                        <span className="font-mono text-slate-300">••••••••</span>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline cursor-pointer ml-1"
                        >
                          (Modificar contraseña)
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sobre el Creador / Perfil
              </h4>
              <p className="text-slate-200 text-sm leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                {activeProfile.bio || 'Este creador aún no ha completado su descripción.'}
              </p>
            </div>

            {/* Roles & Competencies: Primary and Up to 2 Secondary Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Rol Principal en el Lab</span>
                </h4>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
                    style={{ backgroundColor: `${primaryRoleObj.color}25`, color: primaryRoleObj.color }}
                  >
                    <DynamicIcon name={primaryRoleObj.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{primaryRoleObj.name}</p>
                    <p className="text-xs text-slate-400">{primaryRoleObj.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Secondary Roles Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Roles Secundarios ({activeProfile.secondaryRoles?.length || 0} / 2)</span>
                </h4>
                {activeProfile.secondaryRoles && activeProfile.secondaryRoles.length > 0 ? (
                  <div className="flex flex-col gap-2 pt-0.5">
                    {activeProfile.secondaryRoles.slice(0, 2).map((roleId) => {
                      const rObj = ROLES.find((r) => r.id === roleId);
                      if (!rObj) return null;
                      return (
                        <div key={roleId} className="flex items-center gap-2 text-xs">
                          <DynamicIcon name={rObj.iconName} className="w-3.5 h-3.5" style={{ color: rObj.color }} />
                          <span className="font-bold text-white">{rObj.name}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400 text-[11px] truncate">{rObj.subtitle}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic pt-1">
                    No tiene roles secundarios asignados. {canEdit && 'Puedes asignarte hasta dos editando tu ficha.'}
                  </p>
                )}
              </div>
            </div>

            {/* Maker Disciplines */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                <span>Disciplinas Maker Favoritas</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeProfile.favoriteDisciplines && activeProfile.favoriteDisciplines.length > 0 ? (
                  activeProfile.favoriteDisciplines.map((discId) => {
                    const discObj = DISCIPLINES.find((d) => d.id === discId);
                    if (!discObj) return null;
                    return (
                      <span
                        key={discId}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-950"
                        style={{ backgroundColor: discObj.color }}
                      >
                        {discObj.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500 italic">No ha seleccionado disciplinas favoritas todavía.</span>
                )}
              </div>
            </div>

            {/* Skills & Tools */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Habilidades Técnicas, Herramientas & Materiales</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProfile.skillsAndTools && activeProfile.skillsAndTools.length > 0 ? (
                  activeProfile.skillsAndTools.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No hay habilidades registradas.</span>
                )}
              </div>
            </div>

            {/* Badges Earned */}
            {activeProfile.badgeTitles && activeProfile.badgeTitles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Insignias de Reconocimiento Maker ({activeProfile.badgeTitles.length})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.badgeTitles.map((badge, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1.5"
                    >
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tracker with Unenroll Option */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-amber-400" />
                  <span>Proyectos Vinculados ({userProjects.length})</span>
                </span>
                {isViewingSelf && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    Puedes desapuntarte de los proyectos en los que participas
                  </span>
                )}
              </h4>

              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userProjects.map((p) => {
                    const discObj = DISCIPLINES.find((d) => d.id === p.discipline);
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div
                          onClick={() => {
                            onClose();
                            onOpenProjectDetail(p);
                          }}
                          className="cursor-pointer space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: discObj?.color || '#FACC15' }}
                            />
                            <p className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                              {p.title}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Fase {p.phase} · Trimestre {p.trimester}T
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenProjectDetail(p);
                            }}
                            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Ver Ficha</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {isViewingSelf && onUnenrollProject && p.leaderId !== currentUser.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`¿Estás seguro de que deseas desapuntarte del proyecto "${p.title}"?`)) {
                                  onUnenrollProject(p.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Desapuntarme de este proyecto"
                            >
                              <UserMinus className="w-3 h-3" />
                              <span>Desapuntarme</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-950 border border-slate-800">
                  Aún no participa en ningún proyecto activo.
                </p>
              )}
            </div>

            {/* Events Registered with Cancel Attendance Option */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Sesiones y Talleres con Inscripción ({userEvents.length})</span>
                </span>
                {isViewingSelf && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    Puedes cancelar tu asistencia si no puedes acudir
                  </span>
                )}
              </h4>

              {userEvents.length > 0 ? (
                <div className="space-y-2">
                  {userEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{e.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {e.date} · {e.time} · {e.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Inscrito
                        </span>

                        {isViewingSelf && onUnenrollEvent && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Deseas desapuntarte y cancelar tu asistencia a "${e.title}"?`)) {
                                onUnenrollEvent(e.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Cancelar asistencia a esta cita"
                          >
                            <UserMinus className="w-3 h-3" />
                            <span>Desapuntarme</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-950 border border-slate-800">
                  No tiene inscripciones activas a eventos.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
