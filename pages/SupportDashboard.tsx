import React, { useEffect, useState } from 'react';
import { Kanban, CheckCircle, Clock, AlertTriangle, Filter, Search, MoreHorizontal } from 'lucide-react';
import { Incident, Status } from '../types';
import { getIncidentsByRole, updateIncidentStatus } from '../services/incidentService';
import toast from 'react-hot-toast';

const SupportDashboard: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getIncidentsByRole('support');
            setIncidents(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load ticket board.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusChange = async (id: string, newStatus: Status) => {
        try {
            await updateIncidentStatus(id, newStatus);
            toast.success(`Ticket status updated to ${newStatus}`);
            loadData(); // Refresh
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredIncidents = filterStatus === 'All'
        ? incidents
        : incidents.filter(i => i.status === filterStatus);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Board</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and resolve incoming incidents.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <button onClick={() => loadData()} className="p-2 bg-gray-100 dark:bg-dark-800 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700">
                        <Search size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">Loading Board...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIncidents.map(incident => (
                        <div key={incident.id} className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-md transition p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${incident.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                        incident.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {incident.priority}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{incident.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{incident.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-700">
                                <div className="text-xs text-gray-400">{new Date(incident.createdAt).toLocaleDateString()}</div>
                                <div className="flex gap-2">
                                    {incident.status !== 'Resolved' && (
                                        <button
                                            onClick={() => handleStatusChange(incident.id, 'Resolved')}
                                            className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded hover:bg-green-100 transition"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    {incident.status === 'Open' && (
                                        <button
                                            onClick={() => handleStatusChange(incident.id, 'In Progress')}
                                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition"
                                        >
                                            Start
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportDashboard;