import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import datasetItems from '../data/dataset.json';
import { DatasetItem } from '../types';

interface DatasetExplorerViewProps {
  onSelectForLab: (item: DatasetItem) => void;
}

export const DatasetExplorerView: React.FC<DatasetExplorerViewProps> = ({ onSelectForLab }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    'all',
    'everyday conversation',
    'professional communication',
    'customer support',
    'social media',
    'education',
    'technology',
    'travel',
    'food',
    'business',
    'idioms',
    'humor',
    'formal communication',
    'festivals',
    'cultural references',
  ];

  const filtered = datasetItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;
    if (selectedLanguage !== 'all') {
      const matchDir = `${item.source_language}->${item.target_language}`;
      if (matchDir !== selectedLanguage) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.source_text.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.cultural_context.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(datasetItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'linguaguard_105_dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Curated Multilingual Benchmark Dataset</span>
              <span aria-hidden="true">·</span>
              <span>105 High-Fidelity Test Pairs</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Indic Multilingual Evaluation Dataset Explorer
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Curated test cases across 12 domains covering tricky linguistic nuances: Devanagari honorifics,
              idiomatic proverbs, Indian numbering scales (Lakhs/Crores), and natural Hinglish code-switching.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Dataset (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search source, reference, context..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Language Direction */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="all">All Directions</option>
              <option value="en->hi">English → Hindi</option>
              <option value="hi->en">Hindi → English</option>
              <option value="en->hinglish">English → Hinglish</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 capitalize"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filtered.length}</strong> of {datasetItems.length} curated examples
          </span>
          {(search || selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedDifficulty !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setSelectedDifficulty('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Dataset Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-900">{item.id}</span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="uppercase font-semibold text-indigo-700">
                    {item.source_language} → {item.target_language}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{item.difficulty}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    Source Text
                  </span>
                  <p className="text-slate-900 font-medium font-sans">{item.source_text}</p>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    Gold Reference
                  </span>
                  <p className="text-slate-800 font-sans">{item.reference}</p>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">Cultural Context: </span>
                {item.cultural_context}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 capitalize">{item.category}</span>
              <button
                type="button"
                onClick={() => onSelectForLab(item as any)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Test in Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
