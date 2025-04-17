
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, Filter, MoreHorizontal, Plus, Search, Trash, Edit } from 'lucide-react';
import { Project, Jump, User } from '@/lib/models';
import { getProjects, getJumpById, getUserById, getTasksByProjectId, createProject, updateProject, deleteProject, getUsers, getJumps } from '@/lib/storageService';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

// Project form schema
const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  clientId: z.string().min(1, "El cliente es requerido"),
  copilotId: z.string().min(1, "El copiloto es requerido"),
  status: z.enum(["planned", "in_progress", "completed"]),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  estimatedEndDate: z.string().min(1, "La fecha estimada es requerida"),
  totalPrice: z.number().min(1, "El precio debe ser mayor a 0"),
  estimatedHours: z.number().min(1, "Las horas deben ser mayor a 0"),
  originType: z.enum(["jump", "custom"]),
  jumpId: z.string().optional(),
});

const Projects = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [copilots, setCopilots] = useState<User[]>([]);
  const [jumps, setJumps] = useState<Jump[]>([]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      copilotId: "",
      status: "planned",
      startDate: new Date().toISOString().split("T")[0],
      estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      totalPrice: 0,
      estimatedHours: 0,
      originType: "custom",
      jumpId: undefined,
    },
  });

  // Watch the origin type to show/hide jump selection
  const originType = form.watch("originType");

  useEffect(() => {
    if (currentUser) {
      let projectList: Project[] = [];
      
      switch (currentUser.role) {
        case 'admin':
          projectList = getProjects();
          break;
        case 'copilot':
          projectList = getProjects().filter(p => p.copilotId === currentUser.id);
          break;
        case 'client':
          projectList = getProjects().filter(p => p.clientId === currentUser.id);
          break;
      }
      
      setProjects(projectList);
      setFilteredProjects(projectList);
      
      // Load users and jumps for forms
      setClients(getUsers().filter(user => user.role === 'client'));
      setCopilots(getUsers().filter(user => user.role === 'copilot'));
      setJumps(getJumps().filter(jump => jump.status === 'active'));
    }
  }, [currentUser]);

  useEffect(() => {
    let result = projects;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    setFilteredProjects(result);
  }, [searchTerm, statusFilter, projects]);

  useEffect(() => {
    if (editingProject) {
      form.reset({
        name: editingProject.name,
        description: editingProject.description,
        clientId: editingProject.clientId,
        copilotId: editingProject.copilotId,
        status: editingProject.status,
        startDate: new Date(editingProject.startDate).toISOString().split("T")[0],
        estimatedEndDate: new Date(editingProject.estimatedEndDate).toISOString().split("T")[0],
        totalPrice: editingProject.totalPrice,
        estimatedHours: editingProject.estimatedHours,
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
        startDate: new Date().toISOString().split("T")[0],
        estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        totalPrice: 0,
        estimatedHours: 0,
        originType: "custom",
        jumpId: undefined,
      });
    }
  }, [editingProject, form]);

  const handleCreateProject = (data: z.infer<typeof projectSchema>) => {
    try {
      const newProject = createProject({
        ...data,
        totalPrice: Number(data.totalPrice),
        estimatedHours: Number(data.estimatedHours),
      });
      
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

  const handleUpdateProject = (data: z.infer<typeof projectSchema>) => {
    if (!editingProject) return;
    
    try {
      const updatedProject = updateProject({
        ...editingProject,
        ...data,
        totalPrice: Number(data.totalPrice),
        estimatedHours: Number(data.estimatedHours),
      });
      
      setProjects(prev => 
        prev.map(proj => proj.id === updatedProject.id ? updatedProject : proj)
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
      setProjects(prev => prev.filter(proj => proj.id !== id));
      
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">Planificado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En progreso</Badge>;
      case 'completed':
        return <Badge>Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getProjectDetails = (project: Project) => {
    const client = getUserById(project.clientId);
    const copilot = getUserById(project.copilotId);
    const jump = project.jumpId ? getJumpById(project.jumpId) : null;
    const tasks = getTasksByProjectId(project.id);
    
    return {
      clientName: client?.name || 'Cliente desconocido',
      copilotName: copilot?.name || 'Copiloto desconocido',
      jumpName: jump?.name || 'Proyecto personalizado',
      tasksCount: tasks.length,
      completedTasksCount: tasks.filter(t => t.status === 'completed').length,
    };
  };

  const handleJumpChange = (jumpId: string) => {
    const selectedJump = jumps.find(j => j.id === jumpId);
    if (selectedJump) {
      form.setValue('totalPrice', selectedJump.basePrice);
      form.setValue('estimatedHours', selectedJump.customizationHours);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Proyectos</h1>
            {currentUser?.role !== 'client' && activeTab === "list" && (
              <Button onClick={() => setActiveTab("create")} className="bg-bloodRed hover:bg-red-800">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            {currentUser?.role === 'admin'
              ? 'Gestiona todos los proyectos de la plataforma'
              : currentUser?.role === 'copilot'
              ? 'Administra los proyectos asignados a ti'
              : 'Visualiza tus proyectos activos'}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="list">Lista de Proyectos</TabsTrigger>
              {(currentUser?.role !== 'client') && (
                <TabsTrigger value="create">Crear Proyecto</TabsTrigger>
              )}
              {editingProject && <TabsTrigger value="edit">Editar Proyecto</TabsTrigger>}
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
                    <SelectTrigger className="w-[180px] gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="planned">Planificado</SelectItem>
                      <SelectItem value="in_progress">En progreso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Projects list */}
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Proyectos</CardTitle>
                  <CardDescription>
                    {filteredProjects.length} proyectos encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredProjects.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            {currentUser?.role === 'admin' && (
                              <>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Copiloto</TableHead>
                              </>
                            )}
                            {currentUser?.role === 'client' && (
                              <TableHead>Copiloto</TableHead>
                            )}
                            {currentUser?.role === 'copilot' && (
                              <TableHead>Cliente</TableHead>
                            )}
                            <TableHead>Tipo</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Progreso</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProjects.map((project) => {
                            const details = getProjectDetails(project);
                            const progress = details.tasksCount > 0
                              ? Math.round((details.completedTasksCount / details.tasksCount) * 100)
                              : 0;
                              
                            return (
                              <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                {currentUser?.role === 'admin' && (
                                  <>
                                    <TableCell>{details.clientName}</TableCell>
                                    <TableCell>{details.copilotName}</TableCell>
                                  </>
                                )}
                                {currentUser?.role === 'client' && (
                                  <TableCell>{details.copilotName}</TableCell>
                                )}
                                {currentUser?.role === 'copilot' && (
                                  <TableCell>{details.clientName}</TableCell>
                                )}
                                <TableCell>{details.jumpName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDate(project.startDate)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(project.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-bloodRed"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {progress}%
                                    </span>
                                  </div>
                                </TableCell>
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
                                    {currentUser?.role !== 'client' && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteProject(project.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
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

              {/* Stats cards */}
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14 días</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duración promedio por proyecto
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredProjects.filter(p => p.status === 'in_progress').length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      De {filteredProjects.length} proyectos totales
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Completados</CardTitle>
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredProjects.filter(p => p.status === 'completed').length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Proyectos finalizados exitosamente
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
                              <FormLabel>Nombre del Proyecto</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del proyecto" {...field} />
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
                                  <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {originType === "jump" && (
                          <FormField
                            control={form.control}
                            name="jumpId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Jump</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    handleJumpChange(value);
                                  }} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar Jump" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {jumps.map(jump => (
                                      <SelectItem key={jump.id} value={jump.id}>
                                        {jump.name}
                                      </SelectItem>
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
                            <FormItem className={originType === "jump" ? "md:col-span-2" : ""}>
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descripción del proyecto" {...field} />
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
                                  {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>
                                      {client.name}
                                    </SelectItem>
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
                                  {copilots.map(copilot => (
                                    <SelectItem key={copilot.id} value={copilot.id}>
                                      {copilot.name}
                                    </SelectItem>
                                  ))}
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
                            <FormItem>
                              <FormLabel>Fecha de Inicio</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estimatedEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha Estimada de Finalización</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
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
                                  <SelectItem value="in_progress">En Progreso</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-3">
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

            <TabsContent value="edit">
              {editingProject && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Proyecto</CardTitle>
                    <CardDescription>Modifique los detalles del proyecto</CardDescription>
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
                                <FormLabel>Nombre del Proyecto</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar origen" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="jump">Jump</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {originType === "jump" && (
                            <FormField
                              control={form.control}
                              name="jumpId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Jump</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      handleJumpChange(value);
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Jump" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {jumps.map(jump => (
                                        <SelectItem key={jump.id} value={jump.id}>
                                          {jump.name}
                                        </SelectItem>
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
                              <FormItem className={originType === "jump" ? "md:col-span-2" : ""}>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
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
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar cliente" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {clients.map(client => (
                                      <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                      </SelectItem>
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
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar copiloto" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {copilots.map(copilot => (
                                      <SelectItem key={copilot.id} value={copilot.id}>
                                        {copilot.name}
                                      </SelectItem>
                                    ))}
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
                              <FormItem>
                                <FormLabel>Fecha de Inicio</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="estimatedEndDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha Estimada de Finalización</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
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
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="planned">Planificado</SelectItem>
                                    <SelectItem value="in_progress">En Progreso</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end gap-3">
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
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              if (editingProject) {
                                handleDeleteProject(editingProject.id);
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                          <Button type="submit">
                            Actualizar
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

export default Projects;
