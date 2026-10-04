import React, { useState } from 'react';
import { ItemComment, UserProfile } from '../types/flc';
import { MessageSquare, Send, Trash2, Lock, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

interface ItemCommentsSectionProps {
  title?: string;
  comments?: ItemComment[];
  currentUser?: UserProfile | null;
  isEnrolled: boolean;
  enrollButtonText: string;
  notEnrolledMessage: string;
  enrolledBadgeLabel?: string;
  onEnroll: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export const ItemCommentsSection: React.FC<ItemCommentsSectionProps> = ({
  title = 'Comentarios y Debate',
  comments = [],
  currentUser,
  isEnrolled,
  enrollButtonText,
  notEnrolledMessage,
  enrolledBadgeLabel = 'Inscrito',
  onEnroll,
  onAddComment,
  onDeleteComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }
    if (!isEnrolled) {
      setError('Debes apuntarte primero para poder comentar.');
      return;
    }
    if (!commentText.trim()) {
      return;
    }

    onAddComment(commentText.trim());
    setCommentText('');
    setError('');
  };

  const getGroupBadge = (group: string) => {
    switch (group) {
      case 'profesorado':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Docente</span>;
      case 'alumnado':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">Alumnado</span>;
      case 'familias':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Familia</span>;
      case 'entidades_externas':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">Empresa</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {comments.length}
          </span>
        </div>

        {isEnrolled && currentUser && (
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <UserCheck className="w-3 h-3" />
            <span>{enrolledBadgeLabel}</span>
          </span>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-slate-400 text-xs">
            <p className="font-medium">Aún no hay comentarios.</p>
            <p className="text-[11px] text-slate-500 mt-1">¡Sé el primero en aportar ideas o dudas!</p>
          </div>
        ) : (
          comments.map((c) => {
            const isOwnComment = currentUser?.id === c.authorId;
            const canDelete = currentUser?.isAdmin || isOwnComment;

            return (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5 transition-colors hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] text-slate-950"
                      style={{ backgroundColor: c.authorAvatarColor || '#F59E0B' }}
                    >
                      {c.authorName.charAt(0)}
                    </div>
                    <span className="font-bold text-white">{c.authorName}</span>
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">{c.authorHandle}</span>
                    {getGroupBadge(c.authorGroup)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                    {canDelete && onDeleteComment && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer p-0.5"
                        title="Eliminar comentario"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 pl-8 leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input or Enrollment Gate */}
      {isEnrolled && currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-800">
          {error && <p className="text-rose-400 text-xs font-semibold">{error}</p>}
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Escribe un comentario como ${currentUser.name}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all self-end cursor-pointer shadow-md disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publicar</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notEnrolledMessage}</span>
          </div>

          <button
            type="button"
            onClick={onEnroll}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/20 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{enrollButtonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
