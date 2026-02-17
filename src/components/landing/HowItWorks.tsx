import { motion } from "framer-motion";
import { Upload, Brain, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Materials",
    description:
      "Upload your lecture notes, textbooks, or any study materials. Our AI can process PDFs, images, and even handwritten notes.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes Content",
    description:
      "Our advanced AI reads and understands your materials, creating a knowledge base specifically for your courses.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get Personalized Help",
    description:
      "Ask questions, get summaries, solve assignments, and take quizzes tailored to your specific learning needs.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Track Your Progress",
    description:
      "Monitor your learning journey with detailed analytics. See your improvements and areas that need more attention.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient">StudyMate AI</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes and transform your study experience
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card p-6 rounded-2xl border border-border shadow-card text-center">
                <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-5xl font-extrabold text-muted/20 absolute top-4 right-4">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
