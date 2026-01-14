
import { GoogleGenAI, Type } from "@google/genai";

// Inicialização segura da IA usando a variável de ambiente configurada na Vercel
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Teste de Conexão
 * Verifica se a API Key está válida e o modelo respondendo.
 */
export const testAiConnection = async () => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: "Responda apenas: 'SISTEMA ONLINE - MIA PRONTA PARA VENDER!'" }] }],
    });
    return { success: true, message: response.text };
  } catch (error: any) {
    console.error("Erro no teste:", error);
    return { 
      success: false, 
      message: error.message?.includes("API_KEY_INVALID") 
        ? "Chave API Inválida. Verifique as variáveis de ambiente na Vercel." 
        : "Erro de conexão. Verifique se a API_KEY foi adicionada corretamente." 
    };
  }
};

/**
 * MIA - Inteligência de Qualificação
 * Treinada para filtrar curiosos e focar em quem tem renda para o Minha Casa Minha Vida.
 */
export const qualifyLeadMessage = async (message: string, history: string[] = []) => {
  const ai = getAI();
  const systemInstruction = `Você é a MIA, a assistente virtual de elite do corretor Magalhães. 
  Sua missão é atender leads no WhatsApp de forma humana, rápida e com sotaque gaúcho (Porto Alegre/RS).
  
  REGRAS DE OURO:
  1. Identifique o Nome, a Renda Familiar Bruta e o Bairro de interesse.
  2. Seja muito educada, mas direta.
  3. Se o lead perguntar coisas fora do setor imobiliário, gentilmente retorne ao assunto.
  4. Se o lead demonstrar real interesse e fornecer os dados, diga que o Magalhães entrará em contato em breve para a simulação.
  5. Use expressões como "Bah", "Tudo certo?", "Capaz".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Histórico da conversa: ${history.join(' | ')}\n\nLead enviou agora: "${message}"` }] }],
      config: { systemInstruction }
    });
    return { 
      text: response.text || "Bah, tive um pequeno problema técnico aqui. Mas me conta, qual sua renda familiar aproximada?", 
      isHandoff: response.text?.toLowerCase().includes("magalhães") || response.text?.toLowerCase().includes("contato")
    };
  } catch (error) {
    console.error("Erro na MIA:", error);
    return { text: "Oi! O sinal falhou um pouco, mas estou aqui. Qual bairro você mais gosta em Porto Alegre?", isHandoff: false };
  }
};

/**
 * Analista de Estratégia
 * Transforma dados brutos em insights de venda.
 */
export const getLeadAnalytics = async (leads: any[]) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analise estes dados de leads e me dê um resumo estratégico de quem eu devo ligar primeiro: ${JSON.stringify(leads)}` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prioritySummary: { 
              type: Type.STRING, 
              description: "Um resumo motivacional e direto para o corretor sobre qual lead é a maior chance de venda hoje." 
            },
            actionItems: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 3 ações imediatas."
            }
          },
          required: ["prioritySummary", "actionItems"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return { prioritySummary: "Continue focado! Seus leads estão sendo qualificados pela MIA.", actionItems: ["Verificar WhatsApp", "Retornar leads quentes"] };
  }
};

/**
 * Consultoria de Localização (Maps Grounding)
 * Usa o Google Maps para dar argumentos de venda reais sobre o bairro.
 */
export const analyzeNeighborhood = async (address: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `O que tem de melhor para uma família morar perto de: ${address}? Foque em escolas, mercados e transporte.` }] }],
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return { 
      text: response.text, 
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    console.error("Erro no Maps:", error);
    return null;
  }
};

export const generatePropertyCopy = async (features: string[], style: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: `Crie um anúncio magnético para o Instagram. Características: ${features.join(', ')}. Estilo: ${style}.` }] }],
  });
  return response.text;
};

export const generateIcebreaker = async (type: string, info: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: `Crie uma mensagem de "Quebra-Gelo" para um lead do tipo ${type}. Contexto: ${info}. Seja sutil e não invasivo.` }] }],
  });
  return response.text;
};
