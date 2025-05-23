
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeData } from "@/lib/storageService";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import JumpsCatalog from "./pages/JumpsCatalog";
import Messages from "./pages/Messages";
import Clients from "./pages/Clients";
import Copilots from "./pages/Copilots";
import Jumps from "./pages/Jumps";
import Payments from "./pages/Payments";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Visitor Pages
import Home from "./pages/visitor/Home";
import VisitorJumps from "./pages/visitor/Jumps";
import VisitorCopilots from "./pages/visitor/Copilots";
import CustomProposal from "./pages/visitor/CustomProposal";

const queryClient = new QueryClient();

function App() {
  // Initialize sample data on first load
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Visitor Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/visitor/jumps" element={<VisitorJumps />} />
              <Route path="/visitor/copilots" element={<VisitorCopilots />} />
              <Route path="/visitor/custom-proposal" element={<CustomProposal />} />
              
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* App Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/jumps-catalog" element={<JumpsCatalog />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/copilots" element={<Copilots />} />
              <Route path="/jumps" element={<Jumps />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
