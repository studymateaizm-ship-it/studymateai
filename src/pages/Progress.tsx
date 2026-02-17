import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Calendar, BookOpen, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAI } from "@/context/AIContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Progress = () => {
  const navigate = useNavigate();
  const { isConfigured } = useAI();

  const stats = [
    { label: "Total Study Hours", value: "24.5", change: "+2.3 hrs", trend: "up" },
    { label: "Quizzes Passed", value: "12", change: "+3 this week", trend: "up" },
    { label: "Materials Uploaded", value: "18", change: "5 this month", trend: "up" },
    { label: "Current Streak", value: "7 days", change: "+1 day", trend: "up" },
  ];

  const weeklyData = [
    { day: "Mon", hours: 2, sessions: 3 },
    { day: "Tue", hours: 3.5, sessions: 4 },
    { day: "Wed", hours: 1.5, sessions: 2 },
    { day: "Thu", hours: 4, sessions: 5 },
    { day: "Fri", hours: 2.5, sessions: 3 },
    { day: "Sat", hours: 5, sessions: 6 },
    { day: "Sun", hours: 3.5, sessions: 4 },
  ];

  const subjectProgress = [
    { name: "Biology", progress: 75, quizzes: 5, hours: 12 },
    { name: "Mathematics", progress: 60, quizzes: 3, hours: 8 },
    { name: "Chemistry", progress: 85, quizzes: 7, hours: 10 },
    { name: "Physics", progress: 50, quizzes: 2, hours: 5 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

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
            <h1 className="text-3xl font-bold">Your Progress</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your learning journey and see your improvements
          </p>
        </motion.div>

        {!isConfigured && (
          <Alert className="mb-6 border-amber-500/30 bg-amber-500/5">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>💡 AI Enhancement Available:</strong> Configure Google Gemini or Ollama in your .env file to get personalized learning recommendations and insights!
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{stat.change}</p>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Study Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Study Time
              </h3>

              <div className="space-y-4">
                {weeklyData.map((day, idx) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-sm text-muted-foreground">
                        {day.hours}h • {day.sessions} sessions
                      </span>
                    </div>
                    <div className="w-full h-8 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.hours / maxHours) * 100}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">🎯 Goal:</span> You've studied 24.5 hours this
                  month. Keep it up to reach 100 hours!
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Streak & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Achievements
              </h3>

              <div className="space-y-4">
                {[
                  { icon: "🔥", title: "7-Day Streak", desc: "Keep studying daily" },
                  { icon: "📚", title: "10 Materials", desc: "Upload 10+ materials" },
                  { icon: "✨", title: "Quiz Master", desc: "Score 100% on quiz" },
                ].map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="p-3 bg-muted rounded-lg border border-border hover:border-primary transition"
                  >
                    <span className="text-2xl mb-1 block">{achievement.icon}</span>
                    <p className="font-semibold text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Progress
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjectProgress.map((subject, idx) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={`${getProgressColor(subject.progress)} transition-colors`}
                        strokeDasharray={`${(subject.progress / 100) * 283} 283`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{
                          strokeDasharray: `${(subject.progress / 100) * 283} 283`,
                        }}
                        transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{subject.progress}%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{subject.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {subject.quizzes} quizzes • {subject.hours}h
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;
