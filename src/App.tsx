
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ExamProvider } from "@/contexts/ExamContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ExamsList from "./pages/exams/ExamsList";
import CreateExam from "./pages/exams/CreateExam";
import ExamDetail from "./pages/exams/ExamDetail";
import ResultDetail from "./pages/results/ResultDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubjectsManagement from "./pages/admin/SubjectsManagement";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ExamProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exams" element={<ExamsList />} />
              <Route path="/exams/create" element={<CreateExam />} />
              <Route path="/exams/:id" element={<ExamDetail />} />
              <Route path="/results/:id" element={<ResultDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/subjects" element={<SubjectsManagement />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ExamProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
