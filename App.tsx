import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, Aperture, Menu, X } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CreateIncident from './pages/CreateIncident';
import SupportDashboard from './pages/SupportDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Chatbot from './components/Chatbot';
import IncidentModal from './components/IncidentModal';
import { ThemeToggle } from './components/ThemeToggle';
import { User, Role, Incident } from './types';
import { getIncidentById } from './services/incidentService';

// Simple mocked user for initial state
const INITIAL_USER: User = {
  name: "Alex Morgan",
  email: "alex.m@vortex.com",
  role: "guest",
  avatar: "https://picsum.photos/200/200"
};

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  type: 'info' | 'alert';
  incidentId?: string;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [view, setView] = useState<string>('landing');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Incident Modal State
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [incidentRefreshKey, setIncidentRefreshKey] = useState(0); // Trigger to reload dashboard data

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Weekly Report', description: 'New incident report available', time: '1 hour ago', isUnread: true, type: 'info' },
    { id: 2, title: 'SLA Breached', description: 'Incident INC-2001 exceeded SLA', time: '3 hours ago', isUnread: true, type: 'alert', incidentId: 'INC-2001' }
  ]);

  const notifRef = useRef<HTMLDivElement>(null);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.toggle('dark', true);
    }
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogin = (role: Role) => {
    setUser({ ...INITIAL_USER, role });
    setView(role === 'admin' ? 'admin' : role === 'support' ? 'support' : 'employee');
  };

  const logout = () => {
    setUser({ ...INITIAL_USER, role: 'guest' });
    setView('landing');
    setIsMobileMenuOpen(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (notif.incidentId) {
      setSelectedIncidentId(notif.incidentId);
      setShowNotifications(false);
    }
    // Mark specific as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));
  };

  const handleOpenIncident = (id: string) => {
    setSelectedIncidentId(id);
  };

  const handleCloseIncident = () => {
    setSelectedIncidentId(null);
  };

  const handleIncidentUpdate = () => {
    // Increment key to force dashboards to re-fetch data
    setIncidentRefreshKey(prev => prev + 1);
  };

  const handleNavClick = (target: string) => {
    setView(target);
    setIsMobileMenuOpen(false);
  }

  const unreadCount = notifications.filter(n => n.isUnread).length;

  // --- Router Logic ---
  const renderView = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
      case 'employee': return <EmployeeDashboard onCreate={() => setView('create')} onIncidentClick={handleOpenIncident} refreshKey={incidentRefreshKey} />;
      case 'create': return <CreateIncident onBack={() => setView('employee')} />;
      case 'support': return <SupportDashboard onIncidentClick={handleOpenIncident} refreshKey={incidentRefreshKey} />;
      case 'admin': return <AdminDashboard onIncidentClick={handleOpenIncident} refreshKey={incidentRefreshKey} />;
      case 'profile': return <Profile user={user} onThemeToggle={toggleTheme} theme={theme} />;
      case 'feedback': return <Feedback />;
      default: return <Landing onStart={() => setView('login')} />;
    }
  };

  // --- Layout Wrappers ---
  const showHeader = view !== 'feedback' && view !== 'login';

  // Fetch current incident object for modal
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      if (selectedIncidentId) {
        const data = await getIncidentById(selectedIncidentId);
        setActiveIncident(data || null);
      } else {
        setActiveIncident(null);
      }
    };
    fetchActive();
  }, [selectedIncidentId, incidentRefreshKey]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 transition-colors duration-500">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group z-50"
              onClick={() => handleNavClick(user.role === 'guest' ? 'landing' : user.role === 'admin' ? 'admin' : user.role === 'support' ? 'support' : 'employee')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-500 rounded-full opacity-20 group-hover:opacity-40 animate-pulse"></div>
                <Aperture className="text-primary-600 dark:text-primary-500 w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                  Vortex <span className="text-primary-500">Incident</span>
                </span>
                <span className="hidden sm:block text-[10px] tracking-widest uppercase text-gray-500 dark:text-gray-400 font-semibold">
                  Secure. Report. Resolve.
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {user.role !== 'guest' && (
                <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <button onClick={() => setView(user.role === 'admin' ? 'admin' : user.role === 'support' ? 'support' : 'employee')} className={`hover:text-primary-500 transition ${view.includes('dashboard') || view === 'employee' || view === 'support' || view === 'admin' ? 'text-primary-500' : ''}`}>
                    Dashboard
                  </button>
                  {user.role === 'employee' && (
                    <button onClick={() => setView('create')} className={`hover:text-primary-500 transition ${view === 'create' ? 'text-primary-500' : ''}`}>
                      New Incident
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <span className="text-xs px-2 py-1 bg-primary-500/10 text-primary-500 rounded border border-primary-500/20">Admin</span>
                  )}
                </nav>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-dark-700">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                {user.role !== 'guest' ? (
                  <>
                    {/* Notification Dropdown */}
                    <div className="relative" ref={notifRef}>
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition outline-none"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden z-50 animate-fade-in origin-top-right ring-1 ring-black/5">
                          <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50/50 dark:bg-dark-900/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                              <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-500 font-medium transition">
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                            ) : (
                              notifications.map(notif => (
                                <div
                                  key={notif.id}
                                  onClick={() => handleNotificationClick(notif)}
                                  className={`p-4 border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition relative cursor-pointer ${notif.isUnread ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                                >
                                  {notif.isUnread && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div>}
                                  <h4 className={`text-sm font-medium mb-1 ${notif.type === 'alert' ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                    {notif.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{notif.description}</p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{notif.time}</span>
                                    {notif.incidentId && <span className="text-[10px] text-primary-500 border border-primary-500/20 px-1.5 rounded bg-primary-500/5">View Details</span>}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button onClick={() => setView('profile')} className="p-1 rounded-full hover:ring-2 hover:ring-primary-500 transition">
                      <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-dark-600" />
                    </button>

                    <button onClick={logout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition" title="Logout">
                      <LogOut size={20} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setView('login')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-primary-500 transition">
                    Log In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex md:hidden items-center space-x-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 shadow-xl animate-fade-in z-30">
              <div className="p-4 space-y-4">
                {user.role !== 'guest' ? (
                  <>
                    <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100 dark:border-dark-700" onClick={() => handleNavClick('profile')}>
                      <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-600" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button onClick={() => handleNavClick(user.role === 'admin' ? 'admin' : user.role === 'support' ? 'support' : 'employee')} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-200 font-medium">
                      Dashboard
                    </button>
                    {user.role === 'employee' && (
                      <button onClick={() => handleNavClick('create')} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-200 font-medium">
                        New Incident
                      </button>
                    )}

                    <div className="pt-2 border-t border-gray-100 dark:border-dark-700">
                      <button onClick={() => { setShowNotifications(!showNotifications); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-200 font-medium">
                        <span>Notifications</span>
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                      </button>
                      <button onClick={logout} className="w-full text-left py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium flex items-center mt-2">
                        <LogOut size={18} className="mr-2" /> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => handleNavClick('login')} className="block w-full text-center py-3 bg-primary-600 text-white rounded-lg font-bold shadow-lg">
                    Log In
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full">
        {renderView()}
      </main>

      {/* Footer (Hide on Feedback & Login page) */}
      {view !== 'feedback' && view !== 'login' && (
        <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 py-8 transition-colors duration-500">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Vortex Incident. Intelligent Security & Reporting.</p>
          </div>
        </footer>
      )}

      {/* Global Incident Modal */}
      <IncidentModal
        incident={activeIncident}
        isOpen={!!selectedIncidentId}
        onClose={handleCloseIncident}
        userRole={user.role}
        onUpdate={handleIncidentUpdate}
      />

      {/* IVA Chatbot */}
      {user.role !== 'guest' && view !== 'login' && <Chatbot />}
    </div>
  );
};

export default App;