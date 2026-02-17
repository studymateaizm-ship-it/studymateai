// Audio & Voice Services

export interface AudioConfig {
  language?: string;
  rate?: number;
  pitch?: number;
}

/**
 * Initialize speech recognition
 */
export const initSpeechRecognition = (): SpeechRecognition | null => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported in this browser");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.language = "en-US";

  return recognition;
};

/**
 * Convert text to speech
 */
export const textToSpeech = (
  text: string,
  config: AudioConfig = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Speech Synthesis not supported"));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.rate || 1;
    utterance.pitch = config.pitch || 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Speech synthesis failed"));

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Stop current speech
 */
export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Check if speech recognition is available
 */
export const isSpeechRecognitionAvailable = (): boolean => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return !!SpeechRecognition;
};

/**
 * Check if text-to-speech is available
 */
export const isTextToSpeechAvailable = (): boolean => {
  return "speechSynthesis" in window;
};

/**
 * Get available voices
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
};

/**
 * Set voice for speech synthesis
 */
export const setVoice = (voiceIndex: number) => {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voiceIndex < voices.length) {
    // Store preference (implementation depends on use case)
    localStorage.setItem("preferredVoice", voiceIndex.toString());
  }
};

/**
 * Get preferred voice
 */
export const getPreferredVoice = (): SpeechSynthesisVoice | undefined => {
  if (!("speechSynthesis" in window)) return undefined;
  const preferredIndex = parseInt(
    localStorage.getItem("preferredVoice") || "0"
  );
  const voices = window.speechSynthesis.getVoices();
  return voices[preferredIndex];
};
