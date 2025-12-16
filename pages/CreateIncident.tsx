import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { createIncident } from '../services/incidentService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateIncidentProps {
    onBack?: () => void; // Optional if passed via prop, but we prefer navigate
}

const CreateIncident: React.FC<CreateIncidentProps> = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Software');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createIncident({
                title,
                description,
                priority: priority as any,
                category,
                status: 'Open'
            });
            toast.success('Incident reported successfully!');
            navigate('/employee'); // Go back to dashboard using Router
        } catch (error) {
            console.error(error);
            toast.error('Failed to create incident.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
            <button
                onClick={() => navigate('/employee')}
                className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-700/50">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <AlertCircle className="mr-3 text-primary-500" /> New Incident Report
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject / Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                            placeholder="e.g., Cannot access VPN"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                            >
                                <option>Software</option>
                                <option>Hardware</option>
                                <option>Network</option>
                                <option>Security</option>
                                <option>Access</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            required
                            rows={5}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                            placeholder="Please describe the issue in detail..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg shadow-lg hover:shadow-primary-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                        >
                            {loading ? 'Submitting...' : <><Save size={20} className="mr-2" /> Submit Report</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIncident;