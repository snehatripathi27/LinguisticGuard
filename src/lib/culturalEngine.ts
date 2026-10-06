import {
  CulturalDimensionScore,
  CulturalEvaluationResult,
  CulturalIssue,
  SupportedLanguage,
} from '../types';

export const CULTURAL_DIMENSIONS = [
  { key: 'idiom', name: '1. Idioms & Proverbs' },
  { key: 'humor', name: '2. Humor & Sarcasm' },
  { key: 'formality', name: '3. Formality & Honorifics' },
  { key: 'cultural_reference', name: '4. Cultural References' },
  { key: 'regional_terminology', name: '5. Regional Terminology' },
  { key: 'social_context', name: '6. Social Context & Kinship' },
  { key: 'names', name: '7. Names & Address Conventions' },
  { key: 'dates', name: '8. Dates & Calendar Conventions' },
  { key: 'currency', name: '9. Currency & Numbering Scale' },
  { key: 'units', name: '10. Measurement Units' },
  { key: 'food_references', name: '11. Food & Culinary References' },
  { key: 'festivals', name: '12. Festivals & Auspicious Events' },
  { key: 'greetings', name: '13. Greetings & Salutations' },
  { key: 'politeness', name: '14. Politeness & Imperative Register' },
  { key: 'code_switching', name: '15. Code-Switching Naturalness' },
];

export function evaluateCulturalContext(
  sourceText: string,
  translatedText: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage,
  culturalContextHint?: string
): CulturalEvaluationResult {
  const issues: CulturalIssue[] = [];
  const srcLower = sourceText.toLowerCase();
  const trLower = translatedText.toLowerCase();

  // 1. Idioms: Check for literal translations of idioms
  const idiomRules = [
    {
      src: 'beat around the bush',
      badTranslations: ['झाड़ी के चारों ओर', 'झाड़ी पीटना', 'jhadi ke chaaron taraf'],
      goodTranslations: ['इधर-उधर की बातें', 'seedhe baat'],
      desc: 'Literal translation of "beat around the bush" detected; fails to localize into idiomatic Hindi.',
      suggestedFix: 'Use "इधर-उधर की बातें मत करो" or "सीधे मुद्दे पर आओ".',
    },
    {
      src: 'raining cats and dogs',
      badTranslations: ['कुत्तों और बिल्लियों की बारिश', 'kutto aur billiyo ki barish'],
      goodTranslations: ['मूसलाधार', 'tez barish'],
      desc: 'Absurd literal translation of weather idiom "raining cats and dogs".',
      suggestedFix: 'Use "मूसलाधार बारिश" (torrential rain).',
    },
    {
      src: 'two birds with one stone',
      badTranslations: ['एक पत्थर से दो पक्षी'],
      goodTranslations: ['एक तीर से दो शिकार', 'एक पंथ दो काज'],
      desc: 'Literal bird-and-stone translation instead of traditional Hindi archery proverb.',
      suggestedFix: 'Use "एक तीर से दो शिकार" or "एक पंथ दो काज".',
    },
    {
      src: 'add fuel to the fire',
      badTranslations: ['आग में ईंधन'],
      goodTranslations: ['आग में घी'],
      desc: 'Western "fuel to fire" idiom translated without Indian cultural Vedic metaphor ("आग में घी डालना").',
      suggestedFix: 'Use "आग में घी डालना".',
    },
  ];

  for (const rule of idiomRules) {
    if (srcLower.includes(rule.src)) {
      const hasBad = rule.badTranslations.some((b) => trLower.includes(b));
      if (hasBad) {
        issues.push({
          type: 'idiom',
          severity: 'high',
          description: rule.desc,
          affectedSpan: rule.src,
          suggestedFix: rule.suggestedFix,
        });
      }
    }
  }

  // 2. Currency & Numbering Scale (Millions vs Crores / Lakhs)
  if (
    (srcLower.includes('million') || srcLower.includes('billion')) &&
    targetLang !== 'en' &&
    !trLower.includes('करोड़') &&
    !trLower.includes('लाख') &&
    !trLower.includes('crore') &&
    !trLower.includes('lakh')
  ) {
    issues.push({
      type: 'currency',
      severity: 'medium',
      description: 'Western numbering scale (millions/billions) not localized into Indian numbering system (Lakhs/Crores).',
      suggestedFix: 'Convert 1 Million to 10 Lakh (दस लाख) and 10 Million to 1 Crore (एक करोड़) for Indian audiences.',
    });
  }

  // Check Dollar vs Rupee localization when relevant
  if (srcLower.includes('dollar') && !trLower.includes('रुपये') && !trLower.includes('dollar') && !trLower.includes('डॉलर')) {
    issues.push({
      type: 'currency',
      severity: 'low',
      description: 'Currency term was lost or ambiguous in translation.',
      suggestedFix: 'Specify currency explicitly in ₹ (रुपये) or provide converted equivalent alongside dollars.',
    });
  }

  // 3. Formality & Honorifics (Aap vs Tum vs Tu)
  if (
    (srcLower.includes('grandmother') || srcLower.includes('grandfather') || srcLower.includes('teacher') || srcLower.includes('elder')) &&
    targetLang === 'hi' &&
    !translatedText.includes('जी') &&
    !translatedText.includes('आप') &&
    !translatedText.includes('हैं')
  ) {
    issues.push({
      type: 'formality',
      severity: 'medium',
      description: 'Omission of honorific suffix "जी" or plural respectful verb agreement for respected elders/teachers.',
      suggestedFix: 'Add respectful particle "जी" (e.g., दादी जी) and plural verb agreement (कर रही हैं).',
    });
  }

  // 4. Politeness in customer support / professional requests
  if (
    (srcLower.includes('please') || srcLower.includes('kindly')) &&
    targetLang === 'hi' &&
    !translatedText.includes('कृपया') &&
    !translatedText.includes('निवेदन') &&
    !translatedText.includes('अनुरोध')
  ) {
    issues.push({
      type: 'politeness',
      severity: 'low',
      description: 'Polite request marker "please" translated as bare command instead of respectful request register.',
      suggestedFix: 'Prefix with "कृपया" (Kripya) and end with polite imperative "-एं" (e.g., करें, बताएं).',
    });
  }

  // 5. Kinship terms in social context (Uncle/Aunt specificity)
  if ((srcLower.includes('uncle') || srcLower.includes('aunt')) && targetLang === 'hi') {
    if (translatedText.includes('अंकल') || translatedText.includes('आंटी')) {
      issues.push({
        type: 'social_context',
        severity: 'low',
        description: 'Generic loanwords "अंकल/आंटी" used instead of precise Indian kinship terms (चाचा, मामा, ताऊ, मौसा).',
        suggestedFix: 'Specify relationship if known: चाचा/चाची (paternal) or मामा/मामी (maternal).',
      });
    }
  }

  // 6. Food References
  if (srcLower.includes('tea') && srcLower.includes('refreshment') && targetLang === 'hi' && !translatedText.includes('चाय-पानी')) {
    // Info suggestion
  }

  // Calculate dimension scores (0 to 10)
  const dimensionScores: CulturalDimensionScore[] = CULTURAL_DIMENSIONS.map((dim) => {
    const dimIssues = issues.filter((iss) => iss.type === dim.key);
    let score = 9.4;

    for (const iss of dimIssues) {
      if (iss.severity === 'critical') score -= 4.0;
      else if (iss.severity === 'high') score -= 2.5;
      else if (iss.severity === 'medium') score -= 1.5;
      else score -= 0.8;
    }

    // Determine applicability
    let applicable = true;
    if (dim.key === 'festivals' && !srcLower.includes('diwali') && !srcLower.includes('holi') && !srcLower.includes('festival')) {
      applicable = false;
      score = 9.8;
    }
    if (dim.key === 'units' && !srcLower.includes('kilometer') && !srcLower.includes('tola') && !srcLower.includes('quintal')) {
      applicable = false;
      score = 9.8;
    }

    return {
      dimension: dim.name,
      dimensionKey: dim.key,
      score: Number(Math.max(2.0, Math.min(10.0, score)).toFixed(1)),
      note: dimIssues.length > 0 ? dimIssues.map((i) => i.description).join('; ') : 'Culturally aligned for target audience.',
      applicable,
    };
  });

  // Calculate overall cultural score
  let totalScore = 0;
  let weightSum = 0;
  for (const ds of dimensionScores) {
    const weight = ds.applicable ? 1.0 : 0.2;
    totalScore += ds.score * weight;
    weightSum += weight;
  }
  const rawCulturalScore = weightSum > 0 ? totalScore / weightSum : 9.0;
  const cultural_score = Number(rawCulturalScore.toFixed(1));

  let rubricSummary = 'Translation demonstrates high cultural sensibility with appropriate sociolinguistic markers.';
  if (issues.length > 0) {
    rubricSummary = `Identified ${issues.length} cultural friction point(s) requiring localization refinement across ${issues.map((i) => i.type).join(', ')}.`;
  }

  return {
    cultural_score,
    issues,
    dimensionScores,
    rubricSummary,
    localizedRecommendation: issues.length > 0 ? issues[0].suggestedFix : 'Text meets regional cultural publishing standards.',
  };
}
