import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { PlusCircle, Search, Package, Calendar as CalendarLucideIcon, CalendarClock } from "lucide-react";
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
  description: z.string().optional(),
  clientId: z.string().uuid("Cliente inválido"),
  copilotId: z.string().uuid("Copiloto inválido"),
  status: z.enum(["planned", "in_progress", "completed"]),
  startDate: z.date(),
  estimatedEndDate: z.date(),
  totalPrice: z.number().optional(),
  estimatedHours: z.number().optional(),
  originType: z.enum(["jump", "custom"]),
  jumpId: z.string().uuid("Jump inválido").optional().nullable(),
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
      estimatedEndDate: new Date(),
      totalPrice: 0,
      estimatedHours: 0,
      originType: "custom",
      jumpId: null,
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
        totalPrice: editingProject.totalPrice,
        estimatedHours: editingProject.estimatedHours,
        originType: editingProject.originType,
        jumpId: editingProject.jumpId || null,
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
        jumpId: null,
      });
    }
  }, [editingProject, form]);

  const loadProjects = () => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        setProjects(getAllProjects());
      } else if (currentUser.role === "client") {
        setProjects(getProjectsForClient(currentUser.id));
      } else if (currentUser.role === "copilot") {
        setProjects(getProjectsForCopilot(currentUser.id));
      }
    }
  };

  const loadClients = () => {
    setClients(getAllClients());
  };

  const loadCopilots = () => {
    setCopilots(getAllCopilots());
  };

  const loadJumps = () => {
    setJumps(getAllJumps());
  };

  const handleCreateProject = (data: ProjectFormValues) => {
    try {
      createProjectSafe({
        ...data,
        clientId: data.clientId,
        copilotId: data.copilotId,
        status: data.status,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
        originType: data.originType,
        jumpId: data.jumpId === null ? undefined : data.jumpId,
      });
      
      loadProjects();
      
      toast({
        title: "Proyecto creado",
        description: `${data.name} ha sido creado exitosamente`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el proyecto. Inténtalo de nuevo.",
      });
    }
  };

  const handleUpdateProject = (data: ProjectFormValues) => {
    if (!editingProject) return;
    
    try {
      updateProjectSafe({
        ...editingProject,
        name: data.name,
        description: data.description,
        clientId: data.clientId,
        copilotId: data.copilotId,
        status: data.status,
        startDate: data.startDate.toISOString(),
        estimatedEndDate: data.estimatedEndDate.toISOString(),
        totalPrice: data.totalPrice || 0,
        estimatedHours: data.estimatedHours || 0,
        originType: data.originType,
        jumpId: data.jumpId === null ? undefined : data.jumpId,
      });
      
      loadProjects();
      
      toast({
        title: "Proyecto actualizado",
        description: `${data.name} ha sido actualizado exitosamente`,
      });
      
      setEditingProject(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el proyecto. Inténtalo de nuevo.",
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      deleteProjectSafe(projectId);
      
      loadProjects();
      
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
    const projectDetails = getProjectWithDetails(projectId);
    
    if (projectDetails) {
      // Display project details in a more detailed view or modal
      toast({
        title: "Detalles del proyecto",
        description: `Mostrando detalles del proyecto ${projectDetails.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los detalles del proyecto",
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

  // Table columns definition
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{project.name}</p>
              <p className="text-sm text-muted-foreground">{project.description || "Sin descripción"}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "clientId",
      header: "Cliente",
      cell: ({ row }) => {
        const client = clients.find(c => c.id === row.original.clientId);
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={client?.avatar} alt={client?.name} />
              <AvatarFallback>{client?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{client?.name || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "copilotId",
      header: "Copiloto",
      cell: ({ row }) => {
        const copilot = copilots.find(c => c.id === row.original.copilotId);
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={copilot?.avatar} alt={copilot?.name} />
              <AvatarFallback>{copilot?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{copilot?.name || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <span>{row.original.status}</span>
      ),
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
      header: "Precio total",
      cell: ({ row }) => (
        <span>{row.original.totalPrice || "No especificado"}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isAdmin = currentUser?.role === "admin";
        
        return (
          <ActionButtons
            onView={() => handleViewProject(row.original.id)}
            onEdit={isAdmin ? () => handleEditProject(row.original) : undefined}
            onDelete={isAdmin ? () => handleDeleteProject(row.original.id) : undefined}
            hideEdit={!isAdmin}
            hideDelete={!isAdmin}
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
                ? "Gestiona todos los proyectos registrados en la plataforma" 
                : "Proyectos asignados a ti"}
            </p>
          </div>
          {(currentUser?.role === "admin" || currentUser?.role === "client") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProject(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir proyecto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Editar Proyecto" : "Añadir Proyecto"}
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
                        name="description"
                        render={({ field }) => (
                          <FormItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un cliente" />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un copiloto" />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un estado" />
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
                                    <CalendarLucideIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date()
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
                                    <CalendarLucideIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
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
                            <FormLabel>Precio total</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Precio total del proyecto" {...field} />
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
                            <FormLabel>Horas estimadas</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Horas estimadas del proyecto" {...field} />
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
                            <FormLabel>Tipo de origen</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un tipo de origen" />
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
                      {form.watch("originType") === "jump" && (
                        <FormField
                          control={form.control}
                          name="jumpId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jump</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || undefined}
                                defaultValue={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Jump" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={null}>Ninguno</SelectItem>
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

        <Card>
          <CardHeader>
            <CardTitle>Listado de proyectos</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cliente o copiloto..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <DataTable 
                columns={columns} 
                data={projects} 
                searchKey="name"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No se encontraron proyectos</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
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
