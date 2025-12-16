import React, { useState } from 'react';
import { Aperture, Lock, Mail, ArrowRight, Shield, User as UserIcon, LifeBuoy } from 'lucide-react';
import { Role } from '../types';
import { loginApi } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Default credentials for easier testing
    const [email, setEmail] = useState('admin@vortex.com');
    const [password, setPassword] = useState('password123');
    const [selectedRole, setSelectedRole] = useState<Role>('employee'); // Just for visual demo in UI
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { token, role, user } = await loginApi(email, password);
            login(token, { ...user, role }); // Update Context

            // Redirect based on role
            if (role === 'admin') navigate('/admin');
            else if (role === 'support') navigate('/support');
            else navigate('/employee');

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login Failed. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex animate-fade-in bg-gray-50 dark:bg-dark-900 transition-colors duration-500">
            {/* Left: Branding & Art */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-dark-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-900/40 via-dark-900 to-dark-900 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-2xl">
                        <Aperture className="w-10 h-10 text-primary-500 animate-spin-slow" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Vortex Incident</h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        "Security isn't just about protection. It's about resilience, response, and resolution."
                    </p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access the Vortex Core.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    placeholder="admin@vortex.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} className="ml-2" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
