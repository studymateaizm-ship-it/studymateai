import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Copy, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/context/MaterialsContext";
import { useAI } from "@/context/AIContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Summarize = () => {
  const navigate = useNavigate();
  const { materials } = useMaterials();
  const { isConfigured, summarizeContent } = useAI();
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("custom");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    let textToSummarize = input;
    let material = null;

    if (selectedMaterial !== "custom" && selectedMaterial) {
      material = materials.find((m) => m.id === selectedMaterial);
      textToSummarize = material?.content || input;
      
      // Check if material has pre-analyzed summary
      if (material?.analyzedData?.summary && 
          material.analyzedData.analysisStatus === "completed") {
        setSummary(material.analyzedData.summary);
        setError("");
        return;
      }
    }

    if (!textToSummarize.trim()) return;

    if (!isConfigured) {
      setError("AI provider not configured. Please set up Gemini or Ollama first.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await summarizeContent(textToSummarize);
      
      if (response.success) {
        setSummary(response.content);
      } else {
        setError(response.error || "Failed to generate summary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Smart Summarization</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {materials.length > 0 ? "Summarize your uploaded materials or paste new content" : "Paste your notes or study material and get instant AI-powered summaries"}
          </p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Input Content</h3>
              
              {materials.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Choose Material:</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => {
                      setSelectedMaterial(e.target.value);
                      setSummary(""); // Clear summary when changing material
                      if (e.target.value !== "custom") {
                        const material = materials.find((m) => m.id === e.target.value);
                        setInput(material?.content || "");
                        // Auto-load pre-analyzed summary if available
                        if (material?.analyzedData?.summary && 
                            material.analyzedData.analysisStatus === "completed") {
                          setSummary(material.analyzedData.summary);
                        }
                      } else {
                        setInput("");
                      }
                    }}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="custom">Custom Text</option>
                    {materials.map((m) => {
                      const hasPreAnalyzedSummary = m.analyzedData?.summary && 
                        m.analyzedData.analysisStatus === "completed";
                      const statusLabel = hasPreAnalyzedSummary ? " ✓ (Summary ready)" : "";
                      return (
                        <option key={m.id} value={m.id}>
                          {m.name}{statusLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {selectedMaterial === "custom" && (
                <Textarea
                  placeholder="Paste your lecture notes, textbook content, or study material here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 min-h-96 mb-4 resize-none"
                />
              )}

              {selectedMaterial !== "custom" && selectedMaterial && (
                <div className="flex-1 border border-border rounded-lg p-4 mb-4 overflow-y-auto bg-muted/50 min-h-96">
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">{input}</p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleSummarize}
                  disabled={isLoading || !input.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Zap className="h-4 w-4" />
                  {isLoading 
                    ? "Summarizing..." 
                    : (selectedMaterial !== "custom" && materials.find(m => m.id === selectedMaterial)?.analyzedData?.summary 
                      ? "Load Pre-analyzed Summary" 
                      : "Create Summary")}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {selectedMaterial === "custom" ? `${input.length} characters` : `Material selected: ${input.length} characters`}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Summary Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Your Summary</h3>
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent"
                  />
                </div>
              ) : summary ? (
                <>
                  <div className="flex-1 bg-muted p-4 rounded-lg mb-4 overflow-y-auto max-h-96 whitespace-pre-wrap text-sm">
                    {summary}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={copySummary}
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-center">
                    {materials.length === 0 ? "Paste your content and click \"Create Summary\" to get started" : "Select a material or paste content and click \"Create Summary\" to get started"}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {materials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200">No materials uploaded</p>
              <p className="text-amber-800 dark:text-amber-300">Upload your notes to summarize them automatically!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Summarize;
