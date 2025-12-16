import { AIClassification } from '../types';

const TRIAGE_URL = 'https://vortex-python-triage.onrender.com/api/v1/triage/classify';
const CHAT_URL = 'https://vortex-python-triage.onrender.com/api/v1/chat/message';

export const classifyIncidentApi = async (description: string): Promise<AIClassification> => {
    try {
        const response = await fetch(TRIAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) throw new Error('Triage Service Failed');

        const data = await response.json();
        // Map response to our AIClassification type
        // Expected: { category: "...", priority: "...", confidence: ... }
        // We map generic confidence/extra fields if needed, or just standard fields.
        // Our UI expects: priority, category, reasoning.
        // The Python API doesn't seem to return 'reasoning' in the example, maybe we synthesize it or it's missing.
        // We'll use a default string for reasoning if missing.

        return {
            priority: data.priority,
            category: data.category,
            reasoning: `Confidence: ${data.confidence || 'N/A'}` // Fallback for now
        };
    } catch (error) {
        console.error('Auto-Triage Error:', error);
        throw error;
    }
};

export const chatWithBotApi = async (message: string, language: string = 'es'): Promise<string> => {
    try {
        const response = await fetch(CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, language }),
        });

        if (!response.ok) throw new Error('Chat Service Failed');

        const data = await response.json();
        // Assuming the response has a 'response' or 'message' field.
        // The example didn't strictly specify the response format for chat, 
        // usually it returns { "response": "Hello..." }
        return data.response || data.message || JSON.stringify(data);
    } catch (error) {
        console.error('Chat Bot Error:', error);
        return "Error communicating with Vortex AI.";
    }
};
