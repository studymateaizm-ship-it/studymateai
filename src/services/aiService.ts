import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIServiceConfig {
  provider: "gemini" | "ollama" | "none";
  geminiApiKey?: string;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

let config: AIServiceConfig = {
  provider: "none",
};

export const configureAI = (newConfig: AIServiceConfig) => {
  config = newConfig;
};

export const getAIConfig = () => config;

// ==================== GOOGLE GEMINI ====================
export const queryGemini = async (
  prompt: string,
  context?: string
): Promise<AIResponse> => {
  try {
    if (!config.geminiApiKey) {
      return {
        success: false,
        content: "",
        error:
          'Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env file.' ,
      };
    }

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = context
      ? `Context from study materials:\n${context}\n\nQuestion: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      success: false,
      content: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to get response from Gemini",
    };
  }
};

// ==================== OLLAMA (LOCAL) ====================
export const queryOllama = async (
  prompt: string,
  context?: string
): Promise<AIResponse> => {
  try {
    const baseUrl = config.ollamaBaseUrl || "http://localhost:11434";
    const model = config.ollamaModel || "mistral";

    const fullPrompt = context
      ? `Context from study materials:\n${context}\n\nQuestion: ${prompt}`
      : prompt;

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama server error: ${response.status} - Make sure Ollama is running at ${baseUrl}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      content: data.response || "",
    };
  } catch (error) {
    console.error("Ollama API error:", error);
    return {
      success: false,
      content: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to connect to Ollama. Make sure it's running locally.",
    };
  }
};

// ==================== UNIFIED QUERY FUNCTION ====================
export const queryAI = async (
  prompt: string,
  context?: string
): Promise<AIResponse> => {
  if (config.provider === "gemini") {
    return queryGemini(prompt, context);
  } else if (config.provider === "ollama") {
    return queryOllama(prompt, context);
  } else {
    return {
      success: false,
      content: "",
      error: "No AI provider configured. Set VITE_AI_PROVIDER to 'gemini' or 'ollama'",
    };
  }
};

// ==================== SUMMARIZATION ====================
export const summarizeContent = async (content: string): Promise<AIResponse> => {
  const prompt = `Please provide a clear and concise summary of the following content. Focus on key points and main concepts:\n\n${content}`;
  return queryAI(prompt);
};

// ==================== QUIZ GENERATION ====================
export const generateQuiz = async (
  content: string,
  numQuestions: number = 5
): Promise<AIResponse> => {
  const prompt = `Based on the following content, generate ${numQuestions} multiple-choice quiz questions. Format each question with:
Question X: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Correct: [letter]

Content:\n${content}`;
  return queryAI(prompt);
};

// ==================== PROBLEM SOLVING ====================
export const solveProblem = async (
  problem: string,
  context?: string
): Promise<AIResponse> => {
  const prompt = `Please solve this problem step-by-step. Show your work and explain each step clearly:\n\n${problem}`;
  return queryAI(prompt, context);
};

// ==================== CHAT-BASED Q&A ====================
export const chatWithTutor = async (
  question: string,
  context?: string
): Promise<AIResponse> => {
  const prompt = `You are a helpful AI tutor. Answer this question based on your knowledge and the provided study materials. Be clear, educational, and encouraging:\n\n${question}`;
  return queryAI(prompt, context);
};

// ==================== MATERIAL ANALYSIS ====================
export const analyzeMaterial = async (
  content: string,
  numQuestions: number = 5
): Promise<{
  summary?: string;
  keyPoints?: string[];
  keywords?: string[];
  generatedQuestions?: any[];
  error?: string;
}> => {
  const prompt = `Analyze the following study material and provide:
1. A brief summary (2-3 sentences)
2. Key points (3-5 bullet points)
3. Important keywords (5-10 terms)
4. ${numQuestions} quiz questions in JSON format

Format your response as follows:
SUMMARY: [summary text]

KEY POINTS:
- [point 1]
- [point 2]
- [point 3]

KEYWORDS: [keyword1, keyword2, keyword3, ...]

QUIZ QUESTIONS:
[JSON array with objects containing: question, options (array of 4), correctAnswer (0-3), explanation]

Material to analyze:
${content}`;

  const response = await queryAI(prompt);

  if (!response.success) {
    return {
      error: response.error,
    };
  }

  try {
    const text = response.content;

    // Parse summary
    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nKEY POINTS:|KEY POINTS:|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    // Parse key points
    const keyPointsMatch = text.match(/KEY POINTS:\s*([\s\S]*?)(?=\n\nKEYWORDS:|KEYWORDS:|$)/);
    const keyPointsText = keyPointsMatch ? keyPointsMatch[1].trim() : "";
    const keyPoints = keyPointsText
      .split("\n")
      .filter((p) => p.trim().startsWith("-"))
      .map((p) => p.replace(/^-\s*/, "").trim());

    // Parse keywords
    const keywordsMatch = text.match(/KEYWORDS:\s*([\s\S]*?)(?=\n\nQUIZ QUESTIONS:|QUIZ QUESTIONS:|$)/);
    const keywordsText = keywordsMatch ? keywordsMatch[1].trim() : "";
    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // Parse quiz questions
    let generatedQuestions = [];
    const quizMatch = text.match(/QUIZ QUESTIONS:\s*([\s\S]*?)$/);
    if (quizMatch) {
      const jsonText = quizMatch[1].trim();
      const jsonMatch = jsonText.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        generatedQuestions = JSON.parse(jsonMatch[0]);
      }
    }

    return {
      summary: summary || undefined,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      generatedQuestions: generatedQuestions.length > 0 ? generatedQuestions : undefined,
    };
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    return {
      error: "Failed to parse analysis response",
    };
  }
};
// ==================== VISION/SCREEN ANALYSIS ====================
export const analyzeScreenWithVision = async (
  screenImageData: string,
  question: string,
  context?: string
): Promise<AIResponse> => {
  if (config.provider === "gemini") {
    return analyzeScreenGemini(screenImageData, question, context);
  } else if (config.provider === "ollama") {
    // Ollama doesn't support images by default, fallback to text
    return queryOllama(question, context);
  } else {
    return {
      success: false,
      content: "",
      error: "No AI provider configured",
    };
  }
};

const analyzeScreenGemini = async (
  screenImageData: string,
  question: string,
  context?: string
): Promise<AIResponse> => {
  try {
    if (!config.geminiApiKey) {
      return {
        success: false,
        content: "",
        error: "Gemini API key not configured",
      };
    }

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert base64 to image data
    const imageBase64 = screenImageData.split(",")[1] || screenImageData;

    const prompt = context
      ? `Study Material Context:\n${context}\n\nUser is showing you their screen. Based on what you see in the image and the question: "${question}"\n\nPlease identify and describe the exact locations of relevant content that answers their question. Include coordinates or descriptions of where on the screen the answer is located.`
      : `Looking at the user's shared screen, please answer this question: "${question}"\n\nIdentify where on the screen the relevant information is located.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
    };
  } catch (error) {
    console.error("Screen analysis error:", error);
    return {
      success: false,
      content: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze screen",
    };
  }
};