import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Upload, FileText, CheckCircle2, Target, BookOpen, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const features = [
    {
      icon: Brain,
      title: "AI Chat Tutor",
      description: "Chat with your personal AI tutor 24/7",
      path: "/chat",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Upload,
      title: "Upload Notes",
      description: "Upload and manage your study materials",
      path: "/upload",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileText,
      title: "Summarize",
      description: "Get AI-powered summaries of your notes",
      path: "/summarize",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: CheckCircle2,
      title: "Solve Assignments",
      description: "Get step-by-step solutions to assignments",
      path: "/solver",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Target,
      title: "Quizzes",
      description: "Test your knowledge with AI-generated quizzes",
      path: "/quizzes",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: BarChart3,
      title: "Progress",
      description: "Track your learning journey and improvements",
      path: "/progress",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose a feature to get started with your AI-powered learning journey
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="ghost" size="sm" className="gap-2">
                  Open →
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
