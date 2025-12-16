import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { getIncidentsByRole } from '../services/incidentService';
import { getUsersApi } from '../services/userService';
import { Incident } from '../types';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, highPriority: 0 });
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data needed for admin view
                const [incidentData, userData] = await Promise.all([
                    getIncidentsByRole('admin'),
                    getUsersApi()
                ]);

                setIncidents(incidentData);

                // Calculate Stats client-side for now (Senior Refactor would use /stats endpoint)
                setStats({
                    total: incidentData.length,
                    open: incidentData.filter(i => i.status === 'Open').length,
                    resolved: incidentData.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
                    highPriority: incidentData.filter(i => i.priority === 'High' || i.priority === 'Critical').length
                });

            } catch (e) {
                console.error(e);
                toast.error("Failed to load Admin Dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="p-10 text-center">Loading Admin Analytics...</div>;

    const chartData = [
        { name: 'Open', value: stats.open },
        { name: 'Resolved', value: stats.resolved },
        { name: 'High Priority', value: stats.highPriority },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Executive Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <AdminCard title="Total Incidents" value={stats.total} icon={<Activity />} color="text-blue-500" />
                <AdminCard title="Open Issues" value={stats.open} icon={<AlertTriangle />} color="text-amber-500" />
                <AdminCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="text-green-500" />
                <AdminCard title="Critical/High" value={stats.highPriority} icon={<AlertTriangle />} color="text-red-500" />
            </div>

            {/* Charts Section */}
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm h-96">
                <h3 className="text-lg font-semibold mb-6 dark:text-white">Incident Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const AdminCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
        </div>
        <div className={`p-3 bg-gray-50 dark:bg-dark-700 rounded-lg ${color}`}>{icon}</div>
    </div>
);

export default AdminDashboard;