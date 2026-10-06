import { GoogleGenAI } from '@google/genai';
import { LLMJudgeCritique, SupportedLanguage } from '../types';

function getEffectiveApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key.includes('MY_GEMINI_API_KEY')) {
    return null;
  }
  return key;
}

export function isGeminiAvailable(): boolean {
  return getEffectiveApiKey() !== null;
}

// Deterministic offline translation dictionary & heuristics for demo mode
const DEMO_TRANSLATIONS: Record<string, Record<string, string>> = {
  'please make sure to submit the quarterly financial report by friday afternoon.': {
    hi: 'कृपया शुक्रवार दोपहर तक त्रैमासिक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।',
    hinglish: 'Friday afternoon tak quarterly financial report submit karna ensure karein please.',
  },
  "the company raised 15 million dollars in its series b round.": {
    hi: 'कंपनी ने अपने सीरीज बी राउंड में लगभग 125 करोड़ रुपये (15 मिलियन डॉलर) जुटाए।',
    hinglish: 'Company ne apne Series B round mein 15 million dollars (around 125 crore) raise kiye.',
  },
  "don't beat around the bush; just tell me what happened.": {
    hi: 'इधर-उधर की बातें मत करो, सीधे बताओ क्या हुआ।',
    hinglish: 'Baat ko ghuma-phira ke mat bolo, seedha batao kya hua.',
  },
  "are you coming to the office tomorrow or working from home?": {
    hi: 'क्या आप कल कार्यालय आ रहे हैं या घर से काम कर रहे हैं?',
    hinglish: 'Kal office aa rahe ho ya work from home karoge?',
  },
  "wishing you and your family a very happy and prosperous diwali!": {
    hi: 'आपको और आपके परिवार को दीपावली की हार्दिक एवं सुखद शुभकामनाएं!',
    hinglish: 'Aapko aur aapki family ko Diwali ki bohot bohot shubhkamnayein!',
  },
};

export async function translateTextWithEngine(
  text: string,
  targetLang: SupportedLanguage,
  systemPrompt?: string,
  forceDemoMode = false
): Promise<{ translation: string; provider: string; isDemoMode: boolean }> {
  const apiKey = getEffectiveApiKey();

  if (apiKey && !forceDemoMode) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `${systemPrompt || 'You are an expert multilingual translator and cultural localization specialist.'}\n\nTranslate the following text into ${targetLang === 'hi' ? 'natural Hindi (Devanagari script)' : targetLang === 'hinglish' ? 'authentic modern conversational Hinglish (Romanized Latin script with natural Hindi-English code-switching)' : 'natural English'}:\n\n"${text}"\n\nReturn ONLY the translated text without extra explanation or quotation marks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const result = response.text?.trim() || '';
      if (result) {
        return {
          translation: result,
          provider: 'Gemini 3.8 Flash (Live API)',
          isDemoMode: false,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic demo engine:', err);
    }
  }

  // Deterministic Demo Provider
  const normalized = text.toLowerCase().trim();
  const directMatch = DEMO_TRANSLATIONS[normalized]?.[targetLang];
  if (directMatch) {
    return {
      translation: directMatch,
      provider: 'Deterministic NLP Engine (Demo Mode)',
      isDemoMode: true,
    };
  }

  // Heuristic mock translation
  let fallback = '';
  if (targetLang === 'hi') {
    if (text.includes('?')) {
      fallback = `क्या ${text.replace(/\?/g, '')} है? (डेमो अनुवाद)`;
    } else {
      fallback = `यह वाक्य सफलतापूर्वक स्थानीयकृत किया गया: "${text}"।`;
    }
  } else if (targetLang === 'hinglish') {
    fallback = `Yeh text Hinglish mein adapt ho gaya: "${text}" - ready to review.`;
  } else {
    fallback = `Translated text to English: "${text}"`;
  }

  return {
    translation: fallback,
    provider: 'Deterministic NLP Engine (Demo Mode)',
    isDemoMode: true,
  };
}

export async function runLLMJudge(
  sourceText: string,
  translatedText: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage,
  metrics: { bleu: number; semanticSimilarity: number },
  culturalScore: number,
  forceDemoMode = false
): Promise<LLMJudgeCritique> {
  const apiKey = getEffectiveApiKey();

  if (apiKey && !forceDemoMode) {
    try {
      const ai = new GoogleGenAI();
      const judgePrompt = `You are a Senior Multilingual Linguistic Evaluator and Localization Quality Auditor.
Evaluate the following translation from ${sourceLang.toUpperCase()} to ${targetLang.toUpperCase()}:

Source: "${sourceText}"
Candidate Translation: "${translatedText}"

Computed NLP metrics:
- BLEU: ${metrics.bleu}
- Semantic Similarity: ${(metrics.semanticSimilarity * 100).toFixed(1)}%
- Cultural Appropriateness Score: ${culturalScore}/10

Provide your evaluation in strict JSON format matching this schema:
{
  "verdict": "Excellent" | "Good" | "Fair" | "Poor" | "Critical Flaw",
  "overallScore": number (1 to 10),
  "strengths": string[],
  "weaknesses": string[],
  "reasoning": string,
  "suggestedAlternative": string
}
Return only JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: judgePrompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        verdict: parsed.verdict || 'Good',
        overallScore: Number(parsed.overallScore || 8.5),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Natural fluency', 'Accurate vocabulary'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        reasoning: parsed.reasoning || 'Translation captures the core intent and respects linguistic norms.',
        suggestedAlternative: parsed.suggestedAlternative,
        provider: 'Gemini 3.8 Flash (LLM Judge)',
        isDemoMode: false,
      };
    } catch (err) {
      console.warn('Gemini LLM Judge failed, using deterministic judge heuristics:', err);
    }
  }

  // Deterministic LLM Judge Heuristics
  let score = 8.5;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (metrics.semanticSimilarity >= 0.8) {
    strengths.push('High semantic fidelity preserving core informational proposition.');
    score += 0.5;
  } else {
    weaknesses.push('Noticeable divergence in lexical choices compared to standard terminology.');
    score -= 1.0;
  }

  if (culturalScore >= 8.0) {
    strengths.push('Maintains culturally appropriate tone and polite sociolinguistic markers.');
  } else {
    weaknesses.push('Cultural friction points detected; literal translation reduces naturalness.');
    score -= 1.2;
  }

  if (translatedText.length < sourceText.length * 0.4) {
    weaknesses.push('Candidate text appears truncated or omits subordinate clauses.');
    score -= 1.5;
  }

  score = Math.max(1, Math.min(10, Number(score.toFixed(1))));

  let verdict: LLMJudgeCritique['verdict'] = 'Good';
  if (score >= 9.0) verdict = 'Excellent';
  else if (score >= 7.5) verdict = 'Good';
  else if (score >= 6.0) verdict = 'Fair';
  else if (score >= 4.0) verdict = 'Poor';
  else verdict = 'Critical Flaw';

  return {
    verdict,
    overallScore: score,
    strengths: strengths.length ? strengths : ['Linguistically well-formed structure'],
    weaknesses: weaknesses.length ? weaknesses : ['Minor stylistic polish recommended'],
    reasoning: `Evaluated via deterministic NLP heuristic judge. Candidate scored ${metrics.bleu} BLEU and ${culturalScore}/10 Cultural Score with ${(metrics.semanticSimilarity * 100).toFixed(0)}% semantic vector alignment.`,
    suggestedAlternative: undefined,
    provider: 'Deterministic NLP Rule Engine (Demo Mode)',
    isDemoMode: true,
  };
}
