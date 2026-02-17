import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    const success = await login(email, password);

    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Only the owner can access the admin panel.");
      setShowHint(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Owner Access Only</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-900 dark:text-red-200">
                Restricted Access
              </p>
              <p className="text-red-800 dark:text-red-300">
                Only the owner can access this panel
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="owner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full mb-4"
            size="lg"
          >
            {isLoading ? "Verifying..." : "Sign In"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "Hide" : "Show"} Demo Credentials
          </Button>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-900 dark:text-blue-200"
            >
              <p className="font-medium mb-2">Demo Credentials:</p>
              <p className="mb-1">Email: <code className="bg-blue-950/30 px-1 rounded">admin@studymateai.com</code></p>
              <p>Password: <code className="bg-blue-950/30 px-1 rounded">admin123</code></p>
            </motion.div>
          )}

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-900 dark:text-amber-200">
            <p className="font-medium mb-1">⚠️ Security Notice</p>
            <p>This is a secure area. Only the system owner should have access. Change the default credentials immediately after deployment.</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
