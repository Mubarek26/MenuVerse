import React from 'react';
import { Sun, Moon, Globe, ShoppingCart, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onCartToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { items } = useCart();
  const [specialNotice, setSpecialNotice] = useState<string | null>(null);

  // minimal markdown -> HTML: bold (**text**), italic (*text*), links [text](url), line breaks
  const renderMarkdown = (md: string) => {
    if (!md) return '';
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br/>');
    return html;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/settings`);
        if (!res.ok) return;
        const data = await res.json();
        const notice = data?.data?.settings?.special_notice;
        if (notice) setSpecialNotice(notice);
      } catch (err) {
        // ignore
      }
    };
    fetchSettings();
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      {specialNotice ? (
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-300 dark:from-yellow-700 dark:to-orange-600 text-yellow-900 dark:text-yellow-50 rounded-xl shadow-md p-3 animate-slide-down">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.2)" />
                  <path d="M12 22V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 text-sm font-medium leading-tight text-white dark:text-white" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.15)' }}>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(specialNotice) }} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open('/help', '_blank')}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-sm text-white"
                >
                  Learn more
                </button>
                <button
                  onClick={() => setSpecialNotice(null)}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  aria-label="Dismiss notice"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div> */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('appTitle')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/*check order status*/}
            <button
              aria-label="Check order status"
              onClick={() => window.dispatchEvent(new Event("openCheckOrderModal"))}
              className="p-2 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 transition-colors"
              title="Check order status"
            >
              <Search className="w-5 h-5 text-teal-600" />
            </button>
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