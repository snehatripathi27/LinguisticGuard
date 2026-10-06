import React, { useState } from 'react';
import {
  MessageSquareCode,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { HinglishAnalysisResult } from '../types';
import { analyzeHinglish } from '../lib/hinglishEngine';

export const HinglishModuleView: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Kal meeting hai, please report ready rakhna.'
  );

  const analysis: HinglishAnalysisResult = analyzeHinglish(inputText);

  const presets = [
    {
      label: 'Standard Workplace Hinglish',
      text: 'Kal meeting hai, please report ready rakhna.',
    },
    {
      label: 'Youth Vernacular / Slang',
      text: 'Bhai chill kar na, is problem ka koi na koi jugaad nikal lenge.',
    },
    {
      label: 'Tech / Remote Work',
      text: 'Maine main branch pe code push kar diya hai, please PR review kar lo.',
    },
    {
      label: 'Entertainment / OTT',
      text: 'Movie itni boring thi ki main interval se pehle hi so gaya yaar.',
    },
    {
      label: 'Unnatural Stilted Mix (Erroneous)',
      text: 'Tomorrow meeting is, please report ready keep.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Bilingual Code-Switching Engine</span>
              <span aria-hidden="true">·</span>
              <span>Matrix Language Frame Model</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Dedicated Hinglish Code-Switching Evaluator
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Test Presets:</span>
            <select
              onChange={(e) => setInputText(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
              defaultValue=""
            >
              <option value="" disabled>
                Select Hinglish example...
              </option>
              {presets.map((p, idx) => (
                <option key={idx} value={p.text}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sociolinguistic Constitution Box */}
      <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-indigo-900">
            Sociolinguistic Principle: Mixed-Language Text is NOT Automatically Incorrect
          </span>
          <p className="text-slate-700 leading-relaxed font-sans">
            Hinglish (Hindi-English code-switching) is spoken by over 350 million urban Indians as a primary
            mode of expression. LinguaGuard evaluates whether the code-mixing adheres to natural grammatical
            matrix frames (Myers-Scotton Matrix Language Frame model) and authentic urban speech cadence.
          </p>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Enter Hinglish Text to Analyze
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500 font-sans"
          placeholder="e.g. Kal meeting hai, please report ready rakhna..."
        />
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Naturalness Score</span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
            {analysis.naturalnessScore.toFixed(1)}/10
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5 capitalize">
            {analysis.urbanContextRating} cadence
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Token Distribution</span>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            <span className="text-amber-700">{analysis.hindiTokens} Hi</span> :{' '}
            <span className="text-blue-700">{analysis.englishTokens} En</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {analysis.totalTokens} total tokens
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Matrix Grammatical Frame</span>
          <div className="text-lg font-bold text-indigo-700 uppercase tracking-wide mt-0.5">
            {analysis.matrixLanguage === 'hi' ? 'Hindi Matrix' : 'English Matrix'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Embedded: {analysis.embeddedLanguage.toUpperCase()}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Code-Switch Points</span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
            {analysis.switchPointsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Rate: {(analysis.switchRate * 100).toFixed(0)}% per token
          </div>
        </div>
      </div>

      {/* Code-Switch Visualizer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Code-Switch Points & Transition Analysis
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Hindi Token
            </span>
            <span className="flex items-center gap-1.5 text-blue-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> English Token
            </span>
          </div>
        </div>

        {/* Visualized token flow */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-wrap items-center gap-2">
          {inputText
            .split(/\s+/)
            .filter(Boolean)
            .map((word, idx) => {
              const isHi =
                /[\u0900-\u097F]/.test(word) ||
                [
                  'hai', 'hain', 'ho', 'hoon', 'tha', 'thi', 'the', 'ka', 'ki', 'ke', 'ko', 'se',
                  'mein', 'par', 'pe', 'aur', 'ya', 'lekin', 'kyunki', 'isliye', 'agar', 'toh',
                  'kya', 'kyun', 'kaise', 'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'hum',
                  'tum', 'aap', 'woh', 'yeh', 'karna', 'karo', 'kar', 'raha', 'rahi', 'rahe',
                  'gaya', 'bhai', 'yaar', 'accha', 'theek', 'bohot', 'bahut', 'thoda', 'sab',
                  'nahi', 'na', 'mat', 'aaj', 'kal', 'abhi', 'baad', 'pehle', 'rakhna', 'lenge',
                  'karte', 'hain', 'jugaad', 'bindaas', 'tapri',
                ].includes(word.toLowerCase().replace(/[^\w]/g, ''));

              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium font-sans flex items-center gap-1.5 ${
                    isHi
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-blue-50 text-blue-900 border-blue-200'
                  }`}
                >
                  <span>{word}</span>
                  <span className="text-[9px] font-mono opacity-70 uppercase font-semibold">
                    {isHi ? 'HI' : 'EN'}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Switch points explanation table */}
        {analysis.switchPoints.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Detailed Switch Points
            </h4>
            <div className="space-y-1.5">
              {analysis.switchPoints.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      &ldquo;{sp.tokenBefore}&rdquo; → &ldquo;{sp.tokenAfter}&rdquo;
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{sp.explanation}</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Natural Urban Switch
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
