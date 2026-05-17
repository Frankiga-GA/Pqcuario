import { getAgroContextForAI } from './storage';

export async function requestIAVetAI({ message, image, audio, history }) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        image,
        audio,
        history: history || [],
        context: getAgroContextForAI(),
      }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.detail || detail.error || 'Error en la conexión con IAVet AI.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('[AI Service Error]:', error);
    throw error;
  }
}

export function extractJsonObject(text) {
  try {
    // Intentar parsear directo
    return JSON.parse(text);
  } catch {
    // Intentar extraer bloque JSON con regex
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
