import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Video,
  Copy,
  Download,
  AlertCircle,
  Loader,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/context/MaterialsContext";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  transcribeYouTubeVideo,
  transcribeVideoFile,
  type TranscriptionResponse,
} from "@/services/transcriptionService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Transcribe = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMaterial } = useMaterials();
  const { canUseFeature } = useUserAuth();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentVideoName, setCurrentVideoName] = useState("");

  const handleYouTubeTranscribe = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!canUseFeature("transcription")) {
      setError("Your plan doesn't include transcription. Upgrade to access this feature.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setCurrentVideoName("YouTube Video");

    try {
      console.log("Starting YouTube transcription...");
      const response = await transcribeYouTubeVideo(youtubeUrl);

      if (response.success && response.transcription) {
        setTranscription(response.transcription);
        setSuccess("✓ YouTube video transcribed successfully!");
      } else {
        setError(response.error || "Failed to transcribe video");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUseFeature("transcription")) {
      setError("Your plan doesn't include transcription. Upgrade to access this feature.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setCurrentVideoName(file.name);

    try {
      console.log(`Starting video file transcription: ${file.name}`);
      const response = await transcribeVideoFile(file);

      if (response.success && response.transcription) {
        setTranscription(response.transcription);
        setSuccess("✓ Video transcribed successfully!");
      } else {
        setError(response.error || "Failed to transcribe video");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveTranscription = () => {
    if (!transcription.trim()) {
      setError("No transcription to save");
      return;
    }

    const newMaterial = {
      id: Date.now().toString(),
      name: `${currentVideoName} - Transcription`,
      content: transcription,
      type: "text" as const,
      uploadedAt: new Date(),
      size: `${(transcription.length / 1024).toFixed(2)} KB`,
      analyzedData: {
        analysisStatus: "pending" as const,
      },
    };

    addMaterial(newMaterial);
    setSuccess(
      `✓ Transcription saved to Materials! You can now use it with AI features.`
    );
    setTranscription("");
    setYoutubeUrl("");

    setTimeout(() => {
      setSuccess("");
      navigate("/upload");
    }, 3000);
  };

  const copyTranscription = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranscription = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(transcription)
    );
    element.setAttribute(
      "download",
      `${currentVideoName}-transcription.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
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
            <h1 className="text-3xl font-bold">Video Transcription</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Transcribe YouTube videos or upload video/audio files. Get accurate text transcriptions for use with AI features.
          </p>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-700 dark:text-green-400"
          >
            {success}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* YouTube URL Input */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-red-600" />
                Transcribe from YouTube
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleYouTubeTranscribe}
                  disabled={isLoading || !youtubeUrl.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe YouTube Video"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supported: youtube.com, youtu.be • Processing may take 1-5 minutes
                </p>
              </div>
            </Card>

            {/* File Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Upload Video or Audio File
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Video className="h-8 w-8 text-primary opacity-50" />
                    <div>
                      <p className="font-medium">Drop video/audio file here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to select
                      </p>
                    </div>
                  </div>
                </button>
                <p className="text-xs text-muted-foreground">
                  Supported: MP4, MOV, AVI, MP3, WAV, M4A (Max 500MB) • Processing may take several minutes
                </p>
              </div>
            </Card>

            {/* Transcription Output */}
            {transcription && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Transcription</h3>
                <Textarea
                  value={transcription}
                  readOnly
                  className="min-h-64 bg-muted text-sm"
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={copyTranscription}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={downloadTranscription}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleSaveTranscription}
                    className="flex-1"
                  >
                    Save to Materials
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">How It Works</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-primary mb-1">1. Provide Video</p>
                  <p className="text-muted-foreground">
                    Paste a YouTube link or upload a video/audio file
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">2. Transcribe</p>
                  <p className="text-muted-foreground">
                    AI converts speech to text automatically
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">3. Save & Use</p>
                  <p className="text-muted-foreground">
                    Save to Materials and use with Chat, Quizzes, and AI features
                  </p>
                </div>
              </div>

              <hr className="my-6" />

              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold mb-2">
                  ⚡ Powered by AssemblyAI
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Free tier: 600 minutes/month. Transcripts are accurate and timestamped.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Transcribe;
