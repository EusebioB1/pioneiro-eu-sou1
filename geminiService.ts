
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalThought = async (name: string, type: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma mensagem curta e encorajadora (máximo 150 caracteres) para um pioneiro ${type} chamado ${name} sobre o ministério de campo das Testemunhas de Jeová. É OBRIGATÓRIO que se houver citações bíblicas, elas sejam baseadas exclusivamente na 'Tradução do Novo Mundo das Escrituras Sagradas'. Use um tom motivador em português de Portugal.`,
    });
    return response.text || "Continue o seu excelente trabalho no ministério!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "O teu serviço é precioso aos olhos de Jeová. Continua firme!";
  }
};
