import { ErrorMainCategory, EvaluationError } from '../types';

export type { ErrorMainCategory };

export const ERROR_TAXONOMY: Record<ErrorMainCategory, readonly string[]> = {
  LINGUISTIC: ['grammar', 'syntax', 'morphology', 'spelling', 'punctuation'],
  SEMANTIC: ['meaning_change', 'omission', 'addition', 'mistranslation'],
  CULTURAL: ['inappropriate_reference', 'idiom_error', 'tone_mismatch', 'cultural_mismatch'],
  STYLE: ['formality', 'unnatural_phrase', 'verbosity', 'tone'],
};

export function classifyErrors(
  sourceText: string,
  modelText: string,
  referenceText?: string,
  culturalIssues: any[] = []
): EvaluationError[] {
  const errors: EvaluationError[] = [];

  // 1. Linguistic checks
  if (modelText.trim().length > 0 && !/[.!?।]$/.test(modelText.trim())) {
    errors.push({
      category: 'LINGUISTIC',
      subcategory: 'punctuation',
      severity: 'low',
      description: 'Missing terminal punctuation (full stop, question mark, or Hindi Purna Viram "।").',
      targetSpan: modelText.slice(-3),
    });
  }

  // Check for doubled whitespace or punctuation glitches
  if (/\s{2,}/.test(modelText)) {
    errors.push({
      category: 'LINGUISTIC',
      subcategory: 'spelling',
      severity: 'low',
      description: 'Unnormalized whitespace or typing artifact in target text.',
    });
  }

  // 2. Semantic checks against reference
  if (referenceText && referenceText.trim()) {
    const srcTokens = sourceText.toLowerCase().split(/\s+/);
    const modTokens = modelText.toLowerCase().split(/\s+/);
    const refTokens = referenceText.toLowerCase().split(/\s+/);

    // Severe length disparity check (potential omission or verbosity)
    if (modTokens.length < refTokens.length * 0.45 && refTokens.length > 5) {
      errors.push({
        category: 'SEMANTIC',
        subcategory: 'omission',
        severity: 'high',
        description: 'Candidate translation is significantly shorter than the expected reference, suggesting omitted clauses.',
      });
    } else if (modTokens.length > refTokens.length * 2.2 && refTokens.length > 5) {
      errors.push({
        category: 'STYLE',
        subcategory: 'verbosity',
        severity: 'medium',
        description: 'Candidate translation is excessively verbose compared to standard natural target phrasing.',
      });
    }

    // Number preservation check
    const srcNumbers: string[] = sourceText.match(/\d+/g) || [];
    const modNumbers: string[] = modelText.match(/\d+/g) || [];
    for (const num of srcNumbers) {
      if (!modNumbers.includes(num) && !modelText.includes(num)) {
        errors.push({
          category: 'SEMANTIC',
          subcategory: 'meaning_change',
          severity: 'high',
          description: `Key numeric quantifier "${num}" from source may have been altered or lost.`,
          sourceSpan: num,
        });
      }
    }
  }

  // 3. Cultural errors mapped from cultural issues
  for (const ci of culturalIssues) {
    if (ci.type === 'idiom') {
      errors.push({
        category: 'CULTURAL',
        subcategory: 'idiom_error',
        severity: ci.severity,
        description: ci.description,
        sourceSpan: ci.affectedSpan,
      });
    } else if (ci.type === 'formality') {
      errors.push({
        category: 'STYLE',
        subcategory: 'formality',
        severity: ci.severity,
        description: ci.description,
      });
    } else if (ci.type === 'cultural_reference' || ci.type === 'regional_terminology') {
      errors.push({
        category: 'CULTURAL',
        subcategory: 'cultural_mismatch',
        severity: ci.severity,
        description: ci.description,
      });
    } else {
      errors.push({
        category: 'CULTURAL',
        subcategory: 'tone_mismatch',
        severity: ci.severity,
        description: ci.description,
      });
    }
  }

  return errors;
}

export function computeTaxonomyStats(errors: EvaluationError[]) {
  const counts = {
    LINGUISTIC: 0,
    SEMANTIC: 0,
    CULTURAL: 0,
    STYLE: 0,
  };

  const subcategoryCounts: Record<string, number> = {};

  for (const err of errors) {
    if (counts[err.category] !== undefined) {
      counts[err.category]++;
    }
    subcategoryCounts[err.subcategory] = (subcategoryCounts[err.subcategory] || 0) + 1;
  }

  return {
    categoryCounts: counts,
    subcategoryCounts,
    totalErrors: errors.length,
  };
}
