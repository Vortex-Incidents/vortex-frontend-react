import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { classifyIncident } from '../services/geminiService';
import { Priority } from '../types';

interface CreateIncidentProps {
  onBack: () => void;
}

const CreateIncident: React.FC<CreateIncidentProps> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // AI State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiClassification, setAiClassification] = useState<{ priority: Priority; category: string; reasoning: string } | null>(null);

  // Debounce effect for AI classification
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (title.length > 5 && description.length > 10) {
        setIsAnalysing(true);
        const result = await classifyIncident(title, description);
        setAiClassification(result);
        setIsAnalysing(false);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [title, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Incident Created! (Simulation)");
    onBack();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition">
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
        </button>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Report New Incident</h1>
                {isAnalysing && (
                    <div className="flex items-center text-primary-600 text-sm animate-pulse">
                        <Sparkles size={16} className="mr-2" />
                        AI Analysis in progress...
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject / Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                        placeholder="e.g., Cannot access CRM system"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detailed Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition h-32"
                        placeholder="Please describe what happened, error codes, and urgency..."
                        required
                    />
                </div>

                {/* AI Classification Result Area */}
                <div className={`p-4 rounded-xl border transition-all duration-500 ${
                    aiClassification 
                    ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 opacity-100 translate-y-0' 
                    : 'bg-gray-50 border-gray-100 dark:bg-dark-700 dark:border-dark-600 opacity-50'
                }`}>
                    <div className="flex items-center mb-2">
                        <Sparkles className={`w-4 h-4 mr-2 ${aiClassification ? 'text-primary-600' : 'text-gray-400'}`} />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Automated Triage</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <span className="text-xs text-gray-500 uppercase">Suggested Priority</span>
                            {isAnalysing ? (
                                <div className="h-6 w-20 bg-gray-200 dark:bg-dark-600 rounded animate-pulse mt-1"></div>
                            ) : (
                                <div className={`mt-1 font-bold ${
                                    aiClassification?.priority === 'Critical' ? 'text-red-600' : 
                                    aiClassification?.priority === 'High' ? 'text-orange-600' : 'text-blue-600'
                                }`}>
                                    {aiClassification?.priority || '---'}
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase">Category</span>
                            {isAnalysing ? (
                                <div className="h-6 w-24 bg-gray-200 dark:bg-dark-600 rounded animate-pulse mt-1"></div>
                            ) : (
                                <div className="mt-1 font-bold text-gray-800 dark:text-gray-200">
                                    {aiClassification?.category || '---'}
                                </div>
                            )}
                        </div>
                    </div>
                    {aiClassification && (
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-white/5 pt-2">
                            Reasoning: {aiClassification.reasoning}
                        </p>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-primary-600/30 transition transform hover:-translate-y-0.5"
                    >
                        Submit Incident
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CreateIncident;