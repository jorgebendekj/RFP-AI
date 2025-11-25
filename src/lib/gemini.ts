import { GoogleGenAI } from "@google/genai";

// Use environment variable or fallback to the provided key
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDqSt4P7-czHQsTJ_gJwpOIgTqHpmNMmU4";

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set.");
}

// Initialize the client
export const googleAI = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-3-pro-preview";

/**
 * Helper function to generate content with retry logic for rate limits (429 errors)
 */
export async function generateContentWithRetry(params: any, maxRetries = 5, initialDelay = 5000) {
  let retries = 0;
  
  while (true) {
    try {
      const result = await googleAI.models.generateContent(params);
      return result;
    } catch (error: any) {
      // Debug log the error structure
      console.log('⚠️ Gemini API Error:', JSON.stringify(error, null, 2));

      // Check for rate limit errors (429) or resource exhausted (429)
      // The SDK might wrap the error in different ways
      const isRateLimit = 
        error?.status === 429 || 
        error?.code === 429 || 
        (typeof error?.message === 'string' && (
          error.message.includes('429') ||
          error.message.includes('RESOURCE_EXHAUSTED') ||
          error.message.includes('quota') ||
          error.message.includes('Too Many Requests')
        )) ||
        // Sometimes error is inside error.error
        error?.error?.code === 429 ||
        error?.error?.status === 'RESOURCE_EXHAUSTED';

      if (isRateLimit && retries < maxRetries) {
        retries++;
        // Aggressive backoff: 5s, 10s, 20s, 40s, 80s
        const delay = initialDelay * Math.pow(2, retries - 1); 
        console.log(`⚠️ Gemini Rate Limit hit (Attempt ${retries}/${maxRetries}). Waiting ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If not rate limit or max retries reached, throw error
      throw error;
    }
  }
}

/**
 * Helper function to embed content with retry logic
 */
export async function embedContentWithRetry(params: any, maxRetries = 5, initialDelay = 5000) {
  let retries = 0;
  
  while (true) {
    try {
      const result = await googleAI.models.embedContent(params);
      return result;
    } catch (error: any) {
      const isRateLimit = 
        error?.status === 429 || 
        error?.code === 429 || 
        (typeof error?.message === 'string' && (
          error.message.includes('429') ||
          error.message.includes('RESOURCE_EXHAUSTED') ||
          error.message.includes('quota')
        )) ||
        error?.error?.code === 429;

      if (isRateLimit && retries < maxRetries) {
        retries++;
        const delay = initialDelay * Math.pow(2, retries - 1);
        console.log(`⚠️ Gemini Embed Rate Limit hit (Attempt ${retries}/${maxRetries}). Waiting ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
