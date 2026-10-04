import React from 'react';
import { UserProfile } from '../types/flc';
import { ShieldCheck, UserCheck, UserX, Clock, X, AlertTriangle, GraduationCap, Mail, Building2, CheckCircle2 } from 'lucide-react';

interface TeacherAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onUpdateUserTeacherStatus: (userId: string, newStatus: 'aprobado' | 'rechazado' | 'pendiente') => void;
}

export const TeacherAdmissionModal: React.FC<TeacherAdmissionModalProps> = ({
  isOpen,
  onClose,
  users,
  onUpdateUserTeacherStatus,
}) => {
  if (!isOpen) return null;

  // Filter all non-superadmin users who registered as profesorado
  const teacherUsers = users.filter((u) => u.group === 'profesorado' && !u.isAdmin);
  const pendingTeachers = teacherUsers.filter((u) => (u.teacherStatus || 'pendiente') === 'pendiente');
  const approvedTeachers = teacherUsers.filter((u) => u.teacherStatus === 'aprobado');
  const rejectedTeachers = teacherUsers.filter((u) => u.teacherStatus === 'rechazado');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/60 rounded-2xl shadow-2xl p-5 sm:p-6 my-6 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Control de Acceso Docente</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Admisión y Validación de Profesorado</span>
              {pendingTeachers.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-slate-950 animate-pulse">
                  {pendingTeachers.length} pendiente{pendingTeachers.length > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Para salvaguardar la privacidad de los proyectos y las calificaciones, solo los docentes validados y admitidos por el Administrador pueden crear y coordinar proyectos oficiales.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Policy Reminder */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Regla de Admisión Obligatoria: </span>
            Cualquier usuario que se registre bajo el colectivo docente permanece en modo lectura sin privilegios docentes hasta que el Administrador presione el botón <strong className="text-emerald-400">«Admitir como Docente»</strong> o se valide mediante la clave del centro.
          </div>
        </div>

        {/* Teachers Directory */}
        <div className="space-y-4">
          {teacherUsers.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No hay solicitudes de docentes registradas</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Cuando un profesor o profesora del centro se dé de alta seleccionando el colectivo «Profesorado / Docente», aparecerá aquí para que puedas autorizar su acceso.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {teacherUsers.map((teacher) => {
                const status = teacher.teacherStatus || 'pendiente';

                return (
                  <div
                    key={teacher.id}
                    className={`p-4 rounded-xl border transition-all ${
                      status === 'pendiente'
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/5'
                        : status === 'aprobado'
                        ? 'bg-slate-950 border-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950 shrink-0 text-sm shadow-sm"
                          style={{ backgroundColor: teacher.avatarColor || '#10B981' }}
                        >
                          {teacher.name.charAt(0)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                            <span className="text-xs text-slate-400 font-mono">{teacher.handle}</span>

                            {/* Status badge */}
                            {status === 'pendiente' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pendiente de Admisión
                              </span>
                            )}
                            {status === 'aprobado' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Docente Admitido
                              </span>
                            )}
                            {status === 'rechazado' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                <UserX className="w-3 h-3" />
                                No Admitido
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Mail className="w-3.5 h-3.5" />
                              {teacher.email}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Building2 className="w-3.5 h-3.5" />
                              {teacher.gradeOrDept || 'Dpto. No especificado'}
                            </span>
                          </div>

                          {teacher.bio && (
                            <p className="text-xs text-slate-400 italic line-clamp-2 mt-1">
                              «{teacher.bio}»
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {status === 'pendiente' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateUserTeacherStatus(teacher.id, 'aprobado')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-emerald-500/20"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Admitir Docente</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateUserTeacherStatus(teacher.id, 'rechazado')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Rechazar</span>
                            </button>
                          </>
                        )}

                        {status === 'aprobado' && (
                          <button
                            type="button"
                            onClick={() => onUpdateUserTeacherStatus(teacher.id, 'pendiente')}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-amber-300 hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Revertir estado a pendiente"
                          >
                            <span>Suspender / Revisar</span>
                          </button>
                        )}

                        {status === 'rechazado' && (
                          <button
                            type="button"
                            onClick={() => onUpdateUserTeacherStatus(teacher.id, 'aprobado')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Reconsiderar y Admitir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400">
            Total docentes: <strong className="text-white">{teacherUsers.length}</strong> (
            <span className="text-emerald-400">{approvedTeachers.length} admitidos</span>,{' '}
            <span className="text-amber-400">{pendingTeachers.length} pendientes</span>)
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
