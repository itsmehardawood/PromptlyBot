'use client';

import { useState } from 'react';
import { Loader2, X, Sparkles, Check, Edit3 } from 'lucide-react';

export default function PromptOptimizer({ currentPrompt, onApplyImproved }) {
  const [isLoading, setIsLoading] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [editingPreview, setEditingPreview] = useState(false);

  const handleOptimize = async () => {
    if (!currentPrompt || !currentPrompt.trim()) {
      setError('Please enter a system prompt before optimizing');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed with status ${response.status}`);
      }

      const data = await response.json();
      setImprovedPrompt(data.improvedPrompt);
      setShowPreview(true);
      setEditingPreview(false);
    } catch (err) {
      setError(`Optimization failed: ${err.message}`);
      console.error('Optimize prompt error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApplyImproved(improvedPrompt);
    setShowPreview(false);
    setImprovedPrompt('');
  };

  const handleEditPreview = (value) => {
    setImprovedPrompt(value);
  };

  return (
    <>
      {/* Optimize Button */}
      <button
        onClick={handleOptimize}
        disabled={isLoading || !currentPrompt?.trim()}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? 'Optimizing...' : 'AI Tailor Prompt'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError('')}
            className="text-rose-300 hover:text-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-purple-950/30">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">
                    Improved System Prompt
                  </h3>
                  <p className="text-xs text-slate-400">
                    AI-enhanced version ready for review
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 transition hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6">
              {editingPreview ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Edit Before Applying
                    </label>
                    <textarea
                      value={improvedPrompt}
                      onChange={(e) => handleEditPreview(e.target.value)}
                      className="h-64 w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-100 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Preview
                    </p>
                    <div className="min-h-64 max-h-64 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                        {improvedPrompt}
                      </p>
                    </div>
                  </div>

                  {/* Comparison Note */}
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                    <p className="text-xs text-blue-200">
                      💡 <strong>Tip:</strong> Review the improved version. If you
                      want to make adjustments before applying, click &quot;Edit&quot;.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4">
              <button
                onClick={() => setEditingPreview(!editingPreview)}
                className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                <Edit3 className="h-4 w-4" />
                {editingPreview ? 'Preview' : 'Edit'}
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-500"
              >
                <Check className="h-4 w-4" />
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
