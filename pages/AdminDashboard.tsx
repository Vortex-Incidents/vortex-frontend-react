import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, AlertTriangle, CheckCircle, Shield, Clock, Settings, UserPlus, Plus, Mail, Save, Search } from 'lucide-react';
import { getIncidentsByRole } from '../services/incidentService';
import { getUsersApi } from '../services/userService';
import { Incident, User } from '../types';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, highPriority: 0 });
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // 1. Fetch Incidents
            try {
                const incidentData = await getIncidentsByRole('admin');
                setIncidents(incidentData);
                setStats({
                    total: incidentData.length,
                    open: incidentData.filter(i => i.status === 'Open').length,
                    resolved: incidentData.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
                    highPriority: incidentData.filter(i => i.priority === 'High' || i.priority === 'Critical').length
                });
            } catch (e) {
                console.error("Failed to load incidents", e);
                toast.error("Could not load incident statistics.");
            }

            // 2. Fetch Users
            try {
                const userData = await getUsersApi();
                setUsers(userData);
            } catch (e) {
                console.warn("Failed to load users list", e);
                // Mock users if API fails for demo visual stability
                setUsers([
                    { id: '1', name: 'Juan Pérez', email: 'empleado1@empresa.com', role: 'employee', avatar: '', specialty: 'General' },
                    { id: '2', name: 'María González', email: 'soporte@empresa.com', role: 'support', avatar: '', specialty: 'Network' },
                    { id: '3', name: 'Carlos López', email: 'admin@empresa.com', role: 'admin', avatar: '', specialty: 'SysAdmin' },
                    { id: '4', name: 'Ana Martinez', email: 'empleado2@empresa.com', role: 'employee', avatar: '', specialty: 'General' },
                ] as any);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="p-10 text-center text-white">Loading Admin Analytics...</div>;

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1600px] animate-fade-in bg-slate-50 dark:bg-[#0B1120] min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">System configuration and detailed analytics.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 mt-4 md:mt-0 shadow-sm">
                    <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Activity size={16} />}>Analytics</TabButton>
                    <TabButton active={activeTab === 'operations'} onClick={() => setActiveTab('operations')} icon={<Shield size={16} />}>Operations</TabButton>
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={16} />}>Users</TabButton>
                    <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={16} />}>Config</TabButton>
                </div>
            </div>

            {/* View Content */}
            {activeTab === 'analytics' && <AnalyticsView incidents={incidents} stats={stats} />}
            {activeTab === 'users' && <UsersView users={users} />}
            {activeTab === 'config' && <ConfigView />}
            {activeTab === 'operations' && <OperationsView />}
        </div>
    );
};

// --- SUB-VIEWS ---

const OperationsView = () => {
    // Mock Data for Operations
    const systemHealth = [
        { name: 'API Gateway', status: 'operational', uptime: '99.99%', latency: '45ms' },
        { name: 'Auth Service', status: 'operational', uptime: '99.95%', latency: '120ms' },
        { name: 'Incident Engine', status: 'degraded', uptime: '98.50%', latency: '350ms' },
        { name: 'Notification Service', status: 'operational', uptime: '99.99%', latency: '80ms' },
        { name: 'Database Primary', status: 'operational', uptime: '100%', latency: '12ms' },
    ];

    const systemLogs = [
        { id: 101, time: '10:42 AM', level: 'Error', source: 'Incident Engine', message: 'Connection timeout contacting AI Service' },
        { id: 102, time: '10:40 AM', level: 'Info', source: 'Auth Service', message: 'User batch import completed successfully' },
        { id: 103, time: '10:35 AM', level: 'Warning', source: 'Database', message: 'High memory usage detected (85%)' },
        { id: 104, time: '10:30 AM', level: 'Info', source: 'System', message: 'Daily backup routine started' },
        { id: 105, time: '10:15 AM', level: 'Info', source: 'API Gateway', message: 'Rate limit rules updated' },
    ];

    return (
        <div className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">System Status</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Operational</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        All systems normal
                    </div>
                </div>

                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response Time</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">124ms</h3>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Active Sessions</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,248</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-500 font-medium">+12% from last hour</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Service Health Table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#151e32] rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white">Service Health API</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Service</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Uptime</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Latency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {systemHealth.map((service, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">{service.name}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${service.status === 'operational' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                {service.status === 'operational' ? 'Operational' : 'Degraded'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">{service.uptime}</td>
                                        <td className="p-4 text-slate-500 text-sm font-mono">{service.latency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Server Resources */}
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Server Resources</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 dark:text-slate-400">Total CPU Usage</span>
                                <span className="font-bold text-slate-900 dark:text-white">45%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 dark:text-slate-400">Memory Allocation</span>
                                <span className="font-bold text-slate-900 dark:text-white">62%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: '62%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 dark:text-slate-400">Disk I/O</span>
                                <span className="font-bold text-slate-900 dark:text-white">28%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '28%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Last updated</span>
                            <span className="text-slate-900 dark:text-white font-medium">Just now</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">System Logs</h3>
                    <button className="text-xs text-primary-500 hover:text-primary-400 font-medium">View All Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="p-4 font-semibold text-slate-500">Timestamp</th>
                                <th className="p-4 font-semibold text-slate-500">Level</th>
                                <th className="p-4 font-semibold text-slate-500">Source</th>
                                <th className="p-4 font-semibold text-slate-500">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {systemLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{log.time}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.level === 'Error' ? 'bg-red-500/10 text-red-500' :
                                            log.level === 'Warning' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-900 dark:text-white font-medium">{log.source}</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-300">{log.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AnalyticsView = ({ incidents, stats }: any) => {
    // Dynamic Data Logic
    const priorityData = [
        { name: 'Critical', value: incidents.filter((i: any) => i.priority === 'Critical').length, color: '#EF4444' },
        { name: 'High', value: incidents.filter((i: any) => i.priority === 'High').length, color: '#F97316' },
        { name: 'Medium', value: incidents.filter((i: any) => i.priority === 'Medium').length, color: '#EAB308' },
        { name: 'Low', value: incidents.filter((i: any) => i.priority === 'Low').length, color: '#3B82F6' },
    ];

    const categoryData = [
        { name: 'Hardware', value: incidents.filter((i: any) => i.category === 'Hardware').length },
        { name: 'Software', value: incidents.filter((i: any) => i.category === 'Software').length },
        { name: 'Network', value: incidents.filter((i: any) => i.category === 'Network').length },
        { name: 'Security', value: incidents.filter((i: any) => i.category === 'Security').length },
        { name: 'Access', value: incidents.filter((i: any) => i.category === 'Access').length },
    ];

    const activityData = [
        { name: 'Mon', value: 12 }, { name: 'Tue', value: 19 }, { name: 'Wed', value: 15 },
        { name: 'Thu', value: 22 }, { name: 'Fri', value: 30 }, { name: 'Sat', value: 8 }, { name: 'Sun', value: 5 }
    ];

    return (
        <>
            {/* Top Row: SLA & CSAT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* SLA Card */}
                <div className="bg-white dark:bg-[#151e32] rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                        <Shield className="w-32 h-32 text-primary-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">SLA Compliance</h3>
                    </div>

                    <div className="mb-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Percentage of incidents resolved within SLA</span>
                    </div>
                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-bold text-slate-900 dark:text-white">87.3%</span>
                        <span className="mb-2 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">+2.5%</span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: '87.3%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium mt-6">
                        <div className="bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20 w-[48%]">
                            <span className="block text-green-500 mb-1">WITHIN SLA</span>
                            <span className="text-xl font-bold text-green-400">136</span>
                        </div>
                        <div className="bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 w-[48%]">
                            <span className="block text-red-500 mb-1">BREACHED</span>
                            <span className="text-xl font-bold text-red-400">20</span>
                        </div>
                    </div>
                </div>

                {/* CSAT Card */}
                <div className="bg-white dark:bg-[#151e32] rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                        <Users className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Average CSAT</h3>
                    </div>

                    <div className="mb-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Customer satisfaction score</span>
                    </div>
                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-bold text-slate-900 dark:text-white">4.2</span>
                        <span className="text-xl text-slate-400 mb-1 font-medium">/ 5.0</span>
                        <span className="mb-2 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">+0.3</span>
                    </div>
                    <div className="flex gap-1 mb-8">
                        {[1, 2, 3, 4].map(i => <Users key={i} size={20} className="text-amber-400 fill-amber-400" />)}
                        <Users size={20} className="text-slate-600" />
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center text-xs text-slate-500">
                        {['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'].map((label, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="h-16 w-1.5 bg-slate-700/50 rounded-full relative mb-1">
                                    <div className="absolute bottom-0 w-full bg-amber-500 rounded-full" style={{ height: `${[60, 40, 30, 10, 5][idx]}%` }}></div>
                                </div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Row: KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KPICard title="Total Incidents" value={stats.total} subvalue="+12.5%" label="Last 30 days" icon={<Activity size={20} />} color="text-indigo-400" bg="bg-indigo-500/10" trend="up" />
                <KPICard title="Open" value={stats.open} subvalue="Active" label="Requires attention" icon={<Clock size={20} />} color="text-amber-400" bg="bg-amber-500/10" trend="neutral" />
                <KPICard title="Resolved" value={stats.resolved} subvalue="85.3%" label="Resolution rate" icon={<CheckCircle size={20} />} color="text-emerald-400" bg="bg-emerald-500/10" trend="up" />
                <KPICard title="Avg Resolution" value="4.2h" subvalue="Target < 5h" label="Average time" icon={<Activity size={20} />} color="text-blue-400" bg="bg-blue-500/10" trend="down" />
            </div>

            {/* Bottom Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Priority Chart */}
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm h-96 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Distribution by Priority</h3>
                    </div>
                    {/* Explicit style height to fix Recharts width(-1) error */}
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={priorityData} margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {priorityData.map((entry: any, index: number) => (
                                        <cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Chart */}
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm h-96 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Distribution by Category</h3>
                    </div>
                    {/* Explicit style height to fix Recharts width(-1) error */}
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={categoryData} margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                <Bar dataKey="value" fill="#F43F5E" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm h-96">
                <div className="flex items-center gap-2 mb-6">
                    <Activity size={18} className="text-blue-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                </div>
                <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData} barSize={30}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                            <Bar dataKey="value" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

const UsersView = ({ users }: { users: User[] }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users size={20} className="text-primary-500" />
                        User Management
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system access and roles.</p>
                </div>
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-cyan-500/25">
                    <UserPlus size={18} />
                    Add User
                </button>
            </div>

            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                                                {user.avatar ? <img src={user.avatar} className="w-10 h-10 rounded-full" /> : (user.name?.charAt(0) || 'U')}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white">{user.name || 'Unknown User'}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{user.email} <span className="ml-1 opacity-50 border border-slate-500 rounded px-1 text-[10px]">ID: {user.id}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            user.role === 'support' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {user.role === 'admin' ? 'Admin' : user.role === 'support' ? 'Support' : 'Employee'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                        10 Jan 2024
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                        <Users size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Employees</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.role === 'employee').length}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                        <Users size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Support Staff</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.role !== 'employee').length}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                        <Shield size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const ConfigView = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Settings size={20} className="text-primary-500" />
                        System Configuration
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Adjust global system parameters and thresholds.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Organization Name</label>
                            <input type="text" defaultValue="Vortex Enterprise" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Notification Email</label>
                            <input type="email" defaultValue="alerts@vortex-inc.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">SLA Thresholds (Hours)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] font-bold text-red-500 uppercase block mb-1">Critical</span>
                                <input type="number" defaultValue="2" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-orange-500 uppercase block mb-1">High</span>
                                <input type="number" defaultValue="8" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-yellow-500 uppercase block mb-1">Medium</span>
                                <input type="number" defaultValue="24" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-blue-500 uppercase block mb-1">Low</span>
                                <input type="number" defaultValue="72" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg shadow-red-500/25">
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ children, active, onClick, icon }: { children: React.ReactNode, active?: boolean, onClick?: () => void, icon?: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${active ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
    >
        {icon}
        {children}
    </button>
);

const KPICard = ({ title, value, subvalue, label, icon, color, bg, trend }: any) => (
    <div className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-lg ${bg} ${color}`}>
                {icon}
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${trend === 'up' ? 'bg-green-500/10 text-green-500' : trend === 'down' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {subvalue}
            </span>
        </div>
        <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{title}</p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400">{label}</span>
        </div>
    </div>
);

export default AdminDashboard;