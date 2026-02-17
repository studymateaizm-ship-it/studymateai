import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/context/MaterialsContext";
import { useAI } from "@/context/AIContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

type QuestionType = "multiple-choice" | "true-false" | "short-answer" | null;

const Quizzes = () => {
  const navigate = useNavigate();
  const { materials } = useMaterials();
  const { isConfigured, provider } = useAI();
  const [quizStarted, setQuizStarted] = useState(false);
  const [showQuizSettings, setShowQuizSettings] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>(null);
  const [questionQuantity, setQuestionQuantity] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  // Default questions for when no materials are selected
  const defaultQuestions: Question[] = [
    {
      id: 1,
      question: "What is photosynthesis?",
      options: [
        "Breaking down food for energy",
        "Converting light energy into chemical energy",
        "Burning glucose for energy",
        "Splitting water molecules",
      ],
      correctAnswer: 1,
      explanation:
        "Photosynthesis is the process where plants convert light energy (from the sun) into chemical energy (glucose) that they can use for growth and energy.",
    },
    {
      id: 2,
      question: "Where do light reactions occur in a plant cell?",
      options: ["Stroma", "Thylakoid membranes", "Nucleus", "Mitochondria"],
      correctAnswer: 1,
      explanation:
        "Light reactions occur in the thylakoid membranes of the chloroplast, where chlorophyll absorbs light energy.",
    },
    {
      id: 3,
      question: "What is the main product of photosynthesis that plants use for energy?",
      options: ["Oxygen", "Water", "Glucose", "Carbon dioxide"],
      correctAnswer: 2,
      explanation:
        "Glucose is the main product of photosynthesis that plants use for energy and growth. Oxygen is released as a byproduct.",
    },
    {
      id: 4,
      question: "What is the process called that occurs in the stroma?",
      options: [
        "Photolysis",
        "Light reactions",
        "Calvin Cycle",
        "Oxidation",
      ],
      correctAnswer: 2,
      explanation:
        "The Calvin Cycle (also called dark reactions) occurs in the stroma and uses ATP and NADPH from light reactions to fix carbon dioxide into glucose.",
    },
    {
      id: 5,
      question: "Which wavelengths of light are most effective for photosynthesis?",
      options: [
        "Green light only",
        "Blue and red light",
        "Infrared and ultraviolet",
        "All visible wavelengths equally",
      ],
      correctAnswer: 1,
      explanation:
        "Blue light (400-450nm) and red light (640-680nm) are most effective for photosynthesis. Green light passes through plants, which is why they appear green.",
    },
  ];

  const getQuestionsForMaterial = (materialId: string): Question[] => {
    const material = materials.find((m) => m.id === materialId);
    
    // Check if material has pre-analyzed questions
    if (material?.analyzedData?.generatedQuestions && 
        material.analyzedData.generatedQuestions.length > 0 &&
        material.analyzedData.analysisStatus === "completed") {
      // Convert analyzed questions to Question format if needed
      return material.analyzedData.generatedQuestions.map((q: any, idx: number) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));
    }
    
    if (material?.name.includes("Photosynthesis")) {
      return defaultQuestions;
    }
    
    // Generic questions for other materials
    return [
      {
        id: 1,
        question: "What is the main topic of your material?",
        options: ["Science", "History", "Literature", "Mathematics"],
        correctAnswer: 0,
        explanation: "This question tests your understanding of the main subject matter.",
      },
      {
        id: 2,
        question: "Can you identify key concepts from the material?",
        options: ["Yes, easily", "Somewhat", "Not really", "Need more review"],
        correctAnswer: 0,
        explanation: "Understanding key concepts is essential for mastering any subject.",
      },
      {
        id: 3,
        question: "How would you apply this knowledge?",
        options: ["In practice", "In theory", "Both equally", "Unclear"],
        correctAnswer: 2,
        explanation: "The best learning combines both theoretical understanding and practical application.",
      },
    ];
  };

  const getMaterialAnalysisStatus = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    return material?.analyzedData?.analysisStatus || "pending";
  };

  const currentQuestions = selectedMaterial
    ? getQuestionsForMaterial(selectedMaterial)
    : defaultQuestions;

  const handleSelectMaterial = (materialId: string) => {
    setSelectedMaterial(materialId);
  };

  const handleStartQuizSettings = () => {
    if (materials.length > 0 && !selectedMaterial) {
      setError("Please select a material");
      return;
    }
    setShowQuizSettings(true);
  };

  const handleConfirmSettings = () => {
    if (!questionType) {
      setError("Please select a question type");
      return;
    }
    if (questionQuantity < 1 || questionQuantity > currentQuestions.length) {
      setError(`Please select a valid question quantity (1-${currentQuestions.length})`);
      return;
    }
    setError("");
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowQuizSettings(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setShowResult(false);
    setQuestionType(null);
    setQuestionQuantity(5);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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
            <h1 className="text-3xl font-bold">Interactive Quizzes</h1>
          </div>
        </motion.div>

        {!isConfigured && (
          <Alert className="mb-6 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>💡 AI Enhancement Available:</strong> Configure Google Gemini or Ollama in your .env file to generate unlimited custom quiz questions from your materials!
            </AlertDescription>
          </Alert>
        )}

        {!quizStarted ? (
          // Quiz Selection & Settings
          <div className="max-w-2xl mx-auto">
            {!showQuizSettings ? (
              // Material Selection Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {error && (
                  <Alert className="border-red-500/30 bg-red-500/5">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {materials.length > 0 && (
                  <Card className="p-6 mb-6 border-blue-500/30 bg-blue-500/5">
                    <h3 className="font-semibold mb-4">Select Material for Quiz:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {materials.map((material) => {
                        const analysisStatus = material.analyzedData?.analysisStatus || "pending";
                        const isAnalyzing = analysisStatus === "analyzing";
                        const isCompleted = analysisStatus === "completed";
                        
                        return (
                          <button
                            key={material.id}
                            onClick={() => handleSelectMaterial(material.id)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              selectedMaterial === material.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{material.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {material.content.split(" ").length} words
                                </p>
                              </div>
                              <div className="text-xs font-medium ml-2">
                                {isAnalyzing && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                    <span className="animate-spin">⚙️</span> Analyzing
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-300">
                                    ✓ Ready
                                  </span>
                                )}
                                {analysisStatus === "failed" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-700 dark:text-red-300">
                                    ✗ Failed
                                  </span>
                                )}
                                {analysisStatus === "pending" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-500/20 text-gray-700 dark:text-gray-300">
                                    ⧗ Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                )}

                <Card className="p-8 text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedMaterial
                      ? materials.find((m) => m.id === selectedMaterial)?.name || "Quiz"
                      : "Photosynthesis"}{" "}
                    Quiz
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Test your knowledge about{" "}
                    {selectedMaterial
                      ? materials.find((m) => m.id === selectedMaterial)?.name
                      : "photosynthesis"}.
                  </p>
                  <div className="flex justify-center gap-8 mb-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {currentQuestions.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Questions Available</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">Flexible</p>
                      <p className="text-sm text-muted-foreground">Choose Quantity</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">Custom</p>
                      <p className="text-sm text-muted-foreground">Pick Question Type</p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleStartQuizSettings}
                    className="w-full"
                    disabled={materials.length > 0 && !selectedMaterial}
                  >
                    Continue to Settings
                  </Button>
                </Card>

                {materials.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-amber-500/10 border border-amber-500/30 rounded flex items-start gap-2"
                  >
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-900 dark:text-amber-200">
                        No materials uploaded
                      </p>
                      <p className="text-amber-800 dark:text-amber-300">
                        Upload your notes to generate custom quizzes!
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Quiz Settings Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Quiz Settings</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuizSettings(false)}
                  >
                    Back
                  </Button>
                </div>

                {error && (
                  <Alert className="border-red-500/30 bg-red-500/5">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="p-8">
                  <h3 className="text-lg font-semibold mb-6">Question Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                      onClick={() => setQuestionType("multiple-choice")}
                      className={`p-6 rounded-lg border-2 transition-all text-center ${
                        questionType === "multiple-choice"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold mb-2">Multiple Choice</p>
                      <p className="text-sm text-muted-foreground">
                        Pick the correct answer from 4 options
                      </p>
                    </button>

                    <button
                      onClick={() => setQuestionType("true-false")}
                      className={`p-6 rounded-lg border-2 transition-all text-center ${
                        questionType === "true-false"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold mb-2">True / False</p>
                      <p className="text-sm text-muted-foreground">
                        Quick and straightforward questions
                      </p>
                    </button>

                    <button
                      onClick={() => setQuestionType("short-answer")}
                      className={`p-6 rounded-lg border-2 transition-all text-center ${
                        questionType === "short-answer"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold mb-2">Short Answer</p>
                      <p className="text-sm text-muted-foreground">
                        Fill in the blank or answer briefly
                      </p>
                    </button>
                  </div>

                  <hr className="my-8" />

                  <h3 className="text-lg font-semibold mb-6">Number of Questions</h3>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">
                        Questions: {questionQuantity}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        Max: {currentQuestions.length}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={currentQuestions.length}
                      value={questionQuantity}
                      onChange={(e) => setQuestionQuantity(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-3">
                      <span>1</span>
                      <span>{Math.ceil(currentQuestions.length / 2)}</span>
                      <span>{currentQuestions.length}</span>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-8">
                    <p className="text-sm text-muted-foreground">
                      <strong>Estimated time:</strong> {Math.ceil(questionQuantity * 1.5)} minutes
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleConfirmSettings}
                    className="w-full"
                    disabled={!questionType}
                  >
                    Start Quiz
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>
        ) : completed ? (
          // Quiz Completed
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground mb-8">Great job! Here's how you did:</p>

                <div className="bg-muted p-8 rounded-lg mb-8">
                  <p className="text-5xl font-bold text-primary mb-2">
                    {((score / currentQuestions.length) * 100).toFixed(0)}%
                  </p>
                  <p className="text-lg">
                    You got <span className="font-bold">{score}</span> out of{" "}
                    <span className="font-bold">{currentQuestions.length}</span> correct
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 gap-2" onClick={resetQuiz}>
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : (
          // Quiz In Progress
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentQuestion}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    Question {currentQuestion + 1} of {currentQuestions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <Card className="p-8 mb-8">
                <h3 className="text-xl font-bold mb-8">
                  {currentQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3 mb-8">
                  {currentQuestions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => !showResult && handleAnswer(index)}
                      disabled={showResult}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedAnswer === index
                          ? currentQuestions[currentQuestion].correctAnswer === index
                            ? "bg-green-500/20 border border-green-500"
                            : "bg-red-500/20 border border-red-500"
                          : showResult &&
                            currentQuestions[currentQuestion].correctAnswer === index
                          ? "bg-green-500/20 border border-green-500"
                          : "bg-muted border border-transparent hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedAnswer === index
                              ? currentQuestions[currentQuestion].correctAnswer ===
                                index
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                              : showResult &&
                                currentQuestions[currentQuestion].correctAnswer ===
                                  index
                              ? "bg-green-500 text-white"
                              : "bg-muted-foreground/30"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {selectedAnswer === index &&
                          currentQuestions[currentQuestion].correctAnswer === index && (
                            <Check className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                        {selectedAnswer === index &&
                          currentQuestions[currentQuestion].correctAnswer !== index && (
                            <X className="h-5 w-5 text-red-500 ml-auto" />
                          )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8"
                  >
                    <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      Explanation
                    </p>
                    <p className="text-sm">{currentQuestions[currentQuestion].explanation}</p>
                  </motion.div>
                )}

                {showResult && (
                  <Button onClick={handleNext} className="w-full">
                    {currentQuestion === currentQuestions.length - 1
                      ? "See Results"
                      : "Next Question"}
                  </Button>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
