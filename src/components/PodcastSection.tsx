import React, { useState } from 'react';
import {
  Mic,
  Radio,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  Sliders,
  Users,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { RoleId } from '../types/flc';

interface PodcastSectionProps {
  onOpenProjectDetail?: (projectId: string) => void;
  onJoinRole?: (roleId: RoleId) => void;
  onOpenRecruitModal?: () => void;
}

export const PodcastSection: React.FC<PodcastSectionProps> = ({
  onOpenProjectDetail,
  onJoinRole,
  onOpenRecruitModal,
}) => {
  const [activeTab, setActiveTab] = useState<'episodio1' | 'como_lo_haremos' | 'participa'>('episodio1');

  const episode1Topics = [
    {
      title: '¿Qué demonios es el FLC LAB?',
      desc: 'Por qué no es una clase más, por qué no hay exámenes y qué significa aprender creando proyectos propios.',
    },
    {
      title: 'El Escuadrón Fundador (20 Plazas)',
      desc: 'Cómo apuntarse, qué compromiso se pide y qué ventajas tienen los pioneros de esta temporada 0.',
    },
    {
      title: 'Las Herramientas del Taller',
      desc: 'Qué máquinas y programas tendremos en el instituto: impresoras 3D, ordenadores, robótica, resina y tablero.',
    },
    {
      title: 'La Red que nos Respalda',
      desc: 'Cómo participan profesores mentores, familias y empresas externas que vienen a colaborar sin poner notas.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-[#090D18] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-orange-600/10 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center lg:text-left items-center lg:items-start">
          <div className="space-y-3 max-w-2xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs uppercase tracking-wider mx-auto lg:mx-0">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Proyecto en Lanzamiento · Comunicación & Sonido</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              FLC ONDAS:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                EL PODCAST DEL LAB
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Queremos que el instituto y el pueblo de Utrillas sepan qué se está cociendo en el
              laboratorio. Para ello, ponemos en marcha el podcast oficial del centro: un proyecto en el
              que los propios alumnos redactarán los guiones, manejarán los micrófonos y entrevistarán a
              los creadores de cada taller.
            </p>
          </div>

          {/* Clean Segmented Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 mx-auto lg:mx-0">
            <button
              onClick={() => setActiveTab('episodio1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'episodio1'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Episodio 1 (En Preparación)
            </button>
            <button
              onClick={() => setActiveTab('como_lo_haremos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'como_lo_haremos'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cómo lo Haremos
            </button>
            <button
              onClick={() => setActiveTab('participa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'participa'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Participa en la Grabación
            </button>
          </div>
        </div>

        {/* Tab 1: EPISODIO 1 EN PREPARACIÓN */}
        {activeTab === 'episodio1' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Official Announcement Card */}
            <div className="lg:col-span-7 space-y-6 w-full">
              <div className="p-5 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start">
                {/* Status Header */}
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wider">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Próxima Grabación · Temporada 0</span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    IES Fernando Lázaro Carreter
                  </span>
                </div>

                {/* Episode Title & Synopsis */}
                <div className="space-y-3 w-full flex flex-col items-center sm:items-start">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400">
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>Episodio 01</span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Primer Trimestre</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    ¿Qué es el FLC LAB? Presentación del Laboratorio
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Será el episodio inaugural de nuestra radio escolar. Nos sentaremos frente a los
                    micrófonos para explicar con total claridad qué queremos conseguir, cómo pueden
                    apuntarse los alumnos antes de que se completen las 20 plazas del Escuadrón
                    Fundador y qué proyectos empezaremos a construir.
                  </p>
                </div>

                {/* Honest Roadmap / Escaleta */}
                <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Escaleta de Contenidos del Episodio
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 font-mono">
                      4 Bloques Clave
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {episode1Topics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                      >
                        <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">{topic.title}</div>
                          <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                            {topic.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sincere Footer with Project Status */}
                <div className="w-full flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-2 border-t border-slate-800 text-center sm:text-left">
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-200">Estado del proyecto:</strong> Fase 1 (Idea y Formación de Equipo)
                  </div>

                  {onOpenProjectDetail && (
                    <button
                      onClick={() => onOpenProjectDetail('proj_podcast_flc_ondas')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Ficha en Catálogo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Recruitment Call for Students */}
            <div className="lg:col-span-5 space-y-4 w-full">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border-2 border-slate-800 space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
                  <Mic className="w-6 h-6" />
                </div>

                <div className="space-y-2 w-full">
                  <h4 className="text-xl font-black text-white leading-tight">
                    Buscamos al equipo que grabará este primer episodio
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Este podcast no está grabado todavía porque queremos hacerlo con vosotros. No
                    necesitas experiencia previa: aprenderás a redactar, a hablar con naturalidad y a
                    editar el sonido con apoyo docente.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 w-full text-left">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Locución:</strong> Conducir y hacer preguntas.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Sonido:</strong> Controlar los micros y editar en PC.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>Guion:</strong> Preparar las notas y temas de debate.</span>
                  </div>
                </div>

                <div className="pt-2 w-full">
                  <button
                    onClick={() => setActiveTab('participa')}
                    className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Quiero apuntarme a la grabación</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CÓMO LO HAREMOS (HERRAMIENTAS REALES) */}
        {activeTab === 'como_lo_haremos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white">Grabación en el Aula</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Habilitaremos un espacio adecuado con micrófonos USB y filtros antipop para que las
                voces de los alumnos se escuchen nítidas y limpias.
              </p>
              <div className="text-[11px] text-amber-400 font-bold pt-1">
                Foco: Expresión oral, perder el miedo a hablar y comunicar con claridad.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto sm:mx-0">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white">Edición con Software Libre</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilizaremos Audacity (herramienta abierta y gratuita) para que cualquier alumno pueda
                aprender a cortar pistas, nivelar el volumen y exportar los episodios.
              </p>
              <div className="text-[11px] text-cyan-400 font-bold pt-1">
                Foco: Competencia digital práctica y habilidades técnicas de audio.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col items-center sm:items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-400 flex items-center justify-center mx-auto sm:mx-0">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white">Difusión al Entorno</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Una vez montado, el episodio se publicará en la plataforma web del IES y se compartirá
                con las familias para que conozcan las creaciones de sus hijos.
              </p>
              <div className="text-[11px] text-purple-400 font-bold pt-1">
                Foco: Transparencia total y orgullo por el trabajo hecho en equipo.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: PARTICIPA EN EL EQUIPO */}
        {activeTab === 'participa' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border-2 border-amber-400/40 space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="max-w-2xl space-y-2 mx-auto sm:mx-0">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                Convocatoria Abierta para Alumnado
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¿Quieres formar parte del equipo del Episodio 1?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No importa tu curso (desde 1º ESO hasta 2º Bach y FP) ni si nunca has grabado antes.
                Buscamos alumnos con curiosidad que quieran asumir alguno de estos tres papeles:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 w-full">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="font-black text-sm text-white">🎙️ Locución / Entrevista</div>
                <div className="text-xs text-slate-400">
                  Presentar el episodio, dar paso a las secciones y mantener la conversación fluida.
                </div>
                {onJoinRole && (
                  <button
                    onClick={() => onJoinRole('comunicacion')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center sm:justify-start gap-1 cursor-pointer pt-1"
                  >
                    <span>Fichar como Comunicador</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="font-black text-sm text-white">🎧 Sonido y Montaje</div>
                <div className="text-xs text-slate-400">
                  Controlar los niveles de grabación, cuidar que no haya ruidos y montar el audio final.
                </div>
                {onJoinRole && (
                  <button
                    onClick={() => onJoinRole('audio')}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center sm:justify-start gap-1 cursor-pointer pt-1"
                  >
                    <span>Fichar como Sonidista</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="font-black text-sm text-white">📝 Redacción y Guion</div>
                <div className="text-xs text-slate-400">
                  Escribir la escaleta, redactar los textos de apertura y preparar las preguntas clave.
                </div>
                {onJoinRole && (
                  <button
                    onClick={() => onJoinRole('produccion')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center sm:justify-start gap-1 cursor-pointer pt-1"
                  >
                    <span>Fichar como Productor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 w-full">
              {onOpenRecruitModal && (
                <button
                  onClick={onOpenRecruitModal}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Darse de Alta como Alumno Fundador</span>
                </button>
              )}

              {onOpenProjectDetail && (
                <button
                  onClick={() => onOpenProjectDetail('proj_podcast_flc_ondas')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Ver Ficha del Proyecto en el Catálogo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
