"""
Translation Engine with deterministic demo fallback and LLM support
"""
from typing import Dict, Any


def translate_text(text: str, target_language: str = "hi", prompt_id: str = None) -> Dict[str, Any]:
    """Deterministic translation generator for demo/offline use."""
    t_lower = text.lower().strip()

    # Known direct matches
    if "quarterly financial report" in t_lower:
        tr = "कृपया शुक्रवार दोपहर तक त्रैमासिक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।"
    elif "series b" in t_lower or "15 million" in t_lower:
        tr = "कंपनी ने अपने सीरीज बी राउंड में लगभग 125 करोड़ रुपये (15 मिलियन डॉलर) जुटाए।"
    elif "beat around the bush" in t_lower:
        tr = "इधर-उधर की बातें मत करो, सीधे बताओ क्या हुआ।"
    elif "tomorrow" in t_lower and "office" in t_lower:
        tr = "Kal office aa rahe ho ya work from home karoge?" if target_language == "hinglish" else "क्या आप कल कार्यालय आ रहे हैं या घर से काम कर रहे हैं?"
    else:
        if target_language == "hi":
            tr = f"यह वाक्य स्थानीयकृत किया गया: {text}"
        elif target_language == "hinglish":
            tr = f"Yeh content Hinglish mein adapt hua: {text}"
        else:
            tr = f"Translated to English: {text}"

    return {
        "translation": tr,
        "provider": "Deterministic NLP Engine (Demo Mode)",
        "isDemoMode": True,
    }
