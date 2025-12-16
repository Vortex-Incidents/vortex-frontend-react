import { AIClassification } from "../types";
import { classifyIncidentApi, chatWithBotApi } from "./pythonTriageService";

// Wrapper to match existing function signatures where possible, or adapt them.

export const classifyIncident = async (title: string, description: string): Promise<AIClassification> => {
  // Python service only takes description in the example, but we can send both combined if we want better context
  // or just description. The user example showed: { "description": "..." }
  const fullText = `Title: ${title}. Description: ${description}`;
  return await classifyIncidentApi(fullText);
};

export const chatWithIVA = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
  // Python service expects { message: "...", language: "..." }
  // It doesn't seem to explicitly take history in the simple example, 
  // but if it's a "chatbot", it might maintain state or we just send the latest message.
  // The user prompt said: "B. Chatbot... Body: { message: ... }"
  // It doesn't mention sending history. We'll send the new message.
  return await chatWithBotApi(message, 'es'); // Defaulting to Spanish as in the example
};