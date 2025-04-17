
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const monthlyRevenue = [
  { name: 'Ene', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 7000 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 8000 },
];

const projectsStats = [
  { name: 'Ene', completed: 4, inProgress: 2, planned: 1 },
  { name: 'Feb', completed: 3, inProgress: 3, planned: 2 },
  { name: 'Mar', completed: 5, inProgress: 2, planned: 3 },
  { name: 'Abr', completed: 7, inProgress: 3, planned: 1 },
  { name: 'May', completed: 6, inProgress: 4, planned: 2 },
  { name: 'Jun', completed: 8, inProgress: 5, planned: 3 },
];

const jumpCategories = [
  { name: 'CRM', value: 35 },
  { name: 'Web App', value: 25 },
  { name: 'Automatización', value: 20 },
  { name: 'Formularios', value: 10 },
  { name: 'Dashboards', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("6m");

  // Only admins should access this page fully
  if (currentUser?.role !== "admin") {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Las estadísticas detalladas solo están disponibles para administradores del sistema.
          </p>
          <Button onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Estadísticas</h1>
            <p className="text-muted-foreground">
              Análisis detallado del rendimiento de la plataforma
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "Función en desarrollo",
                description: "Exportar datos"
              })}
            >
              Exportar
            </Button>
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Último mes</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último año</SelectItem>
                <SelectItem value="all">Todo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
              <CardDescription>Periodo actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                +20% vs periodo anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Proyectos activos</CardTitle>
              <CardDescription>En curso actualmente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                +5 vs periodo anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nuevos clientes</CardTitle>
              <CardDescription>Último mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% vs periodo anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Ingresos</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="jumps">Jumps</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos mensuales</CardTitle>
                  <CardDescription>
                    Evolución de facturación mensual
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Ingresos']} />
                      <Legend />
                      <Bar dataKey="value" name="Ingresos ($)" fill="#D946EF" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de proyectos</CardTitle>
                  <CardDescription>
                    Estado de los proyectos por mes
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectsStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" name="Completados" stroke="#00C49F" strokeWidth={2} />
                      <Line type="monotone" dataKey="inProgress" name="En progreso" stroke="#0088FE" strokeWidth={2} />
                      <Line type="monotone" dataKey="planned" name="Planificados" stroke="#FFBB28" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="jumps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Jumps</CardTitle>
                  <CardDescription>
                    Por categoría
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jumpCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {jumpCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios activos</CardTitle>
                  <CardDescription>
                    Desglose por rol y actividad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">
                      Las métricas de usuarios se están desarrollando.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => toast({
                        title: "Función en desarrollo",
                        description: "Las estadísticas de usuarios estarán disponibles próximamente"
                      })}
                    >
                      Ver estadísticas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Statistics;
