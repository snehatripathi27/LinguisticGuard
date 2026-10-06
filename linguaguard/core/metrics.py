"""
Linguistic Evaluation Metrics: BLEU, ROUGE, BERTScore, and Semantic Similarity
"""
import math
import re
from typing import Dict, List, Tuple


def tokenize(text: str) -> List[str]:
    """Tokenize English, Hindi Devanagari, and Hinglish text into words."""
    if not text:
        return []
    clean = re.sub(r"[^\w\s\u0900-\u097F]", " ", text.lower())
    return [w for w in clean.split() if w]


def get_ngrams(tokens: List[str], n: int) -> Dict[str, int]:
    """Extract n-grams and their frequencies."""
    ngrams: Dict[str, int] = {}
    for i in range(len(tokens) - n + 1):
        gram = " ".join(tokens[i : i + n])
        ngrams[gram] = ngrams.get(gram, 0) + 1
    return ngrams


def compute_bleu(candidate: str, reference: str) -> Dict[str, float]:
    """Calculate sentence BLEU score with brevity penalty and n-gram precisions."""
    cand_tokens = tokenize(candidate)
    ref_tokens = tokenize(reference)

    if not cand_tokens or not ref_tokens:
        return {"bleu": 0.0, "p1": 0.0, "p2": 0.0, "p3": 0.0, "p4": 0.0}

    precisions: List[float] = []
    for n in range(1, 5):
        cand_ngrams = get_ngrams(cand_tokens, n)
        ref_ngrams = get_ngrams(ref_tokens, n)

        total_cand = sum(cand_ngrams.values())
        match_count = 0
        for gram, count in cand_ngrams.items():
            ref_count = ref_ngrams.get(gram, 0)
            match_count += min(count, ref_count)

        if total_cand == 0:
            precisions.append(0.0)
        else:
            precisions.append(match_count / total_cand)

    # Brevity penalty
    c = len(cand_tokens)
    r = len(ref_tokens)
    bp = 1.0
    if c <= r:
        bp = math.exp(1.0 - (r / (c or 1)))

    # Smoothed geometric mean
    log_sum = 0.0
    for p in precisions:
        smoothed = p if p > 0 else (0.1 / (c + 1))
        log_sum += 0.25 * math.log(smoothed)

    raw_bleu = bp * math.exp(log_sum)
    bleu_score = max(0.0, min(100.0, raw_bleu * 100.0))

    return {
        "bleu": round(bleu_score, 2),
        "p1": round(precisions[0] * 100.0, 1),
        "p2": round(precisions[1] * 100.0, 1),
        "p3": round(precisions[2] * 100.0, 1),
        "p4": round(precisions[3] * 100.0, 1),
    }


def lcs_length(a: List[str], b: List[str]) -> int:
    """Longest Common Subsequence length."""
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]


def compute_rouge(candidate: str, reference: str) -> Dict[str, float]:
    """Calculate ROUGE-1, ROUGE-2, and ROUGE-L F1 scores."""
    cand_tokens = tokenize(candidate)
    ref_tokens = tokenize(reference)

    if not cand_tokens or not ref_tokens:
        return {"rouge1": 0.0, "rouge2": 0.0, "rougeL": 0.0}

    # ROUGE-1
    c1 = get_ngrams(cand_tokens, 1)
    r1 = get_ngrams(ref_tokens, 1)
    overlap1 = sum(min(count, r1.get(gram, 0)) for gram, count in c1.items())
    r1_rec = overlap1 / len(ref_tokens)
    r1_prec = overlap1 / len(cand_tokens)
    f1_1 = (2 * r1_rec * r1_prec) / (r1_rec + r1_prec) if (r1_rec + r1_prec) > 0 else 0.0

    # ROUGE-2
    c2 = get_ngrams(cand_tokens, 2)
    r2 = get_ngrams(ref_tokens, 2)
    overlap2 = sum(min(count, r2.get(gram, 0)) for gram, count in c2.items())
    ref2_tot = max(1, len(ref_tokens) - 1)
    cand2_tot = max(1, len(cand_tokens) - 1)
    r2_rec = overlap2 / ref2_tot
    r2_prec = overlap2 / cand2_tot
    f1_2 = (2 * r2_rec * r2_prec) / (r2_rec + r2_prec) if (r2_rec + r2_prec) > 0 else 0.0

    # ROUGE-L
    lcs = lcs_length(cand_tokens, ref_tokens)
    rl_rec = lcs / len(ref_tokens)
    rl_prec = lcs / len(cand_tokens)
    f1_l = (2 * rl_rec * rl_prec) / (rl_rec + rl_prec) if (rl_rec + rl_prec) > 0 else 0.0

    return {
        "rouge1": round(f1_1 * 100.0, 2),
        "rouge2": round(f1_2 * 100.0, 2),
        "rougeL": round(f1_l * 100.0, 2),
    }


def compute_semantic_similarity(candidate: str, reference: str) -> float:
    """Cosine term overlap combined with morphological character n-gram Jaccard."""
    if not candidate or not reference:
        return 0.5

    cand_tokens = tokenize(candidate)
    ref_tokens = tokenize(reference)
    vocab = set(cand_tokens + ref_tokens)
    if not vocab:
        return 1.0

    dot = 0.0
    mag_c = 0.0
    mag_r = 0.0
    for term in vocab:
        c_count = cand_tokens.count(term)
        r_count = ref_tokens.count(term)
        dot += c_count * r_count
        mag_c += c_count * c_count
        mag_r += r_count * r_count

    cosine = dot / (math.sqrt(mag_c) * math.sqrt(mag_r)) if (mag_c > 0 and mag_r > 0) else 0.0

    # Character 3-grams
    def trigrams(s: str) -> set:
        clean = "".join(s.split())
        return {clean[i : i + 3] for i in range(len(clean) - 2)}

    t_c = trigrams(candidate)
    t_r = trigrams(reference)
    inter = len(t_c & t_r)
    union = len(t_c | t_r)
    jaccard = inter / union if union > 0 else 0.0

    combined = 0.65 * cosine + 0.35 * jaccard
    return round(max(0.1, min(1.0, combined)), 3)


def compute_bertscore(candidate: str, reference: str, semantic_sim: float) -> float:
    """Contextual semantic alignment approximation."""
    cand_tokens = tokenize(candidate)
    ref_tokens = tokenize(reference)
    if not cand_tokens or not ref_tokens:
        return 50.0

    base = semantic_sim * 85.0
    len_ratio = min(len(cand_tokens), len(ref_tokens)) / max(len(cand_tokens), len(ref_tokens), 1)
    score = base + len_ratio * 12.0
    return round(max(20.0, min(99.0, score)), 2)
