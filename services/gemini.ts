
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to safely parse JSON from a potentially messy string.
 */
const safeParseJSON = (text: string | undefined, fallback: any) => {
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      const markdownRegex = new RegExp("\\x60{3}json\\s*|\\s*\\x60{3}", "g");
      let cleanText = text.replace(markdownRegex, "");
      const startIndex = cleanText.indexOf('{');
      const endIndex = cleanText.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        cleanText = cleanText.substring(startIndex, endIndex + 1);
        return JSON.parse(cleanText);
      }
    } catch (e2) {
      console.warn("JSON Parse Failed:", e2);
    }
  }
  return fallback;
};

export const getMultiAgentAnalysis = async (coin: string, language: string = 'en') => {
  if (!process.env.API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a professional multi-agent crypto analysis for ${coin}. Use technical, macro, on-chain, and social sentiment agents. Return JSON.`,
      config: { responseMimeType: 'application/json' }
    });
    return safeParseJSON(response.text, null);
  } catch (e) {
    return null;
  }
};

/**
 * Generates a reactive chat response from simulated international personas.
 */
export const generateSocialChatResponse = async (userMessage: string, gameState: any, language: string = 'en') => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simulate a global crypto chat for BitPoly.
      User message: "${userMessage}"
      
      Personas to choose from:
      - "Satoshi_San 🇯🇵": Technical, polite, focused on efficiency.
      - "CryptoCowboy 🇺🇸": Aggressive, loves leverage, uses cowboy slang.
      - "Mei_Crypto 🇹🇼": Smart, mentions AI/TSMC links, local Taipei trends.
      - "DubaiMogul 🇦🇪": High net worth, focused on institutional adoption.
      - "DelhiDegen 🇮🇳": Very active, community-focused, loves airdrops.
      - "K-Crypto 🇰🇷": Obsessed with momentum and fast trades.
      - "EuroTrader_Max 🇪🇺": Macro focused, regulation cautious.
      - "BrazucaChain 🇧🇷": Meme-heavy, high energy.

      Response must be short (max 15 words) and reflect the country's unique trading culture.
      Language: ${language === 'zh' ? 'Traditional Chinese (zh-TW)' : 'English'}.
      
      Return JSON: { "sender", "text", "avatar", "color" }`,
      config: { responseMimeType: 'application/json' }
    });
    return safeParseJSON(response.text, null);
  } catch (e) {
      return null;
  }
};

/**
 * AI Robot Chatbot using gemini-3-pro-preview with Google Search Grounding.
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: `You are Bitquery Robot, an elite AI crypto co-pilot. 
        Your mission is to help users make money through data and logic.
        Use the googleSearch tool for EVERY query to find real-time prices and news.
        Provide URLs in your response for transparency. Be direct, professional, and slightly futuristic.`,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I am currently processing high-frequency data. Please try again.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || chunk.maps?.uri,
        title: chunk.web?.title || chunk.maps?.title || "Data Source"
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (error) {
    return { text: "Connection to main AI core lost. Retrying...", sources: [] };
  }
};

export const getMarketAnalysis = async (query: string, language: string = 'en') => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: { tools: [{ googleSearch: {} }] },
      contents: `Market analysis for: ${query}. Focus on profit opportunities.`,
    });
    return { text: response.text, sources: [] };
  } catch (error) {
    return { text: "Market data sync error.", sources: [] };
  }
};

export const getBitcoinXAnalysis = async (language: string = 'en') => {
  if (!process.env.API_KEY) return { markdownReport: "API Key Missing", wordCloud: [], sources: [] };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze Bitcoin sentiment on X. Return JSON: { "markdownReport", "wordCloud": [{ "text", "weight", "sentiment" }] }`,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    return safeParseJSON(response.text, { markdownReport: "Syncing...", wordCloud: [] });
  } catch (e) {
    return { markdownReport: "Social offline.", wordCloud: [], sources: [] };
  }
};

/**
 * High-speed game content generator for snappier dice rolls.
 */
export const generateGameContent = async (type: 'QUIZ' | 'NEWS' | 'CHANCE', context?: string, language: string = 'en') => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a crypto ${type} about: ${context || 'General'}. 
      Keep it very brief for a game. 
      JSON: { "title", "description", "type", "question", "options", "correctAnswer", "explanation" }. 
      Language: ${language}. Force English for QUIZ questions.`,
      config: { 
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 } // No thinking for speed
      }
    });
    return safeParseJSON(response.text, null);
  } catch (error) {
    return null;
  }
};

export const getBankerAdvice = async (playerState: any, language: string = 'en') => {
   if (!process.env.API_KEY) return "Banker offline.";
   try {
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `Banker advice for balance ${playerState.balance}. 10 words max.`,
     });
     return response.text;
   } catch (e) { return "Manage your risk."; }
}

export const getAssetDeepDive = async (symbol: string, language: string = 'en') => {
    if (!process.env.API_KEY) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Deep dive JSON for ${symbol}: { "background": { "description", "consensus", "utility" }, "esg": { "score", "summary", "controversies": [] } }`,
            config: { responseMimeType: 'application/json' }
        });
        return safeParseJSON(response.text, null);
    } catch (e) { return null; }
};

export const getEntityGraphData = async (topic: string) => {
    if (!process.env.API_KEY) return { nodes: [], edges: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Graph data for ${topic}. JSON: { "nodes", "edges" }`,
            config: { responseMimeType: 'application/json' }
        });
        return safeParseJSON(response.text, { nodes: [], edges: [] });
    } catch (e) { return { nodes: [], edges: [] }; }
};

export const generateTradingBotAnalysis = async (metrics: any, logs: string[], config: any, language: string = 'en') => {
    if (!process.env.API_KEY) return "Audit unavailable.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Perform a quantitative audit of this trading session:
            - PnL: ${metrics.pnl}
            - Win Rate: ${metrics.winRate}%
            - Strategy: ${config.strategy}
            - Recent Logs: ${logs.join('\n')}
            
            Write a professional markdown report including 'Executive Summary', 'Performance Breakdown', and 'Risk Recommendations'. Use professional quant language.`,
        });
        return response.text;
    } catch (e) { return "Audit failed."; }
};

export const analyzeWalletPortfolio = async (assets: any[], language: string = 'en') => {
    if (!process.env.API_KEY) return "Syncing wallet...";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze wallet: ${JSON.stringify(assets)}`,
        });
        return response.text;
    } catch (e) { return "Portfolio data unavailable."; }
}

export const getCryptoConcept = async (topic: string) => {
    if (!process.env.API_KEY) return "Loading...";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Explain ${topic} simply.`,
        });
        return response.text;
    } catch (e) { return "Content unavailable."; }
}

export const generateNotebookPodcast = async (topic: string) => {
    if (!process.env.API_KEY) return { script: "", takeaways: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Podcast for ${topic}. JSON: { "script", "takeaways" }`,
            config: { responseMimeType: 'application/json' }
        });
        return safeParseJSON(response.text, { script: "", takeaways: [] });
    } catch (e) { return { script: "", takeaways: [] }; }
};
