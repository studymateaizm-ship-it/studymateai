import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MaterialsProvider } from "@/context/MaterialsContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { NoticeProvider } from "@/context/NoticeContext";
import { AIProvider } from "@/context/AIContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatTutor from "./pages/ChatTutor";
import UploadNotes from "./pages/UploadNotes";
import Transcribe from "./pages/Transcribe";
import Summarize from "./pages/Summarize";
import AssignmentSolver from "./pages/AssignmentSolver";
import Quizzes from "./pages/Quizzes";
import Progress from "./pages/Progress";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminContent from "./pages/AdminContent";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <UserAuthProvider>
        <NoticeProvider>
          <AIProvider>
            <MaterialsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Student Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <UserProtectedRoute>
                    <Dashboard />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <UserProtectedRoute>
                    <ChatTutor />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <UserProtectedRoute>
                    <UploadNotes />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/transcribe"
                element={
                  <UserProtectedRoute>
                    <Transcribe />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/summarize"
                element={
                  <UserProtectedRoute>
                    <Summarize />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/solver"
                element={
                  <UserProtectedRoute>
                    <AssignmentSolver />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/quizzes"
                element={
                  <UserProtectedRoute>
                    <Quizzes />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <UserProtectedRoute>
                    <Progress />
                  </UserProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/content"
                element={
                  <ProtectedRoute>
                    <AdminContent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <AdminReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MaterialsProvider>
          </AIProvider>
        </NoticeProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
