import React from 'react';
import {
  BarChart3,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Globe2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { FullEvaluationResult } from '../types';
import { RadarChart } from '../components/RadarChart';
import { BarChart } from '../components/BarChart';

interface DashboardViewProps {
  recentReports: FullEvaluationResult[];
  onNavigateToTab: (tab: any) => void;
  onSelectReport: (report: FullEvaluationResult) => void;
  demoMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recentReports,
  onNavigateToTab,
  onSelectReport,
  demoMode,
}) => {
  const latest = recentReports[0];

  // Aggregated quality scores from latest or sample
  const radarData = [
    { label: 'Grammar', value: latest?.linguistic.scores.grammar ?? 9.2 },
    { label: 'Fluency', value: latest?.linguistic.scores.fluency ?? 9.0 },
    { label: 'Semantic', value: latest?.linguistic.scores.semanticPreservation ?? 9.1 },
    { label: 'Tone', value: latest?.linguistic.scores.tonePreservation ?? 8.7 },
    { label: 'Cultural', value: latest?.cultural.cultural_score ?? 8.4 },
    { label: 'Naturalness', value: latest?.linguistic.scores.naturalness ?? 8.9 },
  ];

  const categoryScores = [
    { label: 'Everyday Conversation', value: 9.3, max: 10, color: '#4f46e5', secondary: 'en/hi/hinglish' },
    { label: 'Professional & Corporate', value: 9.1, max: 10, color: '#2563eb', secondary: 'formal' },
    { label: 'Idioms & Proverbs', value: 8.2, max: 10, color: '#f59e0b', secondary: 'cultural' },
    { label: 'Technology & Dev', value: 9.4, max: 10, color: '#10b981', secondary: 'hinglish matrix' },
    { label: 'Customer Support', value: 8.9, max: 10, color: '#06b6d4', secondary: 'polite register' },
    { label: 'Festivals & Auspicious', value: 8.8, max: 10, color: '#ec4899', secondary: 'high register' },
  ];

  const errorTaxonomyBreakdown = [
    { label: 'Linguistic (Grammar / Punctuation)', value: 14, max: 50, color: '#3b82f6', secondary: '28%' },
    { label: 'Semantic (Meaning shift / Omission)', value: 11, max: 50, color: '#6366f1', secondary: '22%' },
    { label: 'Cultural (Idioms / Number scale)', value: 18, max: 50, color: '#f97316', secondary: '36%' },
    { label: 'Style (Formality / Verbosity)', value: 7, max: 50, color: '#14b8a6', secondary: '14%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Portfolio Mission */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Production AI Quality Assurance</span>
              <span aria-hidden="true">·</span>
              <span>English / Hindi / Hinglish</span>
              <span aria-hidden="true">·</span>
              <span>Evaluation Rubric v1.0</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Multilingual LLM Localization & Linguistic Evaluation
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Evaluating whether AI-generated text is linguistically sound, semantically faithful,
              and culturally natural for Indian regional communication.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateToTab('translation-lab')}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Translation Lab</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('dataset-explorer')}
              className="px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Explore 105 Datasets</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Overall Quality</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {latest?.overallQualityScore.toFixed(1) ?? '8.8'}/10
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">+0.4</span> vs literal baseline
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Mean BLEU Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {latest?.metrics.bleu.toFixed(1) ?? '78.5'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">4-gram brevity penalized</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cultural Rubric</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {latest?.cultural.cultural_score.toFixed(1) ?? '8.4'}/10
          </div>
          <div className="text-[11px] text-slate-500 mt-1">15 cultural dimensions</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>BERTScore F1</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {latest?.metrics.bertScore.toFixed(1) ?? '88.6'}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Semantic vector match</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Hinglish Naturalness</span>
            <Globe2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            9.2/10
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Urban code-switch index</div>
        </div>
      </div>

      {/* Primary Visualizations: Quality Radar + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quality Radar Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Linguistic Quality Dimensions</h3>
              <span className="text-xs text-slate-500 font-mono">6 Core Facets</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-dimensional evaluation across syntax, fluency, semantics, tone, culture, and naturalness.
            </p>
          </div>

          <div className="py-4">
            <RadarChart data={radarData} size={280} color="#4f46e5" />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Evaluated text: &ldquo;{latest?.sourceText.slice(0, 32)}...&rdquo;</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('linguistic-analysis')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View detailed tokens →
            </button>
          </div>
        </div>

        {/* Category Performance & Error Taxonomy */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Domain Performance by Category</h3>
              <span className="text-xs text-slate-500">Benchmark across 105 samples</span>
            </div>
            <BarChart items={categoryScores} />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Error Taxonomy Distribution</h3>
              <button
                type="button"
                onClick={() => onNavigateToTab('error-analysis')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Inspect Taxonomy →
              </button>
            </div>
            <BarChart items={errorTaxonomyBreakdown} />
          </div>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Evaluation Pipeline Runs</h3>
            <p className="text-xs text-slate-500">
              End-to-end linguistic, cultural, and LLM-as-a-judge audit results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('reports')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Export Full Audit Report →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium bg-slate-50/70">
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Source & Language</th>
                <th className="py-2.5 px-3">Target Text</th>
                <th className="py-2.5 px-3">BLEU</th>
                <th className="py-2.5 px-3">Cultural</th>
                <th className="py-2.5 px-3">LLM Judge</th>
                <th className="py-2.5 px-3">Overall</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentReports.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{r.id.slice(0, 10)}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-900 truncate max-w-[200px]" title={r.sourceText}>
                      {r.sourceText}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5">
                      {r.sourceLanguage} → {r.targetLanguage}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 max-w-[220px] truncate" title={r.modelTranslation}>
                    {r.modelTranslation}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium">{r.metrics.bleu.toFixed(1)}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-amber-700">
                    {r.cultural.cultural_score.toFixed(1)}/10
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    <span
                      className={`text-[11px] ${
                        r.llmJudge.verdict === 'Excellent'
                          ? 'text-emerald-700'
                          : r.llmJudge.verdict === 'Good'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {r.llmJudge.verdict} ({r.llmJudge.overallScore.toFixed(1)})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    {r.overallQualityScore.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectReport(r);
                        onNavigateToTab('translation-lab');
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
