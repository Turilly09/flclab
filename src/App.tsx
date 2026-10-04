/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Project,
  LabEvent,
  CollaborationRequest,
  DisciplineId,
  ProjectPhase,
  RoleId,
  UserProfile,
  BitacoraEntry,
  HeroCarouselSlide,
  FounderRecruit
} from './types/flc';
import {
  INITIAL_PROJECTS,
  PODCAST_PROJECT,
  INITIAL_EVENTS,
  INITIAL_COLLABORATIONS,
  DEFAULT_CREATOR_PROFILES,
  INITIAL_BITACORA_ENTRIES,
  INITIAL_CAROUSEL_SLIDES,
  DEFAULT_FOUNDER_RECRUITS
} from './data/flcInitialData';

import { Header } from './components/Header';
import { ManageDashboardBar } from './components/ManageDashboardBar';
import { HeroSection } from './components/HeroSection';
import { StudentJourneySection } from './components/StudentJourneySection';
import { PodcastSection } from './components/PodcastSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { RolesSection } from './components/RolesSection';
import { StudentRecruitSection } from './components/StudentRecruitSection';
import { StudentRecruitModal } from './components/StudentRecruitModal';
import { PrintPosterModal } from './components/PrintPosterModal';
import { AdminUserPoolModal } from './components/AdminUserPoolModal';
import { DiagnosticErrorBoundary } from './components/DiagnosticErrorBoundary';
import { MethodologySection } from './components/MethodologySection';
import { CommunitySection } from './components/CommunitySection';
import { ProjectsManager } from './components/ProjectsManager';
import { EventsManager } from './components/EventsManager';
import { CollaborationsManager } from './components/CollaborationsManager';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NewProjectModal } from './components/NewProjectModal';
import { NewEventModal } from './components/NewEventModal';
import { CollabModal } from './components/CollabModal';
import { RoleQuizModal } from './components/RoleQuizModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NewBitacoraModal } from './components/NewBitacoraModal';
import { AuthModal } from './components/AuthModal';
import { PermissionsMatrixModal } from './components/PermissionsMatrixModal';
import { TeacherAdmissionModal } from './components/TeacherAdmissionModal';
import { ExternalPartnersSection } from './components/ExternalPartnersSection';
import { Footer } from './components/Footer';
import { safeStorage } from './utils/safeStorage';
import {
  testFirestoreConnection,
  seedInitialFirestoreData,
  subscribeToProjects,
  subscribeToEvents,
  subscribeToCollaborations,
  subscribeToUsers,
  subscribeToBitacora,
  saveProject as saveProjectToDb,
  deleteProjectFromDb,
  saveEvent as saveEventToDb,
  deleteEventFromDb,
  saveCollaboration as saveCollabToDb,
  saveUser as saveUserToDb,
  deleteUserFromDb,
  saveBitacora as saveBitacoraToDb,
  subscribeToCarouselSlides,
  saveCarouselSlide,
} from './services/firebase';

export default function App() {
  const handleDownloadPdf = () => {
    // Fixed official presentation PDF dossier
    const a = document.createElement('a');
    a.href = '/flc-lab-presentacion.pdf';
    a.download = 'FLC_LAB_Que_Queremos_Ser.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Creator Users & Authentication state (Only Administrator initially)
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const [users, setUsers] = useState<UserProfile[]>(() => {
    // Purge old mock data
    ['flc_lab_users', 'flc_lab_current_user_id', 'flc_lab_projects', 'flc_lab_events', 'flc_lab_collaborations', 'flc_lab_bitacora'].forEach(
      (k) => safeStorage.removeItem(k)
    );

    const saved = safeStorage.getItem('flc_v2_users');
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        if (parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing users from storage', e);
      }
    }
    return DEFAULT_CREATOR_PROFILES;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_users', JSON.stringify(users));
  }, [users]);

  // Initial session starts CLOSED (Visitor mode by default)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUserId = safeStorage.getItem('flc_v2_current_user_id');
    if (savedUserId) {
      const found = users.find((u) => u.id === savedUserId);
      if (found) return found;
    }
    return null;
  });

  // Keep currentUser in sync with users real-time database state
  useEffect(() => {
    if (currentUser) {
      const latest = users.find((u) => u.id === currentUser.id);
      if (latest) {
        if (
          latest.name !== currentUser.name ||
          latest.email !== currentUser.email ||
          latest.group !== currentUser.group ||
          latest.gradeOrDept !== currentUser.gradeOrDept ||
          latest.teacherStatus !== currentUser.teacherStatus ||
          JSON.stringify(latest.projectIds) !== JSON.stringify(currentUser.projectIds) ||
          JSON.stringify(latest.registeredEventIds) !== JSON.stringify(currentUser.registeredEventIds) ||
          JSON.stringify(latest.badgeTitles) !== JSON.stringify(currentUser.badgeTitles) ||
          latest.avatarColor !== currentUser.avatarColor ||
          latest.bio !== currentUser.bio ||
          JSON.stringify(latest.skillsAndTools) !== JSON.stringify(currentUser.skillsAndTools) ||
          JSON.stringify(latest.secondaryRoles) !== JSON.stringify(currentUser.secondaryRoles) ||
          JSON.stringify(latest.favoriteDisciplines) !== JSON.stringify(currentUser.favoriteDisciplines)
        ) {
          setCurrentUser(latest);
        }
      }
    }
  }, [users, currentUser]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewedProfileUser, setViewedProfileUser] = useState<UserProfile | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isTeacherAdmissionModalOpen, setIsTeacherAdmissionModalOpen] = useState(false);

  const handleUpdateUserTeacherStatus = (userId: string, newStatus: 'aprobado' | 'rechazado' | 'pendiente') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: UserProfile = {
            ...u,
            teacherStatus: newStatus,
            badgeTitles:
              newStatus === 'aprobado'
                ? ['🎓 Docente FLC', '✅ Docente Admitido']
                : newStatus === 'pendiente'
                ? ['🎓 Docente FLC', '⏳ Pendiente de Admisión']
                : ['🎓 Docente FLC', '❌ Solicitud No Admitida'],
          };
          saveUserToDb(updated);
          return updated;
        }
        return u;
      })
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, teacherStatus: newStatus } : null));
    }
    const actionText =
      newStatus === 'aprobado'
        ? 'Docente admitido con éxito. Ya dispone de facultades docentes.'
        : newStatus === 'rechazado'
        ? 'Solicitud de cuenta docente desestimada.'
        : 'Estado del docente restablecido a pendiente.';
    showToast(actionText);
  };

  const handleOpenAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const requireAuthForAction = (actionDescription: string, callback: () => void) => {
    if (!currentUser) {
      showToast(`Acceso restringido: Los usuarios invitados no pueden ${actionDescription}. Inicia sesión o date de alta.`);
      handleOpenAuthModal('login');
      return;
    }
    callback();
  };

  const handleOpenProfileForUser = (user: UserProfile) => {
    setViewedProfileUser(user);
    setIsProfileModalOpen(true);
  };

  const handleUnenrollProject = (projectId: string) => {
    if (!currentUser) return;

    // 1. Remove projectId from currentUser.projectIds
    const updatedProjectIds = (currentUser.projectIds || []).filter((id) => id !== projectId);
    const updatedUser: UserProfile = {
      ...currentUser,
      projectIds: updatedProjectIds,
    };
    handleUpdateUser(updatedUser);

    // 2. Remove user from project enrolledUserIds and team
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedEnrolled = (p.enrolledUserIds || []).filter((uid) => uid !== currentUser.id);
          const updatedTeam = p.team.filter((m) => {
            const isSelf =
              m.name.toLowerCase() === currentUser.name.toLowerCase() ||
              currentUser.name.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase());
            return !isSelf;
          });
          const updatedProj: Project = {
            ...p,
            enrolledUserIds: updatedEnrolled,
            team: updatedTeam,
          };
          saveProjectToDb(updatedProj);
          return updatedProj;
        }
        return p;
      })
    );

    // If currently opened project matches, update it
    setSelectedProject((prev) => {
      if (prev && prev.id === projectId) {
        return {
          ...prev,
          enrolledUserIds: (prev.enrolledUserIds || []).filter((uid) => uid !== currentUser.id),
          team: prev.team.filter((m) => {
            const isSelf =
              m.name.toLowerCase() === currentUser.name.toLowerCase() ||
              currentUser.name.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase());
            return !isSelf;
          }),
        };
      }
      return prev;
    });

    showToast(`Te has desapuntado del proyecto con éxito.`);
  };

  const handleUnenrollEvent = (eventId: string) => {
    if (!currentUser) return;

    // 1. Remove eventId from currentUser.registeredEventIds
    const updatedEventIds = (currentUser.registeredEventIds || []).filter((id) => id !== eventId);
    const updatedUser: UserProfile = {
      ...currentUser,
      registeredEventIds: updatedEventIds,
    };
    handleUpdateUser(updatedUser);

    // 2. Decrement attendeesCount and remove user from registeredUserIds
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const wasRegistered = e.isRegistered || (e.registeredUserIds || []).includes(currentUser.id);
          const updatedEvt: LabEvent = {
            ...e,
            isRegistered: false,
            registeredUserIds: (e.registeredUserIds || []).filter((uid) => uid !== currentUser.id),
            attendeesCount: wasRegistered ? Math.max(0, e.attendeesCount - 1) : e.attendeesCount,
          };
          saveEventToDb(updatedEvt);
          return updatedEvt;
        }
        return e;
      })
    );

    showToast(`Has cancelado tu asistencia a la sesión.`);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    safeStorage.setItem('flc_v2_current_user_id', user.id);
    showToast(`¡Sesión iniciada con éxito! Bienvenido, ${user.name}.`);
  };

  const handleRegister = (newUser: UserProfile) => {
    setUsers((prev) => [...prev, newUser]);
    saveUserToDb(newUser);
    setCurrentUser(newUser);
    safeStorage.setItem('flc_v2_current_user_id', newUser.id);
    showToast(`¡Cuenta creada con éxito! Bienvenido a FLC LAB, ${newUser.name}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    safeStorage.removeItem('flc_v2_current_user_id');
    setIsManageMode(false);
    showToast('Has cerrado sesión. Modo visitante activo.');
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    safeStorage.setItem('flc_v2_current_user_id', user.id);
    if (!user.isAdmin) {
      setIsManageMode(false);
    }
    showToast(`Sesión cambiada a: ${user.name} (${user.isAdmin ? 'Admin' : user.group})`);
  };

  // Local storage state initialization (Clean production storage)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = safeStorage.getItem('flc_v2_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const otherProjects = parsed.filter((p: any) => p?.id !== PODCAST_PROJECT.id);
          return [PODCAST_PROJECT, ...otherProjects];
        }
      } catch (e) {
        console.error('Error parsing projects from storage', e);
      }
    }
    return INITIAL_PROJECTS;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_projects', JSON.stringify(projects));
  }, [projects]);

  const [events, setEvents] = useState<LabEvent[]>(() => {
    const saved = safeStorage.getItem('flc_v2_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing events from storage', e);
      }
    }
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_events', JSON.stringify(events));
  }, [events]);

  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>(() => {
    const saved = safeStorage.getItem('flc_v2_collaborations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing collaborations from storage', e);
      }
    }
    return INITIAL_COLLABORATIONS;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  // Bitacora entries state
  const [bitacoraEntries, setBitacoraEntries] = useState<BitacoraEntry[]>(() => {
    const saved = safeStorage.getItem('flc_v2_bitacora');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing bitacora from storage', e);
      }
    }
    return INITIAL_BITACORA_ENTRIES;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_bitacora', JSON.stringify(bitacoraEntries));
  }, [bitacoraEntries]);

  // Carousel slides state with local storage fallback
  const [carouselSlides, setCarouselSlides] = useState<HeroCarouselSlide[]>(() => {
    const saved = safeStorage.getItem('flc_v2_carousel_slides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing carousel slides from storage', e);
      }
    }
    return INITIAL_CAROUSEL_SLIDES;
  });

  useEffect(() => {
    safeStorage.setItem('flc_v2_carousel_slides', JSON.stringify(carouselSlides));
  }, [carouselSlides]);

  const handleUpdateCarouselSlide = (updatedSlide: HeroCarouselSlide) => {
    setCarouselSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
    );
    saveCarouselSlide(updatedSlide);
    showToast(`Diapositiva "${updatedSlide.tag}" actualizada con éxito.`);
  };

  const handleResetCarouselSlides = () => {
    setCarouselSlides(INITIAL_CAROUSEL_SLIDES);
    INITIAL_CAROUSEL_SLIDES.forEach((s) => saveCarouselSlide(s));
    safeStorage.removeItem('flc_v2_carousel_slides');
    showToast('Diapositivas restauradas a los valores originales.');
  };

  // Firebase Firestore Real-Time Synchronization
  useEffect(() => {
    testFirestoreConnection();
    seedInitialFirestoreData(
      INITIAL_PROJECTS,
      INITIAL_EVENTS,
      INITIAL_COLLABORATIONS,
      DEFAULT_CREATOR_PROFILES,
      INITIAL_BITACORA_ENTRIES
    );

    const unsubProjects = subscribeToProjects((remote) => {
      if (remote.length > 0) setProjects(remote);
    });
    const unsubEvents = subscribeToEvents((remote) => {
      if (remote.length > 0) setEvents(remote);
    });
    const unsubCollabs = subscribeToCollaborations((remote) => {
      if (remote.length > 0) setCollaborations(remote);
    });
    const unsubUsers = subscribeToUsers((remote) => {
      if (remote.length > 0) setUsers(remote);
    });
    const unsubBitacora = subscribeToBitacora((remote) => {
      if (remote.length > 0) setBitacoraEntries(remote);
    });
    const unsubCarousel = subscribeToCarouselSlides((remote) => {
      if (remote.length > 0) setCarouselSlides(remote);
    });

    return () => {
      unsubProjects();
      unsubEvents();
      unsubCollabs();
      unsubUsers();
      unsubBitacora();
      unsubCarousel();
    };
  }, []);

  const [isNewBitacoraModalOpen, setIsNewBitacoraModalOpen] = useState(false);
  const [targetBitacoraProjectId, setTargetBitacoraProjectId] = useState<string | undefined>(undefined);

  const handleOpenNewBitacora = (projectId?: string) => {
    setTargetBitacoraProjectId(projectId);
    setIsNewBitacoraModalOpen(true);
  };

  const handleCreateBitacoraEntry = (newEntry: Omit<BitacoraEntry, 'id' | 'applauseCount' | 'hasApplauded'>) => {
    const entry: BitacoraEntry = {
      ...newEntry,
      id: `bit-${Date.now()}`,
      applauseCount: 1,
      hasApplauded: true,
    };
    setBitacoraEntries((prev) => [entry, ...prev]);
    saveBitacoraToDb(entry);
    showToast('¡Entrada de bitácora registrada en el cuaderno del taller!');
  };

  const handleApplaudBitacora = (entryId: string) => {
    setBitacoraEntries((prev) =>
      prev.map((e) => {
        if (e.id === entryId) {
          const nextCount = e.hasApplauded ? Math.max(0, e.applauseCount - 1) : e.applauseCount + 1;
          const updated = {
            ...e,
            applauseCount: nextCount,
            hasApplauded: !e.hasApplauded,
          };
          saveBitacoraToDb(updated);
          return updated;
        }
        return e;
      })
    );
  };

  // Navigation and view modes
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isManageMode, setIsManageMode] = useState<boolean>(false);

  // Active filters passed across sections
  const [activeDisciplineFilter, setActiveDisciplineFilter] = useState<DisciplineId | null>(null);
  const [activePhaseFilter, setActivePhaseFilter] = useState<ProjectPhase | null>(null);
  const [activeRoleFilter, setActiveRoleFilter] = useState<RoleId | null>(null);

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [preselectedCollabRole, setPreselectedCollabRole] = useState<RoleId | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [isPrintPosterModalOpen, setIsPrintPosterModalOpen] = useState(false);
  const [isAdminUserPoolModalOpen, setIsAdminUserPoolModalOpen] = useState(false);

  // Derived Founder Recruits directly from User pool where group === 'alumnado' (starts honestly at 0/20)
  const founderRecruits = useMemo(() => {
    return users.filter((u) => u.group === 'alumnado');
  }, [users]);

  const [discordInviteUrl] = useState<string>(() => {
    return 'https://discord.gg/WK3aRSuBa';
  });

  const handleRegisterStudent = (studentData: {
    name: string;
    handle: string;
    email: string;
    password: string;
    gradeOrDept: string;
    favoriteDisciplines: string[];
    discordHandle?: string;
  }): UserProfile | null => {
    // Prevent duplicate emails
    const exists = users.find((u) => u.email.toLowerCase() === studentData.email.toLowerCase());
    if (exists) return null;

    const studentCount = users.filter((u) => u.group === 'alumnado').length;
    const badgeNum = studentCount + 1;

    const newStudentUser: UserProfile = {
      id: `usr-stud-${Date.now()}`,
      name: studentData.name,
      handle: studentData.handle,
      email: studentData.email,
      password: studentData.password,
      group: 'alumnado',
      gradeOrDept: studentData.gradeOrDept,
      roleType: 'creador',
      primaryRole: 'tecnologia',
      secondaryRoles: [],
      favoriteDisciplines: studentData.favoriteDisciplines as any[],
      skillsAndTools: studentData.favoriteDisciplines.map((d) => `Interés en ${d}`),
      bio: `Miembro del Escuadrón Fundador (Pase #${String(badgeNum).padStart(3, '0')}).`,
      badgeTitles: ['🚀 Escuadrón Fundador', `Pase #${String(badgeNum).padStart(3, '0')}`],
      projectIds: [],
      registeredEventIds: [],
      avatarColor: ['#06B6D4', '#EF4444', '#F59E0B', '#10B981', '#A855F7', '#EC4899'][badgeNum % 6],
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Update global users pool
    setUsers((prev) => [...prev, newStudentUser]);
    saveUserToDb(newStudentUser);

    // Login immediately
    setCurrentUser(newStudentUser);
    safeStorage.setItem('flc_v2_current_user_id', newStudentUser.id);

    showToast(`¡Alta completada con éxito! Pase de Fundador #${String(badgeNum).padStart(3, '0')} concedido.`);
    return newStudentUser;
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    saveUserToDb(updatedUser);
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Usuario "${updatedUser.name}" actualizado correctamente.`);
  };

  const handleDeleteUser = (userId: string) => {
    deletedIdsRef.current.add(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteUserFromDb(userId);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
      safeStorage.removeItem('flc_v2_current_user_id');
      showToast('Tu cuenta ha sido eliminada. Has cerrado sesión.');
    } else {
      showToast('Usuario eliminado correctamente de la pool.');
    }
  };

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync to local storage
  useEffect(() => {
    safeStorage.setItem('flc_lab_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeStorage.setItem('flc_lab_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeStorage.setItem('flc_lab_collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  useEffect(() => {
    safeStorage.setItem('flc_lab_users', JSON.stringify(users));
  }, [users]);

  // Project count by phase for methodology section
  const projectCountByPhase = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    projects.forEach((p) => {
      counts[p.phase] = (counts[p.phase] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Handlers
  const handleCreateProject = (newProj: Project) => {
    const enrichedProject: Project = {
      ...newProj,
      leaderId: newProj.leaderId || currentUser?.id,
      leaderName: newProj.leaderName || currentUser?.name || 'Creador FLC',
      leaderEmail: newProj.leaderEmail || currentUser?.email,
    };
    setProjects([enrichedProject, ...projects]);
    saveProjectToDb(enrichedProject);
    showToast(`¡Proyecto "${enrichedProject.title}" registrado y vinculado a tu cuenta!`);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProject(updated);
    saveProjectToDb(updated);
    showToast(`Proyecto "${updated.title}" actualizado con éxito.`);
  };

  const handleDeleteProject = (projectId: string) => {
    deletedIdsRef.current.add(projectId);
    setProjects(projects.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    deleteProjectFromDb(projectId);
    showToast('Proyecto eliminado correctamente.');
  };

  const handleUpdateEvent = (updated: LabEvent) => {
    setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
    saveEventToDb(updated);
    showToast(`Sesión "${updated.title}" actualizada con éxito.`);
  };

  const handleDeleteEvent = (eventId: string) => {
    deletedIdsRef.current.add(eventId);
    setEvents(events.filter((e) => e.id !== eventId));
    deleteEventFromDb(eventId);
    showToast('Sesión eliminada del calendario.');
  };

  const handleCreateEvent = (newEvent: LabEvent) => {
    const enrichedEvent: LabEvent = {
      ...newEvent,
      proposedBy: newEvent.proposedBy || currentUser?.name || 'Comunidad FLC',
      proponentEmail: newEvent.proponentEmail || currentUser?.email,
      proponentId: newEvent.proponentId || currentUser?.id,
      proposedGroup: newEvent.proposedGroup || currentUser?.group,
    };
    setEvents([enrichedEvent, ...events]);
    saveEventToDb(enrichedEvent);
    if (enrichedEvent.isProposal) {
      showToast(`¡Propuesta "${enrichedEvent.title}" vinculada a ${currentUser?.name || 'tu cuenta'}!`);
    } else {
      showToast(`¡Sesión oficial "${enrichedEvent.title}" programada correctamente!`);
    }
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents(
      events.map((evt) => {
        if (evt.id === eventId) {
          const approved = { ...evt, isProposal: false, status: 'oficial' as const };
          saveEventToDb(approved);
          return approved;
        }
        return evt;
      })
    );
    showToast('¡Sesión aprobada y convertida en evento oficial del centro!');
  };

  const handleToggleRegisterEvent = (eventId: string) => {
    requireAuthForAction('inscribirse a las sesiones del taller', () => {
      if (!currentUser) return;
      const targetEvent = events.find((e) => e.id === eventId);
      if (!targetEvent) return;

      const isCurrentlyRegistered =
        targetEvent.isRegistered ||
        (targetEvent.registeredUserIds || []).includes(currentUser.id) ||
        (currentUser.registeredEventIds || []).includes(eventId);

      const nextRegistered = !isCurrentlyRegistered;

      // Sync user profile registeredEventIds
      const updatedEventIds = nextRegistered
        ? Array.from(new Set([...(currentUser.registeredEventIds || []), eventId]))
        : (currentUser.registeredEventIds || []).filter((id) => id !== eventId);

      const updatedUser: UserProfile = {
        ...currentUser,
        registeredEventIds: updatedEventIds,
      };
      handleUpdateUser(updatedUser);

      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id === eventId) {
            const currentRegisteredIds = evt.registeredUserIds || [];
            let updatedRegisteredIds = [...currentRegisteredIds];
            if (nextRegistered && !updatedRegisteredIds.includes(currentUser.id)) {
              updatedRegisteredIds.push(currentUser.id);
            } else if (!nextRegistered) {
              updatedRegisteredIds = updatedRegisteredIds.filter((id) => id !== currentUser.id);
            }

            const updatedEvt = {
              ...evt,
              isRegistered: nextRegistered,
              registeredUserIds: updatedRegisteredIds,
              attendeesCount: nextRegistered
                ? evt.attendeesCount + 1
                : Math.max(0, evt.attendeesCount - 1),
            };
            saveEventToDb(updatedEvt);
            return updatedEvt;
          }
          return evt;
        })
      );

      showToast(
        nextRegistered
          ? `¡Inscripción confirmada para ${currentUser.name} en "${targetEvent.title}"!`
          : `Inscripción cancelada para "${targetEvent.title}".`
      );
    });
  };

  const handleSubmitCollaboration = (request: CollaborationRequest) => {
    setCollaborations([request, ...collaborations]);
    saveCollabToDb(request);
    showToast(`¡Gracias ${request.name}! Tu solicitud de colaboración ha sido registrada.`);
  };

  const handleUpdateCollabStatus = (id: string, status: 'pendiente' | 'aprobada' | 'incorporado') => {
    setCollaborations(
      collaborations.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status };
          saveCollabToDb(updated);
          return updated;
        }
        return c;
      })
    );
    showToast('Estado de colaboración actualizado.');
  };

  const handleJoinRoleFromProject = (projectId: string, roleId: RoleId) => {
    setPreselectedCollabRole(roleId);
    setSelectedProject(null);
    setIsCollabModalOpen(true);
  };

  const handleSelectDiscipline = (discId: DisciplineId) => {
    setActiveDisciplineFilter(discId);
    setActiveTab('proyectos');
    const el = document.getElementById('proyectos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPhaseFilter = (phase: ProjectPhase) => {
    setActivePhaseFilter(phase);
    setActiveTab('proyectos');
    const el = document.getElementById('proyectos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectRoleFilter = (roleId: RoleId) => {
    setActiveRoleFilter(roleId);
    setActiveTab('proyectos');
    const el = document.getElementById('proyectos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restaurar los proyectos y eventos de ejemplo originales del IES Fernando Lázaro Carreter?')) {
      setProjects(INITIAL_PROJECTS);
      setEvents(INITIAL_EVENTS);
      setCollaborations(INITIAL_COLLABORATIONS);
      safeStorage.removeItem('flc_lab_projects');
      safeStorage.removeItem('flc_lab_events');
      safeStorage.removeItem('flc_lab_collaborations');
      showToast('Datos del laboratorio restaurados al estado inicial.');
    }
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      institution: 'IES Fernando Lázaro Carreter (Utrillas)',
      lab: 'FLC LAB',
      projects,
      events,
      collaborations,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `flc_lab_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
    showToast('Copia de datos exportada en formato JSON.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl border-2 border-slate-950 flex items-center justify-between gap-3 animate-bounce">
          <span className="text-xs sm:text-sm">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-950 hover:opacity-75 font-black text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isManageMode={isManageMode && !!currentUser?.isAdmin}
        setIsManageMode={(val) => {
          if (currentUser?.isAdmin) {
            setIsManageMode(val);
          } else {
            showToast('El panel de gestión es exclusivo para administradores.');
          }
        }}
        onOpenNewProject={() => {
          requireAuthForAction('dar de alta o proponer un proyecto', () => {
            setIsNewProjectModalOpen(true);
          });
        }}
        onOpenCollabProposal={() => {
          requireAuthForAction('proponer proyectos o iniciativas', () => {
            setPreselectedCollabRole(null);
            setIsCollabModalOpen(true);
          });
        }}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
        onOpenTeacherAdmissionModal={() => setIsTeacherAdmissionModalOpen(true)}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        onOpenUserProfile={() => {
          if (currentUser) {
            setViewedProfileUser(null);
            setIsProfileModalOpen(true);
          } else {
            handleOpenAuthModal('login');
          }
        }}
      />

      {/* Teacher Pending Admission Notice Banner */}
      {currentUser && currentUser.group === 'profesorado' && !currentUser.isAdmin && (currentUser.teacherStatus || 'pendiente') === 'pendiente' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-400 text-slate-950 font-black">
              ⏳
            </span>
            <span>
              <strong>Cuenta docente en revisión:</strong> Tu perfil de profesorado está a la espera de ser admitido por el Administrador único del centro. Tienes acceso temporal de consulta hasta su validación.
            </span>
          </div>
        </div>
      )}

      {/* Manage Dashboard Bar (Visible ONLY when manage mode is toggled AND user is admin) */}
      {isManageMode && currentUser?.isAdmin && (
        <ManageDashboardBar
          projects={projects}
          events={events}
          collaborations={collaborations}
          users={users}
          onOpenTeacherAdmissionModal={() => setIsTeacherAdmissionModalOpen(true)}
          onOpenUserPoolModal={() => setIsAdminUserPoolModalOpen(true)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          onOpenNewEvent={() => setIsNewEventModalOpen(true)}
          onResetData={handleResetData}
          onExportData={handleExportData}
        />
      )}

      {/* Main Tab Content Routing */}
      <main className="flex-1">
        {/* Tab 1: Inicio (SOLO Manifiesto y Roles, limpio y sin abrumar) */}
        {activeTab === 'inicio' && (
          <>
            {/* Manifiesto y Presentación */}
            <HeroSection
              currentUser={currentUser}
              onExploreProjects={() => {
                setActiveTab('proyectos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCalendar={() => {
                setActiveTab('calendario');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreRoles={() => {
                const el = document.getElementById('roles-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenQuiz={() => setIsQuizModalOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              onProposeProject={() => {
                requireAuthForAction('proponer un proyecto o iniciativa', () => {
                  setIsNewProjectModalOpen(true);
                });
              }}
              carouselSlides={carouselSlides}
              onUpdateCarouselSlide={handleUpdateCarouselSlide}
              onResetCarouselSlides={handleResetCarouselSlides}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              totalRecruitsCount={founderRecruits.length}
              maxRecruits={20}
              onOpenRecruitModal={() => setIsRecruitModalOpen(true)}
              onOpenPrintPoster={() => setIsPrintPosterModalOpen(true)}
            />

            {/* CÓMO FUNCIONA FLC LAB: DE TU IDEA A LA REALIDAD EN 4 PASOS */}
            <StudentJourneySection
              onOpenQuiz={() => setIsQuizModalOpen(true)}
              onExploreProjects={() => {
                setActiveTab('proyectos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onProposeProject={() => {
                requireAuthForAction('proponer un proyecto o iniciativa', () => {
                  setIsNewProjectModalOpen(true);
                });
              }}
              onExploreCalendar={() => {
                setActiveTab('calendario');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScrollToPartners={() => {
                const el = document.getElementById('partners-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* FLC ONDAS: EL PODCAST OFICIAL DEL LABORATORIO */}
            <div id="podcast-anchor">
              <PodcastSection
                onOpenProjectDetail={(projectId) => {
                  const proj = projects.find((p) => p.id === projectId) || PODCAST_PROJECT;
                  setSelectedProject(proj);
                }}
                onJoinRole={(roleId) => {
                  handleSelectRoleFilter(roleId);
                  setActiveTab('proyectos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenRecruitModal={() => setIsRecruitModalOpen(true)}
              />
            </div>

            {/* Convocatoria Estudiantil: Escuadrón Fundador (20 Plazas & Discord) */}
            <StudentRecruitSection
              totalRecruitsCount={founderRecruits.length}
              maxRecruits={20}
              recruits={founderRecruits}
              onOpenRecruitModal={() => setIsRecruitModalOpen(true)}
              onOpenPrintPoster={() => setIsPrintPosterModalOpen(true)}
              discordInviteUrl={discordInviteUrl}
            />

            {/* Los 8 Roles del Laboratorio */}
            <div id="roles-anchor">
              <RolesSection
                onSelectRoleFilter={(roleId) => {
                  handleSelectRoleFilter(roleId);
                  setActiveTab('proyectos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenQuiz={() => setIsQuizModalOpen(true)}
              />
            </div>

            {/* Bloque Estratégico: Socios Externos (Empresas, Ayuntamiento, Familias) */}
            <div id="partners-anchor">
              <ExternalPartnersSection
                currentUser={currentUser}
                onOpenCollabProposal={() => {
                  requireAuthForAction('proponer un reto, alianza o iniciativa', () => {
                    setPreselectedCollabRole(null);
                    setIsCollabModalOpen(true);
                  });
                }}
                onDownloadPdf={handleDownloadPdf}
                onOpenAuthModal={handleOpenAuthModal}
              />
            </div>
          </>
        )}

        {/* Tab 2: Proyectos / Contenidos (Se ve al picar en la pestaña) */}
        {activeTab === 'proyectos' && (
          <div>
            {/* Metodología de 6 fases del lab */}
            <MethodologySection
              onSelectPhaseFilter={handleSelectPhaseFilter}
              projectCountByPhase={projectCountByPhase}
              onDownloadPdf={handleDownloadPdf}
            />

            <ProjectsManager
              projects={projects}
              currentUser={currentUser}
              onOpenProjectDetail={(p) => setSelectedProject(p)}
              onOpenNewProjectModal={() => {
                requireAuthForAction('dar de alta o proponer un proyecto', () => {
                  setIsNewProjectModalOpen(true);
                });
              }}
              isManageMode={isManageMode && !!currentUser?.isAdmin}
              isAdmin={!!currentUser?.isAdmin}
              bitacoraEntries={bitacoraEntries}
              onOpenNewBitacora={handleOpenNewBitacora}
              onApplaudBitacora={handleApplaudBitacora}
              initialDisciplineFilter={activeDisciplineFilter}
              initialPhaseFilter={activePhaseFilter}
              initialRoleFilter={activeRoleFilter}
              onOpenCollabProposal={() => {
                requireAuthForAction('proponer proyectos o iniciativas', () => {
                  setPreselectedCollabRole(null);
                  setIsCollabModalOpen(true);
                });
              }}
            />
          </div>
        )}

        {/* Tab 3: Calendario & Eventos (Se ve al picar en la pestaña) */}
        {activeTab === 'calendario' && (
          <div>
            <EventsManager
              events={events}
              currentUser={currentUser}
              onToggleRegister={handleToggleRegisterEvent}
              onOpenNewEventModal={() => {
                requireAuthForAction('programar o proponer talleres y sesiones', () => {
                  setIsNewEventModalOpen(true);
                });
              }}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onApproveEvent={handleApproveEvent}
              isManageMode={isManageMode && !!currentUser?.isAdmin}
              isAdmin={!!currentUser?.isAdmin}
            />
          </div>
        )}

        {/* Tab 4: Colaboraciones & Red Comunitaria (Se ve al picar en la pestaña) */}
        {activeTab === 'colaboraciones' && (
          <div>
            <CommunitySection
              currentUser={currentUser}
              onOpenRegisterUser={() => handleOpenAuthModal('register')}
              onOpenCollabModal={() => {
                requireAuthForAction('enviar propuestas de colaboración', () => {
                  setPreselectedCollabRole(null);
                  setIsCollabModalOpen(true);
                });
              }}
            />
            <CollaborationsManager
              collaborations={collaborations}
              projects={projects}
              currentUser={currentUser}
              onOpenCollabModal={(roleId) => {
                requireAuthForAction('enviar propuestas de colaboración', () => {
                  setPreselectedCollabRole(roleId || null);
                  setIsCollabModalOpen(true);
                });
              }}
              onOpenRegisterUser={() => handleOpenAuthModal('register')}
              onOpenUserProfile={() => (currentUser ? setIsProfileModalOpen(true) : handleOpenAuthModal('login'))}
              onUpdateCollabStatus={handleUpdateCollabStatus}
              isManageMode={isManageMode && !!currentUser?.isAdmin}
              isAdmin={!!currentUser?.isAdmin}
            />
          </div>
        )}

        {/* Tab 5: Alianzas & Socios Externos (Empresas, Ayuntamiento, Familias) */}
        {activeTab === 'alianzas' && (
          <div className="pt-2">
            <ExternalPartnersSection
              currentUser={currentUser}
              onOpenCollabProposal={() => {
                requireAuthForAction('proponer un reto, alianza o iniciativa', () => {
                  setPreselectedCollabRole(null);
                  setIsCollabModalOpen(true);
                });
              }}
              onDownloadPdf={handleDownloadPdf}
              onOpenAuthModal={handleOpenAuthModal}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCollab={() => {
          requireAuthForAction('enviar propuestas de colaboración', () => {
            setPreselectedCollabRole(null);
            setIsCollabModalOpen(true);
          });
        }}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
      />

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        currentUser={currentUser}
        allUsers={users}
        onClose={() => setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onJoinRole={handleJoinRoleFromProject}
        onUnenrollUser={(projId, userId) => handleUnenrollProject(projId)}
        isManageMode={isManageMode && !!currentUser?.isAdmin}
        bitacoraEntries={bitacoraEntries}
        onOpenNewBitacora={handleOpenNewBitacora}
        onApplaudBitacora={handleApplaudBitacora}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        currentUser={currentUser}
        onOpenAuthModal={() => handleOpenAuthModal('login')}
        onCreateProject={handleCreateProject}
      />

      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        currentUser={currentUser}
        onCreateEvent={handleCreateEvent}
        onOpenAuthModal={() => handleOpenAuthModal('login')}
      />

      <CollabModal
        isOpen={isCollabModalOpen}
        onClose={() => {
          setIsCollabModalOpen(false);
          setPreselectedCollabRole(null);
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => handleOpenAuthModal('login')}
        onSubmitCollab={handleSubmitCollaboration}
        preselectedRoleId={preselectedCollabRole}
      />

      <RoleQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectRoleFilter={handleSelectRoleFilter}
      />

      {/* New Bitacora Entry Modal */}
      <NewBitacoraModal
        isOpen={isNewBitacoraModalOpen}
        onClose={() => {
          setIsNewBitacoraModalOpen(false);
          setTargetBitacoraProjectId(undefined);
        }}
        presetProjectId={targetBitacoraProjectId}
        projects={projects}
        currentUser={currentUser}
        onSubmit={handleCreateBitacoraEntry}
      />

      {/* Authentication Modal: Iniciar Sesión / Darse de Alta */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        allUsers={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* User Profile Modal: Strictly for active user or selected sample creator */}
      {(currentUser || viewedProfileUser) && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setViewedProfileUser(null);
          }}
          currentUser={currentUser || users[0]}
          profileUser={viewedProfileUser}
          onSwitchToUser={(user) => {
            handleSwitchUser(user);
            setViewedProfileUser(null);
          }}
          projects={projects}
          events={events}
          onOpenProjectDetail={(p) => setSelectedProject(p)}
          onUpdateUser={handleUpdateUser}
          onUnenrollProject={handleUnenrollProject}
          onUnenrollEvent={handleUnenrollEvent}
        />
      )}

      {/* Permissions Matrix & RBAC Modal */}
      <PermissionsMatrixModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Teacher Admission & Verification Modal for Admin */}
      <TeacherAdmissionModal
        isOpen={isTeacherAdmissionModalOpen}
        onClose={() => setIsTeacherAdmissionModalOpen(false)}
        users={users}
        onUpdateUserTeacherStatus={handleUpdateUserTeacherStatus}
      />

      {/* Student Recruitment Modal (Registers student with email/password into user pool) */}
      <StudentRecruitModal
        isOpen={isRecruitModalOpen}
        onClose={() => setIsRecruitModalOpen(false)}
        onRegisterStudent={handleRegisterStudent}
        totalRecruitsCount={founderRecruits.length}
        maxRecruits={20}
        discordInviteUrl={discordInviteUrl}
        onOpenPrintPoster={() => setIsPrintPosterModalOpen(true)}
      />

      {/* Printable Poster for High School Hallways with QR Code */}
      <PrintPosterModal
        isOpen={isPrintPosterModalOpen}
        onClose={() => setIsPrintPosterModalOpen(false)}
        discordInviteUrl={discordInviteUrl}
      />

      {/* Admin User Pool Management Modal with Diagnostic Error Boundary */}
      {isAdminUserPoolModalOpen && (
        <DiagnosticErrorBoundary name="Panel de Administrar Usuarios (AdminUserPoolModal)">
          <AdminUserPoolModal
            isOpen={isAdminUserPoolModalOpen}
            onClose={() => setIsAdminUserPoolModalOpen(false)}
            users={users}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        </DiagnosticErrorBoundary>
      )}
    </div>
  );
}
