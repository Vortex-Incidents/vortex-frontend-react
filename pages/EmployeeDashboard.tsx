import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, FileText, Activity, Plus, AlertCircle } from 'lucide-react';
import { Incident } from '../types';
import { getIncidentsByRole } from '../services/incidentService';

interface EmployeeDashboardProps {
    onCreate: () => void;
    onIncidentClick: (id: string) => void;
    refreshKey: number;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onCreate, onIncidentClick, refreshKey }) => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getIncidentsByRole('employee');
                setIncidents(data);
            } catch (err) {
                console.error("Failed to load incidents", err);
            }
        };
        loadData();
    }, [refreshKey]);

    const total = incidents.length;
    const pending = incidents.filter(i => i.status === 'Open').length;
    const inProgress = incidents.filter(i => i.status === 'In Progress').length;
    const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in max-w-6xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, Alex</h1>
                <p className="text-gray-500 dark:text-gray-400">Employee Dashboard - Manage your reports and check status.</p>
            </div>

            {/* 1. Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DashboardCard
                    label="Total"
                    value={total.toString()}
                    icon={<FileText size={24} />}
                    iconBg="bg-gray-100 dark:bg-white/5"
                    iconColor="text-gray-600 dark:text-gray-300"
                />
                <DashboardCard
                    label="Pending"
                    value={pending.toString()}
                    icon={<Clock size={24} />}
                    iconBg="bg-amber-100 dark:bg-amber-900/20"
                    iconColor="text-amber-600 dark:text-amber-500"
                />
                <DashboardCard
                    label="In Progress"
                    value={inProgress.toString()}
                    icon={<Activity size={24} />}
                    iconBg="bg-blue-100 dark:bg-blue-900/20"
                    iconColor="text-blue-600 dark:text-blue-500"
                />
                <DashboardCard
                    label="Resolved"
                    value={resolved.toString()}
                    icon={<CheckCircle size={24} />}
                    iconBg="bg-green-100 dark:bg-green-900/20"
                    iconColor="text-green-600 dark:text-green-500"
                />
            </div>

            {/* 2. Action Banner */}
            <div className="mb-8 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report New Incident</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-sm md:text-base">
                            Create a new incident report, service request, or hardware issue. Vortex AI will automatically triage your request.
                        </p>
                    </div>
                    <button
                        onClick={onCreate}
                        className="w-full md:w-auto flex-shrink-0 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-primary-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <Plus size={20} className="mr-2" />
                        New Report
                    </button>
                </div>
            </div>

            {/* 3. My Reports List */}
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <AlertCircle size={20} className="text-primary-500" />
                        <h2 className="text-lg font-semibold dark:text-white">My Reports</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap md:whitespace-normal">
                        <thead className="bg-gray-50 dark:bg-dark-700/50 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">SLA Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                            {incidents.map((inc) => (
                                <tr
                                    key={inc.id}
                                    onClick={() => onIncidentClick(inc.id)}
                                    className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium dark:text-gray-200">{inc.id}</td>
                                    <td className="px-6 py-4">{inc.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium 
                                        ${inc.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                inc.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            {inc.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 dark:text-white">
                                        <span className={`inline-flex items-center ${inc.status === 'Resolved' || inc.status === 'Closed' ? 'text-green-500' :
                                                inc.status === 'In Progress' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {inc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {inc.slaDeadline.toLocaleDateString()} {inc.slaDeadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DashboardCard: React.FC<{ label: string, value: string, icon: React.ReactNode, iconBg: string, iconColor: string }> = ({ label, value, icon, iconBg, iconColor }) => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 flex items-center justify-between shadow-sm hover:shadow-md transition duration-300">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${iconBg} ${iconColor}`}>
            {icon}
        </div>
    </div>
);

export default EmployeeDashboard;