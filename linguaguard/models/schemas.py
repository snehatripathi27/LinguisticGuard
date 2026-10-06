"""
LinguaGuard Data Models & Pydantic Schemas
"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


SupportedLanguage = Literal["en", "hi", "hinglish"]
CulturalIssueSeverity = Literal["low", "medium", "high", "critical"]
ErrorMainCategory = Literal["LINGUISTIC", "SEMANTIC", "CULTURAL", "STYLE"]


class TokenItem(BaseModel):
    text: str
    pos: str
    posLabel: str
    isHindi: bool
    isEnglish: bool
    isPunctuation: bool
    nerTag: Optional[str] = None


class NamedEntity(BaseModel):
    text: str
    label: str
    confidence: float = 0.95


class CodeSwitchPoint(BaseModel):
    index: int
    fromLang: str
    toLang: str
    tokenBefore: str
    tokenAfter: str
    isNatural: bool = True
    explanation: str


class HinglishAnalysisResult(BaseModel):
    isHinglish: bool
    matrixLanguage: Literal["hi", "en", "balanced"]
    embeddedLanguage: Literal["hi", "en", "none"]
    totalTokens: int
    hindiTokens: int
    englishTokens: int
    switchPointsCount: int
    switchRate: float
    naturalnessScore: float
    grammarCompatibilityScore: float
    switchPoints: List[CodeSwitchPoint]
    analysisNote: str
    urbanContextRating: Literal["authentic", "moderately natural", "stilted", "unnatural"]


class LinguisticQualityScores(BaseModel):
    grammar: float = Field(..., ge=0, le=10)
    fluency: float = Field(..., ge=0, le=10)
    semanticPreservation: float = Field(..., ge=0, le=10)
    tonePreservation: float = Field(..., ge=0, le=10)
    culturalAppropriateness: float = Field(..., ge=0, le=10)
    naturalness: float = Field(..., ge=0, le=10)


class LinguisticAnalysisResult(BaseModel):
    detectedLanguage: SupportedLanguage
    confidence: float
    script: Literal["Devanagari", "Latin", "Mixed"]
    tokens: List[TokenItem]
    entities: List[NamedEntity]
    sentences: List[str]
    formality: Literal["honorific/formal", "standard/neutral", "colloquial/informal", "slang/intimate"]
    formalityScore: float
    tone: Literal["professional", "respectful", "friendly", "casual", "critical", "festive"]
    sentimentPreservation: float
    scores: LinguisticQualityScores
    hinglishDetails: Optional[HinglishAnalysisResult] = None


class CulturalIssue(BaseModel):
    type: str
    severity: CulturalIssueSeverity
    description: str
    affectedSpan: Optional[str] = None
    suggestedFix: Optional[str] = None


class CulturalDimensionScore(BaseModel):
    dimension: str
    dimensionKey: str
    score: float
    note: str
    applicable: bool


class CulturalEvaluationResult(BaseModel):
    cultural_score: float = Field(..., ge=0, le=10)
    issues: List[CulturalIssue]
    dimensionScores: List[CulturalDimensionScore]
    rubricSummary: str
    localizedRecommendation: Optional[str] = None


class MetricScores(BaseModel):
    bleu: float
    bleu1: float
    bleu2: float
    bleu3: float
    bleu4: float
    rouge1: float
    rouge2: float
    rougeL: float
    bertScore: float
    semanticSimilarity: float


class EvaluationError(BaseModel):
    category: ErrorMainCategory
    subcategory: str
    severity: CulturalIssueSeverity
    description: str
    sourceSpan: Optional[str] = None
    targetSpan: Optional[str] = None


class LLMJudgeCritique(BaseModel):
    verdict: Literal["Excellent", "Good", "Fair", "Poor", "Critical Flaw"]
    overallScore: float
    strengths: List[str]
    weaknesses: List[str]
    reasoning: str
    suggestedAlternative: Optional[str] = None
    provider: str
    isDemoMode: bool


class FullEvaluationResult(BaseModel):
    id: str
    timestamp: str
    sourceText: str
    modelTranslation: str
    referenceTranslation: Optional[str] = None
    sourceLanguage: SupportedLanguage
    targetLanguage: SupportedLanguage
    metrics: MetricScores
    linguistic: LinguisticAnalysisResult
    cultural: CulturalEvaluationResult
    llmJudge: LLMJudgeCritique
    errors: List[EvaluationError]
    overallQualityScore: float
    isDemoMode: bool


class TranslationRequest(BaseModel):
    text: str
    target_language: SupportedLanguage = "hi"
    prompt_template_id: Optional[str] = None
    force_demo_mode: bool = False


class EvaluationRequest(BaseModel):
    source_text: str
    model_translation: str
    reference_translation: Optional[str] = None
    source_language: Optional[SupportedLanguage] = None
    target_language: Optional[SupportedLanguage] = None
    cultural_context: Optional[str] = None
    force_demo_mode: bool = False


class HumanReviewRequest(BaseModel):
    evaluation_id: str
    source_text: str
    model_translation: str
    reviewer_name: str = "Anonymous Reviewer"
    accuracy: float = 8.0
    fluency: float = 8.0
    naturalness: float = 8.0
    cultural_appropriateness: float = 8.0
    tone: float = 8.0
    semantic_preservation: float = 8.0
    error_tags: List[str] = []
    comments: str = ""
    approved: bool = True
