# LinguaGuard 🛡️
### Multilingual LLM Localization, Translation-Quality, Linguistic-Analysis & Cultural-Context Evaluation Platform

[![CI](https://github.com/example/linguaguard/actions/workflows/ci.yml/badge.svg)](https://github.com/example/linguaguard/actions)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](https://www.docker.com/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**LinguaGuard** is an open-source, production-grade AI quality assurance and linguistic audit platform designed to evaluate whether AI-generated text is:
- **Linguistically correct** (grammar, syntax, morphological agreement, terminal punctuation)
- **Semantically faithful** (preserves propositional content, avoids omissions and hallucinated additions)
- **Culturally appropriate** (respects Indian social contexts, honorific particles, kinship specificity)
- **Natural for target regions** (authentic cadence, unforced colloquial registers)
- **Idiomatically resonant** (converts proverbs into native cultural counterparts rather than literal translations)
- **Code-switching compatible** (evaluates Hinglish without penalizing organic urban bilingual mixing)

Initially focused on **English**, **Hindi (Devanagari)**, and **Hinglish (Romanized / Mixed)**, with a modular architecture ready for all 22 scheduled Indian languages.

---

## 🌟 Why Localization Matters for AI

Traditional Machine Translation (MT) focuses almost exclusively on **word substitution** and **syntactic alignment**. In global enterprise and user-facing AI applications, this creates severe friction:

1. **The "Uncanny Valley" of Literalism**: Translating *"Don't beat around the bush"* into Hindi as *"झाड़ी के चारों ओर मत पीटो"* (Don't hit around the shrub) is grammatically decipherable but culturally absurd.
2. **Financial Scale Disconnect**: Translating *"$15 million"* into *"15 मिलियन डॉलर"* confuses Indian users who think in **Lakhs and Crores** (*₹125 करोड़*).
3. **Kinship & Honorific Nuance**: In English, everyone is *"Uncle"*; in Hindi, addressing a paternal elder (*ताऊ जी*) with maternal uncle vocabulary (*मामा जी*) or omitting respectful suffix *-ji* (*दादी जी*) breaches basic sociolinguistic etiquette.
4. **The Hinglish Reality**: Over **350 million** Indians communicate daily in Hinglish. Naive NLP systems misclassify Hinglish as "corrupted English" or "broken Hindi". LinguaGuard treats Hinglish as a first-class sociolinguistic variety using the **Matrix Language Frame** model.

---

## 📐 Translation vs. Localization vs. Cultural Adaptation

| Dimension | 1. Translation | 2. Localization | 3. Cultural Adaptation (Transcreation) |
| :--- | :--- | :--- | :--- |
| **Primary Goal** | Semantic transfer of words | Regional format compliance | Emotional & cultural resonance |
| **Currency & Scale** | Kept as source (*$15M*) | Converted (*₹125 Crore / 125 करोड़*) | Framed in local economic context |
| **Idioms & Proverbs** | Translated literally | Paraphrased plainly | Mapped to cultural proverbs (*"ऊंट के मुंह में जीरा"*) |
| **Honorifics** | Often dropped (*You / Tu*) | Standard formal (*Aap*) | Contextual honorifics (*Aap / Ji / Kripya / Pranam*) |
| **Example** | *"He bluffs a lot."* | *"वह बहुत डींगें हांकता है।"* | *"अरे वो बस हवाबाज़ी करता है, कुछ नहीं आता उसे।"* |

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   User / Client Input  │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │    Language Detection    │
                                 │ (Devanagari/Latin/Mixed) │
                                 └────────────┬─────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │   Linguistic Analyzer   │                     │     Hinglish Engine     │
         │  • POS Tagging & Morph  │                     │ • Code-Switch Points    │
         │  • NER (Locations/Curr) │                     │ • Matrix/Embedded Frame │
         │  • Formality & Tone     │                     │ • Naturalness Index     │
         └────────────┬────────────┘                     └────────────┬────────────┘
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │   Comparative Metrics    │
                                 │ • Sentence BLEU (1-4 BP) │
                                 │ • ROUGE-1 / 2 / L F1     │
                                 │ • BERTScore F1           │
                                 │ • Semantic Cosine Sim    │
                                 └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │ Cultural Rubric (15 Dim) │
                                 │ • Idioms, Humor, Scale   │
                                 │ • Kinship & Honorifics   │
                                 │ • Food, Festivals, Units │
                                 └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │    LLM-as-a-Judge Audit  │
                                 │  • Gemini 3.8 Flash API  │
                                 │  • Deterministic Heuristics│
                                 └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │ Standardized Taxonomy    │
                                 │ LINGUISTIC | SEMANTIC    │
                                 │ CULTURAL   | STYLE       │
                                 └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │ Human-in-the-Loop Review │
                                 │ (1-10 Likert & Tagging)  │
                                 └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌──────────────────────────┐
                                 │ Comprehensive Certificate│
                                 │ (JSON / Markdown Report) │
                                 └──────────────────────────┘
```

---

## 🚀 Quickstart & Installation

### Option 1: Docker Compose (Production Stack)
Run the complete stack (Express/React web frontend, FastAPI backend, and Streamlit dashboard) with one command:

```bash
# Clone the repository
git clone https://github.com/example/linguaguard.git
cd linguaguard

# Launch all containers
docker compose up --build
```
- **Web Platform**: `http://localhost:3000`
- **FastAPI Documentation**: `http://localhost:8000/docs`
- **Streamlit Dashboard**: `http://localhost:8501`

---

### Option 2: Local Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r linguaguard/requirements.txt

# Run Python Unit Tests
python3 -m unittest discover -s linguaguard/tests

# Launch FastAPI Server
uvicorn linguaguard.api.main:app --reload --port 8000

# Launch Streamlit Dashboard
streamlit run linguaguard/dashboard/app.py
```

---

### Option 3: Local Node.js / Express + React Environment

```bash
npm install
npm run dev
```
Server runs on `http://localhost:3000` with hot-mounted Vite development environment.

---

## 🧪 Testing & Verification

LinguaGuard includes a comprehensive test suite covering all modules:

```bash
# Run pytest or unittest
python3 -m unittest discover -s linguaguard/tests -v
```

Tests verify:
- ✅ Script detection (Devanagari, Latin, Mixed)
- ✅ Code-switch point detection and matrix language determination
- ✅ Sentence BLEU (with brevity penalty) and ROUGE-1/2/L
- ✅ Cosine semantic term vector similarity
- ✅ 15-dimension cultural rubric issue detection
- ✅ Standardized error taxonomy classification
- ✅ Deterministic demo providers and LLM judge fallbacks
- ✅ 105-item curated dataset structure validation

---

## 📊 Sample Evaluation Report

```markdown
# LinguaGuard Quality Audit Certificate [EV-89f41b2]

- **Source Language**: English (en)
- **Target Language**: Hindi (hi)
- **Source**: "Don't beat around the bush; tell me what happened with the $15 million."
- **Candidate**: "झाड़ी के चारों ओर मत पीटो, सीधे बताओ कि 15 मिलियन डॉलर का क्या हुआ।"

### Linguistic Quality Scorecard
- Grammar: 8.8 / 10
- Fluency: 8.5 / 10
- Semantic Preservation: 9.0 / 10
- Cultural Appropriateness: 6.2 / 10 (Critical Friction)
- Naturalness: 7.0 / 10
- **Composite Score: 7.9 / 10**

### Identified Cultural Issues
1. [HIGH] idiom: Literal translation of "beat around the bush" reduces naturalness.
   Fix: Use "इधर-उधर की बातें मत करो" instead of literal shrub.
2. [MEDIUM] currency: Western scale ($15M) not localized into Indian numbering system.
   Fix: Convert to ₹125 करोड़ (Lakhs/Crores).

### LLM Judge Verdict
- Verdict: **Fair** (6.8/10)
- Reasoning: "The sentence conveys the informational intent but fails idiomatic localization.
  Literal phrasing sounds machine-generated to native speakers."
- Recommended Transcreation: "इधर-उधर की बातें मत करो, सीधे बताओ कि 125 करोड़ रुपये के निवेश का क्या हुआ।"
```

---

## 🗺️ Indic Language Roadmap

| Language | Script | Status | Planned Features |
| :--- | :--- | :--- | :--- |
| **English** | Latin | ✅ Supported | Baseline source / target |
| **Hindi** | Devanagari | ✅ Supported | Honorifics, Manak vs Colloquial |
| **Hinglish** | Latin Code-Mix | ✅ Supported | Matrix Language Frame, Urban youth register |
| **Tamil** | Tamil | 🔄 Q3 Roadmap | Diglossia (Centamil formal vs Koduntamil colloquial) |
| **Telugu** | Telugu | 🔄 Q3 Roadmap | Formal honorifics (Garu) & tech code-mixing |
| **Bengali** | Bengali | 🔄 Q4 Roadmap | Sadhu Bhasha vs Cholito Bhasha, cultural food idioms |
| **Marathi** | Devanagari | 🔄 Q4 Roadmap | Mumbai Bambaiya vs Puneri formal register |
| **Gujarati** | Gujarati | 🔄 Q4 Roadmap | Business numbering, cultural culinary idioms |
| **Kannada** | Kannada | 🔄 2027 | Dialectical variations (Old vs Modern Bangalore mix) |
| **Punjabi** | Gurmukhi | 🔄 2027 | Agrarian idioms and conversational warmth |

---

## 📄 License
Licensed under the Apache-2.0 License.
