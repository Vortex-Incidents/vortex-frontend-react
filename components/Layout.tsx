import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Bell, LogOut, Aperture, Menu, X, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

interface LayoutProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ theme, toggleTheme }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Mock Notifications for Layout Demo
    const unreadCount = 1;

    // Handle Click Outside for Notifications
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Or loading spinner

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 transition-colors duration-500">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 cursor-pointer group z-50">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary-500 rounded-full opacity-20 group-hover:opacity-40 animate-pulse"></div>
                            <Aperture className="text-primary-600 dark:text-primary-500 w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                                Vortex <span className="text-primary-500">Incident</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.role === 'employee' && (
                                <>
                                    <Link to="/employee" className={`hover:text-primary-500 transition ${location.pathname === '/employee' ? 'text-primary-500' : ''}`}>Dashboard</Link>
                                    <Link to="/employee/create" className={`hover:text-primary-500 transition ${location.pathname === '/employee/create' ? 'text-primary-500' : ''}`}>New Incident</Link>
                                </>
                            )}
                            {user.role === 'support' && (
                                <Link to="/support" className={`hover:text-primary-500 transition ${location.pathname === '/support' ? 'text-primary-500' : ''}`}>Ticket Board</Link>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className={`hover:text-primary-500 transition ${location.pathname === '/admin' ? 'text-primary-500' : ''}`}>Admin Dashboard</Link>
                                    <span className="text-xs px-2 py-1 bg-primary-500/10 text-primary-500 rounded border border-primary-500/20">Admin</span>
                                </>
                            )}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-dark-700">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                            {/* Notification Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition outline-none">
                                    <Bell size={20} />
                                    {unreadCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold animate-pulse">{unreadCount}</span>}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden z-50 animate-fade-in origin-top-right ring-1 ring-black/5">
                                        <div className="p-4 text-center text-sm text-gray-500">No new notifications in this demo layout.</div>
                                    </div>
                                )}
                            </div>

                            <Link to="/profile" className="p-1 rounded-full hover:ring-2 hover:ring-primary-500 transition">
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-dark-600" />
                            </Link>
                            <button onClick={handleLogout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center space-x-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full">
                <Outlet />
            </main>

            <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 py-8 transition-colors duration-500">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2024 Vortex Incident. Intelligent Security & Reporting.</p>
                </div>
            </footer>

            <Chatbot />
        </div>
    );
};

export default Layout;
