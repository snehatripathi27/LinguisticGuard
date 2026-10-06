"""
Standardized Error Taxonomy (LINGUISTIC, SEMANTIC, CULTURAL, STYLE)
"""
from typing import Dict, List, Any

ERROR_TAXONOMY = {
    "LINGUISTIC": ["grammar", "syntax", "morphology", "spelling", "punctuation"],
    "SEMANTIC": ["meaning_change", "omission", "addition", "mistranslation"],
    "CULTURAL": ["inappropriate_reference", "idiom_error", "tone_mismatch", "cultural_mismatch"],
    "STYLE": ["formality", "unnatural_phrase", "verbosity", "tone"],
}


def classify_errors(source_text: str, target_text: str, reference: str = None, cultural_issues: List[Dict] = None) -> List[Dict[str, Any]]:
    errors = []
    # Punctuation check
    if target_text and not target_text.strip().endswith((".", "!", "?", "।")):
        errors.append({
            "category": "LINGUISTIC",
            "subcategory": "punctuation",
            "severity": "low",
            "description": "Missing terminal punctuation (। or .)",
        })

    # Cultural issues mapping
    if cultural_issues:
        for ci in cultural_issues:
            if ci["type"] == "idiom":
                errors.append({
                    "category": "CULTURAL",
                    "subcategory": "idiom_error",
                    "severity": ci["severity"],
                    "description": ci["description"],
                })
            elif ci["type"] == "currency":
                errors.append({
                    "category": "CULTURAL",
                    "subcategory": "cultural_mismatch",
                    "severity": ci["severity"],
                    "description": ci["description"],
                })
            else:
                errors.append({
                    "category": "STYLE",
                    "subcategory": "formality",
                    "severity": ci["severity"],
                    "description": ci["description"],
                })

    return errors
