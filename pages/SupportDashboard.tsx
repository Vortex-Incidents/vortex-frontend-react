import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Eye } from 'lucide-react';
import { Incident } from '../types';
import { getIncidentsByRole } from '../services/incidentService';

// Helper to determine SLA Status Color
const getSLAStatus = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    if (diff < 0) return 'breached';
    if (diff < 3600000) return 'risk'; // Less than 1 hour
    return 'safe';
};

interface SupportDashboardProps {
    onIncidentClick: (id: string) => void;
    refreshKey: number;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ onIncidentClick, refreshKey }) => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [filterSLA, setFilterSLA] = useState<'all' | 'risk' | 'breached'>('all');

    useEffect(() => {
        setIncidents(getIncidentsByRole('support'));
    }, [refreshKey]);

    const filteredIncidents = incidents.filter(inc => {
        const sla = getSLAStatus(inc.slaDeadline);
        if (filterSLA === 'risk') return sla === 'risk';
        if (filterSLA === 'breached') return sla === 'breached';
        return true;
    });

    // KPI Calcs
    const assigned = incidents.length;
    const breached = incidents.filter(i => getSLAStatus(i.slaDeadline) === 'breached' && i.status !== 'Resolved' && i.status !== 'Closed').length;
    const risk = incidents.filter(i => getSLAStatus(i.slaDeadline) === 'risk' && i.status !== 'Resolved' && i.status !== 'Closed').length;
    const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Technician Workspace</h1>

        {/* Workload Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <p className="text-sm text-gray-500">Total Incidents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{assigned}</p>
            </div>
            <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <p className="text-sm text-gray-500">SLA Breached</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{breached}</p>
            </div>
            <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <p className="text-sm text-gray-500">SLA At Risk</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">{risk}</p>
            </div>
            <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{resolved}</p>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search incidents..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button 
                    onClick={() => setFilterSLA('all')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${filterSLA === 'all' ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilterSLA('risk')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center ${filterSLA === 'risk' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'}`}
                >
                    <AlertTriangle size={14} className="mr-2" />
                    At Risk
                </button>
                <button 
                    onClick={() => setFilterSLA('breached')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center ${filterSLA === 'breached' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'}`}
                >
                    <AlertTriangle size={14} className="mr-2" />
                    Breached
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-gray-50 dark:bg-dark-700/50 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">SLA</th>
                            <th className="px-6 py-4">ID / Priority</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                        {filteredIncidents.map((inc) => {
                             const slaStatus = getSLAStatus(inc.slaDeadline);
                             const isCompleted = inc.status === 'Resolved' || inc.status === 'Closed';
                             return (
                                <tr key={inc.id} onClick={() => onIncidentClick(inc.id)} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className={`w-3 h-3 rounded-full ${
                                            isCompleted ? 'bg-gray-300 dark:bg-gray-600' :
                                            slaStatus === 'breached' ? 'bg-red-500 animate-pulse' :
                                            slaStatus === 'risk' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} title={isCompleted ? 'Completed' : slaStatus.toUpperCase()}></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{inc.id}</div>
                                        <span className={`text-xs ${inc.priority === 'Critical' ? 'text-red-500' : 'text-gray-500'}`}>{inc.priority}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800 dark:text-gray-200">{inc.title}</div>
                                        <div className="text-xs truncate max-w-xs opacity-75">{inc.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            inc.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                            inc.status === 'Open' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                            'bg-blue-100 text-blue-800'
                                         }`}>
                                             {inc.status}
                                         </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {inc.slaDeadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        <div className="text-gray-400">{inc.slaDeadline.toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-600 hover:text-primary-500 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default SupportDashboard;