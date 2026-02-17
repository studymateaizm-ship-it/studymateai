import { ReactNode, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NoticeContextType {
  isNoticeAccepted: boolean;
  acceptNotice: () => void;
  rejectNotice: () => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [isNoticeAccepted, setIsNoticeAccepted] = useState(() => {
    const stored = localStorage.getItem("noticeAccepted");
    return stored === "true";
  });

  const acceptNotice = () => {
    localStorage.setItem("noticeAccepted", "true");
    setIsNoticeAccepted(true);
  };

  const rejectNotice = () => {
    localStorage.removeItem("noticeAccepted");
    setIsNoticeAccepted(false);
  };

  return (
    <NoticeContext.Provider value={{ isNoticeAccepted, acceptNotice, rejectNotice }}>
      {!isNoticeAccepted && <NoticeModal onAccept={acceptNotice} />}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error("useNotice must be used within NoticeProvider");
  }
  return context;
};

interface NoticeModalProps {
  onAccept: () => void;
}

const NoticeModal = ({ onAccept }: NoticeModalProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const allAgreed = agreedToTerms && agreedToPrivacy;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome to StudyMate AI</h1>
              <p className="text-sm text-muted-foreground">Please read and accept our terms</p>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto mb-6 bg-muted/50 p-4 rounded-lg">
            <div>
              <h2 className="font-bold text-lg mb-2">📋 Terms of Service</h2>
              <p className="text-sm text-muted-foreground mb-3">
                By using StudyMate AI, you agree to:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Use this platform for educational purposes only</li>
                <li>✓ Not upload copyrighted materials without permission</li>
                <li>✓ Not attempt to access other users' materials</li>
                <li>✓ Follow all applicable laws and regulations</li>
                <li>✓ Use AI-generated content responsibly and ethically</li>
                <li>✓ Not reverse engineer or misuse the AI system</li>
                <li>✓ Accept that the platform is provided "as-is"</li>
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <h2 className="font-bold text-lg mb-2">🔒 Privacy & Data Processing</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Your materials and data handling:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Your uploaded materials are stored locally in your browser</li>
                <li>✓ AI analysis happens in real-time without storing data on servers</li>
                <li>✓ We do not track or sell your personal information</li>
                <li>✓ Your study data remains private and under your control</li>
                <li>✓ Clear your browser data to delete all stored materials</li>
                <li>✓ Document/image analysis uses client-side processing</li>
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <h2 className="font-bold text-lg mb-2">📄 Content Analysis</h2>
              <p className="text-sm text-muted-foreground mb-3">
                How we analyze your materials:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ All document text extraction happens on your device</li>
                <li>✓ All image OCR (text from images) happens locally</li>
                <li>✓ PDF text extraction is performed client-side</li>
                <li>✓ No content is sent to external servers for analysis</li>
                <li>✓ Your materials are only used for your own learning</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                I agree to the Terms of Service and understand the content policies
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                I understand how my materials are processed and stored
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!allAgreed}
            >
              Decline
            </Button>
            <Button
              onClick={onAccept}
              disabled={!allAgreed}
              className="flex-1 gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              I Accept & Continue
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
