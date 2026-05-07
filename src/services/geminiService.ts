import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateMarketingContent = async (prompt: string, platform: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert SEO digital marketing assistant. Create a high-ranking, SEO-based content plan for: ${prompt}. Tailored for ${platform}. Provide it in a structured format. DO NOT use markdown headers (no '#'). Use bold text (e.g. **Title**) for titles if needed, but keep it clean. 
    End the response with a section titled **SEO Analysis** containing:
    - **SEO Score:** [0-100]
    - **Suggestions:** [List of 2-3 brief improvement tips]`,
  });
  return response.text;
};

export const chatWithMarketingBot = async (message: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert digital marketing problem solver. Answer the following question: ${message}. DO NOT use markdown headers (no '#'). Use bold text for emphasis.`,
  });
  return response.text;
};

export const researchKeywords = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an elite SEO specialist providing real-time, absolute latest 2026 trending search data. Provide a comprehensive list of high-intent, currently trending keywords for the topic: ${topic}. 
    For each keyword, provide: Keyword, Density estimate, Keyword Difficulty (KD), and Competitive Level (High/Medium/Low).
    Format as a structured CSV with headers: Keyword,Density,KD,Level.
    Ensure data is reflective of current 2026 market trends.
    DO NOT use markdown headers (no '#'). Use bold text for emphasis.`,
  });
  return response.text;
};

export const generateBlogContent = async (topic: string, tone: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert content writer. Write a comprehensive, engaging blog post on the topic: ${topic}. 
    Use a ${tone} tone. Structure with an engaging introduction, several informative body paragraphs, and a strong conclusion. 
    Include bold text for key points and subheadings. DO NOT use markdown headers (no '#').`,
  });
  return response.text;
};
