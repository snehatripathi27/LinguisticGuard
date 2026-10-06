import React from 'react';

interface BarChartItem {
  label: string;
  value: number;
  max?: number;
  color?: string;
  secondary?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ items, title }) => {
  const maxVal = Math.max(...items.map((i) => i.value), 10);

  return (
    <div className="w-full space-y-3">
      {title && <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{title}</h4>}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const percentage = Math.min(100, Math.max(0, (item.value / (item.max || maxVal)) * 100));
          const barColor = item.color || '#3b82f6';

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-medium text-slate-700 truncate">{item.label}</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-slate-900">{item.value.toFixed(1)}</span>
                  {item.secondary && (
                    <span className="text-slate-400 text-[11px] font-normal">({item.secondary})</span>
                  )}
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
