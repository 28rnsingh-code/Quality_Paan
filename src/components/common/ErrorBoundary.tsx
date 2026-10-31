import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // Explicitly declare state and props for environments without @types/react
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error trapped by ErrorBoundary:', error, errorInfo);

    // If quota exceeded or storage error, auto-evict old cache keys to self-heal
    if (
      error.name === 'QuotaExceededError' || 
      error.message?.toLowerCase().includes('quota') ||
      error.message?.toLowerCase().includes('setitem')
    ) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const obsoleteKeys = ['qp_temp_cache', 'qp_payment_config_v1'];
          obsoleteKeys.forEach(k => {
            try { localStorage.removeItem(k); } catch {}
          });
        }
      } catch (cleanupErr) {
        console.warn('Auto cache eviction attempt encountered:', cleanupErr);
      }
    }
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const obsoleteKeys = ['qp_temp_cache', 'qp_payment_config_v1'];
        obsoleteKeys.forEach(k => {
          try { localStorage.removeItem(k); } catch {}
        });
      }
    } catch (e) {
      console.warn(e);
    }
    (this as any).setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C0C0C] text-[#F3EFE0] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#141414] border-2 border-[#D4AF37]/40 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A2D09] to-[#D4AF37] p-0.5 mx-auto flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-2xl bg-[#141414] flex items-center justify-center text-2xl font-royal font-black text-[#E5C158]">
                QP
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-royal text-xl font-bold text-white">
                Storefront Protected &amp; Restored
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                A localized storage or component exception was safely caught. Your session and catalog data have been protected.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl font-royal font-bold text-xs bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black hover:brightness-110 shadow-lg cursor-pointer transition-all active:scale-95"
            >
              Refresh &amp; Resume Shopping
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
