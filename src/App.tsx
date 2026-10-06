import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, ViewTab } from './components/Navigation';
import { DashboardView } from './views/DashboardView';
import { TranslationLabView } from './views/TranslationLabView';
import { LocalizationLabView } from './views/LocalizationLabView';
import { LinguisticAnalysisView } from './views/LinguisticAnalysisView';
import { CulturalEvaluationView } from './views/CulturalEvaluationView';
import { HinglishModuleView } from './views/HinglishModuleView';
import { PromptPlaygroundView } from './views/PromptPlaygroundView';
import { HumanReviewView } from './views/HumanReviewView';
import { ErrorAnalysisView } from './views/ErrorAnalysisView';
import { DatasetExplorerView } from './views/DatasetExplorerView';
import { ReportsView } from './views/ReportsView';
import { DatasetItem, FullEvaluationResult, SupportedLanguage } from './types';
import { evaluateTranslationPipeline } from './lib/evaluator';
import datasetItems from './data/dataset.json';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [geminiLiveAvailable, setGeminiLiveAvailable] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<FullEvaluationResult | null>(null);
  const [recentReports, setRecentReports] = useState<FullEvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check health and initialize sample evaluation
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiLiveAvailable(Boolean(data.geminiLiveAvailable));
        if (data.geminiLiveAvailable) {
          setDemoMode(false); // Default to live if API key is present
        }
      })
      .catch(() => {
        setDemoMode(true);
      });

    // Seed default evaluation on client
    (async () => {
      const sample = datasetItems[0];
      const initial = await evaluateTranslationPipeline({
        sourceText: sample.source_text,
        modelTranslation: sample.reference,
        referenceTranslation: sample.reference,
        sourceLanguage: sample.source_language as SupportedLanguage,
        targetLanguage: sample.target_language as SupportedLanguage,
        culturalContextHint: sample.cultural_context,
        forceDemoMode: true,
      });
      setCurrentEvaluation(initial);
      setRecentReports([initial]);
    })();
  }, []);

  // Run evaluation pipeline
  const handleRunEvaluation = async ({
    sourceText,
    modelTranslation,
    referenceTranslation,
    sourceLanguage,
    targetLanguage,
    culturalContext,
  }: {
    sourceText: string;
    modelTranslation: string;
    referenceTranslation?: string;
    sourceLanguage?: SupportedLanguage;
    targetLanguage?: SupportedLanguage;
    culturalContext?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_text: sourceText,
          model_translation: modelTranslation,
          reference_translation: referenceTranslation,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          cultural_context: culturalContext,
          force_demo_mode: demoMode,
        }),
      });

      let evaluation: FullEvaluationResult;
      if (res.ok) {
        evaluation = await res.json();
      } else {
        // Client fallback
        evaluation = await evaluateTranslationPipeline({
          sourceText,
          modelTranslation,
          referenceTranslation,
          sourceLanguage,
          targetLanguage,
          culturalContextHint: culturalContext,
          forceDemoMode: demoMode,
        });
      }

      setCurrentEvaluation(evaluation);
      setRecentReports((prev) => [evaluation, ...prev.filter((r) => r.id !== evaluation.id)]);
    } catch (err) {
      console.warn('API evaluate failed, falling back to client evaluation engine:', err);
      const fallback = await evaluateTranslationPipeline({
        sourceText,
        modelTranslation,
        referenceTranslation,
        sourceLanguage,
        targetLanguage,
        culturalContextHint: culturalContext,
        forceDemoMode: demoMode,
      });
      setCurrentEvaluation(fallback);
      setRecentReports((prev) => [fallback, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectForLab = (item: DatasetItem) => {
    // Run evaluation on chosen dataset item and switch tab
    handleRunEvaluation({
      sourceText: item.source_text,
      modelTranslation: item.reference,
      referenceTranslation: item.reference,
      sourceLanguage: item.source_language,
      targetLanguage: item.target_language,
      culturalContext: item.cultural_context,
    });
    setCurrentTab('translation-lab');
  };

  const handleSelectReport = (report: FullEvaluationResult) => {
    setCurrentEvaluation(report);
  };

  const handleNavigateToHumanReview = (report: FullEvaluationResult) => {
    setCurrentEvaluation(report);
    setCurrentTab('human-review');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
        geminiLiveAvailable={geminiLiveAvailable}
        currentView={currentTab}
      />

      {/* Navigation Tabs */}
      <Navigation currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            recentReports={recentReports}
            onNavigateToTab={setCurrentTab}
            onSelectReport={handleSelectReport}
            demoMode={demoMode}
          />
        )}

        {currentTab === 'translation-lab' && (
          <TranslationLabView
            currentEvaluation={currentEvaluation}
            onRunEvaluation={handleRunEvaluation}
            isLoading={isLoading}
            onNavigateToHumanReview={handleNavigateToHumanReview}
            onNavigateToTab={setCurrentTab}
            demoMode={demoMode}
          />
        )}

        {currentTab === 'localization-lab' && <LocalizationLabView />}

        {currentTab === 'linguistic-analysis' && (
          <LinguisticAnalysisView initialText={currentEvaluation?.modelTranslation} />
        )}

        {currentTab === 'cultural-eval' && <CulturalEvaluationView />}

        {currentTab === 'hinglish-module' && <HinglishModuleView />}

        {currentTab === 'prompt-playground' && (
          <PromptPlaygroundView demoMode={demoMode} />
        )}

        {currentTab === 'human-review' && (
          <HumanReviewView
            currentEvaluation={currentEvaluation}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'error-analysis' && <ErrorAnalysisView />}

        {currentTab === 'dataset-explorer' && (
          <DatasetExplorerView onSelectForLab={handleSelectForLab} />
        )}

        {currentTab === 'reports' && (
          <ReportsView currentEvaluation={currentEvaluation} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">LinguaGuard</span>
            <span>·</span>
            <span>Multilingual LLM Localization & Indic Linguistic Evaluation Platform</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>FastAPI Backend</span>
            <span>·</span>
            <span>Docker Ready</span>
            <span>·</span>
            <span>English / Hindi / Hinglish</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
