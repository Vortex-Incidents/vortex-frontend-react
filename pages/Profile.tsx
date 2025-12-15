import React, { useState } from 'react';
import { User, Lock, Mail, Moon, Sun, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

const Profile: React.FC<ProfileProps> = ({ user, onThemeToggle, theme }) => {
    const [simulatedPassword, setSimulatedPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
            <div className="h-32 bg-primary-600 relative">
                <div className="absolute -bottom-12 left-8">
                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-dark-800" />
                </div>
            </div>
            
            <div className="pt-16 px-8 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium capitalize flex items-center">
                        <Shield size={14} className="mr-1" />
                        {user.role}
                    </span>
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-dark-700 pt-8 space-y-8">
                    
                    {/* Theme Preference */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900/50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                {theme === 'light' ? <Sun className="text-orange-500" /> : <Moon className="text-blue-400" />}
                                <span className="text-gray-700 dark:text-gray-300">Interface Theme</span>
                            </div>
                            <button onClick={onThemeToggle} className="text-sm text-primary-600 font-medium hover:underline">
                                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                            </button>
                        </div>
                    </div>

                    {/* Security (Simulated) */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="password" 
                                        value={simulatedPassword}
                                        onChange={(e) => setSimulatedPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            
                            {/* Added Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition mt-2">
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