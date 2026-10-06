import {
  LinguisticAnalysisResult,
  NamedEntity,
  SupportedLanguage,
  TokenItem,
} from '../types';
import { analyzeHinglish } from './hinglishEngine';

// Common Hindi Romanized stopwords and marker words
export const HINGLISH_MARKERS = new Set([
  'hai', 'hain', 'ho', 'hoon', 'tha', 'thi', 'the', 'ka', 'ki', 'ke', 'ko', 'se',
  'mein', 'par', 'pe', 'aur', 'ya', 'lekin', 'kyunki', 'isliye', 'agar', 'toh',
  'kya', 'kyun', 'kaise', 'kab', 'kahan', 'kaun', 'kitna', 'kitne', 'mera', 'meri',
  'mere', 'tera', 'teri', 'tere', 'uska', 'uski', 'unka', 'unki', 'hamara', 'hum',
  'tum', 'aap', 'woh', 'yeh', 'karna', 'karo', 'karein', 'kar', 'raha', 'rahi',
  'rahe', 'gaya', 'gayi', 'gaye', 'hoga', 'hogi', 'hoge', 'bhai', 'yaar', 'accha',
  'theek', 'bohot', 'bahut', 'thoda', 'sab', 'kuch', 'koi', 'nahi', 'na', 'mat',
  'aaj', 'kal', 'abhi', 'baad', 'pehle', 'andar', 'bahar', 'saath', 'paas', 'chahiye',
  'chalo', 'chal', 'bol', 'bata', 'dekh', 'sun', 'le', 'de', 'khana', 'peena', 'so',
  'jugaad', 'bindaas', 'paisa', 'vasool', 'tapri', 'chai', 'pani', 'arre', 'waah'
]);

// Hindi Devanagari stopwords and auxiliary markers
export const HINDI_MARKERS = new Set([
  'है', 'हैं', 'हो', 'हूँ', 'था', 'थी', 'थे', 'का', 'की', 'के', 'को', 'से', 'में',
  'पर', 'और', 'या', 'लेकिन', 'किन्तु', 'परन्तु', 'क्योंकि', 'इसलिए', 'यदि', 'तो',
  'क्या', 'क्यों', 'कैसे', 'कब', 'कहाँ', 'कौन', 'कितना', 'मेरा', 'मेरी', 'मेरे',
  'तुम्हारा', 'आपका', 'उसका', 'हमारा', 'हम', 'तुम', 'आप', 'वह', 'यह', 'करना',
  'कर', 'रहा', 'रही', 'रहे', 'गया', 'गई', 'गए', 'होगा', 'होगी', 'भाई', 'अच्छा',
  'ठीक', 'बहुत', 'थोड़ा', 'सब', 'कुछ', 'कोई', 'नहीं', 'न', 'मत', 'आज', 'कल',
  'अभी', 'बाद', 'पहले', 'साथ', 'पास', 'चाहिए', 'कृपया', 'जी', 'नमस्ते', 'प्रणाम'
]);

export function detectLanguage(text: string): {
  language: SupportedLanguage;
  confidence: number;
  script: 'Devanagari' | 'Latin' | 'Mixed';
} {
  if (!text || !text.trim()) {
    return { language: 'en', confidence: 0.5, script: 'Latin' };
  }

  const clean = text.trim();
  const devanagariMatches = clean.match(/[\u0900-\u097F]/g) || [];
  const latinMatches = clean.match(/[a-zA-Z]/g) || [];

  const devanagariRatio = devanagariMatches.length / (clean.length || 1);
  const latinRatio = latinMatches.length / (clean.length || 1);

  if (devanagariMatches.length > 0 && latinMatches.length > 0) {
    if (devanagariRatio > 0.4) {
      return { language: 'hi', confidence: 0.92, script: 'Devanagari' };
    }
    return { language: 'hi', confidence: 0.85, script: 'Mixed' };
  }

  if (devanagariRatio > 0.3 || devanagariMatches.length > 3) {
    return { language: 'hi', confidence: 0.98, script: 'Devanagari' };
  }

  // Latin script: Determine whether English or Hinglish
  const words = clean.toLowerCase().split(/[\s,.;:!?_/\-'"()[\]{}]+/).filter(Boolean);
  let hinglishCount = 0;
  for (const w of words) {
    if (HINGLISH_MARKERS.has(w)) {
      hinglishCount++;
    }
  }

  const hinglishRatio = words.length > 0 ? hinglishCount / words.length : 0;

  if (hinglishCount >= 2 || (words.length <= 4 && hinglishCount >= 1) || hinglishRatio > 0.18) {
    const conf = Math.min(0.99, 0.70 + hinglishRatio * 0.4);
    return { language: 'hinglish', confidence: Number(conf.toFixed(2)), script: 'Latin' };
  }

  return { language: 'en', confidence: 0.95, script: 'Latin' };
}

export function segmentSentences(text: string): string[] {
  if (!text) return [];
  // Handles standard full stop, question mark, exclamation, and Hindi purna viram (।)
  const sentences = text
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences.length ? sentences : [text.trim()];
}

export function tokenizeAndPosTag(text: string, lang: SupportedLanguage): TokenItem[] {
  if (!text) return [];

  // Match words and punctuation
  const rawTokens = text.match(/[\u0900-\u097F]+|[a-zA-Z0-9]+|[₹$€£%.,!?:;'"\-–—()/[\]{}]/g) || [];

  return rawTokens.map((raw) => {
    const isPunct = /^[₹$€£%.,!?:;'"\-–—()/[\]{}]+$/.test(raw);
    const isHindiScript = /[\u0900-\u097F]/.test(raw);
    const isEnglishScript = /[a-zA-Z]/.test(raw);
    const lower = raw.toLowerCase();

    let pos = 'NOUN';
    let posLabel = 'Noun';

    if (isPunct) {
      pos = 'PUNCT';
      posLabel = 'Punctuation';
    } else if (/^\d+$/.test(raw)) {
      pos = 'NUM';
      posLabel = 'Numeral';
    } else if (isHindiScript) {
      if (['है', 'हैं', 'था', 'थी', 'थे', 'रहा', 'रही', 'रहे', 'कर', 'गया', 'गई', 'होगा', 'सकते'].includes(raw)) {
        pos = 'AUX';
        posLabel = 'Auxiliary Verb';
      } else if (['का', 'की', 'के', 'को', 'से', 'में', 'पर', 'तक', 'लिए'].includes(raw)) {
        pos = 'ADP';
        posLabel = 'Postposition';
      } else if (['और', 'तथा', 'एवं', 'या', 'लेकिन', 'किन्तु'].includes(raw)) {
        pos = 'CCONJ';
        posLabel = 'Conjunction';
      } else if (['यह', 'वह', 'मैं', 'तुम', 'आप', 'हम', 'वे', 'उसने', 'इन्होंने'].includes(raw)) {
        pos = 'PRON';
        posLabel = 'Pronoun';
      } else if (['कृपया', 'जी', 'ही', 'भी', 'तो'].includes(raw)) {
        pos = 'PART';
        posLabel = 'Honorific / Particle';
      } else if (['बड़ा', 'छोटा', 'नया', 'अच्छा', 'सुखद', 'पावन', 'मूसलाधार'].includes(raw)) {
        pos = 'ADJ';
        posLabel = 'Adjective';
      }
    } else if (lang === 'hinglish' || HINGLISH_MARKERS.has(lower)) {
      if (['hai', 'hain', 'ho', 'hoon', 'tha', 'thi', 'kar', 'raha', 'rahi', 'rahe', 'gaya', 'diya'].includes(lower)) {
        pos = 'AUX';
        posLabel = 'Auxiliary Verb (Hindi)';
      } else if (['ka', 'ki', 'ke', 'ko', 'se', 'mein', 'par', 'pe', 'liye'].includes(lower)) {
        pos = 'ADP';
        posLabel = 'Postposition (Hindi)';
      } else if (['aur', 'ya', 'lekin', 'agar', 'toh'].includes(lower)) {
        pos = 'CCONJ';
        posLabel = 'Conjunction (Hindi)';
      } else if (['main', 'hum', 'tum', 'aap', 'woh', 'yeh', 'mera', 'tera', 'uska'].includes(lower)) {
        pos = 'PRON';
        posLabel = 'Pronoun (Hindi)';
      } else if (['bhai', 'yaar', 'jugaad', 'tapri', 'chai'].includes(lower)) {
        pos = 'NOUN';
        posLabel = 'Colloquial Noun';
      } else if (['accha', 'bohot', 'thoda', 'theek', 'bindaas'].includes(lower)) {
        pos = 'ADJ';
        posLabel = 'Adjective (Hindi)';
      }
    } else {
      // English rules
      if (['the', 'a', 'an', 'this', 'that', 'these', 'those'].includes(lower)) {
        pos = 'DET';
        posLabel = 'Determiner';
      } else if (['in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'of', 'into'].includes(lower)) {
        pos = 'ADP';
        posLabel = 'Preposition';
      } else if (['is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could'].includes(lower)) {
        pos = 'AUX';
        posLabel = 'Auxiliary Verb';
      } else if (['and', 'or', 'but', 'because', 'so', 'although'].includes(lower)) {
        pos = 'CCONJ';
        posLabel = 'Conjunction';
      } else if (['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'].includes(lower)) {
        pos = 'PRON';
        posLabel = 'Pronoun';
      } else if (['please', 'not', 'never', 'always', 'very', 'now', 'today'].includes(lower)) {
        pos = 'ADV';
        posLabel = 'Adverb';
      }
    }

    return {
      text: raw,
      pos,
      posLabel,
      isHindi: isHindiScript || HINGLISH_MARKERS.has(lower),
      isEnglish: isEnglishScript && !HINGLISH_MARKERS.has(lower),
      isPunctuation: isPunct,
    };
  });
}

export function extractNamedEntities(text: string): NamedEntity[] {
  const entities: NamedEntity[] = [];
  const lower = text.toLowerCase();

  // Locations
  const places = [
    { name: 'Lucknow', hi: 'लखनऊ' },
    { name: 'Bengaluru', hi: 'बेंगलुरु' },
    { name: 'Delhi', hi: 'दिल्ली' },
    { name: 'Mumbai', hi: 'मुंबई' },
    { name: 'Goa', hi: 'गोवा' },
    { name: 'Punjab', hi: 'पंजाब' },
    { name: 'Haryana', hi: 'हरियाणा' },
    { name: 'India', hi: 'भारत' },
  ];
  for (const p of places) {
    if (text.includes(p.name) || text.includes(p.hi)) {
      entities.push({ text: text.includes(p.name) ? p.name : p.hi, label: 'LOCATION', confidence: 0.95 });
    }
  }

  // Festivals & Cultural entities
  const culturalTerms = [
    { name: 'Diwali', hi: 'दीपावली' },
    { name: 'Holi', hi: 'होली' },
    { name: 'Eid', hi: 'ईद' },
    { name: 'Raksha Bandhan', hi: 'रक्षाबंधन' },
    { name: 'Baisakhi', hi: 'बैसाखी' },
    { name: 'Aadhaar', hi: 'आधार' },
    { name: 'Ganges', hi: 'गंगा' },
  ];
  for (const c of culturalTerms) {
    if (text.includes(c.name) || text.includes(c.hi)) {
      entities.push({ text: text.includes(c.name) ? c.name : c.hi, label: 'CULTURAL', confidence: 0.96 });
    }
  }

  // Organizations
  const orgs = [
    { name: 'Reserve Bank of India', hi: 'भारतीय रिज़र्व बैंक' },
    { name: 'Supreme Court', hi: 'सर्वोच्च न्यायालय' },
    { name: 'Government of India', hi: 'भारत सरकार' },
    { name: 'Google Maps', hi: 'गूगल मैप्स' },
    { name: 'WhatsApp', hi: 'व्हाट्सएप' },
    { name: 'Slack', hi: 'स्लैक' },
    { name: 'Netflix', hi: 'नेटफ्लिक्स' },
  ];
  for (const o of orgs) {
    if (text.includes(o.name) || text.includes(o.hi)) {
      entities.push({ text: text.includes(o.name) ? o.name : o.hi, label: 'ORGANIZATION', confidence: 0.94 });
    }
  }

  // Currency & Financial units
  const currencyMatches = text.match(/(₹\s?[\d,.]+|\$\s?[\d,.]+|[\d,.]+\s?(?:करोड़|लाख|रुपये|rupees|crore|lakh|million|crores))/gi);
  if (currencyMatches) {
    for (const m of currencyMatches) {
      entities.push({ text: m.trim(), label: 'CURRENCY', confidence: 0.97 });
    }
  }

  // Tech units / documents
  const techTerms = ['OTP', 'UPI', 'PR', 'Series B', 'KYC', 'Zoom'];
  for (const t of techTerms) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(text)) {
      entities.push({ text: t, label: 'TECH', confidence: 0.92 });
    }
  }

  return entities;
}

export function analyzeFormalityAndTone(text: string, lang: SupportedLanguage): {
  formality: LinguisticAnalysisResult['formality'];
  formalityScore: number;
  tone: LinguisticAnalysisResult['tone'];
} {
  const lower = text.toLowerCase();

  // Honorific / Formal markers
  const formalMarkers = ['कृपया', 'माननीय', 'सादर', 'अभिनंदन', 'क्षमा', 'संबोधित', 'सुनिश्चित करें', 'respectfully', 'please', 'cordially', 'honor', 'sincerely'];
  const hindiHonorificPronouns = ['आप', 'आपने', 'आपको', 'aap', 'aapko', 'aapne', 'जी', 'ji'];
  const informalMarkers = ['tu', 'tera', 'teri', 'तू', 'तेरा', 'यार', 'yaar', 'bhai', 'bro', 'chill', 'bindaas', 'jugaad'];

  let formalPoints = 0;
  let informalPoints = 0;

  for (const m of formalMarkers) {
    if (lower.includes(m)) formalPoints += 2;
  }
  for (const m of hindiHonorificPronouns) {
    if (lower.includes(m)) formalPoints += 1.5;
  }
  for (const m of informalMarkers) {
    if (new RegExp(`\\b${m}\\b`, 'i').test(lower)) informalPoints += 2;
  }

  let formalityScore = 6.0;
  let formality: LinguisticAnalysisResult['formality'] = 'standard/neutral';
  let tone: LinguisticAnalysisResult['tone'] = 'professional';

  if (formalPoints > informalPoints + 1) {
    formalityScore = Math.min(10, 7.5 + formalPoints * 0.5);
    formality = 'honorific/formal';
    tone = lower.includes('दीपावली') || lower.includes('त्योहार') || lower.includes('celebrate') ? 'festive' : 'respectful';
  } else if (informalPoints > formalPoints) {
    formalityScore = Math.max(2, 5.0 - informalPoints * 0.8);
    formality = informalPoints >= 4 ? 'slang/intimate' : 'colloquial/informal';
    tone = 'casual';
  } else {
    formalityScore = 6.8;
    formality = 'standard/neutral';
    tone = 'professional';
  }

  return {
    formality,
    formalityScore: Number(formalityScore.toFixed(1)),
    tone,
  };
}

export function performLinguisticAnalysis(
  text: string,
  targetLangHint?: SupportedLanguage,
  referenceText?: string
): LinguisticAnalysisResult {
  const { language, confidence, script } = detectLanguage(text);
  const activeLang = targetLangHint || language;
  const tokens = tokenizeAndPosTag(text, activeLang);
  const entities = extractNamedEntities(text);
  const sentences = segmentSentences(text);
  const { formality, formalityScore, tone } = analyzeFormalityAndTone(text, activeLang);

  let hinglishDetails;
  if (activeLang === 'hinglish' || language === 'hinglish') {
    hinglishDetails = analyzeHinglish(text);
  }

  // Calculate linguistic quality scores (0 to 10)
  // High quality baseline with adjustments based on detected anomalies
  let grammar = 9.2;
  let fluency = 9.0;
  let naturalness = 8.8;
  let culturalAppropriateness = 8.5;
  let semanticPreservation = 9.0;
  let tonePreservation = 8.6;

  // Check for punctuation health
  const hasTerminalPunctuation = /[.!?।]$/.test(text.trim());
  if (!hasTerminalPunctuation) {
    grammar -= 0.4;
  }

  if (hinglishDetails) {
    naturalness = Number(hinglishDetails.naturalnessScore.toFixed(1));
    fluency = Number(((hinglishDetails.naturalnessScore + hinglishDetails.grammarCompatibilityScore) / 2).toFixed(1));
  }

  const scores = {
    grammar: Number(Math.max(1, Math.min(10, grammar)).toFixed(1)),
    fluency: Number(Math.max(1, Math.min(10, fluency)).toFixed(1)),
    semanticPreservation: Number(Math.max(1, Math.min(10, semanticPreservation)).toFixed(1)),
    tonePreservation: Number(Math.max(1, Math.min(10, tonePreservation)).toFixed(1)),
    culturalAppropriateness: Number(Math.max(1, Math.min(10, culturalAppropriateness)).toFixed(1)),
    naturalness: Number(Math.max(1, Math.min(10, naturalness)).toFixed(1)),
  };

  return {
    detectedLanguage: language,
    confidence,
    script,
    tokens,
    entities,
    sentences,
    formality,
    formalityScore,
    tone,
    sentimentPreservation: 8.9,
    scores,
    hinglishDetails,
  };
}
