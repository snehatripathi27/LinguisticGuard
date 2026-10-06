export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface TokenItem {
  text: string;
  pos: string;
  posLabel: string;
  isHindi: boolean;
  isEnglish: boolean;
  isPunctuation: boolean;
  lemma?: string;
  nerTag?: string;
}

export interface NamedEntity {
  text: string;
  label: 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'CURRENCY' | 'CULTURAL' | 'TECH' | 'MISC';
  confidence: number;
}

export interface CodeSwitchPoint {
  index: number;
  fromLang: 'en' | 'hi';
  toLang: 'en' | 'hi';
  tokenBefore: string;
  tokenAfter: string;
  isNatural: boolean;
  explanation: string;
}

export interface HinglishAnalysisResult {
  isHinglish: boolean;
  matrixLanguage: 'hi' | 'en' | 'balanced';
  embeddedLanguage: 'hi' | 'en' | 'none';
  totalTokens: number;
  hindiTokens: number;
  englishTokens: number;
  switchPointsCount: number;
  switchRate: number; // switches per sentence/tokens
  naturalnessScore: number; // 0 to 10
  grammarCompatibilityScore: number; // 0 to 10
  switchPoints: CodeSwitchPoint[];
  analysisNote: string;
  urbanContextRating: 'authentic' | 'moderately natural' | 'stilted' | 'unnatural';
}

export interface LinguisticQualityScores {
  grammar: number; // 0-10
  fluency: number; // 0-10
  semanticPreservation: number; // 0-10
  tonePreservation: number; // 0-10
  culturalAppropriateness: number; // 0-10
  naturalness: number; // 0-10
}

export interface LinguisticAnalysisResult {
  detectedLanguage: SupportedLanguage;
  confidence: number;
  script: 'Devanagari' | 'Latin' | 'Mixed';
  tokens: TokenItem[];
  entities: NamedEntity[];
  sentences: string[];
  formality: 'honorific/formal' | 'standard/neutral' | 'colloquial/informal' | 'slang/intimate';
  formalityScore: number; // 0 to 10 (10 = hyper formal)
  tone: 'professional' | 'respectful' | 'friendly' | 'casual' | 'critical' | 'festive';
  sentimentPreservation: number; // 0 to 10
  scores: LinguisticQualityScores;
  hinglishDetails?: HinglishAnalysisResult;
}

export type CulturalIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface CulturalIssue {
  type:
    | 'idiom'
    | 'humor'
    | 'formality'
    | 'cultural_reference'
    | 'regional_terminology'
    | 'social_context'
    | 'names'
    | 'dates'
    | 'currency'
    | 'units'
    | 'food_references'
    | 'festivals'
    | 'greetings'
    | 'politeness'
    | 'code_switching';
  severity: CulturalIssueSeverity;
  description: string;
  affectedSpan?: string;
  suggestedFix?: string;
}

export interface CulturalDimensionScore {
  dimension: string;
  dimensionKey: string;
  score: number; // 0 to 10
  note: string;
  applicable: boolean;
}

export interface CulturalEvaluationResult {
  cultural_score: number; // 0 to 10
  issues: CulturalIssue[];
  dimensionScores: CulturalDimensionScore[];
  rubricSummary: string;
  localizedRecommendation?: string;
}

export interface MetricScores {
  bleu: number; // 0 to 100
  bleu1: number;
  bleu2: number;
  bleu3: number;
  bleu4: number;
  rouge1: number; // 0 to 100
  rouge2: number;
  rougeL: number;
  bertScore: number; // 0 to 100
  semanticSimilarity: number; // 0 to 1.0 (or 0-100)
}

export type ErrorMainCategory = 'LINGUISTIC' | 'SEMANTIC' | 'CULTURAL' | 'STYLE';

export interface EvaluationError {
  category: ErrorMainCategory;
  subcategory: string;
  severity: CulturalIssueSeverity;
  description: string;
  sourceSpan?: string;
  targetSpan?: string;
}

export interface LLMJudgeCritique {
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical Flaw';
  overallScore: number; // 1 to 10
  strengths: string[];
  weaknesses: string[];
  reasoning: string;
  suggestedAlternative?: string;
  provider: string; // e.g., 'Gemini 3.8 Flash' or 'Demo Engine'
  isDemoMode: boolean;
}

export interface FullEvaluationResult {
  id: string;
  timestamp: string;
  sourceText: string;
  modelTranslation: string;
  referenceTranslation?: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  metrics: MetricScores;
  linguistic: LinguisticAnalysisResult;
  cultural: CulturalEvaluationResult;
  llmJudge: LLMJudgeCritique;
  errors: EvaluationError[];
  overallQualityScore: number; // 0 to 10
  isDemoMode: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  category: 'literal' | 'natural' | 'localization' | 'formal' | 'casual' | 'professional' | 'culturally_adapted';
}

export interface PromptComparisonResult {
  promptA: PromptTemplate;
  promptB: PromptTemplate;
  outputA: string;
  outputB: string;
  evaluationA: FullEvaluationResult;
  evaluationB: FullEvaluationResult;
  comparisonSummary: string;
}

export interface HumanReview {
  reviewId: string;
  evaluationId: string;
  sourceText: string;
  modelTranslation: string;
  reviewerName: string;
  accuracy: number; // 1-10
  fluency: number; // 1-10
  naturalness: number; // 1-10
  culturalAppropriateness: number; // 1-10
  tone: number; // 1-10
  semanticPreservation: number; // 1-10
  overallScore: number; // 1-10
  errorTags: string[];
  comments: string;
  approved: boolean;
  createdAt: string;
}

export interface DatasetItem {
  id: string;
  source_language: SupportedLanguage;
  target_language: SupportedLanguage;
  source_text: string;
  reference: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cultural_context: string;
}
