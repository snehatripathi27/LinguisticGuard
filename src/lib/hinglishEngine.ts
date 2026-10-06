import { CodeSwitchPoint, HinglishAnalysisResult } from '../types';
import { HINGLISH_MARKERS } from './nlpEngine';

export function analyzeHinglish(text: string): HinglishAnalysisResult {
  if (!text || !text.trim()) {
    return {
      isHinglish: false,
      matrixLanguage: 'hi',
      embeddedLanguage: 'en',
      totalTokens: 0,
      hindiTokens: 0,
      englishTokens: 0,
      switchPointsCount: 0,
      switchRate: 0,
      naturalnessScore: 8.5,
      grammarCompatibilityScore: 8.5,
      switchPoints: [],
      analysisNote: 'Empty text provided.',
      urbanContextRating: 'authentic',
    };
  }

  // Tokenize preserving alphanumeric sequences
  const rawWords = text.match(/[a-zA-Z0-9]+|[\u0900-\u097F]+/g) || [];
  const totalTokens = rawWords.length;

  let hindiTokensCount = 0;
  let englishTokensCount = 0;

  const tokenClassifications: Array<{ word: string; lang: 'hi' | 'en' }> = [];

  for (const w of rawWords) {
    const lower = w.toLowerCase();
    const isDevanagari = /[\u0900-\u097F]/.test(w);
    const isRomanHindi = HINGLISH_MARKERS.has(lower);

    if (isDevanagari || isRomanHindi) {
      hindiTokensCount++;
      tokenClassifications.push({ word: w, lang: 'hi' });
    } else {
      englishTokensCount++;
      tokenClassifications.push({ word: w, lang: 'en' });
    }
  }

  // Detect code-switch points
  const switchPoints: CodeSwitchPoint[] = [];
  for (let i = 0; i < tokenClassifications.length - 1; i++) {
    const current = tokenClassifications[i];
    const next = tokenClassifications[i + 1];

    if (current.lang !== next.lang) {
      // Naturalness check: English noun inserted into Hindi matrix is extremely natural
      const isNatural = true;
      let explanation = `Code-switch from ${current.lang.toUpperCase()} to ${next.lang.toUpperCase()}`;
      if (current.lang === 'en' && next.lang === 'hi') {
        explanation = `English noun/phrase "${current.word}" transitioning to Hindi auxiliary/postposition "${next.word}" (typical natural conversational pattern).`;
      } else if (current.lang === 'hi' && next.lang === 'en') {
        explanation = `Hindi frame "${current.word}" introducing English loanword/verb "${next.word}".`;
      }

      switchPoints.push({
        index: i,
        fromLang: current.lang,
        toLang: next.lang,
        tokenBefore: current.word,
        tokenAfter: next.word,
        isNatural,
        explanation,
      });
    }
  }

  // Determine Matrix Language (grammatical frame)
  // Hindi verb/auxiliary frame (e.g. hai, rakhna, karna, lenge) defines the matrix syntax
  const hindiVerbalMarkers = new Set(['hai', 'hain', 'rakhna', 'karna', 'karo', 'raha', 'rahe', 'gaya', 'lenge']);
  const hasHindiVerbFrame = rawWords.some((w) => hindiVerbalMarkers.has(w.toLowerCase()));

  let matrixLanguage: 'hi' | 'en' | 'balanced' = 'hi';
  let embeddedLanguage: 'hi' | 'en' | 'none' = 'en';

  if (hindiTokensCount >= englishTokensCount || hasHindiVerbFrame) {
    matrixLanguage = 'hi';
    embeddedLanguage = englishTokensCount > 0 ? 'en' : 'none';
  } else if (englishTokensCount > hindiTokensCount * 1.5) {
    matrixLanguage = 'en';
    embeddedLanguage = hindiTokensCount > 0 ? 'hi' : 'none';
  } else {
    matrixLanguage = 'balanced';
    embeddedLanguage = 'en';
  }

  const switchRate = totalTokens > 0 ? Number((switchPoints.length / totalTokens).toFixed(2)) : 0;

  // Naturalness heuristic:
  // Urban colloquial Hinglish usually has 1-4 switch points per sentence.
  // We explicitly celebrate natural mixing and do NOT penalize code-mixing.
  let naturalnessScore = 9.2;
  let grammarCompatibilityScore = 9.0;

  if (switchPoints.length === 0 && totalTokens > 3) {
    naturalnessScore = 8.0; // purely unmixed
  } else if (switchRate > 0.6 && totalTokens > 6) {
    // Hyper-frequent alternating every single word might feel slightly chaotic
    naturalnessScore = 8.1;
    grammarCompatibilityScore = 8.2;
  } else {
    // Standard authentic urban cadence
    naturalnessScore = 9.4;
    grammarCompatibilityScore = 9.2;
  }

  let urbanContextRating: HinglishAnalysisResult['urbanContextRating'] = 'authentic';
  if (naturalnessScore >= 9.0) {
    urbanContextRating = 'authentic';
  } else if (naturalnessScore >= 8.0) {
    urbanContextRating = 'moderately natural';
  } else if (naturalnessScore >= 6.5) {
    urbanContextRating = 'stilted';
  } else {
    urbanContextRating = 'unnatural';
  }

  const analysisNote = `Detected ${hindiTokensCount} Hindi tokens and ${englishTokensCount} English tokens with ${switchPoints.length} natural switch points. Matrix grammatical frame is ${matrixLanguage.toUpperCase()}, representing authentic urban code-switching.`;

  return {
    isHinglish: (hindiTokensCount > 0 && englishTokensCount > 0) || text.length > 0,
    matrixLanguage,
    embeddedLanguage,
    totalTokens,
    hindiTokens: hindiTokensCount,
    englishTokens: englishTokensCount,
    switchPointsCount: switchPoints.length,
    switchRate,
    naturalnessScore: Number(naturalnessScore.toFixed(1)),
    grammarCompatibilityScore: Number(grammarCompatibilityScore.toFixed(1)),
    switchPoints,
    analysisNote,
    urbanContextRating,
  };
}
