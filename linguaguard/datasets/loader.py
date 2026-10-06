"""
Dataset loader for 105 starter items
"""
import json
import os
from typing import List, Dict, Any


def load_dataset() -> List[Dict[str, Any]]:
    path = os.path.join(os.path.dirname(__file__), "dataset.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_dataset_stats() -> Dict[str, Any]:
    data = load_dataset()
    categories = {}
    for item in data:
        cat = item.get("category", "other")
        categories[cat] = categories.get(cat, 0) + 1
    return {
        "total_items": len(data),
        "categories": categories,
    }
