
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const qualifyLeadMessage = async (message: string, history: string[] = [], userName?: string) => {
  const systemInstruction = `Você é a MIA, assistente virtual da Magalhães Negócios Imobiliários. 
  Sua missão é qualificar leads interessados em imóveis Minha Casa Minha Vida.
  Seja amigável, direta e gaúcha (Porto Alegre). 
  Objetivo: Nome, Renda Familiar e Bairro de interesse.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: `Lead diz: "${message}" | Histórico: ${history.join(' | ')}` }] },
      config: { systemInstruction }
    });
    return { text: response.text || "Oi! Me conta mais sobre sua busca.", isHandoff: response.text?.includes("corretor") };
  } catch (error) {
    return { text: "Oi! Tive um problema técnico, mas me conta, busca apê onde?", isHandoff: false };
  }
};

export const getLeadAnalytics = async (leads: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes leads: ${JSON.stringify(leads)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prioritySummary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["prioritySummary", "actionItems"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return { prioritySummary: "Sem dados no momento.", actionItems: [] };
  }
};

export const analyzeNeighborhood = async (address: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `O que tem de prático para quem busca o primeiro imóvel perto de: ${address}?`,
      config: { tools: [{ googleMaps: {} }] },
    });
    return { text: response.text, links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch { return null; }
};

export const generatePropertyCopy = async (features: string[], style: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie um anúncio para: ${features.join(', ')}. Estilo: ${style}.`,
  });
  return response.text;
};

export const generateIcebreaker = async (type: string, info: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Quebra-gelo para lead ${type}. Contexto: ${info}`,
  });
  return response.text;
};
