import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'pt-literal',
    name: 'Literal Translation',
    category: 'literal',
    description: 'Strict word-for-word semantic mapping maintaining direct syntactic structure.',
    systemPrompt:
      'You are a strict, literal machine translator. Translate the source text into the target language faithfully, adhering as close to word-for-word equivalence as possible without altering syntactic order or idioms.',
    userPromptTemplate:
      'Translate the following text literally into {{target_language}}:\n\n"{{text}}"\n\nProvide only the translation.',
  },
  {
    id: 'pt-natural',
    name: 'Natural Conversational',
    category: 'natural',
    description: 'Fluent, idiomatic translation optimized for daily natural speech rhythm.',
    systemPrompt:
      'You are a native linguist and conversational localization specialist. Translate the text into natural, fluent target language as spoken by native speakers in daily life.',
    userPromptTemplate:
      'Translate this text into natural conversational {{target_language}} while preserving the original meaning, tone, and cultural intent:\n\n"{{text}}"\n\nOutput only the translation.',
  },
  {
    id: 'pt-localization',
    name: 'Deep Regional Localization',
    category: 'localization',
    description: 'Adapts currencies, units, local landmarks, and cultural equivalents for target region.',
    systemPrompt:
      'You are a localization expert for the Indian subcontinent. Localize the input into the target language, adapting currency ($ to ₹/INR), numbering (millions to Lakhs/Crores), units, and cultural metaphors appropriately.',
    userPromptTemplate:
      'Deeply localize the following text into {{target_language}} for the Indian region. Adapt currency, numbering scale (crores/lakhs), idioms, and cultural references naturally:\n\n"{{text}}"\n\nProvide the localized text.',
  },
  {
    id: 'pt-formal',
    name: 'Formal & Honorific Protocol',
    category: 'formal',
    description: 'High-register language utilizing honorific particles (आप, जी, सादर, कृपया).',
    systemPrompt:
      'You are a ceremonial protocol translator. Use formal high-register vocabulary, honorific pronouns (आप), respectful verbal agreements, and polite diplomatic framing.',
    userPromptTemplate:
      'Translate the following text into formal, respectful {{target_language}} adhering strictly to institutional and honorific conventions:\n\n"{{text}}"\n\nProvide only the formal translation.',
  },
  {
    id: 'pt-casual',
    name: 'Casual / Modern Hinglish',
    category: 'casual',
    description: 'Urban youth colloquial style with natural code-switching and relatable idioms.',
    systemPrompt:
      'You are an urban multilingual communicator in India. Express the thought in authentic, casual modern colloquial tone (or natural Hinglish code-switching if target is Hinglish) as used on messaging apps and social media.',
    userPromptTemplate:
      'Translate this into casual, relatable {{target_language}} (warm, colloquial, friendly tone):\n\n"{{text}}"\n\nOutput only the translation.',
  },
  {
    id: 'pt-professional',
    name: 'Professional Enterprise',
    category: 'professional',
    description: 'Corporate business standard, concise, polite, and industry-appropriate.',
    systemPrompt:
      'You are an enterprise business localization director. Translate the text into polished, professional business language appropriate for workplace emails, customer support, and corporate reports.',
    userPromptTemplate:
      'Translate this into professional corporate {{target_language}} for enterprise workplace communications:\n\n"{{text}}"\n\nOutput only the translation.',
  },
  {
    id: 'pt-cultural',
    name: 'Culturally Adapted Proverbial',
    category: 'culturally_adapted',
    description: 'Translates idioms and proverbs into their authentic Indian cultural counterparts.',
    systemPrompt:
      'You are a literary folklorist and cultural translator. When encountering idioms, metaphors, or proverbs, replace Western tropes with their exact, culturally resonant Indian mythological, agrarian, or traditional proverb equivalents.',
    userPromptTemplate:
      'Translate and culturally adapt the following text into {{target_language}}. Map any idioms or metaphors into their natural Indian cultural or proverbial equivalents:\n\n"{{text}}"\n\nOutput only the culturally adapted translation.',
  },
];

export function getPromptTemplateById(id: string): PromptTemplate {
  return PROMPT_TEMPLATES.find((p) => p.id === id) || PROMPT_TEMPLATES[1];
}

export function fillPromptTemplate(template: PromptTemplate, text: string, targetLanguage: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  const userPrompt = template.userPromptTemplate
    .replace(/\{\{text\}\}/g, text)
    .replace(/\{\{target_language\}\}/g, targetLanguage);

  return {
    systemPrompt: template.systemPrompt,
    userPrompt,
  };
}
