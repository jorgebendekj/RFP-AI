'use client';

import { useEffect, useState } from 'react';

export function useClientTranslations() {
  const [messages, setMessages] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      const savedLocale = localStorage.getItem('preferred_language') || 'en';
      setLocale(savedLocale);
      
      try {
        const msgs = await import(`../../messages/${savedLocale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        try {
          const msgs = await import(`../../messages/en.json`);
          setMessages(msgs.default);
        } catch (fallbackError) {
          console.error('Failed to load English fallback:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();

    // Listen for storage changes (when language is changed in another tab or component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferred_language' && e.newValue) {
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || defaultValue || key;
  };

  return { t, locale, isLoading };
}


