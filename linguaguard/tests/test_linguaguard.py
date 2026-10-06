"""
LinguaGuard Comprehensive Test Suite (Compatible with pytest & unittest)
"""
import unittest
import sys
import os

# Add root to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from linguaguard.languages.detector import detect_language
from linguaguard.languages.hinglish import analyze_hinglish
from linguaguard.core.metrics import compute_bleu, compute_rouge, compute_semantic_similarity, compute_bertscore
from linguaguard.evaluators.cultural import evaluate_cultural
from linguaguard.evaluators.llm_judge import evaluate_with_llm_judge
from linguaguard.core.taxonomy import classify_errors
from linguaguard.analyzers.linguistic import perform_linguistic_analysis
from linguaguard.translators.engine import translate_text
from linguaguard.datasets.loader import load_dataset


class TestLinguaGuard(unittest.TestCase):

    def test_language_detection(self):
        """Test English, Hindi Devanagari, and Hinglish detection."""
        en_res = detect_language("Please submit the quarterly financial report.")
        self.assertEqual(en_res["language"], "en")
        self.assertEqual(en_res["script"], "Latin")

        hi_res = detect_language("कृपया शुक्रवार तक रिपोर्ट जमा करें।")
        self.assertEqual(hi_res["language"], "hi")
        self.assertEqual(hi_res["script"], "Devanagari")

        hinglish_res = detect_language("Kal meeting hai, please report ready rakhna.")
        self.assertEqual(hinglish_res["language"], "hinglish")

    def test_hinglish_code_switching(self):
        """Test Hinglish code-switching detection, switch points, and naturalness."""
        res = analyze_hinglish("Kal meeting hai, please report ready rakhna.")
        self.assertTrue(res["isHinglish"])
        self.assertGreater(res["switchPointsCount"], 0)
        self.assertGreater(res["naturalnessScore"], 8.0)
        self.assertEqual(res["matrixLanguage"], "hi")
        self.assertEqual(res["urbanContextRating"], "authentic")

    def test_bleu_and_rouge_metrics(self):
        """Test sentence BLEU and ROUGE-1/2/L calculations."""
        cand = "कृपया शुक्रवार तक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।"
        ref = "कृपया शुक्रवार तक वित्तीय रिपोर्ट जमा करना सुनिश्चित करें।"
        bleu = compute_bleu(cand, ref)
        self.assertAlmostEqual(bleu["bleu"], 100.0, delta=1.0)

        rouge = compute_rouge(cand, ref)
        self.assertAlmostEqual(rouge["rougeL"], 100.0, delta=1.0)

        diff_cand = "कृपया रिपोर्ट भेज दीजिए।"
        bleu_diff = compute_bleu(diff_cand, ref)
        self.assertLess(bleu_diff["bleu"], 100.0)

    def test_semantic_similarity(self):
        """Test semantic cosine and BERTScore approximation."""
        cand = "Don't beat around the bush."
        ref = "Stop beating around the bush."
        sim = compute_semantic_similarity(cand, ref)
        self.assertGreater(sim, 0.45)

        bert = compute_bertscore(cand, ref, sim)
        self.assertGreater(bert, 50.0)

    def test_cultural_scoring(self):
        """Test 15-dimension cultural rubric detection of idiom and currency flaws."""
        bad_src = "Don't beat around the bush."
        bad_tr = "झाड़ी के चारों ओर मत पीटो।"
        bad_eval = evaluate_cultural(bad_src, bad_tr)
        self.assertLess(bad_eval["cultural_score"], 9.0)
        self.assertGreater(len(bad_eval["issues"]), 0)
        self.assertEqual(bad_eval["issues"][0]["type"], "idiom")

        good_tr = "इधर-उधर की बातें मत करो।"
        good_eval = evaluate_cultural(bad_src, good_tr)
        self.assertGreater(good_eval["cultural_score"], bad_eval["cultural_score"])

    def test_error_classification(self):
        """Test classification under standardized error taxonomy."""
        cult_issues = [{
            "type": "idiom",
            "severity": "medium",
            "description": "Literal translation reduces naturalness"
        }]
        errors = classify_errors("Test text", "Test text without punctuation", cultural_issues=cult_issues)
        categories = [e["category"] for e in errors]
        self.assertIn("LINGUISTIC", categories)
        self.assertIn("CULTURAL", categories)

    def test_linguistic_analysis(self):
        """Test tokenization, POS tagging, and formality analysis."""
        analysis = perform_linguistic_analysis("दादी जी अपने कमरे में विश्राम कर रही हैं, कृपया शोर न करें।")
        self.assertEqual(analysis["detectedLanguage"], "hi")
        self.assertEqual(analysis["formality"], "honorific/formal")
        self.assertGreater(len(analysis["tokens"]), 5)

    def test_mock_translator_and_judge(self):
        """Test deterministic demo translation and LLM Judge."""
        tr = translate_text("Please make sure to submit the quarterly financial report by Friday afternoon.", "hi")
        self.assertTrue(tr["isDemoMode"])
        self.assertIn("वित्तीय रिपोर्ट", tr["translation"])

        judge = evaluate_with_llm_judge("Sample", "Sample", 80.0, 0.9, 8.5)
        self.assertIn(judge["verdict"], ["Good", "Excellent"])
        self.assertGreater(judge["overallScore"], 7.0)

    def test_dataset_loader(self):
        """Verify 105 starter dataset items are loaded correctly."""
        dataset = load_dataset()
        self.assertGreaterEqual(len(dataset), 100)
        first = dataset[0]
        self.assertIn("source_text", first)
        self.assertIn("reference", first)
        self.assertIn("cultural_context", first)
        self.assertIn("category", first)


if __name__ == "__main__":
    unittest.main()
