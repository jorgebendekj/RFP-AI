/**
 * Detect language from text content using AI
 * This uses OpenAI to detect the language of the document
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    // Take a sample of the text (first 1000 characters) for detection
    const sample = text.substring(0, 1000);

    const response = await fetch('/api/ai/detect-language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: sample }),
    });

    if (!response.ok) {
      console.error('Language detection failed');
      return 'en'; // Default to English
    }

    const data = await response.json();
    return data.language || 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English on error
  }
}

/**
 * Simple language detection based on character patterns
 * This is a fallback method for quick detection without API calls
 */
export function detectLanguageSimple(text: string): string {
  const sample = text.toLowerCase().substring(0, 500);

  // Polish-specific characters
  const polishChars = /[ąćęłńóśźż]/;
  if (polishChars.test(sample)) {
    return 'pl';
  }

  // Spanish-specific characters and common words
  const spanishChars = /[áéíóúñü]/;
  const spanishWords = /\b(el|la|los|las|un|una|de|del|para|por|con|sin|que|como|más|muy)\b/;
  if (spanishChars.test(sample) || spanishWords.test(sample)) {
    return 'es';
  }

  // Default to English
  return 'en';
}

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    pl: 'Polish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
  };

  return languages[code] || 'Unknown';
}

/**
 * Get language-specific prompt instructions for AI
 */
export function getLanguageInstructions(language: string): string {
  const instructions: Record<string, string> = {
    en: 'Generate the content in English.',
    es: 'Genera el contenido en español. Utiliza un lenguaje profesional y formal apropiado para propuestas de licitación.',
    pl: 'Wygeneruj treść w języku polskim. Używaj profesjonalnego i formalnego języka odpowiedniego dla ofert przetargowych.',
    fr: 'Générez le contenu en français.',
    de: 'Generieren Sie den Inhalt auf Deutsch.',
    it: 'Genera il contenuto in italiano.',
    pt: 'Gere o conteúdo em português.',
  };

  return instructions[language] || instructions.en;
}



