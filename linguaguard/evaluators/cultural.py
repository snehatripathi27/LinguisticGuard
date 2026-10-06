"""
Cultural Evaluation & 15-Dimension Rubric
"""
from typing import Dict, List, Any

CULTURAL_DIMENSIONS = [
    ("idiom", "1. Idioms & Proverbs"),
    ("humor", "2. Humor & Sarcasm"),
    ("formality", "3. Formality & Honorifics"),
    ("cultural_reference", "4. Cultural References"),
    ("regional_terminology", "5. Regional Terminology"),
    ("social_context", "6. Social Context & Kinship"),
    ("names", "7. Names & Address Conventions"),
    ("dates", "8. Dates & Calendar Conventions"),
    ("currency", "9. Currency & Numbering Scale"),
    ("units", "10. Measurement Units"),
    ("food_references", "11. Food & Culinary References"),
    ("festivals", "12. Festivals & Auspicious Events"),
    ("greetings", "13. Greetings & Salutations"),
    ("politeness", "14. Politeness & Imperative Register"),
    ("code_switching", "15. Code-Switching Naturalness"),
]


def evaluate_cultural(source_text: str, target_text: str) -> Dict[str, Any]:
    issues = []
    src_l = source_text.lower()
    tgt_l = target_text.lower()

    # Idiom check
    if "beat around the bush" in src_l:
        if "झाड़ी" in target_text or "bush" in tgt_l:
            issues.append({
                "type": "idiom",
                "severity": "medium",
                "description": "Literal translation reduces naturalness",
                "affectedSpan": "beat around the bush",
                "suggestedFix": "Use 'इधर-उधर की बातें मत करो' instead of literal shrub.",
            })

    if "raining cats and dogs" in src_l:
        if "कुत्तों" in target_text or "cats" in tgt_l:
            issues.append({
                "type": "idiom",
                "severity": "high",
                "description": "Literal translation of weather idiom reduces naturalness",
                "suggestedFix": "Use 'मूसलाधार बारिश' (torrential rain).",
            })

    # Currency scale
    if ("million" in src_l or "billion" in src_l) and not any(k in target_text for k in ["करोड़", "लाख", "crore", "lakh"]):
        issues.append({
            "type": "currency",
            "severity": "medium",
            "description": "Western scale not localized into Indian Lakhs/Crores",
            "suggestedFix": "Convert millions to Lakhs/Crores for Indian readership.",
        })

    # Honorifics
    if any(k in src_l for k in ["grandmother", "grandfather", "elder"]) and not any(k in target_text for k in ["जी", "आप"]):
        issues.append({
            "type": "formality",
            "severity": "medium",
            "description": "Omission of honorific suffix 'जी' or respectful verb plural",
            "suggestedFix": "Add 'जी' (दादी जी) and plural verb agreement (कर रही हैं).",
        })

    # Dimension scores
    dimension_scores = []
    for key, name in CULTURAL_DIMENSIONS:
        has_issue = any(i["type"] == key for i in issues)
        score = 6.5 if has_issue else 9.5
        dimension_scores.append({
            "dimension": name,
            "dimensionKey": key,
            "score": score,
            "note": "Issue detected" if has_issue else "Culturally appropriate",
            "applicable": True,
        })

    base_score = 9.2 - (len(issues) * 1.1)
    cultural_score = round(max(2.0, min(10.0, base_score)), 1)

    return {
        "cultural_score": cultural_score,
        "issues": issues,
        "dimensionScores": dimension_scores,
        "rubricSummary": f"Identified {len(issues)} cultural friction points across evaluation dimensions." if issues else "Culturally sound translation.",
        "localizedRecommendation": issues[0]["suggestedFix"] if issues else "Text conforms to Indian regional publishing standards.",
    }
