import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, Copy, Check, RefreshCw, XCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  name?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class DiagnosticErrorBoundary extends Component<Props, State> {
  private unhandledListener?: (event: PromiseRejectionEvent) => void;
  private windowErrorListener?: (event: ErrorEvent) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[FLC_DEBUG_ERROR in ${this.props.name || 'Component'}]:`, error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Save to sessionStorage so it persists across reloads if desired
    try {
      sessionStorage.setItem(
        'flc_last_crash',
        JSON.stringify({
          time: new Date().toISOString(),
          component: this.props.name || 'Global',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  componentDidMount() {
    // Only the root instance should register global listeners
    if (!this.props.name || this.props.name === 'Root') {
      this.windowErrorListener = (event: ErrorEvent) => {
        console.error('[FLC_GLOBAL_WINDOW_ERROR]:', event.error || event.message);
        if (event.error instanceof Error && !this.state.hasError) {
          this.setState({
            hasError: true,
            error: event.error,
          });
        }
      };

      this.unhandledListener = (event: PromiseRejectionEvent) => {
        console.error('[FLC_UNHANDLED_PROMISE_REJECTION]:', event.reason);
        if (event.reason instanceof Error && !this.state.hasError) {
          this.setState({
            hasError: true,
            error: event.reason,
          });
        }
      };

      window.addEventListener('error', this.windowErrorListener);
      window.addEventListener('unhandledrejection', this.unhandledListener);
    }
  }

  componentWillUnmount() {
    if (this.windowErrorListener) {
      window.removeEventListener('error', this.windowErrorListener);
    }
    if (this.unhandledListener) {
      window.removeEventListener('unhandledrejection', this.unhandledListener);
    }
  }

  handleCopy = () => {
    const { error, errorInfo } = this.state;
    const diagnosticReport = [
      `=== INFORME DE DIAGNÓSTICO FLC LAB ===`,
      `Fecha y hora: ${new Date().toLocaleString()}`,
      `Componente: ${this.props.name || 'Raíz / Global'}`,
      `Mensaje: ${error?.message || 'Error desconocido'}`,
      `Tipo: ${error?.name || 'Error'}`,
      `--- STACK TRACE ---`,
      error?.stack || 'No disponible',
      `--- COMPONENT STACK ---`,
      errorInfo?.componentStack || 'No disponible',
    ].join('\n\n');

    navigator.clipboard.writeText(diagnosticReport).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, copied } = this.state;
      const componentName = this.props.name || 'Aplicación Principal';

      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-rose-500 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 my-auto text-left">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-rose-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/40">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Depurador Activo · {componentName}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Error Detectado en {componentName}
                  </h2>
                </div>
              </div>

              <button
                onClick={this.handleReset}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Cerrar depurador / reintentar"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Error Message */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                Mensaje exacto del error:
              </div>
              <div className="font-mono text-sm break-words font-semibold">
                {error?.name}: {error?.message || 'Error no especificado'}
              </div>
            </div>

            {/* Error Details Tabs */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Rastro de la pila (Stack Trace):</span>
                <span className="text-[10px] text-slate-500">Inspección de depuración</span>
              </div>
              <div className="max-h-56 overflow-y-auto p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                {error?.stack || 'No se pudo capturar el stack trace.'}
              </div>
            </div>

            {errorInfo?.componentStack && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Componentes React involucrados (Component Stack):
                </div>
                <div className="max-h-40 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300/80 leading-relaxed whitespace-pre-wrap select-all">
                  {errorInfo.componentStack}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                Copia este informe para que podamos corregir el problema exacto inmediatamente.
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={this.handleCopy}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '¡Informe Copiado!' : 'Copiar Informe de Error'}</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
