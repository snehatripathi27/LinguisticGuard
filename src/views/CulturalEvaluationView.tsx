import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Info,
  ChevronDown,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { CulturalEvaluationResult } from '../types';
import { evaluateCulturalContext } from '../lib/culturalEngine';

export const CulturalEvaluationView: React.FC = () => {
  const [sourceText, setSourceText] = useState(
    "Don't beat around the bush; just tell me what happened with the 15 million dollar investment."
  );
  const [targetText, setTargetText] = useState(
    'झाड़ी के चारों ओर मत पीटो, सीधे बताओ कि 15 मिलियन डॉलर के निवेश का क्या हुआ।'
  );

  // Live evaluation of cultural context
  const evaluation: CulturalEvaluationResult = evaluateCulturalContext(
    sourceText,
    targetText,
    'en',
    'hi'
  );

  const samplePresets = [
    {
      label: 'Idiom & Currency Flaw (Literal)',
      src: "Don't beat around the bush; just tell me what happened with the 15 million dollar investment.",
      tr: 'झाड़ी के चारों ओर मत पीटो, सीधे बताओ कि 15 मिलियन डॉलर के निवेश का क्या हुआ।',
    },
    {
      label: 'Culturally Adapted (Clean)',
      src: "Don't beat around the bush; just tell me what happened with the 15 million dollar investment.",
      tr: 'इधर-उधर की बातें मत करो, सीधे बताओ कि 125 करोड़ रुपये (15 मिलियन डॉलर) के निवेश का क्या हुआ।',
    },
    {
      label: 'Weather Idiom Flaw',
      src: 'It is raining cats and dogs outside, take an umbrella.',
      tr: 'बाहर कुत्तों और बिल्लियों की बारिश हो रही है, छाता ले लो।',
    },
    {
      label: 'Weather Idiom Corrected',
      src: 'It is raining cats and dogs outside, take an umbrella.',
      tr: 'बाहर मूसलाधार बारिश हो रही है, छाता साथ ले लो।',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Sociolinguistic Evaluation Framework</span>
              <span aria-hidden="true">·</span>
              <span>15 Regional Evaluation Dimensions</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Cultural Context & Sociolinguistic Rubric
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Test Presets:</span>
            <select
              onChange={(e) => {
                const preset = samplePresets.find((p) => p.label === e.target.value);
                if (preset) {
                  setSourceText(preset.src);
                  setTargetText(preset.tr);
                }
              }}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
              defaultValue=""
            >
              <option value="" disabled>
                Select cultural test case...
              </option>
              {samplePresets.map((p, idx) => (
                <option key={idx} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Source Text (English)</label>
          <textarea
            rows={3}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Candidate Translation (Target)</label>
          <textarea
            rows={3}
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Overall Score & Issues Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-500 font-medium">Cultural Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {evaluation.cultural_score.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 10</span>
              <span
                className={`text-xs font-medium ml-2 ${
                  evaluation.cultural_score >= 8.5
                    ? 'text-emerald-700'
                    : evaluation.cultural_score >= 7.0
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {evaluation.cultural_score >= 8.5
                  ? 'Culturally Natural'
                  : evaluation.cultural_score >= 7.0
                  ? 'Moderate Cultural Friction'
                  : 'Severe Cultural Mismatch'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 max-w-xl">
            <span className="font-semibold text-slate-900">Rubric Summary: </span>
            {evaluation.rubricSummary}
          </div>
        </div>

        {/* Issues List */}
        {evaluation.issues.length > 0 ? (
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Identified Cultural Issues ({evaluation.issues.length})</span>
            </h4>
            <div className="space-y-2">
              {evaluation.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-950 uppercase tracking-wide text-[10px] bg-amber-200/80 px-2 py-0.5 rounded">
                        {issue.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500 text-[11px]">Severity:</span>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          issue.severity === 'high' || issue.severity === 'critical'
                            ? 'text-rose-700'
                            : 'text-amber-800'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    {issue.affectedSpan && (
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Span: &ldquo;{issue.affectedSpan}&rdquo;
                      </span>
                    )}
                  </div>

                  <p className="text-slate-800 leading-relaxed font-sans">{issue.description}</p>

                  {issue.suggestedFix && (
                    <div className="pt-1 flex items-start gap-1.5 text-indigo-950 bg-white/80 p-2 rounded border border-indigo-100">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="font-medium">
                        <strong>Actionable Fix:</strong> {issue.suggestedFix}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-4 flex items-center gap-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero cultural friction points detected. Text conforms to Indian regional norms.</span>
          </div>
        )}
      </div>

      {/* 15 Dimensions Scorecard Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">
          The 15 Cultural Rubric Dimensions Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {evaluation.dimensionScores.map((ds, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs space-y-1 transition-colors ${
                ds.score < 8.0
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-800">{ds.dimension}</span>
                <span
                  className={`font-mono font-bold ${
                    ds.score < 8.0 ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {ds.score.toFixed(1)}/10
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight truncate" title={ds.note}>
                {ds.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
