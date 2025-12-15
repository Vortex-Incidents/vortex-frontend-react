import React, { useState } from 'react';
import { Aperture, Lock, Mail, ArrowRight, Shield, User as UserIcon, LifeBuoy } from 'lucide-react';
import { Role } from '../types';

interface LoginProps {
  onLogin: (role: Role) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('employee');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin(selectedRole);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex animate-fade-in bg-gray-50 dark:bg-dark-900 transition-colors duration-500">
      
      {/* Left: Branding & Art */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-dark-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-900/40 via-dark-900 to-dark-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-2xl">
             <Aperture className="w-10 h-10 text-primary-500 animate-spin-slow" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Vortex Incident</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            "Security isn't just about protection. It's about resilience, response, and resolution."
          </p>
          <div className="mt-12 flex justify-center gap-4">
             <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
             <div className="h-1 w-2 bg-gray-700 rounded-full"></div>
             <div className="h-1 w-2 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <button onClick={onBack} className="absolute top-8 left-8 text-gray-500 hover:text-primary-600 transition flex items-center text-sm font-medium">
            <ArrowRight className="rotate-180 mr-2" size={16} /> Back to Home
        </button>

        <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                     <Aperture className="w-12 h-12 text-primary-600 dark:text-primary-500" />
                </div>
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
                            placeholder="name@company.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <a href="#" className="text-xs text-primary-600 hover:text-primary-500 font-medium">Forgot password?</a>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm"
                        />
                    </div>
                </div>

                {/* Role Simulator for Demo */}
                <div className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-dashed border-gray-300 dark:border-dark-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-3 text-center tracking-widest">Select Demo Role</p>
                    <div className="grid grid-cols-3 gap-2">
                        <RoleButton 
                            role="employee" 
                            current={selectedRole} 
                            onClick={() => setSelectedRole('employee')} 
                            icon={<UserIcon size={16} />} 
                        />
                        <RoleButton 
                            role="support" 
                            current={selectedRole} 
                            onClick={() => setSelectedRole('support')} 
                            icon={<LifeBuoy size={16} />} 
                        />
                        <RoleButton 
                            role="admin" 
                            current={selectedRole} 
                            onClick={() => setSelectedRole('admin')} 
                            icon={<Shield size={16} />} 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 disabled:cursor-wait"
                >
                    {loading ? (
                        <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                             Authenticating...
                        </>
                    ) : (
                        <>Sign In <ArrowRight size={18} className="ml-2" /></>
                    )}
                </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Protected by Vortex AI Defense System v2.5
            </p>
        </div>
      </div>
    </div>
  );
};

const RoleButton: React.FC<{ role: Role, current: Role, onClick: () => void, icon: React.ReactNode }> = ({ role, current, onClick, icon }) => (
    <button 
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
            current === role 
                ? 'bg-white dark:bg-dark-700 border-primary-500 text-primary-600 dark:text-primary-400 shadow-md ring-1 ring-primary-500' 
                : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400'
        }`}
    >
        {icon}
        <span className="text-xs font-medium mt-1 capitalize">{role}</span>
    </button>
);

export default Login;
