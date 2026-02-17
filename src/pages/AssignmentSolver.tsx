import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/context/MaterialsContext";
import { useAI } from "@/context/AIContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Solution {
  step: number;
  title: string;
  explanation: string;
}

const AssignmentSolver = () => {
  const navigate = useNavigate();
  const { materials } = useMaterials();
  const { isConfigured } = useAI();
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState<Solution[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMaterialSuggestion, setShowMaterialSuggestion] = useState(false);
  const [error, setError] = useState("");

  const generateSolutionForPhotosynthesis = (): Solution[] => {
    return [
      {
        step: 1,
        title: "Understand the Problem",
        explanation:
          "Read the question carefully and identify what's being asked. For photosynthesis questions, determine if it's about light reactions, Calvin Cycle, or the overall process.",
      },
      {
        step: 2,
        title: "Identify from Your Materials",
        explanation:
          "Reference your uploaded materials on Photosynthesis. Look for relevant concepts such as: thylakoid membranes, stroma, chlorophyll, ATP, NADPH, CO₂ fixation, and glucose production.",
      },
      {
        step: 3,
        title: "Apply the Chemical Equation",
        explanation:
          "Remember the equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Understand What goes in, what happens, and what comes out.",
      },
      {
        step: 4,
        title: "Explain Light Wavelengths",
        explanation:
          "If about light: Blue light (400-450nm) and red light (640-680nm) are most effective. Green light passes through plants. Chlorophyll and carotenoids absorb different wavelengths.",
      },
      {
        step: 5,
        title: "Connect to Your Learning",
        explanation:
          "Verify your answer makes sense with the concepts in your materials. Photosynthesis is about converting light energy to chemical energy in glucose, releasing oxygen.",
      },
    ];
  };

  const handleSolve = () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setShowMaterialSuggestion(materials.length > 0);

    // Simulate API call
    setTimeout(() => {
      let generatedSolution: Solution[] = [];

      if (materials.some((m) => m.name.includes("Photosynthesis"))) {
        if (
          question.toLowerCase().includes("photosynthesis") ||
          question.toLowerCase().includes("light reaction") ||
          question.toLowerCase().includes("calvin")
        ) {
          generatedSolution = generateSolutionForPhotosynthesis();
        } else {
          // Generic solution
          generatedSolution = [
            {
              step: 1,
              title: "Understand the Problem",
              explanation:
                "Read the question carefully and identify what's being asked. Break down the problem into smaller parts.",
            },
            {
              step: 2,
              title: "Check Your Materials",
              explanation:
                "Review your uploaded materials to find relevant concepts and definitions that apply to this question.",
            },
            {
              step: 3,
              title: "Apply Relevant Concept",
              explanation:
                "Connect the concepts from your materials to the problem. Think about similar examples from your notes.",
            },
            {
              step: 4,
              title: "Work Through Solution",
              explanation:
                "Follow a logical sequence of steps using the methods and concepts from your materials. Show your work clearly.",
            },
            {
              step: 5,
              title: "Verify Your Answer",
              explanation:
                "Check your answer against the explanations in your materials. Make sure it makes sense in context.",
            },
          ];
        }
      } else {
        // Default generic solution
        generatedSolution = [
          {
            step: 1,
            title: "Understand the Problem",
            explanation:
              "Read the question carefully and identify what's being asked. Break down the problem into smaller parts.",
          },
          {
            step: 2,
            title: "Identify Key Information",
            explanation:
              "Extract the important details from the problem. List what you know and what you need to find.",
          },
          {
            step: 3,
            title: "Apply Relevant Concept",
            explanation:
              "Think about which concepts or formulas apply to this problem. Consider any similar problems you've solved.",
          },
          {
            step: 4,
            title: "Work Through Solution",
            explanation:
              "Follow a logical sequence of steps. Show all your work and explain each calculation or reasoning.",
          },
          {
            step: 5,
            title: "Verify Your Answer",
            explanation:
              "Check your answer by substituting back or using an alternative method. Make sure it makes sense in context.",
          },
        ];
      }

      setSolution(generatedSolution);
      setIsLoading(false);
    }, 2000);
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
            <h1 className="text-3xl font-bold">Assignment Solver</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {materials.length > 0
              ? "Upload or paste your assignment and get step-by-step solutions using your materials"
              : "Upload or paste your assignment and get step-by-step solutions"}
          </p>
        </motion.div>

        {!isConfigured && (
          <Alert className="mb-6 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>💡 AI Enhancement Available:</strong> Configure Google Gemini or Ollama in your .env file to get AI-powered step-by-step solutions!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Your Assignment</h3>

              {materials.length > 0 && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    📚 Using {materials.length} material{materials.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-blue-800 dark:text-blue-300">
                    {materials.map((m) => m.name).join(", ")}
                  </p>
                </div>
              )}

              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload assignment image or PDF</p>
                <Button variant="outline" size="sm">Upload File</Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              {/* Text Input */}
              <Textarea
                placeholder="Paste your assignment question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-40 mb-4 resize-none"
              />

              <Button
                onClick={handleSolve}
                disabled={isLoading || !question.trim()}
                className="w-full gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                {isLoading ? "Solving..." : "Get Solution"}
              </Button>

              {materials.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-200">Tip</p>
                    <p className="text-amber-800 dark:text-amber-300">Upload materials for smarter solutions!</p>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Solution Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {isLoading ? (
              <Card className="p-12 flex items-center justify-center min-h-96">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent"
                />
              </Card>
            ) : solution ? (
              <div className="space-y-4">
                {showMaterialSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-500/10 border border-blue-500/30 rounded flex items-start gap-2"
                  >
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-200">
                        Solution uses your materials
                      </p>
                      <p className="text-blue-800 dark:text-blue-300">
                        Steps reference concepts from your uploaded content for better accuracy.
                      </p>
                    </div>
                  </motion.div>
                )}
                {solution.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-6 border-l-4 border-l-primary">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">{step.step}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                          <p className="text-muted-foreground">{step.explanation}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                <Card className="p-6 bg-green-500/10 border-green-500/30">
                  <p className="text-sm text-foreground">
                    ✅ <span className="font-semibold">Learning Tip:</span> Try to understand each step rather than just copying the answer. This will help you solve similar problems independently!
                  </p>
                </Card>
              </div>
            ) : (
              <Card className="p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter your assignment question to get a step-by-step solution
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSolver;
