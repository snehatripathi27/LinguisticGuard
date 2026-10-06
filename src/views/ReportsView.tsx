import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { FullEvaluationResult } from '../types';

interface ReportsViewProps {
  currentEvaluation: FullEvaluationResult | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentEvaluation }) => {
  const [copied, setCopied] = useState(false);

  if (!currentEvaluation) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
        No evaluation report loaded. Run an evaluation in the Translation Lab to generate an audit report.
      </div>
    );
  }

  const ev = currentEvaluation;

  const markdownReport = `# LinguaGuard Linguistic & Cultural Audit Report
**Report ID**: ${ev.id}
**Timestamp**: ${ev.timestamp}
**Source Language**: ${ev.sourceLanguage.toUpperCase()}
**Target Language**: ${ev.targetLanguage.toUpperCase()}
**Engine Mode**: ${ev.isDemoMode ? 'Deterministic NLP Heuristics (Demo Mode)' : 'Gemini 3.8 Flash (Live Model)'}

---

## 1. Propositional Content
- **Source Text**: "${ev.sourceText}"
- **Candidate Translation**: "${ev.modelTranslation}"
- **Gold Reference**: "${ev.referenceTranslation || 'N/A'}"

---

## 2. Linguistic Quality Scorecard (1-10 Scale)
- Grammar & Syntax: ${ev.linguistic.scores.grammar}/10
- Fluency: ${ev.linguistic.scores.fluency}/10
- Semantic Preservation: ${ev.linguistic.scores.semanticPreservation}/10
- Tone Preservation: ${ev.linguistic.scores.tonePreservation}/10
- Cultural Appropriateness: ${ev.linguistic.scores.culturalAppropriateness}/10
- Naturalness: ${ev.linguistic.scores.naturalness}/10
- **Composite Overall Quality Score**: ${ev.overallQualityScore}/10

---

## 3. Automated Translation Metrics
- **Sentence BLEU**: ${ev.metrics.bleu.toFixed(2)} (p1: ${ev.metrics.bleu1.toFixed(1)}, p2: ${ev.metrics.bleu2.toFixed(1)}, p3: ${ev.metrics.bleu3.toFixed(1)}, p4: ${ev.metrics.bleu4.toFixed(1)})
- **ROUGE-1 F1**: ${ev.metrics.rouge1.toFixed(2)}%
- **ROUGE-2 F1**: ${ev.metrics.rouge2.toFixed(2)}%
- **ROUGE-L F1**: ${ev.metrics.rougeL.toFixed(2)}%
- **BERTScore F1**: ${ev.metrics.bertScore.toFixed(2)}%
- **Semantic Cosine Similarity**: ${(ev.metrics.semanticSimilarity * 100).toFixed(1)}%

---

## 4. Sociolinguistic & Cultural Evaluation
- **Cultural Score**: ${ev.cultural.cultural_score}/10
- **Identified Issues**: ${ev.cultural.issues.length}
${ev.cultural.issues.map((i) => `  * [${i.severity.toUpperCase()}] ${i.type}: ${i.description}${i.suggestedFix ? ` (Fix: ${i.suggestedFix})` : ''}`).join('\n')}

---

## 5. LLM-as-a-Judge Audit Verdict
- **Verdict**: ${ev.llmJudge.verdict} (${ev.llmJudge.overallScore}/10)
- **Evaluator**: ${ev.llmJudge.provider}
- **Reasoning**: ${ev.llmJudge.reasoning}
- **Strengths**: ${ev.llmJudge.strengths.join('; ')}
- **Areas for Refinement**: ${ev.llmJudge.weaknesses.join('; ') || 'None'}
`;

  const handleDownloadMD = () => {
    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownReport);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `linguaguard_audit_${ev.id}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ev, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `linguaguard_audit_${ev.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Production AI Audit Report</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{ev.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Linguistic & Cultural Quality Audit Certificate
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMD}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download (.MD)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formal Audit Document Display */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6 max-w-4xl mx-auto font-sans">
        {/* Certificate Header */}
        <div className="border-b border-slate-200 pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                LinguaGuard Quality Audit Certificate
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated NLP & Sociolinguistic Quality Assurance Pipeline
            </p>
          </div>

          <div className="text-right text-xs space-y-0.5 font-mono">
            <div className="font-bold text-slate-900">{ev.id}</div>
            <div className="text-slate-500">{new Date(ev.timestamp).toLocaleDateString()}</div>
            <div className="text-[10px] text-slate-400">
              {ev.isDemoMode ? 'Demo / Deterministic Engine' : 'Live Gemini 3.8 Flash'}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Executive Evaluation Summary
          </span>
          <p className="text-slate-700 leading-relaxed font-sans">
            The target translation achieved an overall linguistic quality rating of{' '}
            <strong className="text-indigo-900">{ev.overallQualityScore}/10</strong> with a Sentence BLEU of{' '}
            <strong>{ev.metrics.bleu.toFixed(1)}</strong> and a Cultural Appropriateness index of{' '}
            <strong>{ev.cultural.cultural_score}/10</strong>. Evaluator verdict:{' '}
            <span className="font-semibold text-emerald-700">{ev.llmJudge.verdict}</span>.
          </p>
        </div>

        {/* Source and Translation */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
            Propositional Texts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Source ({ev.sourceLanguage.toUpperCase()})
              </span>
              <p className="text-slate-900 font-medium font-sans">{ev.sourceText}</p>
            </div>
            <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg space-y-1">
              <span className="text-[10px] font-semibold text-indigo-700 uppercase">
                Target Candidate ({ev.targetLanguage.toUpperCase()})
              </span>
              <p className="text-slate-900 font-medium font-sans">{ev.modelTranslation}</p>
            </div>
          </div>
        </div>

        {/* Linguistic Quality Scorecard Grid */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
            Linguistic Quality Scorecard
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Grammar</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {ev.linguistic.scores.grammar}/10
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Fluency</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {ev.linguistic.scores.fluency}/10
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Semantic</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {ev.linguistic.scores.semanticPreservation}/10
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Tone</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {ev.linguistic.scores.tonePreservation}/10
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Cultural</span>
              <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">
                {ev.cultural.cultural_score}/10
              </div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg">
              <span className="text-[10px] text-indigo-700 font-semibold block">Naturalness</span>
              <div className="text-lg font-bold text-indigo-950 font-mono mt-0.5">
                {ev.linguistic.scores.naturalness}/10
              </div>
            </div>
          </div>
        </div>

        {/* Translation Metrics Table */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
            Comparative Metrics
          </h3>
          <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="p-2.5">Sentence BLEU</th>
                <th className="p-2.5">ROUGE-1 F1</th>
                <th className="p-2.5">ROUGE-2 F1</th>
                <th className="p-2.5">ROUGE-L F1</th>
                <th className="p-2.5">BERTScore</th>
                <th className="p-2.5">Cosine Similarity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              <tr>
                <td className="p-2.5 font-bold">{ev.metrics.bleu.toFixed(1)}</td>
                <td className="p-2.5">{ev.metrics.rouge1.toFixed(1)}%</td>
                <td className="p-2.5">{ev.metrics.rouge2.toFixed(1)}%</td>
                <td className="p-2.5 font-bold text-indigo-700">{ev.metrics.rougeL.toFixed(1)}%</td>
                <td className="p-2.5">{ev.metrics.bertScore.toFixed(1)}%</td>
                <td className="p-2.5 font-bold">{(ev.metrics.semanticSimilarity * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LLM Judge Reasoning */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
            LLM-as-a-Judge Audit Opinion
          </h3>
          <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-sans">
            {ev.llmJudge.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
};
