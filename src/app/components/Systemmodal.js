import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Edit3, Save, Search, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';

export default function SystemPromptModal({ isOpen, onClose }) {
  // Existing system prompt state
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  // New QnA state
  const [activeTab, setActiveTab] = useState('prompt');
  const [qnaItems, setQnaItems] = useState([]);
  const [editingQnA, setEditingQnA] = useState(null);
  const [newQnA, setNewQnA] = useState({ question: '', answer: '' });
  const [showNewQnAForm, setShowNewQnAForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQnA, setFilteredQnA] = useState([]);
  const [error, setError] = useState('');
  
  // Cache to prevent unnecessary API calls
  const [dataLoaded, setDataLoaded] = useState({
    prompt: false,
    qna: false
  });

  // Get auth token once
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  // Base API configuration
  const API_BASE = 'https://api.neurovisesolutions.com/business-service';
  const getHeaders = useCallback((token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), []);

  // Optimized fetch functions with better error handling
  const fetchPrompt = useCallback(async () => {
    if (dataLoaded.prompt) return; // Skip if already loaded
    
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const res = await fetch(`${API_BASE}/system-prompt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const data = await res.json();
      setSystemPrompt(data.system_prompt || '');
      setDataLoaded(prev => ({ ...prev, prompt: true }));
    } catch (err) {
      console.error('Fetch prompt error:', err);
      setError('Failed to load system prompt: ' + err.message);
    }
  }, [dataLoaded.prompt, getAuthToken]);

  const fetchQnaItems = useCallback(async () => {
    if (dataLoaded.qna) return; // Skip if already loaded
    
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const res = await fetch(`${API_BASE}/qna`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const data = await res.json();
      const items = data.qna_items || [];
      setQnaItems(items);
      setFilteredQnA(items);
      setDataLoaded(prev => ({ ...prev, qna: true }));
    } catch (err) {
      console.error('Fetch QnA error:', err);
      setError('Failed to load Q&A items: ' + err.message);
    }
  }, [dataLoaded.qna, getAuthToken]);

  // Load both datasets in parallel when modal opens
  const loadInitialData = useCallback(async () => {
    setInitialLoading(true);
    setError('');
    
    try {
      // Load both prompt and QnA data in parallel
      await Promise.all([
        fetchPrompt(),
        fetchQnaItems()
      ]);
    } catch (err) {
      console.error('Initial data load error:', err);
      setError('Failed to load initial data');
    } finally {
      setInitialLoading(false);
    }
  }, [fetchPrompt, fetchQnaItems]);

  const handleSavePrompt = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/system-prompt`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ system_prompt: systemPrompt }),
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      console.log('Save successful');
      setError('');
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save system prompt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async () => {
    if (!confirm('Are you sure you want to delete the system prompt?')) return;
    
    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/system-prompt`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      setSystemPrompt('');
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete system prompt: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQnA = async () => {
    if (!newQnA.question.trim() || !newQnA.answer.trim()) {
      setError('Both question and answer are required');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/qna`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(newQnA),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      setNewQnA({ question: '', answer: '' });
      setShowNewQnAForm(false);
      setError('');
      
      // Force refresh QnA data
      setDataLoaded(prev => ({ ...prev, qna: false }));
      await fetchQnaItems();
    } catch (error) {
      console.error('Create QnA error:', error);
      setError('Failed to create Q&A item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQnA = async (qnaId, updatedData) => {
    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/qna/${qnaId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      setEditingQnA(null);
      setError('');
      
      // Force refresh QnA data
      setDataLoaded(prev => ({ ...prev, qna: false }));
      await fetchQnaItems();
    } catch (error) {
      console.error('Update QnA error:', error);
      setError('Failed to update Q&A item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQnA = async (qnaId) => {
    if (!confirm('Are you sure you want to delete this Q&A item?')) return;

    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/qna/${qnaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      setError('');
      
      // Force refresh QnA data
      setDataLoaded(prev => ({ ...prev, qna: false }));
      await fetchQnaItems();
    } catch (error) {
      console.error('Delete QnA error:', error);
      setError('Failed to delete Q&A item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllQnA = async () => {
    if (!confirm('Are you sure you want to delete ALL Q&A items? This action cannot be undone.')) return;

    const token = getAuthToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/qna`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      setError('');
      
      // Force refresh QnA data
      setDataLoaded(prev => ({ ...prev, qna: false }));
      await fetchQnaItems();
    } catch (error) {
      console.error('Delete all QnA error:', error);
      setError('Failed to delete all Q&A items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredQnA(qnaItems);
      return;
    }
    
    const filtered = qnaItems.filter(item =>
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredQnA(filtered);
  };

  // Reset state when modal closes
  const handleClose = () => {
    setError('');
    setSearchQuery('');
    setShowNewQnAForm(false);
    setEditingQnA(null);
    setNewQnA({ question: '', answer: '' });
    onClose();
  };

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && !initialLoading) {
      loadInitialData();
    }
  }, [isOpen, loadInitialData, initialLoading]);

  // Reset data cache when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDataLoaded({ prompt: false, qna: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed text-black inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 transition-opacity">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'prompt' ? ' Edit System Prompt' : '  Manage Q&A Knowledge'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Initial Loading State */}
        {initialLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-gray-600">Loading data...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!initialLoading && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('prompt')}
                className={`px-6 py-3 font-medium transition flex items-center gap-2 ${
                  activeTab === 'prompt'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                System Prompt
              </button>
              <button
                onClick={() => setActiveTab('qna')}
                className={`px-6 py-3 font-medium transition flex items-center gap-2 ${
                  activeTab === 'qna'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Q&A Knowledge ({qnaItems.length})
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'prompt' ? (
                /* System Prompt Tab */
                <div className="p-6 space-y-6">
                  <textarea
                    value={systemPrompt || ''}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Write your system prompt here..."
                    className="w-full h-64 p-4 text-base font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition resize-none bg-white text-slate-900"
                  />

                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
                    <button
                      onClick={handleDeletePrompt}
                      className="w-full sm:w-auto px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🗑'}
                      Delete
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleClose}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition disabled:opacity-50"
                        disabled={loading}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSavePrompt}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾'}
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* QnA Tab */
                <div className="p-6 space-y-6">
                  {/* Search and Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search questions and answers..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewQnAForm(!showNewQnAForm)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Q&A
                      </button>
                      {qnaItems.length > 0 && (
                        <button
                          onClick={handleDeleteAllQnA}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Delete All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New QnA Form */}
                  {showNewQnAForm && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                      <h3 className="font-semibold text-gray-900">Add New Q&A</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={newQnA.question}
                            onChange={(e) => setNewQnA({...newQnA, question: e.target.value})}
                            placeholder="Enter your question..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                          <textarea
                            value={newQnA.answer}
                            onChange={(e) => setNewQnA({...newQnA, answer: e.target.value})}
                            placeholder="Enter the answer..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateQnA}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Q&A
                          </button>
                          <button
                            onClick={() => {
                              setShowNewQnAForm(false);
                              setNewQnA({ question: '', answer: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QnA Items List */}
                  <div className="space-y-4">
                    {filteredQnA.length === 0 ? (
                      <div className="text-center py-12">
                        {qnaItems.length === 0 ? (
                          <div>
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Q&A items yet</h3>
                            <p className="text-gray-500 mb-4">Start building your knowledge base by adding questions and answers.</p>
                            <button
                              onClick={() => setShowNewQnAForm(true)}
                              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                              Add Your First Q&A
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-500">Try adjusting your search query.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      filteredQnA.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                          {editingQnA === item.id ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                <input
                                  type="text"
                                  defaultValue={item.question}
                                  id={`edit-question-${item.id}`}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                                <textarea
                                  defaultValue={item.answer}
                                  id={`edit-answer-${item.id}`}
                                  rows={3}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const question = document.getElementById(`edit-question-${item.id}`).value;
                                    const answer = document.getElementById(`edit-answer-${item.id}`).value;
                                    handleUpdateQnA(item.id, { question, answer });
                                  }}
                                  disabled={loading}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm disabled:opacity-50 flex items-center gap-1"
                                >
                                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingQnA(null)}
                                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span className="text-sm font-medium text-emerald-700">Question</span>
                                  </div>
                                  <p className="text-gray-900 font-medium mb-3">{item.question}</p>
                                  
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full"></span>
                                    <span className="text-sm font-medium text-teal-700">Answer</span>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => setEditingQnA(item.id)}
                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                    title="Edit Q&A"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQnA(item.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete Q&A"
                                    disabled={loading}
                                  >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                                <span>Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* QnA Tab Footer Actions */}
                  {qnaItems.length > 0 && (
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        Showing {filteredQnA.length} of {qnaItems.length} Q&A items
                      </span>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}