import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  MessageSquare,
  Upload,
  CheckCircle2,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Chat Tutor",
    description:
      "Get instant answers to your questions 24/7. Our AI tutor explains concepts in simple terms and adapts to your learning style.",
    highlights: ["24/7 availability", "Personalized explanations", "Multiple subjects"],
  },
  {
    icon: Upload,
    title: "Upload Notes & Books",
    description:
      "Upload your lecture notes, textbooks, or any study material. Our AI processes and understands your content for better assistance.",
    highlights: ["PDF & image support", "Handwritten notes", "Textbook chapters"],
  },
  {
    icon: FileText,
    title: "Smart Summarization",
    description:
      "Transform lengthy documents into concise, easy-to-understand summaries. Save hours of reading time.",
    highlights: ["Key points extraction", "Custom summary length", "Highlight important topics"],
  },
  {
    icon: CheckCircle2,
    title: "Solve Assignments",
    description:
      "Upload any assignment or test, and get step-by-step solutions with detailed explanations to help you learn.",
    highlights: ["Step-by-step solutions", "Multiple approaches", "Learn while solving"],
  },
  {
    icon: Target,
    title: "Interactive Quizzes",
    description:
      "Test your knowledge with AI-generated quizzes based on your study material. Track your progress over time.",
    highlights: ["Auto-generated questions", "Progress tracking", "Difficulty adjustment"],
  },
  {
    icon: BookOpen,
    title: "Study Recommendations",
    description:
      "Get personalized study plans based on your goals, schedule, and learning progress. Study what matters most.",
    highlights: ["Custom study plans", "Weakness identification", "Exam preparation"],
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From AI tutoring to assignment help, we've got all the tools you need to succeed in your studies.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
