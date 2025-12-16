import { aiApi } from './api';
import { AIClassification } from '../types';

export interface ChatResponse {
    response: string;
    // add other fields if python API returns more
}

export const chatWithBot = async (message: string, language: string = 'es'): Promise<string> => {
    try {
        const response = await aiApi.post<ChatResponse>('/chat/message', { message, language });
        // Assuming API returns { response: "..." } or similar. Adjust based on real API contract.
        // User prompt implies: Payload: {message, language}. Response?
        // Usually { response: "text" }
        return response.data.response || "I didn't quite catch that.";
    } catch (error) {
        console.error("Chat API Error:", error);
        return "I am currently offline. Please try again later.";
    }
};

export const classifyIncidentAI = async (text: string): Promise<AIClassification> => {
    try {
        const response = await aiApi.post<AIClassification>('/triage/predict', { description: text });
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
