import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Copy,
  Check,
  FileCheck,
  UserCheck,
  Layers,
} from 'lucide-react';
import { FullEvaluationResult, SupportedLanguage } from '../types';
import datasetItems from '../data/dataset.json';

interface TranslationLabViewProps {
  currentEvaluation: FullEvaluationResult | null;
  onRunEvaluation: (params: {
    sourceText: string;
    modelTranslation: string;
    referenceTranslation?: string;
    sourceLanguage?: SupportedLanguage;
    targetLanguage?: SupportedLanguage;
    culturalContext?: string;
  }) => Promise<void>;
  isLoading: boolean;
  onNavigateToHumanReview: (evalResult: FullEvaluationResult) => void;
  onNavigateToTab: (tab: any) => void;
  demoMode: boolean;
}

export const TranslationLabView: React.FC<TranslationLabViewProps> = ({
  currentEvaluation,
  onRunEvaluation,
  isLoading,
  onNavigateToHumanReview,
  onNavigateToTab,
  demoMode,
}) => {
  const [sourceText, setSourceText] = useState(
    currentEvaluation?.sourceText ||
      'Please make sure to submit the quarterly financial report by Friday afternoon.'
  );
  const [modelTranslation, setModelTranslation] = useState(
    currentEvaluation?.modelTranslation ||
      'कृपया शुक्रवार दोपहर तक त्रैमासिक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।'
  );
  const [referenceTranslation, setReferenceTranslation] = useState(
    currentEvaluation?.referenceTranslation ||
      'कृपया शुक्रवार दोपहर तक त्रैमासिक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।'
  );
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>('en');
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('hi');
  const [culturalContext, setCulturalContext] = useState(
    'Formal corporate communication requiring polite imperative (कृपया/करें) rather than informal command.'
  );
  const [copied, setCopied] = useState(false);

  // Load a preset example from dataset
  const handleLoadDatasetPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const item = datasetItems.find((d) => d.id === selectedId);
    if (item) {
      setSourceText(item.source_text);
      setReferenceTranslation(item.reference);
      setModelTranslation(item.reference);
      setSourceLang(item.source_language as SupportedLanguage);
      setTargetLang(item.target_language as SupportedLanguage);
      setCulturalContext(item.cultural_context);
    }
  };

  const handleRun = async () => {
    if (!sourceText.trim() || !modelTranslation.trim()) return;
    await onRunEvaluation({
      sourceText,
      modelTranslation,
      referenceTranslation: referenceTranslation.trim() || undefined,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      culturalContext,
    });
  };

  const handleCopyTranslation = () => {
    if (modelTranslation) {
      navigator.clipboard.writeText(modelTranslation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Translation Quality Lab</span>
              <span aria-hidden="true">·</span>
              <span>BLEU / ROUGE / BERTScore / LLM Judge</span>
              <span aria-hidden="true">·</span>
              <span>Side-by-Side Analysis</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Multilingual Translation & Localization Evaluator
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Load Preset:</span>
            <select
              onChange={handleLoadDatasetPreset}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select from 105 curated pairs...
              </option>
              {datasetItems.slice(0, 25).map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.id}] {item.category}: {item.source_text.slice(0, 36)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Language Direction & Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-medium">Source Language:</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as SupportedLanguage)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 font-medium text-slate-800"
            >
              <option value="en">English (en)</option>
              <option value="hi">Hindi (hi)</option>
              <option value="hinglish">Hinglish (mixed)</option>
            </select>
          </div>

          <div className="text-slate-400">→</div>

          <div className="flex items-center gap-2">
            <label className="text-slate-500 font-medium">Target Language:</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as SupportedLanguage)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 font-medium text-slate-800"
            >
              <option value="hi">Hindi (hi - Devanagari)</option>
              <option value="hinglish">Hinglish (Romanized / Mixed)</option>
              <option value="en">English (en)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              value={culturalContext}
              onChange={(e) => setCulturalContext(e.target.value)}
              placeholder="Optional cultural context / register requirements (e.g. formal, polite, tech)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={isLoading || !sourceText.trim() || !modelTranslation.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs ml-auto"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Full Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* 3-Column Inputs: Source Text / Model Translation / Reference Translation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Source Text */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Source Text ({sourceLang.toUpperCase()})</label>
              <span className="text-[11px] text-slate-400 font-mono">{sourceText.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-indigo-500 font-sans"
              placeholder="Enter source sentence or phrase..."
            />
          </div>

          {/* Model Translation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Model Candidate ({targetLang.toUpperCase()})</label>
              <button
                type="button"
                onClick={handleCopyTranslation}
                className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={modelTranslation}
              onChange={(e) => setModelTranslation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-indigo-500 font-sans"
              placeholder="Candidate translation generated by model..."
            />
          </div>

          {/* Reference Translation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Human Gold Reference (Optional)</label>
              <span className="text-[11px] text-slate-400 font-mono">Ground truth</span>
            </div>
            <textarea
              rows={4}
              value={referenceTranslation}
              onChange={(e) => setReferenceTranslation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-slate-50/70 focus:ring-1 focus:ring-indigo-500 font-sans"
              placeholder="Reference ground-truth for BLEU/ROUGE comparison..."
            />
          </div>
        </div>
      </div>

      {/* Evaluation Results Section */}
      {currentEvaluation && (
        <div className="space-y-5">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Sentence BLEU</span>
              <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                {currentEvaluation.metrics.bleu.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                p1: {currentEvaluation.metrics.bleu1.toFixed(0)} | p4: {currentEvaluation.metrics.bleu4.toFixed(0)}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">ROUGE-L F1</span>
              <div className="text-xl font-bold text-indigo-700 font-mono mt-0.5">
                {currentEvaluation.metrics.rougeL.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                R1: {currentEvaluation.metrics.rouge1.toFixed(0)} | R2: {currentEvaluation.metrics.rouge2.toFixed(0)}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">BERTScore F1</span>
              <div className="text-xl font-bold text-blue-700 font-mono mt-0.5">
                {currentEvaluation.metrics.bertScore.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Contextual alignment</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Semantic Cosine</span>
              <div className="text-xl font-bold text-teal-700 font-mono mt-0.5">
                {(currentEvaluation.metrics.semanticSimilarity * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Vector term overlap</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Cultural Rubric</span>
              <div className="text-xl font-bold text-amber-700 font-mono mt-0.5">
                {currentEvaluation.cultural.cultural_score.toFixed(1)}/10
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {currentEvaluation.cultural.issues.length} friction points
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Overall Score</span>
              <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                {currentEvaluation.overallQualityScore.toFixed(1)}/10
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {currentEvaluation.llmJudge.verdict}
              </div>
            </div>
          </div>

          {/* LLM Judge Critique Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  LLM-as-a-Judge Linguistic Audit
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  ({currentEvaluation.llmJudge.provider})
                </span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 font-mono">
                Judge Score: {currentEvaluation.llmJudge.overallScore.toFixed(1)}/10
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {currentEvaluation.llmJudge.reasoning}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="font-semibold text-emerald-700 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strengths</span>
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                  {currentEvaluation.llmJudge.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-amber-700 flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Areas for Refinement</span>
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                  {currentEvaluation.llmJudge.weaknesses.length > 0 ? (
                    currentEvaluation.llmJudge.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)
                  ) : (
                    <li className="text-slate-400">No critical weaknesses detected.</li>
                  )}
                </ul>
              </div>
            </div>

            {currentEvaluation.llmJudge.suggestedAlternative && (
              <div className="pt-2 text-xs">
                <span className="font-semibold text-slate-700">Recommended Alternative: </span>
                <span className="text-indigo-800 font-medium">
                  &ldquo;{currentEvaluation.llmJudge.suggestedAlternative}&rdquo;
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-600">
              <span>Ready for human reviewer sign-off or compliance export?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToHumanReview(currentEvaluation)}
                className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Submit to Human Review</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('reports')}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>View Full Audit Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
