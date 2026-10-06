import {
  FullEvaluationResult,
  SupportedLanguage,
} from '../types';
import { evaluateCulturalContext } from './culturalEngine';
import { classifyErrors } from './errorTaxonomy';
import { runLLMJudge } from './geminiService';
import { computeAllMetrics } from './metrics';
import { detectLanguage, performLinguisticAnalysis } from './nlpEngine';

export async function evaluateTranslationPipeline({
  sourceText,
  modelTranslation,
  referenceTranslation,
  sourceLanguage,
  targetLanguage,
  culturalContextHint,
  forceDemoMode = false,
}: {
  sourceText: string;
  modelTranslation: string;
  referenceTranslation?: string;
  sourceLanguage?: SupportedLanguage;
  targetLanguage?: SupportedLanguage;
  culturalContextHint?: string;
  forceDemoMode?: boolean;
}): Promise<FullEvaluationResult> {
  const detectedSrc = sourceLanguage || detectLanguage(sourceText).language;
  const detectedTgt = targetLanguage || detectLanguage(modelTranslation).language;

  // 1. Linguistic Analysis
  const linguistic = performLinguisticAnalysis(modelTranslation, detectedTgt, referenceTranslation);

  // 2. Metrics calculation (BLEU, ROUGE, BERTScore, Semantic Similarity)
  const metrics = computeAllMetrics(modelTranslation, referenceTranslation);

  // 3. Cultural Evaluation (15 dimensions)
  const cultural = evaluateCulturalContext(
    sourceText,
    modelTranslation,
    detectedSrc,
    detectedTgt,
    culturalContextHint
  );

  // 4. Error classification
  const errors = classifyErrors(sourceText, modelTranslation, referenceTranslation, cultural.issues);

  // 5. LLM Judge
  const llmJudge = await runLLMJudge(
    sourceText,
    modelTranslation,
    detectedSrc,
    detectedTgt,
    { bleu: metrics.bleu, semanticSimilarity: metrics.semanticSimilarity },
    cultural.cultural_score,
    forceDemoMode
  );

  // 6. Overall Quality Score (weighted combination: Linguistic 25%, Cultural 30%, Semantic 25%, LLM Judge 20%)
  const linguisticAvg =
    (linguistic.scores.grammar + linguistic.scores.fluency + linguistic.scores.naturalness) / 3;
  const semanticScore = metrics.semanticSimilarity * 10;
  const rawOverall =
    linguisticAvg * 0.25 + cultural.cultural_score * 0.3 + semanticScore * 0.25 + llmJudge.overallScore * 0.2;
  const overallQualityScore = Number(Math.max(1.0, Math.min(10.0, rawOverall)).toFixed(1));

  const id = `EV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    timestamp: new Date().toISOString(),
    sourceText,
    modelTranslation,
    referenceTranslation,
    sourceLanguage: detectedSrc,
    targetLanguage: detectedTgt,
    metrics,
    linguistic,
    cultural,
    llmJudge,
    errors,
    overallQualityScore,
    isDemoMode: llmJudge.isDemoMode,
  };
}
