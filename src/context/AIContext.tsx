import React, { createContext, useContext, useEffect } from "react";
import { configureAI, getAIConfig, queryAI, summarizeContent, generateQuiz, solveProblem, chatWithTutor, type AIResponse, type AIServiceConfig } from "@/services/aiService";

interface AIContextType {
  isConfigured: boolean;
  provider: "gemini" | "ollama" | "none";
  queryAI: (prompt: string, context?: string) => Promise<AIResponse>;
  summarizeContent: (content: string) => Promise<AIResponse>;
  generateQuiz: (content: string, numQuestions?: number) => Promise<AIResponse>;
  solveProblem: (problem: string, context?: string) => Promise<AIResponse>;
  chatWithTutor: (question: string, context?: string) => Promise<AIResponse>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [provider, setProvider] = React.useState<"gemini" | "ollama" | "none">(
    "none"
  );

  useEffect(() => {
    // Read configuration from environment variables
    const aiProvider =
      (import.meta.env.VITE_AI_PROVIDER as "gemini" | "ollama" | "none") ||
      "none";
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const ollamaUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
    const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL;

    const config: AIServiceConfig = {
      provider: aiProvider,
      geminiApiKey: geminiKey,
      ollamaBaseUrl: ollamaUrl || "http://localhost:11434",
      ollamaModel: ollamaModel || "mistral",
    };

    configureAI(config);
    setProvider(aiProvider);

    // Log configuration status (without exposing API keys)
    const isValidGeminiKey = geminiKey && 
      geminiKey !== "your_gemini_api_key_here" && 
      geminiKey.trim().length > 0;
    
    if (aiProvider === "gemini" && isValidGeminiKey) {
      console.log("✓ Gemini AI configured and ready to use");
      setIsConfigured(true);
    } else if (aiProvider === "gemini" && !isValidGeminiKey) {
      console.warn("⚠ Gemini is selected but API key is missing or invalid. Set VITE_GEMINI_API_KEY in .env.local");
      setIsConfigured(false);
    } else if (aiProvider === "ollama" && ollamaUrl) {
      console.log(`✓ Ollama AI configured (${ollamaUrl})`);
      setIsConfigured(true);
    } else if (aiProvider === "ollama") {
      console.warn("⚠ Ollama is selected but not reachable. Make sure Ollama is running locally.");
      setIsConfigured(false);
    } else {
      console.warn("⚠ No AI provider configured. To enable AI features, set VITE_AI_PROVIDER to 'gemini' or 'ollama' in your .env.local file.");
      setIsConfigured(false);
    }
  }, []);

  return (
    <AIContext.Provider
      value={{
        isConfigured,
        provider,
        queryAI,
        summarizeContent,
        generateQuiz,
        solveProblem,
        chatWithTutor,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within AIProvider");
  }
  return context;
};
