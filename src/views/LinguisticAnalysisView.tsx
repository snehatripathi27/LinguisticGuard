import React, { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Tag,
  CheckCircle2,
  Sliders,
  Type,
  Code2,
} from 'lucide-react';
import { LinguisticAnalysisResult, TokenItem } from '../types';
import { performLinguisticAnalysis } from '../lib/nlpEngine';
import datasetItems from '../data/dataset.json';

interface LinguisticAnalysisViewProps {
  initialText?: string;
}

export const LinguisticAnalysisView: React.FC<LinguisticAnalysisViewProps> = ({
  initialText,
}) => {
  const [inputText, setInputText] = useState(
    initialText ||
      'दादी जी अपने कमरे में विश्राम कर रही हैं, कृपया कोई शोर न मचाएं।'
  );
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);

  // Compute live linguistic analysis
  const analysis: LinguisticAnalysisResult = performLinguisticAnalysis(inputText);

  const posColorMap: Record<string, string> = {
    NOUN: 'text-blue-700 bg-blue-50 border-blue-200',
    VERB: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    AUX: 'text-teal-700 bg-teal-50 border-teal-200',
    ADP: 'text-amber-700 bg-amber-50 border-amber-200',
    PRON: 'text-purple-700 bg-purple-50 border-purple-200',
    CCONJ: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    PART: 'text-rose-700 bg-rose-50 border-rose-200',
    ADJ: 'text-violet-700 bg-violet-50 border-violet-200',
    NUM: 'text-orange-700 bg-orange-50 border-orange-200',
    PUNCT: 'text-slate-500 bg-slate-50 border-slate-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Deep Indic NLP Pipeline</span>
              <span aria-hidden="true">·</span>
              <span>Devanagari & Latin Scripts</span>
              <span aria-hidden="true">·</span>
              <span>Morphosyntactic Tagger</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Linguistic Structure & Token Analysis
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Text:</span>
            <select
              onChange={(e) => setInputText(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
              defaultValue=""
            >
              <option value="" disabled>
                Select sample sentence...
              </option>
              <option value="दादी जी अपने कमरे में विश्राम कर रही हैं, कृपया कोई शोर न मचाएं।">
                Hindi Honorific: दादी जी...
              </option>
              <option value="Kal morning 10 AM meeting hai, please summary report ready rakhna.">
                Hinglish Code-Switch: Kal meeting hai...
              </option>
              <option value="The honorable Prime Minister addressed the nation on Republic Day.">
                English Formal: Prime Minister...
              </option>
              <option value="कंपनी ने सीरीज बी फंडिंग में 125 करोड़ रुपये ($15M) जुटाए हैं।">
                Financial Devanagari: 125 करोड़ रुपये...
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Input Text for Deep Linguistic Parsing
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500 font-sans"
          placeholder="Type or paste English, Hindi, or Hinglish text..."
        />
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Language Detected</span>
          <div className="text-lg font-bold text-slate-900 mt-0.5 uppercase tracking-wide">
            {analysis.detectedLanguage}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Script: {analysis.script} · Conf: {(analysis.confidence * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Tokens & Sentences</span>
          <div className="text-lg font-bold text-indigo-700 font-mono mt-0.5">
            {analysis.tokens.length} <span className="text-xs font-normal text-slate-500">tokens</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {analysis.sentences.length} sentence unit(s)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Formality Index</span>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            {analysis.formalityScore.toFixed(1)}/10
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 capitalize">
            {analysis.formality}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Discourse Tone</span>
          <div className="text-lg font-bold text-emerald-700 capitalize mt-0.5">
            {analysis.tone}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Preservation: {analysis.scores.tonePreservation}/10
          </div>
        </div>
      </div>

      {/* Interactive Token Stream with POS Tags */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Interactive Morphosyntactic Token Stream
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any token to inspect</span>
        </div>

        {/* Token stream */}
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50/70 rounded-lg border border-slate-200 min-h-[90px] items-center">
          {analysis.tokens.map((token, idx) => {
            const isSelected = selectedToken === token;
            const style = posColorMap[token.pos] || 'text-slate-700 bg-white border-slate-200';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedToken(token)}
                className={`px-2.5 py-1 text-xs rounded-md border font-sans transition-all flex flex-col items-center cursor-pointer ${style} ${
                  isSelected ? 'ring-2 ring-indigo-600 scale-105' : 'hover:opacity-85'
                }`}
              >
                <span className="font-medium text-slate-900">{token.text}</span>
                <span className="text-[9px] font-mono opacity-70 font-semibold">{token.pos}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Token Inspector Drawer */}
        {selectedToken && (
          <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-3.5 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-950 text-sm">{selectedToken.text}</span>
              <div className="flex items-center gap-2 text-slate-600">
                <span>Part of Speech: <strong className="text-indigo-900">{selectedToken.posLabel} ({selectedToken.pos})</strong></span>
                <span aria-hidden="true">·</span>
                <span>Script: {selectedToken.isHindi ? 'Hindi / Devanagari' : 'English / Latin'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedToken(null)}
              className="text-slate-400 hover:text-slate-700 font-medium text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* POS Tag Legend */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">POS Legend:</span>
          <span>NOUN (Noun)</span>
          <span aria-hidden="true">·</span>
          <span>VERB (Verb)</span>
          <span aria-hidden="true">·</span>
          <span>AUX (Auxiliary)</span>
          <span aria-hidden="true">·</span>
          <span>ADP (Postposition/Preposition)</span>
          <span aria-hidden="true">·</span>
          <span>PART (Honorific Particle)</span>
          <span aria-hidden="true">·</span>
          <span>PRON (Pronoun)</span>
        </div>
      </div>

      {/* Named Entity Recognition (NER) & Linguistic Quality Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* NER Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Named Entity Recognition (NER)
            </h3>
          </div>

          {analysis.entities.length > 0 ? (
            <div className="space-y-2">
              {analysis.entities.map((ent, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 font-sans">{ent.text}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {ent.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(ent.confidence * 100).toFixed(0)}% conf
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4">
              No named entities (places, currencies, festivals, organizations) in this sample.
            </p>
          )}
        </div>

        {/* Quality Scores Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Linguistic Quality Scorecard
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500">Grammar & Syntax</span>
              <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                {analysis.scores.grammar}/10
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500">Fluency</span>
              <div className="text-base font-bold text-indigo-700 font-mono mt-0.5">
                {analysis.scores.fluency}/10
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500">Semantic Fidelity</span>
              <div className="text-base font-bold text-blue-700 font-mono mt-0.5">
                {analysis.scores.semanticPreservation}/10
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500">Cultural Naturalness</span>
              <div className="text-base font-bold text-amber-700 font-mono mt-0.5">
                {analysis.scores.culturalAppropriateness}/10
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
