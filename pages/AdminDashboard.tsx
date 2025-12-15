import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ThumbsUp, Activity, Settings, List, Plus, X, Search, User, Shield, Lock, Eye, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { getIncidentsByRole } from '../services/incidentService';
import { Incident } from '../types';

interface AdminDashboardProps {
    onIncidentClick: (id: string) => void;
    refreshKey: number;
}

// --- MOCK DATA FOR ANALYTICS ---
const PRIORITY_DATA = [
  { name: 'Critical', value: 11, color: '#ef4444' }, // Red
  { name: 'High', value: 38, color: '#f97316' },     // Orange
  { name: 'Medium', value: 62, color: '#eab308' },   // Yellow
  { name: 'Low', value: 45, color: '#3b82f6' },      // Blue
];

const CATEGORY_DATA = [
  { name: 'Hardware', value: 32 },
  { name: 'Software', value: 58 },
  { name: 'Network', value: 28 },
  { name: 'Security', value: 15 },
  { name: 'Access', value: 18 },
];

const ACTIVITY_DATA = [
    { day: 'Mon', incidents: 12 },
    { day: 'Tue', incidents: 19 },
    { day: 'Wed', incidents: 15 },
    { day: 'Thu', incidents: 22 },
    { day: 'Fri', incidents: 28 },
    { day: 'Sat', incidents: 8 },
    { day: 'Sun', incidents: 5 },
];

// Mock Data for Users
interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'Employee' | 'Support' | 'Admin';
    status: 'Active' | 'Inactive';
    registered: string;
}
const INITIAL_USERS: UserData[] = [
    { id: 'USR-001', name: 'Juan Pérez', email: 'empleado1@empresa.com', role: 'Employee', status: 'Active', registered: '10 Jan 2024' },
    { id: 'USR-002', name: 'María González', email: 'soporte@empresa.com', role: 'Support', status: 'Active', registered: '05 Jan 2024' },
    { id: 'USR-003', name: 'Carlos López', email: 'admin@empresa.com', role: 'Admin', status: 'Active', registered: '01 Jan 2024' },
    { id: 'USR-004', name: 'Ana Martínez', email: 'empleado2@empresa.com', role: 'Employee', status: 'Active', registered: '15 Feb 2024' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onIncidentClick, refreshKey }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'operations' | 'users' | 'settings'>('analytics');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  
  // Create User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee' });

  // Load incidents for Operations tab
  useEffect(() => {
    // Admin sees all
    setIncidents(getIncidentsByRole('admin'));
  }, [refreshKey, activeTab]);

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      const user: UserData = {
          id: `USR-00${users.length + 1}`,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as any,
          status: 'Active',
          registered: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setUsers([...users, user]);
      setShowUserModal(false);
      setNewUser({ name: '', email: '', role: 'Employee' });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in min-h-screen max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
                <p className="text-gray-500 dark:text-gray-400">System configuration and detailed analytics.</p>
            </div>
            
            {/* Tab Navigation - Larger Buttons, Scrollable on mobile */}
            <div className="w-full md:w-auto bg-white dark:bg-dark-800 p-1.5 rounded-xl shadow-md border border-gray-200 dark:border-dark-700 flex space-x-2 overflow-x-auto no-scrollbar">
                <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Activity size={20} />} label="Analytics" />
                <TabButton active={activeTab === 'operations'} onClick={() => setActiveTab('operations')} icon={<List size={20} />} label="Operations" />
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20} />} label="Users" />
                <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Config" />
            </div>
        </div>

        {/* --- VIEW: ANALYTICS --- */}
        {activeTab === 'analytics' && (
            <div className="animate-slide-up space-y-6">
                
                {/* Row 1: Hero Cards (SLA & CSAT) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SLA Compliance */}
                    <div className="bg-white dark:bg-dark-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield size={100} className="text-primary-500" />
                        </div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500"><Shield size={24} /></div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">SLA Compliance</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">Percentage of incidents resolved within SLA</p>
                        
                        <div className="flex items-end space-x-4 mb-4">
                            <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">87.3%</span>
                            <span className="text-sm font-medium text-green-500 mb-2 flex items-center bg-green-500/10 px-2 py-1 rounded">
                                <TrendingUp size={14} className="mr-1" /> +2.5%
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-gray-100 dark:bg-dark-700 rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: '87.3%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mb-8">
                            <span>Goal: 85%</span>
                            <span className="text-primary-500 font-semibold">Target Reached</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-4 rounded-xl">
                                <span className="text-xs text-green-700 dark:text-green-400 uppercase font-bold">Within SLA</span>
                                <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 mt-1">136</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl">
                                <span className="text-xs text-red-700 dark:text-red-400 uppercase font-bold">Breached</span>
                                <p className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-400 mt-1">20</p>
                            </div>
                        </div>
                    </div>

                    {/* CSAT Score */}
                    <div className="bg-white dark:bg-dark-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ThumbsUp size={100} className="text-yellow-500" />
                        </div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><ThumbsUp size={24} /></div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Average CSAT</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">Customer satisfaction score</p>
                        
                        <div className="flex items-end space-x-4 mb-4">
                            <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">4.2</span>
                            <span className="text-2xl text-gray-400 mb-1">/ 5.0</span>
                            <span className="text-sm font-medium text-green-500 mb-2 flex items-center bg-green-500/10 px-2 py-1 rounded">
                                <TrendingUp size={14} className="mr-1" /> +0.3
                            </span>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex space-x-1 mb-8">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-6 text-yellow-500 fill-current"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>)}
                            <div className="w-6 h-6 text-gray-300 dark:text-gray-600 fill-current"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                        </div>

                        {/* Distribution Bars */}
                        <div className="flex items-end justify-between h-24 gap-1 md:gap-2">
                            {[
                                { s: 5, v: 32, h: '60%' }, 
                                { s: 4, v: 14, h: '30%' }, 
                                { s: 3, v: 29, h: '50%' }, 
                                { s: 2, v: 24, h: '45%' }, 
                                { s: 1, v: 37, h: '70%' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full bg-gray-100 dark:bg-dark-700 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                        <div 
                                            className={`w-full transition-all duration-1000 ${
                                                item.s >= 4 ? 'bg-green-500' : 
                                                item.s === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} 
                                            style={{ height: item.h }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-2 font-bold whitespace-nowrap">★ {item.s}</span>
                                    <span className="hidden sm:inline text-[10px] text-gray-400">{item.v}</span>
                                </div>
                            ))}
                        </div>
                         <p className="text-center text-xs text-gray-500 mt-4">Based on 136 responses</p>
                    </div>
                </div>

                {/* Row 2: Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard 
                        label="Total Incidents" value="156" sub="Last 30 days" 
                        icon={<FileText size={20} />} color="text-gray-600 dark:text-gray-300" bg="bg-gray-100 dark:bg-dark-700" 
                        trend="+12.5%" trendColor="text-green-500"
                    />
                    <DashboardCard 
                        label="Open" value="23" sub="Requires attention" 
                        icon={<Clock size={20} />} color="text-amber-600 dark:text-amber-500" bg="bg-amber-100 dark:bg-amber-900/20" 
                        trend="Active" trendColor="text-amber-500"
                    />
                    <DashboardCard 
                        label="Resolved" value="133" sub="Resolution rate" 
                        icon={<CheckCircle size={20} />} color="text-green-600 dark:text-green-500" bg="bg-green-100 dark:bg-green-900/20" 
                        trend="85.3%" trendColor="text-green-500"
                    />
                    <DashboardCard 
                        label="Avg Resolution" value="4.2h" sub="Average time" 
                        icon={<Activity size={20} />} color="text-blue-600 dark:text-blue-500" bg="bg-blue-100 dark:bg-blue-900/20" 
                        trend="Target < 5h" trendColor="text-blue-500"
                    />
                </div>

                {/* Row 3: Horizontal Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribution by Priority */}
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                            <AlertTriangle size={18} className="mr-2 text-primary-500" /> Distribution by Priority
                         </h3>
                         <p className="text-sm text-gray-500 mb-6">Incidents classified by urgency level.</p>
                         
                         <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PRIORITY_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                    <XAxis type="number" stroke="#888" fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={60} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ backgroundColor: '#0A1A2F', border: '1px solid #233554', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {PRIORITY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Distribution by Category */}
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                            <List size={18} className="mr-2 text-primary-500" /> Distribution by Category
                         </h3>
                         <p className="text-sm text-gray-500 mb-6">Incidents by affected system type.</p>
                         
                         <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CATEGORY_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                    <XAxis type="number" stroke="#888" fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={11} width={60} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ backgroundColor: '#0A1A2F', border: '1px solid #233554', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                </div>

                {/* Row 4: Recent Activity */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Activity size={18} className="mr-2 text-primary-500" /> Recent Activity
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">Number of incidents reported in the last 7 days.</p>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ACTIVITY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6', opacity: 0.1}}
                                    contentStyle={{ backgroundColor: '#0A1A2F', border: '1px solid #233554', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="incidents" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* --- VIEW: OPERATIONS (TECHNICIAN VIEW) --- */}
        {activeTab === 'operations' && (
            <div className="animate-slide-up">
                 <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global Incident List</h2>
                         <div className="relative w-full md:w-64">
                             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                             <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 outline-none" />
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
                                    <th className="px-6 py-4">Assignee</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                                {incidents.map((inc) => (
                                    <tr key={inc.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition cursor-pointer" onClick={() => onIncidentClick(inc.id)}>
                                        <td className="px-6 py-4 font-bold dark:text-white">{inc.id}</td>
                                        <td className="px-6 py-4">{inc.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                inc.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                inc.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {inc.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white">{inc.status}</td>
                                        <td className="px-6 py-4">{inc.assignedTo || 'Unassigned'}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-primary-600 hover:text-primary-500 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- VIEW: USERS --- */}
        {activeTab === 'users' && (
            <div className="animate-slide-up">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-dark-900/50 gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                <Users size={20} className="mr-2 text-primary-500" /> User Management
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Manage system access and roles.</p>
                        </div>
                        <button 
                            onClick={() => setShowUserModal(true)}
                            className="w-full md:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium flex items-center justify-center shadow-lg shadow-primary-500/20 transition"
                        >
                            <Plus size={16} className="mr-2" /> Add User
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                         <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap md:whitespace-normal">
                             <thead className="bg-gray-100 dark:bg-dark-700/50 uppercase text-xs font-semibold">
                                 <tr>
                                     <th className="px-6 py-4">User</th>
                                     <th className="px-6 py-4">Role</th>
                                     <th className="px-6 py-4">Status</th>
                                     <th className="px-6 py-4">Registered</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                                 {users.map(u => (
                                     <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition">
                                         <td className="px-6 py-4">
                                             <div className="flex items-center">
                                                 <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-dark-700 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 flex-shrink-0">
                                                     {u.name.charAt(0)}
                                                 </div>
                                                 <div>
                                                     <p className="font-semibold text-gray-900 dark:text-white">{u.name} <span className="ml-2 text-[10px] text-gray-400 border border-gray-200 dark:border-dark-600 px-1 rounded">{u.id}</span></p>
                                                     <p className="text-xs">{u.email}</p>
                                                 </div>
                                             </div>
                                         </td>
                                         <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                                u.role === 'Admin' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30' :
                                                u.role === 'Support' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/30' :
                                                'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/30'
                                            }`}>
                                                {u.role}
                                            </span>
                                         </td>
                                         <td className="px-6 py-4">
                                             <span className="text-green-600 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                                {u.status}
                                             </span>
                                         </td>
                                         <td className="px-6 py-4">{u.registered}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UserStatCard label="Total Users" value={users.length.toString()} icon={<Users />} />
                    <UserStatCard label="Employees" value={users.filter(u => u.role === 'Employee').length.toString()} icon={<User />} />
                    <UserStatCard label="Support Staff" value={users.filter(u => u.role === 'Support').length.toString()} icon={<Shield />} />
                </div>
            </div>
        )}

        {/* --- VIEW: SETTINGS --- */}
        {activeTab === 'settings' && (
            <div className="animate-slide-up max-w-4xl mx-auto">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 p-8">
                     <div className="flex items-center mb-6 text-primary-600">
                         <Settings className="mr-2" />
                         <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Configuration</h2>
                     </div>
                     <p className="text-gray-500 mb-8 pb-4 border-b border-gray-100 dark:border-dark-700">Adjust global system parameters and thresholds.</p>

                     <div className="space-y-6">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                             <input type="text" defaultValue="Vortex Enterprise" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                         
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Email</label>
                             <input type="email" defaultValue="alerts@vortex-inc.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>

                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">SLA Thresholds (Hours)</label>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <span className="text-xs text-red-500 font-bold uppercase mb-1 block">Critical</span>
                                     <input type="number" defaultValue="2" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white" />
                                 </div>
                                 <div>
                                     <span className="text-xs text-orange-500 font-bold uppercase mb-1 block">High</span>
                                     <input type="number" defaultValue="8" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white" />
                                 </div>
                                 <div>
                                     <span className="text-xs text-blue-500 font-bold uppercase mb-1 block">Medium</span>
                                     <input type="number" defaultValue="24" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white" />
                                 </div>
                                 <div>
                                     <span className="text-xs text-gray-500 font-bold uppercase mb-1 block">Low</span>
                                     <input type="number" defaultValue="72" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white" />
                                 </div>
                             </div>
                         </div>

                         <div className="pt-6 border-t border-gray-100 dark:border-dark-700">
                             <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/20 transition w-full md:w-auto">
                                 Save Configuration
                             </button>
                         </div>
                     </div>
                </div>
            </div>
        )}

        {/* Create User Modal */}
        {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 w-full max-w-md overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New User</h3>
                        <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-white outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input 
                                required
                                type="email" 
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-white outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="user@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <select 
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-white outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Employee">Employee</option>
                                <option value="Support">Support</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-bold shadow-lg">Create User</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

// --- Helper Components ---

const DashboardCard: React.FC<{ label: string, value: string, sub: string, icon: React.ReactNode, bg: string, color: string, trend: string, trendColor: string }> = ({ label, value, sub, icon, bg, color, trend, trendColor }) => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-50 dark:bg-dark-900 ${trendColor}`}>
                {trend}
            </span>
        </div>
        <div>
            <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h4>
            <div className="flex justify-between items-end">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex-none md:flex-1 flex items-center justify-center py-3 px-6 text-base font-semibold rounded-lg transition-all whitespace-nowrap ${
            active 
            ? 'bg-primary-600 text-white shadow-md' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
        }`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </button>
);

const UserStatCard: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded-lg">
            {icon}
        </div>
    </div>
);

export default AdminDashboard;