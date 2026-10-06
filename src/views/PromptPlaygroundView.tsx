import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowRightLeft,
  Sparkles,
  Play,
  RotateCw,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '../lib/promptEngine';
import { translateTextWithEngine } from '../lib/geminiService';
import { evaluateTranslationPipeline } from '../lib/evaluator';
import { PromptTemplate, FullEvaluationResult } from '../types';

export const PromptPlaygroundView: React.FC<{ demoMode: boolean }> = ({ demoMode }) => {
  const [inputText, setInputText] = useState(
    "Don't beat around the bush; just tell me what happened with the 15 million dollar investment."
  );
  const [templateA, setTemplateA] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]); // Literal
  const [templateB, setTemplateB] = useState<PromptTemplate>(PROMPT_TEMPLATES[1]); // Natural Conversational
  const [outputA, setOutputA] = useState(
    'झाड़ी के चारों ओर मत पीटो, सीधे बताओ कि 15 मिलियन डॉलर के निवेश का क्या हुआ।'
  );
  const [outputB, setOutputB] = useState(
    'इधर-उधर की बातें मत करो, सीधे बताओ कि 125 करोड़ रुपये (15 मिलियन डॉलर) के निवेश में क्या हुआ।'
  );
  const [evalA, setEvalA] = useState<FullEvaluationResult | null>(null);
  const [evalB, setEvalB] = useState<FullEvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunComparison = async () => {
    if (!inputText.trim()) return;
    setIsRunning(true);

    try {
      const resA = await translateTextWithEngine(
        inputText,
        'hi',
        templateA.systemPrompt,
        demoMode
      );
      const resB = await translateTextWithEngine(
        inputText,
        'hi',
        templateB.systemPrompt,
        demoMode
      );

      setOutputA(resA.translation);
      setOutputB(resB.translation);

      const evaluationA = await evaluateTranslationPipeline({
        sourceText: inputText,
        modelTranslation: resA.translation,
        targetLanguage: 'hi',
        forceDemoMode: demoMode,
      });

      const evaluationB = await evaluateTranslationPipeline({
        sourceText: inputText,
        modelTranslation: resB.translation,
        targetLanguage: 'hi',
        forceDemoMode: demoMode,
      });

      setEvalA(evaluationA);
      setEvalB(evaluationB);
    } catch (err) {
      console.error('Comparison run failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Prompt Engineering & A/B Evaluation</span>
              <span aria-hidden="true">·</span>
              <span>7 Standardized Prompt Paradigms</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Prompt Engineering Comparison Playground
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Compare how prompt instruction variations impact downstream linguistic fluency,
              cultural naturalness, and metric scores.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunComparison}
            disabled={isRunning || !inputText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-xs shadow-xs"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating & Auditing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run A/B Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Text */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Source Input Text to Translate & Compare
        </label>
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500 font-sans"
        />
      </div>

      {/* Prompt A vs Prompt B Configuration Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Prompt A */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Variant A: {templateA.name}
            </span>
            <select
              value={templateA.id}
              onChange={(e) => {
                const t = PROMPT_TEMPLATES.find((p) => p.id === e.target.value);
                if (t) setTemplateA(t);
              }}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800"
            >
              {PROMPT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-600 text-[11px]">System Prompt:</span>
            <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed">
              {templateA.systemPrompt}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Candidate Output A
            </label>
            <textarea
              rows={3}
              value={outputA}
              onChange={(e) => setOutputA(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-sans"
            />
          </div>

          {evalA && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500">Quality Score</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">
                  {evalA.overallQualityScore.toFixed(1)}/10
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500">Cultural Score</span>
                <div className="font-bold text-amber-700 font-mono mt-0.5">
                  {evalA.cultural.cultural_score.toFixed(1)}/10
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500">BLEU Score</span>
                <div className="font-bold text-indigo-700 font-mono mt-0.5">
                  {evalA.metrics.bleu.toFixed(1)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prompt B */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Variant B: {templateB.name}
            </span>
            <select
              value={templateB.id}
              onChange={(e) => {
                const t = PROMPT_TEMPLATES.find((p) => p.id === e.target.value);
                if (t) setTemplateB(t);
              }}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800"
            >
              {PROMPT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-600 text-[11px]">System Prompt:</span>
            <p className="p-2.5 bg-indigo-50/40 rounded border border-indigo-100 text-slate-700 font-mono text-[11px] leading-relaxed">
              {templateB.systemPrompt}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Candidate Output B
            </label>
            <textarea
              rows={3}
              value={outputB}
              onChange={(e) => setOutputB(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-sans"
            />
          </div>

          {evalB && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-indigo-50/50 rounded border border-indigo-100">
                <span className="text-[10px] text-slate-500">Quality Score</span>
                <div className="font-bold text-indigo-900 font-mono mt-0.5">
                  {evalB.overallQualityScore.toFixed(1)}/10
                </div>
              </div>
              <div className="p-2 bg-amber-50/50 rounded border border-amber-100">
                <span className="text-[10px] text-slate-500">Cultural Score</span>
                <div className="font-bold text-amber-700 font-mono mt-0.5">
                  {evalB.cultural.cultural_score.toFixed(1)}/10
                </div>
              </div>
              <div className="p-2 bg-blue-50/50 rounded border border-blue-100">
                <span className="text-[10px] text-slate-500">BLEU Score</span>
                <div className="font-bold text-blue-700 font-mono mt-0.5">
                  {evalB.metrics.bleu.toFixed(1)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Delta Summary */}
      {evalA && evalB && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              A/B Prompt Comparison Summary
            </h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            Variant {evalB.overallQualityScore >= evalA.overallQualityScore ? 'B' : 'A'} scored{' '}
            <strong className="text-indigo-900">
              {Math.abs(evalB.overallQualityScore - evalA.overallQualityScore).toFixed(1)} points higher
            </strong>{' '}
            in overall quality. Culturally adapted and natural conversational prompts dramatically reduce
            unnatural literalisms (e.g. converting idioms and adapting monetary units to Indian scale).
          </p>
        </div>
      )}
    </div>
  );
};
