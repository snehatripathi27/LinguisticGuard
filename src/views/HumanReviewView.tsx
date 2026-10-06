import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Send,
  Star,
  Check,
  MessageSquare,
} from 'lucide-react';
import { FullEvaluationResult, HumanReview } from '../types';

interface HumanReviewViewProps {
  currentEvaluation: FullEvaluationResult | null;
  onNavigateToTab: (tab: any) => void;
}

export const HumanReviewView: React.FC<HumanReviewViewProps> = ({
  currentEvaluation,
  onNavigateToTab,
}) => {
  const [reviewerName, setReviewerName] = useState('Senior Hindi Linguist');
  const [sourceText, setSourceText] = useState(
    currentEvaluation?.sourceText ||
      'Please make sure to submit the quarterly financial report by Friday afternoon.'
  );
  const [modelTranslation, setModelTranslation] = useState(
    currentEvaluation?.modelTranslation ||
      'कृपया शुक्रवार दोपहर तक त्रैमासिक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।'
  );

  // Criteria ratings (1-10)
  const [accuracy, setAccuracy] = useState(9);
  const [fluency, setFluency] = useState(9);
  const [naturalness, setNaturalness] = useState(9);
  const [culturalAppropriateness, setCulturalAppropriateness] = useState(9);
  const [tone, setTone] = useState(9);
  const [semanticPreservation, setSemanticPreservation] = useState(9);

  // Error tags & comments
  const [selectedErrorTags, setSelectedErrorTags] = useState<string[]>([]);
  const [comments, setComments] = useState(
    'Accurate corporate phrasing using appropriate polite imperatives (कृपया/करें).'
  );
  const [approved, setApproved] = useState(true);

  // Stored reviews list
  const [savedReviews, setSavedReviews] = useState<HumanReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    fetch('/api/human-reviews')
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) setSavedReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  const availableTags = [
    'grammar_minor',
    'syntax_order',
    'spelling_typo',
    'meaning_change',
    'omission',
    'addition',
    'idiom_literalism',
    'formality_mismatch',
    'unnatural_loanword',
    'tone_too_casual',
    'tone_too_harsh',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedErrorTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/human-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation_id: currentEvaluation?.id || 'manual-review',
          source_text: sourceText,
          model_translation: modelTranslation,
          reviewer_name: reviewerName,
          accuracy,
          fluency,
          naturalness,
          cultural_appropriateness: culturalAppropriateness,
          tone,
          semantic_preservation: semanticPreservation,
          error_tags: selectedErrorTags,
          comments,
          approved,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setSavedReviews((prev) => [saved, ...prev]);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedAverage = Number(
    ((accuracy + fluency + naturalness + culturalAppropriateness + tone + semanticPreservation) / 6).toFixed(1)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Human-in-the-Loop Validation</span>
          <span aria-hidden="true">·</span>
          <span>6-Factor Likert Rubric (1-10)</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Human Linguistic Evaluation & Audit Review
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Expert human review captures sociolinguistic nuance, politeness subtleties, and regional naturalness
          that automated metrics cannot completely observe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Review Form</h3>
              <div className="flex items-center gap-2 text-xs">
                <label className="text-slate-500">Reviewer:</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Source & Translation Preview */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Source Text:</span>
                <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-900 mt-1">
                  {sourceText}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Candidate Translation:</span>
                <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-900 mt-1 font-sans">
                  {modelTranslation}
                </p>
              </div>
            </div>

            {/* 6 Criteria Sliders */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Evaluation Criteria (1 to 10 scale)
                </span>
                <span className="text-xs font-mono font-bold text-indigo-700">
                  Mean: {calculatedAverage}/10
                </span>
              </div>

              {[
                { label: 'Accuracy (Faithfulness to facts & intent)', val: accuracy, set: setAccuracy },
                { label: 'Fluency (Grammatical correctness & flow)', val: fluency, set: setFluency },
                { label: 'Naturalness (Native regional speech cadence)', val: naturalness, set: setNaturalness },
                { label: 'Cultural Appropriateness (Honorifics & idioms)', val: culturalAppropriateness, set: setCulturalAppropriateness },
                { label: 'Tone Preservation (Respectful / Professional)', val: tone, set: setTone },
                { label: 'Semantic Preservation (Information density)', val: semanticPreservation, set: setSemanticPreservation },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-slate-900">{item.val}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={item.val}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Error Taxonomy Tags */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Error Classification Tags (Standard Taxonomy)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isChecked = selectedErrorTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                        isChecked
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-medium'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tag.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviewer Comments */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Reviewer Notes & Qualitative Feedback</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-indigo-500"
                placeholder="Detailed linguistic feedback..."
              />
            </div>

            {/* Production Approval Checkbox */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                type="checkbox"
                id="approveCheck"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <label htmlFor="approveCheck" className="text-slate-800 font-medium cursor-pointer">
                Approve translation for production release & training dataset
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              {successMessage ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Review recorded and persisted!
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-xs shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Store Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Saved Human Evaluations Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Audited Human Evaluations ({savedReviews.length})
              </h3>
              <span className="text-xs text-slate-400 font-mono">Persistent Log</span>
            </div>

            {savedReviews.length > 0 ? (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {savedReviews.map((rev) => (
                  <div
                    key={rev.reviewId}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{rev.reviewerName}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {rev.overallScore}/10
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            rev.approved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {rev.approved ? 'Approved' : 'Rejected'}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 line-clamp-2 italic">
                      &ldquo;{rev.comments}&rdquo;
                    </p>

                    {rev.errorTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.errorTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      Target: {rev.modelTranslation.slice(0, 42)}...
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                No human reviews submitted yet. Rate the sample above to start recording human evaluations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
