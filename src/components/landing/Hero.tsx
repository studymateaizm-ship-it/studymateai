import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning for Zambian Students</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            Study Smarter, Not Harder with{" "}
            <span className="text-gradient">AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Upload your notes, get instant summaries, solve assignments, and chat with your AI tutor 24/7. 
            Personalized learning made affordable for every Zambian student.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button variant="hero" size="xl" className="gap-2" onClick={() => navigate("/dashboard")}>
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Brain, label: "AI Tutor" },
              { icon: BookOpen, label: "Smart Notes" },
              { icon: MessageSquare, label: "24/7 Support" },
              { icon: Sparkles, label: "Personalized" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-card border border-border"
              >
                <item.icon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            <div className="absolute top-0 left-0 right-0 h-10 bg-secondary flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
            </div>
            <div className="pt-10 p-6">
              {/* Chat Preview */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="gradient-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-none p-4 max-w-md">
                    <p className="text-sm text-foreground">
                      Hello! I'm your AI study assistant. How can I help you today? I can explain concepts, solve problems, or summarize your notes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="gradient-primary rounded-2xl rounded-tr-none p-4 max-w-md">
                    <p className="text-sm text-primary-foreground">
                      Can you help me understand photosynthesis for my biology exam?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="gradient-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-none p-4 max-w-lg">
                    <p className="text-sm text-foreground">
                      Of course! Photosynthesis is the process plants use to convert sunlight into energy. The equation is: 
                      <span className="block mt-2 font-mono bg-muted px-2 py-1 rounded text-xs">
                        6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
                      </span>
                      <span className="block mt-2">Would you like me to break down each step?</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
