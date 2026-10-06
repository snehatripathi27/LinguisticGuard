import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import datasetItems from './src/data/dataset.json';
import { evaluateCulturalContext } from './src/lib/culturalEngine';
import { evaluateTranslationPipeline } from './src/lib/evaluator';
import { isGeminiAvailable, translateTextWithEngine } from './src/lib/geminiService';
import { performLinguisticAnalysis } from './src/lib/nlpEngine';
import { fillPromptTemplate, getPromptTemplateById } from './src/lib/promptEngine';
import { FullEvaluationResult, HumanReview } from './src/types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent stores for reports and human reviews
const reportsStore = new Map<string, FullEvaluationResult>();
const humanReviewsStore: HumanReview[] = [];

// Seed an initial evaluation report
(async () => {
  try {
    const sample = datasetItems[0];
    const initialReport = await evaluateTranslationPipeline({
      sourceText: sample.source_text,
      modelTranslation: sample.reference,
      referenceTranslation: sample.reference,
      sourceLanguage: sample.source_language as any,
      targetLanguage: sample.target_language as any,
      culturalContextHint: sample.cultural_context,
      forceDemoMode: false,
    });
    reportsStore.set(initialReport.id, initialReport);
    reportsStore.set('sample-report-1', initialReport);
  } catch (err) {
    console.error('Error seeding initial report:', err);
  }
})();

// API Endpoints

// 1. Health & Config status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    geminiLiveAvailable: isGeminiAvailable(),
    demoModeActive: !isGeminiAvailable(),
    datasetCount: datasetItems.length,
    reportsCount: reportsStore.size,
    reviewsCount: humanReviewsStore.length,
  });
});

// 2. Dataset Explorer endpoint
app.get('/api/dataset', (req: Request, res: Response) => {
  const { category, language, search } = req.query;
  let items = [...datasetItems];

  if (category && typeof category === 'string' && category !== 'all') {
    items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }
  if (language && typeof language === 'string' && language !== 'all') {
    items = items.filter((i) => i.target_language === language || i.source_language === language);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.source_text.toLowerCase().includes(q) ||
        i.reference.toLowerCase().includes(q) ||
        i.cultural_context.toLowerCase().includes(q)
    );
  }

  res.json({ total: items.length, items });
});

// 3. POST /api/translate
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, target_language, prompt_template_id, force_demo_mode } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Field "text" is required.' });
      return;
    }

    const template = prompt_template_id ? getPromptTemplateById(prompt_template_id) : undefined;
    const filled = template ? fillPromptTemplate(template, text, target_language || 'hi') : undefined;

    const result = await translateTextWithEngine(
      text,
      target_language || 'hi',
      filled?.systemPrompt,
      Boolean(force_demo_mode)
    );

    res.json({
      source_text: text,
      target_language: target_language || 'hi',
      translation: result.translation,
      provider: result.provider,
      is_demo_mode: result.isDemoMode,
      prompt_used: filled?.userPrompt || 'Direct instruction',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

// 4. POST /api/evaluate
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const {
      source_text,
      model_translation,
      reference_translation,
      source_language,
      target_language,
      cultural_context,
      force_demo_mode,
    } = req.body;

    if (!source_text || !model_translation) {
      res.status(400).json({ error: 'Both "source_text" and "model_translation" are required.' });
      return;
    }

    const report = await evaluateTranslationPipeline({
      sourceText: source_text,
      modelTranslation: model_translation,
      referenceTranslation: reference_translation,
      sourceLanguage: source_language,
      targetLanguage: target_language,
      culturalContextHint: cultural_context,
      forceDemoMode: Boolean(force_demo_mode),
    });

    reportsStore.set(report.id, report);

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Evaluation failed' });
  }
});

// 5. POST /api/linguistic-analysis
app.post('/api/linguistic-analysis', (req: Request, res: Response) => {
  try {
    const { text, language_hint, reference } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Field "text" is required.' });
      return;
    }

    const analysis = performLinguisticAnalysis(text, language_hint, reference);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Linguistic analysis failed' });
  }
});

// 6. POST /api/cultural-analysis
app.post('/api/cultural-analysis', (req: Request, res: Response) => {
  try {
    const { source_text, target_text, source_language, target_language, cultural_context } = req.body;
    if (!source_text || !target_text) {
      res.status(400).json({ error: 'Both source_text and target_text are required.' });
      return;
    }

    const result = evaluateCulturalContext(
      source_text,
      target_text,
      source_language || 'en',
      target_language || 'hi',
      cultural_context
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Cultural evaluation failed' });
  }
});

// 7. POST /api/compare-models
app.post('/api/compare-models', async (req: Request, res: Response) => {
  try {
    const {
      source_text,
      model_a_text,
      model_b_text,
      model_a_name,
      model_b_name,
      reference_translation,
      target_language,
    } = req.body;

    if (!source_text || !model_a_text || !model_b_text) {
      res.status(400).json({ error: 'source_text, model_a_text, and model_b_text are required.' });
      return;
    }

    const evalA = await evaluateTranslationPipeline({
      sourceText: source_text,
      modelTranslation: model_a_text,
      referenceTranslation: reference_translation,
      targetLanguage: target_language || 'hi',
    });

    const evalB = await evaluateTranslationPipeline({
      sourceText: source_text,
      modelTranslation: model_b_text,
      referenceTranslation: reference_translation,
      targetLanguage: target_language || 'hi',
    });

    res.json({
      modelA: {
        name: model_a_name || 'Model A',
        text: model_a_text,
        evaluation: evalA,
      },
      modelB: {
        name: model_b_name || 'Model B',
        text: model_b_text,
        evaluation: evalB,
      },
      comparison: {
        winner:
          evalA.overallQualityScore > evalB.overallQualityScore
            ? model_a_name || 'Model A'
            : evalA.overallQualityScore < evalB.overallQualityScore
            ? model_b_name || 'Model B'
            : 'Tie',
        deltaScore: Number(Math.abs(evalA.overallQualityScore - evalB.overallQualityScore).toFixed(1)),
        culturalWinner:
          evalA.cultural.cultural_score > evalB.cultural.cultural_score
            ? model_a_name || 'Model A'
            : model_b_name || 'Model B',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Model comparison failed' });
  }
});

// 8. GET /api/reports/:id
app.get('/api/reports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const report = reportsStore.get(id);

  if (!report) {
    res.status(404).json({ error: `Report with id "${id}" not found.` });
    return;
  }

  res.json(report);
});

// 9. GET /api/reports (list recent reports)
app.get('/api/reports', (req: Request, res: Response) => {
  const list = Array.from(reportsStore.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  res.json({ total: list.length, reports: list.slice(0, 20) });
});

// 10. POST /api/human-review
app.post('/api/human-review', (req: Request, res: Response) => {
  try {
    const {
      evaluation_id,
      source_text,
      model_translation,
      reviewer_name,
      accuracy,
      fluency,
      naturalness,
      cultural_appropriateness,
      tone,
      semantic_preservation,
      error_tags,
      comments,
      approved,
    } = req.body;

    const acc = Number(accuracy) || 8;
    const flu = Number(fluency) || 8;
    const nat = Number(naturalness) || 8;
    const cul = Number(cultural_appropriateness) || 8;
    const ton = Number(tone) || 8;
    const sem = Number(semantic_preservation) || 8;

    const overall = Number(((acc + flu + nat + cul + ton + sem) / 6).toFixed(1));

    const review: HumanReview = {
      reviewId: `HR-${Date.now()}`,
      evaluationId: evaluation_id || 'manual',
      sourceText: source_text || '',
      modelTranslation: model_translation || '',
      reviewerName: reviewer_name || 'Anonymous Reviewer',
      accuracy: acc,
      fluency: flu,
      naturalness: nat,
      culturalAppropriateness: cul,
      tone: ton,
      semanticPreservation: sem,
      overallScore: overall,
      errorTags: Array.isArray(error_tags) ? error_tags : [],
      comments: comments || '',
      approved: Boolean(approved),
      createdAt: new Date().toISOString(),
    };

    humanReviewsStore.unshift(review);
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Saving review failed' });
  }
});

// 11. GET /api/human-reviews
app.get('/api/human-reviews', (req: Request, res: Response) => {
  res.json({ total: humanReviewsStore.length, reviews: humanReviewsStore });
});

// Vite Middleware mounting or static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinguaGuard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
