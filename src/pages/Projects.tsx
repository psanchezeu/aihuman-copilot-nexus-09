import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  getAllProjects, 
  getProjectsForClient, 
  getProjectsForCopilot,
  getAllClients,
  getAllCopilots,
  getAllJumps,
  createProjectSafe,
  updateProjectSafe,
  deleteProjectSafe,
  getProjectWithDetails
} from "@/lib/dataService";
import { Project, User, Jump } from "@/lib/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search, Package, CalendarIcon as CalendarLucideIcon, CalendarClock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ActionButtons from "@/components/shared/ActionButtons";

// Project form dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Project schema
const projectSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  clientId: z.string().min(1, "El cliente es requerido"),
  copilotId: z.string().min(1, "El copiloto es requerido"),
  status: z.enum(["planned", "in_progress", "completed"]),
  startDate: z.date(),
  estimatedEndDate: z.date(),
  totalPrice: z.number().min(0, "El precio no puede ser negativo"),
  estimatedHours: z.number().min(0, "Las horas no pueden ser negativas"),
  originType: z.enum(["jump", "custom"]),
  jumpId: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const Projects = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [copilots, setCopilots] = useState<User[]>([]);
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedJump, setSelectedJump] = useState<Jump | null>(null);

  // Form setup
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      copilotId: "",
      status: "planned",
      startDate: new Date(),
      estimatedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      totalPrice: 0,
      estimatedHours: 0,
      originType: "custom",
    },
  });

  useEffect(() => {
    loadProjects();
    loadUsers();
    loadJumps();
  }, [currentUser]);

  useEffect(() => {
    if (editingProject) {
      form.reset({
        name: editingProject.name,
        description: editingProject.description,
        clientId: editingProject.clientId,
        copilotId: editingProject.copilotId,
        status: editingProject.status,
        startDate: new Date(editingProject.startDate),
        estimatedEndDate: new Date(editingProject.estimatedEndDate),
        totalPrice: editingProject.totalPrice,
        estimatedHours: editingProject.estimatedHours,
        originType: editingProject.originType,
        jumpId: editingProject.jumpId,
      });

      if (editingProject.jumpId) {
        const jump = jumps.find(j => j.id === editingProject.jumpId);
        setSelectedJump(jump || null);
      } else {
        setSelectedJump(null);
      }
    } else {
      form.reset({
        name: "",
        description: "",
        clientId: "",
        copilotId: "",
        status: "planned",
        startDate: new Date(),
        estimatedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        totalPrice: 0,
        estimatedHours: 0,
        originType: "custom",
      });
      setSelectedJump(null);
    }
  }, [editingProject, form, jumps]);

  // Watch for originType and jumpId changes to update price and hours
  const originType = form.watch("originType");
  const jumpId = form.watch("jumpId");

  useEffect(() => {
    if (originType === "jump" && jumpId) {
      const selectedJump = jumps.find(j => j.id === jumpId);
      
      if (selectedJump) {
        form.setValue("totalPrice", selectedJump.basePrice);
        form.setValue("estimatedHours", selectedJump.customizationHours);
        setSelectedJump(selectedJump);
      }
    }
  }, [originType, jumpId, jumps, form]);

  const loadProjects = () => {
    if (currentUser) {
      let userProjects: Project[] = [];
      
      if (currentUser.role === 'admin') {
        userProjects = getAllProjects();
      } else if (currentUser.role === 'copilot') {
        userProjects = getProjectsForCopilot(currentUser.id);
      } else if (currentUser.role === 'client') {
        userProjects = getProjectsForClient(currentUser.id);
      }
      
      setProjects(userProjects);
    }
  };

  const loadUsers = () => {
    setClients(getAllClients());
    setCopilots(getAllCopilots());
  };

  const loadJumps = () => {
    setJumps(getAllJumps());
  };

  // Filter projects based on search query and status
  const filteredProjects = projects.filter(
    (project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleCreateProject = (data: ProjectFormValues) => {
    try {
      const newProject = createProjectSafe({
        ...data,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
      });
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      
      toast({
        title: "Proyecto creado",
        description: `${data.name} ha sido creado exitosamente`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      let errorMessage = "No se pudo crear el proyecto";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleUpdateProject = (data: ProjectFormValues) => {
    if (!editingProject) return;
    
    try {
      const updatedProject = updateProjectSafe({
        ...editingProject,
        ...data,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
      });
      
      setProjects(prevProjects => 
        prevProjects.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
      
      toast({
        title: "Proyecto actualizado",
        description: `${data.name} ha sido actualizado exitosamente`,
      });
      
      setEditingProject(null);
      setIsDialogOpen(false);
    } catch (error) {
      let errorMessage = "No se pudo actualizar el proyecto";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      deleteProjectSafe(projectId);
      
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado exitosamente",
      });
    } catch (error) {
      let errorMessage = "No se pudo eliminar el proyecto";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleViewProject = (projectId: string) => {
    const project = getProjectWithDetails(projectId);
    
    if (project) {
      toast({
        title: "Ver detalles del proyecto",
        description: `Detalles de ${project.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo encontrar el proyecto",
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ProjectFormValues) => {
    if (editingProject) {
      handleUpdateProject(data);
    } else {
      handleCreateProject(data);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">Planificado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En progreso</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Table columns definition
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "clientId",
      header: "Cliente",
      cell: ({ row }) => {
        const project = row.original;
        const client = clients.find(c => c.id === project.clientId);
        
        return client ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{client.name}</span>
          </div>
        ) : (
          <span>Cliente no encontrado</span>
        );
      },
    },
    {
      accessorKey: "copilotId",
      header: "Copiloto",
      cell: ({ row }) => {
        const project = row.original;
        const copilot = copilots.find(c => c.id === project.copilotId);
        
        return copilot ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={copilot.avatar} alt={copilot.name} />
              <AvatarFallback>{copilot.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{copilot.name}</span>
          </div>
        ) : (
          <span>Copiloto no encontrado</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "startDate",
      header: "Fecha inicio",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CalendarLucideIcon className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(row.getValue("startDate")).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Precio",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }).format(row.getValue("totalPrice"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        // Only admins can edit and delete projects, or copilots can update their own projects
        const canEdit = currentUser?.role === "admin" || 
                       (currentUser?.role === "copilot" && currentUser.id === row.original.copilotId);
        const canDelete = currentUser?.role === "admin";
        
        return (
          <ActionButtons
            onView={() => handleViewProject(row.original.id)}
            onEdit={canEdit ? () => handleEditProject(row.original) : undefined}
            onDelete={canDelete ? () => handleDeleteProject(row.original.id) : undefined}
            hideEdit={!canEdit}
            hideDelete={!canDelete}
            itemName="proyecto"
          />
        );
      },
    },
  ];

  const isAdmin = currentUser?.role === "admin";

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Proyectos</h1>
            <p className="text-muted-foreground">
              {currentUser?.role === "admin" 
                ? "Gestiona todos los proyectos de la plataforma" 
                : currentUser?.role === "copilot"
                ? "Administra los proyectos asignados a ti"
                : "Visualiza tus proyectos contratados"}
            </p>
          </div>
          {(currentUser?.role === "admin") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProject(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo proyecto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject 
                      ? "Modifica los detalles del proyecto" 
                      : "Completa el formulario para crear un nuevo proyecto"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del proyecto</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del proyecto" {...field} />
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
                                  <SelectValue placeholder="Selecciona el estado" />
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
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Input placeholder="Descripción del proyecto" {...field} />
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
                                  <SelectValue placeholder="Selecciona un cliente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients.map((client) => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name} - {client.company || "Sin empresa"}
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
                                  <SelectValue placeholder="Selecciona un copiloto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {copilots.map((copilot) => (
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
                        name="originType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de proyecto</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo de origen" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="jump">Basado en Jump</SelectItem>
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
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Jump" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {jumps.map((jump) => (
                                    <SelectItem key={jump.id} value={jump.id}>
                                      {jump.name} - {jump.basePrice}€
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
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha de inicio</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "P")
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setDate(new Date().getDate() - 1))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="estimatedEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha estimada de fin</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "P")
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < form.getValues("startDate")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio total (€)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                                disabled={originType === "jump" && !!jumpId}
                              />
                            </FormControl>
                            <FormDescription>
                              {originType === "jump" && selectedJump ? "Precio base del Jump seleccionado" : ""}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="estimatedHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horas estimadas</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                                disabled={originType === "jump" && !!jumpId}
                              />
                            </FormControl>
                            <FormDescription>
                              {originType === "jump" && selectedJump ? "Horas de personalización del Jump seleccionado" : ""}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingProject ? "Guardar cambios" : "Crear proyecto"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="planned">Planificados</SelectItem>
              <SelectItem value="in_progress">En progreso</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProjects.length > 0 ? (
              <DataTable 
                columns={columns} 
                data={filteredProjects} 
                searchKey="name"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No se encontraron proyectos</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || statusFilter !== "all"
                    ? "No hay resultados para tu búsqueda" 
                    : "Aún no hay proyectos registrados"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Projects;
