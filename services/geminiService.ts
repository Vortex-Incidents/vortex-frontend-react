import { GoogleGenAI, Type } from "@google/genai";
import { AIClassification, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Incident Classification (Triage) ---
export const classifyIncident = async (title: string, description: string): Promise<AIClassification> => {
  const model = "gemini-2.5-flash";
  const prompt = `Analyze this IT incident report for the Vortex Incident Management System.
  Title: ${title}
  Description: ${description}
  
  Determine the Category (e.g., Hardware, Software, Network, Access, Security) and Priority (Low, Medium, High, Critical).
  Provide a brief reasoning.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            category: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["priority", "category", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIClassification;
  } catch (error) {
    console.error("AI Classification Error:", error);
    // Fallback
    return { priority: "Medium", category: "General", reasoning: "Vortex AI unavailable, defaulted to Medium." };
  }
};

// --- Chatbot (IVA) ---
export const chatWithIVA = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are the Vortex Incident Virtual Assistant. 
    Your goal is to help employees and support staff with IT incidents efficiently.
    - Branding: You represent "Vortex Incident", a high-tech security and reporting platform.
    - Tone: Professional, Efficient, slightly futuristic but helpful.
    - If a user reports an issue, suggest they fill out the incident form.
    - You can answer general IT questions.`;

    try {
        const contents = [
            ...history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            })),
            { role: 'user', parts: [{ text: message }] }
        ];

        const response = await ai.models.generateContent({
            model,
            contents: contents,
            config: {
                systemInstruction,
            }
        });

        return response.text || "I'm having trouble connecting to the Vortex core. Please try again.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Vortex AI is currently offline. Please contact support manually.";
    }
};