
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        navigate("/dashboard");
      }
    }, 1000);
  };

  // For demo purposes, add predefined users to login easily
  const loginAsAdmin = () => {
    setEmail("admin@aihcopilot.com");
    setPassword("password");
  };

  const loginAsCopilot = () => {
    setEmail("copilot@aihcopilot.com");
    setPassword("password");
  };

  const loginAsClient = () => {
    setEmail("client@example.com");
    setPassword("password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-darkBlack">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bloodRed mb-2">AI HUMAN COPILOT</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tecnología avanzada con asistencia humana
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a la plataforma
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-bloodRed hover:text-red-800"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-bloodRed hover:bg-red-800"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="text-bloodRed hover:text-red-800">
                    Regístrate
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Quick login buttons for demo */}
        <div className="mt-6 space-y-3">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">Demo de inicio rápido:</p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={loginAsAdmin}
              className="text-xs"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loginAsCopilot}
              className="text-xs"
            >
              Copiloto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loginAsClient}
              className="text-xs"
            >
              Cliente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
