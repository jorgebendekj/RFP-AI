"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', displayName: 'Eng', flag: '🇬🇧' },
  { code: 'es', name: 'Español', displayName: 'Es', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', displayName: 'Polish', flag: '🇵🇱' },
];

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('preferred_language') || 'en';
    setCurrentLang(saved);
    // Apply to document
    document.documentElement.lang = saved;
  }, []);

  const switchLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('preferred_language', langCode);
    document.documentElement.lang = langCode;
    setIsOpen(false);
    
    // Reload to apply translations
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
        aria-label="Change language"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">{currentLanguage.flag} {currentLanguage.name}</span>
        </div>
        <svg 
          className={`w-4 h-4 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          strokeWidth="2" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentLang === lang.code ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                </div>
                {currentLang === lang.code && (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


