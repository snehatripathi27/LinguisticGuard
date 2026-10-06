"""
Prompt Templates for Multilingual Translation and Cultural Adaptation
"""
from typing import Dict, List, Any

PROMPT_TEMPLATES: List[Dict[str, str]] = [
    {
        "id": "literal",
        "name": "Literal Translation",
        "description": "Strict word-for-word semantic translation without altering syntactic order.",
        "system": "You are a strict, literal machine translator.",
    },
    {
        "id": "natural",
        "name": "Natural Conversational",
        "description": "Fluent, idiomatic translation as spoken by native speakers in daily life.",
        "system": "You are a native conversational translator focusing on natural fluency and tone.",
    },
    {
        "id": "localization",
        "name": "Deep Regional Localization",
        "description": "Adapts currencies, units, and regional numbering systems (Crores/Lakhs).",
        "system": "You are an Indian regional localization specialist adapting currency and numbering scales.",
    },
    {
        "id": "formal",
        "name": "Formal & Honorific Protocol",
        "description": "High-register institutional Hindi with honorific pronouns (आप/जी).",
        "system": "You are a ceremonial protocol translator using formal polite registers.",
    },
    {
        "id": "casual",
        "name": "Casual Modern Hinglish",
        "description": "Colloquial urban code-mixing popular on social media and messaging.",
        "system": "You are an urban multilingual speaker communicating in natural Hinglish.",
    },
    {
        "id": "professional",
        "name": "Professional Enterprise",
        "description": "Polished workplace corporate communications.",
        "system": "You are an enterprise corporate translator.",
    },
    {
        "id": "culturally_adapted",
        "name": "Culturally Adapted Proverbial",
        "description": "Transcreation of Western idioms into authentic Indian proverbs.",
        "system": "You are a literary folklorist translating idioms into Indian cultural equivalents.",
    },
]


def get_prompt_template(template_id: str) -> Dict[str, str]:
    for p in PROMPT_TEMPLATES:
        if p["id"] == template_id:
            return p
    return PROMPT_TEMPLATES[1]
