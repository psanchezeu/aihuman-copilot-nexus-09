
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, CheckCircle, Circle, Copy, CopyCheck, Edit, PlusCircle, Search, Trash, User, User2, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Project, User as UserModel, Jump } from "@/lib/models";
import { getProjects, createProject, updateProject, deleteProject, getUsersByRole, getJumps } from "@/lib/storageService";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  description: z.string().optional(),
  clientId: z.string().min(1, {
    message: "Debes seleccionar un cliente.",
  }),
  copilotId: z.string().min(1, {
    message: "Debes seleccionar un copiloto.",
  }),
  status: z.enum(["planned", "in_progress", "completed"]),
  startDate: z.date(),
  estimatedEndDate: z.date(),
  totalPrice: z.number().optional(),
  estimatedHours: z.number().optional(),
  originType: z.enum(["jump", "custom"]),
  jumpId: z.string().optional(),
});

const Projects = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [copilotFilter, setCopilotFilter] = useState("all");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<UserModel[]>([]);
  const [copilots, setCopilots] = useState<UserModel[]>([]);
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      copilotId: "",
      status: "planned",
      startDate: new Date(),
      estimatedEndDate: new Date(),
      totalPrice: 0,
      estimatedHours: 0,
      originType: "custom",
      jumpId: "",
    },
  });

  useEffect(() => {
    loadProjects();
    loadClients();
    loadCopilots();
    loadJumps();
  }, [currentUser]);

  useEffect(() => {
    if (editingProject) {
      form.reset({
        name: editingProject.name,
        description: editingProject.description || "",
        clientId: editingProject.clientId,
        copilotId: editingProject.copilotId,
        status: editingProject.status,
        startDate: new Date(editingProject.startDate),
        estimatedEndDate: new Date(editingProject.estimatedEndDate),
        totalPrice: editingProject.totalPrice || 0,
        estimatedHours: editingProject.estimatedHours || 0,
        originType: editingProject.originType,
        jumpId: editingProject.jumpId,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        clientId: "",
        copilotId: "",
        status: "planned",
        startDate: new Date(),
        estimatedEndDate: new Date(),
        totalPrice: 0,
        estimatedHours: 0,
        originType: "custom",
        jumpId: "",
      });
    }
  }, [editingProject, form]);

  useEffect(() => {
    applyFilters();
  }, [projects, searchTerm, statusFilter, clientFilter, copilotFilter]);

  const loadProjects = () => {
    const allProjects = getProjects();
    
    // Filter projects based on user role
    let filteredByRole = allProjects;
    if (currentUser && currentUser.role === 'client') {
      filteredByRole = allProjects.filter(project => project.clientId === currentUser.id);
    } else if (currentUser && currentUser.role === 'copilot') {
      filteredByRole = allProjects.filter(project => project.copilotId === currentUser.id);
    }
    
    setProjects(filteredByRole);
    setFilteredProjects(filteredByRole);
  };

  const loadClients = () => {
    const allClients = getUsersByRole('client');
    setClients(allClients);
  };

  const loadCopilots = () => {
    const allCopilots = getUsersByRole('copilot');
    setCopilots(allCopilots);
  };

  const loadJumps = () => {
    const allJumps = getJumps();
    setJumps(allJumps);
  };

  const applyFilters = () => {
    let result = projects;
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    if (clientFilter !== 'all') {
      result = result.filter(project => project.clientId === clientFilter);
    }
    
    if (copilotFilter !== 'all') {
      result = result.filter(project => project.copilotId === copilotFilter);
    }
    
    setFilteredProjects(result);
  };

  const handleCreateProject = (data: z.infer<typeof formSchema>) => {
    try {
      const newProject: Omit<Project, "id" | "createdAt"> = {
        name: data.name,
        description: data.description || "",
        clientId: data.clientId,
        copilotId: data.copilotId,
        status: data.status,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
        totalPrice: data.totalPrice || 0,
        estimatedHours: data.estimatedHours || 0,
        originType: data.originType,
        jumpId: data.jumpId
      };

      createProject(newProject);
      
      setProjects(prev => [...prev, newProject]);
      
      toast({
        title: "Proyecto creado",
        description: "El proyecto fue creado exitosamente",
      });
      
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = (data: z.infer<typeof formSchema>) => {
    if (!editingProject) return;
    
    try {
      const updatedProject = updateProject({
        ...editingProject,
        name: data.name,
        description: data.description || "",
        clientId: data.clientId,
        copilotId: data.copilotId,
        status: data.status,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
        totalPrice: data.totalPrice || 0,
        estimatedHours: data.estimatedHours || 0,
        originType: data.originType,
        jumpId: data.jumpId
      });
      
      setProjects(prev => 
        prev.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
      
      toast({
        title: "Proyecto actualizado",
        description: "El proyecto fue actualizado exitosamente",
      });
      
      setEditingProject(null);
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    try {
      deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (editingProject && editingProject.id === id) {
        setEditingProject(null);
      }
      
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto fue eliminado exitosamente",
      });
      
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el proyecto",
        variant: "destructive",
      });
    }
  };

  const copyApiKey = () => {
    if (currentUser?.apiKey) {
      navigator.clipboard.writeText(currentUser.apiKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="secondary">Planificado</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-600">En progreso</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Proyectos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los proyectos de la plataforma
            </p>
          </div>
          {currentUser?.role === 'admin' && activeTab === "list" && (
            <Button onClick={() => setActiveTab("create")}>
              <PlusCircle className="h-4 w-4 mr-2" /> Nuevo Proyecto
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Proyectos</TabsTrigger>
            {currentUser?.role === 'admin' && (
              <TabsTrigger value="create">Crear Proyecto</TabsTrigger>
            )}
            {editingProject && currentUser?.role === 'admin' && (
              <TabsTrigger value="edit">Editar Proyecto</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyectos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="planned">Planificado</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={clientFilter}
                  onValueChange={(value) => setClientFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={copilotFilter}
                  onValueChange={(value) => setCopilotFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Copiloto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los copilotos</SelectItem>
                    {copilots.map((copilot) => (
                      <SelectItem key={copilot.id} value={copilot.id}>{copilot.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Projects table */}
            <Card>
              <CardHeader>
                <CardTitle>Proyectos Disponibles</CardTitle>
                <CardDescription>
                  {filteredProjects.length} proyectos encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Copiloto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin Estimado</TableHead>
                        {currentUser?.role === 'admin' && (
                          <TableHead className="text-right">Acciones</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>
                            {clients.find(client => client.id === project.clientId)?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {copilots.find(copilot => copilot.id === project.copilotId)?.name || "N/A"}
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>
                            {new Date(project.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(project.estimatedEndDate).toLocaleDateString()}
                          </TableCell>
                          {currentUser?.role === 'admin' && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingProject(project);
                                    setActiveTab("edit");
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No se encontraron proyectos</h3>
                    <p className="text-muted-foreground mt-2">
                      Intenta cambiar los filtros o crea un nuevo proyecto.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser?.role === 'admin' && (
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Proyecto</CardTitle>
                  <CardDescription>Complete el formulario para crear un nuevo proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del proyecto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cliente" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="copilotId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Copiloto</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar copiloto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {copilots.map((copilot) => (
                                    <SelectItem key={copilot.id} value={copilot.id}>{copilot.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="planned">Planificado</SelectItem>
                                  <SelectItem value="in_progress">En progreso</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fecha de Inicio</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        new Date(field.value).toLocaleDateString("es-ES", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      ) : (
                                        <span>Seleccionar fecha</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <DatePicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={false}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Fecha de inicio del proyecto.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estimatedEndDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fecha de Fin Estimada</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        new Date(field.value).toLocaleDateString("es-ES", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      ) : (
                                        <span>Seleccionar fecha</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <DatePicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={false}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Fecha estimada de finalización del proyecto.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="totalPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio Total</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estimatedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horas Estimadas</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="originType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Origen</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar origen" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="jump">Jump</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.getValues("originType") === "jump" && (
                          <FormField
                            control={form.control}
                            name="jumpId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jump</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar Jump" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {jumps.map((jump) => (
                                      <SelectItem key={jump.id} value={jump.id}>{jump.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descripción detallada del proyecto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab("list")}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Crear Proyecto
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {currentUser?.role === 'admin' && (
            <TabsContent value="edit">
              {editingProject && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Proyecto</CardTitle>
                    <CardDescription>Modifica los detalles del proyecto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdateProject)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nombre del proyecto" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar cliente" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {clients.map((client) => (
                                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="copilotId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Copiloto</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar copiloto" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {copilots.map((copilot) => (
                                      <SelectItem key={copilot.id} value={copilot.id}>{copilot.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="planned">Planificado</SelectItem>
                                    <SelectItem value="in_progress">En progreso</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Inicio</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          new Date(field.value).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        ) : (
                                          <span>Seleccionar fecha</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={false}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Fecha de inicio del proyecto.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="estimatedEndDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Fin Estimada</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-[240px] pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          new Date(field.value).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        ) : (
                                          <span>Seleccionar fecha</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={false}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Fecha estimada de finalización del proyecto.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="totalPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Precio Total</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    {...field} 
                                    onChange={e => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="estimatedHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horas Estimadas</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0" 
                                    {...field} 
                                    onChange={e => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="originType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Origen</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar origen" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="jump">Jump</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.getValues("originType") === "jump" && (
                            <FormField
                              control={form.control}
                              name="jumpId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Jump</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Jump" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {jumps.map((jump) => (
                                        <SelectItem key={jump.id} value={jump.id}>{jump.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Descripción detallada del proyecto" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditingProject(null);
                              setActiveTab("list");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit">
                            Guardar Cambios
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Projects;
