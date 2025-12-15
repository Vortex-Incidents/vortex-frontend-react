import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 flex items-center bg-gray-200 dark:bg-dark-700 rounded-full p-1 cursor-pointer transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 dark:border-dark-600 shadow-inner"
      aria-label="Toggle Theme"
    >
      <div
        className={`bg-white dark:bg-primary-500 w-6 h-6 rounded-full shadow-md transform duration-500 cubic-bezier(0.4, 0.0, 0.2, 1) flex items-center justify-center z-10 ${
          theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon size={14} className="text-white fill-current" />
        ) : (
          <Sun size={14} className="text-orange-500 fill-current" />
        )}
      </div>
      
      {/* Background Icons for context */}
      <Sun size={12} className="absolute left-2.5 text-gray-400 dark:text-gray-600 opacity-100 transition-opacity" />
      <Moon size={12} className="absolute right-2.5 text-gray-400 dark:text-gray-600 opacity-100 transition-opacity" />
    </button>
  );
};
