import React from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  Sparkles,
  Server,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  demoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  geminiLiveAvailable: boolean;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  demoMode,
  onToggleDemoMode,
  geminiLiveAvailable,
  currentView,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
                  LinguaGuard
                </span>
                <span className="text-xs text-slate-400 font-mono">v1.2</span>
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 font-normal">
                <span>Multilingual LLM Evaluation</span>
                <span aria-hidden="true">·</span>
                <span>English</span>
                <span aria-hidden="true">/</span>
                <span>Hindi</span>
                <span aria-hidden="true">/</span>
                <span>Hinglish</span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-600 font-medium">Indic NLP</span>
              </div>
            </div>
          </div>

          {/* Engine Mode Toggle & Operational Status */}
          <div className="flex items-center gap-4">
            {/* Status metadata */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>3 Language Engines</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>15 Cultural Rubrics</span>
              </span>
            </div>

            {/* Mode switch */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onToggleDemoMode(false)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  !demoMode
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={geminiLiveAvailable ? 'Using Gemini 3.8 Flash' : 'API Key required for Live Mode'}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Live Gemini</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleDemoMode(true)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  demoMode
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Deterministic NLP Heuristics (no API keys required)"
              >
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>Demo / Offline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
