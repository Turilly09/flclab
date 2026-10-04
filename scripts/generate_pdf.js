import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 16:9 presentation dimensions (297 x 167.06 mm)
const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'mm',
  format: [297, 167],
});

const W = 297;
const H = 167;

function drawBackground() {
  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, W, H, 'F');
}

function drawBrand(pageNum) {
  // Yellow Crown
  doc.setFillColor(250, 204, 21);
  doc.triangle(14, 13, 17, 9, 20, 13, 'F');
  doc.triangle(19, 13, 22, 7, 25, 13, 'F');
  doc.triangle(24, 13, 27, 9, 30, 13, 'F');
  doc.rect(14, 13, 16, 2, 'F');

  // FLC LAB Brand Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FLC', 33, 14);

  doc.setTextColor(250, 204, 21);
  doc.text('LAB', 49, 14);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('LABORATORIO DE CREACIÓN', 14, 19);

  // Footer bar
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.line(14, H - 9, W - 14, H - 9);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('IES Fernando Lázaro Carreter · Utrillas (Teruel) · flclab@iesutrillas.es', 14, H - 5);

  doc.setTextColor(250, 204, 21);
  doc.setFont('helvetica', 'bold');
  doc.text(`Página ${pageNum} / 9`, W - 32, H - 5);
}

// Load hero image if available
const heroImgPath = path.resolve(process.cwd(), 'src/assets/images/flc_hero_maker_lab_1790737987297.jpg');
let heroImgBase64 = null;
if (fs.existsSync(heroImgPath)) {
  heroImgBase64 = 'data:image/jpeg;base64,' + fs.readFileSync(heroImgPath).toString('base64');
}

// ================= PAGE 1: PORTADA =================
drawBackground();
if (heroImgBase64) {
  try {
    doc.addImage(heroImgBase64, 'JPEG', W - 145, 12, 138, H - 28, undefined, 'FAST');
    // Dark overlay gradient to blend image nicely
    doc.setFillColor(11, 15, 25);
    doc.rect(W - 145, 12, 18, H - 28, 'F');
  } catch (e) {
    console.error('Image add error:', e);
  }
}
drawBrand(1);

// Title card left
doc.setTextColor(250, 204, 21);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('IES FERNANDO LÁZARO CARRETER · UTRILLAS', 14, 45);

doc.setTextColor(255, 255, 255);
doc.setFontSize(32);
doc.text('IDEAS DE HOY.', 14, 62);

doc.setTextColor(250, 204, 21);
doc.setFontSize(32);
doc.text('MUNDOS DE', 14, 76);
doc.text('MAÑANA.', 14, 90);

doc.setTextColor(226, 232, 240);
doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('Laboratorio Multidisciplinar de Creación de Proyectos', 14, 108);

doc.setTextColor(148, 163, 184);
doc.setFontSize(9);
doc.text('Videojuegos · Impresión 3D · Robótica · Audiovisual · Juegos de Mesa · Música', 14, 116);
doc.text('Comunidad activa: Estudiantes, Docentes, Familias y Entorno', 14, 123);

// ================= PAGE 2: MANIFIESTO =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(2);

// Center card
doc.setFillColor(15, 23, 42);
doc.roundedRect(14, 26, W - 28, H - 42, 6, 6, 'F');
doc.setDrawColor(250, 204, 21);
doc.setLineWidth(0.8);
doc.roundedRect(14, 26, W - 28, H - 42, 6, 6, 'D');

doc.setTextColor(148, 163, 184);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('NUESTRA FILOSOFÍA', W / 2, 45, { align: 'center' });

doc.setTextColor(255, 255, 255);
doc.setFontSize(30);
doc.text('NO ES UNA CLASE.', W / 2, 62, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(34);
doc.text('ES UN LABORATORIO.', W / 2, 78, { align: 'center' });

doc.setTextColor(226, 232, 240);
doc.setFontSize(13);
doc.setFont('helvetica', 'normal');
const p2Text = [
  'Aquí no vienes a memorizar teoría, sino a construir productos reales:',
  'videojuegos, robots funcionales, piezas impresas en 3D, juegos de mesa y bandas sonoras.',
  'Trabajamos en equipos multidisciplinares desde la primera idea hasta la feria final.'
];
doc.text(p2Text, W / 2, 98, { align: 'center', lineHeightFactor: 1.5 });

// 4 pillars pill tags
const p2Pills = ['DISEÑO', 'PROGRAMACIÓN', 'ELECTRÓNICA', 'IMPRESIÓN 3D'];
const pillW = 42;
const pillGap = 12;
const pillStartX = (W - (4 * pillW + 3 * pillGap)) / 2;
p2Pills.forEach((pill, idx) => {
  const px = pillStartX + idx * (pillW + pillGap);
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(px, 128, pillW, 11, 3, 3, 'F');
  doc.setTextColor(250, 204, 21);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(pill, px + pillW / 2, 135.5, { align: 'center' });
});

// ================= PAGE 3: 7 ÁREAS =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(3);

doc.setTextColor(255, 255, 255);
doc.setFontSize(22);
doc.setFont('helvetica', 'bold');
doc.text('¿QUÉ PUEDES HACER TÚ?', W / 2, 31, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(10);
doc.text('7 DISCIPLINAS CREATIVAS COMBINABLES', W / 2, 38, { align: 'center' });

const areas = [
  { name: 'VIDEOJUEGOS', color: [239, 68, 68], desc: 'Desarrollo en Unity/Godot, mecánicas y niveles' },
  { name: 'IMPRESIÓN 3D', color: [245, 158, 11], desc: 'Modelado CAD, laminado y fabricación de piezas' },
  { name: 'DIBUJO E ILUSTRACIÓN', color: [6, 182, 212], desc: 'Concept art, personajes, texturas y 2D digital' },
  { name: 'VÍDEO Y ANIMACIÓN', color: [59, 130, 246], desc: 'Edición, cortometrajes, cinemáticas y motion' },
  { name: 'JUEGOS DE MESA', color: [168, 85, 247], desc: 'Game design analógico, cartas, tableros y dados' },
  { name: 'ELECTRÓNICA Y ROBÓTICA', color: [16, 185, 129], desc: 'Arduino, sensores, motores y automatización' },
];

const cardW = 86;
const cardH = 34;
const gapX = 6;
const gapY = 6;
const startX = (W - (3 * cardW + 2 * gapX)) / 2;
const startY = 46;

areas.forEach((area, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  const x = startX + col * (cardW + gapX);
  const y = startY + row * (cardH + gapY);

  doc.setFillColor(area.color[0], area.color[1], area.color[2]);
  doc.roundedRect(x, y, cardW, cardH, 4, 4, 'F');

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x + 1.2, y + 1.2, cardW - 2.4, cardH - 2.4, 3, 3, 'F');

  doc.setTextColor(area.color[0], area.color[1], area.color[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(area.name, x + cardW / 2, y + 15, { align: 'center' });

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(area.desc, x + cardW / 2, y + 24, { align: 'center', maxWidth: cardW - 8 });
});

// 7th: Music and sound wide bar
const musicY = startY + 2 * (cardH + gapY) + 1;
const musicW = 3 * cardW + 2 * gapX;
doc.setFillColor(236, 72, 153);
doc.roundedRect(startX, musicY, musicW, 18, 4, 4, 'F');
doc.setFillColor(15, 23, 42);
doc.roundedRect(startX + 1.2, musicY + 1.2, musicW - 2.4, 18 - 2.4, 3, 3, 'F');

doc.setTextColor(244, 114, 182);
doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.text('MÚSICA Y SONIDO', startX + musicW / 2, musicY + 9, { align: 'center' });

doc.setTextColor(203, 213, 225);
doc.setFontSize(8.5);
doc.setFont('helvetica', 'normal');
doc.text('Composición de bandas sonoras, efectos de sonido (SFX), grabación vocal y foley', startX + musicW / 2, musicY + 14.5, { align: 'center' });

// ================= PAGE 4: 8 ROLES =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(4);

doc.setTextColor(255, 255, 255);
doc.setFontSize(20);
doc.setFont('helvetica', 'bold');
doc.text('¿QUÉ PUEDES HACER TÚ? (8 ROLES)', W / 2, 29, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(9.5);
doc.text('ESPECIALIDADES DE UN ESTUDIO REAL', W / 2, 35, { align: 'center' });

const roles = [
  { title: 'DISEÑO', color: [239, 68, 68], items: ['• Game design', '• Mecánicas', '• Narrativa', '• UX'] },
  { title: 'TECNOLOGÍA', color: [245, 158, 11], items: ['• Programación', '• Web & Sistemas', '• Arduino', '• Integración'] },
  { title: 'ARTE', color: [6, 182, 212], items: ['• Ilustración', '• Diseño gráfico', '• 3D & Modelado', '• Animación'] },
  { title: 'AUDIO', color: [168, 85, 247], items: ['• Música original', '• Efectos de audio', '• Grabación', '• Mezcla y máster'] },
  { title: 'PRODUCCIÓN', color: [16, 185, 129], items: ['• Impresión 3D', '• Maquetación', '• Fabricación', '• Packaging'] },
  { title: 'QA (CALIDAD)', color: [249, 115, 22], items: ['• Testing y bugs', '• Balance de juego', '• Optimización', '• Documentación'] },
  { title: 'COMUNICACIÓN', color: [59, 130, 246], items: ['• Web y tráileres', '• Cartelería', '• Redes del centro', '• Presentación'] },
  { title: 'PROJECT LEAD', color: [250, 204, 21], items: ['• Planificación', '• Coordinación', '• Hitos & entregas', '• LIDERAZGO REAL'] },
];

const rW = 63;
const rH = 50;
const rGapX = 5;
const rGapY = 5;
const rStartX = (W - (4 * rW + 3 * rGapX)) / 2;
const rStartY = 42;

roles.forEach((role, i) => {
  const row = Math.floor(i / 4);
  const col = i % 4;
  const x = rStartX + col * (rW + rGapX);
  const y = rStartY + row * (rH + rGapY);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, y, rW, rH, 3, 3, 'F');
  doc.setDrawColor(role.color[0], role.color[1], role.color[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, y, rW, rH, 3, 3, 'D');

  doc.setTextColor(role.color[0], role.color[1], role.color[2]);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(role.title, x + rW / 2, y + 10, { align: 'center' });

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  role.items.forEach((item, idx) => {
    doc.text(item, x + 6, y + 19 + idx * 7);
  });
});

// ================= PAGE 5: 6 FASES =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(5);

doc.setTextColor(255, 255, 255);
doc.setFontSize(21);
doc.setFont('helvetica', 'bold');
doc.text('DEL CONCEPTO AL PRODUCTO FINAL', W / 2, 30, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(10);
doc.text('METODOLOGÍA EN 6 FASES ITERATIVAS', W / 2, 37, { align: 'center' });

const steps = [
  { num: '1', title: 'IDEA', color: [234, 179, 8], sub: ['• Identificar reto', '• Definir objetivos', '• Formar equipo'] },
  { num: '2', title: 'DISEÑO', color: [249, 115, 22], sub: ['• Investigar', '• Planificar', '• Repartir tareas'] },
  { num: '3', title: 'PROTOTIPO', color: [239, 68, 68], sub: ['• Desarrollar v1', '• Construir piezas', '• Integrar'] },
  { num: '4', title: 'PRUEBAS', color: [168, 85, 247], sub: ['• Testear producto', '• Detectar errores', '• Recoger feedback'] },
  { num: '5', title: 'MEJORAS', color: [6, 182, 212], sub: ['• Analizar datos', '• Introducir cambios', '• Optimizar'] },
  { num: '6', title: 'PRODUCTO', color: [16, 185, 129], sub: ['• Presentar en IES', '• Demostración pública', '• Celebrar logro'] },
];

const sW = 41;
const sH = 64;
const sGap = 4;
const sStartX = (W - (6 * sW + 5 * sGap)) / 2;
const sY = 46;

steps.forEach((st, idx) => {
  const x = sStartX + idx * (sW + sGap);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, sY, sW, sH, 4, 4, 'F');
  doc.setDrawColor(st.color[0], st.color[1], st.color[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, sY, sW, sH, 4, 4, 'D');

  // Step circle
  doc.setFillColor(st.color[0], st.color[1], st.color[2]);
  doc.circle(x + sW / 2, sY + 12, 7, 'F');
  doc.setTextColor(11, 15, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(st.num, x + sW / 2, sY + 15, { align: 'center' });

  // Title
  doc.setTextColor(st.color[0], st.color[1], st.color[2]);
  doc.setFontSize(10);
  doc.text(st.title, x + sW / 2, sY + 28, { align: 'center' });

  // Sub points
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  st.sub.forEach((line, lidx) => {
    doc.text(line, x + 3.5, sY + 38 + lidx * 7.5);
  });
});

// Iteration loop banner
doc.setFillColor(250, 204, 21);
doc.roundedRect(sStartX, 118, 6 * sW + 5 * sGap, 16, 4, 4, 'F');
doc.setFillColor(15, 23, 42);
doc.roundedRect(sStartX + 1, 119, 6 * sW + 5 * sGap - 2, 14, 3, 3, 'F');

doc.setTextColor(250, 204, 21);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('APRENDER  •  ITERAR  •  SEGUIR MEJORANDO', W / 2, 128, { align: 'center' });

// ================= PAGE 6: CRITERIOS =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(6);

doc.setTextColor(255, 255, 255);
doc.setFontSize(21);
doc.setFont('helvetica', 'bold');
doc.text('¿QUIÉN PUEDE PARTICIPAR?', W / 2, 30, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(10);
doc.text('CRITERIOS CLAROS, INCLUSIVOS Y MOTIVADORES', W / 2, 37, { align: 'center' });

const crit = [
  { t: 'TODO APROBADO', c: [239, 68, 68], d: 'Es necesario tener todas las asignaturas aprobadas para compaginar el taller con tus estudios.' },
  { t: 'TODOS LOS NIVELES', c: [245, 158, 11], d: 'Pueden participar alumnos de 1º ESO a 2º Bachillerato y Ciclos Formativos.' },
  { t: 'GANAS DE TRABAJAR', c: [6, 182, 212], d: 'Interés, constancia, compromiso activo y disposición para aprender y crear de verdad.' },
  { t: 'CUALQUIER EXPEDIENTE', c: [168, 85, 247], d: 'No es necesario tener notas altas: lo importante es tener todo aprobado y actitud positiva.' },
  { t: 'INDIVIDUAL O EN EQUIPO', c: [236, 72, 153], d: 'Puedes inscribirte solo y formar grupo aquí o venir ya con tus compañeros de proyecto.' },
  { t: 'DE CUALQUIER MODALIDAD', c: [16, 185, 129], d: 'Ciencias, tecnología, humanidades, artes o FP: ¡todos los perfiles son bienvenidos!' },
];

const cW = 86;
const cH = 43;
const cStartX = (W - (3 * cW + 2 * gapX)) / 2;
const cStartY = 48;

crit.forEach((item, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  const x = cStartX + col * (cW + gapX);
  const y = cStartY + row * (cH + gapY);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, y, cW, cH, 4, 4, 'F');
  doc.setDrawColor(item.c[0], item.c[1], item.c[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, y, cW, cH, 4, 4, 'D');

  doc.setTextColor(item.c[0], item.c[1], item.c[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(item.t, x + 8, y + 14);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(item.d, x + 8, y + 24, { maxWidth: cW - 16, lineHeightFactor: 1.4 });
});

// ================= PAGE 7: COMUNIDAD =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(7);

doc.setTextColor(255, 255, 255);
doc.setFontSize(21);
doc.setFont('helvetica', 'bold');
doc.text('¿QUIÉN PUEDE PARTICIPAR? (COMUNIDAD)', W / 2, 30, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(10);
doc.text('UNA RED DE TALENTO ABIERTA DENTRO Y FUERA DEL CENTRO', W / 2, 37, { align: 'center' });

const com = [
  { t: 'ALUMNADO', c: [239, 68, 68], d: 'Estudiantes de todas las etapas, cursos e itinerarios formativos del IES.' },
  { t: 'PROFESORADO', c: [245, 158, 11], d: 'Docentes de cualquier departamento aportando mentoría técnica y metodológica.' },
  { t: 'EQUIPOS MIXTOS', c: [6, 182, 212], d: 'Grupos de trabajo formados por alumnado y docentes colaborando mano a mano.' },
  { t: 'FAMILIAS', c: [168, 85, 247], d: 'Madres y padres que quieran colaborar en talleres, fabricación y feria final.' },
  { t: 'ENTIDADES EXTERNAS', c: [59, 130, 246], d: 'Empresas, asociaciones de Utrillas y comarca, profesionales y exalumnos.' },
  { t: 'TODA LA COMUNIDAD', c: [16, 185, 129], d: 'Cualquier persona del entorno educativo interesada en construir futuro.' },
];

com.forEach((item, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  const x = cStartX + col * (cW + gapX);
  const y = cStartY + row * (cH + gapY);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, y, cW, cH, 4, 4, 'F');
  doc.setDrawColor(item.c[0], item.c[1], item.c[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, y, cW, cH, 4, 4, 'D');

  doc.setTextColor(item.c[0], item.c[1], item.c[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(item.t, x + 8, y + 14);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(item.d, x + 8, y + 24, { maxWidth: cW - 16, lineHeightFactor: 1.4 });
});

// ================= PAGE 8: CALENDARIO =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(8);

doc.setTextColor(255, 255, 255);
doc.setFontSize(21);
doc.setFont('helvetica', 'bold');
doc.text('CALENDARIO DEL TALLER', W / 2, 30, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(10);
doc.text('PLANIFICACIÓN ESTRUCTURADA EN 3 TRIMESTRES', W / 2, 37, { align: 'center' });

const terms = [
  {
    pill: '1T · OCTUBRE - DICIEMBRE',
    t: 'IDEA Y PLANIFICACIÓN',
    c: [239, 68, 68],
    items: ['1. Exploración y lluvia de ideas', '2. Investigación y referentes', '3. Diseño del proyecto', '4. Plan de trabajo y roles']
  },
  {
    pill: '2T · ENERO - MARZO',
    t: 'DESARROLLO',
    c: [245, 158, 11],
    items: ['5. Aprendizaje de herramientas', '6. Creación del prototipo', '7. Pruebas y mejoras', '8. Documentación del proceso']
  },
  {
    pill: '3T · ABRIL - JUNIO',
    t: 'FINALIZACIÓN',
    c: [16, 185, 129],
    items: ['9. Pulido del producto final', '10. Preparación de la presentación', '11. Demostración y feria en IES', '12. Evaluación y cierre']
  }
];

const tW = 86;
const tH = 68;
const tStartX = (W - (3 * tW + 2 * gapX)) / 2;
const tY = 46;

terms.forEach((tm, i) => {
  const x = tStartX + i * (tW + gapX);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, tY, tW, tH, 4, 4, 'F');
  doc.setDrawColor(tm.c[0], tm.c[1], tm.c[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, tY, tW, tH, 4, 4, 'D');

  // Pill badge
  doc.setFillColor(tm.c[0], tm.c[1], tm.c[2]);
  doc.roundedRect(x + 6, tY + 8, tW - 12, 8, 2, 2, 'F');
  doc.setTextColor(11, 15, 25);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(tm.pill, x + tW / 2, tY + 13.5, { align: 'center' });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.text(tm.t, x + tW / 2, tY + 25, { align: 'center' });

  // Items
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  tm.items.forEach((it, idx) => {
    doc.text(it, x + 8, tY + 35 + idx * 8);
  });
});

// Outcome banner
doc.setFillColor(250, 204, 21);
doc.roundedRect(tStartX, 120, 3 * tW + 2 * gapX, 15, 3, 3, 'F');
doc.setFillColor(15, 23, 42);
doc.roundedRect(tStartX + 1, 121, 3 * tW + 2 * gapX - 2, 13, 2.5, 2.5, 'F');
doc.setTextColor(250, 204, 21);
doc.setFontSize(9.5);
doc.setFont('helvetica', 'bold');
doc.text('RESULTADO: PRODUCTO REAL Y FUNCIONAL PRESENTADO PÚBLICAMENTE EN EL CENTRO', W / 2, 129, { align: 'center' });

// ================= PAGE 9: CONTACTO =================
doc.addPage([W, H], 'landscape');
drawBackground();
drawBrand(9);

// Large center box
doc.setFillColor(15, 23, 42);
doc.roundedRect(24, 28, W - 48, H - 46, 6, 6, 'F');
doc.setDrawColor(250, 204, 21);
doc.setLineWidth(1);
doc.roundedRect(24, 28, W - 48, H - 46, 6, 6, 'D');

doc.setTextColor(255, 255, 255);
doc.setFontSize(38);
doc.setFont('helvetica', 'bold');
doc.text('¡GRACIAS!', W / 2, 54, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(18);
doc.text('¿PREGUNTAS? ¿IDEAS?', W / 2, 68, { align: 'center' });

// Email badge
doc.setFillColor(30, 41, 59);
doc.roundedRect(W / 2 - 70, 78, 140, 22, 5, 5, 'F');
doc.setDrawColor(250, 204, 21);
doc.setLineWidth(0.8);
doc.roundedRect(W / 2 - 70, 78, 140, 22, 5, 5, 'D');

doc.setTextColor(255, 255, 255);
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('flclab@iesutrillas.es', W / 2, 92, { align: 'center' });

doc.setTextColor(148, 163, 184);
doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.text('IES Fernando Lázaro Carreter · Utrillas (Teruel)', W / 2, 114, { align: 'center' });

doc.setTextColor(250, 204, 21);
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('Ideas de hoy, mundos de mañana.', W / 2, 124, { align: 'center' });

// Save PDF to public directory
const outputPath = path.resolve(publicDir, 'flc-lab-presentacion.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

// Also copy to dist if dist exists
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.resolve(distDir, 'flc-lab-presentacion.pdf'), Buffer.from(pdfBytes));
}

console.log('High-fidelity PDF generated at:', outputPath, 'bytes:', pdfBytes.byteLength);
