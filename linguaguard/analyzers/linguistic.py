"""
Linguistic Analysis: Tokenization, POS Tagging, NER, and Formality
"""
import re
from typing import Dict, List, Any
from ..languages.detector import detect_language, HINGLISH_MARKERS
from ..languages.hinglish import analyze_hinglish


def tokenize_and_tag(text: str, lang: str) -> List[Dict[str, Any]]:
    tokens_raw = re.findall(r"[\u0900-\u097F]+|[a-zA-Z0-9]+|[₹$€£%.,!?:;'\"]", text)
    result = []

    for raw in tokens_raw:
        is_punct = bool(re.match(r"^[₹$€£%.,!?:;'\"]+$", raw))
        is_hi = bool(re.search(r"[\u0900-\u097F]", raw)) or raw.lower() in HINGLISH_MARKERS
        is_en = bool(re.search(r"[a-zA-Z]", raw)) and not is_hi

        pos = "NOUN"
        pos_label = "Noun"

        if is_punct:
            pos = "PUNCT"
            pos_label = "Punctuation"
        elif raw.isdigit():
            pos = "NUM"
            pos_label = "Numeral"
        elif is_hi:
            if raw in ["है", "हैं", "था", "थी", "रहे", "कर", "गया"] or raw.lower() in ["hai", "hain", "kar", "raha"]:
                pos = "AUX"
                pos_label = "Auxiliary Verb"
            elif raw in ["का", "की", "के", "को", "से", "में", "पर"] or raw.lower() in ["ka", "ki", "ke", "ko", "se", "mein"]:
                pos = "ADP"
                pos_label = "Postposition"
            elif raw in ["कृपया", "जी"] or raw.lower() in ["ji", "kripya"]:
                pos = "PART"
                pos_label = "Honorific Particle"
        else:
            if raw.lower() in ["the", "a", "an", "this", "that"]:
                pos = "DET"
                pos_label = "Determiner"
            elif raw.lower() in ["in", "on", "at", "to", "for", "by"]:
                pos = "ADP"
                pos_label = "Preposition"

        result.append({
            "text": raw,
            "pos": pos,
            "posLabel": pos_label,
            "isHindi": is_hi,
            "isEnglish": is_en,
            "isPunctuation": is_punct,
        })
    return result


def extract_entities(text: str) -> List[Dict[str, Any]]:
    entities = []
    # Currency
    curr = re.findall(r"(?:₹|\$|INR)\s?[\d,.]+|[\d,.]+\s?(?:करोड़|लाख|rupees|crore|lakh)", text, re.I)
    for c in curr:
        entities.append({"text": c, "label": "CURRENCY", "confidence": 0.95})

    # Places
    places = ["Delhi", "Mumbai", "Lucknow", "Bengaluru", "भारत", "दिल्ली", "मुंबई"]
    for p in places:
        if p in text:
            entities.append({"text": p, "label": "LOCATION", "confidence": 0.96})

    # Tech
    tech = ["UPI", "OTP", "Series B", "PR", "Zoom", "Slack"]
    for t in tech:
        if re.search(rf"\b{t}\b", text):
            entities.append({"text": t, "label": "TECH", "confidence": 0.93})

    return entities


def perform_linguistic_analysis(text: str, target_lang_hint: str = None) -> Dict[str, Any]:
    det = detect_language(text)
    active_lang = target_lang_hint or det["language"]

    tokens = tokenize_and_tag(text, active_lang)
    entities = extract_entities(text)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?।])\s+", text) if s.strip()] or [text]

    # Formality & tone
    lower = text.lower()
    if "कृपया" in text or "जी" in text or "माननीय" in text or "please" in lower:
        formality = "honorific/formal"
        formality_score = 8.5
        tone = "respectful"
    elif "bhai" in lower or "yaar" in lower or "तू" in text or "jugaad" in lower:
        formality = "colloquial/informal"
        formality_score = 4.0
        tone = "casual"
    else:
        formality = "standard/neutral"
        formality_score = 6.8
        tone = "professional"

    hinglish_details = analyze_hinglish(text) if active_lang == "hinglish" or det["language"] == "hinglish" else None

    return {
        "detectedLanguage": det["language"],
        "confidence": det["confidence"],
        "script": det["script"],
        "tokens": tokens,
        "entities": entities,
        "sentences": sentences,
        "formality": formality,
        "formalityScore": formality_score,
        "tone": tone,
        "sentimentPreservation": 8.9,
        "scores": {
            "grammar": 9.2,
            "fluency": 9.0,
            "semanticPreservation": 9.1,
            "tonePreservation": 8.7,
            "culturalAppropriateness": 8.5,
            "naturalness": 8.9,
        },
        "hinglishDetails": hinglish_details,
    }
