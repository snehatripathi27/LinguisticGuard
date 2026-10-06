"""
LLM-as-a-Judge Evaluator: Deterministic Heuristic + API fallback
"""
import os
from typing import Dict, Any


def evaluate_with_llm_judge(
    source_text: str,
    target_text: str,
    bleu: float,
    semantic_sim: float,
    cultural_score: float,
    force_demo_mode: bool = False
) -> Dict[str, Any]:
    """Judge linguistic quality, returning structured evaluation."""
    strengths = []
    weaknesses = []
    score = 8.5

    if semantic_sim >= 0.8:
        strengths.append("High semantic fidelity to source propositions.")
        score += 0.5
    else:
        weaknesses.append("Noticeable semantic drift from source meaning.")
        score -= 1.0

    if cultural_score >= 8.0:
        strengths.append("Appropriate cultural framing and respectful register.")
    else:
        weaknesses.append("Literal translation reduces naturalness and idiomatic flow.")
        score -= 1.2

    score = max(1.0, min(10.0, round(score, 1)))

    if score >= 9.0:
        verdict = "Excellent"
    elif score >= 7.5:
        verdict = "Good"
    elif score >= 6.0:
        verdict = "Fair"
    elif score >= 4.0:
        verdict = "Poor"
    else:
        verdict = "Critical Flaw"

    reasoning = (
        f"Evaluated candidate translation with {bleu} BLEU and {cultural_score}/10 Cultural Score. "
        f"Semantic alignment is {int(semantic_sim * 100)}%."
    )

    return {
        "verdict": verdict,
        "overallScore": score,
        "strengths": strengths or ["Linguistically coherent phrasing"],
        "weaknesses": weaknesses or ["Minor stylistic polish recommended"],
        "reasoning": reasoning,
        "suggestedAlternative": None,
        "provider": "Deterministic NLP Judge (Demo Mode)",
        "isDemoMode": True,
    }
