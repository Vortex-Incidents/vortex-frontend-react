import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, BarChart2, Users, Clock, Layout, CheckCircle, Aperture, Lock, LifeBuoy, User } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [slaRate, setSlaRate] = useState(0);

  // Count up animation
  useEffect(() => {
    let start = 0;
    const end = 99.8;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setSlaRate(end);
        clearInterval(timer);
      } else {
        setSlaRate(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[550px] md:min-h-[650px] flex items-center justify-center bg-dark-900 text-white overflow-hidden py-12 md:py-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-700/20 via-dark-900 to-dark-900 animate-pulse-slow"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-48 h-48 md:w-72 md:h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs md:text-sm font-medium animate-fade-in backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Vortex AI Engine Online
            </div>
            
            <div className="flex justify-center mb-6 animate-slide-up">
                 <Aperture className="w-16 h-16 md:w-20 md:h-20 text-primary-500 animate-spin-slow" />
            </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-primary-500 animate-slide-up leading-tight">
            Vortex Incident
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Secure. Report. <span className="text-primary-500 font-semibold">Resolve.</span>
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up px-4" style={{ animationDelay: '0.15s' }}>
            Next-generation incident management powered by AI. Experience automated triage and guaranteed SLA compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
            <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center group border border-primary-400/20"
            >
              Enter Vortex
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats KPI */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 border-t border-white/5 pt-10 max-w-5xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.5s' }}>
            <div className="p-4 rounded-xl bg-dark-800/30 border border-white/5">
                <p className="text-3xl md:text-4xl font-bold text-white">{slaRate.toFixed(1)}%</p>
                <p className="text-[10px] md:text-xs text-primary-400 uppercase tracking-widest mt-2">SLA Compliance</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/30 border border-white/5">
                <p className="text-3xl md:text-4xl font-bold text-white">24/7</p>
                <p className="text-[10px] md:text-xs text-primary-400 uppercase tracking-widest mt-2">AI Sentinel</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/30 border border-white/5">
                <p className="text-3xl md:text-4xl font-bold text-white">&lt; 15m</p>
                <p className="text-[10px] md:text-xs text-primary-400 uppercase tracking-widest mt-2">Avg Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT 1: Key Features (6 Card Grid) */}
      <section className="py-16 md:py-24 bg-dark-900 border-t border-dark-800 relative overflow-hidden">
        {/* Background glow for this section */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-900/10 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Capabilities</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Everything you need for efficient, secure, and intelligent incident management.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureBox 
                    icon={<Zap className="w-6 h-6" />}
                    title="Rapid Reporting"
                    description="Intuitive interface to report incidents in seconds with all necessary context automatically captured."
                />
                <FeatureBox 
                    icon={<BarChart2 className="w-6 h-6" />}
                    title="Advanced Analytics"
                    description="Complete dashboard with real-time metrics and KPIs to support data-driven decisions."
                />
                <FeatureBox 
                    icon={<Users className="w-6 h-6" />}
                    title="Team Management"
                    description="Smart assignment to the correct technical teams with real-time workload tracking."
                />
                <FeatureBox 
                    icon={<ShieldCheck className="w-6 h-6" />}
                    title="Total Security"
                    description="Role-based access control (RBAC) with end-to-end encryption and automated backups."
                />
                <FeatureBox 
                    icon={<Clock className="w-6 h-6" />}
                    title="Real-Time Updates"
                    description="Instant notifications via WebSocket for status changes and SLA warnings."
                />
                <FeatureBox 
                    icon={<Layout className="w-6 h-6" />}
                    title="User-Centric Design"
                    description="Modern, accessible, and friendly interface that requires zero extensive training."
                />
            </div>
        </div>
      </section>

      {/* CONCEPT 2: Designed for All Roles (3 Cards) */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-800 transition-colors duration-500">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Designed for Every Role</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Specific views and permissions tailored to each need within your organization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Employee Card */}
                <RoleCard 
                    title="Employee"
                    icon={<User className="w-8 h-8" />}
                    description="Easily report incidents and consult the status of your tickets in real-time."
                    features={['Create new incidents', 'View report status', 'Personal history']}
                />

                {/* Support/Technician Card - Highlighted */}
                <div className="relative transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-2xl"></div>
                    <div className="relative h-full p-8 rounded-2xl bg-dark-900 border-2 border-primary-500 shadow-2xl flex flex-col items-center text-center z-10">
                         <div className="p-4 bg-primary-500 rounded-xl mb-6 text-dark-900 shadow-lg shadow-primary-500/40">
                            <LifeBuoy className="w-8 h-8" />
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-4">Support Specialist</h3>
                         <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                            Complete dashboard to manage, diagnose, and resolve assigned incidents efficiently.
                         </p>
                         <ul className="space-y-3 text-left w-full pl-4 mb-8">
                            <li className="flex items-center text-gray-300 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 flex-shrink-0" /> View assigned incidents
                            </li>
                            <li className="flex items-center text-gray-300 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 flex-shrink-0" /> Change statuses & priority
                            </li>
                            <li className="flex items-center text-gray-300 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 flex-shrink-0" /> Task Dashboard
                            </li>
                         </ul>
                    </div>
                </div>

                {/* Administrator Card */}
                <RoleCard 
                    title="Administrator"
                    icon={<Lock className="w-8 h-8" />}
                    description="Total system control with advanced analytics, configuration, and user management."
                    features={['Full Analytics Suite', 'User Management', 'System Configuration']}
                />
            </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components

const FeatureBox: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="p-8 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-700/50 transition duration-300 group">
        <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform shadow-inner shadow-black/20 border border-white/5">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const RoleCard: React.FC<{ title: string, icon: React.ReactNode, description: string, features: string[] }> = ({ title, icon, description, features }) => (
    <div className="h-full p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:shadow-xl dark:hover:shadow-primary-900/10 transition duration-300 flex flex-col items-center text-center">
        <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-xl mb-6 text-gray-600 dark:text-gray-300">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm">
            {description}
        </p>
        <ul className="space-y-3 text-left w-full pl-4 mt-auto">
            {features.map((feat, idx) => (
                <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-500 mr-3 flex-shrink-0" /> {feat}
                </li>
            ))}
        </ul>
    </div>
);

export default Landing;