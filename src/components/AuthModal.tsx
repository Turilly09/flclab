import React, { useState } from 'react';
import { UserProfile, CollaboratorGroup, RoleId, DisciplineId } from '../types/flc';
import { ROLES, DISCIPLINES } from '../data/flcInitialData';
import { DynamicIcon } from './DynamicIcon';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Building2,
  Home,
  GraduationCap,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  allUsers: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  allUsers,
  onLogin,
  onRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regGroup, setRegGroup] = useState<CollaboratorGroup>('alumnado');
  const [regGradeOrDept, setRegGradeOrDept] = useState('');
  const [regOrganization, setRegOrganization] = useState('');
  const [regPrimaryRole, setRegPrimaryRole] = useState<RoleId>('tecnologia');
  const [regSecondaryRoles, setRegSecondaryRoles] = useState<RoleId[]>(['diseno']);
  const [regFavoriteDisciplines, setRegFavoriteDisciplines] = useState<DisciplineId[]>([
    'videojuegos',
    'robotica',
  ]);
  const [regSkillsInput, setRegSkillsInput] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regAdminCode, setRegAdminCode] = useState('');
  const [requestAdminRole, setRequestAdminRole] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanId = loginIdentifier.trim().toLowerCase();
    if (!cleanId) {
      setLoginError('Introduce tu correo electrónico o nombre de usuario (@handle).');
      return;
    }
    if (!loginPassword) {
      setLoginError('Por favor introduce tu contraseña.');
      return;
    }

    // Find user by email or handle
    const user = allUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.handle.toLowerCase() === cleanId ||
        u.handle.toLowerCase() === (cleanId.startsWith('@') ? cleanId : `@${cleanId}`)
    );

    if (!user) {
      setLoginError(
        'No existe ninguna cuenta registrada con ese correo o usuario. Puedes darte de alta en la pestaña «Crear Cuenta».'
      );
      return;
    }

    // Password check (special protection for Administrator)
    if (user.isAdmin || user.id === 'admin-flc' || user.email.toLowerCase() === 'admin@iesflc.es') {
      if (loginPassword !== 'iesutrillas2026') {
        setLoginError('Contraseña de administrador incorrecta. Por favor inténtalo de nuevo.');
        return;
      }
    } else {
      if (user.password && loginPassword !== user.password) {
        setLoginError('La contraseña introducida no es correcta. Por favor inténtalo de nuevo.');
        return;
      }
    }

    if (user.group === 'profesorado' && !user.isAdmin && user.teacherStatus === 'rechazado') {
      setLoginError('Tu solicitud de cuenta docente fue rechazada por la Administración del centro. Consulta con el coordinador.');
      return;
    }

    onLogin(user);
    onClose();
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Por favor indica tu nombre completo o el de tu organización.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Por favor introduce una dirección de correo electrónico válida (Gmail, Outlook, corporativa, etc.).');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Check if email already registered
    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (emailExists) {
      setRegError('Ya existe una cuenta con este correo electrónico. Inicia sesión en su lugar.');
      return;
    }

    const cleanHandle = regHandle.trim()
      ? regHandle.trim().startsWith('@')
        ? regHandle.trim()
        : `@${regHandle.trim()}`
      : `@${regName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const skillsList = regSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Teacher admission check: either validated via key or set to pending for Admin admission
    const isTeacher = regGroup === 'profesorado';
    let teacherStatus: 'pendiente' | 'aprobado' | undefined = undefined;
    if (isTeacher) {
      if (regAdminCode.trim() === 'iesutrillas2026') {
        teacherStatus = 'aprobado';
      } else {
        teacherStatus = 'pendiente';
      }
    }

    const badges: string[] = [];
    if (regGroup === 'alumnado') {
      badges.push('🎒 Alumnado FLC', '🌱 Creador Activo');
    } else if (regGroup === 'profesorado') {
      badges.push(
        '🎓 Docente FLC',
        teacherStatus === 'aprobado' ? '✅ Docente Admitido' : '⏳ Pendiente de Admisión'
      );
    } else if (regGroup === 'familias') {
      badges.push('🏡 Familia Maker FLC', '🤝 Comunidad');
    } else if (regGroup === 'entidades_externas') {
      badges.push('🏢 Entidad Colaboradora', '⚡ Mentor Industrial');
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      handle: cleanHandle,
      email: regEmail.trim(),
      password: regPassword,
      group: regGroup,
      gradeOrDept:
        regGradeOrDept.trim() ||
        (regGroup === 'alumnado'
          ? 'Alumnado IES'
          : regGroup === 'familias'
          ? 'Familia Colaboradora'
          : regGroup === 'entidades_externas'
          ? 'Empresa / Entidad Externa'
          : 'Dpto. Docente'),
      organization: regOrganization.trim() || undefined,
      roleType: 'creador',
      isAdmin: false,
      teacherStatus,
      primaryRole: regPrimaryRole,
      secondaryRoles: regSecondaryRoles,
      favoriteDisciplines: regFavoriteDisciplines,
      skillsAndTools: skillsList.length > 0 ? skillsList : ['Creatividad', 'Ganas de aprender'],
      bio:
        regBio.trim() ||
        (regGroup === 'familias'
          ? 'Familia participando activamente en el espacio maker del centro.'
          : regGroup === 'entidades_externas'
          ? 'Entidad colaboradora apoyando con retos, recursos o mentorías.'
          : 'Miembro del laboratorio de creación FLC LAB.'),
      badgeTitles: badges,
      projectIds: [],
      registeredEventIds: [],
      avatarColor: ROLES.find((r) => r.id === regPrimaryRole)?.color || '#FACC15',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegister(newUser);
    onClose();
  };

  const groupOptions: {
    id: CollaboratorGroup;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'alumnado',
      label: 'Alumnado',
      sublabel: 'Estudiantes de ESO, Bachillerato o Ciclos Formativos',
      icon: <GraduationCap className="w-5 h-5" />,
      color: '#FACC15',
    },
    {
      id: 'profesorado',
      label: 'Profesorado',
      sublabel: 'Docentes, mentores y coordinadores del centro',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: '#3B82F6',
    },
    {
      id: 'familias',
      label: 'Familias',
      sublabel: 'Madres, padres y tutores de la comunidad',
      icon: <Home className="w-5 h-5" />,
      color: '#8B5CF6',
    },
    {
      id: 'entidades_externas',
      label: 'Empresas & Entidades',
      sublabel: 'Empresas locales, asociaciones, exalumnos y entidades',
      icon: <Building2 className="w-5 h-5" />,
      color: '#EC4899',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header with Tab switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('login')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Cuenta</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB 1: INICIAR SESIÓN */}
        {activeTab === 'login' && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-black text-white">Acceso a FLC LAB</h3>
              <p className="text-xs text-slate-400">
                Inicia sesión con tu cuenta de alumno, docente, familia o empresa colaboradora.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Correo Electrónico o Usuario (@handle)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ej: lucas.royo@correo.es o @lucas_maker"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-400">Cualquier clave de prueba válida</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-tight transition-transform active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar al Laboratorio</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CREAR CUENTA */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-black text-white">Alta de Creador o Entidad</h3>
              <p className="text-xs text-slate-400">
                Abierto a alumnado, profesorado, familias de Utrillas y empresas colaboradoras.
              </p>
            </div>

            {regError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {/* Step 1: Select Group */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. ¿A qué colectivo perteneces? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {groupOptions.map((opt) => {
                  const isSelected = regGroup === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRegGroup(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-slate-950 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="p-2 rounded-lg shrink-0 mt-0.5"
                        style={{
                          backgroundColor: `${opt.color}20`,
                          color: opt.color,
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          {opt.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Personal & Contact Info */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Datos de Acceso y Contacto
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {regGroup === 'entidades_externas' ? 'Razón Social / Nombre' : 'Nombre Completo'} *
                  </label>
                  <input
                    type="text"
                    placeholder={
                      regGroup === 'entidades_externas'
                        ? 'Ej: Automatismos Utrillas S.L.'
                        : 'Ej: Carlos García'
                    }
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Correo Electrónico (Cualquier dominio válido) *
                  </label>
                  <input
                    type="email"
                    placeholder="ej: usuario@gmail.com, info@empresa.es..."
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Mínimo 4 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {regGroup === 'alumnado'
                      ? 'Curso / Grupo (ej: 4º ESO B)'
                      : regGroup === 'familias'
                      ? 'Vínculo (ej: Padre de alumno en 2º ESO)'
                      : regGroup === 'entidades_externas'
                      ? 'Sector / Especialidad'
                      : 'Departamento / Especialidad'}
                  </label>
                  <input
                    type="text"
                    placeholder="Indica tu grupo o función..."
                    value={regGradeOrDept}
                    onChange={(e) => setRegGradeOrDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Organization name for external entities or associations */}
              {(regGroup === 'entidades_externas' || regGroup === 'familias') && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Empresa, Asociación o Colectivo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Asociación de Vecinos, Cuencas Tech S.L., etc."
                    value={regOrganization}
                    onChange={(e) => setRegOrganization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Teacher admission notice and optional center key */}
              {regGroup === 'profesorado' && (
                <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Validación de Docencia Requerida</p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Para evitar accesos no autorizados al rol docente, tu cuenta quedará registrada y deberá ser <strong className="text-blue-300">admitida expresamente por el Administrador</strong> antes de habilitar tus permisos de coordinación.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Clave de Validación del Centro (Opcional)
                    </label>
                    <input
                      type="password"
                      placeholder="Si dispones de la clave del centro, escríbela aquí..."
                      value={regAdminCode}
                      onChange={(e) => setRegAdminCode(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Si no dispones de la clave, deja este campo en blanco. Tu cuenta quedará en espera y el Administrador la admitirá desde su panel.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Maker Profile */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Rol Maker y Qué puedes aportar
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Rol Principal en el Laboratorio
                </label>
                <select
                  value={regPrimaryRole}
                  onChange={(e) => setRegPrimaryRole(e.target.value as RoleId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.subtitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Habilidades, Herramientas o Recursos (separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Impresión 3D, Arduino, Costura, Soldadura, Redacción, C++..."
                  value={regSkillsInput}
                  onChange={(e) => setRegSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Breve Bio o Qué te gustaría hacer en el laboratorio
                </label>
                <textarea
                  rows={2}
                  placeholder="Cuéntanos en 2 líneas qué te motiva de FLC LAB..."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Completar Alta y Entrar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
