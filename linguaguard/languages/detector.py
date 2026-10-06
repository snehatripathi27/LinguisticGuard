"""
Language Detector for English, Hindi (Devanagari), and Hinglish (Latin Code-Mixed)
"""
import re
from typing import Dict, Literal, Tuple

HINGLISH_MARKERS = {
    "hai", "hain", "ho", "hoon", "tha", "thi", "the", "ka", "ki", "ke", "ko", "se",
    "mein", "par", "pe", "aur", "ya", "lekin", "kyunki", "isliye", "agar", "toh",
    "kya", "kyun", "kaise", "kab", "kahan", "kaun", "kitna", "kitne", "mera", "meri",
    "mere", "tera", "teri", "tere", "uska", "uski", "unka", "unki", "hamara", "hum",
    "tum", "aap", "woh", "yeh", "karna", "karo", "karein", "kar", "raha", "rahi",
    "rahe", "gaya", "gayi", "gaye", "hoga", "hogi", "bhai", "yaar", "accha", "theek",
    "bohot", "bahut", "thoda", "sab", "kuch", "koi", "nahi", "na", "mat", "aaj", "kal",
    "abhi", "baad", "pehle", "chahiye", "chalo", "chal", "jugaad", "bindaas", "tapri"
}


def detect_language(text: str) -> Dict[str, any]:
    """Detect language, confidence, and script."""
    if not text or not text.strip():
        return {"language": "en", "confidence": 0.5, "script": "Latin"}

    clean = text.strip()
    devanagari_chars = re.findall(r"[\u0900-\u097F]", clean)
    latin_chars = re.findall(r"[a-zA-Z]", clean)

    d_ratio = len(devanagari_chars) / max(len(clean), 1)

    if devanagari_chars and latin_chars:
        if d_ratio > 0.4:
            return {"language": "hi", "confidence": 0.92, "script": "Devanagari"}
        return {"language": "hi", "confidence": 0.85, "script": "Mixed"}

    if d_ratio > 0.3 or len(devanagari_chars) > 3:
        return {"language": "hi", "confidence": 0.98, "script": "Devanagari"}

    # Latin script: English vs Hinglish
    words = re.findall(r"[a-zA-Z0-9]+", clean.lower())
    hinglish_count = sum(1 for w in words if w in HINGLISH_MARKERS)
    ratio = hinglish_count / max(len(words), 1)

    if hinglish_count >= 2 or (len(words) <= 4 and hinglish_count >= 1) or ratio > 0.18:
        conf = min(0.99, 0.70 + ratio * 0.4)
        return {"language": "hinglish", "confidence": round(conf, 2), "script": "Latin"}

    return {"language": "en", "confidence": 0.95, "script": "Latin"}
