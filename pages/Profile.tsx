import React, { useState } from 'react';
import { User, Mail, Shield, Key, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
    // Props no longer needed from App.tsx, but keeping signature flexible or using Context
    user?: any;
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ theme, onThemeToggle }) => {
    const { user } = useAuth(); // Use context instead of props

    // Local state for forms
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!user) return <div>Loading Profile...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar / Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 text-center shadow-sm">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-50 dark:border-dark-700"
                        />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wide rounded-full">
                            {user.role}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Mail size={18} className="mr-3 text-gray-400" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Shield size={18} className="mr-3 text-gray-400" />
                                <span className="text-sm capitalize">{user.role} Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Monitor size={20} className="mr-2" /> Appearance
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Interface Theme</span>
                            <button
                                onClick={onThemeToggle}
                                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition"
                            >
                                {theme === 'dark' ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Key size={20} className="mr-2" /> Security
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg shadow transition">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;