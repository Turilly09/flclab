import {
  Discipline,
  RoleInfo,
  PhaseInfo,
  Project,
  LabEvent,
  CollaborationRequest,
  UserProfile,
  BitacoraEntry,
  HeroCarouselSlide,
  FounderRecruit
} from '../types/flc';

import heroImg from '../assets/images/flc_hero_maker_lab_1790737987297.jpg';
import gameImg from '../assets/images/flc_game_dev_art_1790737999026.jpg';
import roboticsImg from '../assets/images/flc_3d_robotics_1790738011081.jpg';
import boardgameImg from '../assets/images/flc_boardgame_craft_1790738026069.jpg';

export const ASSET_IMAGES = {
  hero: heroImg,
  game: gameImg,
  robotics: roboticsImg,
  boardgame: boardgameImg,
};

export const DISCIPLINES: Discipline[] = [
  {
    id: 'videojuegos',
    name: 'Videojuegos',
    tagline: 'Crea mundos jugables, mecánicas e historias interactivas',
    color: '#EF4444', // Red from slide 3
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    borderColor: 'border-red-500',
    iconName: 'Gamepad2',
    description: 'Diseño y desarrollo de videojuegos 2D, retro y aventuras narrativas desde el guión hasta el mando.',
    examples: ['Juegos de plataformas 2D', 'Arcade con temáticas locales', 'Aventuras gráficas'],
    tools: ['Godot Engine', 'Unity', 'Construct 3', 'Aseprite'],
  },
  {
    id: 'impresion_3d',
    name: 'Impresión 3D',
    tagline: 'Del diseño digital a objetos físicos tangibles',
    color: '#F59E0B', // Amber/Yellow from slide 3
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500',
    iconName: 'Box',
    description: 'Modelado y fabricación aditiva de piezas técnicas, miniaturas, carcasas y prototipos funcionales.',
    examples: ['Piezas para robots', 'Figuras y miniaturas', 'Cajas para electrónica'],
    tools: ['Blender', 'Tinkercad', 'FreeCAD', 'PrusaSlicer / Bambu Studio'],
  },
  {
    id: 'ilustracion',
    name: 'Dibujo e Ilustración',
    tagline: 'Arte conceptual, diseño de personajes y cartelería',
    color: '#06B6D4', // Cyan from slide 3
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500',
    iconName: 'PenTool',
    description: 'Creación de identidades visuales, concept art, texturas, sprites digitales e ilustración tradicional.',
    examples: ['Hojas de personaje', 'Fondos y escenarios', 'Pósters y logos'],
    tools: ['Krita', 'Photoshop', 'Procreate', 'Inkscape'],
  },
  {
    id: 'video_animacion',
    name: 'Vídeo y Animación',
    tagline: 'Contar historias a través del movimiento y el montaje',
    color: '#3B82F6', // Blue from slide 3
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500',
    iconName: 'Clapperboard',
    description: 'Producción de cortometrajes, cinemáticas, animación 2D/3D y documentación en vídeo del laboratorio.',
    examples: ['Teasers de proyectos', 'Animación de créditos', 'Vídeo reportajes del IES'],
    tools: ['DaVinci Resolve', 'OpenToonz', 'Blender', 'OBS Studio'],
  },
  {
    id: 'juegos_mesa',
    name: 'Juegos de Mesa',
    tagline: 'Diseño analógico de reglas, cartas, tableros y dados',
    color: '#8B5CF6', // Purple from slide 3
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500',
    iconName: 'Dices',
    description: 'Creación completa de juegos analógicos: mecánicas, balance numérico, diseño gráfico de cartas y fabricación.',
    examples: ['Juegos de estrategia y gestión', 'Party games educativos', 'Wargames tácticos con miniaturas'],
    tools: ['Component.Studio', 'Tabletop Simulator', 'Affinity/Inkscape', 'Corte láser'],
  },
  {
    id: 'robotica',
    name: 'Electrónica y Robótica',
    tagline: 'Sensores, motores, microcontroladores y automatización',
    color: '#10B981', // Green from slide 3
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500',
    iconName: 'Cpu',
    description: 'Construcción de autómatas, interfaces físicas, instrumentos interactivos y sistemas IoT.',
    examples: ['Rovers exploradores', 'Mandos personalizados', 'Sistemas domóticos escolares'],
    tools: ['Arduino IDE', 'Raspberry Pi', 'Micro:bit', 'Fritzing'],
  },
  {
    id: 'musica_sonido',
    name: 'Música y Sonido',
    tagline: 'Banda sonora, foley, efectos interactivos y grabación',
    color: '#EC4899', // Pink / Violet from slide 3
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    borderColor: 'border-pink-500',
    iconName: 'Music',
    description: 'Composición musical, efectos de sonido (SFX), mezcla, locución y audio espacial para medios digitales.',
    examples: ['Bandas sonoras en 8-bit', 'Efectos sonoros para juegos', 'Podcasts del laboratorio'],
    tools: ['Reaper', 'Audacity', 'Bfxr / ChipTone', 'MuseScore'],
  },
];

export const ROLES: RoleInfo[] = [
  {
    id: 'diseno',
    name: 'Diseño',
    subtitle: 'Game design, mecánicas y narrativa',
    color: '#EF4444',
    iconName: 'Layout',
    tasks: ['Game design', 'Mecánicas de juego', 'Narrativa y lore', 'Diseño de niveles', 'Experiencia de usuario (UX)'],
    idealFor: 'Mentes imaginativas interesadas en cómo funcionan las reglas, el suspense y la inmersión del jugador.',
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    subtitle: 'Programación, web y sistemas',
    color: '#F59E0B',
    iconName: 'Code2',
    tasks: ['Programación', 'Desarrollo web', 'Sistemas e infraestructura', 'Arduino / electrónica', 'Integración de motores'],
    idealFor: 'Apasionados de resolver problemas lógicos, programar en Python, C#, JS o trastear con microchips.',
  },
  {
    id: 'arte',
    name: 'Arte',
    subtitle: 'Ilustración, 3D y animación',
    color: '#06B6D4',
    iconName: 'Palette',
    tasks: ['Ilustración digital', 'Diseño gráfico', 'Modelado 3D', 'Animación de personajes', 'Texturas y estilismo'],
    idealFor: 'Personas visuales que dibujan en papel o tableta, modelan en plastilina o disfrutan con la estética.',
  },
  {
    id: 'audio',
    name: 'Audio',
    subtitle: 'Música, efectos y edición',
    color: '#8B5CF6',
    iconName: 'Headphones',
    tasks: ['Composición de música', 'Efectos de sonido (SFX)', 'Grabación de voces', 'Edición y masterización'],
    idealFor: 'Estudiantes que tocan instrumentos, producen pistas en el ordenador o disfrutan experimentando con sintetizadores.',
  },
  {
    id: 'produccion',
    name: 'Producción',
    subtitle: 'Impresión 3D, fabricación y packaging',
    color: '#10B981',
    iconName: 'Package',
    tasks: ['Impresión 3D', 'Maquetación física', 'Fabricación de prototipos', 'Packaging y manuales de instrucciones'],
    idealFor: 'Quienes disfrutan del "taller", montar piezas, calibrar impresoras y crear empaquetados tangibles.',
  },
  {
    id: 'qa',
    name: 'QA (Calidad & Testing)',
    subtitle: 'Testing, detección de errores y balance',
    color: '#E11D48',
    iconName: 'Bug',
    tasks: ['Playtesting riguroso', 'Detección de errores (bugs)', 'Balance de dificultad', 'Documentación de pruebas'],
    idealFor: 'Detallistas con ojo crítico que encuentran bugs donde nadie más los ve y proponen cómo mejorar la jugabilidad.',
  },
  {
    id: 'comunicacion',
    name: 'Comunicación',
    subtitle: 'Web, cartelería, vídeo y difusión',
    color: '#0EA5E9',
    iconName: 'Megaphone',
    tasks: ['Gestión web y redes', 'Vídeos promocionales', 'Cartelería y dossieres', 'Presentación y difusión pública'],
    idealFor: 'Personas elocuentes, con don de gentes, gusto por la redacción, el marketing o el diseño de presentaciones.',
  },
  {
    id: 'project_lead',
    name: 'Product Owner / Project Lead',
    subtitle: 'Liderazgo real, en equipo',
    color: '#FACC15',
    iconName: 'Crown',
    tasks: ['Planificación del proyecto', 'Gestión de tareas y tablero', 'Supervisión de hitos', 'Reuniones de sincronización', 'Documentación global'],
    idealFor: 'El responsable de coordinar el proyecto. Liderazgo empático, visión global y capacidad organizativa.',
  },
];

export const PHASES: PhaseInfo[] = [
  {
    step: 1,
    name: 'IDEA',
    subtitle: 'Identificar reto y formar equipo',
    color: '#FACC15', // Yellow
    actions: [
      'Identificar un reto o una oportunidad',
      'Definir objetivos claros y alcance inicial',
      'Formar el equipo multidisciplinar',
    ],
  },
  {
    step: 2,
    name: 'DISEÑO',
    subtitle: 'Investigar y diseñar solución',
    color: '#F97316', // Orange
    actions: [
      'Investigar referentes y juegos/productos similares',
      'Planificar la arquitectura y mecánicas',
      'Diseñar la solución (bocetos y guión)',
      'Repartir tareas según perfiles de roles',
    ],
  },
  {
    step: 3,
    name: 'PROTOTIPO',
    subtitle: 'Desarrollar y construir',
    color: '#EF4444', // Red
    actions: [
      'Desarrollar la primera versión jugable / funcional',
      'Construir componentes iniciales (código/físico)',
      'Integrar arte, sonido y tecnología',
      'Documentar el avance técnico en el cuaderno del lab',
    ],
  },
  {
    step: 4,
    name: 'PRUEBAS',
    subtitle: 'Testear y validar con usuarios',
    color: '#8B5CF6', // Purple
    actions: [
      'Testear entre miembros del IES y personas ajenas',
      'Detectar errores, fallos de balance o atascos',
      'Recoger feedback estructurado mediante rúbrica',
      'Validar si se cumplen los objetivos de la fase 1',
    ],
  },
  {
    step: 5,
    name: 'MEJORAS',
    subtitle: 'Optimizar y preparar versión final',
    color: '#06B6D4', // Cyan
    actions: [
      'Analizar los resultados del testing',
      'Introducir cambios clave de diseño o código',
      'Optimizar rendimiento, acabados y jugabilidad',
      'Preparar la versión final pulida',
    ],
  },
  {
    step: 6,
    name: 'PRODUCTO FINAL',
    subtitle: 'Presentar, compartir y vivir el resultado',
    color: '#10B981', // Green
    actions: [
      'Presentar en público en el IES Fernando Lázaro Carreter',
      'Compartir con la comunidad educativa y familias',
      'Difundir en medios, web del centro y ferias de Aragón',
      'Vivir el orgullo del resultado creado en equipo',
    ],
  },
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_EVENTS: LabEvent[] = [];

export const INITIAL_COLLABORATIONS: CollaborationRequest[] = [];

export const CALENDAR_TRIMESTERS = [
  {
    trimester: 1,
    title: '1T: Octubre - Diciembre',
    focus: 'Idea y Planificación',
    color: '#EF4444',
    milestones: [
      { num: 1, title: 'Exploración y lluvia de ideas', desc: 'Descubrimiento de intereses, retos e hipótesis creativas.' },
      { num: 2, title: 'Investigación y referentes', desc: 'Análisis de juegos, robots y obras de referencia.' },
      { num: 3, title: 'Diseño del proyecto', desc: 'Documento de visión, reglas iniciales y bocetos clave.' },
      { num: 4, title: 'Plan de trabajo', desc: 'Reparto de los 8 roles y cronograma del equipo.' },
    ],
  },
  {
    trimester: 2,
    title: '2T: Enero - Marzo',
    focus: 'Desarrollo y Prototipado',
    color: '#F59E0B',
    milestones: [
      { num: 5, title: 'Aprendizaje de herramientas', desc: 'Talleres prácticos de Godot, Blender, Arduino y corte láser.' },
      { num: 6, title: 'Creación del prototipo', desc: 'Primer producto jugable, pieza física o pista de audio funcional.' },
      { num: 7, title: 'Pruebas y mejoras', desc: 'Sesiones de testing con otros compañeros y detección de bugs.' },
      { num: 8, title: 'Documentación del proceso', desc: 'Bitácora fotográfica, registro de código y decisiones de diseño.' },
    ],
  },
  {
    trimester: 3,
    title: '3T: Abril - Junio',
    focus: 'Finalización y Demostración',
    color: '#10B981',
    milestones: [
      { num: 9, title: 'Pulido del producto', desc: 'Ajuste de texturas, sonido, jugabilidad y empaquetado.' },
      { num: 10, title: 'Preparación de la presentación', desc: 'Ensayos de pitch, cartelería gráfica y vídeos demostrativos.' },
      { num: 11, title: 'Demostración y feria', desc: 'Apertura de la Gran Feria FLC LAB ante familias y el centro.' },
      { num: 12, title: 'Evaluación y cierre', desc: 'Celebración, balance de aprendizajes y entrega de certificados.' },
    ],
  },
];

export const REQUIREMENTS = [
  {
    title: 'Todo aprobado',
    desc: 'Es necesario tener todas las asignaturas aprobadas para garantizar un equilibrio saludable con el estudio.',
    badge: 'Requisito Académico',
    color: '#EF4444',
    icon: 'CheckCircle2',
  },
  {
    title: 'Todos los niveles',
    desc: 'Pueden participar alumnos desde 1º de la ESO hasta 2º de Bachillerato y Ciclos Formativos.',
    badge: '1º ESO a FP',
    color: '#F59E0B',
    icon: 'Users',
  },
  {
    title: 'Ganas de trabajar',
    desc: 'Interés, curiosidad, motivación y buena disposición para aprender de forma constante en equipo.',
    badge: 'Actitud Maker',
    color: '#06B6D4',
    icon: 'Sparkles',
  },
  {
    title: 'Cualquier expediente',
    desc: 'No es necesario tener una nota media alta; valoramos el esfuerzo, la constancia y la creatividad.',
    badge: 'Inclusivo',
    color: '#8B5CF6',
    icon: 'Award',
  },
  {
    title: 'Individual o en equipo',
    desc: 'Puedes venir ya con tu grupo de amigos o unirte en la primera sesión para conocer a nuevos compañeros.',
    badge: 'Flexible',
    color: '#EC4899',
    icon: 'UserPlus',
  },
  {
    title: 'Cualquier especialidad',
    desc: 'Alumnado de ciencias, humanidades, artes o formación profesional: cada perfil enriquece el proyecto.',
    badge: 'Multidisciplinar',
    color: '#10B981',
    icon: 'Puzzle',
  },
];

export const COMMUNITY_ACTORS = [
  {
    role: 'Alumnado',
    scope: 'De todas las etapas y niveles',
    desc: 'Son los creadores directos, liderando las ideas y viviendo la experiencia de crear un producto real.',
    color: '#EF4444',
  },
  {
    role: 'Profesorado',
    scope: 'De cualquier departamento',
    desc: 'Mentores y facilitadores de conocimientos técnicos, humanísticos, científicos y artísticos.',
    color: '#F59E0B',
  },
  {
    role: 'Equipos y Grupos',
    scope: 'Alumnos y/o profesores combinados',
    desc: 'Células de trabajo autónomas donde conviven distintos talentos y cursos.',
    color: '#06B6D4',
  },
  {
    role: 'Familias',
    scope: 'Madres, padres y tutores',
    desc: 'Apoyo en fabricación, talleres prácticos, testeo familiar y asistencia a la feria final.',
    color: '#8B5CF6',
  },
  {
    role: 'Entidades Externas',
    scope: 'Empresas, asociaciones, exalumnos',
    desc: 'Vínculo con el mundo laboral, donación de recursos y mentorías especializadas.',
    color: '#3B82F6',
  },
  {
    role: 'Toda la Comunidad',
    scope: 'Cualquier persona interesada',
    desc: 'El IES Fernando Lázaro Carreter como faro de innovación abierto al pueblo de Utrillas.',
    color: '#10B981',
  },
];

export const DEFAULT_CREATOR_PROFILES: UserProfile[] = [
  {
    id: 'admin-flc',
    name: 'Administrador FLC LAB',
    handle: '@admin_flc',
    email: 'admin@iesflc.es',
    password: 'iesutrillas2026',
    group: 'profesorado',
    gradeOrDept: 'Coordinación FLC LAB',
    roleType: 'admin',
    isAdmin: true,
    primaryRole: 'project_lead',
    secondaryRoles: ['tecnologia', 'comunicacion'],
    favoriteDisciplines: ['videojuegos', 'robotica', 'juegos_mesa'],
    skillsAndTools: ['Coordinación de Proyectos', 'Metodología Maker', 'Gestión de Equipos'],
    bio: 'Perfil oficial de administración y coordinación general de los proyectos, sesiones y colaboraciones de FLC LAB en el IES Fernando Lázaro Carreter.',
    badgeTitles: ['🛡️ Administrador FLC', '👑 Coordinador'],
    projectIds: [],
    registeredEventIds: [],
    avatarColor: '#F59E0B',
    createdAt: '2026-10-01',
  },
];

export const INITIAL_BITACORA_ENTRIES: BitacoraEntry[] = [];

export const INITIAL_CAROUSEL_SLIDES: HeroCarouselSlide[] = [
  {
    id: 'slide-metodologia',
    tag: 'Metodología Maker',
    title: '6 Fases: De la Idea a la Realidad',
    description: 'Descubrir, Idear, Prototipar, Testear, Iterar y Presentar. Proyectos colaborativos con roles definidos y producto final tangible.',
    subtext: 'Metodología ágil aplicada al aula: videojuegos, robótica y prototipado',
    imageUrl: ASSET_IMAGES.hero,
    linkTab: 'proyectos',
    actionLabel: 'Ver las 6 Fases',
  },
  {
    id: 'slide-mision',
    tag: 'Misión & Filosofía',
    title: 'No es una clase. Es un laboratorio.',
    description: 'Un ecosistema inclusivo donde el error es aprendizaje, aunando ciencia, arte y tecnología para resolver retos comunitarios reales.',
    subtext: 'Comunidad activa: alumnado, familias, docentes y empresas',
    imageUrl: ASSET_IMAGES.game,
    linkTab: 'inicio',
    actionLabel: 'Ver Manifiesto',
  },
  {
    id: 'slide-calendario',
    tag: 'Próxima Sesión Maker',
    title: 'Taller de Prototipado y Robótica',
    description: 'Sesión de creación práctica en el Maker Lab: modelado 3D, circuitos con sensores y programación de mecánicas interactivas.',
    subtext: 'Jueves 16:30 - 18:30 · Aula Maker FLC (1º ESO a FP)',
    imageUrl: ASSET_IMAGES.robotics,
    linkTab: 'calendario',
    actionLabel: 'Ver Calendario',
  },
  {
    id: 'slide-comunidad',
    tag: 'Feria & Comunidad',
    title: 'Mundos de Mañana: Muestra Pública',
    description: 'Hito culminante donde los proyectos de videojuegos, juegos de mesa y robótica se presentan a las familias y al municipio.',
    subtext: 'Feria final de 3T abierta a todo Utrillas',
    imageUrl: ASSET_IMAGES.boardgame,
    linkTab: 'colaboraciones',
    actionLabel: 'Unirse al Lab',
  },
];

export const DEFAULT_FOUNDER_RECRUITS: FounderRecruit[] = [];

