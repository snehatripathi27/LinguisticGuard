import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number; max?: number }[];
  size?: number;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 320,
  color = '#2563eb',
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const numPoints = data.length;

  if (numPoints < 3) return null;

  // Calculate coordinates for a polygon
  const getCoordinates = (index: number, val: number, maxVal = 10) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const distance = (val / maxVal) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Concentric background circles (grid rings at 25%, 50%, 75%, 100%)
  const rings = [2.5, 5.0, 7.5, 10.0];

  // Radar points
  const points = data.map((d, i) => getCoordinates(i, d.value, d.max || 10));
  const polygonPointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background webs */}
        {rings.map((ringVal) => {
          const ringPoints = data.map((_, i) => getCoordinates(i, ringVal, 10));
          return (
            <polygon
              key={ringVal}
              points={ringPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={ringVal === 10 ? 'none' : '3,3'}
            />
          );
        })}

        {/* Axis spokes */}
        {data.map((_, i) => {
          const outerCoord = getCoordinates(i, 10, 10);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerCoord.x}
              y2={outerCoord.y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPointsStr}
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertex dots & Labels */}
        {data.map((d, i) => {
          const pt = points[i];
          const labelPt = getCoordinates(i, 11.8, 10);
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill={color} stroke="#ffffff" strokeWidth="2" />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-medium fill-slate-700 font-sans"
              >
                {d.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-semibold fill-slate-900 font-mono"
              >
                {d.value.toFixed(1)}/10
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
