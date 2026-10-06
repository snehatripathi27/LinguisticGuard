import React, { useState } from 'react';
import {
  Compass,
  Coins,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const LocalizationLabView: React.FC = () => {
  // Currency converter state
  const [millionsInput, setMillionsInput] = useState<number>(15);
  const [usdRate, setUsdRate] = useState<number>(84.5);

  // Computed currency values
  const totalUsd = millionsInput * 1000000;
  const inrTotal = totalUsd * usdRate;
  const inCrores = (inrTotal / 10000000).toFixed(2);
  const inLakhs = (inrTotal / 100000).toFixed(2);

  // Regional dialect comparator state
  const [selectedPhraseIdx, setSelectedPhraseIdx] = useState(0);

  const dialectExamples = [
    {
      meaning: 'Do not worry about the problem, we will find an ingenious solution.',
      standard: 'समस्या की चिंता मत कीजिए, हम कोई व्यावहारिक समाधान ढूंढ लेंगे।',
      delhi: 'अरे टेंशन मत ले यार, कोई न कोई जुगाड़ निकाल ही लेंगे।',
      mumbai: 'अपुन है ना भाई, लोड मत ले, एकदम सॉलिड जुगाड़ जमा देंगे।',
      lucknow: 'आप कतई ज़हमत न फरमाएं, हम इसका कोई मुनासिब हल निकाल लेंगे।',
      techHinglish: 'Chill bro, tension mat le, is blocker ka koi jugaad nikal lenge.',
    },
    {
      meaning: 'Let us go out and have some tea and snacks together.',
      standard: 'आइए हम सब मिलकर जलपान एवं चाय ग्रहण करते हैं।',
      delhi: 'चल भाई, नुक्कड़ वाली टपरी पे चाय-समोसा खाते हैं।',
      mumbai: 'चल ना बंटाए, टपरी पे कड़क चाय और वड़ा पाव मारते हैं।',
      lucknow: 'तशरीफ रखिए, पहले चाय-पानी का लुत्फ लेते हैं।',
      techHinglish: 'Let\'s take a quick break, tapri pe chai peete hain.',
    },
    {
      meaning: 'He is boasting a lot but knows nothing in reality.',
      standard: 'वह अत्यधिक आत्मप्रशंसा करता है, परंतु वास्तविकता में अनभिज्ञ है।',
      delhi: 'अरे वो बस हवाबाज़ी करता है, असल में कुछ नहीं आता उसे।',
      mumbai: 'फालतू की हवाबाजी झाड़ता है वो, अंदर से कुछ नहीं है।',
      lucknow: 'हुज़ूर सिर्फ लफ्फाज़ी करते हैं, इल्म से वाकिफ नहीं।',
      techHinglish: 'He just acts oversmart and bluffs, actually knows nothing.',
    },
  ];

  const kinshipPairs = [
    { en: "Paternal Uncle (Father's younger brother)", hi: 'चाचा जी (Chacha Ji)', register: 'Specific Paternal' },
    { en: "Paternal Uncle (Father's elder brother)", hi: 'ताऊ जी / बड़े पापा (Tau Ji)', register: 'High Respect' },
    { en: "Maternal Uncle (Mother's brother)", hi: 'मामा जी (Mama Ji)', register: 'Affectionate' },
    { en: "Mother's Sister's Husband", hi: 'मौसा जी (Mausa Ji)', register: 'Kinship' },
    { en: "Father's Sister's Husband", hi: 'फूफा जी (Phupha Ji)', register: 'Traditional' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Localization vs Translation vs Transcreation</span>
          <span aria-hidden="true">·</span>
          <span>Sociolinguistic Framework</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Linguistic Localization & Cultural Adaptation Lab
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Standard Machine Translation merely converts words across vocabularies. Deep localization
          adapts currencies, numbering scales, honorific protocols, and regional cultural sensibilities.
        </p>
      </div>

      {/* 3-Tier Conceptual Framework */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Translation
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct semantic mapping. Retains source syntactic framing and idioms literally.
          </p>
          <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 font-mono text-slate-600">
            &ldquo;15 million dollars raised&rdquo; → &ldquo;15 मिलियन डॉलर जुटाए गए&rdquo;
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
              2
            </span>
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Localization
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Adapts currency, Indian numbering scale (Lakhs/Crores), address formats, and punctuation.
          </p>
          <div className="text-[11px] bg-indigo-50/50 p-2 rounded border border-indigo-100 font-mono text-indigo-900">
            &ldquo;15 million dollars raised&rdquo; → &ldquo;लगभग 125 करोड़ रुपये (15M$) जुटाए&rdquo;
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
              3
            </span>
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Cultural Adaptation
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transcreation of proverbs, metaphors, family relations, humor, and polite honorific registers.
          </p>
          <div className="text-[11px] bg-amber-50/50 p-2 rounded border border-amber-100 font-mono text-amber-900">
            &ldquo;Drop in the ocean&rdquo; → &ldquo;ऊंट के मुंह में जीरा&rdquo; (proverbial equivalence)
          </div>
        </div>
      </div>

      {/* Interactive Tool 1: Indian Numbering & Currency Converter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Indian Numbering Scale & Currency Localizer
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Millions/Billions ⇄ Lakhs/Crores</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Western Scale ($ Millions)
            </label>
            <div className="flex items-center gap-1 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50">
              <span className="text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={millionsInput}
                onChange={(e) => setMillionsInput(Number(e.target.value) || 0)}
                className="w-full text-xs font-mono font-semibold text-slate-900 bg-transparent focus:outline-hidden"
              />
              <span className="text-xs text-slate-400 font-sans">Million</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              USD to INR Rate (₹)
            </label>
            <input
              type="number"
              value={usdRate}
              onChange={(e) => setUsdRate(Number(e.target.value) || 84.5)}
              className="w-full text-xs font-mono border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2 bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
            <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wide">
              Localized Indian Scale Equivalent
            </span>
            <div className="text-lg font-bold text-emerald-950 font-mono mt-0.5">
              ₹{inCrores} Crore <span className="text-xs font-normal text-emerald-700">({inLakhs} Lakhs)</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Devanagari: {inCrores} करोड़ रुपये
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool 2: Regional Dialect & Sociolinguistic Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Regional Dialects & Urban Registers
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Observe how the exact same intent morphs across regional dialects and urban speech communities.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {dialectExamples.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhraseIdx(idx)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedPhraseIdx === idx
                    ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phrase {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Meaning */}
        <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-700 font-sans">
          <span className="font-semibold text-slate-900">Core Intent: </span>
          &ldquo;{dialectExamples[selectedPhraseIdx].meaning}&rdquo;
        </div>

        {/* Dialect Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              1. Standard Hindi (Manak)
            </span>
            <p className="text-xs text-slate-900 font-medium">
              {dialectExamples[selectedPhraseIdx].standard}
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Formal, institutional, high register
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              2. Delhi NCR Colloquial
            </span>
            <p className="text-xs text-slate-900 font-medium">
              {dialectExamples[selectedPhraseIdx].delhi}
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Conversational, energetic, youth vernacular
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              3. Mumbai / Bambaiya
            </span>
            <p className="text-xs text-slate-900 font-medium">
              {dialectExamples[selectedPhraseIdx].mumbai}
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Colloquial Mumbai slang, vibrant street culture
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">
              4. Lucknow Tehzeeb
            </span>
            <p className="text-xs text-slate-900 font-medium">
              {dialectExamples[selectedPhraseIdx].lucknow}
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Urdu-infused politeness and respectful honorifics
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1 md:col-span-2">
            <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">
              5. Modern Tech Hinglish
            </span>
            <p className="text-xs text-slate-900 font-medium font-mono">
              {dialectExamples[selectedPhraseIdx].techHinglish}
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Natural code-mixing common in Indian tech startups and messaging apps
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tool 3: Kinship & Honorific Specificity Resolver */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-900">
            Indian Kinship Terminology Specificity
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          English uses the generic word &ldquo;Uncle&rdquo; or &ldquo;Aunt&rdquo;, whereas Indian languages
          mandate distinct terms depending on maternal vs paternal lineage and relative age.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {kinshipPairs.map((k, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <span className="text-[10px] font-medium text-slate-400 uppercase">{k.register}</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{k.hi}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{k.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
