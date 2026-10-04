export type DisciplineId =
  | 'videojuegos'
  | 'impresion_3d'
  | 'ilustracion'
  | 'video_animacion'
  | 'juegos_mesa'
  | 'robotica'
  | 'musica_sonido';

export interface Discipline {
  id: DisciplineId;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  iconName: string;
  description: string;
  examples: string[];
  tools: string[];
}

export type RoleId =
  | 'diseno'
  | 'tecnologia'
  | 'arte'
  | 'audio'
  | 'produccion'
  | 'qa'
  | 'comunicacion'
  | 'project_lead';

export interface RoleInfo {
  id: RoleId;
  name: string;
  subtitle: string;
  color: string;
  iconName: string;
  tasks: string[];
  idealFor: string;
}

export type ProjectPhase = 1 | 2 | 3 | 4 | 5 | 6;

export interface PhaseInfo {
  step: ProjectPhase;
  name: string;
  subtitle: string;
  color: string;
  actions: string[];
}

export interface TeamMember {
  name: string;
  role: RoleId;
  group: 'Alumnado' | 'Profesorado' | 'Familia' | 'Mentor Externo';
  gradeOrDept?: string;
  avatar?: string;
}

export interface BitacoraEntry {
  id: string;
  projectId: string;
  date: string;
  authorName: string;
  authorHandle?: string;
  authorRole: RoleId;
  authorAvatarColor?: string;
  title: string;
  content: string;
  learning?: string;
  phase: ProjectPhase;
  tags?: string[];
  imageUrl?: string;
  applauseCount: number;
  hasApplauded?: boolean;
}

export interface ItemComment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorGroup: CollaboratorGroup;
  authorAvatarColor?: string;
  text: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  discipline: DisciplineId;
  phase: ProjectPhase;
  trimester: 1 | 2 | 3;
  summary: string;
  objectives: string[];
  team: TeamMember[];
  openRoles: RoleId[];
  thumbnail: string;
  deliverablesCompleted: string[];
  deliverablesPending: string[];
  nextMilestone: string;
  lastUpdate: string;
  bitacora?: BitacoraEntry[];
  leaderId?: string;
  leaderName?: string;
  enrolledUserIds?: string[];
  comments?: ItemComment[];
}

export type EventType = 'taller' | 'masterclass' | 'hito' | 'feria' | 'reunion';

export interface LabEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  trimester: 1 | 2 | 3;
  description: string;
  speakerOrHost?: string;
  attendeesCount: number;
  maxCapacity?: number;
  isRegistered?: boolean;
  isProposal?: boolean;
  proposedBy?: string;
  proposedGroup?: CollaboratorGroup;
  status?: 'oficial' | 'propuesta_pendiente';
  registeredUserIds?: string[];
  comments?: ItemComment[];
}

export type CollaboratorGroup = 'alumnado' | 'profesorado' | 'familias' | 'entidades_externas';
export type UserRoleType = 'admin' | 'creador';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  password?: string;
  group: CollaboratorGroup;
  gradeOrDept: string;
  organization?: string;
  roleType?: UserRoleType;
  isAdmin?: boolean;
  teacherStatus?: 'pendiente' | 'aprobado' | 'rechazado';
  primaryRole: RoleId;
  secondaryRoles: RoleId[];
  favoriteDisciplines: DisciplineId[];
  skillsAndTools: string[];
  bio: string;
  badgeTitles: string[];
  projectIds: string[];
  registeredEventIds: string[];
  avatarColor: string;
  createdAt: string;
}

export interface CollaborationRequest {
  id: string;
  name: string;
  email: string;
  group: CollaboratorGroup;
  gradeOrEntity: string;
  rolesInterest: RoleId[];
  disciplinesInterest: DisciplineId[];
  motivation: string;
  projectProposal?: string;
  status: 'pendiente' | 'aprobada' | 'incorporado';
  createdAt: string;
}
