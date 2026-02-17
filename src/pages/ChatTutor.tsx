import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  Plus,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Monitor,
  X,
  Highlighter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/context/MaterialsContext";
import { useAI } from "@/context/AIContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  audioUrl?: string;
  screenCapture?: string;
}

interface HighlightBox {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const ChatTutor = () => {
  const navigate = useNavigate();
  const { materials } = useMaterials();
  const { isConfigured, provider, chatWithTutor } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: materials.length > 0 
        ? `Hello! I'm your AI Study Tutor powered by ${provider === 'gemini' ? 'Google Gemini' : provider === 'ollama' ? 'Ollama' : 'AI'}. I've analyzed your uploaded materials:\n\n${materials.map(m => `• ${m.name}`).join('\n')}\n\nI can now answer questions about these materials, explain concepts, provide examples, and help you understand the content better. Use voice or type your questions!`
        : "Hello! I'm your AI Study Tutor. I can help you understand any concept, answer questions, or explain topics. You can use voice input and screen sharing for better assistance!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio & Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Screen Sharing States
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [highlights, setHighlights] = useState<HighlightBox[]>([]);
  const [showScreenPreview, setShowScreenPreview] = useState(false);
  const [screenImageData, setScreenImageData] = useState<string>("");

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.isFinal) {
          setInput((prev) => prev + (prev ? " " : "") + transcript);
        }
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startScreenShare = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });
      setScreenStream(stream);
      setIsScreenSharing(true);
      setShowScreenPreview(true);
      
      // Capture initial frame
      captureScreenFrame(stream);
      
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
    } catch (error) {
      console.error("Screen share error:", error);
    }
  };

  const captureScreenFrame = (stream: MediaStream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setScreenImageData(canvas.toDataURL("image/jpeg"));
      }
    }, 500);
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      setShowScreenPreview(false);
      setHighlights([]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!isConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "ai",
          content: "⚠️ AI provider is not configured. Please set up Google Gemini or Ollama first.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
      screenCapture: screenImageData || undefined,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare context from materials
      let context = materials
        .map((m) => `[${m.name}]\n${m.content.substring(0, 1000)}...`)
        .join("\n\n");
      
      // Include screen content in context if available
      if (screenImageData) {
        context += "\n\n[USER'S SCREEN CONTENT]\nThe user is showing you their screen. Analyze it and answer questions based on what you see on their screen.";
      }

      // Get AI response
      const response = await chatWithTutor(input, materials.length > 0 ? context : undefined);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.success ? response.content : `Error: ${response.error || "Failed to get response"}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Speak response if audio is enabled
      if (audioEnabled && response.success) {
        speakText(response.content);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Sorry, there was an error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto h-screen flex flex-col">
        {/* Header with Controls */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">AI Chat Tutor</h1>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <Button
              variant={audioEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              title="Toggle audio responses"
              className="gap-2"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  Audio On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Audio Off
                </>
              )}
            </Button>
            
            {/* Screen Share Button */}
            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              title="Share your screen"
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              {isScreenSharing ? "Stop Share" : "Share Screen"}
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Screen Preview Modal */}
        <AnimatePresence>
          {showScreenPreview && screenImageData && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-200">
                    Screen Preview - Ask questions about what you see!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScreenPreview(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={screenImageData}
                  alt="Screen preview"
                  className="w-full max-h-48 object-cover"
                />
                {/* Highlight Overlays */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ aspectRatio: 'auto' }}
                >
                  {highlights.map((box, idx) => (
                    <rect
                      key={idx}
                      x={box.x}
                      y={box.y}
                      width={box.width}
                      height={box.height}
                      fill="none"
                      stroke={box.color}
                      strokeWidth="3"
                      opacity="0.8"
                    />
                  ))}
                </svg>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {highlights.length > 0
                  ? `Highlighting ${highlights.length} area${highlights.length !== 1 ? 's' : ''} on your screen`
                  : "AI will analyze your screen and highlight answers"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Materials Info */}
        {materials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-200">
                Using {materials.length} material{materials.length !== 1 ? "s" : ""} for context:
              </p>
              <p className="text-blue-800 dark:text-blue-300">
                {materials.map(m => m.name).join(", ")}
              </p>
            </div>
          </motion.div>
        )}

        {/* AI Configuration Warning */}
        {!isConfigured && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Provider Not Configured</strong>
              <p className="text-sm mt-1">
                To enable AI responses, configure an AI provider in your .env file.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md lg:max-w-lg p-4 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                {message.screenCapture && message.type === "user" && (
                  <div className="mb-3 max-h-32 rounded overflow-hidden border border-primary/30">
                    <img
                      src={message.screenCapture}
                      alt="Screen shared"
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.type === "ai" && (
                  <div className="flex flex-col gap-2 mt-2">
                    {audioEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.content)}
                        className="h-8 gap-1 text-xs justify-start"
                      >
                        <Volume2 className="h-3 w-3" />
                        Speak Response
                      </Button>
                    )}
                    
                    {isScreenSharing && screenImageData && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Add highlight animation
                          setHighlights([
                            {
                              x: 10,
                              y: 10,
                              width: 200,
                              height: 100,
                              color: "#22c55e",
                            },
                          ]);
                        }}
                        className="h-8 gap-1 text-xs justify-start"
                      >
                        <Highlighter className="h-3 w-3" />
                        Highlight on Screen
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted text-foreground p-4 rounded-lg rounded-bl-none flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 border-t border-border pt-4">
          <div className="flex-1 relative">
            <Input
              placeholder={
                isListening
                  ? "🎤 Listening..."
                  : isScreenSharing
                  ? "Ask about your shared screen..."
                  : materials.length > 0
                  ? "Ask about your materials or type your question..."
                  : "Type or speak your question..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            
            {/* Microphone Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-colors ${
                isListening
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              title="Hold to speak"
            >
              {isListening ? (
                <Mic className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </motion.button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;
