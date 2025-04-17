
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToLine, Edit, Plus, RefreshCw, Save, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

// Interface for custom report
interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: 'bar' | 'line' | 'pie';
  data: Array<{ name: string; value: number }>;
}

// Schema for custom report form
const reportSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  type: z.enum(['bar', 'line', 'pie']),
  dataPoints: z.array(
    z.object({
      name: z.string().min(1, "El nombre del punto es requerido"),
      value: z.number().min(0, "El valor debe ser mayor o igual a 0"),
    })
  ).min(1, "Al menos un punto de datos es requerido"),
});

type DataPoint = {
  name: string;
  value: number;
};

const Statistics = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("6m");
  const [activeTab, setActiveTab] = useState("revenue");
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "create" | "edit">("view");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ name: "", value: 0 }]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "bar",
      dataPoints: [{ name: "", value: 0 }],
    },
  });

  useEffect(() => {
    if (selectedReport && viewMode === "edit") {
      form.reset({
        name: selectedReport.name,
        description: selectedReport.description || "",
        type: selectedReport.type,
        dataPoints: selectedReport.data,
      });
      setDataPoints(selectedReport.data);
    } else if (viewMode === "create") {
      form.reset({
        name: "",
        description: "",
        type: "bar",
        dataPoints: [{ name: "", value: 0 }],
      });
      setDataPoints([{ name: "", value: 0 }]);
    }
  }, [selectedReport, viewMode]);

  const handleAddDataPoint = () => {
    setDataPoints([...dataPoints, { name: "", value: 0 }]);
  };

  const handleRemoveDataPoint = (index: number) => {
    const newPoints = [...dataPoints];
    newPoints.splice(index, 1);
    setDataPoints(newPoints);
    form.setValue("dataPoints", newPoints);
  };

  const handleUpdateDataPoint = (index: number, field: "name" | "value", value: string | number) => {
    const newPoints = [...dataPoints];
    if (field === "name") {
      newPoints[index].name = value as string;
    } else {
      newPoints[index].value = Number(value);
    }
    setDataPoints(newPoints);
    form.setValue("dataPoints", newPoints);
  };

  const handleSaveReport = (data: z.infer<typeof reportSchema>) => {
    if (viewMode === "create") {
      const newReport: CustomReport = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || "",
        type: data.type,
        data: data.dataPoints,
      };
      setCustomReports([...customReports, newReport]);
      toast({
        title: "Reporte creado",
        description: "El reporte personalizado ha sido creado con éxito",
      });
    } else if (viewMode === "edit" && selectedReport) {
      const updatedReports = customReports.map(report => 
        report.id === selectedReport.id 
          ? { ...report, name: data.name, description: data.description || "", type: data.type, data: data.dataPoints }
          : report
      );
      setCustomReports(updatedReports);
      setSelectedReport({ 
        ...selectedReport, 
        name: data.name, 
        description: data.description || "", 
        type: data.type, 
        data: data.dataPoints 
      });
      toast({
        title: "Reporte actualizado",
        description: "El reporte personalizado ha sido actualizado con éxito",
      });
    }
    
    setViewMode("view");
    form.reset();
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = customReports.filter(report => report.id !== id);
    setCustomReports(updatedReports);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
    toast({
      title: "Reporte eliminado",
      description: "El reporte personalizado ha sido eliminado con éxito",
    });
  };

  const renderChart = (report: CustomReport) => {
    switch(report.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={report.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Valor" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={report.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Valor" stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={report.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {report.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Valor']} />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

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
              <ArrowDownToLine className="h-4 w-4 mr-2" />
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
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Ingresos</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="jumps">Jumps</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="custom">Reportes Personalizados</TabsTrigger>
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
            <TabsContent value="custom" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Reportes Personalizados</h2>
                {viewMode === "view" && (
                  <Button onClick={() => setViewMode("create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Reporte
                  </Button>
                )}
              </div>
              
              {viewMode === "view" && (
                <>
                  {customReports.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {customReports.map(report => (
                        <Card key={report.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle>{report.name}</CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px]">
                              {renderChart(report)}
                            </div>
                          </CardContent>
                          <div className="bg-muted/50 p-4 flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setSelectedReport(report);
                              setViewMode("edit");
                            }}>
                              <Edit className="h-3.5 w-3.5 mr-1.5" />
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteReport(report.id)}>
                              <Trash className="h-3.5 w-3.5 mr-1.5" />
                              Eliminar
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-10">
                        <div className="flex flex-col items-center justify-center text-center">
                          <h3 className="text-lg font-medium mb-2">No hay reportes personalizados</h3>
                          <p className="text-muted-foreground mb-4">
                            Crea tu primer reporte personalizado haciendo clic en el botón "Nuevo Reporte"
                          </p>
                          <Button onClick={() => setViewMode("create")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Reporte
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
              
              {(viewMode === "create" || viewMode === "edit") && (
                <Card>
                  <CardHeader>
                    <CardTitle>{viewMode === "create" ? "Crear Nuevo Reporte" : "Editar Reporte"}</CardTitle>
                    <CardDescription>
                      {viewMode === "create" 
                        ? "Crea un reporte personalizado con tus propios datos" 
                        : "Modifica los datos y configuración del reporte"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSaveReport)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre del Reporte</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ej: Ventas por Región" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Gráfico</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="bar">Barras</SelectItem>
                                    <SelectItem value="line">Línea</SelectItem>
                                    <SelectItem value="pie">Circular</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Breve descripción del reporte" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="md:col-span-2">
                            <FormLabel>Puntos de Datos</FormLabel>
                            <FormDescription className="mb-2">
                              Añade los puntos de datos para tu reporte
                            </FormDescription>
                            <div className="space-y-3">
                              {dataPoints.map((point, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                  <Input
                                    placeholder="Nombre"
                                    value={point.name}
                                    onChange={(e) => handleUpdateDataPoint(index, "name", e.target.value)}
                                    className="flex-grow"
                                  />
                                  <Input
                                    placeholder="Valor"
                                    type="number"
                                    value={point.value}
                                    onChange={(e) => handleUpdateDataPoint(index, "value", e.target.value)}
                                    className="w-32"
                                  />
                                  {dataPoints.length > 1 && (
                                    <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="icon" 
                                      onClick={() => handleRemoveDataPoint(index)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleAddDataPoint}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Añadir Punto
                              </Button>
                            </div>
                            {form.formState.errors.dataPoints && (
                              <p className="text-sm font-medium text-destructive mt-2">
                                {form.formState.errors.dataPoints.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setViewMode("view");
                              setSelectedReport(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            {viewMode === "create" ? "Crear Reporte" : "Guardar Cambios"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Statistics;
