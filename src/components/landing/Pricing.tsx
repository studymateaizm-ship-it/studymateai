import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out StudyMate AI",
    price: "K0",
    period: "forever",
    icon: Sparkles,
    features: [
      "5 AI chat messages per day",
      "2 document uploads per month",
      "Basic summarization",
      "Limited quiz generation",
      "Community support",
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Student",
    description: "For serious learners who want more",
    price: "K49",
    period: "per month",
    icon: Zap,
    features: [
      "Unlimited AI chat messages",
      "50 document uploads per month",
      "Advanced summarization",
      "Unlimited quizzes",
      "Assignment solver",
      "Priority support",
      "Study analytics",
    ],
    cta: "Start 7-Day Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Pro",
    description: "For power users and exam preparation",
    price: "K99",
    period: "per month",
    icon: Crown,
    features: [
      "Everything in Student",
      "Unlimited document uploads",
      "Exam-focused study plans",
      "Mock exam generation",
      "1-on-1 study coaching",
      "API access",
      "Team collaboration",
    ],
    cta: "Go Pro",
    variant: "accent" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 gradient-hero">
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
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Affordable Plans in{" "}
            <span className="text-gradient-accent">Zambian Kwacha</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. Pay with Mobile Money or Bank Transfer.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl bg-card border ${
                plan.popular ? "border-primary shadow-glow" : "border-border shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? "gradient-primary" : "bg-secondary"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full" size="lg">
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">Accepted Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["MTN Mobile Money", "Airtel Money", "Zanaco", "Stanbic Bank", "FNB"].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground"
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
