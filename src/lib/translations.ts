// Client-side translation helper
export async function getTranslations(locale: string = 'en') {
  try {
    const messages = await import(`../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    // Fallback to English
    const messages = await import(`../../messages/en.json`);
    return messages.default;
  }
}

export function getCurrentLocale(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('preferred_language') || 'en';
}

export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}


