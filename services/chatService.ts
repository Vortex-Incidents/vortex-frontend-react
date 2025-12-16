import { aiApi } from './api';
import { AIClassification } from '../types';

export interface ChatResponse {
    response: string;
    // add other fields if python API returns more
}

export const chatWithBot = async (message: string, language: string = 'es'): Promise<string> => {
    try {
        // Updated to match backend route structure: /api/v1/chat/message
        const response = await aiApi.post<ChatResponse>('/api/v1/chat/message', { message, language });
        return response.data.response || "I didn't quite catch that.";
    } catch (error) {
        console.error("Chat API Error:", error);
        return "I am currently offline. Please try again later.";
    }
};

export const classifyIncidentAI = async (text: string): Promise<AIClassification> => {
    try {
        const response = await aiApi.post<AIClassification>('/api/v1/triage/predict', { description: text });
        return response.data;
    } catch (error) {
        console.error("Triage API Error:", error);
        // Fallback
        return {
            category: 'Other',
            priority: 'Medium',
            reasoning: "Fallback due to API error"
        };
    }
}
