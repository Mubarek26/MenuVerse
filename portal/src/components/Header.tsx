import React from 'react';
import { Sun, Moon, Globe, ShoppingCart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { items } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('appTitle')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={theme === 'light' ? t('darkMode') : t('lightMode')}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                {language}
              </span>
            </button>

            <button
              onClick={onCartToggle}
              className={`relative p-2 rounded-lg bg-gradient-to-br from-teal-100 to-transparent dark:from-teal-900/30 hover:scale-105 transform transition-all ${
                itemCount > 0 ? 'animate-pulse-slow' : ''
              }`}
              aria-label="Toggle cart"
            >
              <ShoppingCart className="w-5 h-5 text-teal-700 dark:text-teal-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;