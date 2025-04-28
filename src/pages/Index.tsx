
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        // Instead of navigating to login, let's use the visitor home page as our main entry point
        navigate("/");
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-darkBlack">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-bloodRed mb-4">AI HUMAN COPILOT</h1>
        <div className="animate-pulse">Cargando...</div>
      </div>
    </div>
  );
};

export default Index;
