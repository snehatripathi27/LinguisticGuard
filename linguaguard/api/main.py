"""
LinguaGuard FastAPI Application
"""
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from ..models.schemas import (
    TranslationRequest,
    EvaluationRequest,
    HumanReviewRequest,
)
from ..core.metrics import compute_bleu, compute_rouge, compute_semantic_similarity, compute_bertscore
from ..languages.detector import detect_language
from ..languages.hinglish import analyze_hinglish
from ..analyzers.linguistic import perform_linguistic_analysis
from ..evaluators.cultural import evaluate_cultural
from ..evaluators.llm_judge import evaluate_with_llm_judge
from ..core.taxonomy import classify_errors
from ..translators.engine import translate_text
from ..datasets.loader import load_dataset

app = FastAPI(
    title="LinguaGuard API",
    description="Multilingual LLM Localization, Translation-Quality, Linguistic Analysis & Cultural Evaluation Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores
REPORTS_DB: Dict[str, Dict[str, Any]] = {}
HUMAN_REVIEWS_DB: List[Dict[str, Any]] = []


@app.get("/")
def root():
    return {
        "service": "LinguaGuard",
        "status": "operational",
        "endpoints": [
            "/translate",
            "/evaluate",
            "/linguistic-analysis",
            "/cultural-analysis",
            "/compare-models",
            "/reports/{id}",
            "/dataset",
            "/human-review",
        ],
    }


@app.post("/translate")
def translate_endpoint(req: TranslationRequest):
    result = translate_text(req.text, req.target_language, req.prompt_template_id)
    return {
        "source_text": req.text,
        "target_language": req.target_language,
        "translation": result["translation"],
        "provider": result["provider"],
        "is_demo_mode": result["isDemoMode"],
    }


@app.post("/evaluate")
def evaluate_endpoint(req: EvaluationRequest):
    src_lang = req.source_language or detect_language(req.source_text)["language"]
    tgt_lang = req.target_language or detect_language(req.model_translation)["language"]

    # 1. Linguistic analysis
    ling = perform_linguistic_analysis(req.model_translation, tgt_lang)

    # 2. Metrics
    ref = req.reference_translation or req.model_translation
    bleu_data = compute_bleu(req.model_translation, ref)
    rouge_data = compute_rouge(req.model_translation, ref)
    sem_sim = compute_semantic_similarity(req.model_translation, ref)
    bert_score = compute_bertscore(req.model_translation, ref, sem_sim)

    # 3. Cultural evaluation
    cult = evaluate_cultural(req.source_text, req.model_translation)

    # 4. Error classification
    errs = classify_errors(req.source_text, req.model_translation, req.reference_translation, cult["issues"])

    # 5. LLM Judge
    judge = evaluate_with_llm_judge(
        req.source_text,
        req.model_translation,
        bleu_data["bleu"],
        sem_sim,
        cult["cultural_score"],
        force_demo_mode=req.force_demo_mode,
    )

    # Overall score
    overall = round(0.25 * ling["scores"]["grammar"] + 0.3 * cult["cultural_score"] + 0.25 * (sem_sim * 10) + 0.2 * judge["overallScore"], 1)

    eval_id = f"EV-{uuid.uuid4().hex[:8]}"
    report = {
        "id": eval_id,
        "timestamp": datetime.utcnow().isoformat(),
        "sourceText": req.source_text,
        "modelTranslation": req.model_translation,
        "referenceTranslation": req.reference_translation,
        "sourceLanguage": src_lang,
        "targetLanguage": tgt_lang,
        "metrics": {
            **bleu_data,
            **rouge_data,
            "bertScore": bert_score,
            "semanticSimilarity": sem_sim,
        },
        "linguistic": ling,
        "cultural": cult,
        "llmJudge": judge,
        "errors": errs,
        "overallQualityScore": overall,
        "isDemoMode": True,
    }

    REPORTS_DB[eval_id] = report
    return report


@app.post("/linguistic-analysis")
def linguistic_analysis_endpoint(payload: Dict[str, Any]):
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text field is required.")
    return perform_linguistic_analysis(text)


@app.post("/cultural-analysis")
def cultural_analysis_endpoint(payload: Dict[str, Any]):
    src = payload.get("source_text", "")
    tgt = payload.get("target_text", "")
    if not src or not tgt:
        raise HTTPException(status_code=400, detail="Both source_text and target_text are required.")
    return evaluate_cultural(src, tgt)


@app.post("/compare-models")
def compare_models_endpoint(payload: Dict[str, Any]):
    src = payload.get("source_text", "")
    mod_a = payload.get("model_a_text", "")
    mod_b = payload.get("model_b_text", "")
    if not src or not mod_a or not mod_b:
        raise HTTPException(status_code=400, detail="source_text, model_a_text, and model_b_text required.")

    cult_a = evaluate_cultural(src, mod_a)
    cult_b = evaluate_cultural(src, mod_b)

    return {
        "modelA": {"text": mod_a, "cultural_score": cult_a["cultural_score"]},
        "modelB": {"text": mod_b, "cultural_score": cult_b["cultural_score"]},
        "winner": "Model B" if cult_b["cultural_score"] > cult_a["cultural_score"] else "Model A",
    }


@app.get("/reports/{report_id}")
def get_report_endpoint(report_id: str):
    if report_id not in REPORTS_DB:
        raise HTTPException(status_code=404, detail="Report not found")
    return REPORTS_DB[report_id]


@app.get("/dataset")
def get_dataset_endpoint(category: Optional[str] = Query(None)):
    data = load_dataset()
    if category and category != "all":
        data = [d for d in data if d.get("category", "").lower() == category.lower()]
    return {"total": len(data), "items": data}


@app.post("/human-review")
def post_human_review_endpoint(req: HumanReviewRequest):
    review = {
        "reviewId": f"HR-{uuid.uuid4().hex[:6]}",
        "evaluationId": req.evaluation_id,
        "sourceText": req.source_text,
        "modelTranslation": req.model_translation,
        "reviewerName": req.reviewer_name,
        "accuracy": req.accuracy,
        "fluency": req.fluency,
        "naturalness": req.naturalness,
        "culturalAppropriateness": req.cultural_appropriateness,
        "tone": req.tone,
        "semanticPreservation": req.semantic_preservation,
        "overallScore": round((req.accuracy + req.fluency + req.naturalness + req.cultural_appropriateness + req.tone + req.semantic_preservation) / 6, 1),
        "errorTags": req.error_tags,
        "comments": req.comments,
        "approved": req.approved,
        "createdAt": datetime.utcnow().isoformat(),
    }
    HUMAN_REVIEWS_DB.append(review)
    return review
