import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  Users,
  Sparkles,
  ArrowRight,
  Download,
  Mail,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Cpu,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types/flc';

interface ExternalPartnersSectionProps {
  currentUser?: UserProfile | null;
  onOpenCollabProposal: () => void;
  onDownloadPdf: () => void;
  onOpenAuthModal: (tab: 'login' | 'register') => void;
}

export const ExternalPartnersSection: React.FC<ExternalPartnersSectionProps> = ({
  currentUser,
  onOpenCollabProposal,
  onDownloadPdf,
  onOpenAuthModal,
}) => {
  const [activePartnerTab, setActivePartnerTab] = useState<'empresas' | 'ayuntamiento' | 'familias'>('empresas');

  return (
    <section id="alianzas" className="py-16 sm:py-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0B0F19] via-[#0D1322] to-[#0B0F19] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-widest shadow-sm">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Alianzas & Ecosistema Territorial · Utrillas (Teruel)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            CONSTRUIR EL LAB CON NUESTRA COMUNIDAD
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            El <strong className="text-white font-bold">FLC LAB</strong> no es un proyecto cerrado: nace desde el <strong className="text-amber-300">IES Fernando Lázaro Carreter</strong> para transformar el entorno rural de las Cuencas Mineras. Abrimos las puertas a empresas, al Ayuntamiento y a las familias para codiseñarlo y respaldarlo desde el primer día.
          </p>
        </div>

        {/* 3 Pillars Selection Strip */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-2xl mx-auto">
          <button
            onClick={() => setActivePartnerTab('empresas')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activePartnerTab === 'empresas'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Empresas & Industria</span>
          </button>

          <button
            onClick={() => setActivePartnerTab('ayuntamiento')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activePartnerTab === 'ayuntamiento'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <span>Ayuntamiento & Entidades</span>
          </button>

          <button
            onClick={() => setActivePartnerTab('familias')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activePartnerTab === 'familias'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Familias</span>
          </button>
        </div>

        {/* Dynamic Card based on Tab */}
        <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
          {activePartnerTab === 'empresas' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  Tejido Productivo, Tecnológico y Comercial
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ¿Por qué vincular tu empresa al FLC LAB?
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Las empresas de nuestra comarca necesitan talento joven con iniciativa, competencias digitales y capacidad de resolución de problemas. Vincularse al laboratorio permite formar una <strong className="text-white">cantera temprana de alumnos motivados</strong> y ejercer una Responsabilidad Social Corporativa con impacto directo en Utrillas.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Lanzar un Reto Real</h4>
                      <p className="text-xs text-slate-400">
                        Plantea una necesidad o desafío técnico/diseño de tu sector para que los estudiantes lo investiguen y desarrollen como proyecto maker.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Mentoría Profesional (1 hora/trimestre)</h4>
                      <p className="text-xs text-slate-400">
                        Tus profesionales o ingenieros pueden inspirar a los estudiantes dando feedback y compartiendo cómo se trabaja en el mundo real.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Donación de Material o Patrocinio</h4>
                      <p className="text-xs text-slate-400">
                        Filamento 3D, componentes de electrónica, herramientas o equipos informáticos fuera de ciclo corporativo que cobran nueva vida en el aula.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuthModal('register');
                      } else {
                        onOpenCollabProposal();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg shadow-amber-400/25 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Proponer Reto o Alianza de Empresa</span>
                  </button>

                  <button
                    onClick={onDownloadPdf}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Descargar Dossier Oficial (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Right Summary Badge Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Distintivo Empresa Aliada</h4>
                    <p className="text-xs text-slate-400">Reconocimiento público y visibilidad</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Presencia de marca en la Feria Final de Muestras (3T).
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Logotipo en los carteles y materiales del FLC LAB.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Certificado de Responsabilidad Social Educativa emitido por el IES.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Contacto preferente con alumnos egresados de ciclos formativos.
                  </li>
                </ul>

                <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs">
                  <p className="font-semibold">
                    «Una inversión directa en los jóvenes que mañana impulsarán la industria y el comercio de nuestra comarca.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePartnerTab === 'ayuntamiento' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5" />
                  Compromiso Institucional y Municipal
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Utrillas como faro de innovación rural
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  El FLC LAB es una oportunidad estratégica para el <strong className="text-white">Ayuntamiento de Utrillas y la Comarca de Cuencas Mineras</strong>. Convertir el centro educativo en un polo de creación tecnológica demuestra que desde el medio rural se pueden liderar proyectos de vanguardia, combatiendo la brecha digital y la despoblación.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Sede de la Gran Feria de Muestras</h4>
                      <p className="text-xs text-slate-400">
                        Cesión de instalaciones municipales (pabellón, casa de cultura o plaza) para el evento público donde todo el pueblo conocerá los proyectos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Dotación de Premios y Becas de Material</h4>
                      <p className="text-xs text-slate-400">
                        Apoyo municipal con pequeños fondos para la adquisición de placas Arduino, sensores, herramientas y licencias educativas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Difusión Institucional Comarcal</h4>
                      <p className="text-xs text-slate-400">
                        Inclusión de las actividades del Lab en la agenda cultural del consistorio, bandos y medios locales.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuthModal('register');
                      } else {
                        onOpenCollabProposal();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg shadow-blue-500/25 cursor-pointer"
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Pactar Alianza Municipal / Institucional</span>
                  </button>

                  <button
                    onClick={onDownloadPdf}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                    <span>Dossier Institucional (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Right Info Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Impacto para Utrillas</h4>
                    <p className="text-xs text-slate-400">Arraigo, juventud y orgullo local</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Fijación de población joven con vocaciones STEAM.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Dinamización del pueblo con un evento anual de referencia.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Vínculo intergeneracional entre el IES y la ciudadanía.
                  </li>
                </ul>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                  <p className="font-semibold">
                    «Cuando la escuela y el ayuntamiento van de la mano, los jóvenes entienden que quedarse en su pueblo también es avanzar.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePartnerTab === 'familias' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  Familias y Comunidad Educativa
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  De «consumir pantallas» a «construir su futuro»
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  No es una actividad donde los estudiantes se distraigan: en el FLC LAB aprenden a <strong className="text-white">gestionar proyectos reales</strong>, a programar, a diseñar y a defender sus ideas en público. Una preparación práctica para el Bachillerato, la Formación Profesional o la Universidad.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Competencias para la Vida</h4>
                      <p className="text-xs text-slate-400">
                        Tolerancia a la frustración, pensamiento crítico, trabajo en equipo y habilidades comunicativas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Talleres Compartidos Familia-Alumnado</h4>
                      <p className="text-xs text-slate-400">
                        Oportunidad de participar en sesiones abiertas donde padres, madres e hijos aprenden juntos robótica o diseño de juegos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Acompañar sin Presión</h4>
                      <p className="text-xs text-slate-400">
                        El error aquí no se castiga: es el paso previo necesario para prototipar con éxito.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuthModal('register');
                      } else {
                        onOpenCollabProposal();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg shadow-purple-500/25 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Sumarse como Familia Colaboradora</span>
                  </button>

                  <button
                    onClick={onDownloadPdf}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Dossier Explicativo (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Right Box for Families */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">¿Qué gana tu hijo/a?</h4>
                    <p className="text-xs text-slate-400">Habilidades más allá del libro de texto</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Descubrir su vocación técnica o artística antes de elegir FP o Bachillerato.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Aprender a trabajar con compañeros de otros cursos y edades.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Orgullo de ver su propio proyecto expuesto ante el pueblo.
                  </li>
                </ul>

                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                  <p className="font-semibold">
                    «No queremos que sólo jueguen a videojuegos: queremos que aprendan a crearlos, a pensar y a colaborar.»
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Simple Steps to Partner without Bureaucracy */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Cero burocracia: Cómo colaborar en 4 pasos
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Un proceso ágil y transparente coordinado por el profesorado del centro
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <span className="text-3xl font-black text-slate-700 tabular-nums">01</span>
              <h4 className="text-sm font-bold text-white">Contacto Inicial</h4>
              <p className="text-xs text-slate-400">
                Charla de 15 minutos (presencial en el IES o por videollamada) con el equipo docente coordinador.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <span className="text-3xl font-black text-slate-700 tabular-nums">02</span>
              <h4 className="text-sm font-bold text-white">Definición de Alianza</h4>
              <p className="text-xs text-slate-400">
                Se acuerda la modalidad: plantear un reto real, mentoría técnica, donación o apoyo logístico.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <span className="text-3xl font-black text-slate-700 tabular-nums">03</span>
              <h4 className="text-sm font-bold text-white">Conexión con Alumnos</h4>
              <p className="text-xs text-slate-400">
                El equipo maker recibe el reto o material y empieza a trabajar con seguimiento docente.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <span className="text-3xl font-black text-amber-400/80 tabular-nums">04</span>
              <h4 className="text-sm font-bold text-amber-300">Reconocimiento & Feria</h4>
              <p className="text-xs text-slate-400">
                Presentación pública en la Feria Final de 3T con visibilidad y agradecimiento formal.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Contact Bar */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">¿Tienes dudas o quieres proponer algo a medida?</h4>
            <p className="text-xs text-slate-400">
              Escríbenos directamente a la coordinación del proyecto en el instituto.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:flclab@iesutrillas.es"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>flclab@iesutrillas.es</span>
            </a>

            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuthModal('register');
                } else {
                  onOpenCollabProposal();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <span>Enviar Propuesta Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
