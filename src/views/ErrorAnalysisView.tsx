import React, { useState } from 'react';
import {
  AlertTriangle,
  FolderTree,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ERROR_TAXONOMY } from '../lib/errorTaxonomy';
import { ErrorMainCategory } from '../types';
import { BarChart } from '../components/BarChart';

const CATEGORIES: ErrorMainCategory[] = ['LINGUISTIC', 'SEMANTIC', 'CULTURAL', 'STYLE'];

export const ErrorAnalysisView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ErrorMainCategory>('CULTURAL');

  const categoryDescriptions: Record<ErrorMainCategory, string> = {
    LINGUISTIC:
      'Grammatical agreement, sentence structure, inflectional morphology, Devanagari matra spelling, and terminal punctuation (। vs .).',
    SEMANTIC:
      'Faithfulness of propositional content, clause omissions, extraneous hallucinated additions, or outright mistranslation.',
    CULTURAL:
      'Inappropriate Western idioms, failure to convert currency/scale to Lakhs/Crores, or social register misalignments.',
    STYLE:
      'Honorific register mismatch (आप vs तू), stilted phrasing, unnatural loanword insertion, or excessive verbosity.',
  };

  const categoryExamples: Record<ErrorMainCategory, Array<{ sub: string; wrong: string; right: string; note: string }>> = {
    LINGUISTIC: [
      {
        sub: 'grammar',
        wrong: 'हम कल आएगा।',
        right: 'हम कल आएंगे।',
        note: 'Subject-verb plural agreement violation with pronoun "हम".',
      },
      {
        sub: 'punctuation',
        wrong: 'कृपया बैठ जाइए',
        right: 'कृपया बैठ जाइए।',
        note: 'Missing Hindi Purna Viram (।) terminal punctuation.',
      },
      {
        sub: 'spelling',
        wrong: 'शुक्रवार को रिर्पोट जमा करें।',
        right: 'शुक्रवार को रिपोर्ट जमा करें।',
        note: 'Misplaced Devanagari reph (र्) matra in "रिपोर्ट".',
      },
    ],
    SEMANTIC: [
      {
        sub: 'meaning_change',
        wrong: 'कंपनी ने 5 करोड़ जुटाए। (Source: 15 million dollars)',
        right: 'कंपनी ने 125 करोड़ रुपये (15M$) जुटाए।',
        note: 'Discrepancy in numeric scale drastically changes financial facts.',
      },
      {
        sub: 'omission',
        wrong: 'दवा लें। (Source: Take one tablet twice daily after meals)',
        right: 'भोजन के बाद दिन में दो बार एक गोली लें।',
        note: 'Omission of dosage frequency and dietary condition clauses.',
      },
      {
        sub: 'mistranslation',
        wrong: 'वह मीठी छुरी है → He is a sweet knife.',
        right: 'He is a wolf in sheep\'s clothing / hypocrite.',
        note: 'Direct mistranslation of Hindi idiom into nonsensical English cutlery.',
      },
    ],
    CULTURAL: [
      {
        sub: 'idiom_error',
        wrong: 'Don\'t beat around the bush → झाड़ी को मत पीटो।',
        right: 'इधर-उधर की बातें मत करो।',
        note: 'Literal word-for-word translation destroys idiomatic naturalness.',
      },
      {
        sub: 'cultural_mismatch',
        wrong: 'He touched his grandfather\'s hand. (Source: चरण स्पर्श)',
        right: 'He touched his grandfather\'s feet to seek blessings.',
        note: 'Loss of sacred foot-touching (चरण स्पर्श) cultural reverence.',
      },
      {
        sub: 'inappropriate_reference',
        wrong: 'Let\'s order beef stew for Diwali feast.',
        right: 'Let\'s arrange traditional vegetarian sweets for Diwali feast.',
        note: 'Cultural food taboo and festival context dissonance.',
      },
    ],
    STYLE: [
      {
        sub: 'formality',
        wrong: 'तू इधर आ और रिपोर्ट दिखा। (To corporate manager)',
        right: 'कृपया आप यहां आएं और रिपोर्ट प्रस्तुत करें।',
        note: 'Using intimate/disrespectful pronoun "तू" instead of corporate honorific "आप".',
      },
      {
        sub: 'unnatural_phrase',
        wrong: 'यह सॉफ़्टवेयर अनुप्रयोग अत्युत्कृष्ट कार्यकुशलता प्रदर्शित कर रहा है।',
        right: 'यह ऐप बहुत बढ़िया चल रहा है।',
        note: 'Hyper-Sanskritized archaic phrasing that sounds unnatural to living native speakers.',
      },
      {
        sub: 'verbosity',
        wrong: 'कृपया आप सभी सज्जन एवं देवियां अपने बैठने के आसन पर बैठ जाएं।',
        right: 'कृपया सभी अपना स्थान ग्रहण करें।',
        note: 'Bloated redundant phrasing diluting institutional clarity.',
      },
    ],
  };

  const chartData = [
    { label: 'CULTURAL: Idiom & Proverb Errors', value: 18, max: 25, color: '#f97316', secondary: '36%' },
    { label: 'LINGUISTIC: Grammar & Agreement', value: 14, max: 25, color: '#3b82f6', secondary: '28%' },
    { label: 'SEMANTIC: Meaning Change & Omission', value: 11, max: 25, color: '#6366f1', secondary: '22%' },
    { label: 'STYLE: Formality & Honorific Mismatch', value: 7, max: 25, color: '#14b8a6', secondary: '14%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Standardized NLP Error Taxonomy</span>
          <span aria-hidden="true">·</span>
          <span>Hierarchical Multi-Level Classification</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Linguistic, Semantic & Cultural Error Taxonomy
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Industry-standard categorization framework modeled on MQM (Multidimensional Quality Metrics)
          customized for Indian multilingual NLP, code-switching, and cultural transcreation.
        </p>
      </div>

      {/* Frequency Distribution Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Error Taxonomy Frequency Across Indian Language Evaluation Suite
        </h3>
        <BarChart items={chartData} />
      </div>

      {/* Interactive Category Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 tracking-wider">
                  {cat}
                </span>
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  {ERROR_TAXONOMY[cat].length} sub-types
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {categoryDescriptions[cat]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Category Deep Dive Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {selectedCategory} Taxonomy Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Subcategories: {ERROR_TAXONOMY[selectedCategory].join(', ')}
          </span>
        </div>

        {/* Tree Node Representation */}
        <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto">
          <div className="text-indigo-400 font-bold">{selectedCategory}</div>
          {ERROR_TAXONOMY[selectedCategory].map((sub: string, idx: number, arr: readonly string[]) => {
            const isLast = idx === arr.length - 1;
            return (
              <div key={sub} className="text-slate-300 pl-4 flex items-center gap-2">
                <span className="text-slate-500">{isLast ? '└──' : '├──'}</span>
                <span className="text-amber-300 font-semibold">{sub}</span>
              </div>
            );
          })}
        </div>

        {/* Concrete Real-World Examples */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Real-World Error Examples in English-Hindi-Hinglish NLP
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categoryExamples[selectedCategory].map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase">
                  {ex.sub}
                </span>

                <div className="space-y-1">
                  <div className="text-rose-700 font-sans">
                    <strong>Erroneous:</strong> &ldquo;{ex.wrong}&rdquo;
                  </div>
                  <div className="text-emerald-700 font-sans">
                    <strong>Corrected:</strong> &ldquo;{ex.right}&rdquo;
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 leading-tight">
                  {ex.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
