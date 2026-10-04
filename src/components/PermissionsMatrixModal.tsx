import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  GraduationCap,
  Home,
  Building2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  BookOpen,
  Users,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CollaboratorGroup, UserProfile } from '../types/flc';

interface PermissionsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onRequestTeacherAccess?: (onSuccess: () => void) => void;
  onOpenAuthModal: (tab: 'login' | 'register') => void;
  onLogout: () => void;
}

export const PermissionsMatrixModal: React.FC<PermissionsMatrixModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSwitchUser,
  onRequestTeacherAccess,
  onOpenAuthModal,
  onLogout,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<CollaboratorGroup | 'admin' | 'public'>(
    currentUser?.isAdmin ? 'admin' : currentUser?.group || 'admin'
  );

  if (!isOpen) return null;

  const rolesDetails = [
    {
      id: 'admin' as const,
      title: 'Administrador / Coordinador Principal',
      sampleName: 'Administrador FLC',
      sampleId: 'admin',
      color: '#10B981',
      badge: 'Control Total',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description:
        'Superusuario responsable del espacio maker y la gobernanza del centro. Dispone de privilegios totales de administración, publicación, copias de seguridad y validación de personal docente.',
      canCreate: [
        'Crear proyectos oficiales del centro con máxima jerarquía.',
        'Convocar talleres, masterclasses, hitos trimestrales y ferias en la agenda.',
        'Publicar comunicados oficiales y bitácoras institucionales.',
        'Admitir o rechazar solicitudes de registro de Profesorado.',
        'Aprobar o desestimar propuestas de colaboración de alumnos, familias y empresas.',
      ],
      canModify: [
        'Cambiar la fase de cualquier proyecto (Ideación -> Fabricación -> Feria).',
        'Asignar o reasignar líderes de proyectos entre los alumnos y docentes.',
        'Editar fechas, aforos, ubicaciones o descripción de cualquier evento.',
        'Restaurar o exportar copias de seguridad del laboratorio.',
      ],
      restrictions: [
        'Debe custodiar la clave de acceso de administración institucional.',
      ],
    },
    {
      id: 'profesorado' as const,
      title: 'Profesorado / Docente (Admitido)',
      sampleName: 'Docente FLC',
      sampleId: 'profesorado',
      color: '#3B82F6',
      badge: 'Admisión Obligatoria',
      icon: <GraduationCap className="w-5 h-5 text-blue-400" />,
      description:
        'Profesorado del centro (departamentos didácticos y FP). Por seguridad, requiere admisión previa del Administrador para activar sus facultades docentes y coordinar proyectos.',
      canCreate: [
        'Crear y coordinar proyectos oficiales vinculados a materias y módulos.',
        'Convocar sesiones de trabajo, talleres y pruebas técnicas en el calendario.',
        'Publicar entradas de bitácora y pautas metodológicas en proyectos asignados.',
        'Añadir notas de evaluación formativa y asesoramiento a los alumnos creadores.',
      ],
      canModify: [
        'Validar y marcar entregables completados en los proyectos que coordina.',
        'Gestionar vacantes y roles abiertos de su equipo de proyecto.',
        'Inscribirse y convocar eventos en los espacios del laboratorio.',
      ],
      restrictions: [
        'Requiere admisión obligatoria por el Administrador para desbloquear privilegios docentes.',
        'No puede admitir a otros docentes ni alterar proyectos de otros departamentos sin coordinación.',
      ],
    },
    {
      id: 'alumnado' as const,
      title: 'Alumnado Maker',
      sampleName: 'Alumnado del Centro',
      sampleId: 'alumnado',
      color: '#FACC15',
      badge: 'Creador Activo',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      description:
        'Estudiantes de ESO, Bachillerato y FP del IES. Son los protagonistas de la creación física y digital de prototipos, videojuegos y robots.',
      canCreate: [
        'Proponer nuevas ideas de proyectos (quedan en fase de revisión para el coordinador).',
        'Publicar entradas de bitácora en los proyectos donde participa activamente.',
        'Enviar solicitudes para incorporarse a vacantes de roles abiertos (Diseño, Programación, 3D, etc.).',
      ],
      canModify: [
        'Marcar como completados los entregables del proyecto donde es miembro.',
        'Actualizar su propia ficha de creador (bio, herramientas, disciplinas favoritas).',
        'Inscribirse o desapuntarse libremente de talleres y sesiones con plazas limitadas.',
      ],
      restrictions: [
        'No puede crear proyectos oficiales sin revisión del docente.',
        'No puede modificar ni eliminar eventos del calendario general.',
        'No puede aprobar solicitudes de otros usuarios.',
      ],
    },
    {
      id: 'familias' as const,
      title: 'Familias & Comunidad',
      sampleName: 'Familias & AMPA',
      sampleId: 'familias',
      color: '#8B5CF6',
      badge: 'Apoyo & Difusión',
      icon: <Home className="w-5 h-5 text-purple-400" />,
      description:
        'Madres, padres y tutores de Utrillas y la comarca. Aportan apoyo en la fabricación artesanal, vestuario, eventos, difusión y organización de la feria.',
      canCreate: [
        'Proponer iniciativas o talleres familiares (ej: montaje de maquetas, corte textil, juegos de mesa).',
        'Ofrecer apoyo para la Feria Maker del 3er trimestre.',
        'Publicar notas de progreso en proyectos comunitarios donde colaboren.',
      ],
      canModify: [
        'Editar su ficha personal y datos de contacto de familia/asociación.',
        'Inscribirse a jornadas de puertas abiertas, talleres familiares y eventos.',
      ],
      restrictions: [
        'No pueden editar la configuración técnica de los proyectos del alumnado.',
        'No disponen de acceso al panel de administración del centro.',
      ],
    },
    {
      id: 'entidades_externas' as const,
      title: 'Empresas & Entidades Externas',
      sampleName: 'Empresas & Entidades',
      sampleId: 'entidades_externas',
      color: '#EC4899',
      badge: 'Mentoría & Retos',
      icon: <Building2 className="w-5 h-5 text-pink-400" />,
      description:
        'Empresas tecnológicas, industrias comarcales, asociaciones y ayuntamientos. Conectan el laboratorio con el mundo profesional.',
      canCreate: [
        'Proponer "Retos Tecnológicos Reales" (ej: telemetría ambiental en minas, robótica de clasificación).',
        'Ofrecer donación de componentes electrónicos, bobinas 3D o herramientas de precisión.',
        'Proponer masterclasses impartidas por profesionales del sector.',
      ],
      canModify: [
        'Añadir notas de mentoría técnica o feedback sobre prototipos que apadrinen.',
        'Gestionar la información de su entidad, sector y tecnologías que dominan.',
      ],
      restrictions: [
        'Los retos propuestos deben ser aprobados pedagógicamente por el profesorado.',
        'No pueden alterar las evaluaciones ni calificaciones de los alumnos.',
      ],
    },
    {
      id: 'public' as const,
      title: 'Visitante Público / No Autenticado',
      sampleName: 'Modo Anónimo',
      sampleId: 'none',
      color: '#94A3B8',
      badge: 'Sólo Lectura',
      icon: <Eye className="w-5 h-5 text-slate-400" />,
      description:
        'Cualquier usuario de la comarca o visitante web que explora el espacio FLC LAB de forma pública.',
      canCreate: [
        'Solicitar darse de alta como alumno, docente, familia o empresa.',
        'Ponerse en contacto con el laboratorio.',
      ],
      canModify: [
        'Explorar el Manifiesto, Roles, Disciplinas y Agenda pública.',
        'Filtrar proyectos por tecnología o fase.',
      ],
      restrictions: [
        'No puede crear proyectos ni eventos.',
        'No puede publicar bitácoras.',
        'Al intentar inscribirse o colaborar, se le solicita iniciar sesión en 1 clic.',
      ],
    },
  ];

  const currentRoleInfo = rolesDetails.find((r) => r.id === selectedGroup) || rolesDetails[0];

  const handleTestRole = (targetId: string) => {
    if (targetId === 'none') {
      onLogout();
      setSelectedGroup('public');
      onClose();
    } else if (targetId === 'admin') {
      if (onRequestTeacherAccess) {
        onRequestTeacherAccess(() => {
          const adminUser = allUsers.find((u) => u.isAdmin);
          if (adminUser) {
            onSwitchUser(adminUser);
            setSelectedGroup('admin');
            onClose();
          }
        });
        return;
      }
      const adminUser = allUsers.find((u) => u.isAdmin);
      if (adminUser) {
        onSwitchUser(adminUser);
        setSelectedGroup('admin');
        onClose();
      }
    } else {
      onOpenAuthModal('register');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-5 sm:p-7 my-6 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Matriz de Permisos & Accesos FLC LAB</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Qué puede crear y modificar cada tipo de usuario?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Sistema de control de accesos basado en roles (RBAC) diseñado para el trabajo colaborativo
              entre instituto, familias y tejido productivo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collective selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {rolesDetails.map((r) => {
            const isSelected = selectedGroup === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedGroup(r.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-950 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${r.color}20` }}>
                    {r.icon}
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${r.color}20`,
                      color: r.color,
                    }}
                  >
                    {r.badge}
                  </span>
                </div>
                <div>
                  <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {r.title.split('/')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{r.sampleName}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Card of Selected Role */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ backgroundColor: `${currentRoleInfo.color}25`, color: currentRoleInfo.color }}
              >
                {currentRoleInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-white">{currentRoleInfo.title}</h4>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${currentRoleInfo.color}20`,
                      color: currentRoleInfo.color,
                      border: `1px solid ${currentRoleInfo.color}40`,
                    }}
                  >
                    {currentRoleInfo.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentRoleInfo.description}</p>
              </div>
            </div>

            {/* Direct Switch / Test Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => handleTestRole(currentRoleInfo.sampleId)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
                title={`Cambiar la sesión activa a este perfil para probar sus permisos`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentRoleInfo.id === 'public'
                    ? 'Ver como Visitante'
                    : currentRoleInfo.id === 'admin'
                    ? 'Acceder como Administrador'
                    : `Crear Cuenta (${currentRoleInfo.title.split('/')[0].trim()})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Permissions Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Can Create */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>¿Qué puede Crear?</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {currentRoleInfo.canCreate.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Can Modify */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4" />
                <span>¿Qué puede Modificar?</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {currentRoleInfo.canModify.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold mt-0.5 shrink-0">✎</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Restrictions / Boundaries */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Límites y Reglas de Validación: </span>
              {currentRoleInfo.restrictions.join(' ')}
            </div>
          </div>
        </div>

        {/* Global Matrix Comparison Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Comparativa Rápida de Capacidades en FLC LAB</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Funcionalidad</th>
                  <th className="py-2.5 px-2 text-center text-emerald-400 font-bold">Admin</th>
                  <th className="py-2.5 px-2 text-center text-blue-400 font-bold">Docente (Admitido)</th>
                  <th className="py-2.5 px-2 text-center text-amber-400 font-bold">Alumnado</th>
                  <th className="py-2.5 px-2 text-center text-purple-400 font-bold">Familias</th>
                  <th className="py-2.5 px-2 text-center text-pink-400 font-bold">Empresas</th>
                  <th className="py-2.5 px-2 text-center text-slate-400">Visitante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                <tr className="bg-emerald-950/20">
                  <td className="py-2 px-3 font-semibold text-emerald-300">Admitir / Validar Docentes</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Exclusivo</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Crear Proyectos Oficiales</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Directo</td>
                  <td className="py-2 px-2 text-center text-blue-300 font-bold">Directo</td>
                  <td className="py-2 px-2 text-center text-amber-300/80">Propuesta</td>
                  <td className="py-2 px-2 text-center text-purple-300/80">Propuesta</td>
                  <td className="py-2 px-2 text-center text-pink-300/80">Reto Empresa</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Cambiar Fase de Proyecto</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Cualquiera</td>
                  <td className="py-2 px-2 text-center text-blue-300">Proyectos coordinados</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Publicar en Bitácora</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Todos</td>
                  <td className="py-2 px-2 text-center text-blue-300">Todos / Guías</td>
                  <td className="py-2 px-2 text-center text-amber-300/80">Sus Proyectos</td>
                  <td className="py-2 px-2 text-center text-purple-300/80">Colaboración</td>
                  <td className="py-2 px-2 text-center text-pink-300/80">Mentoría</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Crear Talleres / Eventos</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Directo</td>
                  <td className="py-2 px-2 text-center text-blue-300 font-bold">Directo</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-purple-300/80">Proponer</td>
                  <td className="py-2 px-2 text-center text-pink-300/80">Proponer Masterclass</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Inscribirse a Talleres</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-blue-300 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-slate-500">Requiere login</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white">Aprobar Solicitudes Colab.</td>
                  <td className="py-2 px-2 text-center text-emerald-400 font-bold">Sí</td>
                  <td className="py-2 px-2 text-center text-blue-300">Revisar su equipo</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                  <td className="py-2 px-2 text-center text-slate-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-400">
            Usuario actual activo:{' '}
            <span className="font-bold text-white">
              {currentUser ? `${currentUser.name} (${currentUser.isAdmin ? 'Admin' : currentUser.group})` : 'Visitante'}
            </span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
