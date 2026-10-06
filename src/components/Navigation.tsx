import React from 'react';
import {
  LayoutDashboard,
  Languages,
  Compass,
  FileText,
  Sparkles,
  MessageSquareCode,
  SlidersHorizontal,
  UserCheck,
  AlertTriangle,
  Database,
  Printer,
} from 'lucide-react';

export type ViewTab =
  | 'dashboard'
  | 'translation-lab'
  | 'localization-lab'
  | 'linguistic-analysis'
  | 'cultural-eval'
  | 'hinglish-module'
  | 'prompt-playground'
  | 'human-review'
  | 'error-analysis'
  | 'dataset-explorer'
  | 'reports';

interface NavigationProps {
  currentTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
}

export const NAV_ITEMS: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'translation-lab', label: 'Translation Lab', icon: Languages },
  { id: 'localization-lab', label: 'Localization Lab', icon: Compass },
  { id: 'linguistic-analysis', label: 'Linguistic Analysis', icon: FileText },
  { id: 'cultural-eval', label: 'Cultural Evaluation', icon: Sparkles },
  { id: 'hinglish-module', label: 'Hinglish Module', icon: MessageSquareCode },
  { id: 'prompt-playground', label: 'Prompt Playground', icon: SlidersHorizontal },
  { id: 'human-review', label: 'Human Review', icon: UserCheck },
  { id: 'error-analysis', label: 'Error Analysis', icon: AlertTriangle },
  { id: 'dataset-explorer', label: 'Dataset Explorer', icon: Database },
  { id: 'reports', label: 'Audit Reports', icon: Printer },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onChangeTab }) => {
  return (
    <nav className="border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 py-1.5 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-white text-indigo-900 shadow-xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
